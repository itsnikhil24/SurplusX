const express = require("express");
const router = express.Router();

const { createNgoRequest } = require("../controllers/ngoController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");


/*
CREATE NGO REQUEST
Only NGO can create
*/

router.post(
  "/request",
  protect,
  authorizeRoles("ngo"),
  createNgoRequest
);


module.exports = router;