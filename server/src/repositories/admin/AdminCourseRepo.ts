import { injectable } from "inversify";
import { BaseRepository } from "../BaseRepository";
import { ICourse } from "../../types/classTypes";
import { IAdminCourserRepository } from "../../core/interfaces/repositories/admin/IAdminCourseRepository";
import CourseModal from "../../models/class/courseModel";
import { FilterQuery } from "mongoose";
import { throwError } from "../../utils/ResANDError";

@injectable()
export class AdminCourseRepository extends BaseRepository<ICourse, ICourse> implements IAdminCourserRepository {
  constructor() {
    super(CourseModal);
  }

  // Get class with pagination, search, filters, and sorting
  async getClassRepo(
    page: number = 1,
    limit: number = 10,
    search?: string,
    filters: FilterQuery<ICourse> = {},
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ data: ICourse[]; total: number; totalPages?: number }> {
    try {
      if (search) {
        const searchRegex = new RegExp(search, "i");
        filters.$or = [
          { title: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
          { tag: { $regex: searchRegex } }
        ];
      }

      const skip = (page - 1) * limit;
      const [documents, total] = await Promise.all([
        this.model
          .find(filters)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .populate('mentorId')
          .populate('categoryId'), 
        CourseModal.countDocuments(filters), 
      ]);

   
      const totalPages = Math.ceil(total / limit);

      return { data: documents, total, totalPages };
    } catch (error) {
      console.error("Error in getClassRepo:", error); 
      throwError("Failed to fetch courses", 500);
    }
  }
}
