const { Order, OrderDetail, User, Cart } = require("../models");
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

const createOrder = async (req, res) => {
  try {
    const { userId, site, typeOrder, totalPrice, menuJson } = req.body;
    console.log(isNaN(Number(site)));
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
    console.log(error);

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

module.exports = { createOrder, getOrderByUserId };
