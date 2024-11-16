const Joi = require("joi");
const {
  errorClientResponse,
  errorServerResponse,
} = require("@/helpers/response.helper");

const bodyValidation = (req, res, next) => {
  const schema = Joi.object({
    userId: Joi.number().required(),
    site: Joi.string().required(),
    typeOrder: Joi.string().required(),
    totalPrice: Joi.number().required(),
    menuJson: Joi.string().required(),
  });
  const validationError = schema.validate(req.body).error;
  if (validationError) {
    return errorClientResponse(res, validationError.details[0].message);
  }
  next();
};

module.exports = { bodyValidation };
