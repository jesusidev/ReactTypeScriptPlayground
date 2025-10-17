import type { AppEvent } from "../hooks/use-event";

// Counter/UI-specific event definitions
export interface UIEvents {
  "counter:incremented": AppEvent<{ count: number; label: string }>;
  "counter:decremented": AppEvent<{ count: number; label: string }>;
  "counter:reset": AppEvent<{ label: string }>;
  "modal:opened": AppEvent<{ modalId: string }>;
  "modal:closed": AppEvent<{ modalId: string }>;
  "form:submitted": AppEvent<{ formId: string; data: Record<string, unknown> }>;
  "form:validation-failed": AppEvent<{ formId: string; errors: string[] }>;
}

// Type-safe UI event names
export type UIEventName = keyof UIEvents;
