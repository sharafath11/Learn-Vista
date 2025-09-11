import { INotificationRepository } from "../../core/interfaces/repositories/notifications/INotificationsRepository";
import { NotificationModel } from "../../models/notifications/NotificationModal";
import { INotification } from "../../types/notificationsTypes";
import { BaseRepository } from "../baseRepository";

export class NotificationRepository extends BaseRepository<INotification, INotification> implements INotificationRepository{
    constructor() {
        super(NotificationModel)
    }
}