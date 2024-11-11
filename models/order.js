"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Order.hasMany(models.OrderDetail, {
        foreignKey: "od_or_id",
        as: "OrderDetail",
      });
      models.Order.belongsTo(models.User, {
        foreignKey: "or_us_id",
        as: "User",
      });
    }
  }
  Order.init(
    {
      or_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      or_us_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      or_site: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      or_longitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      or_latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      or_type_order: {
        type: DataTypes.ENUM("Dine-in", "Delivery"),
        allowNull: false,
      },
      or_total_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      or_status_payment: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        allowNull: false,
      },
      or_status_shipping: {
        type: DataTypes.ENUM("ongoing", "delivered", "cancelled"),
        defaultValue: "ongoing",
      },
      or_platform_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      or_platform_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      or_payment_info: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
      timestamps: true,
      tableName: "orders",
    }
  );
  return Order;
};
