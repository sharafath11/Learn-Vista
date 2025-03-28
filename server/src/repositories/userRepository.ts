import { userModel } from "../models/userModel";
import { IUser } from "../types/userTypes";

class userRepository{
    async createUser(userData:IUser):Promise<IUser> {
        return userModel.create(userData)
    }
    async findUserByEmail(email: string): Promise<IUser | null>{
        return userModel.findOne({email})
    }

}
export default new userRepository