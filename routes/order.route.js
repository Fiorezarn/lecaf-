const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByUserId,
  createSnapTransaction,
  verifyTransaction,
  cancelTransaction,
  getAllOrderDelivery,
} = require("../controllers/order.controller");

router.get("/delivery", getAllOrderDelivery);
router.post("/payments/:id", createSnapTransaction);
router.get("/:id", getOrderByUserId);
router.post("/", createOrder);
router.post("/verify-payment/:orderId", verifyTransaction);
router.post("/cancel-payment/:id", cancelTransaction);

module.exports = router;
