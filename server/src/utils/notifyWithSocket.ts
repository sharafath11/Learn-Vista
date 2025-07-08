// src/utils/notifyWithSocket.ts
import { getIOInstance } from "../config/globalSocket";
import { INotificationService } from "../core/interfaces/services/notifications/INotificationService";
import { NotifyParams } from "../types/notificationsTypes";

export async function notifyWithSocket({
  notificationService,
  userIds = [],
  roles = [],
  title,
  message,
  type = "info",
}: NotifyParams & { notificationService: INotificationService }): Promise<void> {
  const io = getIOInstance();

  // Individual user notifications
  for (const userId of userIds) {
    await notificationService.createNotification({ userId, title, message, type });
    io.to(userId).emit("notification", { title, message, type });
    console.log(`[Socket Notify] Sent to userId ${userId}`);
  }

  // Role-based room notifications
  for (const role of roles) {
    const room = `${role}-room`;
    io.to(room).emit("notification", { title, message, type });
    console.log(`[Socket Notify] Sent to role room ${room}`);
  }
}
