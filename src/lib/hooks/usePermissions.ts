import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";
import type { UserPermissions } from "@/lib/auth/user-permissions";
import type { ResourceType } from "@/types/database";

/**
 * The signed-in user's permissions as the `_authed` guard resolved them, alongside the
 * session. Inside the authenticated layout this seeds `usePermissions`, so the first
 * render — the server render included — already has them.
 */
export const SessionPermissionsContext = createContext<UserPermissions | null>(null);

/**
 * Hook to get all permissions for the current user.
 *
 * Inside `_authed` the answer is already known: the guard's copy is the query's initial
 * data and nothing is fetched. It used to fetch on every load and the sidebar hid every
 * gated item until it returned, so the menu flashed to just "Dashboard".
 *
 * The key carries the user id. It used to be `["user-permissions"]` with an infinite
 * stale time, so the next person to sign in in the same tab got the previous one's
 * permissions until a reload. `invalidateQueries({ queryKey: ["user-permissions"] })`
 * still matches every user's entry.
 */
export function usePermissions() {
  const seeded = useContext(SessionPermissionsContext);
  return useQuery<UserPermissions>({
    queryKey: ["user-permissions", seeded?.userId ?? null],
    queryFn: async () => {
      const res = await fetch("/api/auth/permissions");
      // Signed out is a 200 with no permissions. Anything else is a failure to report,
      // not an empty menu to cache for the rest of the session.
      if (!res.ok) throw new Error(`Failed to load permissions (HTTP ${res.status})`);
      return res.json();
    },
    initialData: seeded ?? undefined,
    staleTime: Infinity, // Never refetch automatically
    gcTime: Infinity, // Keep cached indefinitely
  });
}

/**
 * Hook to check if user can view a specific resource type
 */
export function useCanView(resourceType: ResourceType) {
  const { data: permissions } = usePermissions();

  return useMemo(() => {
    if (!permissions) return false;
    if (permissions.isAdmin) return true;

    return permissions.rolePermissions.some(
      (perm) => perm === `${resourceType}:view` || perm === `${resourceType}:*` || perm === "*:*"
    );
  }, [permissions, resourceType]);
}

/**
 * Hook to check if user can edit a specific resource type
 */
export function useCanEdit(resourceType: ResourceType) {
  const { data: permissions } = usePermissions();

  return useMemo(() => {
    if (!permissions) return false;
    if (permissions.isAdmin) return true;

    return permissions.rolePermissions.some(
      (perm) => perm === `${resourceType}:edit` || perm === `${resourceType}:*` || perm === "*:*"
    );
  }, [permissions, resourceType]);
}

/**
 * Hook to check if user can create resources of a specific type
 */
export function useCanCreate(resourceType: ResourceType) {
  const { data: permissions } = usePermissions();

  return useMemo(() => {
    if (!permissions) return false;
    if (permissions.isAdmin) return true;

    return permissions.rolePermissions.some(
      (perm) =>
        perm === `${resourceType}:create` ||
        perm === `${resourceType}:edit` ||
        perm === `${resourceType}:*` ||
        perm === "*:*"
    );
  }, [permissions, resourceType]);
}

/**
 * Hook to check if user can delete resources of a specific type
 */
export function useCanDelete(resourceType: ResourceType) {
  const { data: permissions } = usePermissions();

  return useMemo(() => {
    if (!permissions) return false;
    if (permissions.isAdmin) return true;

    return permissions.rolePermissions.some(
      (perm) =>
        perm === `${resourceType}:delete` ||
        perm === `${resourceType}:admin` ||
        perm === `${resourceType}:*` ||
        perm === "*:*"
    );
  }, [permissions, resourceType]);
}

/**
 * Hook to check if user has specific permission on a resource
 */
export function useHasResourceAccess(
  resourceType: ResourceType,
  resourceId: string,
  action: "view" | "edit" | "execute" | "delete" = "view"
) {
  const { data: permissions } = usePermissions();

  return useMemo(() => {
    if (!permissions) return false;
    if (permissions.isAdmin) return true;

    // Check role permissions
    const hasRolePermission = permissions.rolePermissions.some(
      (perm) =>
        perm === `${resourceType}:${action}` || perm === `${resourceType}:*` || perm === "*:*"
    );

    if (hasRolePermission) return true;

    // Check resource-level permissions
    const resourcePerm = permissions.resourcePermissions.find(
      (p) => p.resource_type === resourceType && p.resource_id === resourceId
    );

    if (resourcePerm) {
      const permissionStrength: Record<string, number> = {
        view: 1,
        execute: 2,
        edit: 3,
        delete: 4,
        admin: 5,
      };

      const requiredStrength = permissionStrength[action] || 0;
      const grantedStrength = permissionStrength[resourcePerm.permission_level] || 0;

      return grantedStrength >= requiredStrength;
    }

    return false;
  }, [permissions, resourceType, resourceId, action]);
}

/**
 * Hook to get user's role names
 */
export function useUserRoles() {
  const { data: permissions } = usePermissions();

  return useMemo(() => {
    if (!permissions) return [];
    return permissions.roles.map((r) => r.name);
  }, [permissions]);
}

/**
 * Hook to check if user is admin
 */
export function useIsAdmin() {
  const { data: permissions } = usePermissions();

  return useMemo(() => {
    if (!permissions) return false;
    return permissions.isAdmin;
  }, [permissions]);
}
