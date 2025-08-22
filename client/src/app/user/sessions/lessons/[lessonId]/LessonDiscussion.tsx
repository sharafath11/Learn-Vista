// components/user/sessions/LessonDiscussion.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from "@/src/components/shared/components/ui/textarea";
import { Button } from "@/src/components/shared/components/ui/button";
import { format } from "date-fns";
import { IComment } from "@/src/types/lessons"; 

interface LessonDiscussionProps {
  comments: IComment[];
  videoCompleted: boolean;
  onAddComment: (comment: string) => Promise<void>;
}

const LessonDiscussion: React.FC<LessonDiscussionProps> = ({
  comments,
  videoCompleted,
  onAddComment,
}) => {
  const [commentInput, setCommentInput] = useState("");
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  const handlePostComment = async () => {
    if (commentInput.trim()) {
      await onAddComment(commentInput);
      setCommentInput("");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-6">
      <h3 className="text-xl font-bold mb-4">Discussion</h3>
      <div className="max-h-60 overflow-y-auto mb-4 space-y-4 pr-2">
        {comments.length > 0 ? (
          comments.map((commentItem) => (
            <div key={commentItem.createdAt?.toString()||commentItem.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm">{commentItem.userName}</span>
                <span className="text-xs text-gray-500">
                  {commentItem.createdAt ? format(new Date(commentItem.createdAt), "MMM d, h:mm a") : ""}
                </span>
              </div>
              <p className="text-gray-800 dark:text-gray-200 text-sm">{commentItem.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
        )}
        <div ref={commentsEndRef} />
      </div>
      {videoCompleted && (
        <div className="flex gap-2">
          <Textarea
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Share your thoughts about this video..."
            className="flex-1"
          />
          <Button onClick={handlePostComment} disabled={!commentInput.trim()}>
            Post
          </Button>
        </div>
      )}
    </div>
  );
};

export default LessonDiscussion;