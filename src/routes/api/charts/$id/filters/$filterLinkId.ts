import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(_request: Request) {
  const { getAuthSession } = await import("@/lib/auth/config");
  return getAuthSession();
}

export const Route = createFileRoute("/api/charts/$id/filters/$filterLinkId")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session) return json({ error: "Unauthorized" }, { status: 401 });

          const body = await request.json();
          const { target_column, filter_order } = body;
          const updateData: Record<string, unknown> = {};
          if (target_column !== undefined) updateData.target_column = target_column;
          if (filter_order !== undefined) updateData.filter_order = filter_order;

          const { getDb } = await import("@/lib/db/config");
          const db = getDb();

          // Check existence first
          const existing = await db
            .selectFrom("chart_filters")
            .select("id")
            .where("id", "=", params.filterLinkId)
            .where("chart_id", "=", params.id)
            .executeTakeFirst();

          if (!existing) return json({ error: "Chart filter not found" }, { status: 404 });

          await db
            .updateTable("chart_filters")
            .set(updateData)
            .where("id", "=", params.filterLinkId)
            .where("chart_id", "=", params.id)
            .execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error updating chart filter:", error);
          return json({ error: "Failed to update chart filter" }, { status: 500 });
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session) return json({ error: "Unauthorized" }, { status: 401 });

          const { getDb } = await import("@/lib/db/config");
          const db = getDb();

          // Check existence first
          const existing = await db
            .selectFrom("chart_filters")
            .select("id")
            .where("id", "=", params.filterLinkId)
            .where("chart_id", "=", params.id)
            .executeTakeFirst();

          if (!existing) return json({ error: "Chart filter not found" }, { status: 404 });

          await db
            .deleteFrom("chart_filters")
            .where("id", "=", params.filterLinkId)
            .where("chart_id", "=", params.id)
            .execute();

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting chart filter:", error);
          return json({ error: "Failed to delete chart filter" }, { status: 500 });
        }
      },
    },
  },
});
