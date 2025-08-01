import { injectable } from 'inversify';
import { IMentorOtpRepository } from '../../core/interfaces/repositories/mentor/IMentorOtpRepository';
import { MentorOtpModel } from '../../models/mentor/mentorOtp';
import { BaseRepository } from '../BaseRepository';
import { IMentorOtp } from '../../types/mentorTypes';

@injectable()
export class MentorOtpRepository extends BaseRepository <IMentorOtp,IMentorOtp> implements IMentorOtpRepository {
 
  constructor() {
    super(MentorOtpModel);
  }

  async createAt(): Promise<IMentorOtp|null>{
    let userID = 'asfasfw32wfsf'
    let date = new Date();
    return await this.findOne({ _id: userID, createdAt: {$gte:{date}} })
  }
}