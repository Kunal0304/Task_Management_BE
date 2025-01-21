import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Investment = sequelize.define('Investment', {
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
    capital: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Capital must be an integer.',
        },
        min: {
          args: [0],
          msg: 'Capital must be a positive integer.',
        },
      },
    },
    interest_rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Interest rate must be an integer.',
        },
        min: {
          args: [0],
          msg: 'Interest rate must be a positive integer.',
        },
      },
    },
    lockPeriod: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Lock period must be an integer.',
        },
        min: {
          args: [0],
          msg: 'Lock period must be a positive integer.',
        },
      },
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        notEmpty: {
          msg: 'Type cannot be empty.',
        },
        len: {
          args: [3, 50],
          msg: 'Type must be between 3 and 50 characters long.',
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
    timestamps: false, // Disable automatic timestamping
    tableName: 'Investments', // Ensure this matches the table name
  });

  // Define associations if any
  Investment.associate = (models) => {
    Investment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Investment;
};
