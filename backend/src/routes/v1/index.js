const express = require("express");
const authRoutes = require("./authRoutes");
const telemetryRoutes = require("./telemetryRoutes");
const metricsRoutes = require("./metricsRoutes");
const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', version: 'v1' });
});
const authRoutes = require('./auth.routes');
router.use('/auth', authRoutes);
router.use("/auth", authRoutes);
router.use("/telemetry", telemetryRoutes);
router.use("/metrics", metricsRoutes);

module.exports = router;
