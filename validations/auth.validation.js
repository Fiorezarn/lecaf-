const Joi = require("joi");
const { Users } = require("../models");
const {
  errorClientResponse,
  errorServerResponse,
} = require("../helpers/response.helper");

const bodyValidation = (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required(),
    phonenumber: Joi.string().min(12).max(12),
    password: Joi.string().min(8).alphanum().required(),
  });
  const validationError = schema.validate(req.body).error;
  if (validationError) {
    return errorClientResponse(res, validationError.details[0].message);
  }
  next();
};

const checkDuplicate = async (req, res, next) => {
  const { username, email } = req.body;
  try {
    const name = await Users.findOne({
      where: { us_username: username },
    });

    const dataEmail = await Users.findOne({
      where: { us_email: email },
    });

    if (name) {
      return errorClientResponse(res, `User with ${username} already exists`);
    }
    if (dataEmail) {
      return errorClientResponse(res, `Email ${email} is already taken`);
    }
    next();
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = { bodyValidation, checkDuplicate };
