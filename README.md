# 🎓 React TypeScript Learning Playground

> **An educational project showcasing modern React patterns, experimental features, and professional development practices**

Welcome to a comprehensive learning resource for advanced React TypeScript patterns! This playground demonstrates real-world implementations of cutting-edge React concepts through a fully functional shopping cart application.

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install Biome VS Code extension (recommended)
# Search for "Biome" by biomejs in VS Code extensions

# 3. Start the development server
npm start

# 4. Open http://localhost:1234 and start exploring!
```

---

## 🧠 Learning Objectives

By exploring this project, you'll master:

### 🎯 **Core Concepts**
1. **[Context/Provider Pattern](#-contextprovider-pattern)** - Global state management without prop drilling
2. **[Custom Event System](#-custom-event-system)** - Decoupled component communication 
3. **[useEffectEvent Hook](#-useeffectevent-hook)** - Stable event handlers (experimental)
4. **[Activity Component](#-activity-component)** - Lifecycle control with state preservation (experimental)

### 🛠️ **Development Practices** 
- **Professional Code Quality** with [Biome formatting/linting](#-code-quality--formatting)
- **Type-Safe Architecture** with comprehensive TypeScript patterns
- **Modular Organization** for scalable React applications
- **Performance Optimization** techniques and best practices

---

## 📚 Educational Structure

### 📁 **Project File Organization**
```
src/
├── 📂 components/          # UI Components demonstrating patterns
│   ├── CounterLogger.tsx   # 🎪 Activity + useEffectEvent demo
│   ├── Header.tsx          # 🛒 Cart context consumer
│   ├── ProductCard.tsx     # 🛒 Cart interactions
│   ├── Theme.tsx           # 🎨 Theme context consumer
│   ├── NotificationCenter.tsx # 📢 Event system consumer
│   ├── AnalyticsLogger.tsx # 📊 Event logging demo
│   └── EventDemo.tsx       # 🎯 Event system showcase
├── 📂 state/              # Context/Provider implementations
│   ├── provider-builder.tsx # 🔧 Provider composition utility
│   ├── theme/             # 🎨 Theme management
│   └── cart/              # 🛒 Shopping cart logic
├── 📂 events/             # Custom event system
│   ├── use-event.tsx      # 🎯 Core event hook
│   ├── cart-events.ts     # 🛒 Cart domain events
│   ├── theme-events.ts    # 🎨 Theme events
│   ├── notification-events.ts # 📢 Notification events
│   └── analytics-events.ts # 📊 Analytics events
├── 📂 hooks/              # Custom hooks
└── 📂 data/               # Sample data
```

### 🔍 **Learning Path Recommendations**

#### **Beginner → Intermediate**
1. Start with **[Context/Provider Pattern](#-contextprovider-pattern)** - Foundation of modern React state management
2. Explore **[Custom Event System](#-custom-event-system)** - Advanced component communication
3. Examine **[Project Structure](#-understanding-the-project-structure)** - How everything connects

#### **Intermediate → Advanced** 
4. Study **[useEffectEvent Hook](#-useeffectevent-hook)** - Cutting-edge React patterns
5. Experiment with **[Activity Component](#-activity-component)** - Advanced lifecycle control
6. Master **[Code Quality Setup](#-code-quality--formatting)** - Professional development workflow

---

## 🎯 Context/Provider Pattern

> **🎓 Learning Goal**: Master global state management without prop drilling using React Context API with full TypeScript support

### 🤔 Why This Pattern Matters

**Problem**: Passing data through multiple component layers (prop drilling)
```tsx
// ❌ Prop drilling nightmare
<App>
  <Header user={user} cart={cart} theme={theme} />
  <Main user={user} cart={cart} theme={theme}>
    <ProductList cart={cart} theme={theme} />
    <Sidebar user={user} theme={theme} />
  </Main>
</App>
```

**Solution**: Context provides global state accessible anywhere in the component tree
```tsx
// ✅ Clean component hierarchy
<Providers>
  <App>
    <Header />      {/* Accesses user, cart, theme via context */}
    <Main>
      <ProductList /> {/* Accesses cart, theme via context */}
      <Sidebar />     {/* Accesses user, theme via context */}
    </Main>
  </App>
</Providers>
```

### Overview
The Context/Provider pattern enables global state management across the React component tree without prop drilling. This project implements two contexts: Theme and Shopping Cart.

### 📚 Step-by-Step Implementation

#### **Step 1: Define Your Context Type**
```tsx
// 📁 state/cart/cart-context.tsx
export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  clearCart: () => void;
};

// ✨ Key Learning: Always type your context!
export const CartContext = createContext<CartContextValue | undefined>(undefined);
```

#### **Step 2: Create the Provider Component**
```tsx
// 📁 state/cart/cart-provider.tsx
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // ✨ Key Learning: Use useCallback for stable references
  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      if (existingItem) {
        // Update existing item quantity
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  }, []);

  // ✨ Key Learning: useMemo for expensive computations
  const value = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    getTotalItems: () => items.reduce((sum, item) => sum + item.quantity, 0),
    getTotalPrice: () => items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
    clearCart: () => setItems([])
  }), [items, addItem, removeItem, updateQuantity]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
```

#### **Step 3: Create a Custom Hook for Easy Access**
```tsx
// 📁 hooks/use-cart.tsx
export function useCart() {
  const context = useContext(CartContext);
  
  // ✨ Key Learning: Always validate context usage
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  
  return context;
}
```

#### **Step 4: Provider Composition for Multiple Contexts**
```tsx
// 📁 state/provider-builder.tsx
type ProviderProps<T> = T & { children: React.ReactNode };
type ProviderType<T> = React.ComponentType<ProviderProps<T>>;
type ProvidersConfig = readonly [ProviderType<any>, any][];

export function Providers<T extends ProvidersConfig>({ 
  providers, 
  children 
}: {
  providers: T;
  children: React.ReactNode;
}) {
  return providers.reduceRight(
    (acc, [Provider, props]) => <Provider {...props}>{acc}</Provider>,
    children as React.ReactElement
  );
}

// ✨ Usage in App.tsx - Clean and type-safe!
const providers = [
  [ThemeProvider, { initialTheme: "light" as const }],
  [CartProvider, {}]
] as const;

