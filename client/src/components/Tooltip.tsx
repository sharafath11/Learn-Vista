"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      // Base styles with premium glassmorphism effect
      "z-50 overflow-hidden rounded-xl backdrop-blur-xl bg-white/10 dark:bg-black/20",
      "border border-white/20 dark:border-white/10 shadow-2xl shadow-black/25",

      // Premium typography and spacing
      "px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white",
      "max-w-xs leading-relaxed",

      // Sophisticated gradient overlay
      "before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/20 before:to-transparent before:pointer-events-none",
      "relative",

      // Enhanced animations with spring physics
      "animate-in fade-in-0 zoom-in-95 duration-200 ease-out",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150",

      // Directional slide animations with increased distance for smoothness
      "data-[side=bottom]:slide-in-from-top-3 data-[side=left]:slide-in-from-right-3",
      "data-[side=right]:slide-in-from-left-3 data-[side=top]:slide-in-from-bottom-3",

      // Subtle glow effect
      "drop-shadow-lg",

      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
