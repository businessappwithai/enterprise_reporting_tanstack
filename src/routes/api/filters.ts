import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { auth } from "@/lib/auth/config";
import { getDb } from "@/lib/db/config";
import { hasPermission } from "@/lib/permissions/permissions";

async function getSession(request: Request) {
  return auth(request);
}

export const Route = createFileRoute("/api/filters")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { message: "Not authenticated" } },
              { status: 401 }
            );
          }

          // Filters exist to parameterise reports and charts, so whoever may view either
          // (or filters directly) may list them. Any session used to be enough.
          const { permissions = [], roles = [] } = session.user;
          const mayView = (["filter", "report", "chart"] as const).some((resource) =>
            hasPermission(permissions, resource, "view", roles)
          );
          if (!mayView) {
            return json(
              {
                success: false,
                error: { message: "You do not have permission to view filters" },
              },
              { status: 403 }
            );
          }

          const db = getDb();
          const filters = await db.selectFrom("filter_definitions").selectAll().execute();

          return json({ success: true, data: filters });
        } catch (error) {
          console.error("Error fetching filters:", error);
          return json(
            { success: false, error: { message: "Failed to fetch filters" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
