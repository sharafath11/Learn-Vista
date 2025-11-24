import express from "express";
import { notificationController, sharedController } from "./sharedController";

const   router = express.Router();

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
