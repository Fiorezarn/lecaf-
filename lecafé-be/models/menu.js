"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Menu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Menu.belongsToMany(models.User, {
        foreignKey: "cr_mn_id",
        through: "Cart",
        as: "User",
      });
    }
  }
  Menu.init(
    {
      mn_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mn_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      mn_image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mn_desc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mn_price: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      mn_category: {
        type: DataTypes.ENUM("coffee", "non-coffee", "food"),
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Menu",
      tableName: "menus",
      timestamps: true,
    }
  );
  return Menu;
};
