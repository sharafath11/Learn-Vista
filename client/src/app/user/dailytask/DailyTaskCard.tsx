"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  PenTool,
  Headphones,
  CheckCircle2,
  Clock,
  Play,
} from "lucide-react";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { Button } from "@/src/components/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/shared/components/ui/card";
import { Textarea } from "@/src/components/shared/components/ui/textarea";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/src/utils/Toast";
import { ITask } from "@/src/types/dailyTaskTypes";
import { handleTextToSpeech, stopTextToSpeech } from "@/src/utils/voice";

interface Props {
  task: ITask;
  taskId: string;
}

const taskIcons = {
  speaking: Mic,
  writing: PenTool,
  listening: Headphones,
};

const taskColors = {
  speaking: "from-red-500 to-pink-500",
  writing: "from-blue-500 to-cyan-500",
  listening: "from-green-500 to-emerald-500",
};

const taskBgColors = {
  speaking: "bg-red-50 border-red-200",
  writing: "bg-blue-50 border-blue-200",
  listening: "bg-green-50 border-green-200",
};

export function DailyTaskCard({ task, taskId }: Props) {
  const [localTask, setLocalTask] = useState(task);
  const [answer, setAnswer] = useState(localTask.userResponse ?? "");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const Icon = taskIcons[localTask.type];

  useEffect(() => {
    setLocalTask(task);
    setAnswer(task.userResponse ?? "");
  }, [task]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      // Speech Recognition
      if ("webkitSpeechRecognition" in window) {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setAnswer(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          showErrorToast(`Speech recognition error: ${event.error}`);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
      } else {
        showInfoToast(
          "Speech recognition not supported in this browser, only audio will be recorded."
        );
      }

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      showInfoToast("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  const handleSubmit = async () => {
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

    if (res.ok) {
      showSuccessToast(res.msg);
      setLocalTask((prev) => ({
        ...prev,
        isCompleted: true,
        userResponse: res.data.userResponse,
        aiFeedback: res.data.aiFeedback,
        score: res.data.score,
      }));
    } else {
      showErrorToast(res.msg);
    }
  };

  const renderFeedback = () => {
    if (!localTask.isCompleted) return null;
    return (
      <div className="p-4 mt-3 bg-gray-50 rounded border border-gray-200 space-y-2">
        {localTask.type === "listening" && localTask.prompt && (
          <div>
            <p className="text-sm font-semibold">Prompt:</p>
            <Button className="w-full" onClick={() => handleTextToSpeech(task.prompt)}>
              <Play className="h-4 w-4 mr-2" />
              Play Audio
            </Button>
            <Button variant="ghost" className="w-full" onClick={stopTextToSpeech}>
              Stop Audio
            </Button>
          </div>
        )}
        {localTask.userResponse && (
          <div className="text-sm text-gray-800">
            <strong>Your Answer:</strong>
            <br />
            {localTask.type !== "speaking" ? (
              localTask.userResponse
            ) : (
              <audio controls src={localTask.userResponse} className="mt-2" />
            )}
          </div>
        )}
        {localTask.aiFeedback && (
          <p className="text-sm text-gray-800">
            <strong>AI Feedback:</strong> <br />
            {localTask.aiFeedback}
          </p>
        )}
        {typeof localTask.score === "number" && (
          <p className="text-sm text-gray-800">
            <strong>Score:</strong> {localTask.score} / 5
          </p>
        )}
      </div>
    );
  };

  return (
    <Card
      className={`group hover:shadow-xl transition-all duration-300 border-2 ${
        localTask.isCompleted
          ? "bg-green-50 border-green-200"
          : taskBgColors[localTask.type]
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg bg-gradient-to-r ${taskColors[localTask.type]} text-white`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold leading-tight">
                {localTask.title}
              </CardTitle>
              <Badge variant="outline" className="mt-1 text-xs capitalize">
                {localTask.type}
              </Badge>
            </div>
          </div>
          <div>
            {localTask.isCompleted ? (
              <Badge className="bg-green-500 hover:bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Done
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Pending
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="p-4 bg-white/60 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            {localTask.type !== "listening" ? localTask.prompt : ""}
          </p>
        </div>

        {/* Speaking */}
        {localTask.type === "speaking" && (
          <div className="space-y-3">
            {!localTask.isCompleted && (
              <>
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  className="w-full"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? "Stop Recording" : "Start Recording"}
                </Button>
                <Textarea
                  placeholder="Your speech transcription will appear here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[100px] resize-none border-red-200 focus:border-red-400"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {answer.length} characters
                </div>
              </>
            )}
            {renderFeedback()}
          </div>
        )}

        {/* Writing */}
        {localTask.type === "writing" && (
          <div className="space-y-3">
            {!localTask.isCompleted && (
              <>
                <Textarea
                  placeholder="Write your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[120px] resize-none border-blue-200 focus:border-blue-400"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {answer.length} characters
                </div>
              </>
            )}
            {renderFeedback()}
          </div>
        )}

        {/* Listening */}
        {localTask.type === "listening" && (
          <div className="space-y-3">
            {!localTask.isCompleted && (
              <>
                <Button
                  className="w-full"
                  onClick={() => handleTextToSpeech(localTask.prompt)}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Audio
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={stopTextToSpeech}
                >
                  Stop Audio
                </Button>
                <Textarea
                  placeholder="Enter your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[100px] resize-none border-green-200 focus:border-green-400"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {answer.length} characters
                </div>
              </>
            )}
            {renderFeedback()}
          </div>
        )}

        {!localTask.isCompleted && (
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isSubmitting || !answer.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Task"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
