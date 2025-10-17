import React from "react";
import { useAnalyticsDispatcher } from "../events/use-analytics-events";
import { useNotifyDispatcher } from "../events/use-notification-events";

export function EventDemo() {
  const notify = useNotifyDispatcher();
  const analytics = useAnalyticsDispatcher();

  const handleSuccessDemo = () => {
    notify.success("This is a success message!");
    analytics.userAction("demo_success_clicked", "demo");
  };

  const handleErrorDemo = () => {
    notify.error("This is an error message!");
    analytics.userAction("demo_error_clicked", "demo");
  };

  const handleWarningDemo = () => {
    notify.warning("This is a warning message!");
    analytics.userAction("demo_warning_clicked", "demo");
  };

  const handleInfoDemo = () => {
    notify.info("This is an info message!");
    analytics.userAction("demo_info_clicked", "demo");
  };

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "white",
        marginBottom: "1rem",
      }}
    >
      <h3>Event System Demo</h3>
      <p>Test the modular event system with these buttons:</p>

      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <button
          onClick={handleSuccessDemo}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Success Notification
        </button>

        <button
          onClick={handleErrorDemo}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Error Notification
        </button>

        <button
          onClick={handleWarningDemo}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#ffc107",
            color: "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Warning Notification
        </button>

        <button
          onClick={handleInfoDemo}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Info Notification
        </button>
      </div>

      <p style={{ fontSize: "0.9em", color: "#666", marginTop: "1rem" }}>
        Check the console to see analytics events being tracked!
      </p>
    </div>
  );
}
