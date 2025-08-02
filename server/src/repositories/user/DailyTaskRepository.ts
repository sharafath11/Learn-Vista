
import { IDailyTaskRepository } from "../../core/interfaces/repositories/user/IDailyTaskRepository";
import { DailyTaskModel } from "../../models/user/DailyTask";
import { IDailyTask } from "../../types/dailyTaskType";
import { BaseRepository } from "../BaseRepository";

export class DailyTaskRepository extends BaseRepository<IDailyTask, IDailyTask> implements IDailyTaskRepository {
  constructor() {
    super(DailyTaskModel);
  }

}
