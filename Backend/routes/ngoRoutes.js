const express = require("express");

const router = express.Router();

const {
  createNgoRequest,
  getNgoRequests
} = require("../controllers/ngoController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");


// NGO create request
router.post(
  "/request",
  protect,
  authorizeRoles("ngo"),
  createNgoRequest
);


// Restaurant fetch NGO requests
router.get(
  "/requests",
  protect,
  authorizeRoles("restaurant"),
  getNgoRequests
);


module.exports = router;