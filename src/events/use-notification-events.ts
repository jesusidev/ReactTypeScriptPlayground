import { useEvent } from "../hooks/use-event";
import type {
  NotificationEventName,
  NotificationEvents,
} from "./notification-events";

// Domain-specific hook for notification events
export const useNotificationEvent = <T extends NotificationEventName>(
  eventName: T,
  callback?: (payload: NotificationEvents[T]["detail"]) => void
) => {
  return useEvent(eventName, callback);
};

// Convenience hooks for specific notification events
export const useNotificationShow = (
  callback: (payload: {
    message: string;
    type: "success" | "error" | "info" | "warning";
    duration?: number;
    action?: { label: string; onClick: () => void };
  }) => void
) => useNotificationEvent("notification:show", callback);

export const useNotificationHide = (
  callback: (payload: { id?: string }) => void
) => useNotificationEvent("notification:hide", callback);

// Helper hook to dispatch notifications easily
export const useNotifyDispatcher = () => {
  const { dispatch } = useNotificationEvent("notification:show");

  return {
    success: (message: string, options?: { duration?: number }) =>
      dispatch({ message, type: "success", ...options }),

    error: (message: string, options?: { duration?: number }) =>
      dispatch({ message, type: "error", ...options }),

    info: (message: string, options?: { duration?: number }) =>
      dispatch({ message, type: "info", ...options }),

    warning: (message: string, options?: { duration?: number }) =>
      dispatch({ message, type: "warning", ...options }),
  };
};
