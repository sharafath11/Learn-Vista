import { Button } from "@/src/components/shared/components/ui/button";
import { Textarea } from "@/src/components/shared/components/ui/textarea";
import { useState } from "react";


interface Props {
  task: {
    type: "speaking" | "writing" | "listening";
    title: string;
    prompt: string;
    audioUrl?: string;
    isCompleted: boolean;
  };
}

export function DailyTaskCard({ task }: Props) {
  const [answer, setAnswer] = useState("");

  return (
    <div className="p-4 border rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{task.title}</h2>
        <span className={`text-sm px-2 py-1 rounded ${task.isCompleted ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"}`}>
          {task.isCompleted ? "Completed" : "Pending"}
        </span>
      </div>

      <p className="text-sm text-muted-foreground">{task.prompt}</p>

      {task.type === "speaking" && (
        <div>
          <Button>🎤 Record Audio</Button> {/* or file input */}
        </div>
      )}

      {task.type === "writing" && (
        <Textarea
          placeholder="Write your answer here..."
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      )}

      {task.type === "listening" && task.audioUrl && (
        <audio controls className="w-full">
          <source src={task.audioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}

      <Button className="mt-2" disabled={task.isCompleted}>
        Submit Task
      </Button>
    </div>
  );
}
