"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Menus", {
      mn_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mn_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      mn_image: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mn_desc: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mn_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      mn_category: {
        type: Sequelize.ENUM("coffee", "non-coffee", "food"),
        allowNull: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Menus");
  },
};
