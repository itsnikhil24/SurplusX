const mongoose = require("mongoose");

const ngoRequestSchema = new mongoose.Schema({

    // NGO User ID
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // NGO Name (for fast display)
    ngoName: {
        type: String,
        required: true
    },

    // Food preference
    foodType: {
        type: String,
        enum: ["Veg", "Non-Veg", "Both"],
        required: true
    },

    // Food category
    foodCategory: {
        type: String,
        enum: ["Cooked", "Raw", "Packed"],
        required: true
    },

    // Required quantity
    quantity: {
        type: Number,
        required: true
    },

    // NGO Location (City name)
    location: {
        type: String,
        required: true
    },

    // Coordinates for smart allocation
    coordinates: {

        latitude: Number,
        longitude: Number

    },

    // Required Date
    requiredDate: {
        type: Date,
        required: true
    },

    description: {
        type: String
    },

    // Capacity System (For UI bars)
    totalCapacity: {
        type: Number,
        required: true
    },

    currentLoad: {
        type: Number,
        default: 0
    },

    // NGO accepting donations or not
    isActive: {
        type: Boolean,
        default: true
    },

    // Request status
    status: {
        type: String,
        enum: ["pending", "fulfilled", "cancelled"],
        default: "pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("NgoRequest", ngoRequestSchema);