import { INotificationRepository } from "../../core/interfaces/repositories/notifications/INotificationsRepository";
import { NotificationModel } from "../../models/notifications/notification.modal";
import { INotification } from "../../types/notificationsTypes";
import { BaseRepository } from "../BaseRepository";

export class NotificationRepository extends BaseRepository<INotification, INotification> implements INotificationRepository{
    constructor() {
        super(NotificationModel)
    }
}