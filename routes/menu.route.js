const express = require("express");
const upload = require("@/utils/multer");
const router = express.Router();
const {
  getAllMenu,
  getMenuRecommended,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
} = require("@/controllers/menu.controller");
const {
  bodyValidation,
  checkDuplicate,
} = require("@/validations/menu.validation");

router.get("/", getAllMenu);
router.get("/recommended", getMenuRecommended);
router.get("/:id", getMenuById);
router.post(
  "/",
  upload.single("image"),
  bodyValidation,
  checkDuplicate,
  createMenu
);
router.put("/:id", upload.single("image"), updateMenu);
router.patch("/:id", deleteMenu);

module.exports = router;
