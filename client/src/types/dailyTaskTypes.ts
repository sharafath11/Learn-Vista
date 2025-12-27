// The type of each subtask
export type TaskType = "speaking" | "writing" | "listening";

export interface ITask {
  type: TaskType;
  title: string;
  prompt: string;
  isCompleted: boolean;
  userResponse?: string | null;
  aiFeedback?: string | null;
  score?: number | null;
  audioUrl?: string | null;
}
export interface ISubTask {
  type: TaskType;
  prompt: string;
  userResponse?: string | null;
  isCompleted: boolean;
  aiFeedback?: string;
  score?: number;
}


// Full daily task returned from backend
export interface IDailyTask {
  id: string;
  date: string;
  tasks: ITask[];
  overallScore?: number;
  createdAt?: Date;
}


// Backend response after submitting a task
export interface ITaskSubmissionResponse {
  taskId: string;
  taskType: TaskType;
  isCompleted: boolean;
  aiFeedback?: string;
  score?: number;
}

// Optional full summary response (if backend returns all tasks & total)
export interface IDailyTaskSummaryResponse {
  overallScore?: number;
  updatedAt?: string;
  tasks: ITaskSubmissionResponse[];
}
