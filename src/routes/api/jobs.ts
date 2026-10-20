import { randomUUID } from "node:crypto";
import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/config";
import { getDb } from "@/lib/db/config";
import { hasPermission } from "@/lib/permissions/permissions";
import { refuseWithoutPermission } from "@/lib/permissions/resource-guard";
import { logAudit } from "@/lib/security/audit";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  return auth(request);
}

// What a job's target_id points at, by job_type.
const TARGET_TABLE = {
  report: "report_definitions",
  chart: "chart_definitions",
  export: "saved_queries",
} as const;

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

          const denied = refuseWithoutPermission(session.user, "job", "view");
          if (denied) return denied;

          const db = getDb();
          const { searchParams } = new URL(request.url);
          const page = parseInt(searchParams.get("page") || "0", 10);
          const pageSize = Math.min(parseInt(searchParams.get("pageSize") || "50", 10), 1000);

          const jobs = await db
            .selectFrom("job_definitions")
            .selectAll()
            .where("is_deleted", "=", false)
            .orderBy("created_at", "desc")
            .limit(pageSize)
            .offset(page * pageSize)
            .execute();

          const totalResult = await db
            .selectFrom("job_definitions")
            .select((eb) => eb.fn.count("id").as("total"))
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          const total = Number(totalResult?.total ?? 0);

          return json({ success: true, data: { items: jobs, meta: { total, page, pageSize } } });
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

          // A job runs unattended on a schedule, so creating one is `job:create` — or
          // `job:execute`, which is what the seeded Analyst role holds and what let
          // analysts schedule jobs before this was checked at all.
          const user = session.user;
          const mayCreate = ["create", "execute"].some((action) =>
            hasPermission(user.permissions ?? [], "job", action, user.roles ?? [])
          );
          if (!mayCreate) {
            return json(
              {
                success: false,
                error: { code: "FORBIDDEN", message: "You do not have permission to create jobs" },
              },
              { status: 403 }
            );
          }

          const body = (await request.json()) as {
            name?: string;
            job_type?: string;
            target_id?: string;
            schedule_cron?: string;
            parameters?: Record<string, unknown>;
            notification_config?: Record<string, unknown>;
            is_active?: boolean;
          };

          const {
            name,
            job_type = "report",
            target_id,
            schedule_cron,
            parameters,
            notification_config,
            is_active = true,
          } = body;

          if (!name || !target_id) {
            return json(
              {
                success: false,
                error: {
                  code: "INVALID_INPUT",
                  message: "Name and target ID are required",
                },
              },
              { status: 400 }
            );
          }

          if (!(job_type in TARGET_TABLE)) {
            return json(
              {
                success: false,
                error: {
                  code: "INVALID_INPUT",
                  message: `job_type must be one of: ${Object.keys(TARGET_TABLE).join(", ")}`,
                },
              },
              { status: 400 }
            );
          }

          const db = getDb();
          const target = await db
            .selectFrom(TARGET_TABLE[job_type as keyof typeof TARGET_TABLE])
            .select("id")
            .where("id", "=", target_id)
            .executeTakeFirst();
          if (!target) {
            return json(
              {
                success: false,
                error: { code: "NOT_FOUND", message: `No ${job_type} with that target_id` },
              },
              { status: 404 }
            );
          }

          const jobId = randomUUID();
          const now = new Date().toISOString();

          await db
            .insertInto("job_definitions")
            .values({
              id: jobId,
              name,
              job_type,
              target_id,
              schedule_cron: schedule_cron ?? null,
              parameters: parameters ? JSON.stringify(parameters) : null,
              notification_config: notification_config ? JSON.stringify(notification_config) : null,
              is_active,
              is_deleted: false,
              deleted_at: null,
              deleted_by: null,
              created_by: session.user.id,
              created_at: now,
              updated_at: now,
            })
            .execute();

          await logAudit({
            userId: session.user.id,
            action: "create",
            resourceType: "job",
            resourceId: jobId,
            details: { job_type, target_id, schedule_cron: schedule_cron ?? null },
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
