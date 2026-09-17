const crypto = require("crypto");
const Telemetry = require("../models/telemetry.model");
const SecurityAlert = require("../models/securityAlert.model");
const Service = require("../models/service.model");
const asyncHandler = require("../utils/asyncHandler");

const makeTraceId = () => `tr_${crypto.randomBytes(4).toString("hex")}`;

const normalizeStatus = (value) => {
  const status = String(value || "SUCCESS").toUpperCase();
  return ["SUCCESS", "FLAGGED", "BLOCKED", "ERROR"].includes(status)
    ? status
    : "SUCCESS";
};

const inferSecurityAlert = (event) => {
  const text = `${event.event} ${JSON.stringify(event.payload || {})}`.toLowerCase();

  if (/sql.?injection|\bor\s+1\s*=\s*1|union\s+select|drop\s+table/.test(text)) {
    return {
      title: "SQL Injection Attack Vector",
      category: "Payload Security",
      severity: "Critical",
      details: "A telemetry event matched a SQL-injection detection pattern.",
    };
  }

  if (/xss|<script|javascript:|onerror\s*=/.test(text)) {
    return {
      title: "Cross-Site Scripting Pattern",
      category: "Payload Security",
      severity: "Warning",
      details: "A telemetry event matched a cross-site scripting detection pattern.",
    };
  }

  if (/rate.?limit|too many requests|abusive traffic/.test(text)) {
    return {
      title: "Rate Limit Spike Detected",
      category: "DDoS / Abusive Traffic",
      severity: "Critical",
      details: "A telemetry event indicates an abnormal request-rate condition.",
    };
  }

  if (event.status === "BLOCKED") {
    return {
      title: "Blocked Security Event",
      category: "Security Monitoring",
      severity: "Warning",
      details: "An event was marked BLOCKED by the producing service or SDK.",
    };
  }

  return null;
};

const ingestTelemetry = asyncHandler(async (req, res) => {
  const body = req.body || {};

  if (!body.service || !body.event) {
    return res.status(400).json({
      success: false,
      message: "service and event are required",
    });
  }

  const timestamp = body.timestamp ? new Date(body.timestamp) : new Date();

  if (Number.isNaN(timestamp.getTime())) {
    return res.status(400).json({
      success: false,
      message: "timestamp must be a valid date",
    });
  }

  const telemetry = await Telemetry.create({
    traceId: body.traceId || body.id || makeTraceId(),
    service: body.service,
    event: body.event,
    status: normalizeStatus(body.status),
    latencyMs: Number(body.latencyMs ?? body.latency ?? 0) || 0,
    timestamp,
    clientIp: body.clientIp || req.ip,
    httpMethod: body.httpMethod || body.method,
    endpoint: body.endpoint || body.path,
    headers: body.headers || {},
    payload: body.payload || body.metadata || {},
    environment: body.environment || "production",
    error: body.error || null,
    sdkVersion: body.sdkVersion,
    metadata: body.metadata || {},
  });

  await Service.findOneAndUpdate(
    { name: telemetry.service },
    {
      $set: {
        lastHeartbeat: new Date(),
        environment: telemetry.environment,
      },
      $setOnInsert: {
        serviceId: `srv-${telemetry.service.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`,
        name: telemetry.service,
      },
    },
    { upsert: true, new: true }
  );

  const alertData = inferSecurityAlert(telemetry);

  if (alertData) {
    await SecurityAlert.create({
      alertId: `ALT-${Date.now().toString().slice(-6)}${crypto.randomInt(10, 99)}`,
      ...alertData,
      endpoint: telemetry.endpoint,
      ip: telemetry.clientIp,
      traceId: telemetry.traceId,
      timestamp: telemetry.timestamp,
      metadata: { telemetryId: telemetry._id },
    });
  }

  res.status(201).json({
    success: true,
    id: telemetry._id,
    traceId: telemetry.traceId,
  });
});

const listTelemetry = asyncHandler(async (req, res) => {
  const {
    service,
    status,
    search,
    minutes = 60,
    limit = 100,
    page = 1,
  } = req.query;

  const safeMinutes = Math.min(Math.max(Number(minutes) || 60, 1), 10080);
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 500);
  const safePage = Math.max(Number(page) || 1, 1);

  const filter = {
    timestamp: { $gte: new Date(Date.now() - safeMinutes * 60 * 1000) },
  };

  if (service) filter.service = service;
  if (status) filter.status = status.toUpperCase();

  if (search) {
    const regex = new RegExp(String(search).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filter.$or = [
      { traceId: regex },
      { service: regex },
      { event: regex },
      { endpoint: regex },
    ];
  }

  const [data, total] = await Promise.all([
    Telemetry.find(filter)
      .sort({ timestamp: -1 })
      .skip((safePage - 1) * safeLimit)
      .limit(safeLimit)
      .lean(),
    Telemetry.countDocuments(filter),
  ]);

  res.json({
    success: true,
    page: safePage,
    limit: safeLimit,
    total,
    data,
  });
});

const getTelemetry = asyncHandler(async (req, res) => {
  const trace = await Telemetry.findOne({ traceId: req.params.traceId }).lean();

  if (!trace) {
    return res.status(404).json({
      success: false,
      message: "Trace not found",
    });
  }

  res.json({ success: true, data: trace });
});

module.exports = { ingestTelemetry, listTelemetry, getTelemetry };
