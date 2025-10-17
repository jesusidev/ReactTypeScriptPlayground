import type { AppEvent } from "../hooks/use-event";

// Notification-specific event definitions
export interface NotificationEvents {
  "notification:show": AppEvent<{
    message: string;
    type: "success" | "error" | "info" | "warning";
    duration?: number;
    action?: { label: string; onClick: () => void };
  }>;
  "notification:hide": AppEvent<{ id?: string }>;
  "notification:clear-all": AppEvent<void>;
}

// Type-safe notification event names
export type NotificationEventName = keyof NotificationEvents;
