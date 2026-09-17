# @ignite/traceguard-sdk

Official Node.js and TypeScript client SDK for **TraceGuard** — an intelligent telemetry, host metrics, and distributed crash reporting platform.

## Features

- **Quick Handshake & Verification**: Automated connection verification with your TraceGuard collector.
- **Background Host Metrics**: Automatic snapshot reporting for CPU load averages (1m, 5m, 15m), total memory, free memory, and utilization percentage.
- **Enriched Telemetry & Breadcrumbs**: Standardized error envelopes with contextual breadcrumbs, stack traces, and route metadata.

---

## Installation

```bash
npm install @ignite/traceguard-sdk
```

---

## Quick Start

### 1. Initialize Connection with TraceGuard

Call `init` once during application bootstrap (e.g., in your Express/Fastify/Hono server):

```typescript
import { init } from "@ignite/traceguard-sdk";

await init({
  connection: "https://your-traceguard-backend.com/api/v1/telemetry/verify",
  id: "my-service-project-id",
});
```

---

### 2. Monitor Host Health with `MetricAgent`

Start background OS telemetry collection to continuously stream CPU and RAM metrics to the TraceGuard dashboard:

```typescript
import { MetricAgent } from "@ignite/traceguard-sdk";

const agent = new MetricAgent({
  endpoint: "https://your-traceguard-backend.com/api/v1/metrics",
  apiKey: process.env.TRACEGUARD_API_KEY,
  serviceName: "payment-service",
  intervalMs: 15000, // sample every 15s
  onError: (err) => console.error("[MetricAgent Error]:", err.message),
});

agent.start();
```

---

### 3. Track Incidents & Breadcrumbs

Track execution trails and capture unhandled exceptions with breadcrumb timelines:

```typescript
import { SDKResponse } from "@ignite/traceguard-sdk";

const origin = {
  endpoint: "/api/checkout",
  filePath: "controllers/checkout.ts",
  timestamps: new Date(),
};

const telemetry = new SDKResponse("CHECKOUT_PROCESS", origin);

try {
  telemetry.addBreadCrumb("Cart validated", { category: "validation" });
  telemetry.addBreadCrumb("Connecting to Payment Gateway", { category: "http" });

  // Your business logic...

  telemetry.setSuccess({ orderId: "ord_12345" }, "Checkout completed successfully");
} catch (error: any) {
  telemetry.statusCode = error.statusCode || 500;
  telemetry.setError(
    { message: error.message, code: "CHECKOUT_FAILURE" },
    error.name || "PaymentError"
  );
  
  // Forward to your TraceGuard events ingestion endpoint
  await fetch("https://your-traceguard-backend.com/api/v1/telemetry/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-project-id": "my-service-project-id",
    },
    body: JSON.stringify(telemetry),
  });
}
```

---

## License

ISC
