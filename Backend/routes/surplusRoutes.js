const express = require("express");

const router = express.Router();

const {
    uploadSurplus,
    updateStockState,
    getMySurplus
} = require("../controllers/surplusController");
const { getDashboardStats, getRecentSurplus } = require("../controllers/surplusController.js");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");


// Upload surplus
router.post(
    "/upload",
    protect,
    authorizeRoles("restaurant"),
    uploadSurplus
);


// Update stock
router.post(
    "/update-stock",
    protect,
    authorizeRoles("restaurant"),
    updateStockState
);


// Fetch surplus items
router.get(
    "/my-items",
    protect,
    authorizeRoles("restaurant"),
    getMySurplus
);
router.get("/dashboard/stats", getDashboardStats);
router.get("/surplus/recent", getRecentSurplus);



module.exports = router;