import db from '../../models/index.js';
import { Op } from 'sequelize';
import { createNewToken  } from '../../middleware/auth.js';
// import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import processRequest from '../../middleware/processRequest.js';
import nodemailer from 'nodemailer';

function generateOTP(length = 5) {
  const otp = crypto.randomInt(0, Math.pow(10, length)).toString();
  return otp.padStart(length, '0');
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or use any SMTP service you prefer
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const requestEmailLoginOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in the Login table with verified as false
    await db.Login.create({
      userId: user.id,
      otp,
      verified: false,
    });

    // Send OTP to user's email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Login OTP',
      text: `Your password Login OTP is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

      res.json({ message: 'OTP sent to your email',userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOtpByEmail = async (req, res) => {
  const { userId, otp, device } = req.body;
  try {

    const loginRecord = await db.Login.findOne({
      where: { userId, otp, verified: false },
    });

    if (!loginRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isRequestVerified = processRequest(
      device,
      user.role
    );
    if (!isRequestVerified) {
      return res.status(404).json({ error: 'Invalid source or role combination' });
    }


    // res.json({ message: `OTP sent successfully`, otp });

    // Extract necessary fields from the user object
    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile_no: user.mobile_no,
      role: user.role // Include any other fields you need in the token
    };

    // Generate JWT token
    const { accessToken, refreshToken } = createNewToken(userPayload);

        // Mark OTP as used
        await loginRecord.update({ verified: true })

    res.json({ message: 'OTP verified successfully',token: { accessToken, refreshToken }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

 const requestEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store OTP in the Login table with verified as false
    await db.Login.create({
      userId: user.id,
      otp,
      verified: false,
    });

    // Send OTP to user's email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is ${otp}`,
    };

    await transporter.sendMail(mailOptions);

      res.json({ message: 'OTP sent to your email',userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const requestRegisterEmailOtp = async (req, res) => {
  const { email } = req.body;

  try {

    // Generate OTP
    const otp = generateOTP();
    const existingUser = await db.User.findOne({ where: { email } });

  if (existingUser) {
     return res.json({ message: 'This mail already exist!'});
    }
    const getUser = await db.User.findOne({ where: { email: 'register@triangleinvestment.com' } });

    // Store OTP in the Login table with verified as false
    if (getUser) {
    await db.Login.create({
      userId: getUser.id,
      otp,
      verified: false,
    });

    // Send OTP to user's email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is ${otp}`,
    };
    
    await transporter.sendMail(mailOptions);
   return res.json({ message: 'OTP sent to your email'});
  }
  return res.json({ message: 'register mail not exist in DB'});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOtpAPIs = async (req, res) => {
  const { mobile_no, otp, device } = req.body;
  try {
    // Find user by mobile number
    const user = await db.User.findOne({ where: { mobile_no } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isRequestVerified = processRequest(
      device,
      user.role
    );
    if (!isRequestVerified) {
      return res.status(404).json({ error: 'Invalid source or role combination' });
    }

    const data = await db.Login.create({
      userId: user.id,
      otp,
      verified: true,
    });
    console.log(`OTP for ${data}: ${otp}`);
    // res.json({ message: `OTP sent successfully`, otp });

    // Extract necessary fields from the user object
    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile_no: user.mobile_no,
      role: user.role // Include any other fields you need in the token
    };

    // Generate JWT token
    const { accessToken, refreshToken } = createNewToken(userPayload);

    res.json({ message: 'OTP verified successfully',token: { accessToken, refreshToken }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const RequestOtp = async (req, res) => {
  const { mobile_no } = req.body;
  try {
    // Find user by mobile number
    const user = await db.User.findOne({ where: { mobile_no } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP and expiry time
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    // Save OTP to the Login table
    await db.Login.create({
      userId: user.id,
      otp,
      otpExpiry,
      verified: false,
    });
    console.log(`OTP for ${mobile_no}: ${otp}`);
    res.json({ message: `OTP sent successfully`, otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const verifyOtp = async (req, res) => {
  const { mobile_no, otp, device } = req.body;
  try {
    // Find user by mobile number
    const user = await db.User.findOne({ where: { mobile_no } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isRequestVerified = processRequest(
      device,
      user.role
    );
    if (!isRequestVerified) {
      return res.status(404).json({ error: 'Invalid source or role combination' });
    }

    // Find the OTP record
    const loginRecord = await db.Login.findOne({
      where: {
        userId: user.id,
        otp,
        otpExpiry: { [Op.gt]: new Date() },
        verified: false
      }
    });

    if (!loginRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as verified
    loginRecord.verified = true;
    await loginRecord.save();

    // Extract necessary fields from the user object
    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile_no: user.mobile_no,
      role: user.role // Include any other fields you need in the token
    };

    // Generate JWT token
    const { accessToken, refreshToken } = createNewToken(userPayload);

    res.json({ message: 'OTP verified successfully',token: { accessToken, refreshToken }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const loginWithPassword = async (req, res) => {
  const { email, password, device } = req.body;
  try {
    // Find user by mobile number or email
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const isRequestVerified = processRequest(
      device,
      user.role
    );
    if (!isRequestVerified) {
      return res.status(400).json({ error: 'Invalid source or role combination' });
    }
        // Save OTP to the Login table
        await db.Login.create({
          userId: user.id,
          verified: true
        });

    // Extract necessary fields from the user object
    const userPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile_no: user.mobile_no,
      role: user.role,
    };

    // Generate JWT token
    const { accessToken, refreshToken } = createNewToken(userPayload);

    res.json({ message: 'Login successful', token: {accessToken, refreshToken }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  
  try {
    // Find user by ID
    const user = await db.User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    // const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (currentPassword !== user.password) {
      return res.status(401).json({ error: 'Invalid current password' });
    }

    // Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await user.update({ password: newPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { userId, otp, newPassword } = req.body;

  try {
    // Find OTP entry in the Login table
    const loginRecord = await db.Login.findOne({
      where: { userId, otp, verified: false },
    });

    if (!loginRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Hash new password
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.update({ password: newPassword });

    // Mark OTP as used
    await loginRecord.update({ verified: true });

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const logout = async (req, res) => {
  const authUser = req.user
  try {
    const user = await db.User.findByPk(authUser.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const loginRecord = await db.Login.findOne({
      where: {
        userId: user.id,
        verified: true
      },
      order: [['created_at', 'DESC']]
    });

    if (!loginRecord) {
      return res.status(400).json({ error: 'Login session not found' });
    }

    loginRecord.verified = false;
    loginRecord.is_obsolate = true;
    await loginRecord.save();

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ error: error.message });
  }
};


// mobile apis
const mobileLogin = async (req, res) => {
  const { mobile_no } = req.body;
  console.log(req.body);
  try {
    if (mobile_no?.length !== 10) {
      return res
        .status(400)
        .json({ error: "Mobile number length should be equal to 10" });
    }
    // Generate OTP and expiry time
    const otp = generateOTP();
    // const otpExpiry = new Date(Date.now() + 10 * 60000); // OTP valid for 10 minutes

    await db.OTP.create({
      mobile_no: mobile_no,
      otp: otp,
      is_used: false,
    });

    res.json({ message: `OTP sent successfully`, otp });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyMobileOtp = async (req, res) => {
  const { mobile_no, otp } = req.body;
  try {
    // Find user by mobile number
    const user = await db.OTP.findOne({ where: { mobile_no } });
    if (!user) {
      return res.status(400).json({ error: "Wrong mobile number" });
    }

    if (
      user?.mobile_no == mobile_no &&
      user?.otp == otp &&
      user?.is_used == false
    ) {
      user.set({
        is_used: true,
      });

      await user.save();

      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(404).json({ error: "OTP not verified" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const registerUser = async (req, res) => {
  try {
    const { email, password, mobile_no, otp, ...userData } = req.body;

    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ error: 'email already exists' });
    }

    const getUser = await db.User.findOne({ where: { email: 'register@triangleinvestment.com' } });


        // Find the OTP record
        const loginRecord = await db.Login.findOne({
          where: {
            userId: getUser.id,
            otp,
            verified: false
          }
        });
    
        if (!loginRecord) {
          return res.status(400).json({ error: 'Invalid or expired OTP' });
        }
    
        // Mark OTP as verified
        loginRecord.verified = true;
        await loginRecord.save();

    // Create a new user with the hashed password
    const user = await db.User.create({
      ...userData,
      mobile_no,
      email,
      password: password,
    });
    const data = {
      id: user.id,
      username: user.username,
      email: user.email,
      mobile_no: user.mobile_no,
      role: user.role
    }
    
    res.status(201).json(data);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errorMessage = error.errors[0].message;
      res.status(400).json({ error: errorMessage });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};


export { RequestOtp,verifyOtpAPIs,requestRegisterEmailOtp,requestEmailOtp,verifyOtpByEmail,requestEmailLoginOtp,changePassword,resetPassword, verifyOtp, logout, mobileLogin, verifyMobileOtp, registerUser, loginWithPassword };
