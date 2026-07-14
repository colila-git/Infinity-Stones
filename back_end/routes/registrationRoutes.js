const express = require("express");

const router = express.Router();

const registrationController = require("../controllers/registrationController");
const authenticate = require("../middleware/authenticate");
const authorizeModerator = require("../middleware/authorizeModerator");

router.get(
    "/",
    authenticate,
    authorizeModerator,
    registrationController.getRegistrations
);

router.post(
    "/",
    authenticate,
    registrationController.registerStudent
);

router.get(
    "/my",
    authenticate,
    registrationController.getMyRegistrations
);

router.get(
    "/",
    authenticate,
    authorizeModerator,
    registrationController.getRegistrations
);

router.patch(
    "/:id/approve",
    authenticate,
    authorizeModerator,
    registrationController.approveRegistration
);

router.patch(
    "/:id/reject",
    authenticate,
    authorizeModerator,
    registrationController.rejectRegistration
);

router.patch(
    "/:id/approve",
    authenticate,
    authorizeModerator,
    registrationController.approveRegistration
);

router.patch(
    "/:id/reject",
    authenticate,
    authorizeModerator,
    registrationController.rejectRegistration
);

module.exports = router;