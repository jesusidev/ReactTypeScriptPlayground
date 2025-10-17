import { useContext } from "react";
import { useAnalyticsDispatcher } from "../events/use-analytics-events";
import { ThemeContext } from "../state/theme/theme-context";

export function Theme() {
  const ctx = useContext(ThemeContext);
  const analytics = useAnalyticsDispatcher();

  if (!ctx) throw new Error("ThemeContext missing");
  const { theme, toggle } = ctx;

  const handleToggle = () => {
    toggle();
    analytics.userAction(
      "theme_toggled",
      "ui",
      `switched_to_${theme === "light" ? "dark" : "light"}`
    );
  };

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "white",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            fontSize: "1.5rem",
            filter: theme === "dark" ? "grayscale(0)" : "grayscale(1)",
            transition: "filter 0.3s ease",
          }}
        >
          {theme === "light" ? "☀️" : "🌙"}
        </div>

        <div>
          <h4 style={{ margin: "0 0 0.25rem 0", color: "#333" }}>
            Theme Settings
          </h4>
          <p style={{ margin: 0, color: "#666", fontSize: "0.9em" }}>
            Current theme:{" "}
            <strong
              style={{
                color: theme === "light" ? "#f39c12" : "#6c5ce7",
                textTransform: "capitalize",
              }}
            >
              {theme}
            </strong>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        style={{
          padding: "0.75rem 1.5rem",
          backgroundColor: theme === "light" ? "#2c3e50" : "#f39c12",
          color: theme === "light" ? "white" : "#2c3e50",
          border: "none",
          borderRadius: "25px",
          cursor: "pointer",
          fontSize: "0.9rem",
          fontWeight: "600",
          transition: "all 0.3s ease",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
        onFocus={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
        }}
      >
        <span>{theme === "light" ? "🌙" : "☀️"}</span>
        Switch to {theme === "light" ? "Dark" : "Light"}
      </button>
    </div>
  );
}
