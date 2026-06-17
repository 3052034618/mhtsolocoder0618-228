import * as React from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TabProps {
  value: string
  disabled?: boolean
  icon?: React.ReactNode
  children: React.ReactNode
  className?: string
}

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  scrollable?: boolean
}

export interface TabPanelProps {
  value: string
  children: React.ReactNode
  className?: string
}

export interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
  registerTab: (value: string, ref: React.RefObject<HTMLButtonElement>) => void
  unregisterTab: (value: string) => void
  getTabRef: (value: string) => React.RefObject<HTMLButtonElement> | undefined
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

const useTabsContext = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tabs components must be used within <Tabs>")
  }
  return context
}

export const Tabs: React.FC<TabsProps> = ({
  defaultValue = "",
  value: controlledValue,
  onValueChange,
  children,
  className,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue)
  const isControlled = controlledValue !== undefined
  const value = isControlled ? controlledValue : internalValue
  const tabRefs = React.useRef<Map<string, React.RefObject<HTMLButtonElement>>>(new Map())

  const setValue = React.useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    },
    [isControlled, onValueChange]
  )

  const registerTab = React.useCallback(
    (tabValue: string, ref: React.RefObject<HTMLButtonElement>) => {
      tabRefs.current.set(tabValue, ref)
    },
    []
  )

  const unregisterTab = React.useCallback((tabValue: string) => {
    tabRefs.current.delete(tabValue)
  }, [])

  const getTabRef = React.useCallback(
    (tabValue: string) => tabRefs.current.get(tabValue),
    []
  )

  const contextValue = React.useMemo(
    () => ({
      value,
      setValue,
      registerTab,
      unregisterTab,
      getTabRef,
    }),
    [value, setValue, registerTab, unregisterTab, getTabRef]
  )

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  )
}
Tabs.displayName = "Tabs"

export const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ className, children, scrollable = false, ...props }, ref) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = React.useState(false)
    const [canScrollRight, setCanScrollRight] = React.useState(false)

    const updateScrollButtons = React.useCallback(() => {
      const container = scrollContainerRef.current
      if (!container) return
      setCanScrollLeft(container.scrollLeft > 0)
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 1)
    }, [])

    React.useEffect(() => {
      updateScrollButtons()
      const container = scrollContainerRef.current
      if (!container) return
      container.addEventListener("scroll", updateScrollButtons)
      window.addEventListener("resize", updateScrollButtons)
      return () => {
        container.removeEventListener("scroll", updateScrollButtons)
        window.removeEventListener("resize", updateScrollButtons)
      }
    }, [updateScrollButtons])

    React.useEffect(() => {
      updateScrollButtons()
    }, [children, updateScrollButtons])

    const scroll = (direction: "left" | "right") => {
      const container = scrollContainerRef.current
      if (!container) return
      const scrollAmount = container.clientWidth * 0.6
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        <LayoutGroup>
          {scrollable && canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              type="button"
              onClick={() => scroll("left")}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                "h-9 w-9 flex items-center justify-center",
                "bg-white/95 backdrop-blur-sm",
                "text-primary-600 hover:text-primary-700",
                "shadow-soft hover:shadow-card",
                "rounded-full border border-neutral-200",
                "transition-all duration-200"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
          )}
          <div
            ref={scrollContainerRef}
            className={cn(
              "relative flex items-center gap-1",
              "border-b border-neutral-200",
              scrollable && [
                "overflow-x-auto scrollbar-hide",
                canScrollLeft && "pl-10",
                canScrollRight && "pr-10",
              ]
            )}
            style={{ scrollbarWidth: "none" }}
          >
            {children}
          </div>
          {scrollable && canScrollRight && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              type="button"
              onClick={() => scroll("right")}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                "h-9 w-9 flex items-center justify-center",
                "bg-white/95 backdrop-blur-sm",
                "text-primary-600 hover:text-primary-700",
                "shadow-soft hover:shadow-card",
                "rounded-full border border-neutral-200",
                "transition-all duration-200"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          )}
        </LayoutGroup>
      </div>
    )
  }
)
TabList.displayName = "TabList"

export const Tab: React.FC<TabProps> = ({
  value,
  disabled = false,
  icon,
  children,
  className,
}) => {
  const { value: activeValue, setValue, registerTab, unregisterTab } = useTabsContext()
  const isActive = activeValue === value
  const tabRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    registerTab(value, tabRef)
    return () => unregisterTab(value)
  }, [value, registerTab, unregisterTab])

  return (
    <button
      ref={tabRef}
      type="button"
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => !disabled && setValue(value)}
      className={cn(
        "relative group",
        "inline-flex items-center gap-2",
        "px-4 py-3 -mb-px",
        "text-sm font-medium whitespace-nowrap",
        "transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 focus-visible:ring-offset-2 rounded-t-md",
        isActive
          ? "text-primary-600"
          : "text-neutral-500 hover:text-primary-500",
        disabled && "opacity-40 cursor-not-allowed hover:text-neutral-500",
        className
      )}
    >
      {icon && (
        <span className={cn(
          "transition-colors duration-200",
          isActive ? "text-primary-500" : "text-neutral-400 group-hover:text-primary-400"
        )}>
          {icon}
        </span>
      )}
      {children}
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-gold-500 rounded-t-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 40 }}
        />
      )}
    </button>
  )
}
Tab.displayName = "Tab"

export const TabPanel: React.FC<TabPanelProps> = ({
  value,
  children,
  className,
}) => {
  const { value: activeValue, getTabRef } = useTabsContext()
  const isActive = activeValue === value

  if (!isActive) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={value}
        role="tabpanel"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className={cn("pt-5 outline-none", className)}
        tabIndex={0}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
TabPanel.displayName = "TabPanel"
