const { Menu } = require("../models");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("../helpers/response.helper");

const getAllMenu = async (req, res) => {
  try {
    const menus = await Menu.findAll();
    return successResponseData(res, "Success get all data!", menus, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const findMenuById = async (id) => {
  try {
    const menu = await Menu.findOne({
      where: { mn_id: id },
    });
    return menu;
  } catch (error) {
    return;
  }
};

const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await findMenuById(id);
    if (!menu) {
      return errorClientResponse(res, `Menu with id ${id} not found!`);
    }
    return successResponseData(
      res,
      `Success get menu with id ${id}`,
      menu,
      200
    );
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = { getAllMenu, getMenuById };
