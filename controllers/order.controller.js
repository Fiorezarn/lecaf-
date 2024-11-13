const { Order, OrderDetail, User, Cart } = require("../models");
let prefixApp = process.env.PREFIX_APP;
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("../helpers/response.helper");
const {
  generateLatLongFromAddress,
  generatePolyline,
} = require("../helpers/maps.helper");
const {
  midtransCreateSnapTransaction,
  midtransVerifyTransaction,
  midtransCancelTransaction,
} = require("../service/midtrans.service");
const { Op } = require("sequelize");

const createOrder = async (req, res) => {
  try {
    const { userId, site, typeOrder, totalPrice, menuJson } = req.body;
    const statusShipping = !isNaN(Number(site)) ? "delivered" : "ongoing";
    const maps = isNaN(Number(site))
      ? await generateLatLongFromAddress(site)
      : site;
    const order = await Order.create({
      or_us_id: userId,
      or_site: site,
      or_latitude: maps.latitude,
      or_longitude: maps.longitude,
      or_type_order: typeOrder,
      or_total_price: Number(totalPrice),
      or_status_shipping: statusShipping,
    });
    const orderDetail = await OrderDetail.create({
      od_or_id: order.or_id,
      od_mn_json: menuJson,
    });
    if (order && orderDetail) {
      await Cart.destroy({
        where: { cr_us_id: userId },
      });
    }
    const data = { order, orderDetail };
    return successResponseData(res, "Order created successfully", data, 201);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const createSnapTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, email } = req.body;
  const orderIdMidtrans = `LeCafe-${Date.now()}`;
  try {
    const order = await Order.findOne({
      where: { or_id: id },
      include: [
        {
          attributes: ["od_id", "od_or_id", "od_mn_json"],
          model: OrderDetail,
          as: "OrderDetail",
        },
      ],
    });

    if (!order) {
      return res.status(404).send({
        status: "failed",
        code: 404,
        message: "Order not found",
      });
    }
    if (order.or_platform_id === null && order.or_platform_token === null) {
      const transactionDetails = {
        transaction_details: {
          order_id: orderIdMidtrans,
          gross_amount: amount,
        },
        customer_details: {
          email: email,
        },
        item_details: JSON.parse(order.OrderDetail[0].od_mn_json),
      };
      const transaction = await midtransCreateSnapTransaction(
        transactionDetails
      );

      await Order.update(
        {
          or_platform_id: orderIdMidtrans,
          or_platform_token: transaction.token,
        },
        { where: { or_id: id } }
      );
      order.dataValues.transaction = { token: transaction.token };
    } else {
      order.dataValues.transaction = { token: order.or_platform_token };
    }
    return successResponseData(
      res,
      "Success get transaction token",
      order,
      200
    );
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const verifyTransaction = async (req, res) => {
  const { orderId } = req.params;
  try {
    const transaction = await midtransVerifyTransaction(orderId);
    let order = await Order.findOne({
      where: { or_platform_id: transaction.order_id },
    });
    let shipping = order.or_type_order === "Dine-in" ? "delivered" : "ongoing";
    if (!order) {
      return res.status(404).send({
        status: "failed",
        code: 404,
        message: "Order not found",
      });
    }
    let status = "pending";
    if (
      transaction.transaction_status === "settlement" ||
      transaction.transaction_status === "success"
    ) {
      status = "settlement";
    }
    if (transaction.transaction_status === "cancel") {
      status = "cancelled";
      shipping = "cancelled";
    }
    if (transaction.transaction_status === "expire") status = "expired";

    await order.update(
      {
        or_status_payment: status,
        or_status_shipping: shipping,
        or_payment_info: transaction,
      },
      { where: { or_platform_id: order.or_platform_id } }
    );
    return successResponseData(res, "Success verify transaction", order, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const getAllOrderDelivery = async (req, res) => {
  try {
    let orders = await User.findOne({
      attributes: ["us_id", "us_fullname"],
      include: [
        {
          attributes: [
            "or_id",
            "or_us_id",
            "or_site",
            "or_longitude",
            "or_latitude",
            "or_type_order",
            "or_total_price",
            "or_status_payment",
            "or_status_shipping",
            "or_platform_id",
            "or_payment_info",
            "createdAt",
          ],
          model: Order,
          as: "Order",
          include: [
            {
              attributes: ["od_id", "od_or_id", "od_mn_json"],
              model: OrderDetail,
              as: "OrderDetail",
            },
          ],
          where: {
            [Op.and]: [
              { or_status_shipping: "ongoing" },
              { or_status_payment: "settlement" },
            ],
          },
        },
      ],
    });

    return successResponseData(
      res,
      `Success get all order pending`,
      {
        orders,
        origins: {
          latitude: process.env.STORE_LATITUDE,
          longitude: process.env.STORE_LONGITUDE,
        },
      },
      200
    );
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const promises = [];
    const { id } = req.params;
    let orders = await User.findOne({
      attributes: ["us_id", "us_fullname"],
      include: [
        {
          attributes: [
            "or_id",
            "or_us_id",
            "or_site",
            "or_longitude",
            "or_latitude",
            "or_type_order",
            "or_total_price",
            "or_status_payment",
            "or_status_shipping",
            "or_platform_id",
            "or_payment_info",
            "createdAt",
          ],
          model: Order,
          as: "Order",
          include: [
            {
              attributes: ["od_id", "od_or_id", "od_mn_json"],
              model: OrderDetail,
              as: "OrderDetail",
            },
          ],
        },
      ],
      where: { us_id: id },
    });

    orders.Order.map((order) => {
      const vaNumbers = order.or_payment_info?.va_numbers;
      const issuer = order.or_payment_info?.issuer;

      if (vaNumbers && vaNumbers.length > 0 && vaNumbers[0].bank) {
        order.dataValues.payment_method = vaNumbers[0].bank.toUpperCase();
      } else if (issuer) {
        order.dataValues.payment_method = issuer.toUpperCase();
      } else {
        order.dataValues.payment_method = "Unknown";
      }

      promises.push(
        (async () => {
          const result = await midtransVerifyTransaction(order.or_platform_id);
          let status = "pending";
          if (
            result.transaction_status === "settlement" ||
            result.transaction_status === "success"
          ) {
            status = "settlement";
          }
          if (result.transaction_status === "cancel") status = "cancelled";
          if (result.transaction_status === "expire") status = "expired";
          if (result.transaction_status === "expire") {
            await Order.update(
              {
                or_status_payment: status,
                or_status_shipping: "cancelled",
              },
              { where: { or_platform_id: order.or_platform_id } }
            );
          }
        })()
      );
    });
    await Promise.all(promises);
    return successResponseData(
      res,
      `Success get all order with user with id ${id}`,
      {
        orders,
        origins: {
          latitude: process.env.STORE_LATITUDE,
          longitude: process.env.STORE_LONGITUDE,
        },
      },
      200
    );
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const cancelTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    let order = await Order.findOne({ where: { or_id: id } });
    if (!order) {
      return res.status(404).send({
        status: "failed",
        code: 404,
        message: "Order not found",
      });
    }

    if (order.or_platform_id === null && order.or_platform_token === null) {
      await Order.update(
        {
          or_status_payment: "cancelled",
          or_status_shipping: "cancelled",
        },
        { where: { or_id: id } }
      );
    }
    if (order.or_platform_id !== null && order.or_platform_token !== null) {
      const transaction = await midtransVerifyTransaction(order.or_platform_id);
      if (transaction.status_code === "404") {
        await Order.update(
          {
            or_status_payment: "cancelled",
            or_status_shipping: "cancelled",
          },
          { where: { or_id: id } }
        );
      } else {
        const cancel = await midtransCancelTransaction(order.or_platform_id);
        await Order.update(
          {
            or_status_payment: "cancelled",
            or_status_shipping: "cancelled",
          },
          { where: { or_platform_id: order.or_platform_id } }
        );
      }
    }
    return successResponseData(res, "Success cancel transaction", order, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = {
  createOrder,
  getOrderByUserId,
  createSnapTransaction,
  verifyTransaction,
  cancelTransaction,
  getAllOrderDelivery,
};
