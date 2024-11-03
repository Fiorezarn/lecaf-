const { User } = require("../models");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("../helpers/response.helper");

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { is_deleted: 0 },
    });
    return successResponseData(res, "Success get all users", users, 200);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = { getAllUser };
