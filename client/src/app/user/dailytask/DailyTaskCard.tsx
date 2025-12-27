"use client";

import { useState, useRef, useEffect } from "react";
import {
  Mic,
  Square,
  RotateCcw,
  Loader2,
  CheckCircle2,
  Clock,
  Circle,
  AlertCircle,
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
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";

type RecState = "idle" | "recording" | "transcribing" | "ready";

export function DailyTaskCard({ task, taskId }: { task: any; taskId: string }) {
  const [localTask, setLocalTask] = useState(task);
  const [recState, setRecState] = useState<RecState>("idle");
  const [transcript, setTranscript] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [finalAudioBlob, setFinalAudioBlob] = useState<Blob | null>(null);

  useEffect(() => {
    setLocalTask(task);
    if (task.userResponse) setTranscript(task.userResponse);
  }, [task]);

  const startRecording = async () => {
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
        setFinalAudioBlob(blob);
      };

      recorder.start();
      setRecState("recording");
    } catch (err) {
      showErrorToast("Could not access microphone.");
    }
  };

  const stopAndTranscribe = () => {
    if (!mediaRecorderRef.current) return;
    
    mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setRecState("transcribing");

    setTimeout(async () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
      const formData = new FormData();
      formData.append("file", blob, "audio.webm");

      try {
        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Transcription failed");

        const data = await response.json();
        setTranscript(data.text);
        setRecState("ready");
      } catch (error) {
        showErrorToast("Failed to transcribe audio. Please try again.");
        setRecState("idle");
      }
    }, 500);
  };

  const handleReset = () => {
    setRecState("idle");
    setTranscript("");
    setFinalAudioBlob(null);
    audioChunksRef.current = [];
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("answer", transcript);
    if (finalAudioBlob) formData.append("audioFile", finalAudioBlob);

    const res = await UserAPIMethods.submitDailyTaskAnswer(formData);
    setIsSubmitting(false);

    if (res.ok) {
      showSuccessToast("Task submitted successfully!");
      setLocalTask({ ...localTask, isCompleted: true });
    } else {
      showErrorToast(res.msg);
    }
  };

  return (
    <Card className="overflow-hidden border-2 transition-all shadow-sm">
      <CardHeader className="bg-white border-b flex flex-row items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg text-white">
            <Mic className="h-5 w-5" />
          </div>
          <CardTitle className="text-base font-bold">{localTask.title}</CardTitle>
        </div>
        <Badge variant={localTask.isCompleted ? "default" : "secondary"}>
          {localTask.isCompleted ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
          {localTask.isCompleted ? "Completed" : "Pending"}
        </Badge>
      </CardHeader>

      <CardContent className="p-6 bg-gray-50/30 space-y-5">
        <div className="p-4 bg-white rounded-xl border border-dashed border-blue-200">
          <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
            "{localTask.prompt}"
          </p>
        </div>

        {!localTask.isCompleted ? (
          <div className="space-y-4">
            {recState === "idle" && (
              <Button onClick={startRecording} className="w-full h-14 text-lg shadow-md" size="lg">
                <Mic className="mr-2 h-5 w-5" /> Start Speaking
              </Button>
            )}

            {recState === "recording" && (
              <div className="space-y-3">
                <div className="flex items-center justify-center p-4 bg-red-50 rounded-xl border border-red-100 animate-pulse">
                  <Circle className="fill-red-500 text-red-500 h-2 w-2 mr-2" />
                  <span className="text-red-600 font-bold text-xs uppercase tracking-widest">Recording...</span>
                </div>
                <Button variant="destructive" onClick={stopAndTranscribe} className="w-full h-14 text-lg shadow-md">
                  <Square className="mr-2 h-5 w-5" /> Finish Speaking
                </Button>
              </div>
            )}

            {recState === "transcribing" && (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border shadow-inner">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                <p className="text-sm font-semibold text-gray-500">Converting voice to text...</p>
              </div>
            )}

            {recState === "ready" && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg text-xs border border-blue-100">
                  <AlertCircle className="h-4 w-4" />
                  <span>Please review and edit the transcript before submitting.</span>
                </div>
                <Textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Transcript will appear here..."
                  className="min-h-[160px] text-base leading-relaxed p-4 bg-white"
                />
                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleReset} className="flex-1 h-12">
                    <RotateCcw className="mr-2 h-4 w-4" /> Re-record
                  </Button>
                  <Button onClick={handleSubmit} disabled={isSubmitting || !transcript.trim()} className="flex-[2] h-12">
                    {isSubmitting ? "Submitting..." : "Submit Answer"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 bg-green-50 border border-green-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-green-700 uppercase">Your Submission</h4>
            <p className="text-gray-800 text-sm leading-relaxed">{transcript}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}