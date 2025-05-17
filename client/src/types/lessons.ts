export interface Level {
    id: number
    title: string
    description: string
    videoUrl: string
    duration: number // seconds
  }
  
  export interface Lesson {
    id: number
    title: string
    description: string
    duration: number // in minutes
    videoUrl: string
    thumbnailUrl?: string
    theoryQuestions: TheoryQuestion[]
    codingChallenge: CodingChallenge
    totalLessons: number
  }
  
  export interface TheoryQuestion {
    id: number
    question: string
    options: string[]
    correctAnswer: string
    explanation: string
  }
  
  export interface CodingChallenge {
    id: number
    title: string
    description: string
    language: string
    starterCode: string
    solutionKeyword: string
    hints?: string[]
  }
  