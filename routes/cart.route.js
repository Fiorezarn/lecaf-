const express = require("express");
const router = express.Router();
const {
  addToCart,
  findCartByUserId,
  deleteCart,
  updateQuantity,
} = require("../controllers/cart.controller");

router.post("/", addToCart);
router.get("/:id", findCartByUserId);
router.delete("/", deleteCart);
router.patch("/:id", updateQuantity);
module.exports = router;
