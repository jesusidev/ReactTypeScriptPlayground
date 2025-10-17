import { type Dispatch, useCallback, useEffect } from "react";
import type { CustomWindowEventMap } from "../events";

// Define custom event payload types
export interface AppEvent<PayloadType = unknown> extends Event {
  detail: PayloadType;
}

export const useEvent = <
  EventName extends keyof CustomWindowEventMap,
  PayloadType = CustomWindowEventMap[EventName] extends AppEvent<infer P>
    ? P
    : unknown,
>(
  eventName: EventName,
  callback?: Dispatch<PayloadType> | VoidFunction
) => {
  useEffect(() => {
    if (!callback) {
      return;
    }

    const listener = ((event: AppEvent<PayloadType>) => {
      // Type-safe callback with proper payload
      if (typeof callback === "function") {
        if (callback.length > 0) {
          // Callback expects payload
          (callback as Dispatch<PayloadType>)(event.detail);
        } else {
          // Callback is VoidFunction
          (callback as VoidFunction)();
        }
      }
    }) as EventListener;

    window.addEventListener(eventName, listener);

    return () => {
      window.removeEventListener(eventName, listener);
    };
  }, [callback, eventName]);

  const dispatch = useCallback(
    (detail?: PayloadType) => {
      const event = new CustomEvent(eventName, {
        detail,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(event);
    },
    [eventName]
  );

  return { dispatch };
};
