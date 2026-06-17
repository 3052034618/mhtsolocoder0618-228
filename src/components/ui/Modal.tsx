import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full"

export interface ModalProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  size?: ModalSize
  closeOnOverlayClick?: boolean
  closeOnEsc?: boolean
  showCloseButton?: boolean
  className?: string
}

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
}

export interface ModalBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
  full: "max-w-[95vw] max-h-[90vh]",
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.2,
    },
  },
}

export const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, title, description, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col space-y-1.5 px-6 py-5 border-b border-neutral-200",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-primary-900 font-display leading-tight">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-neutral-500">{description}</p>
          )}
        </div>
        {children}
      </div>
    </div>
  )
)
ModalHeader.displayName = "ModalHeader"

export const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-5 flex-1 overflow-y-auto", className)}
      {...props}
    />
  )
)
ModalBody.displayName = "ModalBody"

export const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3",
        "px-6 py-4 border-t border-neutral-200 bg-neutral-50/50",
        "space-y-2 sm:space-y-0",
        className
      )}
      {...props}
    />
  )
)
ModalFooter.displayName = "ModalFooter"

const ModalContent: React.FC<{
  children: React.ReactNode
  size: ModalSize
  className?: string
  onClose: () => void
  showCloseButton: boolean
}> = ({ children, size, className, onClose, showCloseButton }) => (
  <motion.div
    variants={modalVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    role="dialog"
    aria-modal="true"
    className={cn(
      "relative w-full bg-white rounded-2xl shadow-elevated flex flex-col",
      "focus:outline-none",
      sizeStyles[size],
      className
    )}
  >
    {showCloseButton && (
      <button
        type="button"
        onClick={onClose}
        className={cn(
          "absolute top-4 right-4 z-10",
          "p-1.5 rounded-md text-neutral-400 hover:text-primary-600 hover:bg-primary-50",
          "transition-colors duration-200"
        )}
        aria-label="关闭"
      >
        <X className="h-5 w-5" />
      </button>
    )}
    {children}
  </motion.div>
)

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  size = "md",
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  className,
}) => {
  const overlayRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!open || !closeOnEsc) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, closeOnEsc, onClose])

  React.useEffect(() => {
    if (!open) return

    const originalStyle = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [open])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnOverlayClick) return
    if (e.target === overlayRef.current) {
      onClose()
    }
  }

  if (typeof document === "undefined") return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-primary-900/40 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full flex items-center justify-center">
            <ModalContent
              size={size}
              className={className}
              onClose={onClose}
              showCloseButton={showCloseButton}
            >
              {children}
            </ModalContent>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  )
}

Modal.displayName = "Modal"
