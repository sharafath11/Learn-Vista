"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, RefreshCw, Trophy, Clock, Target, Loader2, AlertTriangle } from "lucide-react"
import { Card } from "@/src/components/shared/components/ui/card"
import { Button } from "@/src/components/shared/components/ui/button"
import { Badge } from "@/src/components/shared/components/ui/badge"
import { UserAPIMethods } from "@/src/services/APImethods"
import { showErrorToast } from "@/src/utils/Toast"

interface Question {
  id?: number
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function LetsFunPSC() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(false)
  const [apiUnavailable, setApiUnavailable] = useState(false)

  useEffect(() => {
    loadQuestion(currentQuestionIndex)
  }, [currentQuestionIndex])

  const loadQuestion = async (index: number) => {
    setLoading(true)
    setApiUnavailable(false)

    try {
      const res = await UserAPIMethods.psc(index)

      if (res.ok && typeof res.data === "string") {
        const rawJson = res.data
          .trim()
          .replace(/^```json\n/, "")
          .replace(/\n```$/, "")
        const parsed = JSON.parse(rawJson)

        setCurrentQuestion({
          id: index,
          question: parsed.question,
          options: parsed.options,
          correctAnswer: parsed.correctAnswer,
          explanation: parsed.explanation,
        })
      } else {
        throw new Error("API Error")
      }
    } catch (error) {
      setApiUnavailable(true)
      showErrorToast("Service temporarily unavailable")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || !currentQuestion) return

    setSelectedAnswer(answerIndex)
    setShowResult(true)
    setAnsweredQuestions((prev) => prev + 1)

    if (answerIndex === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleTryAgain = () => {
    const randomIndex = Math.floor(Math.random() * 1000)
    setCurrentQuestionIndex(randomIndex)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  const handleRetry = () => {
    loadQuestion(currentQuestionIndex)
  }

  const isCorrect = currentQuestion && selectedAnswer === currentQuestion.correctAnswer

  // Loading State
  if (loading && !currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-md">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Loading Question...</h3>
          <p className="text-gray-600">Please wait while we fetch your PSC question</p>
        </Card>
      </div>
    )
  }

  // API Unavailable State
  if (apiUnavailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-md">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Service Temporarily Unavailable</h3>
          <p className="text-gray-600 mb-6">
            Our question service is currently experiencing high traffic. Please try again in a few moments.
          </p>
          <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 w-full">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  // No Question State
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-xl max-w-md">
          <XCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Unable to Load Question</h3>
          <p className="text-gray-600 mb-4">Something went wrong while loading the question</p>
          <Button onClick={handleRetry} className="bg-blue-600 hover:bg-blue-700 w-full">
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Let's Fun PSC
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Test your knowledge with PSC practice questions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Score</span>
            </div>
            <p className="text-2xl font-bold text-green-600">
              {score}/{answeredQuestions}
            </p>
          </Card>

          <Card className="p-4 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Questions</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">{answeredQuestions}</p>
          </Card>

          <Card className="p-4 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Accuracy</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">
              {answeredQuestions > 0 ? Math.round((score / answeredQuestions) * 100) : 0}%
            </p>
          </Card>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id || currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm border-0 shadow-xl relative">
              {loading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                  <div className="text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                    <p className="text-sm text-gray-600">Loading next question...</p>
                  </div>
                </div>
              )}

              {/* Question */}
              <div className="mb-8">
                <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
                  Question #{currentQuestionIndex + 1}
                </Badge>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null || loading}
                    whileHover={{ scale: selectedAnswer === null && !loading ? 1.02 : 1 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      selectedAnswer === null
                        ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50 bg-white"
                        : selectedAnswer === index
                          ? index === currentQuestion.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-800"
                            : "border-red-500 bg-red-50 text-red-800"
                          : index === currentQuestion.correctAnswer
                            ? "border-green-500 bg-green-50 text-green-800"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                    } ${selectedAnswer !== null || loading ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold ${
                          selectedAnswer === null
                            ? "border-gray-300 text-gray-500"
                            : selectedAnswer === index
                              ? index === currentQuestion.correctAnswer
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-red-500 bg-red-500 text-white"
                              : index === currentQuestion.correctAnswer
                                ? "border-green-500 bg-green-500 text-white"
                                : "border-gray-300 text-gray-400"
                        }`}
                      >
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="text-base sm:text-lg">{option}</span>
                      {selectedAnswer !== null && (
                        <div className="ml-auto">
                          {index === currentQuestion.correctAnswer ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : selectedAnswer === index ? (
                            <XCircle className="w-6 h-6 text-red-600" />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Result Feedback */}
              <AnimatePresence>
                {showResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`p-4 rounded-xl mb-6 ${
                      isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className={`font-semibold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                        {isCorrect ? "🎉 Correct!" : "❌ Wrong Answer"}
                      </span>
                    </div>
                    <p className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {showResult && (
                  <>
                    <Button
                      onClick={handleNextQuestion}
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                    >
                      Next Question
                    </Button>
                    <Button
                      onClick={handleTryAgain}
                      disabled={loading}
                      variant="outline"
                      className="flex-1 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 py-3 rounded-xl font-semibold transition-all duration-200 bg-transparent disabled:opacity-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Try Another Question
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Practice makes perfect! Keep learning and improving your PSC knowledge.</p>
        </div>
      </div>
    </div>
  )
}
