"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface ShineBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  borderWidth?: number
  duration?: number
  shineColor?: string | string[]
  children?: React.ReactNode
}

export function ShineBorder({
  borderWidth = 2,
  duration = 14,
  shineColor = "#000000",
  className,
  style,
  children,
  ...props
}: ShineBorderProps) {
  const gradient = Array.isArray(shineColor) ? shineColor.join(",") : shineColor

  return (
    <div
      className={cn("relative rounded-xl", className)}
      style={{ padding: borderWidth, ...style }}
      {...props}
    >
      {/* Border shine layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] will-change-[background-position] motion-safe:animate-shine"
        style={{
          backgroundImage: `radial-gradient(circle at center, transparent, transparent, ${gradient}, transparent, transparent)`,
          backgroundSize: "300% 300%",
          animationDuration: `${duration}s`,
          maskImage: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskImage: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* Content goes above the border layer */}
      <div className="relative z-10 rounded-[inherit] bg-background p-6">{children}</div>
    </div>
  )
}
