"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import { IQuestions, ILessons, AnswerWithType, IComment, EvaluatedAnswer } from "@/src/types/lessons"
import { IUserLessonProgress } from "@/src/types/userProgressTypes"
import { CustomAlertDialog } from "@/src/components/custom-alert-dialog"

import ReportModal from "./ReportModal"
import LessonHeader from "./LessonHeader"
import LessonProgressBar from "./LessonProgressBar"
import LessonContent from "./LessonContent" // This import remains the same
import LessonDiscussion from "./LessonDiscussion"

export default function LessonPage() {
  const params = useParams()
  const lessonId = params.lessonId as string
  const router = useRouter()

  const [lesson, setLesson] = useState<ILessons | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [lessonProgress, setLessonProgress] = useState<IUserLessonProgress | null>(null);

  const [videoWatchedDuration, setVideoWatchedDuration] = useState<number>(0)
  const [videoTotalDuration, setVideoTotalDuration] = useState<number>(0)
  const [initialVideoStartTime, setInitialVideoStartTime] = useState<number>(0)

  // Use separate state for completion to manage user interaction more fluidly
  const [videoCompleted, setVideoCompleted] = useState(false)
  const [theoryCompleted, setTheoryCompleted] = useState(false)
  const [practicalCompleted, setPracticalCompleted] = useState(false)
  const [mcqCompleted, setMcqCompleted] = useState(false)

  const [theoryAnswers, setTheoryAnswers] = useState<AnswerWithType[]>([])
  const [practicalAnswers, setPracticalAnswers] = useState<AnswerWithType[]>([])
  const [mcqAnswers, setMcqAnswers] = useState<AnswerWithType[]>([])

  const [report, setReport] = useState<EvaluatedAnswer | null>(null)
  const [comments, setComments] = useState<IComment[]>([])

  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false)

  const videoProgressDebounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const minProgressSaveInterval = 10000;

  // Derive hasUnsavedChanges more accurately
  const hasUnsavedChanges =
    (videoWatchedDuration > 0 && !videoCompleted) ||
    !videoCompleted ||
    !theoryCompleted ||
    !practicalCompleted ||
    !mcqCompleted;

  const hasUnsavedChangesRef = useRef(hasUnsavedChanges);
  useEffect(() => {
    hasUnsavedChangesRef.current = hasUnsavedChanges;
  }, [hasUnsavedChanges]);

  const fetchDetails = useCallback(async () => {
    if (!lessonId) return;
    try {
      const res = await UserAPIMethods.getLessonDetils(lessonId);
      if (res.ok && res.data) {
        setLesson(res.data.lesson);
        setVideoUrl(res.data.videoUrl);
        setQuestions(res.data.questions || []);

        if (res.data.comments) {
          setComments(res.data.comments);
        }

        console.log("--- Initial Data Fetch ---");
        console.log("Fetched lessonProgress:", res.data.lessonProgress);
        console.log("Fetched report:", res.data.report);

        if (res.data.lessonProgress) {
            const fetchedProgress = res.data.lessonProgress
            setLessonProgress(fetchedProgress);

            // Set individual completion states based on fetched progress
            setVideoCompleted(fetchedProgress.videoCompleted || false);
            setTheoryCompleted(fetchedProgress.theoryCompleted || false);
            setPracticalCompleted(fetchedProgress.practicalCompleted || false);
            setMcqCompleted(fetchedProgress.mcqCompleted || false);
            setInitialVideoStartTime(fetchedProgress.videoWatchedDuration || 0);

            // Set report if available from API
            if (res.data.report) {
                 setReport(res.data.report as EvaluatedAnswer);
            } else {
                 setReport(null);
            }

            console.log("Initial state after fetching progress:");
            console.log("videoCompleted:", fetchedProgress.videoCompleted);
            console.log("theoryCompleted:", fetchedProgress.theoryCompleted);
            console.log("practicalCompleted:", fetchedProgress.practicalCompleted);
            console.log("mcqCompleted:", fetchedProgress.mcqCompleted);
            console.log("Report available:", !!res.data.report);

        } else {
            // Reset all states if no lesson progress is found
            setLessonProgress(null);
            setVideoWatchedDuration(0);
            setInitialVideoStartTime(0);
            setVideoCompleted(false);
            setTheoryCompleted(false);
            setPracticalCompleted(false);
            setMcqCompleted(false);
            setReport(null);
            console.log("No lesson progress found. All completion states reset to false.");
        }

      } else {
        showErrorToast(res.msg || "Failed to fetch lesson details.");
      }
    } catch (error) {
      console.error("Failed to fetch lesson details:", error);
      showErrorToast("Failed to load lesson details.");
    }
  }, [lessonId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const updateLessonProgressInDB = useCallback(async (updateData: Partial<IUserLessonProgress>) => {
    if (!lessonId) {
      console.warn("Skipped updating lesson progress: lessonId is missing.");
      return;
    }
    try {
      const res = await UserAPIMethods.updateLessonProgress(lessonId, updateData);
      if (res.ok && res.data) {
        setLessonProgress(res.data);
        console.log("Lesson progress updated in DB:", updateData);
        console.log("New lessonProgress state:", res.data);
      } else {
        showErrorToast(res.msg || "Failed to save progress.");
        console.error("Failed to update lesson progress in DB:", res.msg);
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
      showErrorToast("An error occurred while saving progress.");
    }
  }, [lessonId]);

  const saveVideoProgress = useCallback(async (currentTime: number, totalDuration: number) => {
    if (lessonId && currentTime > 0 && totalDuration > 0 && !isNaN(totalDuration) && !isNaN(currentTime)) {
      updateLessonProgressInDB({
        videoWatchedDuration: currentTime,
        videoTotalDuration: totalDuration,
      });
      console.log(`Video progress saved: ${currentTime}/${totalDuration}`);
    } else {
      console.warn("Skipped saving video progress due to invalid values or lessonId:", { lessonId, currentTime, totalDuration });
    }
  }, [lessonId, updateLessonProgressInDB]);

  const handleVideoProgress = useCallback((currentTime: number, totalDuration: number) => {
    setVideoWatchedDuration(currentTime);
    setVideoTotalDuration(totalDuration);

    if (videoProgressDebounceTimeoutRef.current) {
      clearTimeout(videoProgressDebounceTimeoutRef.current);
    }

    videoProgressDebounceTimeoutRef.current = setTimeout(() => {
      saveVideoProgress(currentTime, totalDuration);
    }, minProgressSaveInterval);
  }, [saveVideoProgress]);

  const handleVideoComplete = useCallback(() => {
    setVideoCompleted(true);
    console.log("Video marked as completed locally.");

    const finalVideoTotalDuration = videoTotalDuration > 0 ? videoTotalDuration : (lesson?.duration && !isNaN(parseFloat(lesson.duration.toString())) ? parseFloat(lesson.duration.toString()) : 0);

    // Save final state
    updateLessonProgressInDB({
        videoWatchedDuration: finalVideoTotalDuration,
        videoTotalDuration: finalVideoTotalDuration,
        videoCompleted: true
    }).then(() => showSuccessToast("Video completed!"))
      .catch(err => showErrorToast("Failed to mark video completed."));
  }, [lessonId, videoTotalDuration, lesson?.duration, updateLessonProgressInDB]);

  const handleTheoryComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setTheoryAnswers(answers.map((a) => ({ ...a, type: "theory" as const })));
    setTheoryCompleted(true);
    console.log("Theory section marked as completed locally.");
    updateLessonProgressInDB({ theoryCompleted: true })
      .then(() => showSuccessToast("Theory section completed!"))
      .catch(() => showErrorToast("Failed to update theory progress."));
  }, [updateLessonProgressInDB]);

  const handlePracticalComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setPracticalAnswers(answers.map((a) => ({ ...a, type: "practical" as const })));
    setPracticalCompleted(true);
    console.log("Practical section marked as completed locally.");
    updateLessonProgressInDB({ practicalCompleted: true })
      .then(() => showSuccessToast("Coding Challenge completed!"))
      .catch(() => showErrorToast("Failed to update practical progress."));
  }, [updateLessonProgressInDB]);

  const handleMCQComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setMcqAnswers(answers.map((a) => ({ ...a, type: "mcq" as const })));
    setMcqCompleted(true);
    console.log("MCQ section marked as completed locally.");
    updateLessonProgressInDB({ mcqCompleted: true })
      .then(() => showSuccessToast("MCQ section completed!"))
      .catch(() => showErrorToast("Failed to update MCQ progress."));
  }, [updateLessonProgressInDB]);

  const handleAddComment = useCallback(async (commentText: string) => {
    if (commentText.trim() && lessonId) {
      try {
        const res = await UserAPIMethods.saveComment(lessonId, commentText);
        if (res.ok && res.data) {
          const newComment: IComment = {
            id: res.data.id,
            lessonId: lessonId,
            userName: res.data.userName,
            comment: commentText,
            createdAt: new Date(res.data.createdAt),
          };
          setComments((prevComments) => [...prevComments, newComment]);
          showSuccessToast(res.msg || "Comment posted successfully!");
          console.log("Comment added:", newComment);
        } else {
          showErrorToast(res.msg || "Failed to post comment.");
          console.error("Failed to add comment:", res.msg);
        }
      } catch (error) {
        console.error("Failed to add comment:", error);
        showErrorToast("An error occurred while posting comment.");
      }
    }
  }, [lessonId]);

  const submitLessonReport = useCallback(async () => {
    const combinedAnswers: AnswerWithType[] = [...theoryAnswers, ...practicalAnswers, ...mcqAnswers];
    if (combinedAnswers.length === 0) {
        console.warn("No answers to submit for report.");
        return;
    }
    console.log("Attempting to submit lesson report with answers:", combinedAnswers);
    try {
      const res = await UserAPIMethods.getReport(lessonId, combinedAnswers);
      if (res.ok && res.data?.report) {
        setReport(res.data.report as EvaluatedAnswer);
        showSuccessToast(res.msg || "Lesson report submitted successfully!");
        console.log("Lesson report received and set:", res.data.report);
        fetchDetails(); // Re-fetch to update overall progress and potentially report status
      } else {
        showErrorToast(res.msg || "Failed to submit lesson report or report data is missing.");
        console.error("Failed to submit lesson report:", res.msg);
      }
    } catch (error) {
      console.error("Failed to submit lesson report:", error);
      showErrorToast("An error occurred while submitting the report.");
    }
  }, [lessonId, theoryAnswers, practicalAnswers, mcqAnswers, fetchDetails]);


  // This useEffect triggers report submission when all sections are completed
  useEffect(() => {
    console.log("--- Completion Check Triggered ---");
    console.log("videoCompleted:", videoCompleted, "theoryCompleted:", theoryCompleted, "practicalCompleted:", practicalCompleted, "mcqCompleted:", mcqCompleted);
    console.log("Current report state:", report);
    console.log("Lesson has questions:", questions.some(q => ["theory", "practical", "mcq"].includes(q.type)));

    if (lesson && videoCompleted && theoryCompleted && practicalCompleted && mcqCompleted && !report) {
      // Only submit report if the lesson actually has questions/challenges
      const hasQuestions = questions.some(q => ["theory", "practical", "mcq"].includes(q.type));
      if (hasQuestions) {
        console.log("All sections completed and no report yet. Submitting report...");
        submitLessonReport();
      } else if (!hasQuestions && !report) {
        console.log("No questions in lesson and no report. Marking overall completion (implicitly).");
        // If a lesson is only video-based, its "completion" might just be videoCompleted: true.
        // You might need a separate mechanism to mark overall lesson completion if there are no questions.
        // For lessons with no questions, ensure lessonProgress.overallProgressPercent becomes 100 somehow.
        // For now, this case will simply not trigger report submission, which is correct.
      }
    }
  }, [videoCompleted, theoryCompleted, practicalCompleted, mcqCompleted, report, lesson, submitLessonReport, questions]);


  const calculateOverallProgress = useCallback(() => {
    const SECTION_WEIGHTS = {
        video: 0.40,
        theory: 0.20,
        practical: 0.20,
        mcq: 0.20,
    };

    let completedWeight = 0;
    if (videoCompleted) {
        completedWeight += SECTION_WEIGHTS.video;
    } else if (videoTotalDuration > 0) {
        const videoCompletionRatio = Math.min(1, videoWatchedDuration / videoTotalDuration);
        completedWeight += videoCompletionRatio * SECTION_WEIGHTS.video;
    }

    // Other sections
    if (theoryCompleted) {
        completedWeight += SECTION_WEIGHTS.theory;
    }
    if (practicalCompleted) {
        completedWeight += SECTION_WEIGHTS.practical;
    }
    if (mcqCompleted) {
        completedWeight += SECTION_WEIGHTS.mcq;
    }

    // Ensure it doesn't exceed 100%
    return Math.min(100, Math.max(0, completedWeight * 100));
  }, [videoWatchedDuration, videoTotalDuration, videoCompleted, theoryCompleted, practicalCompleted, mcqCompleted]);


  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = (event: PopStateEvent) => {
      if (hasUnsavedChangesRef.current) {
        setShowLeaveConfirm(true);
        window.history.pushState(null, "", window.location.href);
      }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (hasUnsavedChangesRef.current) {
        event.preventDefault();
        event.returnValue = "";
        return "";
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      if (videoProgressDebounceTimeoutRef.current) {
        clearTimeout(videoProgressDebounceTimeoutRef.current);
      }
    };
  }, []);

  const handleBackToLessons = useCallback(async () => {
    if (lesson?.courseId) {
      if (hasUnsavedChangesRef.current) {
        setShowLeaveConfirm(true);
      } else {
        router.push(`/user/sessions/${lesson.courseId}`);
      }
    } else {
        router.back();
    }
  }, [lesson?.courseId, router]);

  if (!lesson) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const allSectionsCompleted = videoCompleted && theoryCompleted && practicalCompleted && mcqCompleted;

  console.log("--- Render Cycle Update ---");
  console.log("Current lessonProgress:", lessonProgress);
  console.log("Current report:", report);
  console.log("Current Completion States - Video:", videoCompleted, "Theory:", theoryCompleted, "Practical:", practicalCompleted, "MCQ:", mcqCompleted);
  console.log("All Sections Completed:", allSectionsCompleted);


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <LessonHeader
          lesson={lesson}
          report={report}
          allSectionsCompleted={allSectionsCompleted} // This accurately reflects overall completion
          onBack={handleBackToLessons}
          onViewReport={() => setIsReportModalOpen(true)}
        />

        <LessonProgressBar progress={calculateOverallProgress()} />

        <LessonContent
          videoUrl={videoUrl}
          lessonTitle={lesson.title}
          lessonThumbnail={lesson.thumbnail || ""}
          initialVideoStartTime={initialVideoStartTime} // Use the state variable
          lessonDuration={Number(lesson.duration) || 0}
          questions={questions}
          videoCompleted={videoCompleted}     // Use the state variable directly
          theoryCompleted={theoryCompleted}   // Use the state variable directly
          practicalCompleted={practicalCompleted} // Use the state variable directly
          mcqCompleted={mcqCompleted}         // Use the state variable directly
          report={report} // Pass the report state to LessonContent
          onVideoComplete={handleVideoComplete}
          onVideoProgress={handleVideoProgress}
          onTheoryComplete={handleTheoryComplete}
          onPracticalComplete={handlePracticalComplete}
          onMCQComplete={handleMCQComplete}
        />

        <LessonDiscussion
          comments={comments}
          videoCompleted={videoCompleted}
          onAddComment={handleAddComment}
        />
      </div>

      <ReportModal
        report={report?.report || ""}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <CustomAlertDialog
        isOpen={showLeaveConfirm}
        onClose={() => setShowLeaveConfirm(false)}
        title="Unsaved Progress"
        description="You have not completed all sections or your recent video progress might not be fully saved. Do you want to save your progress before leaving?"
        confirmText="Save & Leave"
        cancelText="Cancel"
        onConfirm={async () => {
          if (videoProgressDebounceTimeoutRef.current) {
            clearTimeout(videoProgressDebounceTimeoutRef.current);
            await saveVideoProgress(videoWatchedDuration, videoTotalDuration);
          }
          setShowLeaveConfirm(false);
          router.push(`/user/sessions/${lesson?.courseId}`);
        }}
        onCancel={() => {
          setShowLeaveConfirm(false);
        }}
        icon="💾"
        variant="warning"
      />
    </div>
  );
}