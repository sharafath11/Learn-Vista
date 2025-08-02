"use client";

import { useEffect, useState } from "react";
import { Button } from "@/src/components/shared/components/ui/button";
import { Card } from "@/src/components/shared/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/src/components/shared/components/ui/dialog";
import { ArrowLeft, PlayCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";

import { showErrorToast, showInfoToast } from "@/src/utils/Toast";
import { useMentorContext } from "@/src/context/mentorContext";
import { AdminAPIMethods, MentorAPIMethods } from "@/src/services/APImethods";
import { ILessons } from "@/src/types/lessons";
import { ICourse } from "@/src/types/courseTypes";
import { CustomAlertDialog } from "@/src/components/custom-alert-dialog";
import { CommentsModal } from "@/src/app/mentor/courses/[courseId]/CommentsModal";
import { useAdminContext } from "@/src/context/adminContext";

export default function CourseLessonsPage() {
  const [lessons, setLessons] = useState<ILessons[]>([]);
  const [videoToPlay, setVideoToPlay] = useState<string | null>(null);
  const [showVideoPlayerModal, setShowVideoPlayerModal] = useState(false);
  const [showConfirmPublish, setShowConfirmPublish] = useState(false);

  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [lessonIdForComments, setLessonIdForComments] = useState<string | null>(null);

  const { courses, setCourses } = useAdminContext();
  const params = useParams();
  const courseId = params.courseId as string;

  const courseFromContext: ICourse | undefined = courses.find((c) => c.id === courseId);
  const [courseData, setCourseData] = useState<ICourse | undefined>(courseFromContext);

  useEffect(() => {
    if (courseId) {
      getLessons(courseId);
    }
    if (courseFromContext) {
      setCourseData(courseFromContext);
    }
  }, [courseId, courseFromContext]);

  const getLessons = async (id: string) => {
    const res = await AdminAPIMethods.getLesson(id);
    if (res.ok) {
      setLessons(res.data);
    } else {
      showErrorToast("Something went wrong while fetching lessons.");
    }
  };

  const handlePlayVideo = async (lessonId: string, videoUrl: string) => {
    const res = await MentorAPIMethods.getSignedVideoUrl(lessonId, videoUrl);
    if (res.ok) {
      setVideoToPlay(res.data.signedUrl);
      setShowVideoPlayerModal(true);
    } else {
      showErrorToast("No video available for this lesson.");
    }
  };

  const handleShowComments = (lessonId: string) => {
    setLessonIdForComments(lessonId);
    setShowCommentsModal(true);
  };

  if (!courseData) {
    return (
      <div className="container mx-auto py-8 px-4 text-center bg-gray-900 text-white min-h-screen">
        <p>Loading course details or course not found...</p>
        <p className="text-sm text-gray-400 mt-2">
          Please ensure the course ID is valid and context data is available.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto py-8 px-4 bg-gray-900 text-white min-h-screen">
      <div className="mb-8">
        <Link
          href="/mentor/courses"
          className="flex items-center text-sm text-gray-300 hover:text-white mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight text-white">{courseData.title}</h1>
            <p className="text-gray-400 mt-1">{courseData.description}</p>
          </div>

          <div className="flex-shrink-0">
            <Button
              className={
                courseData.isActive ? "bg-yellow-600 hover:bg-yellow-700" : "bg-green-600 hover:bg-green-700"
              }
              onClick={() => setShowConfirmPublish(true)}
            >
              {courseData.isActive ? "Hide This Course" : "Publish This Course"}
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Lessons</h2>

        {lessons.length > 0 ? (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  <div
                    className="sm:w-32 h-20 overflow-hidden relative"
                    onClick={() => handlePlayVideo(lesson.id, lesson.videoUrl)}
                  >
                    <Image
                      src={lesson.thumbnail || "/placeholder.svg"}
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                      width={128}
                      height={80}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-opacity-20 cursor-pointer">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <PlayCircle className="h-6 w-6 text-white opacity-90" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{lesson.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          href={`/mentor/courses/questions/${lesson.id}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button variant="outline" size="sm">
                            Manage Questions
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShowComments(lesson.id);
                          }}
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Show Comments
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg bg-gray-800 border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-white">No lessons yet</h3>
            <p className="text-gray-400 mb-2">Lessons are not available for this course.</p>
          </div>
        )}
      </div>

      <Dialog open={showVideoPlayerModal} onOpenChange={setShowVideoPlayerModal}>
        <DialogContent className="sm:max-w-[800px] aspect-video p-0 overflow-hidden bg-gray-900">
          <DialogHeader>
            <DialogTitle className="sr-only">Lesson Video</DialogTitle>
          </DialogHeader>
          {videoToPlay && (
            <video
              src={videoToPlay}
              controls
              autoPlay
              className="w-full h-full object-contain bg-black"
            >
              Your browser does not support the video tag.
            </video>
          )}
        </DialogContent>
      </Dialog>

      {lessonIdForComments && (
        <CommentsModal
          open={showCommentsModal}
          setOpen={setShowCommentsModal}
          lessonId={lessonIdForComments}
        />
      )}

      <CustomAlertDialog
        isOpen={showConfirmPublish}
        onClose={() => setShowConfirmPublish(false)}
        title={courseData.isActive ? "Hide Course" : "Publish Course"}
        description={
          courseData.isActive
            ? "Are you sure you want to hide this course? It will no longer be visible to students."
            : "Are you sure you want to publish this course? Once published, students will be able to view it."
        }
        confirmText={courseData.isActive ? "Hide" : "Publish"}
        cancelText="Cancel"
        variant="warning"
        onConfirm={async () => {
          const res = await MentorAPIMethods.publishCourse(courseData.id, !courseData.isActive);
          if (res.ok) {
            showInfoToast(courseData.isActive ? "Course hidden successfully!" : "Course published successfully!");
            setCourseData((prev) => prev ? { ...prev, isActive: !prev.isActive } : prev);
          } else {
            showErrorToast("Failed to update course visibility.");
          }
          setShowConfirmPublish(false);
        }}
        onCancel={() => setShowConfirmPublish(false)}
      />
    </div>
  );
}
