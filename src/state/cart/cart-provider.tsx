import type React from "react";
import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useAnalyticsDispatcher } from "../../events/use-analytics-events";
import { useCartEvent } from "../../events/use-cart-events";
import { useNotifyDispatcher } from "../../events/use-notification-events";
import type { CartItem } from "./cart-context";
import { CartContext } from "./cart-context";
import { cartActions, cartReducer, initialCartState } from "./cart-reducer";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, initialCartState);
  const previousItemsRef = useRef<CartItem[]>([]);

  // Event dispatchers using the new modular system
  const { dispatch: dispatchItemAdded } = useCartEvent("cart:item-added");
  const { dispatch: dispatchItemRemoved } = useCartEvent("cart:item-removed");
  const { dispatch: dispatchCartCleared } = useCartEvent("cart:cleared");
  const notify = useNotifyDispatcher();
  const analytics = useAnalyticsDispatcher();

  // Effect to handle side effects when items change
  useEffect(() => {
    const previousItems = previousItemsRef.current;
    const currentItems = items;

    // Check for new items
    currentItems.forEach((currentItem) => {
      const previousItem = previousItems.find(
        (item) => item.id === currentItem.id
      );
      if (!previousItem) {
        // New item added
        dispatchItemAdded({
          productId: currentItem.id,
          productName: currentItem.name,
        });
        notify.success(`${currentItem.name} added to cart!`);
        analytics.track("cart_item_added", {
          productId: currentItem.id,
          productName: currentItem.name,
        });
      } else if (
        previousItem.quantity !== currentItem.quantity &&
        currentItem.quantity > previousItem.quantity
      ) {
        // Quantity increased
        notify.info(`Updated ${currentItem.name} quantity in cart`);
      }
    });

    // Check for removed items
    previousItems.forEach((previousItem) => {
      const currentItem = currentItems.find(
        (item) => item.id === previousItem.id
      );
      if (!currentItem) {
        // Item removed
        dispatchItemRemoved({ productId: previousItem.id });
        notify.info(`${previousItem.name} removed from cart`);
        analytics.track("cart_item_removed", {
          productId: previousItem.id,
          productName: previousItem.name,
        });
      }
    });

    // Check if cart was cleared (had items, now empty)
    if (previousItems.length > 0 && currentItems.length === 0) {
      dispatchCartCleared();
      notify.info("Cart cleared");
      analytics.track("cart_cleared", { timestamp: Date.now() });
    }

    // Update the ref for next comparison
    previousItemsRef.current = [...currentItems];
  }, [
    items,
    dispatchItemAdded,
    dispatchItemRemoved,
    dispatchCartCleared,
    notify,
    analytics,
  ]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    dispatch(cartActions.addItem(newItem));
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch(cartActions.removeItem(id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch(cartActions.updateQuantity(id, quantity));
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const clearCart = useCallback(() => {
    dispatch(cartActions.clearCart());
  }, []);

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      getTotalItems,
      getTotalPrice,
      clearCart,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      getTotalItems,
      getTotalPrice,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
