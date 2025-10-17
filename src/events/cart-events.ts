import type { AppEvent } from "../hooks/use-event";

// Cart-specific event definitions
export interface CartEvents {
  "cart:item-added": AppEvent<{ productId: string; productName: string }>;
  "cart:item-removed": AppEvent<{ productId: string }>;
  "cart:item-updated": AppEvent<{ productId: string; quantity: number }>;
  "cart:cleared": AppEvent<void>;
  "cart:checkout-started": AppEvent<{ totalItems: number; totalPrice: number }>;
}

// Type-safe cart event names
export type CartEventName = keyof CartEvents;
