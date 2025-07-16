// components/user/sessions/LessonContent.tsx
"use client"

import React, { useState } from 'react';
import VideoPlayer from "@/src/components/user/sessions/video-player";
import TheoryQuestions from "@/src/components/user/sessions/theory-questions";
import CodeChallenge from "@/src/components/user/sessions/CodeChallenge";
import MCQQuestions from "@/src/components/user/sessions/MCQQuestions";
import { IQuestions, EvaluatedAnswer } from '@/src/types/lessons'; // Import EvaluatedAnswer

interface LessonContentProps {
  videoUrl: string;
  lessonTitle: string;
  lessonThumbnail: string;
  initialVideoStartTime: number;
  lessonDuration: number;
  questions: IQuestions[];
  videoCompleted: boolean;
  theoryCompleted: boolean;
  practicalCompleted: boolean;
  mcqCompleted: boolean;
  report: EvaluatedAnswer | null; // Added report to props
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
  report, // Destructure report prop
  onVideoComplete,
  onVideoProgress,
  onTheoryComplete,
  onPracticalComplete,
  onMCQComplete,
}) => {
  const [activeTab, setActiveTab] = useState<"theory" | "practical" | "mcq">("theory");

  // Determine if questions should be shown: video must be completed AND no report should exist
  const shouldShowQuestions = videoCompleted && !report;

  // Determine if a specific question type exists for displaying tabs/messages
  const hasTheoryQuestions = questions.some(q => q.type === "theory");
  const hasPracticalQuestions = questions.some(q => q.type === "practical");
  const hasMcqQuestions = questions.some(q => q.type === "mcq");

  // If there are no questions, or all questions are completed and a report exists,
  // we might want to default to a tab that exists or a message.
  // For now, the active tab will just show the first available one if any, or 'theory' if none are explicitly set.
  // A more robust solution might initialize activeTab based on which uncompleted section has content.
  React.useEffect(() => {
    if (shouldShowQuestions) {
      if (hasTheoryQuestions && !theoryCompleted) {
        setActiveTab("theory");
      } else if (hasPracticalQuestions && !practicalCompleted) {
        setActiveTab("practical");
      } else if (hasMcqQuestions && !mcqCompleted) {
        setActiveTab("mcq");
      } else if (hasTheoryQuestions) { // Fallback if all are completed or only one type exists
        setActiveTab("theory");
      } else if (hasPracticalQuestions) {
        setActiveTab("practical");
      } else if (hasMcqQuestions) {
        setActiveTab("mcq");
      }
    }
  }, [shouldShowQuestions, hasTheoryQuestions, hasPracticalQuestions, hasMcqQuestions, theoryCompleted, practicalCompleted, mcqCompleted]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"> {/* Changed back to 3-column layout */}
      {/* Video Section - Always visible */}
      <div className="md:col-span-2">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">{lessonTitle}</h1>
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

      {/* Dynamic Content Section: Questions or Report */}
      <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {report ? "Lesson Report" : (videoCompleted ? "Lesson Activities" : "Lesson Progress")}
        </h2>

        {report ? (
          // Case 1: Report is available
          <div className="prose dark:prose-invert">
            <p className="text-gray-700 dark:text-gray-300">Here is your evaluated report:</p>
            <pre className="whitespace-pre-wrap break-words bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-sm text-gray-800 dark:text-gray-200">
              {report.report}
            </pre>
            {/* You could add more details from the report here */}
          </div>
        ) : (
          // Case 2: No report yet
          videoCompleted ? (
            // Case 2a: Video completed, but no report yet - show questions
            <div>
              <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="flex -mb-px space-x-2" aria-label="Tabs"> {/* Adjusted spacing and negative margin */}
                  {hasTheoryQuestions && (
                    <button
                      onClick={() => setActiveTab("theory")}
                      className={`flex-1 px-3 py-2 text-sm font-medium text-center rounded-t-lg ${
                        activeTab === "theory"
                          ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      Theory {theoryCompleted && "✓"}
                    </button>
                  )}
                  {hasPracticalQuestions && (
                    <button
                      onClick={() => setActiveTab("practical")}
                      className={`flex-1 px-3 py-2 text-sm font-medium text-center rounded-t-lg ${
                        activeTab === "practical"
                          ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      Code Challenge {practicalCompleted && "✓"}
                    </button>
                  )}
                  {hasMcqQuestions && (
                    <button
                      onClick={() => setActiveTab("mcq")}
                      className={`flex-1 px-3 py-2 text-sm font-medium text-center rounded-t-lg ${
                        activeTab === "mcq"
                          ? "border-b-2 border-blue-500 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      }`}
                    >
                      MCQ {mcqCompleted && "✓"}
                    </button>
                  )}
                </nav>
              </div>

              {/* Display content based on active tab and completion status */}
              <div className="tab-content">
                {activeTab === "theory" && (hasTheoryQuestions ? (
                  <TheoryQuestions
                    questions={questions.filter((i) => i.type === "theory")}
                    onComplete={onTheoryComplete}
                    isCompleted={theoryCompleted}
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No theory questions for this lesson.</p>
                ))}

                {activeTab === "practical" && (hasPracticalQuestions ? (
                  <CodeChallenge
                    questions={questions.filter((i) => i.type === "practical")}
                    onComplete={onPracticalComplete}
                    isCompleted={practicalCompleted}
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No coding challenges for this lesson.</p>
                ))}

                {activeTab === "mcq" && (hasMcqQuestions ? (
                  <MCQQuestions
                    questions={questions.filter((i) => i.type === "mcq")}
                    onComplete={onMCQComplete}
                    isCompleted={mcqCompleted}
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No MCQ questions for this lesson.</p>
                ))}

                {/* Message if all sections are completed but report isn't generated yet */}
                {
                  videoCompleted &&
                  ((hasTheoryQuestions && theoryCompleted) || !hasTheoryQuestions) &&
                  ((hasPracticalQuestions && practicalCompleted) || !hasPracticalQuestions) &&
                  ((hasMcqQuestions && mcqCompleted) || !hasMcqQuestions) &&
                  questions.length > 0 && ( // Only show if there were questions to begin with
                    <p className="text-gray-500 dark:text-gray-400 mt-4">
                      You've completed all activities for this lesson. Your report is being generated or awaiting evaluation.
                    </p>
                  )
                }
                {/* Edge case: Video completed, no questions at all, no report */}
                {
                  videoCompleted &&
                  questions.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 mt-4">
                      This lesson is video-only. You've completed the video.
                    </p>
                  )
                }

              </div>
            </div>
          ) : (
            // Case 2b: Video not completed yet - show a message
            <p className="text-gray-500 dark:text-gray-400">
              Complete the video lecture to unlock the lesson activities.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default LessonContent;