"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("OrderDetails", {
      od_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      od_or_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "orders",
          key: "or_id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      od_mn_json: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      or_status_payment: {
        type: Sequelize.STRING,
        defaultValue: "pending",
        allowNull: false,
      },
      or_status_shipping: {
        type: Sequelize.ENUM("ongoing", "delivered", "cancelled"),
        defaultValue: "ongoing",
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
    await queryInterface.dropTable("OrderDetails");
  },
};
