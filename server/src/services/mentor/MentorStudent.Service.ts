import { FilterQuery, ObjectId, Types } from "mongoose";
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
   
async getStudentDetilesService(
  courseId: string | ObjectId,
  options: {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'allowed' | 'blocked';
  } = {}
): Promise<{ students: IUser[]; total: number; totalPages: number }> {
  const { page = 1, limit = 8, search = '', status } = options;

  const courseObjectId = typeof courseId === 'string' ? new Types.ObjectId(courseId) : courseId;

  // Base filter on enrolledCourses and status
  const baseFilter = {
    enrolledCourses: {
      $elemMatch: {
        courseId: courseObjectId,
        ...(status === 'allowed' && { allowed: true }),
        ...(status === 'blocked' && { allowed: false }),
      },
    },
  };

  let finalFilter: any = baseFilter;

  if (search && search.trim().length > 0) {
    const searchRegex = new RegExp(search, 'i');

    finalFilter = {
      $and: [
        baseFilter,
        {
          $or: [
            { username: { $regex: searchRegex } },
            { email: { $regex: searchRegex } },
            { tag: { $regex: searchRegex } },
            { title: { $regex: searchRegex } },
          ],
        },
      ],
    };
  }

  console.log('🧩 Final MongoDB Filter:', JSON.stringify(finalFilter, null, 2));

  // Call base repo, pass undefined for search so it won't override your filter
  const { data, total, totalPages } = await this._userRepo.findPaginated(
    finalFilter,
    page,
    limit,
    undefined,  // search handled inside filter already
    { createdAt: -1 }
  );

  return {
    students: data,
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
