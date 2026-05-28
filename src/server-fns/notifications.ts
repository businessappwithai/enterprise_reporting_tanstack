import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { verifySession } from "@/lib/auth/session";

async function getSession() {
  const cookie = getRequestHeader("cookie") || "";
  const match = cookie.match(/session_token=([^;]+)/);
  const token = match?.[1];
  if (!token) return null;
  return verifySession(token);
}

export const fetchNotificationsFn = createServerFn({ method: "GET" }).handler(
  async ({ includeRead = false }: { includeRead?: boolean }) => {
    try {
      const session = await getSession();
      if (!session?.user) {
        return { success: false, data: [], error: "Unauthorized" };
      }

      // Return empty array for now (notifications table not fully implemented)
      // When fully implemented, fetch from database
      return { success: true, data: [] };
    } catch (error) {
      console.error("Error fetching notifications:", error);
      return {
        success: false,
        data: [],
        error: error instanceof Error ? error.message : "Failed to fetch notifications",
      };
    }
  }
);

export const markNotificationAsReadFn = createServerFn({ method: "POST" }).handler(
  async ({ id }: { id: string }) => {
    try {
      const session = await getSession();
      if (!session?.user) {
        return { success: false, error: "Unauthorized" };
      }

      // When notifications are implemented in the database, add update logic here
      return { success: true };
    } catch (error) {
      console.error("Error marking notification as read:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update notification",
      };
    }
  }
);

export const markAllNotificationsAsReadFn = createServerFn({ method: "POST" }).handler(
  async () => {
    try {
      const session = await getSession();
      if (!session?.user) {
        return { success: false, error: "Unauthorized" };
      }

      // When notifications are implemented in the database, add bulk update logic here
      return { success: true };
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update notifications",
      };
    }
  }
);

export const deleteNotificationFn = createServerFn({ method: "POST" }).handler(
  async ({ id }: { id: string }) => {
    try {
      const session = await getSession();
      if (!session?.user) {
        return { success: false, error: "Unauthorized" };
      }

      // When notifications are implemented in the database, add delete logic here
      return { success: true };
    } catch (error) {
      console.error("Error deleting notification:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete notification",
      };
    }
  }
);
