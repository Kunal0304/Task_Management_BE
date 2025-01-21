import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const ContactDetail = sequelize.define('ContactDetail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Username is required and cannot be empty."
        },
        len: {
          args: [3, 50],
          msg: "Username must be between 3 and 50 characters long."
        },
      },
    },
    mobile_no: {
      type: DataTypes.BIGINT,
      allowNull: false,
      validate: {
        isInt: {
          msg: "Mobile number must contain only digits."
        },
        len: {
          args: [10, 10],
          msg: "Mobile number must be exactly 10 digits long."
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: "Please provide a valid email address."
        },
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

//   ContactDetail.associate = (models) => {
//     // Define associations here
//   };

  return ContactDetail;
};
