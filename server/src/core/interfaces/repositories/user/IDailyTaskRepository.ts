import { IDailyTask } from "../../../../types/dailyTaskType";
import { IBaseRepository } from "../IBaseRepository";


export interface IDailyTaskRepository extends IBaseRepository<IDailyTask, IDailyTask> {
  
}
