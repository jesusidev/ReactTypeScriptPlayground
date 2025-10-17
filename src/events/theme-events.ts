import type { AppEvent } from "../hooks/use-event";

// Theme-specific event definitions
export interface ThemeEvents {
  "theme:changed": AppEvent<{ theme: "light" | "dark" }>;
  "theme:toggle-requested": AppEvent<void>;
  "theme:system-preference-changed": AppEvent<{ prefersDark: boolean }>;
}

// Type-safe theme event names
export type ThemeEventName = keyof ThemeEvents;
