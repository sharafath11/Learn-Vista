import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { IComment } from "../../types/lessons";
import { BaseRepository } from "../BaseRepository";
import { FilterQuery, ObjectId, SortOrder } from "mongoose";
import { inject } from "inversify";
import { TYPES } from "../../core/types";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import CommentModel from "../../models/class/comments";

export class CommentsRepository
  extends BaseRepository<IComment, IComment>
  implements ICommentstRepository
{
  constructor(
    @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository,
    @inject(TYPES.LessonReportRepository) private _lessonRepo: ILessonsRepository
  ) {
    super(CommentModel);
  }

  async findWithPagination(
    filter: FilterQuery<IComment>,
    sort: Record<string, SortOrder>,
    page: number,
    limit: number,
    mentorId: string | ObjectId
  ): Promise<IComment[]> {
    if (mentorId) {
      filter.mentorId = mentorId;
    }

    return CommentModel.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
  }

  async countDocuments(filter: FilterQuery<IComment>): Promise<number> {
    return CommentModel.countDocuments(filter);
  }
}
