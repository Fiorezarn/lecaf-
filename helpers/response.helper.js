const successResponseData = (res, message, data, code = 201) => {
  return res.status(code).send({
    status: "success",
    code,
    message,
    data,
  });
};

const successResponse = (res, message, code = 200) => {
  return res.status(code).send({
    status: "success",
    code,
    message,
  });
};

const errorServerResponse = (res, message, code = 500) => {
  return res.status(code).send({
    status: "error",
    code,
    message,
  });
};

const errorClientResponse = (res, message, code = 400, customData = {}) => {
  let response = {
    status: "error",
    code,
    message,
  };
  return res.status(code).send({ ...response, ...customData });
};

module.exports = {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
};
