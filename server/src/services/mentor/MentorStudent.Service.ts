import { ObjectId, Types } from "mongoose";
import { IMentorStudentService } from "../../core/interfaces/services/mentor/IMentorStudent.Service";
import { inject, injectable } from "inversify";
import { IUser } from "../../types/userTypes";
import { TYPES } from "../../core/types"; 
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { throwError } from "../../utils/ResANDError";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { convertSignedUrlInArray, getSignedS3Url } from "../../utils/s3Utilits";

@injectable()
export class MentorStudentService implements IMentorStudentService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.NotificationService) private _notificationService: INotificationService,
    @inject(TYPES.CourseRepository) private _courseRepo:ICourseRepository
  ) {}
   
async getStudentDetilesService(
  courseId: string | ObjectId,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'allowed' | 'blocked';
    sort?: Record<string, 1 | -1>;
  } = {}
): Promise<{ students: IUser[]; total: number; totalPages: number }> {
  const { page = 1, limit = 8, search = '', status, sort = { createdAt: -1 } } = options;

  const courseObjectId = typeof courseId === 'string' ? new Types.ObjectId(courseId) : courseId;

  const baseFilter = {
    enrolledCourses: {
      $elemMatch: {
        courseId: courseObjectId,
        ...(status === 'allowed' && { allowed: true }),
        ...(status === 'blocked' && { allowed: false }),
      },
    },
  };

  let finalFilter: Record<string, unknown> = baseFilter;

  if (search?.trim()) {
    const regex = new RegExp(search, 'i');
    finalFilter = {
      $and: [
        baseFilter,
        {
          $or: [
            { username: { $regex: regex } },
            { email: { $regex: regex } },
            { tag: { $regex: regex } },
            { title: { $regex: regex } },
          ],
        },
      ],
    };
  }
  const { data, total, totalPages } = await this._userRepo.findPaginated(
    finalFilter,
    page,
    limit,
    undefined,
    sort 
  );
  const sendData=await convertSignedUrlInArray(data,["profilePicture"])

  return {
    students: sendData,
    total,
    totalPages,
  };
}






async studentStatusService(
  userId: string | Types.ObjectId,
  courseId: string | Types.ObjectId,
  status: boolean
): Promise<void> {
  
  const user = await this._userRepo.findById(userId as string);
 
  if (!user) {
    
    throwError("User not found");
  }

  const updatedCourses = user.enrolledCourses.map((course) => {
    const courseIdStr = course.courseId?.toString();
    const match = courseIdStr === courseId.toString();
    if (match) {
      return {
        ...course,
        allowed: !status,
      };
    }
    
    return course;
  });

   
   await this._userRepo.update(userId as string, {
    enrolledCourses: updatedCourses,
  });
    const course = await this._courseRepo.findById(courseId.toString());
  if (!course) return;
 

  const statusText = !status ? "blocked" : "unblocked";
  
  await notifyWithSocket({
    notificationService: this._notificationService,
    userIds: [userId.toString()],
    title: `Course Access ${statusText}`,
    message: `Your access to the course "${course.title}" has been ${statusText} by the mentor.`,
    type: status ? "error" : "success",
  });

}



}
