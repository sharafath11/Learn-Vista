"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { IQuestions } from "@/src/types/lessons"

interface TheoryQuestionsProps {
  questions: IQuestions[]
  onComplete: (answers: { questionId: string; answer: string }[]) => void
  isCompleted: boolean
}

export default function TheoryQuestions({
  questions,
  onComplete,
  isCompleted
}: TheoryQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ questionId: string; answer: string }[]>([])
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(isCompleted)

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    setAllQuestionsAnswered(isCompleted)
  }, [isCompleted])

  // Reset submission status when question changes
  useEffect(() => {
    setIsQuestionSubmitted(false)
  }, [currentQuestionIndex])

  const handleAnswerChange = (value: string) => {
    if (value.length > 1000) return // limit input length

    const newAnswers = [
      ...selectedAnswers.filter(a => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, answer: value }
    ]
    setSelectedAnswers(newAnswers)
  }

  const handleSubmit = () => {
    setIsQuestionSubmitted(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setIsQuestionSubmitted(false)
    } else {
      setAllQuestionsAnswered(true)
      onComplete(selectedAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setIsQuestionSubmitted(false)
    }
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No theory questions available for this lesson yet.
      </div>
    )
  }

  if (allQuestionsAnswered) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">All Questions Completed!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You've successfully completed all the theory questions for this lesson.
        </p>
        <Button onClick={() => setAllQuestionsAnswered(false)}>Review Questions</Button>
      </div>
    )
  }

  const currentAnswer = selectedAnswers.find(a => a.questionId === currentQuestion.id)?.answer || ""
  const trimmedLength = currentAnswer.trim().length
  const isValid = trimmedLength >= 1 && trimmedLength <= 1000

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Theory Questions</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="mb-4 p-4 border rounded bg-muted">
        <p className="text-lg font-medium mb-2">{currentQuestion.question}</p>
        <textarea
          className="w-full p-2 border rounded min-h-[150px]"
          placeholder="Type your answer here..."
          value={currentAnswer}
          onChange={(e) => handleAnswerChange(e.target.value)}
          disabled={isQuestionSubmitted}
          maxLength={1000}
        />
        <div className="text-right text-xs text-gray-500 mt-1">
          {currentAnswer.length} / 1000 characters
        </div>
      </div>

      {isQuestionSubmitted && (
        <Alert className="mb-6 border-green-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>Your answer has been saved for this question.</AlertDescription>
          </div>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>

        {!isQuestionSubmitted ? (
          <Button onClick={handleSubmit} disabled={!isValid}>
            Mark as Complete
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish"}
          </Button>
        )}
      </div>
    </div>
  )
}
