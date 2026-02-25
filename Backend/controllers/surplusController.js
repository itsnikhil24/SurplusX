// controllers/surplusController.js
const SurplusItem = require("../models/SurplusItem");

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
        const { itemName, quantity, unit, expiryDate, pricePerUnit } = req.body;

        if (!itemName || !quantity || !expiryDate || !pricePerUnit) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Calculate score
        const score = calculateScore(quantity, expiryDate, pricePerUnit);

        // Final decision directly from AI suggestion
        const decision = score >= 7 ? "sell" : "donate";

        // Create surplus item
        const surplus = await SurplusItem.create({
            restaurantId: req.user._id,
            itemName,
            quantity,
            unit: unit || "kg",
            expiryDate,
            pricePerUnit,
            suggestedDecision: decision,  // can keep for reference
            decision,                     // final decision
            status: "confirmed",          // auto confirmed
            currentState: "inStock"       // initial stock state
        });

        res.status(201).json({
            message: "Surplus uploaded successfully",
            decision,
            surplus
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error", error: error.message });
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