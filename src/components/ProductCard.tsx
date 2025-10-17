import { useContext } from "react";
import { useCart } from "../hooks/use-cart";
import { ThemeContext } from "../state/theme/theme-context";

export type Product = {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx?.theme || "light";

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
    });
  };

  const cardStyle = {
    border: theme === "light" ? "1px solid #ddd" : "1px solid #34495e",
    borderRadius: "8px",
    padding: "1rem",
    backgroundColor: theme === "light" ? "white" : "#34495e",
    color: theme === "light" ? "#333" : "#ecf0f1",
    boxShadow:
      theme === "light"
        ? "0 2px 4px rgba(0,0,0,0.1)"
        : "0 2px 4px rgba(0,0,0,0.3)",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const imagePlaceholderStyle = {
    width: "100%",
    height: "200px",
    backgroundColor: theme === "light" ? "#f8f9fa" : "#2c3e50",
    borderRadius: "4px",
    marginBottom: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9em",
    color: theme === "light" ? "#666" : "#bdc3c7",
  };

  const descriptionStyle = {
    margin: "0 0 1rem 0",
    color: theme === "light" ? "#666" : "#bdc3c7",
    fontSize: "0.9em",
    lineHeight: "1.4",
  };

  return (
    <div style={cardStyle}>
      {product.image && (
        <div style={imagePlaceholderStyle}>{product.image}</div>
      )}

      <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2em" }}>
        {product.name}
      </h3>

      {product.description && (
        <p style={descriptionStyle}>{product.description}</p>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1rem",
        }}
      >
        <span
          style={{
            fontSize: "1.3em",
            fontWeight: "bold",
            color: "#007bff",
          }}
        >
          ${product.price.toFixed(2)}
        </span>

        <button
          type="button"
          onClick={handleAddToCart}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#218838";
          }}
          onFocus={(e) => {
            e.currentTarget.style.backgroundColor = "#218838";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#28a745";
          }}
          onBlur={(e) => {
            e.currentTarget.style.backgroundColor = "#28a745";
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
