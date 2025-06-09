import { useState } from "react";
import {
  Calendar,
  Mail,
  DollarSign,
  Star,
  Settings,
  X,
  Bell,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";

const NotificationsPage = () => {
  const mockNotifications = [
    {
      id: 1,
      type: "booking",
      message: 'New booking request from John D. for "Plumbing Repair"',
      timestamp: "2023-06-15T10:30:00Z",
      read: false,
      relatedEntityId: 101,
    },
    {
      id: 2,
      type: "message",
      message: 'New message from Sarah M. regarding "AC Installation"',
      timestamp: "2023-06-15T09:15:00Z",
      read: true,
      relatedEntityId: 102,
    },
    {
      id: 3,
      type: "payment",
      message: "Payment received for service #2034 ($120.00)",
      timestamp: "2023-06-14T16:45:00Z",
      read: true,
      relatedEntityId: 2034,
    },
    {
      id: 4,
      type: "review",
      message: "You received a 5-star review from Michael T.",
      timestamp: "2023-06-14T14:20:00Z",
      read: false,
      relatedEntityId: 304,
    },
    {
      id: 5,
      type: "system",
      message: "System maintenance scheduled for June 20, 2:00 AM - 4:00 AM",
      timestamp: "2023-06-13T11:10:00Z",
      read: true,
      relatedEntityId: null,
    },
    {
      id: 6,
      type: "booking",
      message: 'Booking confirmed for "Electrical Wiring" with Lisa K.',
      timestamp: "2023-06-13T09:30:00Z",
      read: true,
      relatedEntityId: 105,
    },
    {
      id: 7,
      type: "cancellation",
      message: "Booking #210 cancelled by customer",
      timestamp: "2023-06-12T17:55:00Z",
      read: false,
      relatedEntityId: 210,
    },
  ];

  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        read: true,
      }))
    );
  };

  const getIconForType = (type) => {
    const iconSize = 20;
    const iconClass = "text-gray-600 dark:text-white";

    const icons = {
      booking: <Calendar size={iconSize} className={iconClass} />,
      message: <Mail size={iconSize} className={iconClass} />,
      payment: <DollarSign size={iconSize} className={iconClass} />,
      review: <Star size={iconSize} className={iconClass} />,
      system: <Settings size={iconSize} className={iconClass} />,
      cancellation: <X size={iconSize} className={iconClass} />,
    };

    return icons[type] || <Bell size={iconSize} className={iconClass} />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read;
    if (filter === "booking") return notification.type === "booking";
    if (filter === "payment") return notification.type === "payment";
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto font-sans">
      <PageHeader
        title="Notifications"
        actionLabel="Notifications Settings"
        actionLink="/dashboard/notifications/settings"
        actionIcon={Settings}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            className={`cursor-pointer px-4 py-2 rounded-md border border-border-500 text-text-400 dark:text-white ${
              filter === "all"
                ? "bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/50 border-transparent text-white"
                : "bg-surface-500 dark:bg-surface-800 border-border-500 dark:border-border-800"
            }`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button
            className={`cursor-pointer px-4 py-2 rounded-md border border-border-500 text-text-400 dark:text-white ${
              filter === "unread"
                ? "bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/50 border-transparent text-white"
                : "bg-surface-500 dark:bg-surface-800 border-border-500 dark:border-border-800"
            }`}
            onClick={() => setFilter("unread")}
          >
            Unread
          </button>
          <button
            className={`cursor-pointer px-4 py-2 rounded-md border border-border-500 text-text-400 dark:text-white ${
              filter === "booking"
                ? "bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/50 border-transparent text-white"
                : "bg-surface-500 dark:bg-surface-800 border-border-500 dark:border-border-800"
            }`}
            onClick={() => setFilter("booking")}
          >
            Bookings
          </button>
          <button
            className={`cursor-pointer px-4 py-2 rounded-md border border-border-500 text-text-400 dark:text-white ${
              filter === "payment"
                ? "bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/50 border-transparent text-white"
                : "bg-surface-500 dark:bg-surface-800 border-border-500 dark:border-border-800"
            }`}
            onClick={() => setFilter("payment")}
          >
            Payments
          </button>
        </div>

        <button
          className="px-4 py-2 rounded-md bg-primary-500 hover:bg-primary-600 dark:bg-primary-500/60 dark:hover:bg-primary-500/50 text-white transition-colors"
          onClick={markAllAsRead}
        >
          Mark all as read
        </button>
      </div>

      {filteredNotifications.length === 0 ? (
        <p className="text-center py-10 text-gray-500">
          No notifications found
        </p>
      ) : (
        <ul className="space-y-3">
          {filteredNotifications.map((notification) => (
            <li
              key={notification.id}
              className={`p-4 bg-surface-500 dark:bg-surface-800 rounded-lg shadow-sm hover:shadow-md text-text-400 dark:text-white transition-shadow border border-border-500 dark:border-border-800 cursor-pointer relative ${
                !notification.read
                  ? "border-l-4 border-l-primary-500 dark:border-l-primary-500/60 border-border-500 dark:border-border-800"
                  : ""
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl mt-1">
                  {getIconForType(notification.type)}
                </span>
                <div className="flex-1">
                  <p>{notification.message}</p>
                  <small className="text-gray-500 text-sm">
                    {formatDate(notification.timestamp)}
                  </small>
                </div>
                {!notification.read && (
                  <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-danger-500 dark:danger-800/50 rounded-full"></span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;
