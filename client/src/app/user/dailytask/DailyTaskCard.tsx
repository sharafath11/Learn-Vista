"use client";

import { useState } from "react";
import {
  Mic,
  PenTool,
  Headphones,
  CheckCircle2,
  Clock,
} from "lucide-react";

import { Badge } from "@/src/components/shared/components/ui/badge";
import { Button } from "@/src/components/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/shared/components/ui/card";

import { UserAPIMethods } from "@/src/services/methods/user.api";
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";
import { ITaskesProps } from "@/src/types/userProps";
import { SpeakingTask } from "./components/SpeakingTask";
import { WritingTask } from "./components/WritingTask";
import { ListeningTask } from "./components/ListeningTask";

/* ---------- ICONS ---------- */

const taskIcons = {
  speaking: Mic,
  writing: PenTool,
  listening: Headphones,
} as const;

const taskColors = {
  speaking: "from-blue-500 to-cyan-500",
  writing: "from-purple-500 to-pink-500",
  listening: "from-green-500 to-emerald-500",
} as const;

/* ================= COMPONENT ================= */

export function DailyTaskCard({ task, taskId }: ITaskesProps) {
  const [localTask, setLocalTask] = useState(task);
  const [answer, setAnswer] = useState(localTask.userResponse ?? "");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------- SUBMIT ---------- */

  const handleSubmit = async () => {
    if (!answer.trim()) {
      showErrorToast("Please provide an answer before submitting.");
      return;
    }

    if (localTask.type === "speaking" && !audioBlob) {
      showErrorToast("Please record your audio before submitting.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("taskType", localTask.type);
    formData.append("answer", answer);

    if (localTask.type === "speaking" && audioBlob) {
      formData.append("audioFile", audioBlob, "recording.webm");
    }

    const res = await UserAPIMethods.submitDailyTaskAnswer(formData);
    setIsSubmitting(false);

    if (!res.ok) {
      showErrorToast(res.msg || "Failed to submit answer.");
      return;
    }

    showSuccessToast(res.msg || "Answer submitted successfully!");

    setLocalTask((prev) => ({
      ...prev,
      isCompleted: true,
      userResponse: res.data?.userResponse || answer,
      aiFeedback: res.data?.aiFeedback || "",
      score: res.data?.score,
    }));
  };

  /* ---------- FEEDBACK ---------- */

  const renderFeedback = () => (
    <div className="p-4 mt-3 bg-white rounded-xl border-2 border-green-100 space-y-4">
      {localTask.userResponse && (
        <div className="text-sm">
          <strong className="text-gray-500 uppercase text-[10px]">
            Your Submission
          </strong>
          <div className="mt-2">
            {localTask.type === "speaking" ? (
              <audio
                controls
                src={localTask.userResponse}
                className="w-full"
              />
            ) : (
              <p className="text-gray-800">{localTask.userResponse}</p>
            )}
          </div>
        </div>
      )}

      {localTask.aiFeedback && (
        <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-100">
          <strong className="text-blue-700">AI Feedback:</strong>
          <p className="mt-1 text-blue-900 leading-relaxed">
            {localTask.aiFeedback}
          </p>
        </div>
      )}

      {localTask.score !== undefined && (
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="font-bold text-gray-700">Overall Score</span>
          <span className="text-2xl font-black text-green-600">
            {localTask.score}/5
          </span>
        </div>
      )}
    </div>
  );

  /* ---------- MAIN ---------- */

  const Icon = taskIcons[localTask.type as keyof typeof taskIcons] || Mic;

  return (
    <Card
      className={`overflow-hidden transition-all duration-300 border-2 ${
        localTask.isCompleted ? "border-green-200" : "border-gray-100"
      }`}
    >
      <CardHeader className="bg-white border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-br ${
                taskColors[localTask.type as keyof typeof taskColors]
              } text-white`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">
              {localTask.title}
            </CardTitle>
          </div>

          {localTask.isCompleted ? (
            <Badge className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" /> Completed
            </Badge>
          ) : (
            <Badge variant="secondary">
              <Clock className="h-3 w-3 mr-1" /> Pending
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 bg-gray-50/30">
        <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600 italic">
            "{localTask.prompt}"
          </p>
        </div>

        {/* ---------- TASK BODY ---------- */}

        {!localTask.isCompleted && localTask.type === "speaking" && (
          <SpeakingTask
            onComplete={({ audio, transcript }) => {
              setAudioBlob(audio);
              setAnswer(transcript);
            }}
          />
        )}

        {!localTask.isCompleted && localTask.type === "writing" && (
          <WritingTask value={answer} onChange={setAnswer} />
        )}

        {!localTask.isCompleted && localTask.type === "listening" && (
          <ListeningTask
            audioUrl={localTask.audioUrl || ""}
            value={answer}
            onChange={setAnswer}
          />
        )}

        {/* ---------- SUBMIT ---------- */}

        {!localTask.isCompleted && (
          <Button
            className="w-full mt-4"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !answer.trim() ||
              (localTask.type === "speaking" && !audioBlob)
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Answer"}
          </Button>
        )}

        {localTask.isCompleted && renderFeedback()}
      </CardContent>
    </Card>
  );
}