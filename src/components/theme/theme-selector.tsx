"use client";

import { useTheme } from "@/lib/theme/use-theme";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sun, Moon, Monitor } from "lucide-react";

/**
 * Theme Selector Component
 * Allows users to switch between light, dark, and system themes
 * Swiss Clean Design with intuitive icons
 */
export function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme || "system"} onValueChange={setTheme}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4" />
            <span>Light</span>
          </div>
        </SelectItem>
        <SelectItem value="dark">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4" />
            <span>Dark</span>
          </div>
        </SelectItem>
        <SelectItem value="system">
          <div className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>System</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
