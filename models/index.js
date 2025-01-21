// models/index.js
import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
import UserModel from './user.js';
import LoginModel from './login.js';

db.User = UserModel(sequelize);
db.Login = LoginModel(sequelize);

// Define relationships
// db.User.associate(db);
// db.Login.associate(db);

export default db;
