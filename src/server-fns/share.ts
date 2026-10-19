import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

export type ShareResource = "dashboard" | "chart" | "report";

/**
 * What a share link resolves to for whoever opened it.
 *
 *  - `member`      signed in, and their role may view this kind of thing: go to the real page
 *  - `public`      not that, but the owner made it public: the limited public page
 *  - `unavailable` everyone else — one answer whether the item is private or does not exist,
 *                  so a link cannot be used to find out which ids are real
 */
export type ShareResolution =
  | { kind: "member"; href: string }
  | { kind: "public"; name: string; description: string | null }
  | { kind: "unavailable"; signedIn: boolean };

const TABLE: Record<ShareResource, string> = {
  dashboard: "dashboard_layouts",
  chart: "chart_definitions",
  report: "report_definitions",
};

const APP_PATH: Record<ShareResource, (id: string) => string> = {
  dashboard: (id) => `/dashboards/${encodeURIComponent(id)}`,
  chart: (id) => `/charts/viewer/${encodeURIComponent(id)}`,
  report: (id) => `/reports/${encodeURIComponent(id)}/viewer`,
};

/**
 * A share link used to resolve only for items marked public, so a colleague who signed in
 * and opened a link to a private dashboard was told it "is not publicly accessible" — while
 * the Share dialog says a private item is one "only logged in users can view". Sharing
 * between the people who use the system is the main case; the public page is the exception.
 *
 * Named columns only: a share link exposes that something exists and what it is called,
 * never its definition.
 */
export const resolveShareFn = createServerFn({ method: "GET" })
  .inputValidator((data: { resource: ShareResource; id: string }) => data)
  .handler(async ({ data }): Promise<ShareResolution> => {
    const table = TABLE[data.resource];
    if (!table || typeof data.id !== "string" || !data.id || data.id.length > 255) {
      return { kind: "unavailable", signedIn: false };
    }

    const { getDb } = await import("@/lib/db/config");
    const { getSessionFromHeaders } = await import("@/lib/auth/session");
    const { hasPermission } = await import("@/lib/permissions/permissions");

    const request = getRequest();
    const session = request ? await getSessionFromHeaders(request.headers) : null;

    const row = (await (getDb() as any)
      .selectFrom(table)
      .where("id", "=", data.id)
      .select(["id", "name", "description", "is_public"])
      .executeTakeFirst()) as
      | { id: string; name: string; description: string | null; is_public: boolean }
      | undefined;

    if (!row) return { kind: "unavailable", signedIn: Boolean(session) };

    if (
      session &&
      hasPermission(
        session.user.permissions ?? [],
        data.resource,
        "view",
        session.user.roles ?? []
      )
    ) {
      return { kind: "member", href: APP_PATH[data.resource](row.id) };
    }

    if (row.is_public) {
      return { kind: "public", name: row.name, description: row.description ?? null };
    }

    return { kind: "unavailable", signedIn: Boolean(session) };
  });
