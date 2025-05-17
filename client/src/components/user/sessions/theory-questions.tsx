"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle } from "lucide-react"
import { TheoryQuestion } from "@/src/types/lessons"

interface TheoryQuestionsProps {
  questions: TheoryQuestion[]
    onComplete: () => void
  isCompleted: boolean
}

export default function TheoryQuestions({ questions, onComplete, isCompleted }: TheoryQuestionsProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(Array(questions.length).fill(""))
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [allQuestionsAnswered, setAllQuestionsAnswered] = useState(isCompleted)

  const currentQuestion = questions[currentQuestionIndex]

  useEffect(() => {
    // Load saved answers from localStorage
    const savedAnswers = localStorage.getItem(`theory_answers_${questions[0].id}`)
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers))
    }

    setAllQuestionsAnswered(isCompleted)
  }, [questions, isCompleted])

  const handleAnswerSelect = (value: string) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = value
    setSelectedAnswers(newAnswers)

    // Save answers to localStorage
    localStorage.setItem(`theory_answers_${questions[0].id}`, JSON.stringify(newAnswers))
  }

  const handleSubmit = () => {
    const isAnswerCorrect = selectedAnswers[currentQuestionIndex] === currentQuestion.correctAnswer
    setIsCorrect(isAnswerCorrect)
    setIsSubmitted(true)
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setIsSubmitted(false)
      setShowExplanation(false)
    } else {
      // All questions completed
      setAllQuestionsAnswered(true)
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setIsSubmitted(false)
      setShowExplanation(false)
    }
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Theory Questions</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-4">{currentQuestion.question}</h4>

        <RadioGroup
          value={selectedAnswers[currentQuestionIndex]}
          onValueChange={handleAnswerSelect}
          className="space-y-3"
          disabled={isSubmitted}
        >
          {currentQuestion.options.map((option, index) => (
            <div key={index} className="flex items-start space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} className="mt-1" />
              <Label
                htmlFor={`option-${index}`}
                className={`${
                  isSubmitted && option === currentQuestion.correctAnswer
                    ? "text-green-600 dark:text-green-400 font-medium"
                    : isSubmitted &&
                        option === selectedAnswers[currentQuestionIndex] &&
                        option !== currentQuestion.correctAnswer
                      ? "text-red-600 dark:text-red-400"
                      : ""
                }`}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {isSubmitted && (
        <Alert
          className={`mb-6 ${isCorrect ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"}`}
        >
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            ) : (
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
            )}
            <AlertDescription
              className={isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}
            >
              {showExplanation && (
                <div>
                  <p className="font-medium mb-1">{isCorrect ? "Correct!" : "Incorrect"}</p>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          Previous
        </Button>

        {!isSubmitted ? (
          <Button onClick={handleSubmit} disabled={!selectedAnswers[currentQuestionIndex]}>
            Submit Answer
          </Button>
        ) : (
          <Button onClick={handleNext}>
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Complete"}
          </Button>
        )}
      </div>
    </div>
  )
}
