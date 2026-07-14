const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Registration
router.post("/register", authController.register);

router.post("/login", authController.login);
router.post("/mod-login", authController.modLogin);

// Test
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth routes are working!"
    });
});

router.post("/me", authController.getCurrentUser);

module.exports = router;