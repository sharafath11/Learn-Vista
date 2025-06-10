"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"
import { IQuestions } from "@/src/types/lessons"

interface MCQQuestionsProps {
  questions: IQuestions[]
  onComplete: (answers: { question: string; answer: string }[]) => void
  isCompleted: boolean
}

export default function MCQQuestions({
  questions,
  onComplete,
  isCompleted,
}: MCQQuestionsProps) {
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

  const handleOptionSelect = (option: string) => {
    setCurrentAnswer(option)
  }

  const handleSubmit = () => {
    if (!currentAnswer) return
    
    const updatedAnswers = [
      ...selectedAnswers.filter((a) => a.question !== currentQuestion.question),
      { question: currentQuestion.question, answer: currentAnswer },
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

  if (!currentQuestion) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No MCQ questions available for this lesson yet.
      </div>
    )
  }

  if (allQuestionsAnswered) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">All MCQ Questions Completed!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You've successfully completed all the MCQ questions for this lesson.
        </p>
        <Button onClick={() => setAllQuestionsAnswered(false)}>Review Questions</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">MCQ Questions</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="mb-4 p-4 border rounded bg-muted">
        <p className="text-lg font-medium">{currentQuestion.question}</p>
      </div>

      <div className="space-y-3 mb-6">
        {currentQuestion.options?.map((option, index) => (
          <div 
            key={index}
            className={`p-3 border rounded cursor-pointer transition-colors ${
              currentAnswer === option 
                ? 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => !isQuestionSubmitted && handleOptionSelect(option)}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                currentAnswer === option 
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-400'
              }`}>
                {String.fromCharCode(65 + index)}
              </div>
              <span>{option}</span>
            </div>
          </div>
        ))}
      </div>

      {isQuestionSubmitted && (
        <Alert className="mb-6 mt-4 border-green-500">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription>Your answer has been saved for this question.</AlertDescription>
          </div>
        </Alert>
      )}

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>

        {!isQuestionSubmitted ? (
          <Button onClick={handleSubmit} disabled={!currentAnswer}>
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