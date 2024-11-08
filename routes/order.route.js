const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByUserId,
  createSnapTransaction,
  verifyTransaction,
  cancelTransaction,
} = require("../controllers/order.controller");

router.post("/payments/:id", createSnapTransaction);
router.get("/:id", getOrderByUserId);
router.post("/", createOrder);
router.post("/verify-payment/:orderId", verifyTransaction);
router.post("/cancel-payment/:id", cancelTransaction);

module.exports = router;
