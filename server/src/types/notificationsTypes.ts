// ✅ types/notificationTypes.ts
import { Types, Document } from "mongoose"

export type NotificationType = "info" | "success" | "error" | "warning"

export interface INotification extends Document {
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


