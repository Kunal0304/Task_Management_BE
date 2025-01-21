'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'ekyc_verified', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'apply',
    });

    await queryInterface.changeColumn('Users', 'nominee_verified', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'apply',
    });

    await queryInterface.changeColumn('Users', 'bank_verified', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'apply',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'ekyc_verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.changeColumn('Users', 'nominee_verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });

    await queryInterface.changeColumn('Users', 'bank_verified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  }
};
