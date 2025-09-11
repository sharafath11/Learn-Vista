import { Request, Response } from "express";

export interface INotificationController {
  createNotification(req: Request, res: Response): Promise<void>;
  getMyNotifications(req: Request, res: Response): Promise<void>;
  markAsRead(req: Request, res: Response): Promise<void>;
  markAllAsRead(req: Request, res: Response): Promise<void>;
}
