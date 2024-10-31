const express = require("express");
const router = express.Router();
const { getAllMenu, getMenuById } = require("../controllers/menu.controller");

router.get("/", getAllMenu);
router.get("/:id", getMenuById);

module.exports = router;
