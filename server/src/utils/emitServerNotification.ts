// src/utils/emitServerNotification.ts

import { Server } from "socket.io";
import { NotificationType } from "../types/notificationsTypes";

interface ServerNotificationOptions {
  io: Server;
  userId: string;
  title: string;
  message: string;
  type?: NotificationType; 
}

export const emitServerNotification = ({
  io,
  userId,
  title,
  message,
  type = "info",
}: ServerNotificationOptions) => {
  io.to(userId).emit("notification", {
    title,
    message,
    type,
  });
};
