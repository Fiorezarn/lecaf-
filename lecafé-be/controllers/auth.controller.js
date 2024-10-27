const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { generateToken, sendEmail } = require("../helpers/token.helper");
const admin = require("./firebase");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("../helpers/response.helper");
const { Op } = require("sequelize");
const Register = async (req, res) => {
  try {
    const { username, fullname, email, phonenumber, password } = req.body;
    const newUser = await Users.create({
      us_username: username,
      us_fullname: fullname,
      us_email: email,
      us_phonenumber: phonenumber,
      us_password: bcrypt.hashSync(password, 10),
    });

    const verifyToken = generateToken(
      newUser.us_id,
      newUser.us_email,
      newUser.us_role,
      "VERIFICATION",
      process.env.JWT_EXPIRES_IN
    );

    await sendEmail(
      username,
      email,
      "Verify Your Email Address",
      "Verification Email",
      verifyToken,
      `${process.env.BASE_URL}:${process.env.PORT}/auth/verify-email`
    );
    delete newUser.dataValues.us_password;
    return successResponseData(res, "Register success!", newUser, 201);
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const Login = async (req, res) => {
  try {
    const { input, password } = req.body;
    const users = await Users.findOne({
      attributes: [
        "us_username",
        "us_email",
        "us_phonenumber",
        "us_active",
        "us_role",
        "us_password",
      ],
      where: { [Op.or]: [{ us_username: input }, { us_email: input }] },
    });
    if (!users) {
      return errorClientResponse(res, "User not found", 404);
    }

    if (!users.us_active) {
      return res.status(400).send({
        status: "failed",
        code: 401,
        message: "Please Verify Your Email!",
      });
    }

    const validPassword = await bcrypt.compare(password, users.us_password);
    if (!validPassword) {
      return errorClientResponse(res, "Invalid Password", 401);
    }

    const loginToken = generateToken(
      users.us_id,
      users.us_email,
      users.us_role,
      "LOGIN",
      process.env.JWT_EXPIRES_IN
    );
    delete users.dataValues.us_password;
    users.dataValues.token = loginToken;
    const options = {
      expires: new Date(Number(new Date()) + 24 * 60 * 60 * 1000),
      httpOnly: false,
    };
    return res.cookie("user", JSON.stringify(users), options).status(200).send({
      status: "succes",
      code: 200,
      data: users,
    });
  } catch (error) {
    return res.status(500).send({
      status: "failed",
      message: error.message,
    });
  }
};

const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    let googleUsername = decodedToken.email.substring(
      0,
      decodedToken.email.indexOf("@")
    );
    let user = await Users.findOne({
      where: { us_email: decodedToken.email },
    });

    let username = await Users.findOne({
      where: { us_username: googleUsername },
    });

    if (username && googleUsername === username?.us_username) {
      googleUsername = "USER" + Math.floor(Math.random() * 1000);
    }

    if (!user) {
      user = await Users.create({
        us_email: decodedToken.email,
        us_fullname: decodedToken.name,
        us_username: googleUsername,
        us_role: "GUEST",
        us_phonenumber: "08***********",
        us_password: bcrypt.hashSync(
          Math.random().toString(36).slice(2, 10),
          10
        ),
        us_active: true,
      });
    }

    const loginToken = generateToken(
      user.us_id,
      user.us_email,
      user.us_role,
      "LOGINGOOGLE",
      process.env.JWT_EXPIRES_IN
    );

    delete user.dataValues.us_password;
    user.dataValues.token = loginToken;
    const options = {
      expires: new Date(Number(new Date()) + 24 * 60 * 60 * 1000),
      httpOnly: false,
    };
    return res.cookie("user", JSON.stringify(user), options).status(200).send({
      status: "succes",
      code: 200,
      data: user,
    });
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const sendEmailResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({
      where: { us_email: email },
    });
    if (!user) {
      return res.status(400).send({
        status: "failed",
        code: 400,
        message: "User not found",
      });
    }

    const verifyToken = generateToken(
      user.us_id,
      user.us_email,
      user.us_role,
      "VERIFICATION",
      process.env.JWT_EXPIRES_IN
    );

    await sendEmail(
      user.us_username,
      email,
      "Reset password Le Café",
      "Please click the link to reset your password",
      verifyToken,
      `${process.env.BASE_URL_FRONTEND}/reset-password`
    );
    return successResponse(res, "Link have been send to your email!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const sendEmailVerificationManual = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Users.findOne({
      where: { us_email: email },
    });
    if (!user) {
      return res.status(400).send({
        status: "failed",
        code: 400,
        message: "User not found",
      });
    }

    const verifyToken = generateToken(
      user.us_id,
      user.us_email,
      user.us_role,
      "VERIFICATION",
      process.env.JWT_EXPIRES_IN
    );

    await sendEmail(
      user.us_username,
      email,
      "Verify Your Email Address",
      "Verification Email",
      verifyToken,
      `${process.env.BASE_URL}:${process.env.PORT}/auth/verify-email`
    );

    return successResponse(res, "Link have been send to your email!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await Users.update(
      {
        us_password: bcrypt.hashSync(password, 10),
        updatedAt: new Date(),
      },
      {
        where: { us_id: decoded.us_id },
      }
    );
    return successResponse(res, "Link have been send to your email!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = {
  Register,
  Login,
  sendEmailResetPassword,
  sendEmailVerificationManual,
  resetPassword,
  loginWithGoogle,
};
