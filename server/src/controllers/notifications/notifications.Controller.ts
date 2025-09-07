import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../core/types";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { handleControllerError, sendResponse, throwError,  } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
import { INotificationController } from "../../core/interfaces/controllers/notifications/INotifications.Controller";
import { decodeToken } from "../../utils/JWTtoken";
import { Messages } from "../../constants/messages";
@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService
  ) {}

  async createNotification(req: Request, res: Response): Promise<void> {
  try {
    const io = req.app.get("io"); 
    await this._notificationService.createNotification(req.body, io);
    sendResponse(res, StatusCode.CREATED, Messages.NOTIFICATIONS.CREATED, true);
  } catch (error) {
    handleControllerError(res, error);
  }
}

  async getMyNotifications(req: Request, res: Response): Promise<void> {
    try {
      const userId = decodeToken(req.cookies.token)?.id
      if(!userId)throwError(Messages.COMMON.UNAUTHORIZED,StatusCode.UNAUTHORIZED)
      const notifications = await this._notificationService.getMyNotifications(userId);
      sendResponse(res, StatusCode.OK,Messages.NOTIFICATIONS.FETCHED, true, notifications);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async markAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this._notificationService.markAsRead(id);
      sendResponse(res, StatusCode.OK, Messages.NOTIFICATIONS.MARKED_AS_READ, result);
    } catch (error) {
      handleControllerError(res, error);
    }
  }

  async markAllAsRead(req: Request, res: Response): Promise<void> {
    try {
      const decoded = decodeToken(req.cookies.token)
      if(!decoded) throwError( Messages.COMMON.UNAUTHORIZED,StatusCode.UNAUTHORIZED)
      const count = await this._notificationService.markAllAsRead(decoded?.id);
      sendResponse(res, StatusCode.OK,  Messages.NOTIFICATIONS.MARKED_ALL_AS_READ(count), true);
    } catch (error) {
      handleControllerError(res, error);
    }
  }
}
