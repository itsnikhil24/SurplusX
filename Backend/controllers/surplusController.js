// controllers/surplusController.js
const SurplusItem = require("../models/SurplusItem");
// const SurplusItem = require("../models/SurplusItem");
const User = require("../models/User"); // <-- Add this line
const NgoRequest = require("../models/NgoRequest"); // If this is in the same file

// Helper to calculate weighted score
const calculateScore = (quantity, expiryDate, pricePerUnit) => {

    let quantityScore = quantity <= 50 ? 1 :
        quantity <= 100 ? 3 : 5;

    const daysLeft = (new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
    let expiryScore = daysLeft <= 1 ? 1 :
        daysLeft <= 5 ? 3 : 5;

    let demandScore = pricePerUnit <= 10 ? 1 :
        pricePerUnit <= 50 ? 3 : 5;

    // Weighted score
    const score = quantityScore * 0.4 + expiryScore * 0.4 + demandScore * 0.2;

    return score;
};

// -----------------------------
// Upload Surplus Item (final decision automatic)
// -----------------------------
exports.uploadSurplus = async (req, res) => {
    try {

        const {
            itemName,
            quantity,
            unit,
            expiryDate,
            pricePerUnit,
            restaurantLocation,
            coordinates
        } = req.body;

        console.log( itemName,
            quantity,
            unit,
            expiryDate,
            pricePerUnit,
            restaurantLocation,
            coordinates);

        if (!itemName || !quantity || !expiryDate || !pricePerUnit) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        const score = calculateScore(quantity, expiryDate, pricePerUnit);

        const decision = score >= 4 ? "sell" : "donate";

        const surplus = await SurplusItem.create({

            restaurantId: req.user._id,

            itemName,
            quantity,
            unit: unit || "kg",
            expiryDate,
            pricePerUnit,

            suggestedDecision: decision,
            decision,

            status: "confirmed",
            currentState: "inStock",

            restaurantLocation,

            coordinates: {
                latitude: coordinates?.latitude,
                longitude: coordinates?.longitude
            }

        });

        res.status(201).json({
            message: "Surplus uploaded successfully",
            decision,
            surplus
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error",
            error: error.message
        });

    }
};

// -----------------------------
// Update Stock State (sold or donated)
// -----------------------------
exports.updateStockState = async (req, res) => {
    try {
        const { surplusId, newState } = req.body;

        if (!["sold", "donated"].includes(newState)) {
            return res.status(400).json({ message: "newState must be 'sold' or 'donated'" });
        }

        const surplus = await SurplusItem.findOne({
            _id: surplusId,
            restaurantId: req.user._id
        });

        if (!surplus) {
            return res.status(404).json({ message: "Surplus item not found" });
        }

        // Update current state
        surplus.currentState = newState;
        await surplus.save();

        res.status(200).json({
            message: `Item marked as '${newState}'`,
            surplus
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

/*
GET RESTAURANT SURPLUS ITEMS
GET /api/surplus/my-items
Private (Restaurant)
*/

exports.getMySurplus = async (req, res) => {

  try {

    const surplusItems = await SurplusItem.find({

      restaurantId: req.user._id,
      decision: "donate"

    }).sort({ createdAt: -1 });


    res.status(200).json({

      success: true,
      count: surplusItems.length,
      data: surplusItems

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Meals Saved (Sum of all quantity in SurplusItem)
    const mealsSavedAgg = await SurplusItem.aggregate([
      { $group: { _id: null, total: { $sum: "$quantity" } } }
    ]);
    const mealsSaved = mealsSavedAgg[0]?.total || 0;

    // 2. Revenue Generated (Sum of quantity * price for sold items)
    const revenueAgg = await SurplusItem.aggregate([
      { $match: { currentState: "sold" } },
      { $group: { _id: null, total: { $sum: { $multiply: ["$quantity", "$pricePerUnit"] } } } }
    ]);
    const revenue = revenueAgg[0]?.total || 0;

    // 3. Donations Delivered (Count of items marked as donated)
    const donations = await SurplusItem.countDocuments({ allocationStatus: "assigned" });

    // 4. Active Restaurants (Count of users with role 'restaurant')
    const restaurants = await User.countDocuments({ role: "restaurant" });

    res.status(200).json({
      success: true,
      data: { mealsSaved, revenue, donations, restaurants }
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
GET RECENT SURPLUS
GET /api/surplus/recent
Private
*/
exports.getRecentSurplus = async (req, res) => {
  try {
    // Fetch the 5 most recently created surplus items, populating the restaurant name
    const recentItems = await SurplusItem.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("restaurantId", "organizationName name");

    res.status(200).json({
      success: true,
      data: recentItems
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/*
GET MARKETPLACE ITEMS
GET /api/surplus/marketplace
Public or Private (Items meant for sale)
*/
exports.getMarketplaceItems = async (req, res) => {
    try {
        // Fetch only items that are meant to be sold and are currently in stock
        const items = await SurplusItem.find({
            decision: "sell",
            currentState: "inStock"
        })
        .sort({ createdAt: -1 }) // Newest first
        .populate("restaurantId", "organizationName name address");

        res.status(200).json({
            success: true,
            count: items.length,
            data: items
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/*
BUY SURPLUS ITEM
POST /api/surplus/buy/:id
Private (Buyer authenticated)
*/
exports.buySurplusItem = async (req, res) => {
    try {
        const surplusId = req.params.id;

        // 1. Find the item
        const surplus = await SurplusItem.findById(surplusId);

        if (!surplus) {
            return res.status(404).json({ message: "Surplus item not found" });
        }

        // 2. Check if it's actually for sale
        if (surplus.decision !== "sell") {
            return res.status(400).json({ message: "This item is not available for sale." });
        }

        // 3. Check if it's already sold
        if (surplus.currentState !== "inStock") {
            return res.status(400).json({ message: "Sorry, this item has already been sold." });
        }

        // 4. Mark as sold 
        // (In a real-world app, you would integrate a payment gateway here)
        surplus.currentState = "sold";
        await surplus.save();

        res.status(200).json({
            success: true,
            message: "Item purchased successfully!",
            data: surplus
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};