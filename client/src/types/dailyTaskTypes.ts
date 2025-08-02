export interface ITask {
  type: "speaking" | "writing" | "listening";
  title: string;
  prompt: string;
  audioUrl?: string;
  isCompleted: boolean;
}

export interface IDailyTask {
  id: string;
  date: string;
  tasks: ITask[];
}
