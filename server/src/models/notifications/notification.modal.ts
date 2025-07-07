import { Schema, model } from "mongoose"
import { INotification } from "../../types/notificationsTypes"

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  title: { type: String, required: true },
  message: { type: String },
  type: { type: String, enum: ["info", "success", "error", "warning"], default: "info" },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export const NotificationModel = model<INotification>("Notification", NotificationSchema)
