require("dotenv").config();
const {
  init,
  getConnection,
  SDKResponse,
  MetricAgent,
} = require("@traceguardignite/traceguard-sdk");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const ENV = require("./utils/env");
const logger = require("./utils/logger");
const authRouter = require("./routes/auth.route");
const connectDB = require("./utils/connection");

const app = express();

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "example express server" });
});
const traceguardPkg = require("@traceguardignite/traceguard-sdk");
console.log("TRACEGUARD KEYS:", Object.keys(traceguardPkg));
console.log("METRIC AGENT TYPE:", typeof traceguardPkg.MetricAgent);
console.log(
  "TRACEGUARD RESOLVED TO:",
  require.resolve("@traceguardignite/traceguard-sdk"),
);
console.log(process?.env?.BASE_MAIN_BACKEND_URL);
connectDB()
  .then(async () => {
    app.listen(ENV.PORT, () => {
      logger.info("server is listening on http://localhost:" + ENV.PORT);
    });

    await init({
      connection: `${process?.env?.BASE_MAIN_BACKEND_URL}/api/v1/telemetry/verify`,
      id: "project_test_server",
    });

    const agent = new MetricAgent({
      endpoint: `${process?.env?.BASE_MAIN_BACKEND_URL}/api/v1/metrics`,
      apiKey: process.env.METRICS_API_KEY,
      serviceName: "test-server",
      intervalMs: 15000,
      onError: (err) => logger.error(`[MetricAgent]: ${err.message}`),
    });

    agent.start();
  })
  .catch((err) => {
    logger.error(err?.message);
    process.exit(1);
  });
