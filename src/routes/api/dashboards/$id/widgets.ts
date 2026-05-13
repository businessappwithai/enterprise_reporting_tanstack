import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

export const Route = createFileRoute("/api/dashboards/$id/widgets")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }

          const { id } = params;
          const { getDb } = await import("@/lib/db/config");
          const db = getDb();

          // Verify dashboard exists
          const dashboard = await db
            .selectFrom("dashboard_layouts")
            .select("id")
            .where("id", "=", id)
            .executeTakeFirst();

          if (!dashboard) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Dashboard not found" } },
              { status: 404 }
            );
          }

          // Fetch widgets for the dashboard
          const widgets = await db
            .selectFrom("dashboard_widgets")
            .selectAll()
            .where("dashboard_id", "=", id)
            .execute();

          return json({ success: true, data: { items: widgets } });
        } catch (error) {
          console.error("Error fetching dashboard widgets:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch dashboard widgets" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
