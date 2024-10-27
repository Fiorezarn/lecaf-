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

const errorClientResponse = (res, message, code = 400) => {
  return res.status(code).send({
    status: "error",
    code,
    message,
  });
};

module.exports = {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
};
