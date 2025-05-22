import { inject, injectable } from "inversify";
import { TYPES } from "../../core/types";
import { ILiveRepository } from "../../core/interfaces/repositories/course/ILiveRepository";
import { Types } from "mongoose";
import { IMentorStreamService } from "../../core/interfaces/services/mentor/ImentorStream.service";
import { IMentorRepository } from "../../core/interfaces/repositories/mentor/IMentorRepository";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { throwError } from "../../utils/ResANDError";
@injectable()
export class MentorStreamService implements IMentorStreamService{
    constructor(
        @inject(TYPES.LiveRepository) private _baseLiveRepo: ILiveRepository ,
        @inject(TYPES.MentorRepository) private _baseMentorRepo: IMentorRepository,
        @inject(TYPES.CourseRepository) private _courseRepo:ICourseRepository
    ){}
    async startStreamSession(courseId: string, mentorId: string): Promise<string> {
        const course = (await this._courseRepo.findWithMenorIdgetAllWithPopulatedFields(mentorId)).filter((i)=>i.mentorStatus==="approved")
        
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
    async endStream(liveId: string, mentorId: string): Promise<void> {
        const stream = await this._baseLiveRepo.findOne({ liveId });
        if (!stream) throw new Error("Live stream not found");
      
        await Promise.all([
          this._baseLiveRepo.update(stream.id, { isActive: false, isEnd: true }),
          this._baseMentorRepo.update(mentorId, { $addToSet: { liveClasses: stream?.id } })
        ]);
      }
    
    
}