return (
  <Providers providers={providers}>
    <AppContent />
  </Providers>
);
```

### 💡 Real-World Usage Examples

#### **In Components - Clean and Simple**
```tsx
// 📁 components/Header.tsx
export function Header() {
  const { items, getTotalItems, getTotalPrice } = useCart();
  
  return (
    <header>
      <h1>Shopping App</h1>
      <div>
        Cart: {getTotalItems()} items - ${getTotalPrice().toFixed(2)}
      </div>
    </header>
  );
}

// 📁 components/ProductCard.tsx
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const themeCtx = useContext(ThemeContext);
  
  return (
    <div style={{ 
      backgroundColor: themeCtx?.theme === 'dark' ? '#34495e' : 'white' 
    }}>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => addItem(product)}>
        Add to Cart
      </button>
    </div>
  );
}
```

#### **File Organization for Context**
```
src/state/
├── provider-builder.tsx    # 🔧 Generic provider composer
├── theme/
│   ├── theme-context.tsx   # 🎨 Theme context definition
│   └── theme-provider.tsx  # 🎨 Theme state management  
└── cart/
    ├── cart-context.tsx    # 🛒 Cart context definition
    ├── cart-provider.tsx   # 🛒 Cart state + business logic
    └── use-cart.tsx        # 🛒 Custom hook for easy access
```

### 🎯 Key Concepts & Benefits

✅ **Type Safety**: Full TypeScript support with proper type inference  
✅ **No Prop Drilling**: Global state accessible anywhere in the component tree  
✅ **Performance Optimized**: Uses `useMemo` and `useCallback` for stable references  
✅ **Provider Composition**: Multiple contexts easily composed together  
✅ **Developer Experience**: Clear error messages when context is misused  
✅ **Separation of Concerns**: Each context handles one domain (cart, theme, etc.)

### ⚠️ Common Pitfalls to Avoid

❌ **Creating new objects in render** - Causes unnecessary re-renders
```tsx
// Bad: Creates new object every render
<CartContext.Provider value={{ items, addItem }}>
```

✅ **Use useMemo for stable references**
```tsx  
// Good: Stable object reference
const value = useMemo(() => ({ items, addItem }), [items, addItem]);
<CartContext.Provider value={value}>
```

❌ **Forgetting to type your context**
```tsx
// Bad: No type safety
const CartContext = createContext(null);
```

✅ **Always define proper types**
```tsx
// Good: Full type safety
const CartContext = createContext<CartContextValue | undefined>(undefined);
```

---

## 🔄 useReducer Pattern for Complex State

> **🎓 Learning Goal**: Upgrade from useState to useReducer for complex state management with predictable state transitions and better separation of concerns

### 🤔 When to Evolve from useState to useReducer

#### **useState is Great for Simple State**
```tsx
// ✅ Perfect for simple, independent state
const [count, setCount] = useState(0);
const [isVisible, setIsVisible] = useState(true);
const [username, setUsername] = useState('');
```

#### **useReducer Shines for Complex State Logic**
```tsx
// ✅ Better for complex state with business rules
const [cartState, dispatch] = useReducer(cartReducer, initialState);

// Multiple related state updates
dispatch({ type: 'ADD_ITEM', payload: { id: '1', name: 'Product', price: 10 } });
dispatch({ type: 'UPDATE_QUANTITY', payload: { id: '1', quantity: 3 } });
dispatch({ type: 'APPLY_DISCOUNT', payload: { code: 'SAVE10' } });
```

### 🚀 Real-World Example: Cart State Evolution

#### **Before: useState Approach**
```tsx
// 📁 state/cart/cart-provider.tsx (old implementation)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      if (existingItem) {
        // Complex logic mixed with state updates
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems(currentItems =>
      quantity <= 0
        ? currentItems.filter(item => item.id !== id)
        : currentItems.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
    );
  }, []);

  // Problems:
  // 1. Business logic scattered across multiple functions
  // 2. Each function needs to understand state structure  
  // 3. Complex state updates are error-prone
  // 4. Hard to test business logic in isolation
}
```

#### **After: useReducer Approach**
```tsx
// 📁 state/cart/cart-reducer.ts - Centralized business logic
export type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' };

export const initialCartState: CartItem[] = [];

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { payload: newItem } = action;
      const existingItem = state.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return state.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...state, { ...newItem, quantity: 1 }];
    }
    
    case 'REMOVE_ITEM': {
      return state.filter(item => item.id !== action.payload.id);
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return state.filter(item => item.id !== id);
      }
      
      return state.map(item =>
        item.id === id ? { ...item, quantity } : item
      );
    }
    
    case 'CLEAR_CART': {
      return [];
    }
    
    default: {
      return state;
    }
  }
}

// ✨ Action creators for clean dispatching
export const cartActions = {
  addItem: (item: Omit<CartItem, 'quantity'>): CartAction => ({
    type: 'ADD_ITEM',
    payload: item
  }),
  
  removeItem: (id: string): CartAction => ({
    type: 'REMOVE_ITEM', 
    payload: { id }
  }),
  
  updateQuantity: (id: string, quantity: number): CartAction => ({
    type: 'UPDATE_QUANTITY',
    payload: { id, quantity }
  }),
  
  clearCart: (): CartAction => ({
    type: 'CLEAR_CART'
  })
};
```

#### **Updated Provider with useReducer**
```tsx
// 📁 state/cart/cart-provider.tsx (new implementation)
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, initialCartState);

  // ✨ Clean, simple action dispatchers
  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    dispatch(cartActions.addItem(newItem));
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch(cartActions.removeItem(id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch(cartActions.updateQuantity(id, quantity));
  }, []);

  const clearCart = useCallback(() => {
    dispatch(cartActions.clearCart());
  }, []);

  // Benefits:
  // 1. All business logic centralized in reducer
  // 2. Actions are predictable and type-safe
  // 3. Easy to test reducer in isolation  
  // 4. State transitions are explicit and traceable
  // 5. Component logic is simplified
}
```

### 🎯 Key Benefits of useReducer Pattern

#### **🏗️ Architectural Advantages**
✅ **Centralized Logic**: All state transitions in one place (reducer)  
✅ **Predictable Updates**: Actions clearly describe what happened  
✅ **Type Safety**: Union types ensure correct action shapes  
✅ **Testability**: Reducer is a pure function - easy to test  
✅ **Debugging**: Action history shows exactly what changed  
✅ **Scalability**: Easy to add new actions without touching components  

#### **🎨 Clean Code Benefits**
✅ **Separation of Concerns**: Business logic separate from UI logic  
✅ **Single Responsibility**: Reducer handles state, components handle UI  
✅ **Immutable Updates**: Reducer enforces immutable state changes  
✅ **Action Creators**: Consistent way to create actions with validation  

### 📚 Step-by-Step Migration Guide

#### **Step 1: Identify Complex State**
Look for these patterns in your useState code:
- Multiple related state variables
- Complex state update logic  
- State updates that depend on current state
- Business rules scattered across components

#### **Step 2: Define Your Actions**
```tsx
// Start with your current operations
// addItem, removeItem, updateQuantity, clearCart
// ↓
// Convert to action types
type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  // ...
```

#### **Step 3: Build Your Reducer**
```tsx
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM':
      // Move your existing logic here
      return /* new state */;
    // ...
  }
}
```

#### **Step 4: Create Action Creators**
```tsx
export const cartActions = {
  addItem: (item: Omit<CartItem, 'quantity'>) => ({
    type: 'ADD_ITEM' as const,
    payload: item
  }),
  // ... other actions
};
```

#### **Step 5: Update Your Provider**
```tsx
// Replace useState with useReducer
const [state, dispatch] = useReducer(cartReducer, initialState);

