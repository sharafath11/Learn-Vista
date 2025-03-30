import { OtpModel } from "../models/otpModel";
import { IOtp } from "../types/userTypes";
import { BaseRepository } from "./BaseRepository";

 class OtpRepository extends BaseRepository<IOtp>{
    constructor() {
        super(OtpModel);
    }
    
 }
export default new OtpRepository()