import container from "../../core/di/container";
import { INotificationController } from "../../core/interfaces/controllers/notifications/INotifications.controller";
import { ISharedController } from "../../core/interfaces/controllers/shared/IShared.controller";
import { TYPES } from "../../core/types";

export const notificationController = container.get<INotificationController>(TYPES.NotificationController);
export const sharedController = container.get<ISharedController>(TYPES.SharedController);