// Replace complex setters with simple dispatches
const addItem = useCallback((item) => {
  dispatch(cartActions.addItem(item));
}, []);
```

### 🧪 Advanced Patterns

#### **Barrel Exports for Clean Imports**
```tsx
// 📁 state/cart/index.ts - Clean module organization
export type { CartItem, CartContextValue } from './cart-context';
export { CartContext, useCart } from './cart-context';
export { CartProvider } from './cart-provider';
export { cartActions, cartReducer, initialCartState } from './cart-reducer';
export type { CartAction } from './cart-reducer';

// ✨ Now components can import everything cleanly:
import { useCart, cartActions, type CartItem } from '../state/cart';
```

#### **Async Actions with useReducer**
```tsx
// For async operations, dispatch actions at different stages
const saveCart = async () => {
  dispatch({ type: 'SAVE_CART_START' });
  
  try {
    await api.saveCart(items);
    dispatch({ type: 'SAVE_CART_SUCCESS' });
  } catch (error) {
    dispatch({ type: 'SAVE_CART_ERROR', payload: { error: error.message } });
  }
};
```

### ⚡ When to Choose useReducer vs useState

#### **Use useState when:**
- Simple, independent state (booleans, strings, numbers)
- No complex business logic
- State updates are straightforward
- Component-local state only

#### **Use useReducer when:**
- Complex state with multiple related fields
- State updates involve business logic
- Multiple ways to update the same state
- Need predictable state transitions
- Want better testability and debugging

### 🎯 Real-World Impact

**Before useReducer (complex setState calls):**
```tsx
// Hard to understand what this does
setItems(items => 
  items.map(item => 
    item.id === id 
      ? { ...item, quantity: item.quantity + (item.bulk ? 5 : 1) }
      : item
  )
);
```

**After useReducer (clear intent):**
```tsx
// Crystal clear what's happening
dispatch(cartActions.incrementQuantity(id, isBulkOperation));
```

The useReducer pattern transforms complex state management from scattered, hard-to-follow logic into organized, predictable, and testable code. It's especially powerful when combined with TypeScript for complete type safety throughout your state management layer.

---

## ⚡ useEffectEvent Hook

> **🧪 Experimental Feature**: This is a cutting-edge React pattern that may change in future versions  
> **🎓 Learning Goal**: Understand how to create stable event handlers that access latest values without effect dependencies

### 🤔 The Problem This Solves

#### **Traditional useEffect Challenges**

**Problem 1: Stale Closures**
```tsx
// ❌ This captures stale `userName` value
function UserLogger({ userName }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log(`User: ${userName}, Count: ${count}`); // Stale userName!
    }, 1000);
    return () => clearInterval(interval);
  }, [count]); // Can't include userName or interval recreates constantly

  return <button onClick={() => setCount(c => c + 1)}>Count: {count}</button>;
}
```

**Problem 2: Dependency Hell**
```tsx
// ❌ Effect runs every time ANY dependency changes
useEffect(() => {
  // Only care about count changes, but need latest label for logging
  logAnalyticsEvent(`${label}: ${count}`);
}, [count, label]); // Re-runs when label changes too!
```

### ✅ The useEffectEvent Solution

### 💡 Step-by-Step Implementation

#### **Step 1: Create a Stable Event Handler**
```tsx
// 📁 components/CounterLogger.tsx
export function CounterLogger({ label, showDetails }: CounterLoggerProps) {
  const [count, setCount] = useState(0);
  const analytics = useAnalyticsDispatcher();

  // ✨ useEffectEvent creates a stable reference that always sees latest values
  const logCount = useEffectEvent(() => {
    console.log(`📊 Count changed: ${count} (${label})`);
    
    // ✨ Always accesses latest `label` and `analytics`, no stale closures!
    analytics.track('counter_changed', { 
      count, 
      label,
      timestamp: Date.now()
    });
  });

  // ✅ Effect only re-runs when count changes, not when label or analytics change
  useEffect(() => {
    logCount(); // Calls stable function that sees latest values
  }, [count]); // 🎯 Only count in dependencies!

  return (
    <div style={{ 
      padding: "1.5rem", 
      border: "2px solid #e2e8f0",
      borderRadius: "12px" 
    }}>
      <h2>{label}</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setCount(c => c - 1)}>-</button>
        <span style={{ minWidth: "2rem", textAlign: "center" }}>{count}</span>
        <button onClick={() => setCount(c => c + 1)}>+</button>
      </div>
    </div>
  );
}
```

#### **Step 2: Compare with Traditional Approach**
```tsx
// ❌ Traditional approach - problematic
function CounterLoggerTraditional({ label, showDetails }: CounterLoggerProps) {
  const [count, setCount] = useState(0);
  const analytics = useAnalyticsDispatcher();

  useEffect(() => {
    console.log(`📊 Count changed: ${count} (${label})`);
    analytics.track('counter_changed', { count, label });
  }, [count, label, analytics]); // 🚨 Runs every time ANY of these change!

  // Problems:
  // 1. Effect runs when label changes (unnecessary)  
  // 2. Effect runs when analytics reference changes (performance issue)
  // 3. More dependencies = more complexity
}

