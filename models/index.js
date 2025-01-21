// models/index.js
import { Sequelize } from "sequelize";
import config from "../config/config.js";

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
import UserModel from "./user.js";
import InvestmentModel from "./investment.js";
import TransactionModel from "./transaction.js";
import LoginModel from "./login.js";
import withdrawRequestModal from "./withdrawRequest.js";
import ContactDetailModel from "./contactDetail.js";

db.User = UserModel(sequelize);
db.Investment = InvestmentModel(sequelize);
db.Transaction = TransactionModel(sequelize);
db.Login = LoginModel(sequelize);
db.Withdraw = withdrawRequestModal(sequelize);
db.ContactDetail = ContactDetailModel(sequelize);

// Define relationships
db.User.associate(db);
db.Investment.associate(db);
db.Transaction.associate(db);
db.Login.associate(db);
db.Withdraw.associate(db);
// db.ContactDetail.associate(db);

export default db;
