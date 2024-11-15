const { Cart, Menu, User, Order } = require("../models");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("../helpers/response.helper");

const countData = async (req, res) => {
  try {
    const order = await Order.count();
    const user = await User.count();
    const menu = await Menu.count();
    const data = { order, user, menu };
    return successResponseData(res, "Success get data", data, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = {
  countData,
};
