const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByUserId,
  createSnapTransaction,
  verifyTransaction,
  cancelTransaction,
  updateStatus,
  getAllOrder,
} = require("@/controllers/order.controller");
const { bodyValidation } = require("@/validations/order.validation");

router.get("/", getAllOrder);
router.post("/payments/:id", createSnapTransaction);
router.get("/:id", getOrderByUserId);
router.post("/", bodyValidation, createOrder);
router.post("/verify-payment/:orderId", verifyTransaction);
router.post("/cancel-payment/:id", cancelTransaction);
router.patch("/:id", updateStatus);

module.exports = router;
