import type React from "react";
import { useCallback, useMemo, useReducer } from "react";
import { useAnalyticsDispatcher } from "../../events/use-analytics-events";
import { useCartEvent } from "../../events/use-cart-events";
import { useNotifyDispatcher } from "../../events/use-notification-events";
import type { CartItem } from "./cart-context";
import { CartContext } from "./cart-context";
import { cartReducer, initialCartState } from "./cart-reducer";

// Enhanced action types that include side effect callbacks
type CartActionWithSideEffects =
  | { 
      type: 'ADD_ITEM'; 
      payload: Omit<CartItem, 'quantity'>;
      onSuccess?: (item: CartItem, isNewItem: boolean) => void;
    }
  | { 
      type: 'REMOVE_ITEM'; 
      payload: { id: string };
      onSuccess?: (removedItem: CartItem) => void;
    }
  | { 
      type: 'UPDATE_QUANTITY'; 
      payload: { id: string; quantity: number };
      onSuccess?: (item: CartItem, wasRemoved: boolean) => void;
    }
  | { 
      type: 'CLEAR_CART';
      onSuccess?: (clearedItems: CartItem[]) => void;
    };

// Enhanced reducer that calls side effect callbacks
function cartReducerWithCallbacks(
  state: CartItem[], 
  action: CartActionWithSideEffects
): CartItem[] {
  const newState = cartReducer(state, action);
  
  // Call side effect callbacks after state update
  switch (action.type) {
    case 'ADD_ITEM': {
      if (action.onSuccess) {
        const existingItem = state.find(item => item.id === action.payload.id);
        const isNewItem = !existingItem;
        const addedItem = newState.find(item => item.id === action.payload.id);
        if (addedItem) {
          action.onSuccess(addedItem, isNewItem);
        }
      }
      break;
    }
    
    case 'REMOVE_ITEM': {
      if (action.onSuccess) {
        const removedItem = state.find(item => item.id === action.payload.id);
        if (removedItem) {
          action.onSuccess(removedItem);
        }
      }
      break;
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.onSuccess) {
        const item = state.find(item => item.id === action.payload.id);
        const wasRemoved = action.payload.quantity <= 0;
        const updatedItem = newState.find(item => item.id === action.payload.id);
        
        if (wasRemoved && item) {
          action.onSuccess(item, true);
        } else if (updatedItem) {
          action.onSuccess(updatedItem, false);
        }
      }
      break;
    }
    
    case 'CLEAR_CART': {
      if (action.onSuccess && state.length > 0) {
        action.onSuccess([...state]);
      }
      break;
    }
  }
  
  return newState;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Event dispatchers
  const { dispatch: dispatchItemAdded } = useCartEvent("cart:item-added");
  const { dispatch: dispatchItemRemoved } = useCartEvent("cart:item-removed");
  const { dispatch: dispatchCartCleared } = useCartEvent("cart:cleared");
  const notify = useNotifyDispatcher();
  const analytics = useAnalyticsDispatcher();

  const [items, dispatch] = useReducer(cartReducerWithCallbacks, initialCartState);

  // Clean action dispatchers with inline side effects
  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: newItem,
      onSuccess: (item, isNewItem) => {
        if (isNewItem) {
          // Completely new item
          dispatchItemAdded({
            productId: item.id,
            productName: item.name,
          });
          notify.success(`${item.name} added to cart!`);
          analytics.track("cart_item_added", {
            productId: item.id,
            productName: item.name,
          });
        } else {
          // Quantity increased
          notify.info(`Updated ${item.name} quantity in cart`);
        }
      }
    });
  }, [dispatchItemAdded, notify, analytics]);

  const removeItem = useCallback((id: string) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id },
      onSuccess: (removedItem) => {
        dispatchItemRemoved({ productId: removedItem.id });
        notify.info(`${removedItem.name} removed from cart`);
        analytics.track("cart_item_removed", {
          productId: removedItem.id,
          productName: removedItem.name,
        });
      }
    });
  }, [dispatchItemRemoved, notify, analytics]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id, quantity },
      onSuccess: (item, wasRemoved) => {
        if (wasRemoved) {
          // Item was removed due to quantity 0
          dispatchItemRemoved({ productId: item.id });
          notify.info(`${item.name} removed from cart`);
          analytics.track("cart_item_removed", {
            productId: item.id,
            productName: item.name,
          });
        } else {
          notify.info(`Updated ${item.name} quantity in cart`);
        }
      }
    });
  }, [dispatchItemRemoved, notify, analytics]);

  const clearCart = useCallback(() => {
    dispatch({
      type: 'CLEAR_CART',
      onSuccess: () => {
        dispatchCartCleared();
        notify.info("Cart cleared");
        analytics.track("cart_cleared", { timestamp: Date.now() });
      }
    });
  }, [dispatchCartCleared, notify, analytics]);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

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