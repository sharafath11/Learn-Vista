"use client"

import { useState, useEffect } from "react"
import { Button } from "@/src/components/shared/components/ui/button"
import { Alert, AlertDescription } from "@/src/components/shared/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { ITheoryQuestionsProps } from "@/src/types/userProps"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

export default function TheoryQuestions({
  questions,
  onComplete,
  isCompleted,
}: ITheoryQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<{ question: string; answer: string }[]>([])
  const [currentAnswer, setCurrentAnswer] = useState("")
  const [isQuestionSubmitted, setIsQuestionSubmitted] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(isCompleted)

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    setAllQuestionsAnswered(isCompleted)
  }, [isCompleted])

  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = selectedAnswers.find((a) => a.question === currentQuestion.question)
      if (savedAnswer) {
        setCurrentAnswer(savedAnswer.answer)
        setIsQuestionSubmitted(true)
      } else {
        setCurrentAnswer("")
        setIsQuestionSubmitted(false)
      }
    }
  }, [currentQuestionIndex, currentQuestion, selectedAnswers])

  const handleSubmit = () => {
    const updatedAnswers = [
      ...selectedAnswers.filter((a) => a.question !== currentQuestion.question),
      { question: currentQuestion.question, answer: currentAnswer.trim() },
    ]
    setSelectedAnswers(updatedAnswers)
    setIsQuestionSubmitted(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setAllQuestionsAnswered(true)
      onComplete(selectedAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const isAnswerValid =
    currentAnswer.trim().length >= 10 && currentAnswer.trim().length <= 1000

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
          {`You've successfully completed all the theory questions for this lesson.`}
        </p>
        <WithTooltip content="Review all the questions again">
          <Button onClick={() => setAllQuestionsAnswered(false)}>Review Questions</Button>
        </WithTooltip>
      </div>
    )
  }

  return (
    <div>
      {/* Header with tooltip */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Theory Questions</h3>
        <WithTooltip content={`Question ${currentQuestionIndex + 1} of ${questions.length}`}>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </WithTooltip>
      </div>

      {/* Question text */}
      <div className="mb-4 p-4 border rounded bg-muted">
        <p className="text-lg font-medium">{currentQuestion.question}</p>
      </div>

      {/* Textarea with tooltip */}
      <WithTooltip content="Write your detailed answer here">
        <textarea
          rows={6}
          className="w-full p-3 border rounded bg-background text-foreground"
          placeholder="Write your answer here..."
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          disabled={isQuestionSubmitted}
          maxLength={1000}
        />
      </WithTooltip>

      <div className="text-sm text-gray-500 mt-2">
        {currentAnswer.trim().length} / 1000 characters
      </div>

      {!isAnswerValid && currentAnswer.trim().length > 0 && (
        <div className="text-sm text-red-500 mt-1">
          {currentAnswer.trim().length < 10
            ? "Answer must be at least 10 characters."
            : "Answer must not exceed 1000 characters."}
        </div>
      )}

      {isQuestionSubmitted && (
        <Alert className="mb-6 mt-4 border-green-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>Your answer has been saved for this question.</AlertDescription>
          </div>
        </Alert>
      )}

      {/* Navigation buttons with tooltips */}
      <div className="flex justify-between mt-6">
        <WithTooltip content="Go to previous question">
          <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
        </WithTooltip>

        {!isQuestionSubmitted ? (
          <WithTooltip content="Save your answer and mark this question as complete">
            <Button onClick={handleSubmit} disabled={!isAnswerValid}>
              Mark as Complete
            </Button>
          </WithTooltip>
        ) : (
          <WithTooltip content="Go to next question or finish">
            <Button onClick={handleNext}>
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish"}
            </Button>
          </WithTooltip>
        )}
      </div>
    </div>
  )
}
