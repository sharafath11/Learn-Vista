import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { handleControllerError, sendResponse, throwError,  } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { INotificationController } from "../../core/interfaces/controllers/notifications/INotifications.Controller";
import { decodeToken } from "../../utils/JWTtoken";
@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  async createNotification(req: Request, res: Response): Promise<void> {
  try {
    const io = req.app.get("io"); // ✅ available in controller
    await this.notificationService.createNotification(req.body, io);
    sendResponse(res, StatusCode.CREATED, "Notification created successfully", true);
  } catch (error) {
    handleControllerError(res, error);
  }
}

  async getMyNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id || req.body.userId; 
      const notifications = await this.notificationService.getMyNotifications(userId);
      sendResponse(res, StatusCode.OK, "Notifications fetched", true, notifications);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.notificationService.markAsRead(id);
      sendResponse(res, StatusCode.OK, "Notification marked as read", result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token)
      if(!decoded) throwError("UnHothized",StatusCode.UNAUTHORIZED)
      const count = await this.notificationService.markAllAsRead(decoded?.id);
      sendResponse(res, StatusCode.OK, `Marked ${count} notifications as read`, true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
