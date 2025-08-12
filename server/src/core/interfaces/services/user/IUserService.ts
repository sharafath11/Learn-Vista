import {  IUser } from "../../../../types/userTypes";
import { IDailyTask, ISubTask, ISubTaskWithSignedUrl, IUpdateDailyTaskInput } from "../../../../types/dailyTaskType";
import {Types} from "mongoose"
import {IUserResponseUser } from "../../../../shared/dtos/user/user-response.dto";
import { IDailyTaskResponseDto } from "../../../../shared/dtos/daily-task/dailyTask-response.dto";
export interface IUserService {
    getUser(token: string): Promise<IUserResponseUser>;
    forgetPassword(email: string): Promise<void>;
    resetPassword(id: string, password: string): Promise<void>
    getDailyTaskSevice(userId: string | Types.ObjectId): Promise<IDailyTaskResponseDto>;
     updateDailyTask({
        taskId,
        taskType,
        answer,
        audioFile,
     }: IUpdateDailyTaskInput): Promise<ISubTask | ISubTaskWithSignedUrl>
    getAllDailyTasks(userId:string):Promise<IDailyTaskResponseDto[]>
}
