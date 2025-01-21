'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'lastLogin', {
      type: Sequelize.DATE,
      allowNull: true, // or false, depending on your requirements
      defaultValue: Sequelize.NOW, // or any default value you need
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Users', 'lastLogin');
  }
};