"use client"
import { INotification } from "@/src/types/notificationsTypes";
import { initializeSocket } from "@/src/utils/socket";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { useEffect, useRef } from "react";

export const AdminNotificationListener = () => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    const socket = initializeSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Admin connected:", socket.id);
      socket.emit("join-room", "admin-room");
    });

    socket.on("notification", (data: INotification) => {
      const { title, message, type } = data;
      console.log("Admin notification received:", title, message);

      switch (type) {
        case "warning":
        case "success":
          showSuccessToast(`${title}: ${message}`);
          break;
        case "error":
          showErrorToast(`${title}: ${message}`);
          break;
        default:
          showInfoToast(`${title}: ${message}`);
      }
    });

    socket.on("disconnect", () => {
      console.warn("Admin socket disconnected.");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
};
