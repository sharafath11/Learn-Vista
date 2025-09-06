"use client";
import { useState, useRef, useEffect, ChangeEvent } from "react";
import { Mic, Square, Save, XCircle,  } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../../shared/components/ui/dialog";
import { Button } from "../../shared/components/ui/button";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import { ILessons } from "@/src/types/lessons";
import { showInfoToast, showSuccessToast } from "@/src/utils/Toast";

export default function VoiceNoteModal({
  open,
  onClose,
  courseName,
  lessonName,
  lesson
}: {
  open: boolean;
  onClose: () => void;
  courseName: string;
  lessonName: string;
  lesson: ILessons;
}) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [browserSupport, setBrowserSupport] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [,setIsEditing] = useState(false);
useEffect(() => {
  // Check for browser support on component mount
  // @ts-expect-error: SpeechRecognition is experimental
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    setBrowserSupport(true);
  }
}, []);

const startRecording = () => {
  // @ts-expect-error: SpeechRecognition is experimental
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = (event: { resultIndex: any; results: string | any[] }) => {
    let currentTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      currentTranscript += event.results[i][0].transcript;
    }
    setTranscript(currentTranscript);
  };

  recognition.onend = () => {
    setRecording(false);
    setIsEditing(true);
  };

  recognition.onerror = (event: { error: any }) => {
    console.error("Speech recognition error:", event.error);
    setRecording(false);
    setIsEditing(true);
  };

  recognition.start();
  recognitionRef.current = recognition;
  setRecording(true);
  setIsEditing(false);
};


  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
    setIsEditing(true); // Enable editing once recording is stopped
  };

  const handleTranscriptChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setTranscript(e.target.value);
  };

  const handleSave = async () => {
    try {
      if (!transcript.trim()) {
        showInfoToast("Please record or write a note before saving.");
        return;
      }
      const res = await UserAPIMethods.voiceNote(lesson.id, lesson.courseId, transcript);
      if (res.ok) {
        showSuccessToast(res.msg);
        setTranscript("");
      } else {
        showInfoToast(res.msg);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save voice note:", error);
      showInfoToast("An error occurred while saving the note.");
    }
  };

  const handleClose = () => {
    stopRecording();
    setTranscript("");
    onClose();
  };

  if (!browserSupport) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-md rounded-2xl shadow-lg p-6 text-center">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-600">
              <XCircle className="inline-block mr-2" /> Browser Not Supported
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-700">
            Your browser does not support the Web Speech API. Please use a different browser like Google Chrome or Microsoft Edge to use this feature.
          </p>
          <DialogFooter>
            <Button onClick={handleClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md rounded-2xl shadow-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">🎤 Add Voice Note</DialogTitle>
          <p className="text-sm text-gray-500">
            {courseName} • {lessonName}
          </p>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          {!recording ? (
            <Button
              onClick={startRecording}
              className="rounded-full p-6 bg-red-500 hover:bg-red-600 transition-all"
            >
              <Mic className="w-6 h-6 text-white" />
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="rounded-full p-6 bg-gray-800 hover:bg-gray-900 animate-pulse transition-all"
            >
              <Square className="w-6 h-6 text-white" />
            </Button>
          )}

          <p className="text-sm font-medium text-gray-600">
            {recording ? "Recording... Click to stop." : "Click the microphone to start recording."}
          </p>

          <textarea
            className="w-full h-32 p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            value={transcript}
            onChange={handleTranscriptChange}
            readOnly={recording} // Only set to read-only when recording is active
            placeholder="Your voice note will appear here..."
          />
        </div>

        <DialogFooter className="flex justify-between mt-4">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!transcript.trim() || recording}>
            <Save className="w-4 h-4 mr-2" /> Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}