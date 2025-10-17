import { useEvent } from "../hooks/use-event";
import type { CartEventName, CartEvents } from "./cart-events";

// Domain-specific hook for cart events
export const useCartEvent = <T extends CartEventName>(
  eventName: T,
  callback?: (payload: CartEvents[T]["detail"]) => void
) => {
  return useEvent(eventName, callback);
};

// Convenience hooks for specific cart events
export const useCartItemAdded = (
  callback: (payload: { productId: string; productName: string }) => void
) => useCartEvent("cart:item-added", callback);

export const useCartItemRemoved = (
  callback: (payload: { productId: string }) => void
) => useCartEvent("cart:item-removed", callback);

export const useCartCleared = (callback: () => void) =>
  useCartEvent("cart:cleared", callback);
