"use client";

import { useState } from "react";
import { FiBell, FiCheck, FiAlertCircle, FiInfo } from "react-icons/fi";
import { useAdminContext } from "@/src/context/adminContext";
import { NotificationAPIMethods } from "@/src/services/APImethods";
import { INotification } from "@/src/types/notificationsTypes";
import { showErrorToast } from "@/src/utils/Toast";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const {
    adminNotifications,
    setAdminNotifications,
    adminUnreadNotification,
    setAdminUnreadNotification,
  } = useAdminContext();

  const unreadNotifications = adminNotifications
    .filter((n) => !n.isRead)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const markAsRead = async (id: string) => {
    const res = await NotificationAPIMethods.markAsRead(id);
    if (res.ok) {
      setAdminNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setAdminUnreadNotification((prev: number) => prev - 1);
    } else {
      showErrorToast(res.msg);
    }
  };

  const markAllAsRead = async () => {
    const res = await NotificationAPIMethods.markAllAsRead();
    if (res.ok) {
      setAdminNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setAdminUnreadNotification(0);
    } else {
      showErrorToast(res.msg);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2 sm:p-3 rounded-xl hover:bg-gray-100 transition-all"
      >
        <FiBell className="w-5 h-5 text-gray-600" />
        {adminUnreadNotification > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium animate-pulse">
            {adminUnreadNotification > 9 ? "9+" : adminUnreadNotification}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-xl bg-white border z-20 max-h-96 overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-r from-red-50 to-pink-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {adminUnreadNotification > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {unreadNotifications.length > 0 ? (
                unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className="p-4 border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div>{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <FiBell className="w-8 h-8 mx-auto mb-2" />
                  <p>No unread notifications</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
