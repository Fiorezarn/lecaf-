const express = require("express");
const { countData } = require("@/controllers/dashboard.controller");
const router = express.Router();

router.get("/", countData);

module.exports = router;
