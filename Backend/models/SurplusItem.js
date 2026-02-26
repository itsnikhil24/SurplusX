const mongoose = require("mongoose");

const surplusItemSchema = new mongoose.Schema(
{
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    itemName: {
        type: String,
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    unit: {
        type: String,
        default: "kg"
    },

    expiryDate: {
        type: Date,
        required: true
    },

    pricePerUnit: {
        type: Number,
        required: true
    },

    // AI suggestion
    suggestedDecision: {
        type: String,
        enum: ["sell", "donate"],
        required: true
    },

    // Final decision
    decision: {
        type: String,
        enum: ["sell", "donate"],
        default: null
    },

    status: {
        type: String,
        enum: ["pending", "confirmed"],
        default: "pending"
    },

    // Stock status
    currentState: {
        type: String,
        enum: ["inStock", "sold", "donated"],
        default: "inStock"
    },

    // NGO Allocation
    assignedNgo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NgoRequest",
        default: null
    },

    allocationStatus: {
        type: String,
        enum: ["unassigned","assigned","delivered"],
        default: "unassigned"
    },

    // Restaurant location for smart allocation
    restaurantLocation: {
        type: String
    },

    coordinates: {
        latitude: Number,
        longitude: Number
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("SurplusItem", surplusItemSchema);