import React, { Activity, useEffect, useEffectEvent, useState } from "react";
import { useAnalyticsDispatcher } from "../events/use-analytics-events";

interface CounterLoggerProps {
  label: string;
  showDetails: boolean;
}

export function CounterLogger({ label, showDetails }: CounterLoggerProps) {
  const [count, setCount] = useState(0);
  const analytics = useAnalyticsDispatcher();

  // useEffectEvent: Creates a stable event handler that can access latest props/state
  // without causing effects to re-run when those values change
  const logCount = useEffectEvent(() => {
    console.log(`Current count is ${count} — label is "${label}"`);

    // Dispatch analytics event with latest values
    analytics.track("counter_logged", {
      count,
      label,
      timestamp: Date.now(),
    });
  });

  useEffect(() => {
    // This effect only re-runs when `count` changes
    // Even though logCount uses `label`, it doesn't need to be in dependencies
    // because useEffectEvent ensures it always reads the latest `label`
    logCount();
  }, [count]); // Note: label is NOT in dependencies!

  const handleIncrement = () => {
    const newCount = count + 1;
    setCount(newCount);

    // Track user interaction
    analytics.userAction("counter_increment", "demo", label);
  };

  const handleDecrement = () => {
    const newCount = count - 1;
    setCount(newCount);

    // Track user interaction
    analytics.userAction("counter_decrement", "demo", label);
  };

  const handleReset = () => {
    setCount(0);
    analytics.userAction("counter_reset", "demo", label);
  };

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "white",
        marginTop: "1rem",
      }}
    >
      <h3>useEffectEvent & Activity Demo</h3>
      <p>Demonstrates React experimental features with a counter component:</p>

      <div style={{ marginBottom: "1rem" }}>
        <h4 style={{ margin: "0 0 0.5rem 0", color: "#333" }}>{label}</h4>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "1rem",
          }}
        >
          <button
            onClick={handleDecrement}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            -
          </button>

          <div
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#f8f9fa",
              border: "2px solid #007bff",
              borderRadius: "4px",
              fontSize: "1.5rem",
              fontWeight: "bold",
              minWidth: "60px",
              textAlign: "center",
            }}
          >
            {count}
          </div>

          <button
            onClick={handleIncrement}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1.2rem",
            }}
          >
            +
          </button>

          <button
            onClick={handleReset}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        <div
          style={{
            fontSize: "0.9em",
            color: "#666",
            backgroundColor: "#f8f9fa",
            padding: "0.5rem",
            borderRadius: "4px",
            border: "1px solid #dee2e6",
          }}
        >
          <strong>useEffectEvent:</strong> The effect logs on count changes but
          always uses the latest label value without re-running when label
          changes.
        </div>
      </div>

      {/* Activity Component Demo */}
      <div
        style={{
          borderTop: "1px solid #dee2e6",
          paddingTop: "1rem",
          marginTop: "1rem",
        }}
      >
        {/* Activity: Conditionally mount/unmount the details component */}
        <Activity mode={showDetails ? "visible" : "hidden"}>
          <DetailsComponent counter={count} />
        </Activity>
      </div>

      <div
        style={{
          fontSize: "0.8em",
          color: "#666",
          marginTop: "1rem",
          fontStyle: "italic",
        }}
      >
        💡 Check the console to see useEffectEvent logging and Activity
        lifecycle events!
      </div>
    </div>
  );
}

interface DetailsProps {
  counter: number;
}

function DetailsComponent({ counter }: DetailsProps) {
  const [text, setText] = useState("");
  const [mountTime] = useState(() => new Date().toLocaleTimeString());

  useEffect(() => {
    console.log(
      "🎪 Activity - DetailsComponent mounted, counter:",
      counter,
      "at",
      mountTime
    );
    return () => {
      console.log(
        "🎪 Activity - DetailsComponent unmounted, counter:",
        counter,
        "mounted at",
        mountTime
      );
    };
  }, [counter, mountTime]);

  return (
    <div
      style={{
        padding: "1rem",
        border: "1px solid #28a745",
        borderRadius: "6px",
        backgroundColor: "#d4edda",
        marginTop: "0.5rem",
      }}
    >
      <h5 style={{ margin: "0 0 0.5rem 0", color: "#155724" }}>
        Details Component (Activity Demo)
      </h5>

      <p style={{ margin: "0 0 0.5rem 0", color: "#155724" }}>
        <strong>Counter value:</strong> {counter}
      </p>

      <p
        style={{ margin: "0 0 0.5rem 0", color: "#155724", fontSize: "0.9em" }}
      >
        <strong>Mounted at:</strong> {mountTime}
      </p>

      <div style={{ marginTop: "0.5rem" }}>
        <label
          style={{
            display: "block",
            marginBottom: "0.25rem",
            fontSize: "0.9em",
            color: "#155724",
          }}
        >
          Type something (state preserved when hidden):
        </label>
        <input
          type="text"
          placeholder="Your text will be preserved..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            padding: "0.5rem",
            border: "1px solid #c3e6cb",
            borderRadius: "4px",
            backgroundColor: "white",
          }}
        />
      </div>

      {text && (
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem",
            backgroundColor: "#b3d7bf",
            borderRadius: "4px",
            fontSize: "0.9em",
            color: "#155724",
          }}
        >
          <strong>Your input:</strong> {text}
        </div>
      )}
    </div>
  );
}
