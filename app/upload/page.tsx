"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ImageIcon, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShinyCard } from "@/components/ui/shiny-card";
import imageCompression from "browser-image-compression";
import { ShineBorder } from "@/components/magicui/shine-border";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { MagicCard } from "@/components/magicui/magic-card";

export default function UploadPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setSelectedImage(file);
    setError(null);

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
  };

  const handleProcessImage = async () => {
    if (!selectedImage) {
      setError("Please select an image first");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
        initialQuality: 1,
        fileType: "image/jpeg",
        name: selectedImage.name,
      };

      const compressedBlob = await imageCompression(selectedImage, options);
      const compressedFile = new File([compressedBlob], selectedImage.name, {
        type: compressedBlob.type,
      });

      const formData = new FormData();
      formData.append("image", compressedFile);
      formData.append("imageName", compressedFile.name);

      const response = await fetch("/processImage", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      sessionStorage.setItem("originalImage", previewUrl as string);
      sessionStorage.setItem("imageName", compressedFile.name);

      router.push("/comparison");
    } catch (err) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div
              className={cn(
                "absolute inset-0",
                "[background-size:20px_20px]",
                "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
              )}
            />
      <div className="noise-bg absolute inset-0 bg-gradient-to-b from-background to-background/80"></div>

      <div className="container relative z-10 mx-auto flex max-w-5xl flex-1 flex-col px-4 py-12">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Button>
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">
            Upload Your Image
          </h1>
          <p className="text-muted-foreground">
            Upload a fluorescence microscopy image to process and enhance with
            our denoising algorithm.
          </p>
        </div>

        <div className="mx-auto w-full max-w-md">

        <BackgroundGradient className="rounded-[22px] border border-border sm:p-4 bg-background">
            <div
              className="group relative mb-6 flex aspect-video cursor-pointer flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-accent/50 transition-colors hover:border-primary/50"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {previewUrl ? (
                <div className="relative h-full w-full">
                  <Image
                    src={previewUrl || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-center text-sm font-medium text-white">
                      Click to change image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 rounded-full bg-primary/10 p-3">
                    <ImageIcon className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mb-2 text-sm font-medium">
                    Click to select or drag and drop an image
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports JPG, PNG, GIF, WebP, and TIFF
                  </p>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {error && (
              <div className="mb-6 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <p>{error}</p>
              </div>
            )}

            <Button
              className="w-full gap-2"
              onClick={handleProcessImage}
              disabled={!selectedImage || isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Process Image
                </>
              )}
            </Button>
          </BackgroundGradient>
        </div>
      </div>
    </div>
  );
}
