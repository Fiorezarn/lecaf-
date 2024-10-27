const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  sendEmailResetPassword,
  resetPassword,
  sendEmailVerificationManual,
  loginWithGoogle,
} = require("../controllers/auth.controller");
const { verifyEmail } = require("../helpers/token.helper");
const {
  bodyValidation,
  checkDuplicate,
} = require("../validations/auth.validation");

router.get("/verify-email", verifyEmail);
router.post("/register", bodyValidation, checkDuplicate, Register);
router.post("/login", Login);
router.post("/send-reset-password", sendEmailResetPassword);
router.post("/send-email", sendEmailVerificationManual);
router.put("/reset-password", resetPassword);
router.post("/google", loginWithGoogle);

module.exports = router;
