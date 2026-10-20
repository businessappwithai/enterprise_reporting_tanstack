import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/server/response";

export const Route = createFileRoute("/api/auth/permissions")({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        try {
          const { auth } = await import("@/lib/auth/config");
          const { loadUserPermissions, NO_PERMISSIONS } = await import(
            "@/lib/auth/user-permissions"
          );
          const session = await auth(request);
          if (!session?.user) return json(NO_PERMISSIONS);
          return json(await loadUserPermissions(session));
        } catch (error) {
          // An outage (SessionUnavailableError) or a failed lookup: not "no permissions",
          // which the sidebar would render as a menu with nothing in it.
          console.error("Error loading permissions:", error);
          return json(
            { success: false, error: { code: "SERVER_ERROR", message: "Failed to load permissions" } },
            { status: 500 }
          );
        }
      },
    },
  },
});
