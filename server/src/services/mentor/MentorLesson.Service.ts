import { inject, injectable } from "inversify";
import { IMentorLessonService } from "../../core/interfaces/services/mentor/IMentorLesson.Service";
import { TYPES } from "../../core/types";
import { ILessonsRepository } from "../../core/interfaces/repositories/lessons/ILessonRepository";
import { ObjectId } from "mongoose";
import { ILesson } from "../../types/lessons";
import { throwError } from "../../utils/ResANDError";
import { StatusCode } from "../../enums/statusCode.enum";

@injectable()
export class MentorLessonService implements IMentorLessonService {
    constructor(
        @inject(TYPES.LessonsRepository) private _lessonRepo: ILessonsRepository
    ) {}

    async getLessons(courseId: string | ObjectId): Promise<ILesson[]> {
        const result = await this._lessonRepo.findAll({ courseId });
        if (!result) throwError("Invalid request", StatusCode.BAD_REQUEST);
        return result;
    }

    async addLesson(courseId: string | ObjectId, data: Partial<ILesson>): Promise<ILesson> {
        if (!data.title || !data.videoUrl) {
            throwError("Title and videoUrl are required", StatusCode.BAD_REQUEST);
        }
       const lessonData = {
    ...data,
    courseId: courseId as string | ObjectId,
    createdAt: new Date(),
    updatedAt: new Date(),
} as ILesson;


        const createdLesson = await this._lessonRepo.create(lessonData as ILesson);
        if (!createdLesson) {
            throwError("Failed to create lesson", StatusCode.INTERNAL_SERVER_ERROR);
        }
        return createdLesson;
    }

    async editLesson(lessonId: string | ObjectId, updateLesson: Partial<ILesson>): Promise<ILesson> {
        const updated = await this._lessonRepo.update(lessonId.toString(), {
    ...updateLesson,
    updatedAt: new Date(),
});

        if (!updated) {
            throwError("Lesson not found or update failed", StatusCode.NOT_FOUND);
        }

        return updated;
    }
}
