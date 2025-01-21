import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Withdraw = sequelize.define('Withdraw', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Ensure this matches your Users table
        key: 'id',
      },
      validate: {
        isInt: {
          msg: 'User ID must be an integer.',
        },
      },
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Withdraw amount must be an integer.',
        },
        min: {
          args: [0],
          msg: 'Withdraw amount must be a positive integer.',
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'rejected', 'approved']],
          msg: 'Status must be pending, rejected, or approved',
        },
        notEmpty: {
          msg: 'Status cannot be empty.',
        },
      },
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Date cannot be empty.',
        },
        isDate: {
          msg: 'Date must be a valid date format.',
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
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Type cannot be empty.',
        },
        isIn: {
          args: [['interest', 'capital']],
          msg: 'Type must be either interest or capital.',
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
    tableName: 'Withdraws',
  });

  // Define associations if any
  Withdraw.associate = (models) => {
    Withdraw.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Withdraw;
};
