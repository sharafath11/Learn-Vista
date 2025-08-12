import { IDailyTask } from "../../../types/dailyTaskType";
import { IDailyTaskResponseDto } from "./dailyTask-response.dto";

export class DailyTaskMapper{
    static dailyTaskResponseDto(d: IDailyTask): IDailyTaskResponseDto{
        return {
            id: d._id.toString(),
            date: d.date,
            tasks: d.tasks,
            createdAt: d.createdAt,
            overallScore:d.overallScore
        }
    }
}