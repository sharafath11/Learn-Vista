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
  getSignedS3Url: (key: string) => post("/uploads/signed-url", { key }),
  
};
export const batmanAi = {
  askDoubt: async (input: string) => {
    const response = await axios.post(`${baseURL}/shared/ai/doubt`, { text: input });
    return response.data;
  },
};