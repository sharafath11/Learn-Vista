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
  
  const user = await this._userRepo.findById(userId as string);
 
  if (!user) {
    
    throwError("User not found");
  }

  const updatedCourses = user.enrolledCourses.map((course, index) => {
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


  const result = await this._userRepo.update(userId as string, {
    enrolledCourses: updatedCourses,
  });

}



}
