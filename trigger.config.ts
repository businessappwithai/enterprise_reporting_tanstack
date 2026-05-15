/**
 * Trigger.dev Configuration
 * Setup for background job processing with trigger.dev
 */

import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  project: "enterprise-reporting",
  runtime: "node",
  logLevel: "log",
  triggerDirectories: ["./src/lib/jobs"],
  // Configure to use local Mastra.ai server API endpoints
  apiKey: process.env.TRIGGER_API_KEY,
  apiUrl: process.env.TRIGGER_API_URL || "http://localhost:3030",
});
