import { injectable } from 'inversify';
import { Model } from 'mongoose';
import { IMentorOtpRepository } from '../../core/interfaces/repositories/mentor/IMentorOtpRepository';
import { IMentorOtp } from '../../core/models/MentorOtp';
import { MentorOtpModel } from '../../models/mentor/mentorOtp';

@injectable()
export class MentorOtpRepository implements IMentorOtpRepository {
  private model: Model<IMentorOtp>;

  constructor() {
    this.model = MentorOtpModel;
  }

  async create(data: Partial<IMentorOtp>): Promise<IMentorOtp> {
    return this.model.create(data);
  }

  async findOne(condition: any): Promise<IMentorOtp | null> {
    return this.model.findOne(condition).exec();
  }
}