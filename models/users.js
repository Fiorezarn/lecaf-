"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Order, {
        foreignKey: "or_us_id",
        as: "Order",
      });
      models.User.belongsToMany(models.Menu, {
        foreignKey: "cr_us_id",
        through: "Cart",
        as: "Menu",
      });
    }
  }
  User.init(
    {
      us_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      us_fullname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      us_username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      us_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      us_phonenumber: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      us_password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      us_role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "GUEST",
      },
      us_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
      timestamps: true,
    }
  );
  return User;
};
