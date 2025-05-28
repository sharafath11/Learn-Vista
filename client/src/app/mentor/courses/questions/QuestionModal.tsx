"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IQuestions, qustionType } from "@/src/types/lessons";

interface QuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: IQuestions | null;
  type: qustionType;
  onSave: (question: Omit<IQuestions, "id" | "isCompleted" | "lessonId">) => void;
}

export function QuestionModal({ open, onOpenChange, question, type, onSave }: QuestionModalProps) {
  const [formData, setFormData] = useState({
    question: "",
  });

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
      });
    } else {
      setFormData({
        question: "",
      });
    }
  }, [question, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.question.trim()) {
      onSave({
        question: formData.question,
        type: type,
      });
      setFormData({ question: "" });
    }
  };

  const isEditing = !!question;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "theory" ? <BookOpen className="w-5 h-5" /> : <Code className="w-5 h-5" />}
            {isEditing ? "Edit" : "Create"} {type === "theory" ? "Theory" : "Practical"} Question
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update the ${type} question details below.`
              : `Create a new ${type} question for students to work on.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question" className="text-sm font-medium">
              Question
            </Label>
            <Textarea
              id="question"
              placeholder={`Enter your ${type} question here...`}
              value={formData.question}
              onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
              className="min-h-[120px] resize-none"
              required
            />
            <p className="text-xs text-slate-500">
              {type === "theory"
                ? "Write a theoretical question that tests understanding of concepts."
                : "Write a practical question that requires hands-on implementation or coding."}
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.question.trim()}>
              {isEditing ? "Update Question" : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}