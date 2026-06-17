import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import { Target, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatNumber } from "@/utils/format"

export type KpiVariant = "primary" | "gold" | "success" | "warning" | "danger"

interface KpiGaugeProps {
  actual: number
  target: number
  label?: string
  unit?: string
  threshold?: number
  className?: string
  variant?: KpiVariant
}

const variantColors: Record<
  KpiVariant,
  {
    gradient: [string, string]
    text: string
    bg: string
    track: string
  }
> = {
  primary: {
    gradient: ["#8DA9CF", "#1E3A5F"],
    text: "text-primary-700",
    bg: "bg-primary-50",
    track: "#E7E5E4",
  },
  gold: {
    gradient: ["#DBC58D", "#C9A961"],
    text: "text-gold-700",
    bg: "bg-gold-50",
    track: "#E7E5E4",
  },
  success: {
    gradient: ["#6EE7B7", "#10B981"],
    text: "text-success-700",
    bg: "bg-success-50",
    track: "#E7E5E4",
  },
  warning: {
    gradient: ["#FCD34D", "#F59E0B"],
    text: "text-warning-700",
    bg: "bg-warning-50",
    track: "#E7E5E4",
  },
  danger: {
    gradient: ["#FCA5A5", "#EF4444"],
    text: "text-danger-700",
    bg: "bg-danger-50",
    track: "#E7E5E4",
  },
}

function getVariantByPercentage(
  percentage: number,
  threshold: number
): KpiVariant {
  if (percentage < threshold) return "danger"
  if (percentage < 0.7) return "warning"
  if (percentage < 0.9) return "gold"
  return "success"
}

export function KpiGauge({
  actual,
  target,
  label = "KPI完成度",
  unit = "",
  threshold = 0.5,
  className,
  variant,
}: KpiGaugeProps) {
  const percentage = target > 0 ? Math.min(actual / target, 1) : 0
  const displayPercentage = Math.round(percentage * 100)

  const effectiveVariant = variant ?? getVariantByPercentage(percentage, threshold)
  const colors = variantColors[effectiveVariant]
  const isBelowThreshold = percentage < threshold

  const gaugeGradientId = `kpi-gradient-${Math.random().toString(36).slice(2, 9)}`

  const data = [
    { name: "value", value: percentage * 180 },
    { name: "remaining", value: Math.max(180 - percentage * 180, 0) },
  ]

  const startAngle = 180
  const endAngle = 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 p-5 relative overflow-hidden",
        className
      )}
    >
      {isBelowThreshold && (
        <div className="absolute top-3 right-3">
          <motion.div
            animate={{
              opacity: [1, 0.4, 1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-danger-50 border border-danger-200"
          >
            <AlertTriangle className="h-3 w-3 text-danger-500" />
            <span className="text-[10px] font-medium text-danger-700">
              低于阈值
            </span>
          </motion.div>
        </div>
      )}

      <div className="flex items-center gap-2 mb-2">
        <div className={cn("p-1.5 rounded-lg", colors.bg)}>
          <Target className={cn("h-4 w-4", colors.text)} />
        </div>
        <h4 className="font-semibold text-sm text-primary-900">{label}</h4>
      </div>

      <div className="relative h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <defs>
              <linearGradient id={gaugeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={colors.gradient[0]} />
                <stop offset="100%" stopColor={colors.gradient[1]} />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={1000}
              animationEasing="ease-out"
            >
              <Cell fill={`url(#${gaugeGradientId})`} />
              <Cell fill={colors.track} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end pb-1">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className={cn(
              "text-4xl font-bold font-display tabular-nums",
              colors.text,
              isBelowThreshold && "animate-pulse"
            )}
          >
            {displayPercentage}%
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
        className="flex items-center justify-between mt-2 px-2"
      >
        <div className="text-center">
          <div className="text-[10px] text-neutral-500 mb-0.5">实际值</div>
          <div className="text-sm font-semibold text-primary-800 font-mono tabular-nums">
            {formatNumber(actual)}
            {unit && <span className="text-[10px] text-neutral-500 ml-0.5">{unit}</span>}
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-px h-6 bg-neutral-200" />
        </div>
        <div className="text-center">
          <div className="text-[10px] text-neutral-500 mb-0.5">目标值</div>
          <div className="text-sm font-semibold text-neutral-600 font-mono tabular-nums">
            {formatNumber(target)}
            {unit && <span className="text-[10px] text-neutral-500 ml-0.5">{unit}</span>}
          </div>
        </div>
      </motion.div>

      {isBelowThreshold && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="mt-3 pt-3 border-t border-neutral-100"
        >
          <div className="flex items-center gap-1.5 text-xs text-danger-600">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span>
              当前完成度 {(displayPercentage)}%，低于阈值 {Math.round(threshold * 100)}%，请注意跟进
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
