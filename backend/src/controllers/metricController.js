const ServerMetric = require("../models/serverMetric.model");
const asyncHandler = require("../utils/asyncHandler");

const normalizeLoad = (value) => {
  if (Array.isArray(value)) {
    return {
      oneMinute: Number(value[0]) || 0,
      fiveMinutes: Number(value[1]) || 0,
      fifteenMinutes: Number(value[2]) || 0,
    };
  }
  return {
    oneMinute: Number(value?.oneMinute) || 0,
    fiveMinutes: Number(value?.fiveMinutes) || 0,
    fifteenMinutes: Number(value?.fifteenMinutes) || 0,
  };
};

const ingestMetrics = asyncHandler(async (req, res) => {
  const { serviceName, hostname, timestamp, loadAverage, memory } = req.body || {};

  if (!serviceName || !hostname || !loadAverage || !memory) {
    return res.status(400).json({
      success: false,
      message: "serviceName, hostname, loadAverage, and memory are required",
    });
  }

  const metric = await ServerMetric.create({
    serviceName,
    hostname,
    timestamp: timestamp ? new Date(timestamp) : new Date(),
    loadAverage: normalizeLoad(loadAverage),
    memory: {
      total: Number(memory.total) || 0,
      used: Number(memory.used) || 0,
      free: Number(memory.free) || 0,
      usedPercent: Number(memory.usedPercent) || 0,
    },
    cpuPercent: req.body.cpuPercent ?? null,
    disk: req.body.disk || {},
    network: req.body.network || {},
    metadata: req.body.metadata || {},
  });

  res.status(201).json({
    success: true,
    id: metric._id,
  });
});

const getLatestMetrics = asyncHandler(async (req, res) => {
  const filter = req.query.service ? { serviceName: req.query.service } : {};
  const metric = await ServerMetric.findOne(filter).sort({ timestamp: -1 }).lean();

  if (!metric) {
    return res.status(404).json({
      success: false,
      message: "No metrics found",
    });
  }

  res.json({ success: true, data: metric });
});

const getMetricsHistory = asyncHandler(async (req, res) => {
  const safeMinutes = Math.min(Math.max(Number(req.query.minutes) || 60, 1), 10080);
  const safeLimit = Math.min(Math.max(Number(req.query.limit) || 500, 1), 2000);

  const filter = {
    timestamp: { $gte: new Date(Date.now() - safeMinutes * 60 * 1000) },
    ...(req.query.service ? { serviceName: req.query.service } : {}),
  };

  const data = await ServerMetric.find(filter)
    .sort({ timestamp: 1 })
    .limit(safeLimit)
    .lean();

  res.json({
    success: true,
    service: req.query.service || "all",
    timeframeMinutes: safeMinutes,
    count: data.length,
    data,
  });
});

module.exports = {
  ingestMetrics,
  getLatestMetrics,
  getMetricsHistory,
};
