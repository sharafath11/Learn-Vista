import { IQuestions } from "../../../types/lessons";
import { IMentorQustionsDto, IQuestionAdminResponseDto, IQuestionResponseDto, IUserQustionsDto } from "./question-response.dto";


export class QuestionMapper {
  static toQuestionResponseDto(question: IQuestions): IQuestionResponseDto {
    return {
      id: question._id.toString(),
      lessonId: question.lessonId,
      question: question.question,
      type: question.type,
      isCompleted: question.isCompleted,
      options: question.options ?? [],
      correctAnswer: Array.isArray(question.correctAnswer)
        ? question.correctAnswer.join(", ")
        : question.correctAnswer ?? "",
     
      createdAt:question.createdAt||new Date()
    };
  }
  static toQuestionAdminResponseDto(question: IQuestions): IQuestionAdminResponseDto {
    return {
      id: question._id.toString(),
      question: question.question,
      type: question.type,
      options:question.options,
      lessonId:question.lessonId
    };
  }
  static toImentorQustionResponseDto(q: IQuestions): IMentorQustionsDto{
    return {
      id:q._id.toString(),
      question: q.question,
      type: q.type,
      options:q.options
    }
  }
  static toUserQustionResponse(q: IQuestions): IUserQustionsDto{
    
    return {
      id:q._id.toString(),
      question: q.question,
      type: q.type,
      options:q.options
    }
  }

}
