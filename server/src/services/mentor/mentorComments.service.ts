import { inject, injectable } from "inversify";
import { IMentorCommentsService, GetAllCommentsParams } from "../../core/interfaces/services/mentor/IMentorComments.Service";
import { TYPES } from "../../core/types";
import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";
import { IGetAllCommentsResponse } from "../../types/lessons";
import { CommentMapper } from "../../shared/dtos/comment/comment.mapper";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";

@injectable()
export class MentorCommentsService implements IMentorCommentsService {
  constructor(
    @inject(TYPES.CommentsRepository) private _commentRepo: ICommentstRepository,
    @inject(TYPES.CourseRepository) private _courseRepo: ICourseRepository,
    @inject (TYPES.LessonsRepository) private _lessonRepo:ILessonsRepository
  ) {}

  async getAllComments(params: GetAllCommentsParams):Promise<IGetAllCommentsResponse> {
  const {
    page = 1,
    limit = 2,
    sortBy = "createdAt",
    sortOrder = "desc",
    search = "",
    courseId,
    mentorId
  } = params;

  const filter: Record<string, unknown> = {};

  if (search) {
    filter.$or = [
      { comment: { $regex: search, $options: "i" } },
      { userName: { $regex: search, $options: "i" } },
    ];
  }

  if (courseId) {
    filter.courseId = courseId;
  }

  const sort: Record<string, 1 | -1> = {
    [sortBy]: sortOrder === "asc" ? 1 : -1,
  };

  const [comments, total] = await Promise.all([
    this._commentRepo.findWithPagination(filter, sort, page, limit, mentorId),
    this._commentRepo.countDocuments(filter),
  ]);
    
const sendData = await Promise.all(
  comments.map(async (c) => {
    const [course, lesson] = await Promise.all([
      this._courseRepo.findById(c.courseId as string),
      this._lessonRepo.findById(c.lessonId as string),
    ]);
    return CommentMapper.toMentorResponseComment(c, course?.title||"", lesson?.title||"");
  })
);

  return {
    comments:sendData,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

}
