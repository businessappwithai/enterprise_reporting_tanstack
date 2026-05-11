import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { getDb } from "@/lib/db/config";
import { verifySession } from "@/lib/auth/session";
import { randomUUID } from "crypto";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/filters")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ error: "Unauthorized" }, { status: 401 });
          }

          const db = getDb();
          const filters = await db
            .selectFrom("filter_definitions")
            .selectAll()
            .orderBy("name", "asc")
            .execute();

          return json(filters);
        } catch (error) {
          console.error("Error fetching filters:", error);
          return json({ error: "Failed to fetch filters" }, { status: 500 });
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ error: "Unauthorized" }, { status: 401 });
          }

          const body = (await request.json()) as {
            name: string;
            description?: string;
            data_source_id: string;
            filter_query: string;
            display_field: string;
            value_field: string;
            field_type?: string;
            operator?: string;
            date_validation_config?: unknown;
          };

          const {
            name,
            description,
            data_source_id,
            filter_query,
            display_field,
            value_field,
            field_type,
            operator,
            date_validation_config,
          } = body;

          const missingFields = [];
          if (!name) missingFields.push("name");
          if (!data_source_id) missingFields.push("data_source_id");
          if (!filter_query) missingFields.push("filter_query");
          if (!display_field) missingFields.push("display_field");
          if (!value_field) missingFields.push("value_field");

          if (missingFields.length > 0) {
            return json({ error: "Missing required fields", missingFields }, { status: 400 });
          }

          const db = getDb();
          const now = new Date().toISOString();
          const id = randomUUID();

          await db
            .insertInto("filter_definitions")
            .values({
              id,
              name,
              description: description ?? null,
              data_source_id,
              filter_query,
              display_field,
              value_field,
              field_type: field_type ?? null,
              operator: operator ?? null,
              date_validation_config: date_validation_config
                ? JSON.stringify(date_validation_config)
                : null,
              created_by: session.user.id,
              created_at: now,
              updated_at: now,
            })
            .execute();

          const newFilter = await db
            .selectFrom("filter_definitions")
            .selectAll()
            .where("id", "=", id)
            .executeTakeFirst();

          return json(newFilter, { status: 201 });
        } catch (error) {
          console.error("[POST /api/filters] Error creating filter:", error);
          return json(
            {
              error: "Failed to create filter",
              details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
