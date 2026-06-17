import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
  errorMessage?: string
  label?: string
  showCount?: boolean
  maxLength?: number
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error = false,
      errorMessage,
      label,
      showCount = false,
      maxLength,
      disabled = false,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = React.useId()
    const [internalValue, setInternalValue] = React.useState<string>(
      typeof value === "string" ? value : typeof defaultValue === "string" ? defaultValue : ""
    )

    React.useEffect(() => {
      if (typeof value === "string") {
        setInternalValue(value)
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (typeof value !== "string") {
        setInternalValue(e.target.value)
      }
      onChange?.(e)
    }

    const charCount = internalValue.length

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              "block text-sm font-medium text-primary-800 mb-1.5",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
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
              transform: "scale(1.015)",
            }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          <textarea
            id={textareaId}
            ref={ref}
            value={value}
            defaultValue={defaultValue}
            onChange={handleChange}
            maxLength={maxLength}
            disabled={disabled}
            className={cn(
              "relative w-full rounded-md border bg-white px-4 py-3",
              "text-primary-900 placeholder:text-neutral-400 text-sm",
              "transition-all duration-200 ease-out resize-y min-h-[100px]",
              "focus:outline-none focus:ring-0",
              "disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed",
              showCount && "pb-8",
              error
                ? "border-danger-400 focus:border-danger-500 focus:ring-2 focus:ring-danger-500/30"
                : "border-neutral-300 hover:border-primary-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30",
              className
            )}
            {...props}
          />
          {showCount && (
            <div
              className={cn(
                "absolute bottom-2.5 right-3 text-xs",
                maxLength && charCount >= maxLength ? "text-danger-500" : "text-neutral-400"
              )}
            >
              {charCount}
              {maxLength && ` / ${maxLength}`}
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

Textarea.displayName = "Textarea"
