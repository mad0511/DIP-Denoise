"use client"

import { useState, useEffect } from "react"

interface ImageInfoProps {
  src: string
  label: string
}

export default function ImageInfo({ src, label }: ImageInfoProps) {
  const [info, setInfo] = useState<{
    dimensions: string
    size: string
    type: string
  } | null>(null)

  useEffect(() => {
    if (!src) return

    const img = new Image()
    img.onload = () => {
      // Get image dimensions
      const dimensions = `${img.width} × ${img.height}`

      // For data URLs, estimate the size
      let size = "Unknown"
      if (src.startsWith("data:")) {
        // Rough estimate: base64 is ~33% larger than binary
        const base64Length = src.split(",")[1].length
        const sizeInBytes = Math.round(base64Length * 0.75)

        if (sizeInBytes < 1024) {
          size = `${sizeInBytes} B`
        } else if (sizeInBytes < 1024 * 1024) {
          size = `${Math.round(sizeInBytes / 1024)} KB`
        } else {
          size = `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
        }
      }

      // Get image type
      const type = src.startsWith("data:") ? src.split(":")[1].split(";")[0] : "image/*"

      setInfo({ dimensions, size, type })
    }

    img.src = src
  }, [src])

  if (!info) return null

  return (
    <div className="text-xs text-gray-500 mt-2">
      <p>
        <strong>{label}:</strong> {info.dimensions} • {info.size} • {info.type}
      </p>
    </div>
  )
}

