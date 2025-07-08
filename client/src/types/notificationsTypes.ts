// types/notification.ts
export type NotificationType = "info" | "success" | "error" | "warning"

export interface INotification {
  id: string
  title: string
  message?: string
  type: NotificationType
  isRead: boolean
  createdAt: string
}

export interface INotificationPayload {
  userId?: string
  title: string
  message: string
  type?: NotificationType
}