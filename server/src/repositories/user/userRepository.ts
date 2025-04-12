import { injectable } from "inversify";
import { IUserRepository } from "../../core/interfaces/repositories/user/IUserRepository";
import { userModel } from "../../models/user/userModel";
import { IUser } from "../../types/userTypes";
import { FilterQuery, UpdateQuery, Document, Types } from "mongoose";
import { IMentor } from "../../types/mentorTypes";


@injectable()
export class UserRepository implements IUserRepository {
  applyMentor(mentorData: Partial<IMentor>): unknown {
    throw new Error("Method not implemented.");
  }
  async create(user: Partial<IUser>): Promise<IUser & Document> {
    return await userModel.create(user);
  }

  async findOne(query: FilterQuery<IUser>): Promise<(IUser & Document) | null> {
    return await userModel.findOne(query).populate('enrolledCourses');
  }

  async findById(id: string): Promise<(IUser & Document) | null> {
    return await userModel.findById(id).populate('enrolledCourses');
  }

  async update(id: string, data: UpdateQuery<IUser>): Promise<(IUser & Document) | null> {
    return await userModel.findByIdAndUpdate(id, data, { new: true });
  }

  async findByEmail(email: string): Promise<(IUser & Document) | null> {
    return await userModel.findOne({ email });
  }

  async findByGoogleId(googleId: string): Promise<(IUser & Document) | null> {
    return await userModel.findOne({ googleId });
  }

  async enrollInCourse(userId: string, courseId: Types.ObjectId): Promise<IUser | null> {
    return await userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { enrolledCourses: courseId } },
      { new: true }
    );
  }
}