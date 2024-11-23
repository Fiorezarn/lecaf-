const jwt = require("jsonwebtoken");
const { User } = require("@/models");
const bcrypt = require("bcrypt");
const { generateToken, sendEmail } = require("@/helpers/token.helper");
const admin = require("@/utils/firebase");
const {
  successResponseData,
  successResponse,
  errorServerResponse,
  errorClientResponse,
} = require("@/helpers/response.helper");
const { Op } = require("sequelize");

const Register = async (req, res) => {
  try {
    const { username, fullname, email, phonenumber, password } = req.body;
    const newUser = await User.create({
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
      newUser.us_fullname,
      newUser.us_username,
      "VERIFICATION",
      process.env.JWT_EXPIRES_IN
    );

    await sendEmail(
      username,
      email,
      "Verify Your Email Address",
      "Verification Email",
      verifyToken,
      `${process.env.BASE_URL}/auth/verify-email`
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
    const users = await User.findOne({
      attributes: [
        "us_id",
        "us_username",
        "us_fullname",
        "us_email",
        "us_phonenumber",
        "us_active",
        "us_role",
        "us_password",
      ],
      where: { [Op.or]: [{ us_username: input }, { us_email: input }] },
    });
    if (!users) {
      return errorClientResponse(
        res,
        "User not found, please register first",
        404
      );
    }

    if (!users.us_active) {
      return errorClientResponse(res, "Please Verify Your Email!", 401, {
        type: "notverify",
      });
    }
    const validPassword = await bcrypt.compare(password, users.us_password);
    if (!validPassword) {
      return errorClientResponse(res, "Invalid Password", 401, {
        type: "invalidpassword",
      });
    }

    const loginToken = generateToken(
      users.us_id,
      users.us_email,
      users.us_role,
      users.us_fullname,
      users.us_username,
      "LOGIN",
      process.env.JWT_EXPIRES_IN
    );
    delete users.dataValues.us_password;
    users.dataValues.token = loginToken;
    const options = {
      expires: new Date(Number(new Date()) + 24 * 60 * 60 * 1000),
      httpOnly: false,
    };

    return res.cookie("user_leecafe", loginToken, options).status(200).send({
      status: "succes",
      message: "Login success!",
      code: 200,
      data: users,
    });
  } catch (error) {
    return errorServerResponse(res, error.message || "Internal server error");
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
    let user = null;
    let users = await User.findAll({
      where: {
        [Op.or]: [
          { us_email: decodedToken.email },
          { us_username: googleUsername },
        ],
      },
    });

    users.map((data) => {
      if (data.us_username === googleUsername) {
        googleUsername = "USER" + Math.floor(Math.random() * 1000);
      }
      if (data.us_email === decodedToken.email) {
        user = data;
      }
    });

    if (!user) {
      user = await User.create({
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
      user.us_fullname,
      user.us_username,
      "LOGIN GOOGLE",
      process.env.JWT_EXPIRES_IN
    );
    delete user.dataValues.us_password;
    user.dataValues.token = loginToken;
    const options = {
      expires: new Date(Number(new Date()) + 24 * 60 * 60 * 1000),
      httpOnly: false,
    };

    return res.cookie("user_leecafe", loginToken, options).status(200).send({
      status: "succes",
      message: "Login success!",
      code: 200,
      data: user,
    });
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const sendEmailForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { us_email: email },
    });
    if (!user) {
      return res.status(400).send({
        status: "failed",
        code: 400,
        message: `User with email ${email} not found`,
      });
    }

    const verifyToken = generateToken(
      user.us_id,
      user.us_email,
      user.us_role,
      user.us_fullname,
      user.us_username,
      "VERIFICATION",
      process.env.JWT_EXPIRES_IN
    );

    await sendEmail(
      user.us_username,
      email,
      "Reset password Le Café",
      "Please click the link to reset your password",
      verifyToken,
      `${process.env.BASE_URL_FRONTEND}/forgot-password`
    );
    return successResponse(res, "Link have been send to your email!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const sendEmailVerificationManual = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { us_email: email },
    });
    if (!user) {
      return res.status(400).send({
        status: "failed",
        code: 400,
        message: `User with email ${email} not found`,
      });
    }

    const verifyToken = generateToken(
      user.us_id,
      user.us_email,
      user.us_role,
      user.us_fullname,
      user.us_username,
      "VERIFICATION",
      process.env.JWT_EXPIRES_IN
    );

    await sendEmail(
      user.us_username,
      email,
      "Verify Your Email Address",
      "Verification Email",
      verifyToken,
      `${process.env.BASE_URL}/auth/verify-email`
    );

    return successResponse(res, "Link have been send to your email!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await User.update(
      {
        us_password: bcrypt.hashSync(password, 10),
        updatedAt: new Date(),
      },
      {
        where: { us_id: decoded.us_id },
      }
    );
    return successResponse(res, "Password changed!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("user_leecafe", {
      httpOnly: false,
    });
    return successResponse(res, "Logout success!");
  } catch (error) {
    return errorServerResponse(res, error.message);
  }
};

module.exports = {
  Register,
  Login,
  logout,
  sendEmailForgotPassword,
  sendEmailVerificationManual,
  forgotPassword,
  loginWithGoogle,
};