// ✅ useEffectEvent approach - optimal
function CounterLoggerOptimal({ label, showDetails }: CounterLoggerProps) {
  const [count, setCount] = useState(0);
  const analytics = useAnalyticsDispatcher();

  const logCount = useEffectEvent(() => {
    // Always sees latest label & analytics, no dependency needed
    console.log(`📊 Count changed: ${count} (${label})`);
    analytics.track('counter_changed', { count, label });
  });

  useEffect(() => {
    logCount(); // Only runs when count changes
  }, [count]); // 🎯 Simple, focused dependency array
}
```

### 🎯 Key Benefits & When to Use

#### **Benefits**
✅ **Stable References**: Event handler never changes, preventing unnecessary re-renders  
✅ **Latest Values**: Always accesses current props/state without stale closures  
✅ **Optimized Effects**: Dramatically reduces unnecessary effect re-runs  
✅ **Cleaner Dependencies**: Simpler, more focused dependency arrays  
✅ **Performance**: Better performance in complex component trees  

#### **Perfect Use Cases**
🎯 **Analytics & Logging**: Track events that need latest prop values  
🎯 **API Calls in Effects**: Make requests triggered by specific state changes  
🎯 **Timers & Intervals**: Access latest values in recurring functions  
🎯 **Event Handlers in Effects**: Stable callbacks that won't recreate effects  
🎯 **Performance Critical**: Components with frequently changing props  

### 📊 Real-World Example in Project

```tsx
// 📁 components/CounterLogger.tsx - See it in action!
const logCount = useEffectEvent(() => {
  // ✨ This function:
  // 1. Never changes (stable reference)
  // 2. Always sees latest label, count, analytics
  // 3. Doesn't cause effect to re-run when label changes
  analytics.track('counter_interaction', {
    action: 'count_changed',
    value: count,
    label: label, // Latest value, always!
    timestamp: Date.now()
  });
});

useEffect(() => {
  logCount(); // Triggered only by count changes
}, [count]); // Clean, focused dependencies
```

### ⚠️ Important Notes

🧪 **Experimental Status**: This feature is not yet stable in React  
📚 **Learning Value**: Understanding this pattern prepares you for React's future  
🔄 **Fallback**: Use traditional `useCallback` with proper dependencies if needed  
🎯 **Use Sparingly**: Only when you have the specific problems this solves

---

## 🎪 Activity Component

> **🧪 Experimental Feature**: Advanced lifecycle control - may change in future React versions  
> **🎓 Learning Goal**: Understand component lifecycle management and state preservation techniques

### 🤔 The Problem This Solves

#### **Traditional Conditional Rendering Issues**

```tsx
// ❌ Traditional conditional rendering problems
function TabInterface({ activeTab }) {
  return (
    <div>
      <TabButtons />
      {activeTab === 'profile' && <ProfileTab />}     {/* Remounts every time */}
      {activeTab === 'settings' && <SettingsTab />}   {/* Loses form data */}
      {activeTab === 'history' && <HistoryTab />}     {/* Re-fetches data */}
    </div>
  );
}

// Problems:
// 1. Components remount completely when switching tabs
// 2. Form data is lost (user has to re-enter information)  
// 3. API calls happen again (performance waste)
// 4. Scroll positions are lost
// 5. Component state resets to initial values
```

### ✅ The Activity Component Solution

**Two Modes for Precise Control**:
- **`mode="visible"`**: Component is mounted and active (normal React behavior)
- **`mode="hidden"`**: Component unmounts BUT parent preserves its state

```tsx
// ✅ Activity component preserves state across hide/show cycles
function ImprovedTabInterface({ activeTab }) {
  return (
    <div>
      <TabButtons />
      <Activity mode={activeTab === 'profile' ? 'visible' : 'hidden'}>
        <ProfileTab />     {/* State preserved when hidden! */}
      </Activity>
      <Activity mode={activeTab === 'settings' ? 'visible' : 'hidden'}>
        <SettingsTab />    {/* Form data preserved! */}
      </Activity>
      <Activity mode={activeTab === 'history' ? 'visible' : 'hidden'}>
        <HistoryTab />     {/* No re-fetching! */}
      </Activity>
    </div>
  );
}
```

### 💡 Step-by-Step Implementation

#### **Step 1: Understanding the Lifecycle**
```tsx
// 📁 components/CounterLogger.tsx - Real example from our project!

function DetailsComponent({ counter }: { counter: number }) {
  const [text, setText] = useState("");
  const [loadTime] = useState(() => Date.now());

  useEffect(() => {
    console.log("🟢 DetailsComponent mounted, counter:", counter);
    
    // Simulate expensive setup (API calls, subscriptions, etc.)
    const timeoutId = setTimeout(() => {
      console.log("⚙️ Expensive setup complete");
    }, 1000);

    return () => {
      console.log("🔴 DetailsComponent cleanup, counter:", counter);
      clearTimeout(timeoutId);
    };
  }, [counter]);

  return (
    <div style={{ 
      padding: "12px", 
      border: "2px dashed #cbd5e0",
      borderRadius: "8px",
      backgroundColor: "#f7fafc" 
    }}>
      <p><strong>Details:</strong> Counter is {counter}</p>
      <p><small>Component loaded at: {new Date(loadTime).toLocaleTimeString()}</small></p>
      
      {/* ✨ This input value is preserved across hide/show! */}
      <div style={{ marginTop: "0.5rem" }}>
        <label style={{ display: "block", marginBottom: "4px" }}>
          Type something (state preserved when hidden):
        </label>
        <input
          type="text"
          placeholder="Your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ 
            width: "100%", 
            padding: "6px",
            border: "1px solid #e2e8f0",
            borderRadius: "4px"
          }}
        />
      </div>
      
      {text && (
        <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
          You typed: "{text}"
        </p>
      )}
    </div>
  );
}

// Usage with Activity component
<Activity mode={showDetails ? "visible" : "hidden"}>
  <DetailsComponent counter={count} />
</Activity>
```

#### **Step 2: Observing the Behavior**

**When `mode="visible"` (showDetails = true)**:
```
🟢 DetailsComponent mounted, counter: 5
⚙️ Expensive setup complete
```

**When `mode="hidden"` (showDetails = false)**:
```
🔴 DetailsComponent cleanup, counter: 5
```

**When `mode="visible"` again (showDetails = true)**:
```
🟢 DetailsComponent mounted, counter: 7  // ✨ Counter updated!
⚙️ Expensive setup complete
// ✨ Input text is preserved from before!
```
```

### 🔄 Detailed Lifecycle Behavior

