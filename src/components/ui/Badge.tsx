import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "gold" | "primary"
export type BadgeSize = "sm" | "md" | "lg"

export interface BadgeProps extends Omit<HTMLMotionProps<"span">, "ref" | "children"> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  pulse?: boolean
  children?: React.ReactNode
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-neutral-100 text-neutral-700 border-neutral-200",
  success:
    "bg-success-50 text-success-700 border-success-200",
  warning:
    "bg-warning-50 text-warning-700 border-warning-200",
  danger:
    "bg-danger-50 text-danger-700 border-danger-200",
  gold:
    "bg-gold-50 text-gold-700 border-gold-300",
  primary:
    "bg-primary-50 text-primary-700 border-primary-200",
}

const dotStyles: Record<BadgeVariant, string> = {
  default: "bg-neutral-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
  gold: "bg-gold-500",
  primary: "bg-primary-500",
}

const sizeStyles: Record<BadgeSize, string> = {
  sm: "text-xs px-1.5 py-0.5",
  md: "text-xs px-2 py-1",
  lg: "text-sm px-2.5 py-1",
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "default", size = "md", dot = false, pulse = false, children, ...props }, ref) => {
    return (
      <motion.span
        ref={ref}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border",
          "font-medium leading-none",
          "transition-colors duration-200",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-1.5 w-1.5">
            {pulse && (
              <motion.span
                animate={{ opacity: [1, 0, 1], scale: [1, 1.8, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75",
                  dotStyles[variant]
                )}
              />
            )}
            <span
              className={cn(
                "relative inline-flex rounded-full h-1.5 w-1.5",
                dotStyles[variant]
              )}
            />
          </span>
        )}
        {children}
      </motion.span>
    )
  }
)

Badge.displayName = "Badge"
