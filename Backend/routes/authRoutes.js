const express = require("express");
const router = express.Router();
const { registerUser, loginUser,getMe  } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");


// Register a user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);
router.get("/me", protect, getMe);

module.exports = router;