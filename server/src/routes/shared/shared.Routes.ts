import express from "express";
import container from "../../core/di/container";
import { TYPES } from "../../core/types";
import { INotificationController } from "../../core/interfaces/controllers/notifications/INotifications.Controller";
import { ISharedController } from "../../core/interfaces/controllers/shared/ISharedController";

const router = express.Router();
const notificationController = container.get<INotificationController>(TYPES.NotificationController);
const sharedController = container.get<ISharedController>(TYPES.SharedController);
router
  .route("/notifications")
  .get(notificationController.getMyNotifications.bind(notificationController))
  .post(notificationController.createNotification.bind(notificationController));
router.patch("/notifications/:id/read",notificationController.markAsRead.bind(notificationController));
router.patch("/notifications/mark-all-read",notificationController.markAllAsRead.bind(notificationController));
router.get("/refresh-token",sharedController.refeshToken.bind(sharedController))
router.post("/uploads/signed-url", sharedController.getSignedS3Url.bind(sharedController));
router.post("/ai/doubt",sharedController.batmanAi.bind(sharedController))
export default router;
