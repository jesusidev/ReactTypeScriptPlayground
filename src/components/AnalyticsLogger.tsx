import React from "react";
import { useAnalyticsEvent } from "../events/use-analytics-events";
import { useCartEvent } from "../events/use-cart-events";

export function AnalyticsLogger() {
  // Listen to all analytics events
  useAnalyticsEvent(
    "analytics:track",
    ({ event, properties, userId, timestamp }) => {
      console.log("📊 Analytics Event:", {
        event,
        properties,
        userId,
        timestamp,
      });
      // In a real app, you'd send this to your analytics service
    }
  );

  useAnalyticsEvent("analytics:page-view", ({ page, title, referrer }) => {
    console.log("📄 Page View:", { page, title, referrer });
  });

  useAnalyticsEvent(
    "analytics:user-action",
    ({ action, category, label, value }) => {
      console.log("� User Action:", { action, category, label, value });
    }
  );

  // Listen to cart events for analytics
  useCartEvent("cart:item-added", ({ productId, productName }) => {
    console.log("🛒 Cart Analytics - Item added:", { productId, productName });
  });

  useCartEvent("cart:item-removed", ({ productId }) => {
    console.log("🗑️ Cart Analytics - Item removed:", { productId });
  });

  useCartEvent("cart:cleared", () => {
    console.log("🧹 Cart Analytics - Cart cleared");
  });

  // This component only logs events, it doesn't render anything
  return null;
}
