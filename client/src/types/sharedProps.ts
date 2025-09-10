import { INotification } from "./notificationsTypes";

export interface IChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: string; 
}
export interface ICustomAlertDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
  icon?: string 
  variant?: "info" | "warning" | "error" | "success"
}
export interface IMediaModalProps {
  open: boolean;
  onClose: () => void;
  url: string;
  type?: "image" | "video" | "audio" | "pdf" | "other";
  title?: string;
}
export interface INotificationinProps {
  userId: string;
  role: "admin" | "mentor" | "user";
}
export interface IRoleBasedNotFoundContentProps {
  randomImageUrl: string
}

export interface IVideoPreviewModalProps {
  open: boolean;
  onClose: (open: boolean) => void;
  videoUrl: string;
}
export interface IAllNotificationsProps {
  notifications: INotification[]
  deleteNotification: (id: string) => void
  variant?: "light" | "dark"
}
export interface INotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: INotification[]
  setNotifications: (notifications: INotification[]) => void
  unreadCount: number
  setUnreadCount: (count: number) => void
  isMobile?: boolean
  onRefresh?: () => void
  variant?: "light" | "dark"
}

export interface IUnreadNotificationsProps {
  notifications: INotification[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  variant?: "light" | "dark";
}

