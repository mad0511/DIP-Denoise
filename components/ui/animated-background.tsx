"use client"

import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

interface AnimatedBackgroundProps {
  className?: string
  variant?: "gradient" | "particles" | "waves"
}

export function AnimatedBackground({ className, variant = "gradient" }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current && canvasRef.current.parentElement) {
        const { width, height } = canvasRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width, height })
        canvasRef.current.width = width
        canvasRef.current.height = height
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    if (variant === "particles") {
      // Particles animation
      const particles: { x: number; y: number; size: number; speedX: number; speedY: number }[] = []
      const particleCount = Math.floor((dimensions.width * dimensions.height) / 10000)

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          size: Math.random() * 3 + 1,
          speedX: Math.random() * 1 - 0.5,
          speedY: Math.random() * 1 - 0.5,
        })
      }

      const drawParticles = () => {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height)
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)"

        particles.forEach((particle) => {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
          ctx.fill()

          particle.x += particle.speedX
          particle.y += particle.speedY

          if (particle.x < 0 || particle.x > dimensions.width) particle.speedX *= -1
          if (particle.y < 0 || particle.y > dimensions.height) particle.speedY *= -1
        })

        animationFrameId = requestAnimationFrame(drawParticles)
      }

      drawParticles()
    } else if (variant === "waves") {
      // Waves animation
      let time = 0
      const waveColors = ["rgba(66, 153, 225, 0.2)", "rgba(129, 140, 248, 0.2)", "rgba(76, 81, 191, 0.2)"]

      const drawWaves = () => {
        ctx.clearRect(0, 0, dimensions.width, dimensions.height)

        waveColors.forEach((color, i) => {
          const amplitude = 20 + i * 10
          const period = 200 + i * 50
          const phase = time * (0.1 + i * 0.05)

          ctx.beginPath()
          ctx.moveTo(0, dimensions.height / 2)

          for (let x = 0; x < dimensions.width; x++) {
            const y = dimensions.height / 2 + amplitude * Math.sin((x / period) * 2 * Math.PI + phase)
            ctx.lineTo(x, y)
          }

          ctx.lineTo(dimensions.width, dimensions.height)
          ctx.lineTo(0, dimensions.height)
          ctx.closePath()
          ctx.fillStyle = color
          ctx.fill()
        })

        time++
        animationFrameId = requestAnimationFrame(drawWaves)
      }

      drawWaves()
    }

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [dimensions, variant])

  if (variant === "gradient") {
    return (
      <div
        className={cn(
          "absolute inset-0 -z-10 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-shift",
          className,
        )}
      />
    )
  }

  return <canvas ref={canvasRef} className={cn("absolute inset-0 -z-10", className)} />
}
