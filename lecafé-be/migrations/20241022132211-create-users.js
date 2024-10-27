"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      us_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      us_fullname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      us_username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      us_email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      us_phonenumber: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      us_password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      us_role: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "GUEST",
      },
      us_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("Users");
  },
};
