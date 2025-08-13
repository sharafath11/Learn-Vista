import { ISubTask, TaskType,} from "../../../types/dailyTaskType";

export interface IDailyTaskResponseDto{
     id:string
     date: string;
     tasks: ISubTask[];
     overallScore?: number;
     createdAt?: Date;
}
export interface IDailySubTaskResponseDto {
  type: TaskType;
  prompt: string;
  userResponse?: string | null;
  isCompleted: boolean;
  aiFeedback?: string;
  score?: number;
}