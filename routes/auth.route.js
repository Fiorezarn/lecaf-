const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  sendEmailForgotPassword,
  forgotPassword,
  sendEmailVerificationManual,
  loginWithGoogle,
  logout,
} = require("@/controllers/auth.controller");
const { verifyEmail } = require("@/helpers/token.helper");
const {
  bodyValidation,
  checkDuplicate,
  resetPasswordValidation,
} = require("@/validations/auth.validation");

router.get("/verify-email", verifyEmail);
router.post("/register", bodyValidation, checkDuplicate, Register);
router.post("/login", Login);
router.post("/send-forgot-password", sendEmailForgotPassword);
router.post("/send-email", sendEmailVerificationManual);
router.put("/forgot-password", resetPasswordValidation, forgotPassword);
router.post("/google", loginWithGoogle);
router.get("/logout", logout);

module.exports = router;
