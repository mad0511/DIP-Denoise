import { cn } from "@/lib/utils"
import { type ButtonHTMLAttributes, forwardRef } from "react"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const variantClasses = {
      primary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      secondary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      success: "bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600",
      danger: "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600",
    }

    const sizeClasses = {
      sm: "py-1.5 px-3 text-sm",
      md: "py-2 px-4 text-base",
      lg: "py-3 px-6 text-lg",
    }

    return (
      <button
        className={cn(
          "relative inline-flex items-center justify-center rounded-lg font-medium text-white shadow-lg transition-all duration-300 ease-in-out",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
          "transform hover:scale-[1.02] active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          isLoading && "cursor-not-allowed opacity-80",
          className,
        )}
        disabled={isLoading || props.disabled}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
              className="h-5 w-5 animate-spin text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}
        <span className={cn(isLoading && "invisible")}>{children}</span>
      </button>
    )
  },
)

GradientButton.displayName = "GradientButton"
