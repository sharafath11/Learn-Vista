"use client"

import type { ReactNode } from "react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/Tooltip"

interface UseTooltipProps {
  children: ReactNode
  content: string
  side?: "top" | "right" | "bottom" | "left"
  delayDuration?: number
}

export function WithTooltip({ children, content, side = "top", delayDuration = 300 }: UseTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
