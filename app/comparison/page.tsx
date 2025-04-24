"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ImageComparisonSlider from "@/components/image-comparison-slider"
import ImageInfo from "@/components/image-info"
import { ShinyCard } from "@/components/ui/shiny-card"

export default function ComparisonPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [imageExtension, setImageExtension] = useState<string | null>(null) // Store file extension
  const router = useRouter()

  useEffect(() => {
    // Get the original image and image name from sessionStorage
    const original = sessionStorage.getItem("originalImage")
    const name = sessionStorage.getItem("imageName")

    if (!original) {
      router.push("/upload")
      return
    }

    setOriginalImage(original)
    setImageName(name)

    // Fetch the processed image from the API with the image name
    const fetchProcessedImage = async () => {
      try {
        setIsLoading(true)

        // Retrieving the processed image
        const url = name ? `/getProcessedImage?imageName=${encodeURIComponent(name)}` : "/getProcessedImage"
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`)
        }

        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)

        // Set image extension from the blob's content type (if available)
        const contentType = response.headers.get("Content-Type")
        const extension = contentType ? contentType.split("/")[1] : "jpg" // Default to jpg if no extension found
        setImageExtension(extension)

        setProcessedImage(imageUrl)
      } catch (err) {
        console.error("Error fetching processed image:", err)
        setError("Failed to load the processed image. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProcessedImage()
  }, [router])

  const handleDownload = () => {
    if (processedImage && imageExtension) {
      const a = document.createElement("a")
      a.href = processedImage
      a.download = imageName ? `processed-${imageName}.${imageExtension}` : `processed-image.${imageExtension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="noise-bg absolute inset-0 bg-gradient-to-b from-background to-background/80"></div>

      <div className="container relative z-10 mx-auto flex max-w-6xl flex-1 flex-col px-4 py-12">
        <div className="mb-8">
          <Link href="/upload">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to upload
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Image Comparison</h1>
          <p className="text-muted-foreground">
            Compare the original and processed images using the slider below.
            {imageName && <span className="mt-1 block text-sm font-medium">Image: {imageName}</span>}
          </p>
        </div>

        <ShinyCard className="p-6" shineColors={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
          {isLoading ? (
            <div className="flex h-[400px] flex-col items-center justify-center">
              <div className="mb-4 rounded-full bg-primary/10 p-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-muted-foreground">Processing your image...</p>
            </div>
          ) : error ? (
            <div className="flex h-[400px] flex-col items-center justify-center">
              <p className="mb-4 text-destructive">{error}</p>
              <Button variant="outline" onClick={() => router.push("/upload")}>
                Try Again
              </Button>
            </div>
          ) : (
            originalImage &&
            processedImage && (
              <div className="space-y-6">
                <ImageComparisonSlider
                  beforeImage={originalImage}
                  afterImage={processedImage}
                  beforeLabel="Original"
                  afterLabel="Processed"
                />

                <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <ShinyCard className="p-4" shineColors={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
                    <h3 className="mb-2 text-lg font-medium">Original Image</h3>
                    <ImageInfo src={originalImage || "/placeholder.svg"} label="Original" />
                  </ShinyCard>
                  <ShinyCard className="p-4" shineColors={["#A07CFE", "#FE8FB5", "#FFBE7B"]}>
                    <h3 className="mb-2 text-lg font-medium">Processed Image</h3>
                    <ImageInfo src={processedImage || "/placeholder.svg"} label="Processed" />
                  </ShinyCard>
                </div>

                <div className="flex justify-center pt-4">
                  <Button onClick={handleDownload} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download Processed Image
                  </Button>
                </div>
              </div>
            )
          )}
        </ShinyCard>
      </div>
    </div>
  )
}
