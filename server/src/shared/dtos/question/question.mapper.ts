import { IQuestions } from "../../../types/lessons";
import { IQuestionAdminResponseDto, IQuestionResponseDto } from "./question-response.dto";


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
      lessonId:question.lessonId
    };
  }

}
