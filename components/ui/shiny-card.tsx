"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import type { ReactNode } from "react";

interface ShinyCardProps {
  children: ReactNode;
  className?: string;
  borderClassName?: string;
  containerClassName?: string;
  shineColors?: string[];
}

export function ShinyCard({
  children,
  className,
  borderClassName,
  containerClassName,
  shineColors = ["#A07CFE", "#FE8FB5", "#FFBE7B"], // Default colors as requested
}: ShinyCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // Calculate position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPosition({ x, y });
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  // Create CSS gradient from the shine colors
  const gradientBackground = `linear-gradient(45deg, ${shineColors.join(
    ", "
  )})`;

  return (
    <div
      ref={cardRef}
      className={cn("group relative rounded-xl", containerClassName)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Shiny border effect */}
      <div
        className={cn(
          "absolute -inset-[1px] rounded-xl transition-opacity duration-300 group-hover:opacity-100",
          borderClassName
        )}
        style={{
          pointerEvents: "none",
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.4), transparent 40%)`,
          opacity: opacity,
          zIndex: 1,
          willChange: "background",
        }}
      />

      {/* Colorful border */}
      <div
        className="absolute -inset-[1px] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: gradientBackground,
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      {/* Card content */}
      <div className={cn("relative z-10 rounded-xl border bg-card", className)}>
        {children}
      </div>
    </div>
  );
}
