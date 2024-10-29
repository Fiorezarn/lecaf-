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
        foreignKey: "or_id_user",
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
      or_id_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      or_site: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      or_longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      or_latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
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
        type: DataTypes.ENUM("Pending", "Succed", "Failed"),
        defaultValue: "Pending",
      },
      or_status_shipping: {
        type: DataTypes.ENUM("On-going", "Delivered"),
        defaultValue: "On-going",
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
