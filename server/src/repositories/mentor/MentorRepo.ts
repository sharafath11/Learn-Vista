import mentorModel from "../../models/mentor/mentorModel";
import { MentorOtpModel } from "../../models/mentor/mentorOtp";
import { IMentor } from "../../types/mentorTypes";
import { BaseRepository } from "../BaseRepository";

class MentorRepo extends BaseRepository<IMentor>{
    constructor() {
       super(mentorModel)
    }
}
export default new MentorRepo