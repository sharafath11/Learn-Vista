import { IMentorMentorResponseDto } from "../../../../shared/dtos/mentor/mentor-response.dto";
import { IMentor } from "../../../../types/mentorTypes";
export interface IMentorService {
  getMentor(id: string): Promise<IMentorMentorResponseDto>;
  checkIfBlocked(mentorId:string):Promise<boolean>
}