import { injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import mentorModel from '../../models/mentor/mentorModel';

import { FilterQuery, UpdateQuery, Types } from 'mongoose';
import { IMentor, SafeMentor } from '../../types/mentorTypes';

@injectable()
export class MentorRepository implements IMentorRepository {
  async create(data: Partial<IMentor>): Promise<SafeMentor> {
    const mentor = await mentorModel.create(data);
    return this.toSafeMentor(mentor);
  }

  async findAll(): Promise<SafeMentor[]> {
    const mentors = await mentorModel.find().lean();
    return mentors.map(mentor => this.toSafeMentor(mentor));
  }

  async findById(id: string): Promise<SafeMentor | null> {
    const mentor = await mentorModel.findById(id).lean();
    return mentor ? this.toSafeMentor(mentor) : null;
  }

  async findOne(condition: FilterQuery<IMentor>): Promise<SafeMentor | null> {
    const mentor = await mentorModel.findOne(condition).lean();
    return mentor ? this.toSafeMentor(mentor) : null;
  }

  async update(id: string, data: UpdateQuery<IMentor>): Promise<SafeMentor | null> {
    const mentor = await mentorModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return mentor ? this.toSafeMentor(mentor) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await mentorModel.findByIdAndDelete(id);
    return result !== null;
  }

  async findByEmail(email: string): Promise<SafeMentor | null> {
    const mentor = await mentorModel.findOne({ email }).lean();
    return mentor ? this.toSafeMentor(mentor) : null;
  }

  async findWithPassword(condition: FilterQuery<IMentor>): Promise<IMentor | null> {
    const mentor = await mentorModel.findOne(condition).lean();
    return mentor as IMentor | null;
  }

  async updateStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<SafeMentor | null> {
    const mentor = await mentorModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).lean();
    return mentor ? this.toSafeMentor(mentor) : null;
  }

  async blockMentor(id: string, isBlock: boolean): Promise<SafeMentor | null> {
    const mentor = await mentorModel.findByIdAndUpdate(
      id,
      { isBlock },
      { new: true }
    ).lean();
    return mentor ? this.toSafeMentor(mentor) : null;
  }

  private toSafeMentor(mentor: any): SafeMentor {
    const { _id, __v, ...rest } = mentor;
    return {
      id: _id.toString(),
      ...rest,
      userId: rest.userId?.toString(),
      liveClasses: rest.liveClasses?.map((id: Types.ObjectId) => id.toString()) || [],
      coursesCreated: rest.coursesCreated?.map((id: Types.ObjectId) => id.toString()) || [],
      reviews: rest.reviews?.map((id: Types.ObjectId) => id.toString()) || []
    };
  }
}