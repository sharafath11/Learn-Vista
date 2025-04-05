import mentorModel from "../../models/mentor/mentorModel";
import { IMentor } from "../../types/mentorTypes";
import { BaseRepository } from "../BaseRepository";

class AdminMentorRepo extends BaseRepository <IMentor>{
    constructor() {
       super (mentorModel)
   }
}
export default new AdminMentorRepo()