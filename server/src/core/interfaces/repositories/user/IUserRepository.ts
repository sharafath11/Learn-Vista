// import { IMentor } from '../../models/Mentor';

import { IMentor } from "../../../models/Mentor";

export interface IUserRepository {
  applyMentor(mentorData: Partial<IMentor>): Promise<IMentor>;
  // Add other user repository methods as needed
}