'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.renameColumn('Users', 'mobile', 'mobile_no');
  },

  async down(queryInterface) {
    await queryInterface.renameColumn('Users', 'mobile_no', 'mobile');
  }
};
