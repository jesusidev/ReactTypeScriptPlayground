import { useContext, useState } from "react";
import { AnalyticsLogger } from "./components/AnalyticsLogger";
import { CounterLogger } from "./components/CounterLogger";
import { EventDemo } from "./components/EventDemo";
import { Header } from "./components/Header";
import { NotificationCenter } from "./components/NotificationCenter";
import { ProductCard } from "./components/ProductCard";
import { Theme } from "./components/Theme";
import { sampleProducts } from "./data/products";
import { CartProvider } from "./state/cart";
import { Providers } from "./state/provider-builder";
import { ThemeContext } from "./state/theme/theme-context";
import { ThemeProvider } from "./state/theme/theme-provider";

function AppContent() {
  const [showDetails, setShowDetails] = useState(false);
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx?.theme || "light";

  const backgroundStyle = {
    minHeight: "100vh",
    backgroundColor: theme === "light" ? "#f8f9fa" : "#2c3e50",
    color: theme === "light" ? "#333" : "#ecf0f1",
    transition: "all 0.3s ease",
  };

  const containerStyle = {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  return (
    <>
      <NotificationCenter />
      <AnalyticsLogger />

      <div style={backgroundStyle}>
        <Header />
        <div style={containerStyle}>
          <div style={{ marginBottom: "2rem" }}>
            <Theme />
            <div
              style={{
                fontSize: "0.9em",
                color: "#666",
                backgroundColor: "#fff3cd",
                padding: "0.5rem",
                borderRadius: "4px",
                border: "1px solid #ffeaa7",
                marginBottom: "1rem",
              }}
            >
              <strong>Activity Component:</strong> Toggle below to see
              conditional mounting with state preservation. When hidden, the
              component unmounts but state is preserved.
            </div>
            <button
              type="button"
              onClick={() => setShowDetails((s) => !s)}
              style={{
                padding: "0.75rem 1.5rem",
                backgroundColor: showDetails ? "#dc3545" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                marginLeft: "1rem",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onFocus={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.15)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
              }}
            >
              {showDetails ? "🙈 Hide Details" : "👁️ Show Details"}
            </button>
            <CounterLogger label="My Counter" showDetails={showDetails} />
            <EventDemo />
          </div>

          <h2
            style={{
              marginBottom: "1.5rem",
              color: theme === "light" ? "#333" : "#ecf0f1",
            }}
          >
            Products
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {sampleProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function App() {
  const providers = [
    [ThemeProvider, { initialTheme: "light" }],
    [CartProvider, {}],
  ] as const;

  return (
    <Providers providers={providers}>
      <AppContent />
    </Providers>
  );
}
export default App;
