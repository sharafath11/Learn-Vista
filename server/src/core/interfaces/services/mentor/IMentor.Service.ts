import { IMentor } from '../../../models/Mentor';

export interface IMentorService {
  getMentor(id: string): Promise<Partial<IMentor>>;
}