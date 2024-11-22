const axios = require("axios");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("@/helpers/response.helper");
const { generatePolyline, generateDistance } = require("@/helpers/maps.helper");

const createPolyline = async (req, res) => {
  try {
    const response = await generatePolyline(req.body);
    return successResponseData(res, "Success get polyline", response, 201);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const createDistance = async (req, res) => {
  try {
    const response = await generateDistance(req.body);
    return successResponseData(res, "Success create distance", response);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = { createPolyline, createDistance };
