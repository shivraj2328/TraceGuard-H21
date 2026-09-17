const express = require("express");
const { protect } = require("../../middleware/auth.middleware");
const { dashboardSummary } = require("../../controllers/dashboard.controller");

const router = express.Router();

router.get("/summary", protect, dashboardSummary);

module.exports = router;
