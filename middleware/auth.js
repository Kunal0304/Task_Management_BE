import pkg from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import appConfig from '../config/config.js';
import logger from '../apis/utils/logger.js';
import db from '../models/index.js';

const { sign, verify } = pkg;

const auth = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
  
    const token = authHeader.replace('Bearer ', '');
  
    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      const user = await db.User.findByPk(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }
  
      const loginRecord = await db.Login.findOne({
        where: {
          userId: user.id,
          verified: true
        },
        order: [['created_at', 'DESC']]
      });
  
      if (!loginRecord) {
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
      }
  
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  };

  const createNewToken = (data) => {
    // const accessToken = sign(data, process.env.JWT_SECRET, {
    //   expiresIn: process.env.JWT_EXPIRES_IN,
    // });
    // const refreshToken = sign(data, process.env.REFRESH_TOKEN_SECRET, {
    //   expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    // });
    const accessToken = sign(data, process.env.JWT_SECRET); // No expiration
    const refreshToken = sign(data, process.env.REFRESH_TOKEN_SECRET); // No expiration
    return {
      accessToken,
      refreshToken,
    };
  };
  
  const verifyToken = async (token) => {
    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      logger.error(`error: ${error}`);
      return false;
    }
  };
  
  const hashValue = (value) => {
    try {
      const salt = bcrypt.genSaltSync(15);
      const stringValue = String(value);
      return bcrypt.hashSync(stringValue, salt);
    } catch (error) {
      logger.error('Error in hashValue:', error);
    }
  };

const createTemporaryToken = (data) => {
  const tempToken = sign(data, appConfig.auth.temp_token, {
    expiresIn: appConfig.auth.temp_token_expires,
  });
  return {
    tempToken,
  };
};

export { createNewToken, auth, verifyToken, hashValue, createTemporaryToken };
