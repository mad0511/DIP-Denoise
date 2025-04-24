import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface GlassCardProps {
  children: ReactNode
  className?: string
  intensity?: "low" | "medium" | "high"
}

export function GlassCard({ children, className, intensity = "medium" }: GlassCardProps) {
  const intensityMap = {
    low: "bg-white/10 backdrop-blur-sm border-white/20",
    medium: "bg-white/20 backdrop-blur-md border-white/30",
    high: "bg-white/30 backdrop-blur-lg border-white/40",
  }

  return (
    <div
      className={cn(
        "rounded-xl border p-4 shadow-xl transition-all duration-300",
        intensityMap[intensity],
        "dark:bg-black/20 dark:border-white/10",
        className,
      )}
    >
      {children}
    </div>
  )
}