#### **Mode: `"visible"`** 
✅ Component is **mounted** in the DOM  
✅ All **effects run normally**  
✅ **Event listeners** are active  
✅ **Updates and re-renders** happen as usual  
✅ **Memory and resources** are allocated  

#### **Mode: `"hidden"`**
🔴 Component is **unmounted** from DOM  
🔴 **Cleanup functions** run (useEffect cleanup)  
🔴 **Event listeners** are removed  
🔴 **Timers/intervals** are cleared  
⭐ **Parent component state** is preserved  
⭐ **Props passed down** are remembered  

#### **Switching back to `"visible"`**
🟢 Component **remounts** with latest props  
🟢 **Effects re-run** with current values  
🟢 **Fresh lifecycle** starts  
⭐ **Parent state** is restored to component  

### 🎯 Key Benefits & Use Cases

#### **Performance Benefits**
✅ **Memory Optimization**: Hidden components don't consume DOM resources  
✅ **Effect Efficiency**: Expensive effects pause when component is hidden  
✅ **CPU Savings**: No unnecessary renders for hidden content  
✅ **Battery Life**: Reduced processing on mobile devices  

#### **Perfect Use Cases**
🎯 **Tab Interfaces**: Preserve form data across tab switches  
🎯 **Modal Dialogs**: Keep user input when temporarily closing  
🎯 **Accordion Menus**: Maintain scroll position in collapsed sections  
🎯 **Dashboard Widgets**: Hide expensive charts while keeping configuration  
🎯 **Multi-step Forms**: Preserve progress across step navigation  

### 📊 Real-World Example

```tsx
// 🎯 Perfect for complex forms with multiple steps
function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <div>
      <StepIndicator currentStep={currentStep} />
      
      <Activity mode={currentStep === 1 ? "visible" : "hidden"}>
        <PersonalInfoStep />     {/* Form data preserved */}
      </Activity>
      
      <Activity mode={currentStep === 2 ? "visible" : "hidden"}>
        <AddressStep />          {/* Address preserved */}
      </Activity>
      
      <Activity mode={currentStep === 3 ? "visible" : "hidden"}>
        <PaymentStep />          {/* Payment method preserved */}
      </Activity>
      
      <Navigation 
        onNext={() => setCurrentStep(s => s + 1)}
        onBack={() => setCurrentStep(s => s - 1)}
      />
    </div>
  );
}
```

### ⚠️ Important Considerations

🧪 **Experimental**: This API is still evolving in React  
🎯 **Use Wisely**: Only when you need this specific behavior  
📱 **Mobile First**: Especially valuable for mobile performance  
🔧 **Debug Friendly**: Easy to observe mount/unmount cycles in DevTools

---

## 📁 Understanding the Project Structure

> **🎓 Learning Goal**: Navigate and understand a well-organized React TypeScript codebase with clear separation of concerns

### 🏗️ Architecture Overview

```
ReactTypeScriptPlayground/
├── 📁 src/                     # Source code root
│   ├── 📄 App.tsx             # 🚀 Application entry point & provider setup
│   ├── 📄 index.tsx           # React DOM root rendering
│   │
│   ├── 📂 components/         # 🎨 UI Components (what users see)
│   │   ├── Header.tsx         # 🛒 Shopping cart summary & navigation
│   │   ├── ProductCard.tsx    # 🛍️ Individual product display & purchase
│   │   ├── Theme.tsx          # 🎨 Theme switcher (light/dark mode)
│   │   ├── CounterLogger.tsx  # 🎪 Activity + useEffectEvent demo
│   │   ├── NotificationCenter.tsx # 📢 Toast notifications system
│   │   ├── AnalyticsLogger.tsx    # 📊 Development analytics viewer  
│   │   └── EventDemo.tsx      # 🎯 Event system showcase
│   │
│   ├── 📂 state/              # 🏪 Global State Management (Context/Provider)
│   │   ├── provider-builder.tsx # 🔧 Utility for composing multiple providers
│   │   ├── theme/             # 🎨 Theme state management
│   │   │   ├── theme-context.tsx  # Theme context definition
│   │   │   └── theme-provider.tsx # Theme state logic
│   │   └── cart/              # 🛒 Shopping cart state management  
│   │       ├── cart-context.tsx   # Cart context definition
│   │       └── cart-provider.tsx  # Cart state logic & business rules
│   │
│   ├── 📂 events/             # 📡 Custom Event System (decoupled communication)
│   │   ├── index.ts           # 🎯 Central event type definitions
│   │   ├── cart-events.ts     # 🛒 Cart domain events
│   │   ├── theme-events.ts    # 🎨 Theme change events
│   │   ├── notification-events.ts # 📢 Notification events
│   │   ├── analytics-events.ts    # 📊 Analytics tracking events
│   │   ├── ui-events.ts       # 🖱️ UI interaction events
│   │   ├── use-cart-events.ts     # 🛒 Cart event utilities
│   │   ├── use-notification-events.ts # 📢 Notification utilities
│   │   └── use-analytics-events.ts    # 📊 Analytics utilities
│   │
│   ├── 📂 hooks/              # 🎣 Custom React Hooks
│   │   ├── use-event.tsx      # 🎯 Core event system hook
│   │   └── use-cart.tsx       # 🛒 Cart context access hook
│   │
│   └── 📂 data/               # 📦 Static Data & Types
│       └── products.ts        # Sample product data for demo
│
├── 📁 .vscode/               # 🛠️ VS Code workspace settings
├── 📄 biome.json            # ⚡ Code formatting & linting config
├── 📄 package.json          # 📦 Dependencies & scripts
├── 📄 tsconfig.json         # 🔧 TypeScript configuration
└── 📄 index.html            # 🌐 HTML entry point
```

### 🎯 Key Architectural Patterns

#### **📂 Domain-Driven Organization**
Each major feature/domain has its own folder:
- **`cart/`**: Everything related to shopping cart functionality
- **`theme/`**: Theme management (light/dark mode)  
- **`events/`**: Event system organized by business domain
- **`components/`**: UI components grouped by functionality

#### **🔄 Data Flow Architecture** 
```
User Interaction → Component → Context/Provider → Event System → Other Components
     ↑                                                                    ↓
     └─── UI Updates ←─── State Changes ←─── Event Handlers ←──────────────┘
```

