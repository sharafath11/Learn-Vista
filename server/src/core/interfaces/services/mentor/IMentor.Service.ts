import { IMentor } from "../../../../types/mentorTypes";
export interface IMentorService {
  getMentor(id: string): Promise<Partial<IMentor>>;
}