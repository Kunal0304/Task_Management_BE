'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [3, 50],
        },
      },
      mobile_no: {
        type: Sequelize.BIGINT,
        allowNull: false, 
        unique: true,
        validate: {
          isInt: true,
          len: [10, 10],
        },
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
        validate: {
          len: [6, 50],
        },
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      age: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      config: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      ekyc_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      nominee_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      bank_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_obsolate: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: "active",
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "lead",
      },
      designation: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      pincode: {
        type: Sequelize.INTEGER,
        allowNull: true,
        validate: {
          len: [6, 6],
        },
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'created_at',
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        field: 'updated_at',
      }
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Users');
  }
};
