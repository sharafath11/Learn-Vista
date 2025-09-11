// components/user/sessions/LessonContent.tsx
import React, { useState } from 'react';
import VideoPlayer from "@/src/components/user/sessions/VideoPlayer";
import TheoryQuestions from "@/src/components/user/sessions/TheoryQuestions";
import CodeChallenge from "@/src/components/user/sessions/CodeChallenge";
import MCQQuestions from "@/src/components/user/sessions/MCQQuestions";
import { ILessonContentProps } from '@/src/types/userProps';


const LessonContent: React.FC<ILessonContentProps> = ({
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
  report 
}) => {
  const [activeTab, setActiveTab] = useState<"theory" | "practical" | "mcq">("theory");
  const showQuestions = videoCompleted && !report; 
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
      {showQuestions && (
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

      {videoCompleted && report && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center text-gray-600 dark:text-gray-300">
          You have already completed this lesson and a report has been generated.
          You can view your report in the Lesson Header.
        </div>
      )}
    </div>
  );
};

export default LessonContent;