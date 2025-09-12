import { ReactNode } from "react"

export interface UseTooltipProps {
  children: ReactNode
  content: string
  side?: "top" | "right" | "bottom" | "left"
  delayDuration?: number
}
