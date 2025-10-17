import { useEvent } from "../hooks/use-event";
import type { AnalyticsEventName, AnalyticsEvents } from "./analytics-events";

// Domain-specific hook for analytics events
export const useAnalyticsEvent = <T extends AnalyticsEventName>(
  eventName: T,
  callback?: (payload: AnalyticsEvents[T]["detail"]) => void
) => {
  return useEvent(eventName, callback);
};

// Convenience hooks for specific analytics events
export const useAnalyticsTrack = (
  callback: (payload: {
    event: string;
    properties?: Record<string, unknown>;
    userId?: string;
    timestamp?: number;
  }) => void
) => useAnalyticsEvent("analytics:track", callback);

// Helper hook to dispatch analytics events easily
export const useAnalyticsDispatcher = () => {
  const { dispatch: trackEvent } = useAnalyticsEvent("analytics:track");
  const { dispatch: trackPageView } = useAnalyticsEvent("analytics:page-view");
  const { dispatch: trackUserAction } = useAnalyticsEvent(
    "analytics:user-action"
  );

  return {
    track: (event: string, properties?: Record<string, unknown>) =>
      trackEvent({
        event,
        timestamp: Date.now(),
        ...(properties && { properties }),
      }),

    pageView: (page: string, title?: string) =>
      trackPageView({
        page,
        referrer: document.referrer,
        ...(title && { title }),
      }),

    userAction: (
      action: string,
      category: string,
      label?: string,
      value?: number
    ) =>
      trackUserAction({
        action,
        category,
        ...(label && { label }),
        ...(value !== undefined && { value }),
      }),
  };
};
