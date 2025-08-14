import { IAttachment } from "../../../types/concernTypes";

export interface IConcernResponseDto {
  id: string;
  title: string;
  message: string;
  courseId?: string;
  status: string;
  resolution?: string;
  attachments?:IAttachment[]
  createdAt: Date;
  updatedAt: Date;
  mentorId:string
}

export interface IAdminConcernCourseResponseDto {
  id: string;
  title: string;
}
export interface IMentorConcernAttachment{
  url: string
  type: "image" | "audio"
  filename: string
}
export interface IConernMentorResponse{
  id: string,
  title: string
  message: string
  attachments: IMentorConcernAttachment[]
  courseTitle: string
  status: string
  createdAt:Date
  resolution: string
  courseId:string
}
