# Swiss Clean Design Theme System

A comprehensive theme provider for Enterprise Reporting System using the Swiss Clean Design principles.

## Features

- **Light & Dark Themes**: Full light and dark mode support with system preference detection
- **SSR Optimized**: Prevents flash of unstyled content (FOUC) with inline initialization script
- **Swiss Clean Design**: Professional, minimal color palette with high contrast
- **Persistent Storage**: User theme preference saved to localStorage
- **Smooth Transitions**: Configurable transition on theme change
- **Type-Safe**: Full TypeScript support with theme types

## Architecture

### Components

#### `ThemeProvider`
Main theme provider component that wraps the application. Based on `next-themes` for reliable SSR support.

```tsx
import { ThemeProvider } from '@/lib/theme/theme-provider';

export default function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

#### `ThemeScript`
Runs theme initialization before first paint to prevent FOUC. Should be placed in `<head>`.

```tsx
import { ThemeScript } from '@/lib/theme/theme-script';

export default function RootLayout() {
  return (
    <html>
      <head>
        <ThemeScript />
      </head>
      <body>...</body>
    </html>
  );
}
```

#### `ThemeSelector`
UI component for theme switching with light/dark/system options.

```tsx
import { ThemeSelector } from '@/components/theme/theme-selector';

export default function Header() {
  return <ThemeSelector />;
}
```

### Hooks

#### `useTheme()`
Access and control theme state.

```tsx
import { useTheme } from '@/lib/theme/use-theme';

export default function Component() {
  const { theme, setTheme, systemTheme } = useTheme();

  return (
    <button onClick={() => setTheme('dark')}>
      Current: {theme} (System: {systemTheme})
    </button>
  );
}
```

## Configuration

Theme configuration defined in `src/lib/theme/theme-config.ts`:

```typescript
export const THEME_CONFIG = {
  attribute: "class",           // Apply theme to class attribute
  defaultTheme: "system",       // Default to system preference
  enableSystem: true,           // Enable system preference detection
  enableColorScheme: false,     // Don't use color-scheme meta
  themes: ["light", "dark"],    // Available themes
  storageKey: "theme-preference", // localStorage key
  disableTransitionOnChange: true, // No transition animation
};
```

## Swiss Clean Design Colors

### Light Theme
- **Background**: #FFFFFF (white)
- **Foreground**: #0D0D0D (dark gray)
- **Primary**: #0000FF (Swiss blue)
- **Secondary**: #F5F5F5 (light gray)
- **Borders**: #E8E8E8 (light gray)

### Dark Theme
- **Background**: #141414 (very dark gray)
- **Foreground**: #F2F2F2 (light gray)
- **Primary**: #3399FF (lighter blue)
- **Secondary**: #2E2E2E (dark gray)
- **Borders**: #383838 (medium dark gray)

## CSS Variables

All colors are available as CSS variables in `src/styles/globals.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 5%;
  --primary: 240 100% 50%;
  /* ... more variables */
}

.dark {
  --background: 0 0% 8%;
  --foreground: 0 0% 95%;
  --primary: 220 100% 60%;
  /* ... more variables */
}
```

## Usage in Components

### Using CSS Variables
```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

### Using Tailwind Classes
```tsx
<div className="bg-background text-foreground dark:bg-black dark:text-white">
  Content
</div>
```

## Implementation Details

### How It Works

1. **Page Load**:
   - `ThemeScript` runs in head before rendering
   - Checks `localStorage` for stored preference
   - Falls back to system preference via `prefers-color-scheme`
   - Applies theme class to `<html>` element immediately

2. **Theme Switching**:
   - `useTheme()` hook provides `setTheme()` function
   - User selects new theme via `ThemeSelector`
   - Preference saved to `localStorage`
   - `ThemeProvider` updates class on `<html>`

3. **System Preference Changes**:
   - Script listens for `prefers-color-scheme` changes
   - If no explicit preference set, applies system preference
   - Automatic theme update without page reload

### SSR Safety

- `suppressHydrationWarning` prevents hydration warnings
- Inline script runs before React hydration
- No async loading or component state dependencies
- Works with TanStack Start and other SSR frameworks

## Customization

### Add Custom Themes

Modify `src/styles/globals.css`:

```css
@layer base {
  :root {
    /* Light theme */
  }

  .dark {
    /* Dark theme */
  }

  .brand-theme {
    /* Custom brand theme */
  }
}
```

### Change Default Theme

Edit `src/lib/theme/theme-config.ts`:

```typescript
export const THEME_CONFIG = {
  defaultTheme: "dark", // Change to 'dark' or 'system'
  // ... other config
};
```

### Disable System Preference

```typescript
export const THEME_CONFIG = {
  enableSystem: false,   // Ignore system preference
  defaultTheme: "light", // Use specified default
};
```

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 13+)
- No IE support (uses `localStorage` and CSS custom properties)

## Performance

- **FOUC Prevention**: Inline script executes before first paint
- **Minimal Re-renders**: Single context update on theme change
- **Lazy Loading**: Theme script only loaded in head
- **No External Requests**: Uses `prefers-color-scheme` media query

## Troubleshooting

### Theme Not Persisting
Check browser's localStorage is enabled and not cleared on page close.

### FOUC on Page Load
Ensure `ThemeScript` is rendered in `<head>` before other scripts.

### Hydration Warnings
Add `suppressHydrationWarning` to affected elements and the script tag.

### Theme Not Switching
Verify `ThemeProvider` wraps the component tree and `useTheme()` is called within provider.

## References

- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Prefers Color Scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
