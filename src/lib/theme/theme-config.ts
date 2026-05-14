/**
 * Swiss Clean Design System Configuration
 *
 * Color Palette based on Swiss Design principles:
 * - Clean, minimal aesthetic
 * - High contrast for accessibility
 * - Professional and timeless
 */

export const SWISS_CLEAN_THEME = {
  colors: {
    // Light Theme
    light: {
      background: "#FFFFFF",
      foreground: "#0D0D0D",
      card: "#FAFAFA",
      primary: "#0000FF",
      secondary: "#F5F5F5",
      muted: "#F5F5F5",
      border: "#E8E8E8",
      destructive: "#E63946",

      // Status colors
      info: "#007AFF",
      success: "#22C55E",
      warning: "#F59E0B",
      error: "#E63946",
    },
    // Dark Theme
    dark: {
      background: "#141414",
      foreground: "#F2F2F2",
      card: "#1F1F1F",
      primary: "#3399FF",
      secondary: "#2E2E2E",
      muted: "#2E2E2E",
      border: "#383838",
      destructive: "#CC3333",

      // Status colors
      info: "#3399FF",
      success: "#22C55E",
      warning: "#F59E0B",
      error: "#CC3333",
    },
  },

  // Radius tokens
  radius: {
    none: "0px",
    sm: "4px",     // default
    md: "8px",
    lg: "12px",
    xl: "16px",
    pill: "9999px",
  },

  // Sidebar colors
  sidebar: {
    light: {
      background: "#FFFFFF",
      foreground: "#666666",
      primary: "#F5F5F5",
      border: "#E8E8E8",
      ring: "#0000FF",
    },
    dark: {
      background: "#1A1A1A",
      foreground: "#999999",
      primary: "#3399FF",
      border: "#383838",
      ring: "#3399FF",
    },
  },

  // Chart colors
  chart: {
    1: "#0000FF",    // Swiss Blue
    2: "#22C55E",    // Green
    3: "#8B5CF6",    // Purple
    4: "#F59E0B",    // Orange
    5: "#06B6D4",    // Cyan
  },
} as const;

// Theme configuration for next-themes
export const THEME_CONFIG = {
  attribute: "class",
  defaultTheme: "system",
  enableSystem: true,
  enableColorScheme: false,
  themes: ["light", "dark"],
  forcedTheme: undefined,
  storageKey: "theme-preference",
  disableTransitionOnChange: true,
} as const;
