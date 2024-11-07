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

const createOrder = async (req, res) => {
  try {
    const { userId, site, typeOrder, totalPrice, menuJson } = req.body;
    const statusShipping = !isNaN(Number(site)) ? "Delivered" : "On-going";
    const maps = isNaN(Number(site))
      ? await generateLatLongFromAddress(site)
      : site;
    const order = await Order.create({
      or_us_id: userId,
      or_site: site,
      or_latitude: maps.latitude,
      or_longitude: maps.longitude,
      or_type_order: typeOrder,
      or_total_price: totalPrice,
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
    console.log("id", id);
    const orders = await Order.findOne({
      where: { or_id: id },
      include: [
        {
          attributes: ["od_id", "od_or_id", "od_mn_json"],
          model: OrderDetail,
          as: "OrderDetail",
        },
      ],
    });

    console.log(orders.or_platform_id, "sing tenang platform id");

    if (orders.or_platform_id === null && orders.or_platform_token === null) {
      console.log("sing tenang");
      const transactionDetails = {
        transaction_details: {
          order_id: orderIdMidtrans,
          gross_amount: amount,
        },
        customer_details: {
          email: email,
        },
        item_details: orders.OrderDetail[0].od_mn_json,
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
      orders.dataValues.transaction = { token: transaction.token };
    } else {
      orders.dataValues.transaction = { token: orders.or_platform_token };
    }
    console.log(orders.dataValues.transaction, "sing tenang cok");

    return successResponseData(
      res,
      "Success get transaction token",
      orders,
      200
    );
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const getOrderByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await User.findOne({
      attributes: ["us_id"],
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
    return successResponseData(
      res,
      `Success get all order with user with id ${id}`,
      {
        order,
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

const getAllListTransaction = async (req, res) => {
  try {
    const promises = [];
    const orders = await Order.findAll({
      where: {
        or_status: {
          [Op.ne]: "init",
        },
        or_active: true,
      },
      attributes: [
        "or_id",
        "or_total_price",
        "or_status",
        "or_payment_status",
        "or_token_id",
        "or_platform_id",
      ],
    });
    orders.map((order) => {
      promises.push(
        (async () => {
          const result = await midtransVerifyTransaction(order.or_platform_id);
          let status = "pending";
          if (
            result.transaction_status === "settlement" ||
            result.transaction_status === "success"
          ) {
            status = "paid";
          }
          if (result.transaction_status === "cancel") status = "cancelled";
          if (result.transaction_status === "expire") status = "expired";
          await order.update(
            { or_payment_status: result.transaction_status, or_status: status },
            { where: { or_platform_id: order.or_platform_id } }
          );
        })()
      );
    });
    await Promise.all(promises);
    return res.status(200).send({
      status: "success",
      code: 200,
      message: "Successfully get all transaction",
      data: orders,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "failed",
      message: error.message,
      code: 500,
    });
  }
};

const verifyTransaction = async (req, res) => {
  const { orderId } = req.params;
  try {
    const transaction = await midtransVerifyTransaction(orderId);
    let order = await Order.findOne({
      where: { or_platform_id: transaction.order_id },
    });
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
      status = "paid";
    }
    if (transaction.transaction_status === "cancel") status = "cancelled";
    if (transaction.transaction_status === "expire") status = "expired";
    await order.update(
      { or_payment_status: transaction.transaction_status, or_status: status },
      { where: { or_platform_id: order.or_platform_id } }
    );
    await Order.destroy({ where: { or_status: "init" } });
    return res.status(200).send({
      status: "success",
      code: 200,
      message: "Successfully verify transaction",
      data: order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "failed",
      message: error.message,
      code: 500,
    });
  }
};

const cancelTransaction = async (req, res) => {
  const { orderId } = req.params;
  try {
    const transaction = await midtransCancelTransaction(orderId);
    let order = await Order.findOne({ where: { or_platform_id: orderId } });
    if (!order) {
      return res.status(404).send({
        status: "failed",
        code: 404,
        message: "Order not found",
      });
    }
    let status = "cancelled";
    await order.update(
      { or_payment_status: transaction.transaction_status, or_status: status },
      { where: { or_platform_id: order.or_platform_id } }
    );
    return res.status(200).send({
      status: "success",
      code: 200,
      message: "Successfully cancel transaction",
      data: order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      status: "failed",
      message: error.message,
      code: 500,
    });
  }
};

module.exports = {
  createOrder,
  getOrderByUserId,
  getAllListTransaction,
  createSnapTransaction,
  verifyTransaction,
  cancelTransaction,
};
