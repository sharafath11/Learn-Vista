
import { Document, Types } from "mongoose";
import { FilterQuery, UpdateQuery } from "mongoose";
import { IUser } from "../../../../types/userTypes";
import { IMentor } from "../../../models/Mentor";


export interface IUserRepository {
  applyMentor(mentorData: Partial<IMentor>): unknown;
  create(user: Partial<IUser>): Promise<IUser & Document>;
  findOne(query: FilterQuery<IUser>): Promise<(IUser & Document) | null>;
  findById(id: string): Promise<(IUser & Document) | null>;
  update(id: string, data: UpdateQuery<IUser>): Promise<(IUser & Document) | null>;
  findByEmail(email: string): Promise<(IUser & Document) | null>;
  findByGoogleId(googleId: string): Promise<(IUser & Document) | null>;
  enrollInCourse(userId: string, courseId: Types.ObjectId): Promise<IUser | null>;
}