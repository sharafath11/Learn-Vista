import {  IUser } from "../../../../types/userTypes";
import { IDailyTask, ISubTask, ISubTaskWithSignedUrl, IUpdateDailyTaskInput } from "../../../../types/dailyTaskType";
import {Types} from "mongoose"
export interface IUserService {
    getUser(token: string): Promise<IUser>;
    forgetPassword(email: string): Promise<void>;
    resetPassword(id: string, password: string): Promise<void>
    getDailyTaskSevice(userId: string | Types.ObjectId): Promise<IDailyTask>;
     updateDailyTask({
        taskId,
        taskType,
        answer,
        audioFile,
    }: IUpdateDailyTaskInput): Promise<ISubTask|ISubTaskWithSignedUrl>
}
