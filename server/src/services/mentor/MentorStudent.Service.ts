import { ObjectId, Types } from "mongoose";
import { IMentorStudentService } from "../../core/interfaces/services/mentor/IMentorStudent.Service";
import { inject, injectable } from "inversify";
import { IUser } from "../../types/userTypes";
import { TYPES } from "../../core/types"; 
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { throwError } from "../../utils/ResANDError";

@injectable()
export class MentorStudentService implements IMentorStudentService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepo: IUserRepository
  ) {}
   
 async getStudentDetilesService(courseId: string | ObjectId): Promise<IUser[]> {
  const allUsers = await this._userRepo.findAll();
  console.log("form kalyanam", courseId);

  const result = allUsers.filter((user) => {
    console.log("Checking user:", user.id);
    console.log("Enrolled courses:", user.enrolledCourses);

    return Array.isArray(user.enrolledCourses) &&
      user.enrolledCourses.some((course) => {
        const courseIdValue = course?.courseId?.toString?.();
        const targetId = courseId.toString();

        const isMatch = courseIdValue === targetId;
        if (isMatch) {
          console.log(`User ${user.id} matched courseId: ${courseIdValue}`);
        }

        return isMatch;
      });
  });

  console.log("Filtered students:", result);
  if (!result) throwError("Server error");

  return result;
}


 async studentStatusService(
  userId: string | Types.ObjectId,
  courseId: string | Types.ObjectId,
  status: boolean
): Promise<void> {
  await this._userRepo.updateOne(
    { courseId: new Types.ObjectId(userId), "enrolledCourses.course": new Types.ObjectId(courseId) },
    {
      $set: {
        "enrolledCourses.$.allowed": status,
      },
    }
  );
}


}
