import { IDailyTask, ISubTask } from "../../../types/dailyTaskType";
import { IDailySubTaskResponseDto, IDailyTaskResponseDto } from "./dailyTask-response.dto";

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
    static subTaskResponseDto(d: ISubTask): IDailySubTaskResponseDto{
        return {
            isCompleted: d.isCompleted,
            type: d.type,
            prompt: d.prompt,
            aiFeedback: d.aiFeedback,
            score: d.score,
            userResponse:d.userResponse
        }
    }
}