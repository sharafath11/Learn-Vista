
import { userModel } from "../../models/user/userModel";
import { IUser } from "../../types/userTypes";
import { BaseRepository } from "../BaseRepository";

class userRepository extends BaseRepository<IUser>{
    //pass the mode in base repo
    constructor() {
        super(userModel)
    }
   
}
export default new userRepository