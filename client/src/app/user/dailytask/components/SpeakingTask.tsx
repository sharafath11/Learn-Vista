"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Square, Pause, Play, Upload } from "lucide-react";
import { Button } from "@/src/components/shared/components/ui/button";
import { RecordingState, SpeakingTaskProps, SpeechRecognitionInstance } from "@/src/types/dailyTaskTypes";


export function SpeakingTask({ onComplete }: SpeakingTaskProps) {
  const [state, setState] = useState<RecordingState>("idle");
  const [transcript, setTranscript] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stateRef = useRef<RecordingState>("idle");

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  /* ---------- Speech Recognition ---------- */

  const createSpeechRecognition = (): SpeechRecognitionInstance | null => {
    const SpeechCtor =
      (window as unknown as {
        webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        SpeechRecognition?: new () => SpeechRecognitionInstance;
      }).webkitSpeechRecognition ||
      (window as unknown as {
        SpeechRecognition?: new () => SpeechRecognitionInstance;
      }).SpeechRecognition;

    if (!SpeechCtor) {
      console.warn("SpeechRecognition not supported");
      return null;
    }

    const recognition = new SpeechCtor();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript;
        }
      }

      if (finalText) {
        setTranscript((prev) =>
          prev ? `${prev} ${finalText.trim()}` : finalText.trim()
        );
      }
    };

    recognition.onend = () => {
      if (stateRef.current === "recording") {
        recognition.start();
      }
    };

    recognition.onerror = () => {
      recognition.stop();
    };

    return recognition;
  };

  /* ---------- Controls ---------- */

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    chunksRef.current = [];

    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };

    recorder.start();
    recognitionRef.current = createSpeechRecognition();
    recognitionRef.current?.start();

    setState("recording");
  };

  const pauseRecording = () => {
    recorderRef.current?.pause();
    recognitionRef.current?.stop();
    setState("paused");
  };

  const resumeRecording = () => {
    recorderRef.current?.resume();
    recognitionRef.current?.start();
    setState("recording");
  };

  const stopRecording = () => {
    recorderRef.current?.stop();
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setState("completed");
  };

  const resetRecording = () => {
    recorderRef.current?.stop();
    recognitionRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());

    if (audioUrl) URL.revokeObjectURL(audioUrl);

    chunksRef.current = [];
    setTranscript("");
    setAudioUrl(null);
    setState("idle");
  };

  const useRecording = () => {
    if (!transcript.trim()) return;

    const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
    onComplete({ audio: audioBlob, transcript });
  };

  /* ---------- Cleanup ---------- */

  useEffect(() => {
    return () => {
      recorderRef.current?.stop();
      recognitionRef.current?.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  /* ---------- Render ---------- */

  return (
    <div className="space-y-5">
      {/* HEADER */}
<div className="border-b pb-2 flex items-start gap-2">
  <Mic className="h-5 w-5 text-blue-600 mt-0.5" />
  <div>
    <h3 className="text-base font-semibold text-gray-800">
      Speaking Task
    </h3>
    <p className="text-xs text-gray-500">
      Speak clearly into your microphone. You can pause, resume, or re-record before submitting.
    </p>
  </div>
</div>


      {audioUrl && <audio controls src={audioUrl} className="w-full" />}

      <textarea
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        disabled={state === "recording" || state === "paused"}
        className="w-full h-40 border p-3 rounded"
        placeholder="Your speech will appear here..."
      />

      <div className="flex gap-2">
        {state === "idle" && (
          <Button onClick={startRecording}>
            <Mic className="mr-2 h-4 w-4" />
            Start
          </Button>
        )}

        {state === "recording" && (
          <>
            <Button onClick={pauseRecording}>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
            <Button variant="destructive" onClick={stopRecording}>
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}

        {state === "paused" && (
          <>
            <Button onClick={resumeRecording}>
              <Play className="mr-2 h-4 w-4" />
              Resume
            </Button>
            <Button variant="destructive" onClick={stopRecording}>
              <Square className="mr-2 h-4 w-4" />
              Stop
            </Button>
          </>
        )}

        {state === "completed" && (
          <>
            <Button variant="outline" onClick={resetRecording}>
              <MicOff className="mr-2 h-4 w-4" />
              Re-record
            </Button>
            <Button onClick={useRecording}>
              <Upload className="mr-2 h-4 w-4" />
              Use Recording
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
