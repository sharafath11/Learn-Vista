import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { ILiveRepository } from "../../core/interfaces/repositories/course/ILiveRepository";
import { Types } from "mongoose";
import { IMentorStreamService } from "../../core/interfaces/services/mentor/ImentorStream.service";
@injectable()
export class MentorStreamService implements IMentorStreamService{
    constructor(
        @inject(TYPES.LiveRepository) private _baseLiveRepo:ILiveRepository
    ){}
    async startStreamSession(courseId: string, mentorId: string): Promise<string> {
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
    async endStream(liveId: string): Promise<void> {
        await this._baseLiveRepo.update(liveId,{isActive:false})
    }
    
    
}