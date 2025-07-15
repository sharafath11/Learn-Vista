// LessonPage.tsx (The main component)
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
import LessonContent from "./LessonContent"
import LessonDiscussion from "./LessonDiscussion"

export default function LessonPage() {
  const params = useParams()
  const lessonId = params.lessonId as string
  const router = useRouter()

  const [lesson, setLesson] = useState<ILessons | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [lessonProgress, setLessonProgress] = useState<IUserLessonProgress | null>(null); // Initialize with null

  const [videoWatchedDuration, setVideoWatchedDuration] = useState<number>(0)
  const [videoTotalDuration, setVideoTotalDuration] = useState<number>(0)
  const [initialVideoStartTime, setInitialVideoStartTime] = useState<number>(0)

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
      // Assuming getLessonDetails now returns a structure like:
      // { ok: boolean, msg?: string, data?: { lesson: ILessons, videoUrl: string, questions: IQuestions[], comments: IComment[], report?: EvaluatedAnswer, userLessonProgress?: IUserLessonProgress } }
      const res = await UserAPIMethods.getLessonDetils(lessonId); // Typo 'Detils' will be fixed in API methods
      if (res.ok && res.data) {
        setLesson(res.data.lesson);
        setVideoUrl(res.data.videoUrl);
        setQuestions(res.data.questions || []);

        if (res.data.comments) {
          setComments(res.data.comments);
        }
        console.log("res.data.userLessonProgress",res.data)
        // Initialize progress states from fetched userLessonProgress
        if (res.data.lessonProgress
) {
            const fetchedProgress = res.data.lessonProgress
;
            setLessonProgress(fetchedProgress); // Set the full progress object
            
            const lessonVideoLength = res.data.lesson?.duration;
            let effectiveTotalDuration = (lessonVideoLength && !isNaN(lessonVideoLength) && lessonVideoLength > 0)
                                        ? parseFloat(lessonVideoLength.toString()) // Ensure number
                                        : (fetchedProgress.videoTotalDuration && !isNaN(fetchedProgress.videoTotalDuration) && fetchedProgress.videoTotalDuration > 0 ? fetchedProgress.videoTotalDuration : 0);

            setVideoTotalDuration(effectiveTotalDuration);

            if (fetchedProgress.videoWatchedDuration && !isNaN(fetchedProgress.videoWatchedDuration) && fetchedProgress.videoWatchedDuration >= 0) {
                setVideoWatchedDuration(fetchedProgress.videoWatchedDuration);
                setInitialVideoStartTime(fetchedProgress.videoWatchedDuration);
            } else {
                setVideoWatchedDuration(0);
                setInitialVideoStartTime(0);
            }

            setVideoCompleted(fetchedProgress.videoCompleted || false);
            setTheoryCompleted(fetchedProgress.theoryCompleted || false);
            setPracticalCompleted(fetchedProgress.practicalCompleted || false);
            setMcqCompleted(fetchedProgress.mcqCompleted || false);

            // If a report exists, assume everything is completed
            if (fetchedProgress.overallProgressPercent === 100 && res.data.report) {
                 setReport(res.data.report as EvaluatedAnswer); // Set report
                 setVideoCompleted(true);
                 setTheoryCompleted(true);
                 setPracticalCompleted(true);
                 setMcqCompleted(true);
            } else {
                // If not 100% and no report, ensure report state is null
                setReport(null);
            }
        } else {
            // No userLessonProgress found, reset all progress states to default (false/0)
            setLessonProgress(null);
            setVideoWatchedDuration(0);
            setInitialVideoStartTime(0);
            setVideoCompleted(false);
            setTheoryCompleted(false);
            setPracticalCompleted(false);
            setMcqCompleted(false);
            setReport(null); // No progress means no report
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

  // Unified save progress method for all types
  const updateLessonProgressInDB = useCallback(async (updateData: Partial<IUserLessonProgress>) => {
    if (!lessonId) {
      console.warn("Skipped updating lesson progress: lessonId is missing.");
      return;
    }
    try {
      const res = await UserAPIMethods.updateLessonProgress(lessonId, updateData);
      if (res.ok && res.data) {
        setLessonProgress(res.data); // Update local state with the returned progress document
      } else {
        showErrorToast(res.msg || "Failed to save progress.");
      }
    } catch (error) {
      console.error("Failed to save progress:", error);
      showErrorToast("An error occurred while saving progress.");
    }
  }, [lessonId]);

  const saveVideoProgress = useCallback(async (currentTime: number, totalDuration: number) => {
    // Only save if totalDuration is valid and greater than 0
    if (lessonId && currentTime > 0 && totalDuration > 0 && !isNaN(totalDuration) && !isNaN(currentTime)) {
      updateLessonProgressInDB({
        videoWatchedDuration: currentTime,
        videoTotalDuration: totalDuration,
      });
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
    // Ensure total duration is correctly set for final save
    const finalVideoTotalDuration = videoTotalDuration > 0 ? videoTotalDuration : (lesson?.duration && !isNaN(parseFloat(lesson.duration.toString())) ? parseFloat(lesson.duration.toString()) : 0);

    // Save final state
    updateLessonProgressInDB({
        videoWatchedDuration: finalVideoTotalDuration,
        videoTotalDuration: finalVideoTotalDuration,
        videoCompleted: true // Explicitly send videoCompleted: true
    }).then(() => showSuccessToast("Video completed!"))
      .catch(err => showErrorToast("Failed to mark video completed."));
  }, [lessonId, videoTotalDuration, lesson?.duration, updateLessonProgressInDB]);

  const handleTheoryComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setTheoryAnswers(answers.map((a) => ({ ...a, type: "theory" as const })));
    setTheoryCompleted(true);
    updateLessonProgressInDB({ theoryCompleted: true })
      .then(() => showSuccessToast("Theory section completed!"))
      .catch(() => showErrorToast("Failed to update theory progress."));
  }, [updateLessonProgressInDB]);

  const handlePracticalComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setPracticalAnswers(answers.map((a) => ({ ...a, type: "practical" as const })));
    setPracticalCompleted(true);
    updateLessonProgressInDB({ practicalCompleted: true })
      .then(() => showSuccessToast("Coding Challenge completed!"))
      .catch(() => showErrorToast("Failed to update practical progress."));
  }, [updateLessonProgressInDB]);

  const handleMCQComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setMcqAnswers(answers.map((a) => ({ ...a, type: "mcq" as const })));
    setMcqCompleted(true);
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
            id: res.data.id, // Assuming backend returns ID
            lessonId: lessonId,
            userName: res.data.userName, // Assuming backend returns userName
            comment: commentText,
            createdAt: new Date(res.data.createdAt), // Assuming backend returns createdAt
          };
          setComments((prevComments) => [...prevComments, newComment]);
          showSuccessToast(res.msg || "Comment posted successfully!");
        } else {
          showErrorToast(res.msg || "Failed to post comment.");
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
        // Only submit report if there are actual questions/answers
        console.warn("No answers to submit for report.");
        return;
    }
    try {
      const res = await UserAPIMethods.getReport(lessonId, combinedAnswers);
      if (res.ok && res.data?.report) {
        setReport(res.data.report as EvaluatedAnswer);
        showSuccessToast(res.msg || "Lesson report submitted successfully!");
        fetchDetails(); // Re-fetch to update overall progress and potentially report status
      } else {
        showErrorToast(res.msg || "Failed to submit lesson report or report data is missing.");
      }
    } catch (error) {
      console.error("Failed to submit lesson report:", error);
      showErrorToast("An error occurred while submitting the report.");
    }
  }, [lessonId, theoryAnswers, practicalAnswers, mcqAnswers, fetchDetails]);


  // This useEffect triggers report submission when all sections are completed
  useEffect(() => {
    if (lesson && videoCompleted && theoryCompleted && practicalCompleted && mcqCompleted && !report) {
      // Only submit report if the lesson actually has questions/challenges
      const hasQuestions = questions.some(q => ["theory", "practical", "mcq"].includes(q.type));
      if (hasQuestions) {
        submitLessonReport();
      } else if (!hasQuestions && !report) {
        // If no questions and no report yet, but all "sections" are done (video only),
        // we might implicitly mark the lesson as fully completed here if report is optional.
        // For now, let's keep it tied to actual question submission.
        // If a lesson is only video-based, its "completion" might just be videoCompleted: true.
        // You might need a separate mechanism to mark overall lesson completion if there are no questions.
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


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="container mx-auto px-4 max-w-6xl">
        <LessonHeader
          lesson={lesson}
          report={report}
          allSectionsCompleted={allSectionsCompleted}
          onBack={handleBackToLessons}
          onViewReport={() => setIsReportModalOpen(true)}
        />

        <LessonProgressBar progress={calculateOverallProgress()} />

        <LessonContent
          videoUrl={videoUrl}
          lessonTitle={lesson.title}
          lessonThumbnail={lesson.thumbnail || ""}
          initialVideoStartTime={lessonProgress?.videoWatchedDuration||0}
          lessonDuration={Number(lesson.duration) || 0}
          questions={questions}
          videoCompleted={videoCompleted}
          theoryCompleted={theoryCompleted}
          practicalCompleted={practicalCompleted}
          mcqCompleted={mcqCompleted}
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