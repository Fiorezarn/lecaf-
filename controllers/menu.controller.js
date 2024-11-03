const { Menu } = require("../models");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("../helpers/response.helper");
const { Op } = require("sequelize");
const { uploadImage } = require("../service/cloudinary.service");

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
      where: { [Op.and]: [{ mn_id: id }, { is_deleted: 0 }] },
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

const createMenu = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    if (!req?.file) {
      return res.status(400).json({ error: "image is required" });
    }
    const result = await uploadImage(req?.file);

    const menu = await Menu.create({
      mn_name: name,
      mn_image: result.secure_url,
      mn_price: Number(price),
      mn_desc: description,
      mn_category: category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return successResponseData(res, "Success create menu", menu, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, category } = req.body;
    const menu = await findMenuById(id);
    if (!menu) {
      return errorClientResponse(res, `Menu with id ${id} not found!`);
    }
    if (req?.file) {
      const result = await uploadImage(req?.file);
      menu.mn_image = result.secure_url;
    }
    menu.mn_name = name;
    menu.mn_price = Number(price);
    menu.mn_desc = description;
    menu.mn_category = category;
    menu.updatedAt = new Date();
    await menu.save();
    return successResponseData(res, "Success update menu", menu, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = { getAllMenu, getMenuById, createMenu, updateMenu };
