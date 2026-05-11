import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

async function getSession(request: Request) {
  const { auth } = await import("@/lib/auth/config");
  return auth(request);
}

// In-memory active data source store (keyed by user id)
// In production this could be a Redis or DB-backed session value
const activeDataSourceByUser = new Map<
  string,
  { id: string; name: string; client_type: string; created_at: string } | null
>();

export const Route = createFileRoute("/api/data-sources/active")({
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

          const active = activeDataSourceByUser.get(session.user.id) ?? null;
          return json({ success: true, data: { activeDataSource: active } });
        } catch (error) {
          console.error("Error fetching active data source:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to fetch active data source" },
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

          const body = (await request.json()) as { dataSourceId?: string };
          const { dataSourceId } = body;

          if (!dataSourceId) {
            activeDataSourceByUser.set(session.user.id, null);
            return json({ success: true, data: { activeDataSource: null } });
          }

          const { getDb } = await import("@/lib/db/config");
          const db = getDb();

          const ds = await db
            .selectFrom("data_sources")
            .select(["id", "name", "client_type", "created_at"])
            .where("id", "=", dataSourceId)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!ds) {
            return json(
              { success: false, error: { code: "NOT_FOUND", message: "Data source not found" } },
              { status: 404 }
            );
          }

          activeDataSourceByUser.set(session.user.id, ds);
          return json({ success: true, data: { activeDataSource: ds } });
        } catch (error) {
          console.error("Error setting active data source:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to set active data source" },
            },
            { status: 500 }
          );
        }
      },

      DELETE: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json(
              { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
              { status: 401 }
            );
          }
          activeDataSourceByUser.set(session.user.id, null);
          return json({ success: true, data: { activeDataSource: null } });
        } catch (error) {
          console.error("Error clearing active data source:", error);
          return json(
            {
              success: false,
              error: { code: "SERVER_ERROR", message: "Failed to clear active data source" },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
