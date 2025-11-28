"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Trophy,
  Clock,
  Target,
  Loader2,
  AlertTriangle,
} from "lucide-react";

import { Card } from "@/src/components/shared/components/ui/card";
import { Button } from "@/src/components/shared/components/ui/button";
import { Badge } from "@/src/components/shared/components/ui/badge";
import { UserAPIMethods } from "@/src/services/methods/user.api";
import { showErrorToast } from "@/src/utils/Toast";
import { IQuestion, PSCCheckResponse } from "@/src/types/lessons";
import { WithTooltip } from "@/src/hooks/UseTooltipProps";
import { PscLoading } from "./PscLoading";

export default function LetsFunPSC() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion | null>(null);

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [checkResult, setCheckResult] = useState<PSCCheckResponse | null>(null);

  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);

  const [loading, setLoading] = useState(false);
  const [apiUnavailable, setApiUnavailable] = useState(false);

  useEffect(() => {
    loadQuestion(currentQuestionIndex);
  }, [currentQuestionIndex]);

  const loadQuestion = async (index: number) => {
    setLoading(true);
    setApiUnavailable(false);
    setCheckResult(null);
    setSelectedAnswer(null);

    try {
      const res = await UserAPIMethods.psc(index);

      if (res.ok) {
        setCurrentQuestion(res.data);
      } else {
        throw new Error("API Error");
      }
    } catch {
      setApiUnavailable(true);
      showErrorToast("Service temporarily unavailable");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = async (answerIndex: number) => {
    if (!currentQuestion || selectedAnswer !== null) return;

    setSelectedAnswer(answerIndex);

    try {
      const res = await UserAPIMethods.checkPSCAnswer({
        questionId: currentQuestion.id||0,
        selectedOption: answerIndex,
      });

      if (!res.ok) throw new Error("Check failed");

      const data: PSCCheckResponse = res.data;
      setCheckResult(data);

      setShowResult(true);
      setAnsweredQuestions((prev) => prev + 1);
      if (data.isCorrect) setScore((prev) => prev + 1);
    } catch {
      showErrorToast("Failed to check answer");
    }
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowResult(false);
    setCheckResult(null);
  };

  const handleTryAgain = () => {
    const randomIndex = Math.floor(Math.random() * 1000);
    setCurrentQuestionIndex(randomIndex);
    setSelectedAnswer(null);
    setShowResult(false);
    setCheckResult(null);
  };

  const handleRetry = () => loadQuestion(currentQuestionIndex);

  const isCorrect = checkResult?.isCorrect;
  if (loading && !currentQuestion) {
  return <PscLoading />;
}

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
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">

        {/* ---------- SCORE CARDS ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Target className="w-5 h-5 mx-auto text-green-600" />
            <p className="text-2xl font-bold text-green-600">{score}/{answeredQuestions}</p>
          </Card>

          <Card className="p-4 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Clock className="w-5 h-5 mx-auto text-blue-600" />
            <p className="text-2xl font-bold text-blue-600">{answeredQuestions}</p>
          </Card>

          <Card className="p-4 text-center bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <Trophy className="w-5 h-5 mx-auto text-purple-600" />
            <p className="text-2xl font-bold text-purple-600">
              {answeredQuestions > 0 ? Math.round((score / answeredQuestions) * 100) : 0}%
            </p>
          </Card>
        </div>

        {/* ---------- QUESTION CARD ---------- */}
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
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              )}

              <div className="mb-8">
                <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
                  Question #{currentQuestionIndex + 1}
                </Badge>

                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 leading-relaxed">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* ---------- OPTIONS ---------- */}
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const isCorrectOption = checkResult?.correctAnswer === index;
                  const isSelected = selectedAnswer === index;

                  let border = "border-gray-200";
                  let bg = "bg-white";
                  let text = "text-gray-800";

                  if (selectedAnswer !== null) {
                    if (isCorrectOption) {
                      border = "border-green-500";
                      bg = "bg-green-50";
                      text = "text-green-800";
                    } else if (isSelected) {
                      border = "border-red-500";
                      bg = "bg-red-50";
                      text = "text-red-800";
                    } else {
                      bg = "bg-gray-50";
                      text = "text-gray-500";
                    }
                  }

                  return (
                    <motion.button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null}
                      whileHover={{ scale: selectedAnswer === null ? 1.02 : 1 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${border} ${bg} ${text}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-semibold">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-base sm:text-lg">{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* ---------- RESULT BOX ---------- */}
              {showResult && checkResult && (
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
                    {checkResult.explanation}
                  </p>
                </motion.div>
              )}

              {/* ---------- ACTION BUTTONS ---------- */}
              {showResult && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleNextQuestion}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold"
                  >
                    Next Question
                  </Button>

                  <Button
                    onClick={handleTryAgain}
                    disabled={loading}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 py-3 rounded-xl font-semibold"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Another Question
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-8 text-gray-500">
          <p className="text-sm">Practice makes perfect! Keep learning and improving your PSC knowledge.</p>
        </div>
      </div>
    </div>
  );
}
