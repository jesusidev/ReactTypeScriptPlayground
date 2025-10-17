// Re-export all event types for easy importing

export * from "./analytics-events";
export * from "./cart-events";
export * from "./notification-events";
export * from "./theme-events";
export * from "./ui-events";

import type { AnalyticsEvents } from "./analytics-events";
// Import all event interfaces
import type { CartEvents } from "./cart-events";
import type { NotificationEvents } from "./notification-events";
import type { ThemeEvents } from "./theme-events";
import type { UIEvents } from "./ui-events";

// Combine all domain events into one interface
export interface CustomWindowEventMap
  extends WindowEventMap,
    CartEvents,
    ThemeEvents,
    NotificationEvents,
    AnalyticsEvents,
    UIEvents {}

// Union type of all event names for type safety
export type AllEventNames =
  | keyof CartEvents
  | keyof ThemeEvents
  | keyof NotificationEvents
  | keyof AnalyticsEvents
  | keyof UIEvents;
