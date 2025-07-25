import express from "express";
import container from "../../core/di/container";
import { TYPES } from "../../core/types";
import { INotificationController } from "../../core/interfaces/controllers/notifications/INotifications.Controller";
import { ISharedController } from "../../core/interfaces/controllers/shared/ISharedController";

const router = express.Router();
const notificationController = container.get<INotificationController>(TYPES.NotificationController);
const sharedController = container.get<ISharedController>(TYPES.SharedController);

router.get(
  "/notifications",
  
  notificationController.getMyNotifications.bind(notificationController)
);
router.patch(
  "/notifications/:id/read",
  
  notificationController.markAsRead.bind(notificationController)
);
router.patch(
  "/notifications/mark-all-read",
  
  notificationController.markAllAsRead.bind(notificationController)
);


router.post(
  "/notifications",
  
  notificationController.createNotification.bind(notificationController)
);
router.post("/s3/signed-url", sharedController.getSignedS3Url.bind(sharedController));
export default router;
