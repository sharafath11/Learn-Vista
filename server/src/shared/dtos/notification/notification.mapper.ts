import { INotification } from "../../../types/notificationsTypes";
import { INotificationResponse } from "./notification-response.dto";

export class NotifcationWrapper {
    static notifcationResponseDto(n: INotification): INotificationResponse{
        return {
            id: n._id.toString(),
            isRead: n.isRead,
            message: n.message,
            createdAt:n.createdAt||new Date()
        }
    }
}