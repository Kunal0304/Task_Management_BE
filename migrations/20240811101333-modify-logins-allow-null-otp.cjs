'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Logins', 'otp', {
      type: Sequelize.STRING,
      allowNull: true, // Allow null values
    });

    await queryInterface.changeColumn('Logins', 'otpExpiry', {
      type: Sequelize.DATE,
      allowNull: true, // Allow null values
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the changes if needed
    await queryInterface.changeColumn('Logins', 'otp', {
      type: Sequelize.STRING,
      allowNull: false, // Revert back to not allowing null values
    });

    await queryInterface.changeColumn('Logins', 'otpExpiry', {
      type: Sequelize.DATE,
      allowNull: false, // Revert back to not allowing null values
    });
  }
};
