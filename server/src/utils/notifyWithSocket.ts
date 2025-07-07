// src/utils/notifyWithSocket.ts
import { INotificationService } from "../core/interfaces/services/notifications/INotificationService";
import { NotificationType, NotifyParams } from "../types/notificationsTypes";
import { getIOInstance } from "../config/globalSocket";

export async function notifyWithSocket({
  notificationService,
  userId,
  title,
  message,
  type,
}: NotifyParams): Promise<void> {
  if (!userId) return;
  await notificationService.createNotification({ userId, title, message, type });
  try {
    const io = getIOInstance();
    console.log("triger the notification")
    io.to(userId).emit("notification", { title, message, type });
  } catch (err) {
    console.warn(" Socket.IO not initialized or user room missing.");
  }
}
