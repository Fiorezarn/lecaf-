const express = require("express");
const router = express.Router();
const {
  addToCart,
  findCartByUserId,
  deleteCart,
  updateQuantity,
  countCart,
} = require("../controllers/cart.controller");

router.post("/", addToCart);
router.get("/:id", findCartByUserId);
router.delete("/", deleteCart);
router.patch("/:id", updateQuantity);
router.get("/count/:id", countCart);
module.exports = router;
