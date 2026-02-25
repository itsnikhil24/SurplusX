const express = require("express");
const router = express.Router();

const { smartAllocate } = require("../controllers/allocationController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");


// Smart Allocation Route
router.post(
    "/smart-allocate",
    protect,
    authorizeRoles("restaurant"),
    smartAllocate
);


module.exports = router;