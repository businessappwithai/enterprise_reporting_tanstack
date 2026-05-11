import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { getKnexDb as getDb } from "@/lib/db/config";
import { verifySession } from "@/lib/auth/session";
import type { JobDefinition } from "@/types/database";
import { randomUUID } from "crypto";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/jobs")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const db = getDb();
          const jobs = await db<JobDefinition>("jobs").orderBy("created_at", "desc");

          return json({ success: true, data: { items: jobs, meta: { total: jobs.length } } });
        } catch (error) {
          console.error("Error fetching jobs:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch jobs" } },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const body = (await request.json()) as {
            name?: string;
            description?: string;
            target_id?: string;
            schedule_cron?: string;
            query_id?: string;
            report_id?: string;
            is_active?: boolean;
          };

          const {
            name,
            description,
            target_id,
            schedule_cron,
            query_id,
            report_id,
            is_active = true,
          } = body;

          if (!name || !target_id || !schedule_cron) {
            return json(
              {
                success: false,
                error: {
                  code: "INVALID_INPUT",
                  message: "Name, target ID, and schedule are required",
                },
              },
              { status: 400 }
            );
          }

          const db = getDb();
          const jobId = randomUUID();

          await db("jobs").insert({
            id: jobId,
            name,
            description: description || null,
            query_id: target_id || query_id || null,
            report_id: report_id || null,
            schedule: schedule_cron,
            is_active,
            created_by: session.user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });

          return json({ success: true, data: { id: jobId } }, { status: 201 });
        } catch (error) {
          console.error("Error creating job:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to create job" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
