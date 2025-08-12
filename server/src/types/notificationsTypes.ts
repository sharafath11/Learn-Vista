// ✅ types/notificationTypes.ts
import { Types, Document } from "mongoose"
import { INotificationService } from "../core/interfaces/services/notifications/INotificationService"

export type NotificationType = "info" | "success" | "error" | "warning"

export interface INotification extends Document {
  _id:Types.ObjectId|string
  userId: Types.ObjectId|string,
  title: string
  message?: string
  type?: NotificationType
  isRead?: boolean
  createdAt?: Date
}
export interface ICreateNotification{
  userId: string
  title: string
  message: string
  type?: "info" | "success" | "error" | "warning"
}


export interface NotifyParams {
  notificationService: INotificationService;
  userId?: string;
  userIds?: string[]; 
  roles?: ("admin" | "mentor" | "user")[];
  title: string;
  message: string;
  type: NotificationType;
}
