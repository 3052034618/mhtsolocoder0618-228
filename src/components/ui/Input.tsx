import * as React from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

export type InputType = "text" | "password" | "number" | "email" | "tel" | "url"

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  prefixIcon?: React.ReactNode
  suffixIcon?: React.ReactNode
  error?: boolean
  errorMessage?: string
  label?: string
  size?: "sm" | "md" | "lg"
}

const sizeStyles = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
}

const iconSizeStyles = {
  sm: "px-2.5",
  md: "px-3",
  lg: "px-3.5",
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      prefixIcon,
      suffixIcon,
      error = false,
      errorMessage,
      label,
      size = "md",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputId = React.useId()

    const isPassword = type === "password"
    const resolvedType = isPassword ? (showPassword ? "text" : "password") : type

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-medium text-primary-800 mb-1.5",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {prefixIcon && (
            <div
              className={cn(
                "absolute inset-y-0 left-0 flex items-center",
                iconSizeStyles[size],
                "text-neutral-400 pointer-events-none"
              )}
            >
              {prefixIcon}
            </div>
          )}
          <motion.div
            className="absolute inset-0 rounded-md pointer-events-none opacity-0"
            animate={{
              opacity: error ? 0 : 0,
            }}
            whileFocus={{ opacity: 1 }}
            style={{
              background:
                "linear-gradient(135deg, rgba(30, 58, 95, 0.15) 0%, rgba(201, 169, 97, 0.15) 100%)",
              filter: "blur(8px)",
              transform: "scale(1.02)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <input
            id={inputId}
            ref={ref}
            type={resolvedType}
            disabled={disabled}
            className={cn(
              "relative w-full rounded-md border bg-white",
              "text-primary-900 placeholder:text-neutral-400",
              "transition-all duration-200 ease-out",
              "focus:outline-none focus:ring-0",
              "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed",
              sizeStyles[size],
              prefixIcon && (size === "sm" ? "pl-9" : size === "md" ? "pl-10" : "pl-11"),
              (suffixIcon || isPassword) &&
                (size === "sm" ? "pr-9" : size === "md" ? "pr-10" : "pr-11"),
              error
                ? "border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/30"
                : "border-neutral-300 hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30",
              className
            )}
            {...props}
          />
          {(suffixIcon || isPassword) && (
            <div
              className={cn(
                "absolute inset-y-0 right-0 flex items-center gap-1",
                iconSizeStyles[size]
              )}
            >
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    "p-1 rounded-md text-neutral-400 hover:text-primary-600",
                    "transition-colors duration-200",
                    disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={disabled}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              )}
              {!isPassword && suffixIcon && (
                <span className="text-neutral-400 pointer-events-none">{suffixIcon}</span>
              )}
            </div>
          )}
        </div>
        {error && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs text-danger-600 font-medium"
          >
            {errorMessage}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"
