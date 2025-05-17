interface ProgressBarProps {
    totalLevels: number
    completedLevels: number
  }
  
  export default function ProgressBar({ totalLevels, completedLevels }: ProgressBarProps) {
    const progressPercentage = (completedLevels / totalLevels) * 100
  
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Your Progress</span>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {completedLevels} of {totalLevels} levels completed
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    )
  }
  