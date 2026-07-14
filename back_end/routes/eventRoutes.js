const authorizeModerator = require("../middleware/authorizeModerator");
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authenticate = require("../middleware/authenticate");

router.get("/sports", eventController.getSports);

router.get("/sports/:id", eventController.getSportById);

router.post(
    "/sports",
    authenticate,
    authorizeModerator,
    eventController.createSport
);

router.put(
    "/sports/:id",
    authenticate,
    authorizeModerator,
    eventController.updateSport
);

router.delete(
    "/sports/:id",
    authenticate,
    authorizeModerator,
    eventController.deleteSport
);

module.exports = router;