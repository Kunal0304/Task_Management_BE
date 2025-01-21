import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Login = sequelize.define('Login', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      validate: {
        notNull: {
          msg: 'User ID is required.',
        },
        isInt: {
          msg: 'User ID must be an integer.',
        },
      },
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    otpExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'Verified status must be true or false.',
        },
      },
    },
    is_obsolate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      validate: {
        isIn: {
          args: [[true, false]],
          msg: 'Obsolate status must be true or false.',
        },
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
      validate: {
        isDate: {
          msg: 'Creation date must be a valid date.',
        },
      },
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
      validate: {
        isDate: {
          msg: 'Update date must be a valid date.',
        },
      },
    },
  }, {
    timestamps: false,
    tableName: 'Logins',
  });

  Login.associate = (models) => {
    Login.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Login;
};
