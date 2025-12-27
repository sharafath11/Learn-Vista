"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Mic,
  PenTool,
  Headphones,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  Square,
  Pause,
  Circle,
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
import { handleTextToSpeech, stopTextToSpeech } from "@/src/utils/voice";
import { ITaskesProps } from "@/src/types/userProps";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";

type RecordingState = "idle" | "recording" | "paused" | "completed";

const taskIcons = {
  speaking: Mic,
  writing: PenTool,
  listening: Headphones,
};

const taskColors = {
  speaking: "from-blue-500 to-cyan-500",
  writing: "from-purple-500 to-pink-500",
  listening: "from-green-500 to-emerald-500",
};

export function DailyTaskCard({ task, taskId }: ITaskesProps) {
  const [localTask, setLocalTask] = useState(task);
  const [answer, setAnswer] = useState(localTask.userResponse ?? "");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recState, setRecState] = useState<RecordingState>("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    setLocalTask(task);
    setAnswer(task.userResponse ?? "");
  }, [task]);

  const initSpeechRecognition = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) return null;

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setAnswer((prev) => prev + (prev ? " " : "") + finalTranscript.trim());
      }
    };

    recognition.onend = () => {
      if (recState === "recording") {
        recognition.start();
      }
    };

    return recognition;
  }, [recState]);

  const handleStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      recorder.start(1000);
      const recognition = initSpeechRecognition();
      recognitionRef.current = recognition;
      recognition?.start();
      setRecState("recording");
    } catch (err) {
      showErrorToast("Microphone access denied.");
    }
  };

  const handlePause = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.pause();
      recognitionRef.current?.stop();
      setRecState("paused");
    }
  };

  const handleResume = () => {
    if (mediaRecorderRef.current?.state === "paused") {
      mediaRecorderRef.current.resume();
      recognitionRef.current?.start();
      setRecState("recording");
    }
  };

  const handleFinish = () => {
    mediaRecorderRef.current?.stop();
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setRecState("completed");
  };

  const handleReset = () => {
    setAudioBlob(null);
    setAnswer("");
    setRecState("idle");
    audioChunksRef.current = [];
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

  const renderSpeakingInterface = () => {
    if (localTask.isCompleted) return renderFeedback();

    return (
      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          {recState === "idle" && (
            <WithTooltip content="Click to begin capturing your voice and auto-transcription.">
              <Button onClick={handleStart} className="w-full h-12 text-lg">
                <Mic className="mr-2 h-5 w-5" /> Start Speaking
              </Button>
            </WithTooltip>
          )}

          {(recState === "recording" || recState === "paused") && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg animate-pulse mb-2">
                <Circle className="fill-red-500 text-red-500 h-3 w-3 mr-2" />
                <span className="text-red-600 font-bold uppercase text-xs tracking-widest">
                  {recState === "recording" ? "Live Recording" : "Paused"}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <WithTooltip content={recState === "recording" ? "Pause recording temporarily." : "Resume capturing your voice."}>
                  <Button variant="outline" onClick={recState === "recording" ? handlePause : handleResume}>
                    {recState === "recording" ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Resume</>}
                  </Button>
                </WithTooltip>
                <WithTooltip content="Finalize the audio file and stop recording.">
                  <Button variant="destructive" onClick={handleFinish}>
                    <Square className="mr-2 h-4 w-4" /> Finish
                  </Button>
                </WithTooltip>
              </div>
            </div>
          )}

          {recState === "completed" && audioBlob && (
            <div className="p-4 bg-gray-50 border rounded-lg space-y-3">
              <p className="text-sm font-semibold text-gray-600">Review your recording:</p>
              <audio controls src={URL.createObjectURL(audioBlob)} className="w-full" />
              <WithTooltip content="Erase current recording and start over.">
                <Button variant="ghost" onClick={handleReset} className="w-full text-red-500 hover:bg-red-100">
                  <RotateCcw className="mr-2 h-4 w-4" /> Reset & Re-record
                </Button>
              </WithTooltip>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Transcript</label>
          <WithTooltip content="Review and edit the automatic transcription before submitting.">
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={recState === "recording" || recState === "paused"}
              placeholder="Your speech will appear here..."
              className="min-h-[150px] bg-white resize-none"
            />
          </WithTooltip>
        </div>

        <WithTooltip content="Submit your recording and transcript for evaluation.">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting || recState !== "completed" || !answer.trim()}
          >
            {isSubmitting ? "Uploading..." : "Submit Answer"}
          </Button>
        </WithTooltip>
      </div>
    );
  };

  const renderFeedback = () => {
    return (
      <div className="p-4 mt-3 bg-white rounded-xl border-2 border-green-100 space-y-4">
        {localTask.userResponse && (
          <div className="text-sm">
            <strong className="text-gray-500 uppercase text-[10px]">Your Submission</strong>
            <div className="mt-2">
              {localTask.type === "speaking" ? (
                <audio controls src={localTask.userResponse} className="w-full" />
              ) : (
                <p className="text-gray-800">{localTask.userResponse}</p>
              )}
            </div>
          </div>
        )}
        {localTask.aiFeedback && (
          <div className="p-3 bg-blue-50 rounded-lg text-sm border border-blue-100">
            <strong className="text-blue-700">AI Feedback:</strong>
            <p className="mt-1 text-blue-900 leading-relaxed">{localTask.aiFeedback}</p>
          </div>
        )}
        {localTask.score !== undefined && (
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="font-bold text-gray-700">Overall Score</span>
            <span className="text-2xl font-black text-green-600">{localTask.score}/5</span>
          </div>
        )}
      </div>
    );
  };

  const Icon = taskIcons[localTask.type as keyof typeof taskIcons] || Mic;

  return (
    <Card className={`overflow-hidden transition-all duration-300 border-2 ${localTask.isCompleted ? "border-green-200" : "border-gray-100 shadow-sm"}`}>
      <CardHeader className="bg-white border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${taskColors[localTask.type as keyof typeof taskColors]} text-white`}>
              <Icon className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">{localTask.title}</CardTitle>
          </div>
          {localTask.isCompleted ? (
            <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Completed</Badge>
          ) : (
            <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 bg-gray-50/30">
        <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
          <p className="text-sm text-gray-600 italic">"{localTask.prompt}"</p>
        </div>

        {localTask.type === "speaking" ? (
          renderSpeakingInterface()
        ) : (
          <div className="space-y-4">
            {!localTask.isCompleted ? (
              <>
                {localTask.type === "listening" && (
                  <div className="flex gap-2">
                    <Button onClick={() => handleTextToSpeech(localTask.prompt)} className="flex-1">
                      <Play className="h-4 w-4 mr-2" /> Play Audio
                    </Button>
                    <Button variant="outline" onClick={stopTextToSpeech}>
                      <Square className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                <WithTooltip content="Type your response here.">
                  <Textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Write your answer here..."
                    className="min-h-[150px] bg-white"
                  />
                </WithTooltip>
                <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting || !answer.trim()}>
                  {isSubmitting ? "Submitting..." : "Submit Task"}
                </Button>
              </>
            ) : (
              renderFeedback()
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}