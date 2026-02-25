// models/SurplusItem.js
const mongoose = require("mongoose");

const surplusItemSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        itemName: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: "kg" },
        expiryDate: { type: Date, required: true },
        pricePerUnit: { type: Number, required: true },
        suggestedDecision: { type: String, enum: ["sell", "donate"], required: true },
        decision: { type: String, enum: ["sell", "donate"], default: null },
        status: { type: String, enum: ["pending", "confirmed"], default: "pending" },
        currentState: {
            type: String,
            enum: ["inStock", "sold", "donated"],
            default: "inStock"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SurplusItem", surplusItemSchema);