import { IMentor, SafeMentor, IMentorDTO } from "../../../models/Mentor";

export interface IMentorRepository {
  // CRUD Operations
  create(data: Partial<IMentor>): Promise<IMentorDTO>;
  findAll(): Promise<IMentorDTO[]>;
  findById(id: string): Promise<IMentorDTO | null>;
  findOne(condition: any): Promise<IMentorDTO | null>;
  update(id: string, data: any): Promise<IMentorDTO | null>;
  delete(id: string): Promise<boolean>;
  
  // Specialized Methods
  findByEmail(email: string): Promise<IMentorDTO | null>;
  findSafeMentorById(id: string): Promise<SafeMentor | null>;
  updateMentorStatus(id: string, status: 'pending' | 'approved' | 'rejected'): Promise<IMentorDTO | null>;
}