#### **🎯 Separation of Concerns**
- **Components**: Pure UI logic, minimal business logic
- **Context/Providers**: Domain-specific state management  
- **Events**: Cross-cutting concerns (notifications, analytics)
- **Hooks**: Reusable logic abstraction
- **Data**: Static configurations and sample data

### 📚 Learning by Exploring

#### **🎯 Start Here: Core Concepts (Beginner)**
1. **📄 `App.tsx`** - See how providers are composed and the overall app structure
2. **📁 `state/cart/`** - Understand Context/Provider pattern with a real example  
3. **📄 `components/Header.tsx`** - See how components consume context
4. **📄 `components/ProductCard.tsx`** - Learn context usage in interactive components

#### **🚀 Intermediate Exploration**
5. **📄 `events/use-event.tsx`** - Study the core event system implementation
6. **📄 `components/NotificationCenter.tsx`** - See event listeners in action
7. **📄 `state/cart/cart-provider.tsx`** - Observe event dispatching from providers  
8. **📄 `events/use-notification-events.ts`** - Learn domain-specific event utilities

#### **⚡ Advanced Deep Dive**  
9. **📄 `components/CounterLogger.tsx`** - Master useEffectEvent and Activity components
10. **📄 `state/provider-builder.tsx`** - Study advanced TypeScript patterns
11. **📁 `events/`** - Explore the complete modular event architecture
12. **📄 `biome.json`** - Learn professional code quality setup

---

## ⚡ Code Quality & Formatting  

> **🎓 Learning Goal**: Understand professional development workflows and code quality tools

### 🛠️ Why Code Quality Matters

**Professional development requires**:
- **Consistent formatting** so team members can focus on logic, not style
- **Automated linting** to catch common errors before they reach production  
- **Type safety** to prevent runtime errors and improve developer experience
- **Performance optimization** through faster tools and better practices

