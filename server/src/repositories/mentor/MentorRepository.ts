import { injectable } from 'inversify';
import { IMentorRepository } from '../../core/interfaces/repositories/mentor/IMentorRepository';

import { IMentor, IMentorDTO, SafeMentor } from '../../core/models/Mentor';
import { Types } from 'mongoose';
import MentorModel from '../../models/mentor/mentorModel';


@injectable()
export class MentorRepository implements IMentorRepository {
  async create(data: Partial<IMentor>): Promise<IMentorDTO> {
    try {
      const mentor = await MentorModel.create(data);
      return this.toDTO(mentor.toObject());
    } catch (error) {
      throw new Error(`Error creating mentor: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findAll(): Promise<IMentorDTO[]> {
    try {
      const mentors = await MentorModel.find().lean();
      return mentors.map(mentor => this.toDTO(mentor));
    } catch (error) {
      throw new Error(`Error fetching mentors: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findById(id: string): Promise<IMentorDTO | null> {
    try {
      const mentor = await MentorModel.findById(id).lean();
      return mentor ? this.toDTO(mentor) : null;
    } catch (error) {
      throw new Error(`Error finding mentor by ID: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findOne(condition: any): Promise<IMentorDTO | null> {
    try {
      const mentor = await MentorModel.findOne(condition).lean();
      return mentor ? this.toDTO(mentor) : null;
    } catch (error) {
      throw new Error(`Error finding mentor: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async update(id: string, data: any): Promise<IMentorDTO | null> {
    try {
      const mentor = await MentorModel.findByIdAndUpdate(id, data, { new: true }).lean();
      return mentor ? this.toDTO(mentor) : null;
    } catch (error) {
      throw new Error(`Error updating mentor: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const result = await MentorModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      throw new Error(`Error deleting mentor: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findByEmail(email: string): Promise<IMentorDTO | null> {
    try {
      const mentor = await MentorModel.findOne({ email }).lean();
      return mentor ? this.toDTO(mentor) : null;
    } catch (error) {
      throw new Error(`Error finding mentor by email: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async findSafeMentorById(id: string): Promise<SafeMentor | null> {
    try {
      const mentor = await MentorModel.findById(id).select('-password').lean();
      return mentor as unknown as SafeMentor;
    } catch (error) {
      throw new Error(`Error finding safe mentor: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async updateMentorStatus(
    id: string, 
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<IMentorDTO | null> {
    try {
      const mentor = await MentorModel.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      ).lean();
      return mentor ? this.toDTO(mentor) : null;
    } catch (error) {
      throw new Error(`Error updating mentor status: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private toDTO(mentor: any): IMentorDTO {
    return {
      id: mentor._id.toString(),
      userId: mentor.userId.toString(),
      profilePicture: mentor.profilePicture,
      email: mentor.email,
      phoneNumber: mentor.phoneNumber,
      username: mentor.username,
      experience: mentor.experience,
      expertise: mentor.expertise,
      googleMentor: mentor.googleMentor,
      role: mentor.role,
      googleId: mentor.googleId,
      status: mentor.status,
      isBlock: mentor.isBlock,
      bio: mentor.bio,
      socialLinks: mentor.socialLinks,
      liveClasses: mentor.liveClasses?.map((id: Types.ObjectId) => id.toString()) || [],
      coursesCreated: mentor.coursesCreated?.map((id: Types.ObjectId) => id.toString()) || [],
      reviews: mentor.reviews?.map((id: Types.ObjectId) => id.toString()) || [],
      applicationDate: mentor.applicationDate,
      isVerified: mentor.isVerified,
      cvOrResume: mentor.cvOrResume,
      createdAt: mentor.createdAt,
      updatedAt: mentor.updatedAt
    };
  }
}