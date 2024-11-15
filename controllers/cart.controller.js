const { Cart, Menu, User } = require("../models");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("../helpers/response.helper");
const { Op } = require("sequelize");
const { log } = require("handlebars");

const addToCart = async (req, res) => {
  try {
    const { userId, menuId, quantity } = req.body;
    let cart;
    cart = await Cart.findOne({
      attributes: ["cr_id", "cr_quantity"],
      where: { [Op.and]: [{ cr_us_id: userId, cr_mn_id: menuId }] },
    });

    const user = await User.findOne({
      where: { us_id: userId },
    });

    if (!user) {
      return errorClientResponse(res, "User not found!", 404);
    }
    if (!cart) {
      cart = await Cart.create({
        cr_us_id: userId,
        cr_mn_id: menuId,
        cr_quantity: quantity,
      });
    } else {
      cart = await Cart.update(
        {
          cr_quantity: Number(cart.cr_quantity) + Number(quantity),
        },
        { where: { cr_id: cart.cr_id } }
      );
    }
    return successResponseData(res, "Successfully added to cart", cart, 201);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const findCartByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const cart = await User.findOne({
      attributes: ["us_id"],
      include: [
        {
          model: Menu,
          as: "Menu",
          through: { attributes: ["cr_id", "cr_quantity"] },
        },
      ],
      where: { us_id: id },
    });
    return successResponseData(res, "Success get cart", cart, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({
      where: {
        cr_id: id,
      },
    });

    if (!cart) {
      return errorClientResponse(res, "Cart not found!", 404);
    }

    await Cart.update(
      {
        cr_quantity: quantity,
      },
      {
        where: { cr_id: id },
      }
    );

    return successResponse(res, "Cart successfully updated!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const countCart = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      attributes: ["us_id"],
      where: { us_id: id },
    });
    if (!user) {
      return errorClientResponse(res, "User not found!", 404);
    }
    const cart = await Cart.findAll({
      attributes: ["cr_id", "cr_quantity"],
      where: {
        cr_us_id: id,
      },
    });
    const quantity = cart.reduce((acc, item) => {
      return acc + Number(item.cr_quantity);
    }, 0);

    return successResponseData(res, "Success get cart", quantity, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const deleteCart = async (req, res) => {
  try {
    const { userId, menuId } = req.body;
    const cart = await Cart.findOne({
      where: { cr_us_id: userId, cr_mn_id: menuId },
    });
    if (!cart) {
      return errorClientResponse(res, "Cart not found!", 404);
    }
    await Cart.destroy({
      where: { cr_us_id: userId, cr_mn_id: menuId },
    });
    return successResponse(res, "Cart successfully deleted!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = {
  addToCart,
  findCartByUserId,
  deleteCart,
  updateQuantity,
  countCart,
};
