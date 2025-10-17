import { useContext } from "react";
import { useCart } from "../hooks/use-cart";
import { ThemeContext } from "../state/theme/theme-context";

export function Header() {
  const { items, getTotalItems, getTotalPrice, removeItem, updateQuantity } =
    useCart();
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx?.theme || "light";

  const headerStyle = {
    padding: "1rem",
    backgroundColor: theme === "light" ? "#f5f5f5" : "#34495e",
    borderBottom: theme === "light" ? "1px solid #ddd" : "1px solid #2c3e50",
    marginBottom: "1rem",
    color: theme === "light" ? "#333" : "#ecf0f1",
  };

  const cartDropdownStyle = {
    position: "absolute" as const,
    right: 0,
    top: "100%",
    backgroundColor: theme === "light" ? "white" : "#34495e",
    color: theme === "light" ? "#333" : "#ecf0f1",
    border: theme === "light" ? "1px solid #ddd" : "1px solid #2c3e50",
    borderRadius: "4px",
    padding: "1rem",
    minWidth: "300px",
    boxShadow:
      theme === "light"
        ? "0 2px 10px rgba(0,0,0,0.1)"
        : "0 2px 10px rgba(0,0,0,0.3)",
    zIndex: 1000,
  };

  const itemBorderStyle = {
    borderBottom: theme === "light" ? "1px solid #eee" : "1px solid #2c3e50",
  };

  const buttonStyle = {
    padding: "0.25rem 0.5rem",
    border: theme === "light" ? "1px solid #ddd" : "1px solid #5a6c7d",
    backgroundColor: theme === "light" ? "white" : "#5a6c7d",
    color: theme === "light" ? "#333" : "#ecf0f1",
    cursor: "pointer",
  };

  return (
    <header style={headerStyle}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ margin: 0 }}>Shopping App</h1>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ fontWeight: "bold" }}>
            Cart: {getTotalItems()} items - ${getTotalPrice().toFixed(2)}
          </div>

          {items.length > 0 && (
            <details style={{ position: "relative" }}>
              <summary
                style={{
                  cursor: "pointer",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                View Cart
              </summary>

              <div style={cartDropdownStyle}>
                <h3 style={{ margin: "0 0 1rem 0" }}>Cart Items</h3>

                {items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.5rem 0",
                      ...itemBorderStyle,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: "bold" }}>{item.name}</div>
                      <div
                        style={{
                          fontSize: "0.9em",
                          color: theme === "light" ? "#666" : "#bdc3c7",
                        }}
                      >
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        style={buttonStyle}
                      >
                        -
                      </button>

                      <span style={{ minWidth: "2rem", textAlign: "center" }}>
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        style={buttonStyle}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        style={{
                          padding: "0.25rem 0.5rem",
                          border: "1px solid #dc3545",
                          backgroundColor: "#dc3545",
                          color: "white",
                          cursor: "pointer",
                          marginLeft: "0.5rem",
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div
                  style={{
                    marginTop: "1rem",
                    paddingTop: "1rem",
                    borderTop:
                      theme === "light"
                        ? "2px solid #ddd"
                        : "2px solid #2c3e50",
                    fontWeight: "bold",
                  }}
                >
                  Total: ${getTotalPrice().toFixed(2)}
                </div>
              </div>
            </details>
          )}
        </div>
      </div>
    </header>
  );
}
