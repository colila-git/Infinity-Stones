const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

router.get("/sports", eventController.getSports);

module.exports = router;