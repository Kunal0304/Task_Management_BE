import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
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
          msg: 'Amount must be an integer.',
        },
        min: {
          args: [0],
          msg: 'Amount must be a positive integer.',
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
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Role cannot be empty.',
        },
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Status cannot be empty.',
        },
      },
    },
    withdrawStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Withdraw status cannot be empty.',
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
    tableName: 'Transactions',
  });

  // Define associations if necessary
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Transaction;
};
