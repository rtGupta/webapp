"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Images", {
      // Model attributes are defined here
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        readOnly: true,
      },
      image_id: {
        type: Sequelize.UUID,
        readOnly: true
      },
      product_id: {
        type: Sequelize.INTEGER,
        readOnly: true,
        references: { model: "Products", key: "id" },
      },
      file_name: {
        type: Sequelize.STRING,
        readOnly: true,
      },
      date_created: {
        type: Sequelize.DATE,
        readOnly: true,
      },
      s3_bucket_path: {
        type: Sequelize.TEXT,
        readOnly: true,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Images");
  },
};
