const { Menu } = require("@/models");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("@/helpers/response.helper");
const { Op } = require("sequelize");
const { uploadImage } = require("@/services/cloudinary.service");
const { getPagination, getPagingData } = require("@/utils/pagination");

const getAllMenu = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;
    const { limit: limitValue, offset } = getPagination(page, limit);
    let whereConditions = { is_deleted: 0 };

    if (search) {
      whereConditions.mn_name = { [Op.like]: `%${search}%` };
    }

    if (category) {
      whereConditions.mn_category = category;
    }

    const menus = await Menu.findAndCountAll({
      where: whereConditions,
      limit: limitValue,
      offset,
    });
    const response = getPagingData(menus, page, limitValue);
    return res.status(200).send(response);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const getMenuRecommended = async (req, res) => {
  try {
    const menus = await Menu.findAll({
      where: {
        mn_id: {
          [Op.in]: [1, 7, 14, 19],
        },
      },
    });

    return successResponseData(res, "Success get menu recommended", menus, 200);
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
    throw error;
  }
};

const getMenuById = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await findMenuById(id);
    if (!menu) {
      return errorClientResponse(res, `Menu with id ${id} not found!`, 404);
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
    return successResponseData(res, "Success create menu", menu, 201);
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

    await Menu.update(
      {
        mn_name: name,
        mn_price: Number(price),
        mn_desc: description,
        mn_image: menu.mn_image,
        mn_category: category,
        updatedAt: new Date(),
      },
      {
        where: { mn_id: id },
      }
    );
    return successResponse(res, "Success update menu", 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await findMenuById(id);
    if (!menu) {
      return errorClientResponse(res, `Menu with id ${id} not found!`);
    }
    await Menu.update(
      {
        is_deleted: 1,
      },
      {
        where: { mn_id: id },
      }
    );
    return successResponse(res, "Success delete menu");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = {
  getAllMenu,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  getMenuRecommended,
  findMenuById,
};
