import { ObjectId } from "mongoose";
import { ISafeUser, IUser } from "../../../../types/userTypes";
import { IDailyTask } from "../../../../types/dailyTaskType";
import {Types} from "mongoose"
export interface IUserService {
    getUser(token: string): Promise<IUser>;
    forgetPassword(email: string): Promise<void>;
    resetPassword(id: string, password: string): Promise<void>
    getDailyTaskSevice(userId: string | Types.ObjectId): Promise<IDailyTask>;
}