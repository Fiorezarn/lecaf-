const Joi = require("joi");
const { User } = require("@/models");
const {
  errorClientResponse,
  errorServerResponse,
} = require("@/helpers/response.helper");

const bodyValidation = (req, res, next) => {
  const schema = Joi.object({
    fullname: Joi.string().min(5).max(20).required(),
    username: Joi.string().min(5).max(10).required(),
    email: Joi.string().email().required(),
    phonenumber: Joi.string().min(12).max(15),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/(?=.*[a-z])/, "lowercase letter")
      .pattern(/(?=.*[A-Z])/, "uppercase letter")
      .pattern(/(?=.*\d)/, "number")
      .pattern(/(?=.*[!@#$%^&])/, "special character")
      .required()
      .messages({
        "string.base": "Password must be a text string.",
        "string.empty": "Password cannot be empty.",
        "string.min": "Password must be at least {#limit} characters long.",
        "string.max": "Password cannot exceed {#limit} characters.",
        "string.pattern.name": "Password must include at least one {#name}.",
        "any.required": "Password is a required field.",
      }),
  });
  const validationError = schema.validate(req.body).error;
  if (validationError) {
    return errorClientResponse(res, validationError.details[0].message);
  }
  next();
};

const resetPasswordValidation = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/(?=.*[a-z])/, "lowercase letter")
      .pattern(/(?=.*[A-Z])/, "uppercase letter")
      .pattern(/(?=.*\d)/, "number")
      .pattern(/(?=.*[!@#$%^&])/, "special character")
      .required()
      .messages({
        "string.base": "Password must be a text string.",
        "string.empty": "Password cannot be empty.",
        "string.min": "Password must be at least {#limit} characters long.",
        "string.max": "Password cannot exceed {#limit} characters.",
        "string.pattern.name": "Password must include at least one {#name}.",
        "any.required": "Password is a required field.",
      }),
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
    const name = await User.findOne({
      where: { us_username: username },
    });

    const dataEmail = await User.findOne({
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

module.exports = { bodyValidation, checkDuplicate, resetPasswordValidation };
