"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import ImageComparisonSlider from "@/components/image-comparison-slider";

export default function ComparisonPage() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get the original image and image name from sessionStorage
    const original = sessionStorage.getItem("originalImage");
    const name = sessionStorage.getItem("imageName");

    if (!original) {
      router.push("/");
      return;
    }

    setOriginalImage(original);
    setImageName(name);

    // Fetch the processed image from the API with the image name
    const fetchProcessedImage = async () => {
      try {
        setIsLoading(true);

        // Retrieving the processed image
        const url = name
          ? `/getProcessedImage?imageName=${encodeURIComponent(name)}`
          : "/getProcessedImage";
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setProcessedImage(imageUrl);
      } catch (err) {
        console.error("Error fetching processed image:", err);
        setError("Failed to load the processed image. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProcessedImage();
  }, [router]);

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-24">
      <div className="w-full max-w-4xl">
        <Button variant="outline" className="mb-6" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Upload
        </Button>

        <h1 className="text-3xl font-bold mb-2">Image Comparison</h1>
        <p className="text-gray-600 mb-8">
          Drag the slider to compare the original and processed images.
          {imageName && (
            <span className="block mt-1 text-sm">Image: {imageName}</span>
          )}
        </p>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading processed image...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg">
            <p className="text-red-500">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={handleBackClick}
            >
              Try Again
            </Button>
          </div>
        ) : (
          originalImage &&
          processedImage && (
            <ImageComparisonSlider
              beforeImage={originalImage}
              afterImage={processedImage}
              beforeLabel="Original"
              afterLabel="Processed"
            />
          )
        )}
      </div>
    </main>
  );
}
