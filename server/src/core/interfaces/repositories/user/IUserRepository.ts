import { IUser } from "../../../types/userTypes";
import { Document } from "mongoose";

export interface IUserRepository {
  create(user: Partial<IUser>): Promise<Partial<IUser> & Document>;
  findOne(query: object): Promise<(IUser & Document) | null>;
  findById(id: string): Promise<(IUser & Document) | null>;
  applyMentor(mentorData: any): Promise<any>;
  update(id: string, data: UpdateQuery<IUser>): Promise<(IUser & Document) | null>;
}