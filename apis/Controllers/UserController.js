import { Sequelize } from 'sequelize';
import db from '../../models/index.js';

const createUser = async (req, res) => {
  try {
    const { mobile_no,email, config, ...otherData } = req.body;

    const existingUser = await db.User.findOne({ where: { mobile_no, email } });

    if (existingUser) {
      return res.status(400).json({ error: 'Mobile number or email  already exists' });
    }

        // Set `ekyc_verified` to "pending" if `ekyc` is provided
        const userData = {
          mobile_no,
          email,
          config,
          ...otherData,
          ekyc_verified: config.ekyc ? 'pending' : 'apply',
          nominee_verified: config.nominee ?  'pending' : 'apply',
          bank_verified: config.bank_details ?  'pending' : 'apply',
        };

    const user = await db.User.create(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errorMessage = error.errors[0].message;
      res.status(400).json({ error: errorMessage });
    } else {
    res.status(500).json({ error: error.message });
    }
  }
}

const createBulkUsers = async (req, res) => {
  try {
    const users = await db.User.bulkCreate(req.body);
    res.status(201).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: {
        is_obsolate: false,
      },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getUserById = async (req, res) => {
  try {
    const user = await db.User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const updateUserById = async (req, res) => {
  try {
    const { mobile_no, config = {}, ...otherData } = req.body;
    // Fetch the user by ID
    const user = await db.User.findByPk(req.params.id);

    if (!user) {
      return res.status(201).json({ message: 'User not found' });
    }

    // Get existing config values from the user
    const userConfig = user.config || {};

    // Compare and update verification statuses only if the data is provided in the payload and differs
    let ekycVerified = user.ekyc_verified;
    let nomineeVerified = user.nominee_verified;
    let bankVerified = user.bank_verified;

    if (config.ekyc !== undefined) {
      const userEKYC = JSON.stringify(userConfig.ekyc);
      const incomingEKYC = JSON.stringify(config.ekyc);

      if (incomingEKYC !== userEKYC) {
        ekycVerified = 'pending';
      }
    }

    if (config.nominee !== undefined) {
      const userNominee = JSON.stringify(userConfig.nominee);
      const incomingNominee = JSON.stringify(config.nominee);

      if (incomingNominee !== userNominee) {
        nomineeVerified = 'pending';
      }
    }

    if (config.bank_details !== undefined) {
      const userBankDetails = JSON.stringify(userConfig.bank_details);
      const incomingBankDetails = JSON.stringify(config.bank_details);

      if (incomingBankDetails !== userBankDetails) {
        bankVerified = 'pending';
      }
    }

    // Construct the updated user data
    const userData = {
      mobile_no,
      config,
      ...otherData,
      ekyc_verified: config.ekyc !== undefined ? ekycVerified : user.ekyc_verified,
      nominee_verified: config.nominee !== undefined ? nomineeVerified : user.nominee_verified,
      bank_verified: config.bank_details !== undefined ? bankVerified : user.bank_verified,
    };

    // Update the user in the database
    const [updated] = await db.User.update(userData, {
      where: { id: req.params.id },
    });
    if (updated) {
      // Fetch the updated user
      const updatedUser = await db.User.findByPk(req.params.id);

      // Convert to JSON and remove the password field
      const userWithoutPassword = updatedUser.toJSON();
      delete userWithoutPassword.password;

      res.json(userWithoutPassword);
    } else {
      res.status(201).json({ message: 'User not found or no change in this form' });
    }
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const errorMessage = error.errors[0].message;
      res.status(400).json({ error: errorMessage });
    } else {
    res.status(500).json({ error: error.message });
    }
  }
}

const updateUserConfigKey = async (req, res) => {
  const userId = req.user.id;
  const { name, value } = req.body;

  try {
    // Fetch the user by ID
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert the value to a JSON string
    const convertString = JSON.stringify(value);

    // Get existing config values
    const userConfig = user.config || {};
    const userEKYC = JSON.stringify(userConfig.ekyc) || undefined;
    const userBankDetails = JSON.stringify(userConfig.bank_details) || undefined;
    const userNominee = JSON.stringify(userConfig.nominee) || undefined;

    // Set verification status to 'pending' if the value matches
    if (convertString === userEKYC || name === 'ekyc') {
      user.ekyc_verified = 'pending';
    }
    if (convertString === userBankDetails || name === 'bank_details') {
      user.bank_verified = 'pending';
    }
    if (convertString === userNominee || name === 'nominee') {
      user.nominee_verified = 'pending';
    }

    // Update or add the specific config key
    await db.User.update(
      {
        config: Sequelize.fn('JSON_SET', Sequelize.col('config'), `$.${name}`, Sequelize.literal(`CAST('${JSON.stringify(value)}' AS JSON)`)),
      },
      {
        where: {
          id: userId,
        },
      }
    );

    // Save the updated user
    await user.save();
    await user.checkAndUpdateRole();

    res.status(200).json({ message: `Updated config key '${name}' for user with ID ${userId}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteUserById = async (req, res) => {
  try {
    const [deleted] = await db.User.update({is_obsolate: true}, {
      where: { id: req.params.id,
        is_obsolate: false
       }
    });
    if (deleted) {
      res.status(200).json({message: 'User Deleted Successfully'});
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const getUsersByRole = async (req, res) => {
  try {
    const users = await db.User.findAll({
      where: { role: req.params.role, is_obsolate: false }
    });

    const role = req.params.role
    if (role === 'employee' && users.length === 0 || role === 'lead' && users.length === 0) {
      return res.json([]);
    }
    else if (users.length === 0) {
      return res.status(204).json({ error: 'No users found' });
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const verifyLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value } = req.body;

    const lead = await db.User.findByPk(id);
    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    switch (type) {
      case 'nominee_verified':
        lead.nominee_verified = value;
        break;
      case 'ekyc_verified':
        lead.ekyc_verified = value;
        break;
      case 'bank_verified':
        lead.bank_verified = value;
        break;
      default:
        return res.status(400).json({ error: 'Invalid verification type' });
    }

    await lead.save();
    await lead.checkAndUpdateRole();

    res.json({ message: `${type.charAt(0).toUpperCase() + type.slice(1)} verified successfully` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export { createUser,createBulkUsers,updateUserConfigKey, getAllUsers,verifyLead, getUserById, getUsersByRole, updateUserById, deleteUserById}
