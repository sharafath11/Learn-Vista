import { Server } from "socket.io";
import { ICreateNotification, INotification } from "../../../../types/notificationsTypes";
import { INotificationResponse } from "../../../../shared/dtos/notification/notification-response.dto";

export interface INotificationService {
  createNotification(data: ICreateNotification,io?:Server): Promise<void>;
  getMyNotifications(userId: string): Promise<INotificationResponse[]>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<number>;
}
