'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('Users', 'lastLogin');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'lastLogin', {
      type: Sequelize.DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    });
  }
};
