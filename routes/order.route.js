const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByUserId,
  createSnapTransaction,
  verifyTransaction,
  cancelTransaction,
  getAllOrderDelivery,
  updateStatus,
} = require("../controllers/order.controller");
const { bodyValidation } = require("../validations/order.validation");

router.get("/delivery", getAllOrderDelivery);
router.post("/payments/:id", createSnapTransaction);
router.get("/:id", getOrderByUserId);
router.post("/", bodyValidation, createOrder);
router.post("/verify-payment/:orderId", verifyTransaction);
router.post("/cancel-payment/:id", cancelTransaction);
router.patch("/:id", updateStatus);

module.exports = router;
