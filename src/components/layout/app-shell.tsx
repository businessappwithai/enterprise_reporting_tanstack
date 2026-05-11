import { useState } from "react";
import { ActiveDataSourceProvider } from "@/lib/hooks/use-active-datasource";
import { cn } from "@/lib/utils";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AppShellProps {
  children: React.ReactNode;
  user: User;
}

export function AppShell({ children, user }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <ActiveDataSourceProvider>
      <div className="min-h-screen bg-background">
        <Sidebar collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} />
        <div className={cn("transition-all duration-300", sidebarCollapsed ? "ml-16" : "ml-64")}>
          <Header user={user} />
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ActiveDataSourceProvider>
  );
}
