import { ObjectId, Types } from "mongoose";
import { IUser } from "../../../../types/userTypes";

export interface IMentorStudentService {
  getStudentDetilesService(courseId: string | ObjectId): Promise<IUser[]>;
  studentStatusService(
    userId: string | Types.ObjectId,
    courseId: string | Types.ObjectId,
    status: boolean
  ): Promise<void>;
}
