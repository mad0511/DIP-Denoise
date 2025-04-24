import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  ImageIcon,
  LineChart,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShinyCard } from "@/components/ui/shiny-card";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { GlowEffect } from "@/components/ui/glow-effect";
import { BorderBeam } from "@/components/magicui/border-beam";
import { AuroraText } from "@/components/magicui/aurora-text";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { ShineBorder } from "@/components/magicui/shine-border";
import { cn } from "@/lib/utils";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
            <div
                    className={cn(
                      "absolute inset-0",
                      "[background-size:20px_20px]",
                      "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
                      "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
                    )}
                  />
      {/* Background Effects */}
      <div className="noise-bg absolute inset-0 bg-gradient-to-b from-background to-background/80"></div>

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-visible px-4 py-24 text-center md:px-8">
        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center rounded-full border border-neutral-800 bg-background/80 px-3 py-1 text-sm backdrop-blur">
            <span className="mr-2 rounded-full bg-primary/10 p-1">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
            </span>
            <span className="text-muted-foreground">
              Advanced image denoising technology
            </span>
          </div>

          <h1 className="mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15]">
            DIP Based <AuroraText>Denoising</AuroraText>
          </h1>

          <p className="mb-10 text-xl text-muted-foreground md:text-2xl">
            Enhance smartphone-based fluorescence microscopy images with our
            cutting-edge denoising technology
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            {/* Button with BorderBeam effect */}
            <div className="relative inline-flex rounded-md p-[2px]">
              <Link href="/upload" className="relative z-10">
                <RainbowButton>
                  Try it now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </RainbowButton>
              </Link>
            </div>

            <Button variant="outline" size="lg">
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Application Example Section - Improved spacing */}
      <section className="relative px-4 py-28 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              Cell Counting Application
            </h2>
            <p className="mx-auto max-w-2xl text-foreground">
              Our denoising technology enhances fluorescence microscopy images
              for accurate cell counting and analysis.
            </p>
          </div>

          <ShinyCard
            className="overflow-hidden p-0"
            shineColors={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
          >
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture1-AOchqTat7mZtq4MNiig2Hyc5Uq416V.png"
                alt="Cell counting application showing microscope, operator, and fluorescent cell sample"
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 text-xl font-semibold">
                Fluorescence Microscopy Cell Counting
              </h3>
              <p className="text-muted-foreground">
                Our technology enhances the quality of fluorescence microscopy
                images, enabling more accurate cell counting and analysis for
                research and diagnostic applications.
              </p>
            </div>
          </ShinyCard>
        </div>
      </section>

      {/* Features Section - Improved spacing */}
      <section className="relative px-4 py-28 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our advanced algorithm combines histogram thresholding and Deep
              Image Prior techniques to remove noise from microscopy images.
            </p>
          </div>

          <BentoGrid>
            <BentoGridItem
              title="Image Upload"
              description="Upload your fluorescence microscopy images in various formats including JPG, PNG, and TIFF."
              icon={<ImageIcon className="h-6 w-6" />}
              span="1"
            />
            <BentoGridItem
              title="AI Processing"
              description="Our algorithm automatically processes your image using advanced denoising techniques based on Deep Image Prior networks."
              icon={<BrainCircuit className="h-6 w-6" />}
              span="1"
            />
            <BentoGridItem
              title="Interactive Comparison"
              description="Compare the original and processed images side by side with our interactive slider to see the improvements in detail."
              icon={<Zap className="h-6 w-6" />}
              span="1"
            />
            <BentoGridItem
              title="Analysis"
              description="Get detailed information about your images including dimensions, noise levels, and quality metrics to understand the improvements."
              icon={<LineChart className="h-6 w-6" />}
              span="1"
            />
          </BentoGrid>
        </div>
      </section>

      {/* Technology Section - Improved spacing */}
      <section className="relative px-4 py-28 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              Our Technology
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Learn about the advanced Deep Image Prior (DIP) techniques we use
              to enhance your images.
            </p>
          </div>

          <div className="grid gap-12">
            <ShinyCard
              className="overflow-hidden p-6"
              shineColors={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            >
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-2xl font-semibold leading-tight text-white">
                    Deep Image Prior Architecture
                  </h3>
                  <p className="mb-4 text-muted-foreground">
                    Our denoising technology leverages Deep Image Prior (DIP),
                    an advanced neural network approach that doesn't require
                    pre-training on large datasets. Instead, it uses the
                    structure of the network itself as a prior for image
                    restoration.
                  </p>
                  <p className="text-muted-foreground">
                    The network architecture shown here includes skip
                    connections, convolutional layers, and specialized
                    components that work together to progressively remove noise
                    while preserving important image details.
                  </p>
                </div>
                <div className="relative flex items-center justify-center overflow-hidden rounded-lg bg-muted p-4">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Picture2-g8NCnVrKONJXKqnsVmmJnji0hOBuH1.png"
                    alt="Deep Image Prior neural network architecture diagram"
                    width={600}
                    height={400}
                    className="object-contain"
                  />
                </div>
              </div>
            </ShinyCard>

            <div className="grid gap-8 md:grid-cols-2">
              <ShinyCard
                className="p-6"
                shineColors={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              >
                <h3 className="mb-4 text-xl font-semibold leading-tight text-foreground">
                  Histogram Thresholding
                </h3>
                <p className="text-muted-foreground">
                  Our system uses advanced histogram thresholding techniques to
                  separate signal from noise in fluorescence microscopy images.
                  This approach is particularly effective for images with
                  distinct intensity distributions between the background noise
                  and the fluorescent signals of interest.
                </p>
              </ShinyCard>

              <ShinyCard
                className="p-6"
                shineColors={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              >
                <h3 className="mb-4 text-xl font-semibold leading-tight text-foreground">
                  Adaptive Processing
                </h3>
                <p className="text-muted-foreground">
                  Our algorithm adapts to different types of microscopy images
                  and noise patterns. It automatically detects the
                  characteristics of your specific image and applies the optimal
                  combination of processing techniques to achieve the best
                  results.
                </p>
              </ShinyCard>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Improved spacing */}
      <section className="relative px-4 py-28 md:px-8">
        <div className="mx-auto max-w-6xl">
          <GlowEffect>
            <div className="overflow-hidden rounded-xl bg-gradient-to-b p-8 md:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                  Ready to enhance your images?
                </h2>
                <p className="mb-8 text-muted-foreground">
                  Try our advanced denoising technology now and see the
                  difference it makes to your fluorescence microscopy images.
                </p>
                <Link href="/upload">
                  <Button size="lg" className="group gap-2">
                    Get started
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </GlowEffect>
        </div>
      </section>

      {/* Footer - Improved spacing */}
      <footer className="border-t border-border px-4 py-8 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              © 2024 DIP Denoiser. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
