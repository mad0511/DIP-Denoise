"use client"

import type React from "react"

import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface SpotlightProps {
  className?: string
  children: React.ReactNode
}

export function Spotlight({ className, children }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [opacity, setOpacity] = useState(0)
  const [position, setPosition] = useState({ x: "50%", y: "50%" })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPosition({ x: `${x}%`, y: `${y}%` })
    setOpacity(1)
  }

  const handleMouseLeave = () => {
    setOpacity(0)
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="spotlight"
        style={
          {
            "--x": position.x,
            "--y": position.y,
            "--opacity": opacity,
          } as React.CSSProperties
        }
      />
      {children}
    </div>
  )
}
