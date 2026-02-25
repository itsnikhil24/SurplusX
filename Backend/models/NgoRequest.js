const mongoose = require("mongoose");

const ngoRequestSchema = new mongoose.Schema({
    
    ngo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    foodType: {
        type: String,
        enum: ["Veg", "Non-Veg", "Both"],
        required: true
    },

    foodCategory: {
        type: String,
        enum: ["Cooked", "Raw", "Packed"],
        required: true
    },

    quantity: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    requiredDate: {
        type: Date,
        required: true
    },

    description: {
        type: String
    },

    status: {
        type: String,
        enum: ["pending", "fulfilled", "cancelled"],
        default: "pending"
    }

}, { timestamps: true });

module.exports = mongoose.model("NgoRequest", ngoRequestSchema);