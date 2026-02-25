const express = require("express");
const router = express.Router();
const { uploadSurplus, updateStockState } = require("../controllers/surplusController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Upload surplus (AI suggestion = final decision)
router.post("/upload", protect, authorizeRoles("restaurant"), uploadSurplus);

// Update stock state to sold or donated
router.post("/update-stock", protect, authorizeRoles("restaurant"), updateStockState);

module.exports = router;