"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { GlassCard } from "@/components/ui/glass-card"
import { cn } from "@/lib/utils"
import { ImageIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Comparison", href: "/comparison" },
  ]

  return (
    <header className={cn("fixed left-0 right-0 top-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-4")}>
      <GlassCard
        className={cn(
          "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300",
          scrolled ? "rounded-none rounded-b-xl" : "my-2 mx-4 rounded-xl",
        )}
        intensity={scrolled ? "high" : "low"}
      >
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <ImageIcon className="h-5 w-5" />
          </div>
          <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            DIP Denoiser
          </span>
        </Link>

        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-indigo-500",
                    pathname === item.href
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-gray-700 dark:text-gray-300",
                  )}
                >
                  {item.name}
                  {pathname === item.href && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-gradient-to-r from-indigo-500 to-purple-600" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <ThemeToggle />
      </GlassCard>
    </header>
  )
}
