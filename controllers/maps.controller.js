const axios = require("axios");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("@/helpers/response.helper");
const { generatePolyline } = require("@/helpers/maps.helper");

const createPolyline = async (req, res) => {
  try {
    const response = await generatePolyline(req.body);
    return successResponseData(res, "Success get polyline", response, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = { createPolyline };
