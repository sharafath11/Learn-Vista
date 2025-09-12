import { cn } from "@/lib/utils"
import { ILevelNavigationProps } from "@/src/types/userProps"
import { WithTooltip } from "@/src/hooks/UseTooltipProps"

export default function LevelNavigation({
  levels,
  currentLevelId,
  completedLevels,
  onLevelSelect,
  isLevelUnlocked,
}: ILevelNavigationProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Levels</h2>
      <ul className="space-y-2">
        {levels.map((level) => {
          const isCompleted = completedLevels.includes(level.id)
          const isUnlocked = isLevelUnlocked(level.id)
          const isCurrent = currentLevelId === level.id

          return (
            <li key={level.id}>
              <WithTooltip content={`Level ${level.id}: ${level.title}`}>
                <button
                  onClick={() => isUnlocked && onLevelSelect(level.id)}
                  disabled={!isUnlocked}
                  className={cn(
                    "w-full text-left px-4 py-3 rounded-md transition-all duration-200 flex items-center",
                    isUnlocked ? "hover:bg-gray-100 dark:hover:bg-gray-700" : "opacity-60 cursor-not-allowed",
                    isCurrent ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500" : "",
                    isCompleted ? "text-green-700 dark:text-green-400" : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  <div className="flex-shrink-0 mr-3">
                    {isCompleted ? (
                      <WithTooltip content="Completed">
                        <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-green-600 dark:text-green-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </WithTooltip>
                    ) : isUnlocked ? (
                      <WithTooltip content="Unlocked">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">{level.id}</span>
                        </div>
                      </WithTooltip>
                    ) : (
                      <WithTooltip content="Locked">
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 dark:text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </WithTooltip>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      Level {level.id}: {level.title}
                    </div>
                    <WithTooltip content={`Exact duration: ${formatDuration(level.duration)}`}>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{formatDuration(level.duration)}</div>
                    </WithTooltip>
                  </div>
                </button>
              </WithTooltip>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
}
