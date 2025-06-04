import { ObjectId, Types } from "mongoose";
import { IUser } from "../../../../types/userTypes";

export interface IMentorStudentService {
  getStudentDetilesService(
    courseId: string | ObjectId,
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: 'allowed' | 'blocked'|string;
    }
  ): Promise<{
    students: IUser[];
    total: number;
  }>;
  
  studentStatusService(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId,
    status: boolean
  ): Promise<void>;
}