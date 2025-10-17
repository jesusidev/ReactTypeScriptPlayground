import type { AppEvent } from "../hooks/use-event";

// Analytics-specific event definitions
export interface AnalyticsEvents {
  "analytics:track": AppEvent<{
    event: string;
    properties?: Record<string, unknown>;
    userId?: string;
    timestamp?: number;
  }>;
  "analytics:page-view": AppEvent<{
    page: string;
    title?: string;
    referrer?: string;
  }>;
  "analytics:user-action": AppEvent<{
    action: string;
    category: string;
    label?: string;
    value?: number;
  }>;
}

// Type-safe analytics event names
export type AnalyticsEventName = keyof AnalyticsEvents;
