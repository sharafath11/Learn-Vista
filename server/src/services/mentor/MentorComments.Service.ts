import { inject, injectable } from "inversify";
import { IMentorCommentsService, GetAllCommentsParams } from "../../core/interfaces/services/mentor/IMentorComments.Service";
import { TYPES } from "../../core/types";
import { ICommentstRepository } from "../../core/interfaces/repositories/lessons/ICommentsRepository";

@injectable()
export class MentorCommentsService implements IMentorCommentsService {
  constructor(
      @inject(TYPES.CommentsRepository) private _commentRepo: ICommentstRepository,
  ) {}

  async getAllComments(params: GetAllCommentsParams) {
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

  return {
    comments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

}
