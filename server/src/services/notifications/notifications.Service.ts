import { inject, injectable } from "inversify";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { TYPES } from "../../core/types";
import { INotificationRepository } from "../../core/interfaces/repositories/notifications/INotificationsRepository";
import { ICreateNotification, INotification } from "../../types/notificationsTypes";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
    private _notificationRepo: INotificationRepository
  ) {}

  async createNotification(data: ICreateNotification): Promise<void> {
    await this._notificationRepo.create(data);
  }

  async getMyNotifications(userId: string): Promise<INotification[]> {
    const notification = await this._notificationRepo.findAll({ userId });
    return notification
  }

  async markAsRead(id: string): Promise<boolean> {
    const updated = await this._notificationRepo.update(id, { isRead: true });
    return !!updated;
  }

  async markAllAsRead(userId: string): Promise<number> {
    const result = await this._notificationRepo.updateMany(
      { userId, isRead: false },
      { $set: { isRead: true } }
    );
    return result ?? 0;
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this._notificationRepo.delete(id);
  }
}
