import * as React from "react"
import { User } from "lucide-react"
import { cn } from "@/lib/utils"

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
export type AvatarStatus = "online" | "offline" | "busy" | "away"

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  size?: AvatarSize
  status?: AvatarStatus
  goldBorder?: boolean
  fallback?: React.ReactNode
}

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: AvatarSize
}

const sizeStyles: Record<AvatarSize, { avatar: string; status: string; text: string }> = {
  xs: { avatar: "h-7 w-7", status: "h-2 w-2", text: "text-xs" },
  sm: { avatar: "h-9 w-9", status: "h-2.5 w-2.5", text: "text-sm" },
  md: { avatar: "h-11 w-11", status: "h-3 w-3", text: "text-base" },
  lg: { avatar: "h-14 w-14", status: "h-3.5 w-3.5", text: "text-lg" },
  xl: { avatar: "h-18 w-18", status: "h-4 w-4", text: "text-xl" },
  "2xl": { avatar: "h-22 w-22", status: "h-5 w-5", text: "text-2xl" },
}

const statusColors: Record<AvatarStatus, string> = {
  online: "bg-success-500",
  offline: "bg-neutral-400",
  busy: "bg-danger-500",
  away: "bg-warning-500",
}

const groupOverlapStyles: Record<AvatarSize, string> = {
  xs: "-space-x-2",
  sm: "-space-x-3",
  md: "-space-x-4",
  lg: "-space-x-5",
  xl: "-space-x-6",
  "2xl": "-space-x-8",
}

const getInitials = (name: string): string => {
  return name
    .split(/\s+/)
    .map((word) => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = "",
      size = "md",
      status,
      goldBorder = false,
      fallback,
      ...props
    },
    ref
  ) => {
    const [imgError, setImgError] = React.useState(false)
    const hasImage = src && !imgError

    const renderContent = () => {
      if (hasImage) {
        return (
          <img
            src={src}
            alt={alt}
            onError={() => setImgError(true)}
            className={cn(
              "h-full w-full object-cover rounded-full",
              goldBorder && "p-0.5"
            )}
          />
        )
      }

      if (fallback) {
        return (
          <div className="h-full w-full flex items-center justify-center text-primary-500">
            {fallback}
          </div>
        )
      }

      if (alt) {
        return (
          <div
            className={cn(
              "h-full w-full flex items-center justify-center font-medium bg-primary-100 text-primary-600",
              sizeStyles[size].text
            )}
          >
            {getInitials(alt)}
          </div>
        )
      }

      return (
        <div className="h-full w-full flex items-center justify-center bg-primary-100 text-primary-500">
          <User className={cn(sizeStyles[size].text, "opacity-70")} />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn("relative inline-flex shrink-0 animate-avatar-spring-in", className)}
        {...props}
      >
        <div
          className={cn(
            "rounded-full overflow-hidden bg-neutral-100",
            sizeStyles[size].avatar,
            goldBorder && [
              "p-[2px]",
              "bg-gradient-gold",
              "shadow-gold",
            ],
            !goldBorder && "ring-2 ring-white"
          )}
        >
          <div className="h-full w-full rounded-full overflow-hidden bg-white">
            {renderContent()}
          </div>
        </div>
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full ring-2 ring-white",
              sizeStyles[size].status,
              statusColors[status]
            )}
          />
        )}
      </div>
    )
  }
)
Avatar.displayName = "Avatar"

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, size = "md", ...props }, ref) => {
    const childrenArray = React.Children.toArray(children)
    const visibleChildren = max ? childrenArray.slice(0, max) : childrenArray
    const hiddenCount = max ? Math.max(0, childrenArray.length - max) : 0

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center",
          groupOverlapStyles[size],
          className
        )}
        {...props}
      >
        {visibleChildren.map((child, index) => (
          <div key={index} className="relative z-[visibleChildren.length - index]">
            {child}
          </div>
        ))}
        {hiddenCount > 0 && (
          <div
            className={cn(
              "relative inline-flex items-center justify-center rounded-full",
              "bg-neutral-100 ring-2 ring-white",
              "text-neutral-600 font-medium",
              sizeStyles[size].avatar,
              sizeStyles[size].text
            )}
          >
            +{hiddenCount}
          </div>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = "AvatarGroup"
