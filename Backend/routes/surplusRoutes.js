const express = require("express");

const router = express.Router();

const {
    uploadSurplus,
    updateStockState,
    getMySurplus,
    getDashboardStats, 
    getRecentSurplus,
    getMarketplaceItems, // <-- Add this
    buySurplusItem       // <-- Add this
} = require("../controllers/surplusController");

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
// Fetch items specifically for the Marketplace UI
// (You can add the 'protect' middleware if you only want logged-in users to view it)
router.get("/marketplace", getMarketplaceItems);

// Handle the "Buy Now" button click
// Passing the ID in the URL params
router.post("/buy/:id", protect, buySurplusItem);



module.exports = router;