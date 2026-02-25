const NgoRequest = require("../models/NgoRequest");


/*
CREATE NGO REQUEST
POST /api/ngo/request
Private (NGO Only)
*/

exports.createNgoRequest = async (req, res) => {

  try {

    const {
      foodType,
      foodCategory,
      quantity,
      location,
      requiredDate,
      description
    } = req.body;


    // Validation
    if (!foodType || !foodCategory || !quantity || !location || !requiredDate) {
      return res.status(400).json({
        message: "Please fill all required fields"
      });
    }


    const request = await NgoRequest.create({

      ngo: req.user._id, // From token

      foodType,
      foodCategory,
      quantity,
      location,
      requiredDate,
      description

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