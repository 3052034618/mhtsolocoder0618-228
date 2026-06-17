import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export type ProgressVariant = "primary" | "gold" | "success" | "warning" | "danger"
export type ProgressSize = "sm" | "md" | "lg"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  indeterminate?: boolean
  showLabel?: boolean
  labelPosition?: "inside" | "outside"
}

const variantStyles: Record<ProgressVariant, string> = {
  primary: "bg-primary-500",
  gold: "bg-gradient-gold",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
}

const variantTextStyles: Record<ProgressVariant, string> = {
  primary: "text-primary-600",
  gold: "text-gold-700",
  success: "text-success-600",
  warning: "text-warning-600",
  danger: "text-danger-600",
}

const sizeStyles: Record<ProgressSize, { track: string; label: string }> = {
  sm: { track: "h-1.5", label: "text-xs" },
  md: { track: "h-2.5", label: "text-sm" },
  lg: { track: "h-4", label: "text-sm" },
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = "primary",
      size = "md",
      indeterminate = false,
      showLabel = false,
      labelPosition = "outside",
      ...props
    },
    ref
  ) => {
    const clampedValue = React.useMemo(() => {
      const val = Math.min(Math.max(value, 0), max)
      return (val / max) * 100
    }, [value, max])

    const displayLabel = `${Math.round(clampedValue)}%`

    if (indeterminate) {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <div
            className={cn(
              "w-full rounded-full bg-neutral-100 overflow-hidden relative",
              sizeStyles[size].track
            )}
          >
            <motion.div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full will-change-transform",
                variantStyles[variant]
              )}
              animate={{
                x: ["-100%", "200%"],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ width: "40%" }}
            />
            <motion.div
              className={cn(
                "absolute inset-y-0 left-0 rounded-full will-change-transform opacity-60",
                variantStyles[variant]
              )}
              animate={{
                x: ["-150%", "250%"],
              }}
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
              style={{ width: "25%" }}
            />
          </div>
        </div>
      )
    }

    if (labelPosition === "inside" && showLabel) {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <div
            className={cn(
              "w-full rounded-full bg-neutral-100 overflow-hidden relative",
              sizeStyles[size].track
            )}
          >
            <motion.div
              className={cn(
                "h-full rounded-full relative overflow-hidden",
                variantStyles[variant]
              )}
              initial={{ width: 0 }}
              animate={{ width: `${clampedValue}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {size !== "sm" && clampedValue > 12 && (
                <span
                  className={cn(
                    "absolute inset-0 flex items-center justify-center font-medium",
                    sizeStyles[size].label,
                    "text-white drop-shadow-sm"
                  )}
                >
                  {displayLabel}
                </span>
              )}
            </motion.div>
            {size !== "sm" && clampedValue <= 12 && (
              <span
                className={cn(
                  "absolute inset-y-0 right-2 flex items-center font-medium",
                  sizeStyles[size].label,
                  variantTextStyles[variant]
                )}
              >
                {displayLabel}
              </span>
            )}
          </div>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        {showLabel && labelPosition === "outside" && (
          <div className="flex items-center justify-between mb-1.5">
            <span className={cn("font-medium", sizeStyles[size].label, variantTextStyles[variant])}>
              {displayLabel}
            </span>
          </div>
        )}
        <div
          className={cn(
            "w-full rounded-full bg-neutral-100 overflow-hidden",
            sizeStyles[size].track
          )}
        >
          <motion.div
            className={cn(
              "h-full rounded-full",
              variantStyles[variant]
            )}
            initial={{ width: 0 }}
            animate={{ width: `${clampedValue}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
      </div>
    )
  }
)

Progress.displayName = "Progress"
