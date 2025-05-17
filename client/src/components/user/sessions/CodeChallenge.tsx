"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, XCircle, Play, Code, RefreshCw } from "lucide-react"
import { CodingChallenge } from "@/src/types/lessons"

interface CodeChallengeProps {
  challenge: CodingChallenge
  onComplete: () => void
  isCompleted: boolean
}

export default function CodeChallenge({ challenge, onComplete, isCompleted }: CodeChallengeProps) {
  const [code, setCode] = useState(challenge.starterCode)
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [completed, setCompleted] = useState(isCompleted)

  useEffect(() => {
    // Load saved code from localStorage
    const savedCode = localStorage.getItem(`code_challenge_${challenge.id}`)
    if (savedCode) {
      setCode(savedCode)
    }

    setCompleted(isCompleted)
  }, [challenge.id, isCompleted])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
    // Save code to localStorage
    localStorage.setItem(`code_challenge_${challenge.id}`, e.target.value)
  }

  const runCode = () => {
    setIsRunning(true)
    setOutput("")

    // Simulate code execution
    setTimeout(() => {
      try {
        // Create a safe evaluation environment
        const originalConsoleLog = console.log
        const logs: string[] = []

        // Override console.log to capture output
        console.log = (...args) => {
          logs.push(args.map((arg) => String(arg)).join(" "))
        }

        // Execute the code
        // Note: In a real implementation, you would use a sandboxed environment
        // or send the code to a backend service for execution
        const result = new Function(code)()

        // Restore console.log
        console.log = originalConsoleLog

        setOutput(logs.join("\n") || String(result) || "Code executed successfully, but produced no output.")
      } catch (error) {
        if (error instanceof Error) {
          setOutput(`Error: ${error.message}`)
        } else {
          setOutput("An unknown error occurred")
        }
      } finally {
        setIsRunning(false)
      }
    }, 1000)
  }

  const submitCode = () => {
    setIsRunning(true)
    setIsSubmitted(true)

    // Simulate code checking
    setTimeout(() => {
      // In a real implementation, you would send the code to a backend service
      // for validation against test cases
      const passesTests = code.includes(challenge.solutionKeyword)
      setIsCorrect(passesTests)

      if (passesTests) {
        setCompleted(true)
        onComplete()
      }

      setIsRunning(false)
    }, 1500)
  }

  const resetCode = () => {
    if (window.confirm("Are you sure you want to reset your code to the starter code?")) {
      setCode(challenge.starterCode)
      localStorage.setItem(`code_challenge_${challenge.id}`, challenge.starterCode)
      setOutput("")
      setIsSubmitted(false)
    }
  }

  if (completed && !isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h3 className="text-xl font-bold mb-2">Challenge Completed!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          You've successfully completed the coding challenge for this lesson.
        </p>
        <Button onClick={() => setIsSubmitted(true)}>Review Your Solution</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Coding Challenge</h3>
        <Button variant="outline" size="sm" onClick={resetCode} className="flex items-center gap-1">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-medium mb-2">{challenge.title}</h4>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{challenge.description}</p>

        {challenge.hints && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4 mb-4">
            <h5 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Hints:</h5>
            <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
              {challenge.hints.map((hint, index) => (
                <li key={index}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Code className="h-4 w-4" />
              <span>Code Editor</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">{challenge.language}</div>
          </div>

          <div className="relative border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <textarea
              value={code}
              onChange={handleCodeChange}
              className="w-full h-64 p-4 font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:outline-none"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            <span>Output</span>
          </div>

          <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
            <div className="h-64 p-4 font-mono text-sm bg-black text-green-400 overflow-auto whitespace-pre-wrap">
              {isRunning ? "Running code..." : output || "// Output will appear here"}
            </div>
          </div>
        </div>
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
              {isCorrect ? (
                <div>
                  <p className="font-medium mb-1">Great job! Your solution is correct.</p>
                  <p>You've successfully completed this coding challenge.</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium mb-1">Your solution doesn't pass all tests yet.</p>
                  <p>Try again and make sure your code meets all the requirements.</p>
                </div>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={runCode} disabled={isRunning} className="flex items-center gap-2">
          <Play className="h-4 w-4" />
          Run Code
        </Button>

        <Button onClick={submitCode} disabled={isRunning || !code.trim()} className="flex-1">
          {isRunning ? "Checking..." : "Submit Solution"}
        </Button>
      </div>
    </div>
  )
}
