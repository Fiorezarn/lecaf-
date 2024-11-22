const express = require("express");
const router = express.Router();
const {
  createPolyline,
  createDistance,
} = require("@/controllers/maps.controller");

router.post("/create-polyline", createPolyline);
router.post("/create-distance", createDistance);

module.exports = router;
