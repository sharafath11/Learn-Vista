import { inject, injectable } from "inversify";
import { IMentorCourseService } from "../../core/interfaces/services/mentor/ImentorCourse.service";
import { TYPES } from "../../core/types";
import { ILiveRepository } from "../../core/interfaces/repositories/course/ILiveRepository";
import { Types } from "mongoose";
@injectable()
export class MentorCourseService implements IMentorCourseService{
    constructor(
        @inject(TYPES.LiveRepository) private _baseLiveRepo:ILiveRepository
    ){}
    async startLiveSession(courseId: string, mentorId: string): Promise<string> {
        const liveId = `live-${Date.now()}`;
        const currentDate = new Date();
        await this._baseLiveRepo.create({
            courseId: new Types.ObjectId(courseId),
            mentorId: new Types.ObjectId(mentorId),
            liveId,
            isActive: true,
            date:currentDate,
        });
    
        return liveId;
    }
}