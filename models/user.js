import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const User = sequelize.define('User', {
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
    password: {
      type: DataTypes.STRING,
      allowNull: true,
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
    gender: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    config: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    ekyc_verified: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "apply",
      validate: {
        isIn: {
          args: [["apply", "pending", "approved", "rejected"]],
          msg: "E-KYC verification status must be one of 'apply', 'pending', 'approved', or 'rejected'."
        }
      }
    },
    nominee_verified: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "apply",
      validate: {
        isIn: {
          args: [["apply", "pending", "approved", "rejected"]],
          msg: "Nominee verification status must be one of 'apply', 'pending', 'approved', or 'rejected'."
        }
      }
    },
    bank_verified: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "apply",
      validate: {
        isIn: {
          args: [["apply", "pending", "approved", "rejected"]],
          msg: "Bank verification status must be one of 'apply', 'pending', 'approved', or 'rejected'."
        }
      }
    },
    is_obsolate: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "active",
      validate: {
        isIn: {
          args: [['active', 'inactive']],
          msg: 'status must be active & inactive',
        },
        notEmpty: {
          msg: 'status cannot be empty.',
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "lead",
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pincode: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        len: {
          args: [6, 6],
          msg: "Pincode must be exactly 6 digits long."
        },
      },
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  }, {
    timestamps: false,
    tableName: 'Users',
  });

  // Define associations here if needed
  User.associate = (models) => {
    User.hasMany(models.Investment, {
      foreignKey: "userId",
      as: "investments",
    });
    User.hasMany(models.Login, {
      foreignKey: "userId",
      as: "logins",
    });
    User.hasMany(models.Transaction, {
      foreignKey: "userId",
      as: "transactions",
    });
  };

  User.prototype.checkAndUpdateRole = async function () {
    if (this.ekyc_verified === "approved" && this.bank_verified === "approved") {
      this.role = "investor";
      await this.save();
    }
  };

  return User;
};
