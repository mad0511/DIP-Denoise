"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

interface GlowEffectProps {
  children: ReactNode
  className?: string
  glowClassName?: string
  color?: string
}

export function GlowEffect({
  children,
  className,
  glowClassName,
  color = "rgba(160, 124, 254, 0.5)",
}: GlowEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    let animationFrameId: number
    let hue = 0

    const animate = () => {
      hue = (hue + 0.5) % 360
      container.style.setProperty("--glow-hue", `${hue}deg`)
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={
        {
          "--glow-color": color,
        } as React.CSSProperties
      }
    >
      <div
        className={cn(
          "absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[#A07CFE] via-[#FE8FB5] to-[#FFBE7B] opacity-70 blur-xl filter group-hover:opacity-100 animate-pulse",
          glowClassName,
        )}
        style={{
          background: `linear-gradient(var(--glow-hue), #A07CFE, #FE8FB5, #FFBE7B)`,
        }}
      />
      <div className="relative rounded-xl bg-card text-card-foreground">{children}</div>
    </div>
  )
}
