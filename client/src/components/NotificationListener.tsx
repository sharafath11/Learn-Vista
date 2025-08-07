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
          return;
    }

    const socket = initializeSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register-user", userId);
      socket.emit("join-room", `${role}-room`);
    });

    socket.on("notification", (data: INotification) => {
      const { title, message, type } = data;

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
     
    });

    return () => {
      socket.disconnect();
    };
  }, [userId, role]);

  return null;
};
