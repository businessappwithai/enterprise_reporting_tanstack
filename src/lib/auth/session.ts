import { SignJWT, jwtVerify } from "jose";
import { getDb } from "@/lib/db/config";
import bcrypt from "bcryptjs";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface Session {
  user: SessionUser;
  expires: string;
}

const SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "enterprise-reporting-secret-key-min-32-chars!!"
);

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT({ user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return {
      user: payload.user as SessionUser,
      expires: new Date(payload.exp! * 1000).toISOString(),
    };
  } catch {
    return null;
  }
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const db = getDb();

  const user = await db("users").where("email", email).where("is_active", true).first();

  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return null;

  const roles = await db("roles")
    .join("user_roles", "roles.id", "user_roles.role_id")
    .where("user_roles.user_id", user.id)
    .select("roles.*");

  const permissions = roles.flatMap((role: { permissions: string }) => {
    try {
      return JSON.parse(role.permissions);
    } catch {
      return [];
    }
  });

  return {
    id: user.id,
    email: user.email,
    name: user.display_name,
    roles: roles.map((r: { name: string }) => r.name),
    permissions: Array.from(new Set(permissions)) as string[],
  };
}
