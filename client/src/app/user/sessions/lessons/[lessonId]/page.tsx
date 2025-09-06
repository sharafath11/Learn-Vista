"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { UserAPIMethods } from "@/src/services/methods/user.api"
import { showErrorToast, showSuccessToast } from "@/src/utils/Toast"
import { IQuestions, ILessons, AnswerWithType, IComment, EvaluatedAnswer } from "@/src/types/lessons"
import { IUserLessonProgress } from "@/src/types/userProgressTypes"
import { CustomAlertDialog } from "@/src/components/custom-alert-dialog"

import ReportModal from "./ReportModal"
import LessonHeader from "./LessonHeader"
import LessonContent from "./LessonContent"
import LessonDiscussion from "./LessonDiscussion"

export default function LessonPage() {
  const params = useParams()
  const lessonId = params.lessonId as string
  const router = useRouter()

  const [lesson, setLesson] = useState<ILessons | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [,setLessonProgress] = useState<IUserLessonProgress | null>(null);

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
    const res = await UserAPIMethods.getLessonDetils(lessonId);
    if (res.ok && res.data) {
      setLesson(res.data.lesson);
      setVideoUrl(res.data.videoUrl);
      setQuestions(res.data.questions || []);

      if (res.data.comments) {
        setComments(res.data.comments);
      }

      if (res.data.lessonProgress) {
          const fetchedProgress = res.data.lessonProgress
          setLessonProgress(fetchedProgress);

          setVideoCompleted(fetchedProgress.videoCompleted || false);
          setTheoryCompleted(fetchedProgress.theoryCompleted || false);
          setPracticalCompleted(fetchedProgress.practicalCompleted || false);
          setMcqCompleted(fetchedProgress.mcqCompleted || false);
          setInitialVideoStartTime(fetchedProgress.videoWatchedDuration || 0);

          if (res.data.report) {
            setReport(res.data.report as EvaluatedAnswer);

          } else {
               setReport(null);
          }

      } else {
          setLessonProgress(null);
          setVideoWatchedDuration(0);
          setInitialVideoStartTime(0);
          setVideoCompleted(false);
          setTheoryCompleted(false);
          setPracticalCompleted(false);
          setMcqCompleted(false);
          setReport(null);
      }

    } else {
      showErrorToast(res.msg || "Failed to fetch lesson details.");
    }
  }, [lessonId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);
  const updateLessonProgressInDB = useCallback(async (updateData: Partial<IUserLessonProgress>): Promise<boolean> => {
    if (!lessonId) {
      return false; 
    }
    const res = await UserAPIMethods.updateLessonProgress(lessonId, updateData);
    if (res.ok && res.data) {
      setLessonProgress(res.data);
      return true; 
    } else {
      showErrorToast(res.msg || "Failed to save progress.");
      return false;
    }
  }, [lessonId]);

  const saveVideoProgress = useCallback(async (currentTime: number, totalDuration: number) => {
    if (lessonId && currentTime > 0 && totalDuration > 0 && !isNaN(totalDuration) && !isNaN(currentTime)) {
      await updateLessonProgressInDB({
        videoWatchedDuration: currentTime,
        videoTotalDuration: totalDuration,
      });
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

  const handleVideoComplete = useCallback(async () => {
    setVideoCompleted(true);

    const finalVideoTotalDuration = videoTotalDuration > 0 ? videoTotalDuration : (lesson?.duration && !isNaN(parseFloat(lesson.duration.toString())) ? parseFloat(lesson.duration.toString()) : 0);
    const success = await updateLessonProgressInDB({
        videoWatchedDuration: finalVideoTotalDuration,
        videoTotalDuration: finalVideoTotalDuration,
        videoCompleted: true
    });
    if(success) { 
        showSuccessToast("Video completed!");
    } else {
        showErrorToast("Failed to mark video completed.");
    }
  }, [lesson?.duration, updateLessonProgressInDB, videoTotalDuration]); 

  const handleTheoryComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setTheoryAnswers(answers.map((a) => ({ ...a, type: "theory" as const })));
    setTheoryCompleted(true);
    const success = await updateLessonProgressInDB({ theoryCompleted: true });
    if(success) {
        showSuccessToast("Theory section completed!");
    } else {
        showErrorToast("Failed to update theory progress.");
    }
  }, [updateLessonProgressInDB]);

  const handlePracticalComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setPracticalAnswers(answers.map((a) => ({ ...a, type: "practical" as const })));
    setPracticalCompleted(true);
    const success = await updateLessonProgressInDB({ practicalCompleted: true });
    if(success) {
        showSuccessToast("Coding Challenge completed!");
    } else {
        showErrorToast("Failed to update practical progress.");
    }
  }, [updateLessonProgressInDB]);

  const handleMCQComplete = useCallback(async (answers: { question: string; answer: string }[]) => {
    setMcqAnswers(answers.map((a) => ({ ...a, type: "mcq" as const })));
    setMcqCompleted(true);
    const success = await updateLessonProgressInDB({ mcqCompleted: true });
    if(success) {
        showSuccessToast("MCQ section completed!");
    } else {
        showErrorToast("Failed to update MCQ progress.");
    }
  }, [updateLessonProgressInDB]);

  const handleAddComment = useCallback(async (commentText: string) => {
    if (commentText.trim() && lessonId) {
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
      } else {
        showErrorToast(res.msg || "Failed to post comment.");
      }
    }
  }, [lessonId]);

  const submitLessonReport = useCallback(async () => {
    const combinedAnswers: AnswerWithType[] = [...theoryAnswers, ...practicalAnswers, ...mcqAnswers];
    if (combinedAnswers.length === 0) {
        return;
    }
    const res = await UserAPIMethods.getReport(lessonId, combinedAnswers);
    if (res.ok ) {
      setReport(res.data.report as EvaluatedAnswer);
      showSuccessToast(res.msg || "Lesson report submitted successfully!");
      fetchDetails();
    } else {
      showErrorToast(res.msg || "Failed to submit lesson report or report data is missing.");
    }
  }, [lessonId, theoryAnswers, practicalAnswers, mcqAnswers, fetchDetails]);


  useEffect(() => {
    if (lesson && videoCompleted && theoryCompleted && practicalCompleted && mcqCompleted && !report) {
      const hasQuestions = questions.some(q => ["theory", "practical", "mcq"].includes(q.type));
      if (hasQuestions) {
        submitLessonReport();
      }
    }
  }, [videoCompleted, theoryCompleted, practicalCompleted, mcqCompleted, report, lesson, submitLessonReport, questions]);


  


  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
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

        <LessonContent
          videoUrl={videoUrl}
          lessonTitle={lesson.title}
          lessonThumbnail={lesson.thumbnail || ""}
          initialVideoStartTime={initialVideoStartTime}
          lessonDuration={Number(lesson.duration) || 0}
          questions={questions}
          videoCompleted={videoCompleted}
          theoryCompleted={theoryCompleted}
          practicalCompleted={practicalCompleted}
          mcqCompleted={mcqCompleted}
          report={report||null}
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
        description="Your answer will not be saved. Please complete all answers. You have not completed all sections or your recent video progress might not be fully saved. Do you want to save your progress before leaving?"
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