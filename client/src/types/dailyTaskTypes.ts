// The type of each subtask
export type TaskType = "speaking" | "writing" | "listening";

// A single sub-task
export interface ITask {
  type: TaskType;
  title: string;
  prompt: string;
  audioUrl?: string;
  isCompleted: boolean;
}

// Full daily task returned from backend
export interface IDailyTask {
  id: string;
  date: string;
  tasks: ITask[];
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