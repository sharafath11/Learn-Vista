"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shared/components/ui/dialog";
import { Label } from "@/src/components/shared/components/ui/label";
import { Textarea } from "@/src/components/shared/components/ui/textarea";
import { Input } from "@/src/components/shared/components/ui/input";
import { BookOpen, Code, ListChecks } from "lucide-react";
import { Button } from "@/src/components/shared/components/ui/button";
import { useEffect, useState } from "react";
import { IQuestions, QuestionType } from "@/src/types/lessons";
import { showInfoToast } from "@/src/utils/Toast";
import { MentorAPIMethods } from "@/src/services/methods/mentor.api";

interface QuestionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: IQuestions | null;
  type: QuestionType;
  onSave: (data: Omit<IQuestions, "id" | "isCompleted" | "lessonId">) => void;
}

export function QuestionModal({
  open,
  onOpenChange,
  question,
  type,
  onSave,
}: QuestionModalProps) {
  const [formData, setFormData] = useState({
    question: "",
    options: [] as string[],
  });

  const [loadingOptions, setLoadingOptions] = useState(false);
  const MAX_OPTIONS = 6;

  useEffect(() => {
    if (question) {
      setFormData({
        question: question.question,
        options: question.options || [],
      });
    } else {
      setFormData({
        question: "",
        options: [],
      });
    }
  }, [question, open]);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...formData.options];
    updatedOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const addOption = () => {
    if (formData.options.length < MAX_OPTIONS) {
      setFormData((prev) => ({ ...prev, options: [...prev.options, ""] }));
    }
  };

  const removeOption = (index: number) => {
    const updatedOptions = formData.options.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, options: updatedOptions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.question.trim()) return;

    const data: Omit<IQuestions, "id" | "isCompleted" | "lessonId"> = {
      question: formData.question.trim(),
      type,
    };

    if (type === "mcq") {
      const filteredOptions = formData.options.filter((opt) => opt.trim());
      if (filteredOptions.length < 2) {
        showInfoToast("Please provide at least two valid options.");
        return;
      }
      data.options = filteredOptions;
    }

    onSave(data);
    setFormData({ question: "", options: [] });
  };

  const handleGenerateOptions = async () => {
    if (!formData.question.trim()) {
      showInfoToast("Please enter a question first.");
      return;
    }

    setLoadingOptions(true);

    const res = await MentorAPIMethods.generateOptions(formData.question.trim());
     setLoadingOptions(false);
    if (!res.ok ) {
      showInfoToast(res.msg);
     
      return;
    }

    const data = await res.data;

    if (!Array.isArray(data)) {
      showInfoToast("Invalid option format received from server.");
      setLoadingOptions(false);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      options: data.filter((opt) => opt.trim()),
    }));

    setLoadingOptions(false);
  };

  const isEditing = !!question;

  const Icon =
    type === "theory" ? BookOpen : type === "practical" ? Code : ListChecks;

  const isValidMCQ = () =>
    formData.question.trim() &&
    formData.options.filter((opt) => opt.trim()).length >= 2;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {isEditing ? "Edit" : "Create"}{" "}
            {type === "theory"
              ? "Theory"
              : type === "practical"
              ? "Practical"
              : "MCQ"}{" "}
            Question
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? `Update the ${type} question details below.`
              : `Create a new ${type} question for students.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder={`Enter your ${type} question here...`}
              value={formData.question}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  question: e.target.value,
                }))
              }
              className="min-h-[100px]"
              required
              autoFocus
            />
          </div>

          {/* Options - only for MCQ */}
          {type === "mcq" && (
            <div className="space-y-2">
              <Label>Options</Label>
              {formData.options.map((opt, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(index, e.target.value)
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeOption(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  disabled={formData.options.length >= MAX_OPTIONS}
                >
                  + Add Option
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleGenerateOptions}
                  disabled={loadingOptions}
                >
                  {loadingOptions ? "Generating..." : "🎲 Generate Random Options"}
                </Button>
              </div>
            </div>
          )}

          {/* Footer */}
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loadingOptions ||
                (type === "mcq" ? !isValidMCQ() : !formData.question.trim())
              }
            >
              {isEditing ? "Update Question" : "Create Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
