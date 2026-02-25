const SurplusItem = require("../models/SurplusItem");
const NgoRequest = require("../models/NgoRequest");
const User = require("../models/User");


// Smart Allocation
exports.smartAllocate = async (req, res) => {

    try {

        const { surplusId } = req.body;

        // Get surplus item
        const surplus = await SurplusItem.findById(surplusId)
            .populate("restaurantId");

        if (!surplus) {
            return res.status(404).json({
                message: "Surplus not found"
            });
        }

        if (surplus.currentState !== "inStock") {
            return res.status(400).json({
                message: "Item already used"
            });
        }


        // Get all pending NGO requests
        const ngoRequests = await NgoRequest.find({
            status: "pending"
        }).populate("ngo");


        if (ngoRequests.length === 0) {
            return res.status(404).json({
                message: "No NGO requests found"
            });
        }


        let bestNgo = null;
        let bestScore = 0;


        ngoRequests.forEach(request => {

            // NEED SCORE
            const needScore = request.quantity / surplus.quantity;


            // DISTANCE SCORE
            let distanceScore = 0.5;

            if (
                request.location.toLowerCase() ===
                surplus.restaurantId.location.toLowerCase()
            ) {
                distanceScore = 1;
            }


            // FINAL SCORE
            const score =
                needScore * 0.6 +
                distanceScore * 0.4;


            if (score > bestScore) {
                bestScore = score;
                bestNgo = request;
            }

        });


        if (!bestNgo) {
            return res.status(404).json({
                message: "No suitable NGO found"
            });
        }


        // Update Surplus
        surplus.currentState = "donated";
        await surplus.save();


        // Update NGO Request
        bestNgo.status = "fulfilled";
        await bestNgo.save();


        res.status(200).json({

            message: "Smart Allocation Successful",

            allocatedNgo: bestNgo.ngo.name,

            location: bestNgo.location,

            quantity: bestNgo.quantity,

            surplusItem: surplus.itemName

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};