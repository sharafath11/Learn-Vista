import { inject, injectable } from "inversify";
import { IMentorLessonService } from "../../core/interfaces/services/mentor/IMentorLesson.Service";
import { TYPES } from "../../core/types";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { ObjectId } from "mongoose";
import { ILesson } from "../../types/lessons";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";
@injectable()
export class MentorLessonService implements IMentorLessonService{ 
    constructor(
     @inject(TYPES.LessonsRepository) private _lessonRepo:ILessonsRepository 
    ) { }
    async getLessons(courseId: string | ObjectId): Promise<ILesson[]> {
        const result = await this._lessonRepo.findAll({ courseId });
        if (!result) throwError("Invalid request", StatusCode.BAD_REQUEST)
        return result
    }
    // async addLessons(courseId: string | ObjectId, data: ILesson): Promise<ILesson> {
        
    // }
}