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
  
    // Optional: needed only if image is from another domain
    if (!src.startsWith("data:") && !src.startsWith("blob:")) {
      img.crossOrigin = "anonymous"
    }
  
    img.onload = async () => {
      try {
        await img.decode() // 🔹 Ensures image is fully ready before accessing dimensions
  
        const dimensions = `${img.width} × ${img.height}`
        console.log("img.width", img.width)
        console.log("img.height", img.height)
        console.log("label", label)
        console.log("src", src)
  
        let size = "Unknown"
  
        if (src.startsWith("data:")) {
          const base64Length = src.split(",")[1]?.length || 0
          const sizeInBytes = Math.round(base64Length * 0.75)
  
          if (sizeInBytes < 1024) {
            size = `${sizeInBytes} B`
          } else if (sizeInBytes < 1024 * 1024) {
            size = `${Math.round(sizeInBytes / 1024)} KB`
          } else {
            size = `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
          }
        } else if (src.startsWith("blob:")) {
          const response = await fetch(src)
          const blob = await response.blob()
          const sizeInBytes = blob.size
  
          if (sizeInBytes < 1024) {
            size = `${sizeInBytes} B`
          } else if (sizeInBytes < 1024 * 1024) {
            size = `${Math.round(sizeInBytes / 1024)} KB`
          } else {
            size = `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`
          }
        }
  
        const type = src.startsWith("data:")
          ? src.split(":")[1].split(";")[0]
          : src.startsWith("blob:")
          ? (await fetch(src).then((res) => res.blob())).type
          : "image/*"
  
        setInfo({ dimensions, size, type })
      } catch (err) {
        console.error("Error decoding image", err)
      }
    }
  
    img.onerror = (e) => {
      console.error("Image failed to load", e)
    }
  
    img.src = src
  }, [src, label])

  if (!info) return null

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-accent/50 px-3 py-1">Dimensions</div>
        <div className="rounded-md bg-accent/50 px-3 py-1">{info.dimensions}</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-accent/50 px-3 py-1">Size</div>
        <div className="rounded-md bg-accent/50 px-3 py-1">{info.size}</div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-md bg-accent/50 px-3 py-1">Type</div>
        <div className="rounded-md bg-accent/50 px-3 py-1">{info.type}</div>
      </div>
    </div>
  )
}
