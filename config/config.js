import dotenv from 'dotenv';
dotenv.config();

const getConfig = () => {
  const env = process.env.NODE_ENV || 'dev';

  const config = {
    dev: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.PORT || 3306,
      dialect: 'mysql',
    },
    test: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME_TEST,
      host: process.env.DB_HOST,
      port: process.env.PORT,
      dialect: 'mysql',
    },
    prod: {
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: process.env.PORT,
      dialect: 'mysql',
      FAST_2_SMS_API_KEY: process.env.FAST_2_SMS_API_KEY,
    },
  };

  return config[env];
};

export default getConfig();
