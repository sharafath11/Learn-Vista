"use client";
import { useEffect, useRef } from "react";
import { initializeSocket } from "@/src/utils/socket";
import { showErrorToast, showInfoToast, showSuccessToast } from "@/src/utils/Toast";
import { INotification } from "@/src/types/notificationsTypes";

interface Props {
  userId: string;
  role: "admin" | "mentor" | "user";
}

export const NotificationListener = ({ userId, role }: Props) => {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!userId || !role) {
      console.warn("NotificationListener: Missing userId or role");
      return;
    }

    const socket = initializeSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`[SOCKET] Connected: ${socket.id}`);
      socket.emit("register-user", userId);
      socket.emit("join-room", `${role}-room`);
      console.log(`[SOCKET] Registered ${userId} and joined room ${role}-room`);
    });

    socket.on("notification", (data: INotification) => {
      const { title, message, type } = data;
      console.log(`[SOCKET] Notification received (${role}):`, title, message);

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
      console.warn("[SOCKET] Disconnected");
    });

    return () => {
      socket.disconnect();
      console.log("[SOCKET] Disconnected on unmount");
    };
  }, [userId, role]);

  return null;
};
