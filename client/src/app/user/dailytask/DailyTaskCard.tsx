"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Mic, Pause, Play, Square, RotateCcw, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/src/components/shared/components/ui/button";
import { Textarea } from "@/src/components/shared/components/ui/textarea";
import { Badge } from "@/src/components/shared/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/shared/components/ui/card";

type RecordingState = "idle" | "recording" | "paused" | "completed" | "submitted";

interface SpeakingTaskProps {
  task: {
    id: string;
    title: string;
    prompt: string;
    isCompleted?: boolean;
    userResponse?: string;
    aiFeedback?: string;
    score?: number;
  };
  onTaskComplete?: (data: {
    taskId: string;
    audioBlob: Blob;
    transcript: string;
  }) => Promise<void> | void;
}

export function SpeakingTask({ task, onTaskComplete }: SpeakingTaskProps) {
  // State management
  const [recordingState, setRecordingState] = useState<RecordingState>(
    task.isCompleted ? "submitted" : "idle"
  );
  const [transcript, setTranscript] = useState(task.userResponse || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for browser APIs and cleanup
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioUrlRef = useRef<string | null>(null);

  // Cleanup function to prevent memory leaks
  const cleanupResources = useCallback(() => {
    // Clean up MediaRecorder
    if (mediaRecorderRef.current) {
      if (mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }
      mediaRecorderRef.current = null;
    }

    // Clean up SpeechRecognition
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }

    // Clean up MediaStream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => {
        track.stop();
        track.enabled = false;
      });
      mediaStreamRef.current = null;
    }

    // Clean up audio URL to prevent memory leaks
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }

    // Reset audio chunks
    audioChunksRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return cleanupResources;
  }, [cleanupResources]);

  // Initialize SpeechRecognition
  const initializeSpeechRecognition = useCallback(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      return null;
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.maxAlternatives = 1;

    // Handle results
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Update transcript with final results
      if (finalTranscript) {
        setTranscript(prev => (prev + finalTranscript).trim());
      }
    };

    // Handle errors
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      
      // Don't show "no-speech" errors to users as they're common
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        setError(`Speech recognition error: ${event.error}`);
      }

      // If we're still recording, try to restart recognition
      if (recordingState === 'recording' && mediaStreamRef.current) {
        setTimeout(() => {
          if (speechRecognitionRef.current) {
            try {
              speechRecognitionRef.current.start();
            } catch (e) {
              // Ignore restart errors
            }
          }
        }, 100);
      }
    };

    // Handle end - restart if we're still recording
    recognition.onend = () => {
      if (recordingState === 'recording' && mediaStreamRef.current) {
        try {
          recognition.start();
        } catch (e) {
          // Ignore restart errors
        }
      }
    };

    return recognition;
  }, [recordingState]);

  // Start recording
  const startRecording = async () => {
    try {
      setError(null);
      
      // Request microphone permission and get stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });
      
      mediaStreamRef.current = stream;
      
      // Initialize MediaRecorder
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') 
        ? 'audio/webm;codecs=opus'
        : 'audio/mp4';
      
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      
      // Collect audio chunks
      audioChunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      // Initialize SpeechRecognition
      const recognition = initializeSpeechRecognition();
      if (recognition) {
        speechRecognitionRef.current = recognition;
      }
      
      // Start recording
      recorder.start(1000); // Collect data every second
      speechRecognitionRef.current?.start();
      
      setRecordingState("recording");
      
    } catch (err) {
      console.error('Error starting recording:', err);
      setError('Could not access microphone. Please check permissions.');
      cleanupResources();
    }
  };

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      speechRecognitionRef.current?.stop();
      setRecordingState("paused");
    }
  };

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      speechRecognitionRef.current?.start();
      setRecordingState("recording");
    }
  };

  // Finish recording
  const finishRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      speechRecognitionRef.current?.stop();
      
      // Stop all media tracks
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      // Create audio blob when MediaRecorder stops
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
        });
        
        // Create object URL for preview
        if (audioUrlRef.current) {
          URL.revokeObjectURL(audioUrlRef.current);
        }
        audioUrlRef.current = URL.createObjectURL(audioBlob);
        
        setRecordingState("completed");
      };
    }
  };

  // Re-record
  const reRecord = () => {
    cleanupResources();
    setTranscript("");
    setError(null);
    setRecordingState("idle");
  };

  // Submit task
  const submitTask = async () => {
    if (recordingState !== "completed" || !transcript.trim()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const audioBlob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
      });

      if (onTaskComplete) {
        await onTaskComplete({
          taskId: task.id,
          audioBlob,
          transcript: transcript.trim(),
        });
      }

      setRecordingState("submitted");
    } catch (err) {
      console.error('Error submitting task:', err);
      setError('Failed to submit task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get audio preview URL
  const getAudioPreviewUrl = () => {
    if (!audioUrlRef.current && audioChunksRef.current.length > 0) {
      const blob = new Blob(audioChunksRef.current, { 
        type: mediaRecorderRef.current?.mimeType || 'audio/webm' 
      });
      audioUrlRef.current = URL.createObjectURL(blob);
    }
    return audioUrlRef.current;
  };

  // Render recording controls based on state
  const renderRecordingControls = () => {
    switch (recordingState) {
      case "idle":
        return (
          <Button
            onClick={startRecording}
            className="w-full h-12 text-lg"
            size="lg"
          >
            <Mic className="mr-2 h-5 w-5" />
            Start Speaking
          </Button>
        );

      case "recording":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg animate-pulse">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-pulse mr-2" />
              <span className="text-red-600 font-bold uppercase text-xs tracking-widest">
                Recording...
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={pauseRecording}
                className="h-12"
              >
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button
                variant="destructive"
                onClick={finishRecording}
                className="h-12"
              >
                <Square className="mr-2 h-4 w-4" />
                Finish
              </Button>
            </div>
          </div>
        );

      case "paused":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-yellow-50 rounded-lg">
              <div className="h-3 w-3 bg-yellow-500 rounded-full mr-2" />
              <span className="text-yellow-700 font-bold uppercase text-xs tracking-widest">
                Paused
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={resumeRecording}
                className="h-12"
              >
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
              <Button
                variant="destructive"
                onClick={finishRecording}
                className="h-12"
              >
                <Square className="mr-2 h-4 w-4" />
                Finish
              </Button>
            </div>
          </div>
        );

      case "completed":
        return (
          <div className="space-y-4">
            {getAudioPreviewUrl() && (
              <div className="p-4 bg-gray-50 border rounded-lg space-y-3">
                <p className="text-sm font-semibold text-gray-600">
                  Review your recording:
                </p>
                <audio
                  controls
                  src={getAudioPreviewUrl()}
                  className="w-full"
                />
                <Button
                  variant="ghost"
                  onClick={reRecord}
                  className="w-full text-red-500 hover:bg-red-100"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Re-record
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  // Render feedback if task is completed
  if (recordingState === "submitted" || task.isCompleted) {
    return (
      <Card className="overflow-hidden border-green-200">
        <CardHeader className="bg-white border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                <Mic className="h-5 w-5" />
              </div>
              <CardTitle className="text-base font-bold">{task.title}</CardTitle>
            </div>
            <Badge className="bg-green-500">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Completed
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <p className="text-sm text-gray-600 italic">"{task.prompt}"</p>
          </div>
          
          {task.userResponse && (
            <div className="space-y-4">
              {task.userResponse.startsWith('blob:') ? (
                <audio controls src={task.userResponse} className="w-full" />
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{task.userResponse}</p>
                </div>
              )}
              
              {task.aiFeedback && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <strong className="text-blue-700">AI Feedback:</strong>
                  <p className="mt-1 text-blue-900">{task.aiFeedback}</p>
                </div>
              )}
              
              {task.score !== undefined && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="font-bold text-gray-700">Score</span>
                  <span className="text-2xl font-black text-green-600">
                    {task.score}/5
                  </span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-gray-100">
      <CardHeader className="bg-white border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Mic className="h-5 w-5" />
            </div>
            <CardTitle className="text-base font-bold">{task.title}</CardTitle>
          </div>
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="mb-6 p-4 bg-white rounded-lg border">
          <p className="text-sm text-gray-600 italic">"{task.prompt}"</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {renderRecordingControls()}

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Transcript
              <span className="ml-2 text-gray-400 font-normal">
                {recordingState === "recording" || recordingState === "paused"
                  ? "(Live transcription - read only)"
                  : "(Editable after recording)"}
              </span>
            </label>
            
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              disabled={recordingState === "recording" || recordingState === "paused"}
              placeholder={
                recordingState === "recording" || recordingState === "paused"
                  ? "Transcription will appear here automatically..."
                  : "Your speech will appear here after recording..."
              }
              className="min-h-[150px] resize-none"
              readOnly={recordingState === "recording" || recordingState === "paused"}
            />
          </div>

          <Button
            onClick={submitTask}
            disabled={
              recordingState !== "completed" ||
              !transcript.trim() ||
              isSubmitting
            }
            className="w-full h-12"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Submit Task"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}