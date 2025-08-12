import { ISubTask,} from "../../../types/dailyTaskType";

export interface IDailyTaskResponseDto{
     id:string
     date: string;
     tasks: ISubTask[];
     overallScore?: number;
     createdAt?: Date;
}