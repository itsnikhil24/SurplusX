const NgoRequest = require("../models/NgoRequest");

/*
CREATE NGO REQUEST
POST /api/ngo/request
Private (NGO Only)
*/

exports.createNgoRequest = async (req, res) => {

  try {

    const {
      ngoName,
      foodType,
      foodCategory,
      quantity,
      location,
      coordinates,
      requiredDate,
      description,
      totalCapacity
    } = req.body;


    if (
      !ngoName ||
      !foodType ||
      !foodCategory ||
      !quantity ||
      !location ||
      !requiredDate ||
      !totalCapacity
    ) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }


    const request = await NgoRequest.create({

      ngo: req.user._id,

      ngoName: ngoName,

      foodType: foodType,

      foodCategory: foodCategory,

      quantity: quantity,

      location: location,

      coordinates: coordinates,

      requiredDate: requiredDate,

      description: description,

      totalCapacity: totalCapacity,

      currentLoad: 0

    });


    res.status(201).json({

      success: true,
      message: "NGO Request Created Successfully",
      data: request

    });


  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

/*
GET ALL NGO REQUESTS
GET /api/ngo/requests
Private (Restaurant)
*/

exports.getNgoRequests = async (req, res) => {

  try {

    const requests = await NgoRequest
      .find({ status: "pending" })
      .populate("ngo", "name email");


    res.status(200).json({

      success: true,
      count: requests.length,
      data: requests

    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};