"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Upload, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import imageCompression from "browser-image-compression"

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setSelectedImage(file)
    setError(null)

    const fileReader = new FileReader()
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string)
    }
    fileReader.readAsDataURL(file)
  }

  const handleProcessImage = async () => {
    if (!selectedImage) {
      setError("Please select an image first")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const options = {
        maxSizeMB: 1, // Max target size
        maxWidthOrHeight: 1024, // Resize to max dimension
        useWebWorker: true,
        initialQuality: 1, // Set compression quality
        fileType: "image/jpeg",
        name: selectedImage.name // Force JPEG for better compression
      }

      console.log("Original File size (MB):", (selectedImage.size / (1024 * 1024)).toFixed(2))

      const compressedBlob = await imageCompression(selectedImage, options)
      const compressedFile = new File([compressedBlob], selectedImage.name, {
        type: compressedBlob.type,
      })
      console.log("Compressed File size (MB):", (compressedFile.size / (1024 * 1024)).toFixed(2))

      const formData = new FormData()

      formData.append("image", compressedFile)
      formData.append("imageName", compressedFile.name)
      console.log("Compressed File name:", compressedFile.name)

      const response = await fetch("/processImage", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      sessionStorage.setItem("originalImage", previewUrl as string)
      sessionStorage.setItem("imageName", compressedFile.name)

      router.push("/comparison")
    } catch (err) {
      console.error("Error processing image:", err)
      setError("Failed to process image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <h1 className="text-3xl font-bold mb-6 text-center">DIP Based Denoising</h1>
      <h3 className="text-l font-regular mb-3 text-left">Denoising Smartphone-Based
      Fluorescence Microscopy Imaging using Histogram thresholding and Deep Image Prior</h3>
      <p className="text-gray-600 mb-8 text-center max-w-2xl">
        Upload an image to process and compare the before and after results.
      </p>

      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 w-full aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full h-full">
                  <Image src={previewUrl || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
                </div>
              ) : (
                <>
                  <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    Click to select or drag and drop an image
                    <br />
                    <span className="text-xs">Supports JPG, PNG, GIF, WebP, and SVG</span>
                  </p>
                </>
              )}
              <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button
              className="w-full flex items-center gap-2"
              onClick={handleProcessImage}
              disabled={!selectedImage || isUploading}
            >
              {isUploading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Process Image
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
