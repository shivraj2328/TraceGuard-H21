const crypto = require("crypto");
const ApiKey = require("../models/apiKey.model");
const asyncHandler = require("../utils/asyncHandler");
const { hashApiKey } = require("../utils/apiKey");

const verifyApiKey = asyncHandler(async (req, res, next) => {
  const configuredKey = process.env.METRICS_API_KEY;

  // Backward-compatible bootstrap mode: a static ingestion key can be used
  // before project API keys are created.
  const header = req.headers.authorization || "";
  const supplied = header.startsWith("Bearer ")
    ? header.slice(7).trim()
    : req.headers["x-traceguard-api-key"];

  if (!supplied) {
    return res.status(401).json({
      success: false,
      message: "Telemetry API key is required",
    });
  }

  if (configuredKey && crypto.timingSafeEqual(
    Buffer.from(supplied),
    Buffer.from(configuredKey)
  )) {
    req.apiKey = { type: "static" };
    return next();
  }

  const keyHash = hashApiKey(supplied);
  const apiKey = await ApiKey.findOne({
    keyHash,
    revokedAt: null,
  });

  if (!apiKey) {
    return res.status(403).json({
      success: false,
      message: "Invalid or revoked telemetry API key",
    });
  }

  apiKey.lastUsedAt = new Date();
  await apiKey.save();

  req.apiKey = apiKey;
  next();
});

module.exports = { verifyApiKey };
