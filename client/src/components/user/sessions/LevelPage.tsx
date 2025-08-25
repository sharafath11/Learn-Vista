// "use client"

// import { Level } from "@/src/types/lessons"
// import { useState, useEffect } from "react"
// import ProgressBar from "./progress-bar"
// import LevelNavigation from "./LevelNavigation"
// import VideoPlayer from "./video-player"

// const LEVELS: Level[] = [
//   {
//     id: 1,
//     title: "Getting Started",
//     description: "Learn the basics and get familiar with the core concepts.",
//     videoUrl: "/videos/level-1.mp4",
//     duration: 60, 
//   },
//   {
//     id: 2,
//     title: "Intermediate Techniques",
//     description: "Dive deeper into more advanced techniques and strategies.",
//     videoUrl: "/videos/level-2.mp4",
//     duration: 90,
//   },
//   {
//     id: 3,
//     title: "Advanced Concepts",
//     description: "Master the advanced concepts and become an expert.",
//     videoUrl: "/videos/level-3.mp4",
//     duration: 120,
//   },
//   {
//     id: 4,
//     title: "Final Challenge",
//     description: "Put your skills to the test with this challenging final level.",
//     videoUrl: "/videos/level-4.mp4",
//     duration: 150,
//   },
// ]

// export default function LevelPage() {
//   const [completedLevels, setCompletedLevels] = useState<number[]>([])
//   const [currentLevelId, setCurrentLevelId] = useState<number>(1)
//   const currentLevel = LEVELS.find((level) => level.id === currentLevelId) || LEVELS[0]

//   // Load saved progress from localStorage on component mount
//   useEffect(() => {
//     const savedProgress = localStorage.getItem("levelProgress")
//     if (savedProgress) {
//       try {
//         const { completed, current } = JSON.parse(savedProgress)
//         setCompletedLevels(completed)
//         setCurrentLevelId(current)
//       } catch (error) {
//         console.error("Failed to parse saved progress:", error)
//       }
//     }
//   }, [])

//   // Save progress to localStorage whenever it changes
//   useEffect(() => {
//     localStorage.setItem(
//       "levelProgress",
//       JSON.stringify({
//         completed: completedLevels,
//         current: currentLevelId,
//       }),
//     )
//   }, [completedLevels, currentLevelId])

//   const handleLevelComplete = (levelId: number) => {
//     if (!completedLevels.includes(levelId)) {
//       setCompletedLevels((prev) => [...prev, levelId])
//     }
//   }

//   const handleLevelSelect = (levelId: number) => {
//     // Only allow selecting a level if it's the first level or if the previous level is completed
//     if (levelId === 1 || completedLevels.includes(levelId - 1)) {
//       setCurrentLevelId(levelId)
//     }
//   }

//   const isLevelUnlocked = (levelId: number) => {
//     return levelId === 1 || completedLevels.includes(levelId - 1)
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-4xl">
//       <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">Learning Journey</h1>

//       <ProgressBar totalLevels={LEVELS.length} completedLevels={completedLevels.length} />

//       <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
//         <div className="md:col-span-1">
//           <LevelNavigation
//             levels={LEVELS}
//             currentLevelId={currentLevelId}
//             completedLevels={completedLevels}
//             onLevelSelect={handleLevelSelect}
//             isLevelUnlocked={isLevelUnlocked}
//           />
//         </div>

//         <div className="md:col-span-3 space-y-6">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300">
//             <VideoPlayer
//               level={currentLevel}
//               onComplete={() => handleLevelComplete(currentLevel.id)}
//               isCompleted={completedLevels.includes(currentLevel.id)}
//             />

//             <div className="p-6">
//               <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
//                 Level {currentLevel.id}: {currentLevel.title}
//               </h2>
//               <p className="text-gray-600 dark:text-gray-300">{currentLevel.description}</p>

//               {completedLevels.includes(currentLevel.id) && (
//                 <div className="mt-4 flex items-center text-green-600 dark:text-green-400">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     className="h-5 w-5 mr-2"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <span>Completed</span>
//                 </div>
//               )}

//               {currentLevel.id < LEVELS.length && (
//                 <div className="mt-6">
//                   {completedLevels.includes(currentLevel.id) ? (
//                     <button
//                       onClick={() => handleLevelSelect(currentLevel.id + 1)}
//                       className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                     >
//                       Continue to Level {currentLevel.id + 1}
//                     </button>
//                   ) : (
//                     <p className="text-amber-600 dark:text-amber-400 italic">
//                       Complete this level to unlock the next one
//                     </p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
