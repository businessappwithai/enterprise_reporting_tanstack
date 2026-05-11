import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";
import { getDb } from "@/lib/db/config";
import { verifySession } from "@/lib/auth/session";
import { isAdmin } from "@/lib/permissions/permissions";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

async function requireAdmin(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  const session = await verifySession(token);
  if (!session?.user) return null;
  const admin = await isAdmin(session.user.id);
  if (!admin) return null;
  return session;
}

export const Route = createFileRoute("/api/admin/users")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const db = getDb();
          const users = await db
            .selectFrom("users")
            .select([
              "id",
              "email",
              "display_name",
              "avatar_url",
              "is_active",
              "created_at",
              "updated_at",
            ])
            .orderBy("created_at", "desc")
            .execute();

          return json({ success: true, data: users });
        } catch (error) {
          console.error("Error fetching users:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to fetch users" } },
            { status: 500 }
          );
        }
      },

      POST: async ({ request }) => {
        try {
          const session = await requireAdmin(request);
          if (!session) {
            return json(
              { success: false, error: { code: "FORBIDDEN", message: "Admin access required" } },
              { status: 403 }
            );
          }

          const body = (await request.json()) as {
            email?: string;
            display_name?: string;
            password?: string;
            is_active?: boolean;
          };

          const { email, display_name, password, is_active = true } = body;

          if (!email || !password) {
            return json(
              { success: false, error: { code: "INVALID_INPUT", message: "Email and password are required" } },
              { status: 400 }
            );
          }

          const db = getDb();

          const existing = await db
            .selectFrom("users")
            .select("id")
            .where("email", "=", email)
            .executeTakeFirst();

          if (existing) {
            return json(
              { success: false, error: { code: "CONFLICT", message: "User with this email already exists" } },
              { status: 409 }
            );
          }

          const userId = randomUUID();
          const passwordHash = await bcrypt.hash(password, 10);
          const now = new Date().toISOString();

          await db
            .insertInto("users")
            .values({
              id: userId,
              email,
              password_hash: passwordHash,
              display_name: display_name || email.split("@")[0],
              avatar_url: null,
              is_active,
              created_at: now,
              updated_at: now,
            })
            .execute();

          return json({ success: true, data: { id: userId } }, { status: 201 });
        } catch (error) {
          console.error("Error creating user:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to create user" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
