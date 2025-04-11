import { IMentor, SafeMentor } from "../../../models/Mentor";
import { FilterQuery, UpdateQuery } from "mongoose";

export interface IMentorRepository {
  // CRUD Operations
  create(data: Partial<IMentor>): Promise<SafeMentor>;
  findAll(): Promise<SafeMentor[]>;
  findById(id: string): Promise<SafeMentor | null>;
  findOne(condition: FilterQuery<IMentor>): Promise<SafeMentor | null>;
  update(id: string, data: UpdateQuery<IMentor>): Promise<SafeMentor | null>;
  delete(id: string): Promise<boolean>;
  
  // Specialized Methods
  findByEmail(email: string): Promise<SafeMentor | null>;
  findWithPassword(condition: FilterQuery<IMentor>): Promise<IMentor | null>;
  updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<SafeMentor | null>;
  blockMentor(id: string, isBlock: boolean): Promise<SafeMentor | null>;
}