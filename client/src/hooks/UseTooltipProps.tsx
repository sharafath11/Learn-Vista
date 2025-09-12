"use client"

import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/Tooltip"
import { UseTooltipProps } from "../types/toolTip"

export function WithTooltip({
  children,
  content,
  side = "top",
  delayDuration = 300,
  className,
}: UseTooltipProps & { className?: string }) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          className={cn(
            "rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white shadow-lg",
            // ✅ Only fade in/out (no zoom pop effect)
            "animate-in fade-in-0 animate-out fade-out-0",
            "transition-all duration-200 ease-out",
            className
          )}
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
