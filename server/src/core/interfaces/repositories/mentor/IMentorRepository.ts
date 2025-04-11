import { IMentor, SafeMentor } from "../../../models/Mentor";

export interface IMentorRepository {
  // CRUD Operations
  create(data: Partial<IMentor>): Promise<SafeMentor>;
  findAll(): Promise<SafeMentor[]>;
  findById(id: string): Promise<SafeMentor | null>;
  findOne(condition: any): Promise<SafeMentor | null>;
  update(id: string, data: any): Promise<SafeMentor | null>;
  delete(id: string): Promise<boolean>;
  
  // Specialized Methods
  findByEmail(email: string): Promise<SafeMentor | null>;
  findWithPassword(condition: any): Promise<IMentor | null>;
  updateStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<SafeMentor | null>;
  blockMentor(id: string, isBlock: boolean): Promise<SafeMentor | null>;
}