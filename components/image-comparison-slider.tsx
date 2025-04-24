"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ImageComparisonSliderProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export default function ImageComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = "Before",
  afterLabel = "After",
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = document.createElement("img")
    img.onload = () => {
      // Calculate dimensions that maintain aspect ratio and fit viewport
      const maxWidth = Math.min(window.innerWidth - 48, 1200) // 48px for padding
      const maxHeight = window.innerHeight - 300 // Leave space for header and padding

      const aspectRatio = img.width / img.height
      let width = img.width
      let height = img.height

      // Scale down if image is larger than viewport
      if (width > maxWidth) {
        width = maxWidth
        height = width / aspectRatio
      }

      if (height > maxHeight) {
        height = maxHeight
        width = height * aspectRatio
      }

      setImageDimensions({ width, height })
    }
    img.src = beforeImage
  }, [beforeImage])

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleTouchStart = () => {
    setIsDragging(true)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const containerWidth = rect.width

    const newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100))
    setSliderPosition(newPosition)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return

    const touch = e.touches[0]
    const rect = containerRef.current.getBoundingClientRect()
    const x = touch.clientX - rect.left
    const containerWidth = rect.width

    const newPosition = Math.max(0, Math.min(100, (x / containerWidth) * 100))
    setSliderPosition(newPosition)
  }

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleTouchMove)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDragging])

  return (
    <div
      className="relative mx-auto overflow-hidden rounded-lg shadow-sm transition-all duration-300"
      ref={containerRef}
      style={{
        width: imageDimensions.width > 0 ? `${imageDimensions.width}px` : "100%",
        height: imageDimensions.height > 0 ? `${imageDimensions.height}px` : "auto",
        maxWidth: "100%",
        aspectRatio: imageDimensions.width > 0 ? `${imageDimensions.width} / ${imageDimensions.height}` : "auto",
      }}
    >
      {/* After Image (Full width, shown in the background) */}
      <div className="absolute inset-0 h-full w-full">
        <Image
          src={afterImage || "/placeholder.svg"}
          alt={afterLabel}
          fill
          className="object-cover"
          priority
          unoptimized // Use this to handle data URLs
          sizes={`${imageDimensions.width}px`}
        />
        <div className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
          {afterLabel}
        </div>
      </div>

      {/* Before Image (Full size with clip path based on slider position) */}
      <div
        className="absolute inset-0 h-full w-full overflow-hidden"
        style={{
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
        }}
      >
        <Image
          src={beforeImage || "/placeholder.svg"}
          alt={beforeLabel}
          fill
          className="object-cover"
          priority
          unoptimized // Use this to handle data URLs
          sizes={`${imageDimensions.width}px`}
        />
        <div className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white">
          {beforeLabel}
        </div>
      </div>

      {/* Slider */}
      <div
        className="absolute top-0 bottom-0 z-10 w-0.5 cursor-ew-resize bg-white"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md">
          <div className="flex items-center">
            <ChevronLeft className="h-3 w-3 text-gray-600" />
            <ChevronRight className="h-3 w-3 text-gray-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
