import container from "../../core/di/container";
import { INotificationController } from "../../core/interfaces/controllers/notifications/INotifications.Controller";
import { ISharedController } from "../../core/interfaces/controllers/shared/ISharedController";
import { TYPES } from "../../core/types";

export const notificationController = container.get<INotificationController>(TYPES.NotificationController);
export const sharedController = container.get<ISharedController>(TYPES.SharedController);