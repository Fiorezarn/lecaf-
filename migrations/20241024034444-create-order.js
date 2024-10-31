"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      or_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      or_us_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Users",
          key: "us_id",
        },
      },
      or_site: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      or_longitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      or_latitude: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      or_type_order: {
        type: Sequelize.ENUM("Dine-in", "Delivery"),
        allowNull: false,
      },
      or_total_price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      or_status_payment: {
        type: Sequelize.ENUM("Pending", "Succed", "Failed"),
        defaultValue: "Pending",
      },
      or_status_shipping: {
        type: Sequelize.ENUM("On-going", "Delivered"),
        defaultValue: "On-going",
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
    await queryInterface.dropTable("Orders");
  },
};
