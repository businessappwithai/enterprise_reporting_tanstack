import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { v4 as uuidv4 } from "uuid";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/dashboards")({
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

          const { searchParams } = new URL(request.url);
          const page = parseInt(searchParams.get("page") || "0", 10);
          const pageSize = parseInt(searchParams.get("pageSize") || "20", 10);

          const { getDb } = await import("@/lib/db/config");
          const { filterAccessibleResources } = await import("@/lib/permissions/permissions");
          const db = getDb();

          let dashboards = await db
            .selectFrom("dashboard_layouts")
            .selectAll()
            .orderBy("created_at", "desc")
            .execute();

          dashboards = await filterAccessibleResources(
            session.user.id,
            dashboards,
            "dashboard",
            "view"
          );

          const paginatedDashboards = dashboards.slice(page * pageSize, (page + 1) * pageSize);
          const total = dashboards.length;

          return json({
            success: true,
            data: {
              items: paginatedDashboards,
              meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize) },
            },
          });
        } catch (error) {
          console.error("Error fetching dashboards:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to fetch dashboards" },
            },
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

          const { canCreateResource } = await import("@/lib/permissions/permissions");
          const canCreate = await canCreateResource(session.user.id, "dashboard");
          if (!canCreate) {
            return json(
              {
                success: false,
                error: {
                  code: "FORBIDDEN",
                  message: "You do not have permission to create dashboards",
                },
              },
              { status: 403 }
            );
          }

          const body = await request.json();
          const { name, description, layoutConfig, themeConfig, refreshConfig, isPublic } = body;

          if (!name) {
            return json(
              { success: false, error: { code: "INVALID_INPUT", message: "Name is required" } },
              { status: 400 }
            );
          }

          const { getDb } = await import("@/lib/db/config");
          const { logAudit } = await import("@/lib/security/audit");
          const db = getDb();
          const id = uuidv4();
          const now = new Date().toISOString();

          await db
            .insertInto("dashboard_layouts")
            .values({
              id,
              name,
              description: description ?? null,
              layout_config: JSON.stringify(
                layoutConfig || {
                  cols: { lg: 12, md: 10, sm: 6, xs: 4 },
                  rowHeight: 100,
                  layouts: {},
                }
              ),
              theme_config: themeConfig ? JSON.stringify(themeConfig) : null,
              refresh_config: refreshConfig ? JSON.stringify(refreshConfig) : null,
              is_public: isPublic ?? false,
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
            resourceType: "dashboard",
            resourceId: id,
            details: { name },
          });

          const dashboard = await db
            .selectFrom("dashboard_layouts")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          return json({ success: true, data: dashboard }, { status: 201 });
        } catch (error) {
          console.error("Error creating dashboard:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to create dashboard" },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
