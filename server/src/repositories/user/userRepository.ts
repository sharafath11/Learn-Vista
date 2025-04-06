
import { userModel } from "../../models/user/userModel";
import { IMentor } from "../../types/mentorTypes";
import { IUser } from "../../types/userTypes";
import { BaseRepository } from "../BaseRepository";
import MentorRepo from "../mentor/MentorRepo";

class userRepository extends BaseRepository<IUser>{
    constructor() {
        super(userModel)
    }
    async applyMentorRepo(mentorData: Partial<IMentor>) {
        try {
         
          const existingMentor = await MentorRepo.findOne({ email: mentorData.email });
          if (existingMentor) {
          
            throw new Error("Mentor application already submitted");
          }
          const mentor = await MentorRepo.create(mentorData);
          return mentor;
        } catch (error) {
          console.error("Error applying as mentor:", error);
          throw new Error("Failed to apply as mentor application already submitted");
        }
      }
   
}
export default new userRepository