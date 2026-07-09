const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// Registration
router.post("/register", authController.register);

// Test
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth routes are working!"
    });
});

module.exports = router;

router.post("/login", authController.login);