const express = require("express");
const upload = require("../utils/multer");
const router = express.Router();
const {
  getAllMenu,
  getMenuById,
  createMenu,
  updateMenu,
} = require("../controllers/menu.controller");

router.get("/", getAllMenu);
router.get("/:id", getMenuById);
router.post("/", upload.single("image"), createMenu);
router.put("/:id", upload.single("image"), updateMenu);

module.exports = router;
