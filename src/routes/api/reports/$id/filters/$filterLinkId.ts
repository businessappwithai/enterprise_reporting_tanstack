import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const { getAuthSession } = await import("@/lib/auth/config");
  return getAuthSession();
}

export const Route = createFileRoute("/api/reports/$id/filters/$filterLinkId")({
  server: {
    handlers: {
      PUT: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session) {
            return json({ error: "Unauthorized" }, { status: 401 });
          }

          const body = await request.json();
          const { target_column, filter_order } = body;

          const updateData: Record<string, unknown> = {};
          if (target_column !== undefined) updateData.target_column = target_column;
          if (filter_order !== undefined) updateData.filter_order = filter_order;

          const { id: reportId, filterLinkId } = params;
          const { getKnexDb } = await import("@/lib/db/config");
          const db = getKnexDb();
          const filterLink = await db("report_filters")
            .where("id", filterLinkId)
            .where("report_id", reportId)
            .update(updateData);

          if (!filterLink) {
            return json({ error: "Report filter not found" }, { status: 404 });
          }

          return json({ success: true });
        } catch (error) {
          console.error("Error updating report filter:", error);
          return json({ error: "Failed to update report filter" }, { status: 500 });
        }
      },

      DELETE: async ({ request, params }) => {
        try {
          const session = await getSession(request);
          if (!session) {
            return json({ error: "Unauthorized" }, { status: 401 });
          }

          const { id: reportId, filterLinkId } = params;
          const { getKnexDb } = await import("@/lib/db/config");
          const db = getKnexDb();
          const filterLink = await db("report_filters")
            .where("id", filterLinkId)
            .where("report_id", reportId)
            .del();

          if (!filterLink) {
            return json({ error: "Report filter not found" }, { status: 404 });
          }

          return json({ success: true });
        } catch (error) {
          console.error("Error deleting report filter:", error);
          return json({ error: "Failed to delete report filter" }, { status: 500 });
        }
      },
    },
  },
});
