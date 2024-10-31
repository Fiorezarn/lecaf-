const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");

const generateToken = (id, email, name, role, expiresIn) => {
  const token = jwt.sign(
    { us_id: id, us_email: email, name: name, role: role },
    process.env.JWT_SECRET,
    {
      expiresIn: expiresIn,
    }
  );
  return token;
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await Users.update(
      { us_active: true },
      { where: { us_id: decoded.us_id } }
    );
    return res.redirect(`${process.env.BASE_URL_FRONTEND}/verify-success`);
  } catch (error) {
    return res.redirect(`${process.env.BASE_URL_FRONTEND}/verify-failed`);
  }
};

const sendEmail = async (username, email, subject, title, token, link) => {
  const emailTemplateSource = fs.readFileSync(
    path.join(__dirname, "../views/templates/emailVerification.hbs"),
    "utf8"
  );
  const template = handlebars.compile(emailTemplateSource);
  const htmlToSend = template({
    logoUrl: `${process.env.BASE_URL}:${process.env.PORT}/images/logo192.png`,
    username: username,
    subject: subject,
    title: title,
    verificationLink: `${link}?token=${token}`,
  });

  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Le Café" <${process.env.MAIL_USERNAME}>`,
    to: email,
    subject: subject,
    html: htmlToSend,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { generateToken, verifyEmail, sendEmail };
