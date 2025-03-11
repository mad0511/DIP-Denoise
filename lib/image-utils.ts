/**
 * Utility functions for image handling
 */

/**
 * Converts a data URL to a Blob
 */
export function dataURLtoBlob(dataURL: string): Blob {
  // Convert base64 to raw binary data held in a string
  const byteString = atob(dataURL.split(",")[1])

  // Separate out the mime component
  const mimeString = dataURL.split(",")[0].split(":")[1].split(";")[0]

  // Write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  // Create a blob with the ArrayBuffer and the mime type
  return new Blob([ab], { type: mimeString })
}

/**
 * Gets the file extension from a mime type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const types: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/avif": "avif",
    "image/svg+xml": "svg",
    "image/bmp": "bmp",
    "image/tiff": "tiff",
  }

  return types[mimeType] || "jpg"
}

/**
 * Resizes an image to fit within maxWidth and maxHeight while maintaining aspect ratio
 */
export function calculateAspectRatioFit(srcWidth: number, srcHeight: number, maxWidth: number, maxHeight: number) {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)

  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
  }
}

/**
 * Creates a thumbnail from an image data URL
 */
export async function createThumbnail(dataURL: string, maxWidth = 800, maxHeight = 600): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const { width, height } = calculateAspectRatioFit(img.width, img.height, maxWidth, maxHeight)

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      ctx.drawImage(img, 0, 0, width, height)

      // Get the data URL from the canvas
      const thumbnailDataURL = canvas.toDataURL("image/jpeg", 0.85)
      resolve(thumbnailDataURL)
    }

    img.onerror = () => {
      reject(new Error("Failed to load image"))
    }

    img.src = dataURL
  })
}

