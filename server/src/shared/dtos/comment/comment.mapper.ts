import { IComment } from "../../../types/lessons";
import { IAdminCommentResponseDto, ICommentResponseDto, IMentorCommentResponseAtLesson, IMentorCommentResponseDto, IUserCommentResponseAtLesson } from "./commentResponse.dto";


export class CommentMapper {
  static toCommentResponseDto(comment: IComment): ICommentResponseDto {
    return {
      id: comment._id.toString(),
      lessonId: comment.lessonId.toString(),
      userId: comment.userId?.toString(),
      userName: comment.userName,
      comment: comment.comment,
      mentorId: comment.mentorId.toString(),
      courseId: comment.courseId.toString(),
      createdAt: comment.createdAt?.toISOString() || new Date().toISOString()
    };
  }

  static toAdminCommentResponseDto(comment: IComment): IAdminCommentResponseDto {
      return {
        id:comment._id.toString(),
        comment: comment.comment,
        userName: comment.userName,
        lessonId:comment.lessonId.toString()
    };
  }
    static toMentorResponseComment(comment: IComment,courseTitle:string,lessonTitle:string): IMentorCommentResponseDto {
    return {
      userName: comment.userName,
      createdAt: comment.createdAt||new Date ,
      courseTitle,
      lessonTitle,
      comment: comment.comment
    };
    }
  static toMentorCommentResponseAtLessonDto(c: IComment): IMentorCommentResponseAtLesson{
    return {
      comment: c.comment,
      createdAt: c.createdAt || new Date(),
      userName:c.userName
    }
  }
  static toUserCommentResponseAtLessonDto(c: IComment): IUserCommentResponseAtLesson{
    return {
      comment: c.comment,
      createdAt: c.createdAt || new Date(),
      userName:c.userName
    }
  }
}
