'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Withdraws', 'type', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'interest', // Set a default value if needed
      validate: {
        isIn: [['interest', 'capital']],
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Withdraws', 'type');
  }
};
