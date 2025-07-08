"use client";
import { useState } from "react";
import { FiBell, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";
import Link from "next/link";

const mockNotifications = [
  {
    id: 1,
    title: "New user registration",
    message: "John Doe has registered as a new user",
    time: "2 minutes ago",
    type: "info",
    unread: true,
  },
  {
    id: 2,
    title: "System update completed",
    message: "System updated to version 2.1.0",
    time: "1 hour ago",
    type: "success",
    unread: true,
  },
  {
    id: 3,
    title: "Security alert",
    message: "Multiple failed login attempts detected",
    time: "3 hours ago",
    type: "warning",
    unread: false,
  },
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <FiCheck className="w-4 h-4 text-green-500" />;
    case "warning":
      return <FiAlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return <FiInfo className="w-4 h-4 text-blue-500" />;
  }
};

export default function AdminNotificationDropdown() {
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
        className="relative p-2 sm:p-3 rounded-xl hover:bg-gray-100 transition-all"
      >
        <FiBell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {notificationDropdownOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setNotificationDropdownOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-xl bg-white border z-20 max-h-96 overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div>{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FiBell className="w-8 h-8 mx-auto mb-2" />
                  <p>No notifications</p>
                </div>
              )}
            </div>

            <div className="p-3 bg-gray-50 border-t">
              <Link
                href="/admin/notifications"
                className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
