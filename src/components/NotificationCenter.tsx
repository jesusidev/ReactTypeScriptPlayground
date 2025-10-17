import { useState } from "react";
import { useNotificationEvent } from "../events/use-notification-events";

interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  timestamp: number;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Listen for show notification events using the new modular system
  useNotificationEvent(
    "notification:show",
    ({ message, type, duration = 4000, action }) => {
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        message,
        type,
        timestamp: Date.now(),
        duration,
        ...(action && { action }),
      };

      setNotifications((prev) => [...prev, notification]);

      // Auto-remove after specified duration
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notification.id)
        );
      }, duration);
    }
  );

  // Listen for hide notification events
  useNotificationEvent("notification:hide", ({ id }) => {
    if (id) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  });

  useNotificationEvent("notification:clear-all", () => {
    setNotifications([]);
  });

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            padding: "12px 16px",
            borderRadius: "6px",
            backgroundColor: getBackgroundColor(notification.type),
            color: "white",
            minWidth: "300px",
            maxWidth: "400px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <span>{notification.message}</span>
          <button
            type="button"
            onClick={() => removeNotification(notification.id)}
            style={{
              background: "none",
              border: "none",
              color: "white",
              cursor: "pointer",
              fontSize: "18px",
              padding: "0",
              marginLeft: "10px",
            }}
          >
            ×
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function getBackgroundColor(
  type: "success" | "error" | "info" | "warning"
): string {
  switch (type) {
    case "success":
      return "#28a745";
    case "error":
      return "#dc3545";
    case "info":
      return "#007bff";
    case "warning":
      return "#ffc107";
    default:
      return "#6c757d";
  }
}
