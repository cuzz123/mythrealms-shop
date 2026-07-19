import { forwardRef, type ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

const variantStyles = {
  primary:
    "border border-transparent bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
  outline:
    "bg-transparent text-[var(--text)] border border-[var(--border)] hover:border-[var(--text-muted)] hover:bg-[var(--border-light)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] border border-transparent hover:bg-[var(--border-light)] hover:text-[var(--text)]",
  accent:
    "border border-transparent bg-[var(--primary)] text-[var(--text)] hover:bg-[var(--primary-hover)]",
} as const

const sizeStyles = {
  sm: "h-8 px-3 text-xs rounded-[var(--radius-sm)] gap-1.5",
  md: "h-10 px-5 text-sm rounded-[var(--radius-md)] gap-2",
  lg: "h-12 px-7 text-base rounded-[var(--radius-md)] gap-2.5",
} as const

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantStyles
  size?: keyof typeof sizeStyles
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--muted-blue)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
