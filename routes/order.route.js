const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByUserId,
  createSnapTransaction,
} = require("../controllers/order.controller");

router.post("/payments/:id", createSnapTransaction);
router.get("/:id", getOrderByUserId);
router.post("/", createOrder);

module.exports = router;
