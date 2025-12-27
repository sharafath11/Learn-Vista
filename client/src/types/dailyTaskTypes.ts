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
export interface ListeningTaskProps {
  audioUrl: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
export type RecordingState = "idle" | "recording" | "paused" | "completed";

export interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionResultItem;
}

export interface SpeechRecognitionEventLike extends Event {
  resultIndex: number;
  results: SpeechRecognitionResult[];
}

export interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: Event) => void) | null;
}

export interface SpeakingTaskProps {
  onComplete: (payload: { audio: Blob; transcript: string }) => void;
}

export interface WritingTaskProps {
  value: string;
  onChange: (value: string) => void;
}