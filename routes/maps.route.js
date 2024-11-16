const express = require("express");
const router = express.Router();
const { createPolyline } = require("@/controllers/maps.controller");

router.post("/create-polyline", createPolyline);

module.exports = router;
