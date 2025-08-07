"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { IComment, ILessons, IQuestions } from "@/src/types/lessons";
import { AdminAPIMethods } from "@/src/services/methods/admin.api";
import { showErrorToast } from "@/src/utils/Toast";

import LessonModal from "./LessonModal";
import { Button } from "@/src/components/shared/components/ui/button";
import VideoPreviewModal from "@/src/components/VideoPreviewModal";

export default function AdminSessionPage() {
  const [lessons, setLessons] = useState<ILessons[]>([]);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState<IComment[]>([]);
  const [questions, setQuestions] = useState<IQuestions[]>([]);
  const [modalData, setModalData] = useState({
    open: false,
    type: null as "comments" | "questions" | null,
    lesson: null as ILessons | null,
  });
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const router = useRouter();
  const { courseId } = useParams();

  useEffect(() => {
    if (!courseId) return;

    const getLessons = async () => {
      setLoading(true);
      const res = await AdminAPIMethods.getLesson(courseId as string);
      if (res.ok && res.data) {
        setLessons(res.data.lessons || []);
        setComments(res.data.comments || []);
        setQuestions(res.data.questions || []);
      } else {
        showErrorToast(res.msg);
      }
      setLoading(false);
    };

    getLessons();
  }, [courseId]);
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans antialiased text-gray-800">
      <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/dashboard/courses")}
          className="flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-left"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Back to Courses
        </Button>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center items-center h-48 text-gray-500">
            <svg
              className="animate-spin w-6 h-6 mr-2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Loading lessons...
          </div>
        ) : lessons.length === 0 ? (
          <p className="text-center text-gray-500 p-12">No lessons found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="border bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
              >
                <div
                  className="relative w-full aspect-video cursor-pointer group"
                  onClick={() => setVideoPreview(lesson.videoUrl)}
                >
                  <Image
                    src={lesson.thumbnail || ""}
                    alt={lesson.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                    unoptimized
                  />

                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-30 group-hover:bg-opacity-50 transition-opacity duration-300">
                    <svg
                      className="w-14 h-14 text-white opacity-90 group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-bold text-lg mb-1 line-clamp-2">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {lesson.description || "No description provided."}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() =>
                        setModalData({ open: true, type: "comments", lesson })
                      }
                      className="flex-1"
                    >
                      Comments
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setModalData({ open: true, type: "questions", lesson })
                      }
                      className="flex-1"
                    >
                      Questions
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {videoPreview && (
        <VideoPreviewModal
          open={!!videoPreview}
          onClose={() => setVideoPreview(null)}
          videoUrl={videoPreview}
        />
      )}
      <LessonModal
        open={modalData.open}
        onClose={() => setModalData({ open: false, type: null, lesson: null })}
        type={modalData.type}
        lesson={modalData.lesson}
        comments={comments}
        questions={questions}
      />
    </div>
  );
}
