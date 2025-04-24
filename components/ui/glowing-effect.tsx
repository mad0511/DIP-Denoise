"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface GlowingEffectProps extends React.HTMLAttributes<HTMLDivElement> {
  spread?: number
  glow?: boolean
  disabled?: boolean
  proximity?: number
  inactiveZone?: number
}

export function GlowingEffect({
  spread = 20,
  glow = true,
  disabled = false,
  proximity = 64,
  inactiveZone = 0.2,
  className,
  ...props
}: GlowingEffectProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    if (disabled) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if mouse is within the container
      const isWithinContainer = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height

      // Calculate distance from center as a percentage of container size
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      const distanceFromCenter =
        Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)) /
        Math.sqrt(Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2))

      // Only update position and opacity if within container and outside inactive zone
      if (isWithinContainer && distanceFromCenter > inactiveZone) {
        setPosition({ x, y })
        setOpacity(1)
        setIsHovering(true)
      } else {
        setOpacity(0)
        setIsHovering(false)
      }
    }

    const handleMouseLeave = () => {
      setOpacity(0)
      setIsHovering(false)
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [disabled, inactiveZone])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)} {...props}>
      <div
        className={cn(
          "pointer-events-none absolute -inset-px z-0 transition-opacity duration-300",
          glow ? "opacity-100" : "opacity-0",
        )}
        style={{
          opacity: glow ? opacity : 0,
          background: `radial-gradient(
            circle ${spread}rem at ${position.x}px ${position.y}px, 
            rgba(120, 120, 255, 0.15), 
            transparent 100%
          )`,
        }}
      />
    </div>
  )
}
