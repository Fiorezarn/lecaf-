"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OrderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.OrderDetail.belongsTo(models.Order, {
        foreignKey: "od_or_id",
        as: "Orders",
      });
    }
  }
  OrderDetail.init(
    {
      od_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      od_or_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      od_mn_json: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "OrderDetail",
      tableName: "orderdetails",
      timestamps: true,
    }
  );
  return OrderDetail;
};
