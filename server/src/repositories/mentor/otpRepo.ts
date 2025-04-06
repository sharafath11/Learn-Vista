import { MentorOtpModel } from "../../models/mentor/mentorOtp";
import { IOtp } from "../../types/userTypes";
import { BaseRepository } from "../BaseRepository";


 class MentorOtpRepo extends BaseRepository<IOtp>{
    constructor() {
        super(MentorOtpModel);
    }
    
 }
export default new MentorOtpRepo()