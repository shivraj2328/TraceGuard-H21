const Service = require("../models/service.model");
const asyncHandler = require("../utils/asyncHandler");

const listServices = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.search) {
    filter.name = new RegExp(
      String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i"
    );
  }

  const services = await Service.find(filter).sort({ name: 1 }).lean();

  res.json({
    success: true,
    count: services.length,
    data: services,
  });
});

const upsertService = asyncHandler(async (req, res) => {
  const {
    serviceId,
    name,
    environment,
    status,
    latencyMs,
    uptimePercent,
    throughputPerMinute,
    errorRatePercent,
    activeEndpoints,
    totalEndpoints,
    metadata,
  } = req.body || {};

  if (!name) {
    return res.status(400).json({
      success: false,
      message: "name is required",
    });
  }

  const service = await Service.findOneAndUpdate(
    { serviceId: serviceId || `srv-${name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}` },
    {
      $set: {
        name,
        environment: environment || "Production",
        ...(status !== undefined && { status }),
        ...(latencyMs !== undefined && { latencyMs: Number(latencyMs) }),
        ...(uptimePercent !== undefined && { uptimePercent: Number(uptimePercent) }),
        ...(throughputPerMinute !== undefined && { throughputPerMinute: Number(throughputPerMinute) }),
        ...(errorRatePercent !== undefined && { errorRatePercent: Number(errorRatePercent) }),
        ...(activeEndpoints !== undefined && { activeEndpoints: Number(activeEndpoints) }),
        ...(totalEndpoints !== undefined && { totalEndpoints: Number(totalEndpoints) }),
        ...(metadata !== undefined && { metadata }),
        lastHeartbeat: new Date(),
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    success: true,
    data: service,
  });
});

module.exports = { listServices, upsertService };
