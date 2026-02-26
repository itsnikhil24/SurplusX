const NGORequest = require("../models/NgoRequest");
const SurplusItem = require("../models/SurplusItem");

const smartAllocateFood = async (req, res) => {
  try {

    const { surplusId } = req.body;

    if (!surplusId) {
      return res.status(400).json({
        message: "surplusId is required"
      });
    }

    // Get one donation item
    const donation = await SurplusItem.findById(surplusId);

    if (!donation) {
      return res.status(404).json({
        message: "Surplus item not found"
      });
    }

    if (donation.decision !== "donate") {
      return res.status(400).json({
        message: "This item is not marked for donation"
      });
    }

    if (donation.allocationStatus !== "unassigned") {
      return res.status(400).json({
        message: "Item already allocated"
      });
    }

    const ngoRequests = await NGORequest.find({
      status: "pending",
      isActive: true
    });

    if (!ngoRequests.length) {
      return res.status(400).json({
        message: "No NGO requests available"
      });
    }

    let bestNGO = null;
    let bestScore = -1;

    // Distance Formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {

      const R = 6371;

      const dLat = (lat2 - lat1) * Math.PI/180;
      const dLon = (lon2 - lon1) * Math.PI/180;

      const a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1*Math.PI/180) *
        Math.cos(lat2*Math.PI/180) *
        Math.sin(dLon/2) *
        Math.sin(dLon/2);

      const c = 2 * Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

      return R * c;
    };


    for (let ngo of ngoRequests) {

      const freeCapacity =
        ngo.totalCapacity - ngo.currentLoad;

      if (freeCapacity <= 0) continue;

      if (
        !donation.coordinates ||
        !ngo.coordinates
      ) continue;


      const distance = calculateDistance(

        donation.coordinates.latitude,
        donation.coordinates.longitude,

        ngo.coordinates.latitude,
        ngo.coordinates.longitude

      );

      const distanceScore =
        Math.max(0, 100 - distance);


      const hoursLeft =
        (new Date(ngo.requiredDate) - new Date())
        / 3600000;

      let urgencyScore = 0;

      if (hoursLeft < 24) urgencyScore = 100;
      else if (hoursLeft < 72) urgencyScore = 70;
      else urgencyScore = 40;


      const capacityScore =
        (freeCapacity / ngo.totalCapacity) * 100;


      let foodScore = 20;

      if (ngo.foodType === "Both")
        foodScore = 50;

      else if (
        donation.itemName
        .toLowerCase()
        .includes("veg") &&
        ngo.foodType === "Veg"
      )
        foodScore = 50;


      const expiryHours =
        (new Date(donation.expiryDate) - new Date())
        / 3600000;

      let expiryScore = 0;

      if (expiryHours < 6)
        expiryScore = 100;
      else if (expiryHours < 24)
        expiryScore = 70;
      else
        expiryScore = 40;


      const totalScore =

        (distanceScore * 0.3) +
        (urgencyScore * 0.25) +
        (capacityScore * 0.2) +
        (foodScore * 0.1) +
        (expiryScore * 0.15);


      if (totalScore > bestScore) {

        bestScore = totalScore;

        bestNGO = ngo;

      }

    }


    if (!bestNGO) {
      return res.status(400).json({
        message: "No suitable NGO found"
      });
    }


    donation.assignedNgo = bestNGO._id;

    donation.allocationStatus = "assigned";

    await donation.save();


    bestNGO.currentLoad += donation.quantity;

    if (bestNGO.currentLoad >= bestNGO.totalCapacity)
      bestNGO.status = "fulfilled";

    await bestNGO.save();


    res.json({

      message: "Smart Allocation Completed",

      surplusId: donation._id,

      ngoId: bestNGO._id,

      ngoName: bestNGO.ngoName,

      score: Math.round(bestScore)

    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = {
  smartAllocateFood
};