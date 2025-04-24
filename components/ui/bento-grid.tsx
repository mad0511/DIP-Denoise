"use client"

import { cn } from "@/lib/utils"
import { useRef, useState } from "react"
import type { ReactNode } from "react"

interface BentoGridProps {
  className?: string
  children: ReactNode
}

export function BentoGrid({ className, children }: BentoGridProps) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-[minmax(180px,auto)]", className)}>
      {children}
    </div>
  )
}

interface BentoGridItemProps {
  className?: string
  title: string
  description: string
  icon: ReactNode
  span?: "1" | "2" | "row2" | "col2" | "full"
}

export function BentoGridItem({ className, title, description, icon, span = "1" }: BentoGridItemProps) {
  const [hovered, setHovered] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const spanClass = {
    "1": "md:col-span-1",
    "2": "md:col-span-2",
    row2: "md:row-span-2",
    col2: "md:col-span-2 md:row-span-2",
    full: "md:col-span-2 md:row-span-2",
  }

  return (
    <div
      ref={containerRef}
      className="h-full rounded-xl border border-border bg-card/90 p-6 transition-all duration-300 hover:border-primary/20 hover:bg-card/95"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold leading-tight text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
