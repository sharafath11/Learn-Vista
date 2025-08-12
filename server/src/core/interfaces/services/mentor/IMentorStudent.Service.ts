import { ObjectId, Types } from "mongoose";
import { IUser } from "../../../../types/userTypes";
import { IMentorStudentResposnse } from "../../../../shared/dtos/user/user-response.dto";

export interface IMentorStudentService {
  getStudentDetilesService(
    courseId: string | ObjectId,
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      status?: 'allowed' | 'blocked' | string;
      sort?: Record<string, 1 | -1>;
    }
  ): Promise<{
    students: IMentorStudentResposnse[];
    total: number;
  }>;
  
  studentStatusService(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId,
    status: boolean
  ): Promise<void>;
}