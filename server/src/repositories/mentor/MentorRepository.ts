import { injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';
import mentorModel from '../../models/mentor/mentorModel';
import { IMentor, SafeMentor } from '../../core/models/Mentor';
// import { BaseRepository } from '../../core/repositories/core';
import { BaseRepository } from '../../core/interfaces/repositories/BaseRepository';
import { Types } from 'mongoose';

@injectable()
export class MentorRepository extends BaseRepository<IMentor, SafeMentor> implements IMentorRepository {
  constructor() {
    super(mentorModel);
  }

  async findByEmail(email: string): Promise<SafeMentor | null> {
    try {
      const mentor = await this.model.findOne({ email }).select('-password').lean();
      return mentor ? this.toDTO(mentor) : null;
    } catch (error) {
      throw this.handleError(error, 'Error finding mentor by email');
    }
  }

  async findWithPassword(condition: any): Promise<IMentor | null> {
    try {
      const mentor = await this.model.findOne(condition).lean();
      return mentor ? mentor as unknown as IMentor : null;
    } catch (error) {
      throw this.handleError(error, 'Error finding mentor with password');
    }
  }

  async updateStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<SafeMentor | null> {
    try {
      const mentor = await this.model.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).select('-password').lean();
      return mentor ? this.toDTO(mentor) : null;
    } catch (error) {
      throw this.handleError(error, 'Error updating mentor status');
    }
  }

  async blockMentor(id: string, isBlock: boolean): Promise<SafeMentor | null> {
    try {
      const mentor = await this.model.findByIdAndUpdate(
        id,
        { isBlock },
        { new: true }
      ).select('-password').lean();
      return mentor ? this.toDTO(mentor) : null;
    } catch (error) {
      throw this.handleError(error, 'Error blocking/unblocking mentor');
    }
  }

  protected toDTO(document: IMentor): SafeMentor {
    const obj = document.toObject ? document.toObject() : document;
    const { _id, password, __v, ...rest } = obj;
    
    return {
      id: _id.toString(),
      userId: rest.userId.toString(),
      profilePicture: rest.profilePicture,
      email: rest.email,
      phoneNumber: rest.phoneNumber,
      username: rest.username,
      experience: rest.experience,
      expertise: rest.expertise,
      googleMentor: rest.googleMentor,
      role: rest.role,
      googleId: rest.googleId,
      status: rest.status,
      isBlock: rest.isBlock,
      bio: rest.bio,
      socialLinks: rest.socialLinks,
      liveClasses: rest.liveClasses?.map(id => id.toString()) || [],
      coursesCreated: rest.coursesCreated?.map(id => id.toString()) || [],
      reviews: rest.reviews?.map(id => id.toString()) || [],
      applicationDate: rest.applicationDate,
      isVerified: rest.isVerified,
      cvOrResume: rest.cvOrResume,
      createdAt: rest.createdAt,
      updatedAt: rest.updatedAt
    };
  }
}