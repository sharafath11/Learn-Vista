import { ObjectId, Types } from "mongoose";
import { IMentorStudentService } from "../../core/interfaces/services/mentor/IMentorStudent.Service";
import { inject, injectable } from "inversify";
import { IMentorStudentEnroledCourse, IUser } from "../../types/userTypes";
import { TYPES } from "../../core/types";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { throwError } from "../../utils/ResANDError";
import { notifyWithSocket } from "../../utils/notifyWithSocket";
import { INotificationService } from "../../core/interfaces/services/notifications/INotificationService";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { convertSignedUrlInArray } from "../../utils/s3Utilits";
import { Messages } from "../../constants/messages";
import { IMentorStudentResposnse } from "../../shared/dtos/user/user-response.dto";
import { UserMapper } from "../../shared/dtos/user/user.mapper";

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
  ): Promise<{ students: IMentorStudentResposnse[]; total: number; totalPages: number }> {
    const { page = 1, limit = 2, search = '', status, sort = { createdAt: -1 } } = options;

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
    const sendData = await convertSignedUrlInArray(data, ["profilePicture"]);

const mapperData = sendData.map((i) => {
  const enrolledCourses: IMentorStudentEnroledCourse[] = i.enrolledCourses.map((j) => ({
    allowed: j.allowed,
    courseId: j.courseId.toString(),
  }));

  return UserMapper.toResponseMentorStudent(i, enrolledCourses);
});
    return {
      students: mapperData,
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
    throwError(Messages.USERS.USER_NOT_FOUND);
  }

  const updatedCourses = user.enrolledCourses.map((course, idx) => {
    const courseIdStr = course.courseId?.toString();
    const targetIdStr = courseId.toString();
    const match = courseIdStr === targetIdStr
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
    message: Messages.STUDENTS.COURSE_ACCESS_STATUS_NOTIFICATION(course.title, statusText),
    type: status ? "error" : "success",
  });
}

}
