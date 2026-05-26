import type { Register } from "@tanstack/react-router";
import type { RequestHandler } from "@tanstack/react-start/server";
import { createStartHandler, defaultStreamHandler } from "@tanstack/react-start/server";
import { closeDb } from "@/lib/db/config";

// Persistent config store will be imported and initialized on first use

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' ws: wss: http://localhost:4050 http://localhost:8081 http://localhost:8082 http://localhost:8083; worker-src 'self' blob:; frame-ancestors 'none';",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(self), geolocation=()",
};

const handler = createStartHandler(defaultStreamHandler);

const fetch: RequestHandler<Register> = async (request, opts) => {
  const response = await handler(request, opts);

  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

// Graceful shutdown for proper database cleanup
if (typeof process !== "undefined" && process.versions?.node) {
  const shutdown = async () => {
    console.log("[server] Closing database connections...");
    await closeDb();

    // Close config database
    try {
      const { closeConfigDb } = await import("@/lib/config/persistent-config");
      closeConfigDb();
    } catch (e) {
      // Config store might not be initialized yet
    }

    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

export default { fetch };