This project uses **[Biome](https://biomejs.dev/)** - a modern, lightning-fast formatter and linter built specifically for JavaScript/TypeScript.

### 📦 Setup & Installation

```bash
# 1. Clone and install
git clone <your-repo-url>
cd ReactTypeScriptPlayground
npm install

# 2. Install Biome VS Code Extension (highly recommended)
# Open VS Code → Extensions → Search "Biome" → Install

# 3. Start development with automatic formatting
npm start
```

### 🎯 Available Scripts & Workflow

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `npm run format` | Format all files | Before committing code |
| `npm run format:check` | Check formatting without changes | In CI/CD pipelines |  
| `npm run lint` | Check for code issues | During development |
| `npm run lint:fix` | Fix auto-fixable issues | When you see linting errors |
| `npm run check` | Run both format + lint checks | Before pushing to repository |
| `npm run check:fix` | Apply all safe fixes | Quick cleanup |

### ⚙️ Configuration Deep Dive

```jsonc
// biome.json - Professional configuration
{
  "formatter": {
    "indentStyle": "space",      // Consistent with React ecosystem  
    "indentWidth": 2,            // Standard for frontend projects
    "lineWidth": 80,             // Readable line length
    "lineEnding": "lf"           // Cross-platform compatibility
  },
  "linter": {
    "rules": {
      "recommended": true,        // Industry best practices
      "correctness": {
        "useExhaustiveDependencies": "warn"  // React Hook optimization
      },
      "a11y": {                  // Accessibility compliance
        "useButtonType": "error"  
      }
    }
  }
}
```

### 🎨 VS Code Integration Features

With the Biome extension installed:

✅ **Format on Save**: Code automatically formats when you save  
✅ **Real-time Linting**: See errors/warnings as you type  
✅ **Quick Fixes**: Use `Cmd/Ctrl + Shift + P` → "Biome: Quick fix"  
✅ **Import Organization**: Automatically sorts and cleans imports  
✅ **Type Checking**: Full TypeScript support with error highlighting  

### 🚀 Why Biome Over Alternatives?

| Feature | Biome | ESLint + Prettier |
|---------|-------|-------------------|
| **Speed** | 10-100x faster | Baseline |
| **Setup** | Zero config | Complex configuration |
| **Tools** | Single tool | Two separate tools |
| **TypeScript** | Native support | Requires plugins |
| **Memory** | Low footprint | High memory usage |

---

## 🚀 Getting Started

### 🎯 Quick Start Guide

```bash
# 1. Prerequisites: Node.js 16+ and npm/yarn
node --version  # Should be 16+

# 2. Install dependencies  
npm install

# 3. Install Biome VS Code extension for best experience
# VS Code → Extensions → Search "Biome" → Install

# 4. Start development server
npm start

# 5. Open http://localhost:1234 and explore!
```

### 🔧 Development Workflow

```bash
# Daily development
npm start                    # Start dev server with hot reload

# Code quality checks  
npm run format              # Format code before committing
npm run lint                # Check for issues
npm run check:fix           # Quick fix common issues

# Troubleshooting
rm -rf .parcel-cache dist   # Clear build cache if needed
npm start                   # Restart server
```

---

## 🧪 Experimental Features Notice

> **⚠️ Educational Purpose**: This project showcases cutting-edge React patterns

**Experimental Features Used**:
- **`useEffectEvent`** - Stable event handlers (React RFC)
- **`Activity`** - Component lifecycle control (React Labs)

**Why include experimental features?**
- Learn future React patterns before they're mainstream
- Understand the problems these features solve
- Prepare for React's evolution
- See real-world implementations

**For Production**: Use stable alternatives until these features are officially released.

---

## 🎓 Learning Outcomes

After exploring this project, you'll understand:

### **🏗️ Architectural Patterns**
✅ **Context/Provider**: Global state without prop drilling  
✅ **Event-Driven Architecture**: Decoupled component communication  
✅ **Domain Organization**: Scalable file and folder structure  
✅ **Type-Safe Development**: Comprehensive TypeScript patterns  

### **⚡ Advanced React Concepts**
✅ **Performance Optimization**: useMemo, useCallback, and component lifecycle control  
✅ **State Management**: Complex state logic with business rules  
✅ **Event Handling**: Custom hooks and stable event handlers  
✅ **Component Composition**: Building reusable, composable UI components  

### **🛠️ Professional Development**
✅ **Code Quality**: Automated formatting and linting workflows  
✅ **Developer Experience**: VS Code integration and productivity tools  
✅ **Modern Tooling**: Biome, Parcel, and TypeScript configuration  
✅ **Best Practices**: Error handling, accessibility, and performance patterns

---

## 🌐 Custom Event System

> **🎓 Learning Goal**: Master decoupled component communication using native browser events with full TypeScript support

### 🤔 The Problem: Component Communication

#### **Without Event System - Tightly Coupled**
```tsx
// ❌ Components must know about each other
function ShoppingCart({ onItemAdded }) {
  const addItem = (item) => {
    setItems([...items, item]);
    onItemAdded(item); // Must call parent callback
  };
}

function App() {
  const handleItemAdded = (item) => {
    // Manually coordinate between multiple components
    showNotification(`${item.name} added!`);
    trackAnalytics('item_added', item);
    updateRecommendations(item);
  };

  return (
    <div>
      <ShoppingCart onItemAdded={handleItemAdded} />
      <NotificationCenter />  {/* Tightly coupled */}
      <AnalyticsLogger />     {/* Must pass props down */}
      <Recommendations />     {/* Complex prop threading */}
    </div>
  );
}
```

#### **With Event System - Loosely Coupled**
```tsx
// ✅ Components communicate through events - no direct coupling!
function ShoppingCart() {
  const { dispatch } = useEvent('cart:item-added');
  
  const addItem = (item) => {
    setItems([...items, item]);
    dispatch({ productId: item.id, productName: item.name }); // Fire event
  };
}

// Each component listens independently - no prop drilling!
function NotificationCenter() {
  useEvent('cart:item-added', ({ productName }) => {
    showNotification(`${productName} added to cart! 🛒`);
  });
}

function AnalyticsLogger() {
  useEvent('cart:item-added', ({ productId }) => {
    trackAnalytics('cart_item_added', { productId });
  });
}
```

### 💡 Step-by-Step Implementation

#### **Step 1: Core Event Hook**
```tsx
// 📁 hooks/use-event.tsx - The foundation of our event system
export const useEvent = <EventName extends keyof CustomWindowEventMap>(
  eventName: EventName,
  callback?: (payload: CustomWindowEventMap[EventName]['detail']) => void
) => {
  // ✨ Set up event listener for this component
  useEffect(() => {
    if (!callback) return;
    
    const listener = ((event: CustomWindowEventMap[EventName]) => {
      callback(event.detail); // Pass the payload to callback
    }) as EventListener;

    // Use native browser event system
    window.addEventListener(eventName, listener);
    
    return () => {
      window.removeEventListener(eventName, listener); // Cleanup
    };
  }, [callback, eventName]);

  // ✨ Return function to dispatch events
  const dispatch = useCallback((detail?: CustomWindowEventMap[EventName]['detail']) => {
    const event = new CustomEvent(eventName, { detail });
    window.dispatchEvent(event); // Broadcast to all listeners
  }, [eventName]);

  return { dispatch };
};
```

#### **Step 2: Type-Safe Event Definitions**
```tsx
// 📁 events/index.ts - Central event registry with full type safety
export interface AppEvent<T> extends CustomEvent {
  detail: T;
}

// Define all your application events in one place
export interface CustomWindowEventMap extends WindowEventMap {
  // 🛒 Shopping Cart Events
  'cart:item-added': AppEvent<{ 
    productId: string; 
    productName: string;
    price: number;
  }>;
  'cart:item-removed': AppEvent<{ 
    productId: string; 
  }>;
  'cart:cleared': AppEvent<void>;

  // 📢 Notification Events  
  'notification:show': AppEvent<{ 
    message: string; 
    type: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
  }>;

  // 📊 Analytics Events
  'analytics:track': AppEvent<{ 
    event: string; 
    properties?: Record<string, any>;
  }>;

  // 🎨 Theme Events
  'theme:changed': AppEvent<{ 
    theme: 'light' | 'dark';
    previousTheme: 'light' | 'dark';
  }>;
}

// ✨ This gives us full TypeScript autocomplete and type checking!
```

#### **Step 3: Domain-Specific Event Hooks**
```tsx
// 📁 events/use-cart-events.ts - Focused cart event utilities
export const useCartEvent = <T extends keyof CartEvents>(
  eventName: T,
  callback?: (payload: CartEvents[T]['detail']) => void
) => useEvent(eventName, callback);

// Convenience hooks for common cart events
export const useCartItemAdded = (
  callback: (payload: { productId: string; productName: string; price: number }) => void
) => useCartEvent('cart:item-added', callback);

export const useCartItemRemoved = (
  callback: (payload: { productId: string }) => void
) => useCartEvent('cart:item-removed', callback);

// 📁 events/use-notification-events.ts - Notification utilities
export const useNotifyDispatcher = () => {
  const { dispatch } = useEvent('notification:show');
  
  return {
    success: (message: string, duration?: number) => 
      dispatch({ message, type: 'success', duration }),
    error: (message: string, duration?: number) => 
      dispatch({ message, type: 'error', duration }),
    warning: (message: string, duration?: number) => 
      dispatch({ message, type: 'warning', duration }),
    info: (message: string, duration?: number) => 
      dispatch({ message, type: 'info', duration }),
  };
};

// 📁 events/use-analytics-events.ts - Analytics utilities  
export const useAnalyticsDispatcher = () => {
  const { dispatch } = useEvent('analytics:track');
  
  return {
    track: (eventName: string, properties?: Record<string, any>) => 
      dispatch({ event: eventName, properties }),
    
    // Convenience methods for common events
    pageView: (page: string) => 
      dispatch({ event: 'page_view', properties: { page } }),
    
    userAction: (action: string, target: string) => 
      dispatch({ event: 'user_action', properties: { action, target } }),
  };
};
```

### 🚀 Real-World Usage Examples

#### **Example 1: Shopping Cart with Multi-System Integration**
```tsx
// 📁 state/cart/cart-provider.tsx
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  
  // ✨ Get our event dispatchers
  const notify = useNotifyDispatcher();
  const analytics = useAnalyticsDispatcher();
  const { dispatch: dispatchItemAdded } = useCartEvent('cart:item-added');

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        // Update quantity
        const updatedItems = currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        // ✨ Fire events - multiple systems respond automatically!
        notify.success(`Added another ${newItem.name} to cart`);
        analytics.track('cart_item_quantity_increased', { 
          productId: newItem.id,
          newQuantity: existingItem.quantity + 1
        });
        
        return updatedItems;
      } else {
        // Add new item
        const newItems = [...currentItems, { ...newItem, quantity: 1 }];
        
        // ✨ Broadcast to all interested components
        notify.success(`${newItem.name} added to cart! 🛒`);
        analytics.track('cart_item_added', { productId: newItem.id });
        dispatchItemAdded({ 
          productId: newItem.id, 
          productName: newItem.name,
          price: newItem.price
        });
        
        return newItems;
      }
    });
  }, [notify, analytics, dispatchItemAdded]);

  // ... rest of provider logic
}
```

#### **Example 2: Notification Center - Pure Event Listener**
```tsx
// 📁 components/NotificationCenter.tsx
export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // ✨ Listen to notification events from anywhere in the app
  useEvent('notification:show', ({ message, type, duration = 5000 }) => {
    const notification: Notification = {
      id: crypto.randomUUID(),
      message,
      type,
      timestamp: Date.now()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, duration);
  });

  // ✨ This component doesn't know WHO triggers notifications!
  // It just responds to events - perfect decoupling
  
  return (
    <div style={{ position: 'fixed', top: '1rem', right: '1rem' }}>
      {notifications.map(notification => (
        <NotificationItem 
          key={notification.id} 
          notification={notification}
          onRemove={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        />
      ))}
    </div>
  );
}
```

#### **Example 3: Analytics Logger - Development Tool**
```tsx
// 📁 components/AnalyticsLogger.tsx  
export function AnalyticsLogger() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  // ✨ Listen to ALL analytics events across the entire app
  useEvent('analytics:track', ({ event, properties }) => {
    const analyticsEvent = {
      id: crypto.randomUUID(),
      event,
      properties,
      timestamp: Date.now()
    };

    setEvents(prev => [...prev, analyticsEvent].slice(-10)); // Keep last 10

    // In production, send to your analytics service:
    // sendToAnalytics(event, properties);
    
    console.log('📊 Analytics:', event, properties);
  });

  // Perfect for development - see all analytics events in one place!
  return (
    <div style={{ position: 'fixed', bottom: '1rem', left: '1rem' }}>
      <details>
        <summary>📊 Analytics Events ({events.length})</summary>
        <div style={{ maxHeight: '200px', overflow: 'auto' }}>
          {events.map(evt => (
            <div key={evt.id} style={{ fontSize: '0.75rem', marginBottom: '4px' }}>
              <strong>{evt.event}</strong>: {JSON.stringify(evt.properties)}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
```

### 🎯 Key Benefits & Architecture Advantages

#### **🔧 Technical Benefits**
✅ **Decoupled Architecture**: Components don't need to know about each other  
✅ **Type Safety**: Full TypeScript autocomplete and error checking  
✅ **Native Performance**: Uses browser's optimized event system  
✅ **Memory Efficient**: Automatic cleanup prevents memory leaks  
✅ **Debugging Friendly**: Easy to track events in console/devtools  
✅ **Scalable**: Add new listeners without modifying existing code  

#### **🎯 Perfect Use Cases**
🎯 **Cross-Component Notifications**: Toast messages, alerts, status updates  
🎯 **Analytics & Tracking**: User interactions, business metrics, error logging  
🎯 **Global State Synchronization**: Theme changes, user authentication status  
🎯 **Development Tools**: Debug loggers, performance monitors  
🎯 **Third-Party Integrations**: External APIs, chat widgets, payment systems  
🎯 **Micro-Frontend Communication**: Events between independent app sections  

### 📁 Event System File Organization

```
src/events/
├── index.ts                    # 🎯 Central event type definitions
├── use-event.tsx               # 🔧 Core event hook implementation
├── cart-events.ts              # 🛒 Shopping cart domain events
├── theme-events.ts             # 🎨 Theme system events
├── notification-events.ts      # 📢 Notification system events  
├── analytics-events.ts         # 📊 Analytics and tracking events
├── ui-events.ts               # 🖱️ UI interaction events
├── use-cart-events.ts         # 🛒 Cart-specific hook utilities
├── use-notification-events.ts  # 📢 Notification utilities
└── use-analytics-events.ts     # 📊 Analytics utilities
```

### ⚠️ Best Practices & Pitfalls

#### **✅ Do This**
```tsx
// Good: Descriptive, namespaced event names
'cart:item-added'
'user:profile-updated' 
'navigation:page-changed'

// Good: Type your event payloads
interface CartItemAdded {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}

// Good: Clean up listeners
useEffect(() => {
  const handleEvent = (event) => { /* ... */ };
  window.addEventListener('my-event', handleEvent);
  return () => window.removeEventListener('my-event', handleEvent);
}, []);
```

#### **❌ Avoid This**
```tsx
// Bad: Generic, unclear event names
'update'
'change'
'data'

// Bad: Untyped events
const event = new CustomEvent('something', { detail: anyData });

// Bad: Forgetting cleanup (memory leaks!)
window.addEventListener('event', handler); // No cleanup
```

---

## 🌟 Next Steps & Further Learning

### 🎯 **Extend This Project**
- **Add new domains**: User authentication, product reviews, wishlists
- **Implement new events**: Search events, navigation events, error tracking
- **Experiment with contexts**: Add user preferences, app configuration
- **Try new patterns**: Add React Query, Zustand, or other state libraries

### 📚 **Related Learning Resources**

#### **React Patterns & Architecture**
- [React Context Documentation](https://react.dev/learn/passing-data-deeply-with-context)
- [React Composition Patterns](https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children)  
- [Performance Best Practices](https://react.dev/learn/render-and-commit)

#### **Experimental Features & Future React**
- [useEffectEvent RFC](https://github.com/reactjs/rfcs/blob/useevent/text/0000-useevent.md)
- [React Labs Updates](https://react.dev/blog/2022/03/29/react-v18#new-feature-concurrent-features)
- [Activity Component Discussion](https://github.com/facebook/react/discussions)

#### **TypeScript & Code Quality**  
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Biome Documentation](https://biomejs.dev/guides/getting-started/)
- [Advanced TypeScript Patterns](https://www.typescriptlang.org/docs/handbook/utility-types.html)

### 💡 **Practice Challenges**

1. **Add a new context**: Create a `UserPreferencesProvider` with language, currency, etc.
2. **Implement search events**: Add search functionality with event-driven result updates  
3. **Build a notification queue**: Enhance the notification system with queuing and priorities
4. **Create custom hooks**: Extract common logic into reusable custom hooks
5. **Add error boundaries**: Implement error handling with event-driven error reporting

---

**Happy Learning! 🚀** 

*Master these patterns and you'll be ready for any React challenge that comes your way.*
