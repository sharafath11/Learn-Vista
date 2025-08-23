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
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const Icon = taskIcons[localTask.type];

  useEffect(() => {
    setLocalTask(task);
  }, [task]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        setAudioBlob(audioBlob);
      };

      if ("webkitSpeechRecognition" in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.lang = "en-US";

        recognition.onresult = (event: SpeechRecognition) => {
          const transcript = event.results[0][0].transcript;
          setAnswer(transcript);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.onerror = (event: SpeechRecognition) => {
          showErrorToast(`Speech recognition error: ${event.error}`);
          setIsRecording(false);
        };

        recognition.start();
      } else {
        showInfoToast(
          "Speech recognition is not supported in this browser, only audio will be recorded."
        );
      }

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.warn(error)
      showInfoToast("Microphone access denied or not available.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("taskType", localTask.type);

    if (localTask.type === "speaking") {
      formData.append("answer", answer);
      if (audioBlob) {
        formData.append("audioFile", audioBlob, "recording.webm");
      }
    } else {
      formData.append("answer", answer);
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
        {/* Play Task Prompt if Listening Type */}
        {localTask.type === "listening" && localTask.prompt && (
          <div>
            <p className="text-sm font-semibold">Prompt:</p>
            <Button
              className="w-full"
              onClick={() => handleTextToSpeech(task.prompt)}
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
          </div>
        )}

        {/* User Response */}
        {localTask.userResponse && (
          <div className="text-sm text-gray-800">
            <strong>Your Answer:</strong>
            <br />
            {localTask.type !== "speaking" ? (
              localTask.userResponse
            ) : (
              <audio controls src={localTask.userResponse} className="mt-2">
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        )}

        {/* AI Feedback */}
        {localTask.aiFeedback && (
          <p className="text-sm text-gray-800">
            <strong>AI Feedback:</strong>
            <br />
            {localTask.aiFeedback}
          </p>
        )}

        {/* Score */}
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
          <div className="flex items-center gap-1">
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
        {localTask.type === "speaking" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-red-100">
              <Mic className="h-4 w-4 text-red-500" />
              <span className="text-sm font-medium">Voice Recording</span>
            </div>
            {!localTask.isCompleted && (
              <>
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  className="w-full"
                  onClick={isRecording ? stopRecording : startRecording}
                >
                  {isRecording ? (
                    <>
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
                      Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 mr-2" />
                      Start Recording
                    </>
                  )}
                </Button>
                <div className="space-y-3 mt-3">
                  <Textarea
                    placeholder="Your speech transcription will appear here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={true}
                    className="min-h-[100px] resize-none border-red-200 focus:border-red-400"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {answer.length} characters
                  </div>
                </div>
              </>
            )}
            {renderFeedback()}
          </div>
        )}

        {localTask.type === "writing" && (
          <div className="space-y-3">
            {!localTask.isCompleted ? (
              <>
                <Textarea
                  placeholder="Write your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  disabled={localTask.isCompleted}
                  className="min-h-[120px] resize-none border-blue-200 focus:border-blue-400"
                />
                <div className="text-xs text-muted-foreground text-right">
                  {answer.length} characters
                </div>
              </>
            ) : (
              ""
            )}
            {renderFeedback()}
          </div>
        )}

        {localTask.type === "listening" && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-white/60 rounded-lg border border-green-100">
              <Headphones className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Listening Task</span>
            </div>
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
                <div className="space-y-3 mt-3">
                  <Textarea
                    placeholder="Enter your answer here..."
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    disabled={localTask.isCompleted}
                    className="min-h-[100px] resize-none border-green-200 focus:border-green-400"
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {answer.length} characters
                  </div>
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
            disabled={
              isSubmitting ||
              (localTask.type === "writing" && !answer.trim()) ||
              (localTask.type === "speaking" && !answer.trim()) ||
              (localTask.type === "listening" && !answer.trim())
            }
          >
            {isSubmitting ? "Submitting..." : "Submit Task"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
