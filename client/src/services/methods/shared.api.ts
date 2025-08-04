import { getRequest, patchRequest, postRequest } from "../api";
import { INotificationPayload } from "../../types/notificationsTypes";
import axios from "axios";
import { baseURL } from "../AxiosInstance";

const get = getRequest;
const patch = patchRequest;
const post = postRequest;

export const SharedAPIMethods = {
  getMyNotifications: () => get("/shared/notifications"),
  markAsRead: (id: string) => patch(`/shared/notifications/${id}/read`, {}),
  markAllAsRead: () => patch("/shared/notifications/mark-all-read", {}),
  createNotification: (data: INotificationPayload) => post("/shared/notifications", data),
  getSignedS3Url: (key: string) => post("/shared/s3/signed-url", { key }),
  askDoubt: (input: string) => post(`${baseURL}/ai/doubt`, { text: input })
  
};