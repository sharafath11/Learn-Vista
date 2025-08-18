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
  console.log("socket u",userIds)
  for (const userId of userIds) {
    console.log("socket u",userId)
    await notificationService.createNotification({ userId, title, message, type });
    io.to(userId).emit("notification", { title, message, type });
 
  }
  
  for (const role of roles) {
    const room = `${role}-room`;
    io.to(room).emit("notification", { title, message, type });
    
  }
}
