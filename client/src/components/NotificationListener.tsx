"use client";

import { useEffect, useRef } from "react";
import { showErrorToast, showInfoToast, showSuccessToast } from "../utils/Toast";
import { initializeSocket } from "../utils/socket";
import { INotification } from "../types/notificationsTypes";

interface Props {
  userId: string;
}

export const NotificationListener = ({ userId }: Props) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!userId) {
      console.warn("No userId provided to NotificationListener.");
      return;
    }

    const socket = initializeSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`Connected to socket.io server: ${socket.id}`);
      console.log(`Registering user for notifications: ${userId}`);
      socket.emit("register-user", userId);
    });

    socket.on("notification", (data: INotification) => {
      const { title, message, type } = data;
      console.log("Notification received:", title, message);

      switch (type) {
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
      console.warn("🔌 Socket disconnected.");
    });

    return () => {
      console.log(" Disconnecting socket...");
      socket.disconnect();
    };
  }, [userId]);

  return null;
};
