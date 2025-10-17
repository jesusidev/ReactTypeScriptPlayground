import type { CartItem } from "./cart-context";

// Cart action types
export type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

// Cart state type
export type CartState = CartItem[];

// Initial cart state
export const initialCartState: CartState = [];

// Cart reducer function
export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.find((item) => item.id === action.payload.id);

      if (existingItem) {
        return state.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
    }

    case "REMOVE_ITEM":
      return state.filter((item) => item.id !== action.payload.id);

    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return state.filter((item) => item.id !== action.payload.id);
      }

      return state.map((item) =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
}

// Action creators for better developer experience
export const cartActions = {
  addItem: (item: Omit<CartItem, "quantity">): CartAction => ({
    type: "ADD_ITEM",
    payload: item,
  }),

  removeItem: (id: string): CartAction => ({
    type: "REMOVE_ITEM",
    payload: { id },
  }),

  updateQuantity: (id: string, quantity: number): CartAction => ({
    type: "UPDATE_QUANTITY",
    payload: { id, quantity },
  }),

  clearCart: (): CartAction => ({
    type: "CLEAR_CART",
  }),
} as const;
