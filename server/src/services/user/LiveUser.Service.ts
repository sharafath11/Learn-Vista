import { inject, injectable } from "inversify";

import { TYPES } from "../../core/types";
import { throwError } from "../../utils/ResANDError";
import { Types } from "mongoose";
import { IUserLiveService } from "../../core/interfaces/services/user/IUserLiveService";
import { ICourseRepository } from "../../core/interfaces/repositories/course/ICourseRepository";
import { ILiveRepository } from "../../core/interfaces/repositories/course/ILiveRepository";

@injectable()
export class LiveUserService implements IUserLiveService {
  constructor(
    @inject(TYPES.CourseRepository) 
    private readonly courseRepo: ICourseRepository,
    
    @inject(TYPES.LiveRepository) 
    private readonly liveRepo: ILiveRepository
  ) {}

  async getRoomIdService(courseId: string, userId: string): Promise<string> {
   
   
      await this.validateCourseEnrollment(courseId, userId);
      const liveSession = await this.validateLiveSession(courseId);
      await this.addParticipant(liveSession.id, userId);
        
      return liveSession.liveId;
  
  }

  private async validateCourseEnrollment(courseId: string, userId: string): Promise<void> {
   
    const course = await this.courseRepo.findById(courseId);
    
    if (!course?.enrolledUsers?.includes(userId)) {
  
      throwError("User not enrolled in this course");
    }
  }

  private async validateLiveSession(courseId: string) {
   
    const liveSession = await this.liveRepo.findOne({ courseId });
    
    if (!liveSession) {
      throwError("Live session not available");
    }
    if(!liveSession.isActive) throwError("This stream desnot start please try after some time")
    
    return liveSession;
  }

  private async addParticipant(liveId: Types.ObjectId, userId: string): Promise<void> {
    try {
     
      await this.liveRepo.update(
        liveId.toString(),
        { $addToSet: { participants: new Types.ObjectId(userId) } }
      );
      
     
    } catch (error) {
    
      throw error;
    }
  }
}