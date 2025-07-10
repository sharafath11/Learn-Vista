import { Server } from "socket.io";
import { ICreateNotification, INotification } from "../../../../types/notificationsTypes";

export interface INotificationService {
  createNotification(data: ICreateNotification,io?:Server): Promise<void>;
  getMyNotifications(userId: string): Promise<INotification[]>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<number>;
}
