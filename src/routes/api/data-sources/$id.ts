import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { verifySession } from "@/lib/auth/session";
import { getDb } from "@/lib/db/config";
import { decrypt } from "@/lib/security/encryption";
import { logAudit } from "@/lib/security/audit";

async function getSession(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const Route = createFileRoute("/api/data-sources/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }: { request: Request; params: { id: string } }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ error: { message: "Unauthorized" } }, { status: 401 });
          }

          const db = getDb();
          const dataSource = await db
            .selectFrom("data_sources")
            .selectAll()
            .where("id", "=", params.id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!dataSource) {
            return json(
              { error: { message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Decrypt connection config for authorized users
          let config = null;
          try {
            config = JSON.parse(decrypt(dataSource.connection_config));
          } catch (e) {
            // If decryption fails, don't include config
          }

          await logAudit({
            userId: session.user.id,
            action: "read",
            resourceType: "data_source",
            resourceId: params.id,
            details: { operation: "getDataSource", name: dataSource.name },
          });

          return json({
            ...dataSource,
            connection_config: config,
          });
        } catch (error) {
          console.error("Data source get error:", error);
          return json(
            {
              error: {
                message: error instanceof Error ? error.message : "Internal server error",
              },
            },
            { status: 500 }
          );
        }
      },

      PUT: async ({ request, params }: { request: Request; params: { id: string } }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ error: { message: "Unauthorized" } }, { status: 401 });
          }

          const db = getDb();
          const existing = await db
            .selectFrom("data_sources")
            .select("id", "created_by")
            .where("id", "=", params.id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!existing) {
            return json(
              { error: { message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Allow owner or admins to edit
          const userRoles = session.user.roles || [];
          const isAdmin = userRoles.includes("admin");
          const isOwner = existing.created_by === session.user.id;

          if (!isAdmin && !isOwner) {
            return json(
              { error: { message: "Forbidden" } },
              { status: 403 }
            );
          }

          const body = await request.json();
          const { name, description, connectionConfig, isActive } = body;

          const updateData: Record<string, any> = {
            updated_at: new Date().toISOString(),
          };

          if (name) updateData.name = name;
          if (description !== undefined) updateData.description = description;
          if (isActive !== undefined) updateData.is_active = isActive;
          if (connectionConfig) {
            const { encrypt } = await import("@/lib/security/encryption");
            updateData.connection_config = encrypt(JSON.stringify(connectionConfig));
          }

          await db
            .updateTable("data_sources")
            .set(updateData)
            .where("id", "=", params.id)
            .execute();

          await logAudit({
            userId: session.user.id,
            action: "update",
            resourceType: "data_source",
            resourceId: params.id,
            details: { fields: Object.keys(updateData) },
          });

          return json({ success: true });
        } catch (error) {
          console.error("Data source update error:", error);
          return json(
            {
              error: {
                message: error instanceof Error ? error.message : "Internal server error",
              },
            },
            { status: 500 }
          );
        }
      },

      PATCH: async ({ request, params }: { request: Request; params: { id: string } }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ error: { message: "Unauthorized" } }, { status: 401 });
          }

          const db = getDb();
          const existing = await db
            .selectFrom("data_sources")
            .select("id", "created_by")
            .where("id", "=", params.id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!existing) {
            return json(
              { error: { message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Allow owner or admins to edit
          const userRoles = session.user.roles || [];
          const isAdmin = userRoles.includes("admin");
          const isOwner = existing.created_by === session.user.id;

          if (!isAdmin && !isOwner) {
            return json(
              { error: { message: "Forbidden" } },
              { status: 403 }
            );
          }

          const body = await request.json();
          const { name, description, connectionConfig, isActive, clientType } = body;

          const updateData: Record<string, any> = {
            updated_at: new Date().toISOString(),
          };

          if (name) updateData.name = name;
          if (description !== undefined) updateData.description = description;
          if (isActive !== undefined) updateData.is_active = isActive;
          if (connectionConfig) {
            const { encrypt } = await import("@/lib/security/encryption");
            updateData.connection_config = encrypt(JSON.stringify(connectionConfig));
          }

          await db
            .updateTable("data_sources")
            .set(updateData)
            .where("id", "=", params.id)
            .execute();

          await logAudit({
            userId: session.user.id,
            action: "update",
            resourceType: "data_source",
            resourceId: params.id,
            details: { fields: Object.keys(updateData) },
          });

          return json({ success: true });
        } catch (error) {
          console.error("Data source update error:", error);
          return json(
            {
              error: {
                message: error instanceof Error ? error.message : "Internal server error",
              },
            },
            { status: 500 }
          );
        }
      },

      DELETE: async ({ request, params }: { request: Request; params: { id: string } }) => {
        try {
          const session = await getSession(request);
          if (!session?.user) {
            return json({ error: { message: "Unauthorized" } }, { status: 401 });
          }

          const db = getDb();
          const existing = await db
            .selectFrom("data_sources")
            .select("id", "created_by", "name")
            .where("id", "=", params.id)
            .where("is_deleted", "=", false)
            .executeTakeFirst();

          if (!existing) {
            return json(
              { error: { message: "Data source not found" } },
              { status: 404 }
            );
          }

          // Allow owner or admins to delete
          const userRoles = session.user.roles || [];
          const isAdmin = userRoles.includes("admin");
          const isOwner = existing.created_by === session.user.id;

          if (!isAdmin && !isOwner) {
            return json(
              { error: { message: "Forbidden" } },
              { status: 403 }
            );
          }

          // Soft delete
          const now = new Date().toISOString();
          await db
            .updateTable("data_sources")
            .set({
              is_deleted: true,
              deleted_at: now,
              deleted_by: session.user.id,
            })
            .where("id", "=", params.id)
            .execute();

          await logAudit({
            userId: session.user.id,
            action: "delete",
            resourceType: "data_source",
            resourceId: params.id,
            details: { name: existing.name },
          });

          return json({ success: true });
        } catch (error) {
          console.error("Data source delete error:", error);
          return json(
            {
              error: {
                message: error instanceof Error ? error.message : "Internal server error",
              },
            },
            { status: 500 }
          );
        }
      },
    },
  },
});
