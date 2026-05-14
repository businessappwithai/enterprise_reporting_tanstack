import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authed/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Manage system users, roles, and permissions</p>
      </div>

      <div className="flex gap-4">
        <Link
          to="/admin/users"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Users
        </Link>
        <Link
          to="/admin/roles"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Roles
        </Link>
        <Link
          to="/admin/permissions"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Permissions
        </Link>
        <Link
          to="/admin/schema-instructions"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Schema Instructions
        </Link>
      </div>

      <Outlet />
    </div>
  );
}
