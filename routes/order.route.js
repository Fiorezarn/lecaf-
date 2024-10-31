const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderByUserId,
} = require("../controllers/order.controller");

router.get("/:id", getOrderByUserId);
router.post("/", createOrder);

module.exports = router;
