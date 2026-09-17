const Telemetry = require("../models/telemetry.model");
const SecurityAlert = require("../models/securityAlert.model");
const Service = require("../models/service.model");
const asyncHandler = require("../utils/asyncHandler");

const dashboardSummary = asyncHandler(async (req, res) => {
  const since = new Date(Date.now() - 60 * 60 * 1000);

  const [
    totalTraces,
    activeThreats,
    criticalThreats,
    services,
    recentTraces,
  ] = await Promise.all([
    Telemetry.countDocuments({ timestamp: { $gte: since } }),
    SecurityAlert.countDocuments({ status: "Active" }),
    SecurityAlert.countDocuments({ status: "Active", severity: "Critical" }),
    Service.find({}).sort({ name: 1 }).limit(100).lean(),
    Telemetry.find({ timestamp: { $gte: since } })
      .sort({ timestamp: -1 })
      .limit(8)
      .lean(),
  ]);

  const successful = recentTraces.filter((x) => x.status === "SUCCESS");
  const averageLatency = recentTraces.length
    ? recentTraces.reduce((sum, x) => sum + (Number(x.latencyMs) || 0), 0) / recentTraces.length
    : 0;

  res.json({
    success: true,
    data: {
      totalTraces,
      activeThreats,
      criticalThreats,
      monitoredServices: services.length,
      healthyServices: services.filter((s) => s.status === "Healthy").length,
      systemHealthScore: recentTraces.length
        ? Number(((successful.length / recentTraces.length) * 100).toFixed(2))
        : null,
      averageLatencyMs: Number(averageLatency.toFixed(2)),
      services,
      recentTraces,
    },
  });
});

module.exports = { dashboardSummary };
