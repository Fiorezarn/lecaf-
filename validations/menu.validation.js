const Joi = require("joi");
const {
  errorClientResponse,
  errorServerResponse,
} = require("../helpers/response.helper");
const { Menu } = require("../models");

const bodyValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    description: Joi.string().required(),
    category: Joi.required(),
  });

  const validationError = schema.validate(req.body).error;
  if (validationError) {
    return errorClientResponse(res, validationError.details[0].message);
  }
  next();
};

const checkDuplicate = async (req, res, next) => {
  const { name } = req.body;

  try {
    const menu = await Menu.findOne({
      where: { mn_name: name },
    });

    if (menu) {
      return errorClientResponse(res, `Menu with ${name} already exists`);
    }
    next();
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = { bodyValidation, checkDuplicate };
