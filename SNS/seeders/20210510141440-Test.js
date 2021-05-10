'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => { //seeders를 통해 생성할 데이터 만드는 소스코드 로직
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  down: async (queryInterface, Sequelize) => { //seeders를 되돌릴 때 수행되는 로직
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
