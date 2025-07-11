import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { IComment } from "../../types/lessons";
import Comment from "../../models/mentor/class/comments";
import { BaseRepository } from "../BaseRepository";
import { FilterQuery, ObjectId, SortOrder } from "mongoose";
import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";

export class CommentsRepository
  extends BaseRepository<IComment, IComment>
  implements ICommentstRepository
{
  constructor(
    @inject(TYPES.CourseRepository)
      private _courseRepo: ICourseRepository,
      @inject(TYPES.LessonReportRepository) private _lessonRepo:ILessonsRepository
  ) {
    super(Comment);
  }

  async findWithPagination(
    filter: FilterQuery<IComment>,
    sort: Record<string, SortOrder>,
    page: number,
      limit: number,
    mentorId:string|ObjectId
  ): Promise<IComment[]> {
    console.log("🔍 findWithPagination called with:");
    console.log("➡️ Filter:", JSON.stringify(filter, null, 2));
    console.log("➡️ Sort:", sort);
    console.log("➡️ Page:", page);
    console.log("➡️ Limit:", limit);
    

if (mentorId) {
  filter.mentorId = mentorId
}

const results = await Comment.find(filter)
  .sort(sort)
  .skip((page - 1) * limit)
  .limit(limit)
  .lean();


    console.log("✅ Comments fetched:", results.length);
    return results;
  }

  async countDocuments(filter: FilterQuery<IComment>): Promise<number> {
    console.log("🔢 countDocuments called with filter:", JSON.stringify(filter, null, 2));
    const count = await Comment.countDocuments(filter);
    console.log("📊 Total matching comments:", count);
    return count;
  }
}
