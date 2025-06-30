import { Document, Types } from "mongoose"

export interface IAttachment {
  url: string
  type: "image" | "audio"
  filename: string
  size: number
}

export interface IConcern extends Document{
  title:string
  message: string
  attachments?: IAttachment[]
  courseId: Types.ObjectId | string
  mentorId: Types.ObjectId | string
  status?: "open" | "in-progress" | "resolved"
  createdAt?: Date
  updatedAt?: Date
}
