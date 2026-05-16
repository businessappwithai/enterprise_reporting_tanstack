"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Swiss Clean Design Theme Provider
 * Manages light/dark theme switching with system preference detection
 * Prevents FOUC (Flash of Unstyled Content) via inline script
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      enableColorScheme={false}
      themes={["light", "dark"]}
      forcedTheme={undefined}
      storageKey="theme-preference"
    >
      {children}
    </NextThemesProvider>
  );
}
