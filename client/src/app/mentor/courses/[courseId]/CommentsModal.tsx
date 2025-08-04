// src/app/mentor/courses/[courseId]/CommentsModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/src/components/shared/components/ui/dialog";
import { showErrorToast } from "@/src/utils/Toast";
import { MentorAPIMethods } from "@/src/services/APImethods";
import { formatDistanceToNow } from 'date-fns'; 
import { IComment } from "@/src/types/lessons";


interface CommentsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  lessonId: string;
}

export function CommentsModal({ open, setOpen, lessonId }: CommentsModalProps) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (open && lessonId) {
      fetchComments();
    } else {
      setComments([]);
      setNewComment("");
    }
  }, [open, lessonId]);

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
     
        const res = await MentorAPIMethods.getCommentsByLessonId(lessonId);
      if (res.ok) {
        setComments(res.data);
      } else {
        showErrorToast("Failed to fetch comments. Please try again.");
      }
    } catch (error) {
      showErrorToast("An unexpected error occurred while fetching comments.");
    } finally {
      setLoadingComments(false);
    }
  };

 
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] bg-gray-900 text-white border-gray-700 p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Lesson Comments</DialogTitle>
          <DialogDescription className="text-gray-400 mt-1">
            Read comments from other users or share your thoughts.
          </DialogDescription>
        </DialogHeader>

        {/* Comments Display Area */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar border-b border-gray-700 pb-4">
          {loadingComments ? (
            <p className="text-gray-400 text-center py-8">Loading comments...</p>
          ) : comments.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No comments yet. Be the first to start a discussion!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-blue-400 text-md">
                    {comment.userName || "Anonymous User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.createdAt||""), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-200 leading-relaxed">{comment.comment}</p>
              </div>
            ))
          )}
        </div>

        {/* Comment Input Area */}
        
      </DialogContent>
    </Dialog>
  );
}