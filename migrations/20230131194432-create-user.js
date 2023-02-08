'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS citext;');
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        readOnly: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true
      },
      username: {
        type: Sequelize.CITEXT,
        allowNull: false,
        unique: true,
        notEmpty: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
        notEmpty: true,
        writeOnly: true
      },
      account_created: {
        allowNull: false,
        type: Sequelize.DATE,
        readOnly: true
      },
      account_updated: {
        allowNull: false,
        type: Sequelize.DATE,
        readOnly: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};