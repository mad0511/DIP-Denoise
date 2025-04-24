import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DIP Denoiser - Image Processing App",
  description: "Upload, process, and compare images with advanced denoising techniques",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative min-h-screen">
            <div className="absolute right-4 top-4 z-50">
              <ThemeToggle />
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
