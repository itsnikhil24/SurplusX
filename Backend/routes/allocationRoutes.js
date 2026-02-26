const express = require("express");

const router = express.Router();

const {
  smartAllocateFood
} = require("../controllers/allocationController");


// AI Allocation Route

router.post("/smart-allocate", smartAllocateFood);

module.exports = router;