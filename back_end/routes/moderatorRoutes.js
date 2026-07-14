const express = require("express");
const router = express.Router();

const moderatorController = require("../controllers/moderatorController");
const { verifyModerator } = require("../middleware/authMiddleware");

router.get("/check", verifyModerator, moderatorController.checkModerator);
router.get("/pending", verifyModerator, moderatorController.getPendingModerators);
router.get("/accepted", verifyModerator, moderatorController.getAcceptedModerators);
router.get("/rejected", verifyModerator, moderatorController.getRejectedModerators);
router.get("/all", verifyModerator, moderatorController.getAllModerators);
router.get("/stats", verifyModerator, moderatorController.getModeratorStats);

router.patch("/:uid/approve", verifyModerator, moderatorController.approveModerator);
router.patch("/:uid/reject", verifyModerator, moderatorController.rejectModerator);

module.exports = router;


module.exports = router;