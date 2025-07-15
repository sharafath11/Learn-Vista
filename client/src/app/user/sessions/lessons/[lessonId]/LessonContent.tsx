// components/user/sessions/LessonContent.tsx
import React, { useState } from 'react';
import VideoPlayer from "@/src/components/user/sessions/video-player";
import TheoryQuestions from "@/src/components/user/sessions/theory-questions";
import CodeChallenge from "@/src/components/user/sessions/CodeChallenge";
import MCQQuestions from "@/src/components/user/sessions/MCQQuestions";
import { IQuestions, AnswerWithType } from '@/src/types/lessons'; // Assuming these types are here

interface LessonContentProps {
  videoUrl: string;
  lessonTitle: string;
  lessonThumbnail: string;
  initialVideoStartTime: number;
  lessonDuration: number; // Assuming this is the total duration for video from lesson
  questions: IQuestions[];
  videoCompleted: boolean;
  theoryCompleted: boolean;
  practicalCompleted: boolean;
  mcqCompleted: boolean;
  onVideoComplete: () => void;
  onVideoProgress: (currentTime: number, totalDuration: number) => void;
  onTheoryComplete: (answers: { question: string; answer: string }[]) => void;
  onPracticalComplete: (answers: { question: string; answer: string }[]) => void;
  onMCQComplete: (answers: { question: string; answer: string }[]) => void;
}

const LessonContent: React.FC<LessonContentProps> = ({
  videoUrl,
  lessonTitle,
  lessonThumbnail,
  initialVideoStartTime,
  lessonDuration,
  questions,
  videoCompleted,
  theoryCompleted,
  practicalCompleted,
  mcqCompleted,
  onVideoComplete,
  onVideoProgress,
  onTheoryComplete,
  onPracticalComplete,
  onMCQComplete,
}) => {
  const [activeTab, setActiveTab] = useState<"theory" | "practical" | "mcq">("theory");

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <VideoPlayer
          videoUrl={videoUrl}
          title={lessonTitle}
          thumbnail={lessonThumbnail}
          onComplete={onVideoComplete}
          onProgress={onVideoProgress}
          isCompleted={videoCompleted}
          startTime={initialVideoStartTime}
          totalLengthFromAPI={lessonDuration}
        />
      </div>

      {videoCompleted && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("theory")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "theory"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Theory Questions {theoryCompleted && "✓"}
              </button>
              <button
                onClick={() => setActiveTab("practical")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "practical"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Coding Challenge {practicalCompleted && "✓"}
              </button>
              <button
                onClick={() => setActiveTab("mcq")}
                className={`px-4 py-3 text-sm font-medium ${
                  activeTab === "mcq"
                    ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                MCQ Questions {mcqCompleted && "✓"}
              </button>
            </nav>
          </div>
          <div className="p-6">
            {activeTab === "theory" && (
              <TheoryQuestions
                questions={questions.filter((i) => i.type === "theory")}
                onComplete={onTheoryComplete}
                isCompleted={theoryCompleted}
              />
            )}
            {activeTab === "practical" && (
              <CodeChallenge
                questions={questions.filter((i) => i.type === "practical")}
                onComplete={onPracticalComplete}
                isCompleted={practicalCompleted}
              />
            )}
            {activeTab === "mcq" && (
              <MCQQuestions
                questions={questions.filter((i) => i.type === "mcq")}
                onComplete={onMCQComplete}
                isCompleted={mcqCompleted}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonContent;