'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        readOnly: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      sku: {
        type: Sequelize.CITEXT,
        unique: true
      },
      manufacturer: {
        type: Sequelize.STRING
      },
      quantity: {
        type: Sequelize.INTEGER,
        validate: {
          isInt: true,
          min: 0,
          max: 100
        }
      },
      owner_user_id: {
        type: Sequelize.INTEGER,
        readOnly: true
      },
      date_added: {
        allowNull: false,
        type: Sequelize.DATE,
        readOnly: true
      },
      date_last_updated: {
        allowNull: false,
        type: Sequelize.DATE,
        readOnly: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
  }
};