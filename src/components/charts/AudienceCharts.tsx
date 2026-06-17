import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AudienceData } from "@/types"

const GENDER_COLORS = {
  male: "#4D6FA4",
  female: "#C9A961",
  other: "#A8A29E",
}

const GENDER_LABELS: Record<string, string> = {
  male: "男性",
  female: "女性",
  other: "其他",
}

const HEATMAP_COLORS = [
  "#D9E2EF",
  "#B3C6DF",
  "#8DA9CF",
  "#4D6FA4",
  "#1E3A5F",
]

const INTEREST_COLORS = [
  "bg-primary-100 text-primary-700 border-primary-200",
  "bg-gold-100 text-gold-700 border-gold-300",
  "bg-success-100 text-success-700 border-success-200",
  "bg-warning-100 text-warning-700 border-warning-200",
  "bg-danger-100 text-danger-700 border-danger-200",
]

interface GenderDonutProps {
  data: AudienceData["genderRatio"]
  className?: string
}

export function GenderDonut({ data, className }: GenderDonutProps) {
  const chartData = [
    { name: GENDER_LABELS.male, value: data.male, key: "male" },
    { name: GENDER_LABELS.female, value: data.female, key: "female" },
    { name: GENDER_LABELS.other, value: data.other, key: "other" },
  ]

  const total = data.male + data.female + data.other

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary-50">
          <Users className="h-4 w-4 text-primary-600" />
        </div>
        <h4 className="font-semibold text-sm text-primary-900">性别分布</h4>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.key}
                  fill={GENDER_COLORS[entry.key as keyof typeof GENDER_COLORS]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, "占比"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E7E5E4",
                boxShadow: "0 4px 16px rgba(30, 58, 95, 0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-4 mt-3">
        {chartData.map((item) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{
                backgroundColor:
                  GENDER_COLORS[item.key as keyof typeof GENDER_COLORS],
              }}
            />
            <span className="text-xs text-neutral-600">
              {item.name}:{" "}
              <span className="font-medium text-primary-800">
                {total > 0
                  ? ((item.value / total) * 100).toFixed(0)
                  : item.value}
                %
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

interface AgeBarChartProps {
  data: AudienceData["ageDistribution"]
  className?: string
}

export function AgeBarChart({ data, className }: AgeBarChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-gold-50">
          <Users className="h-4 w-4 text-gold-600" />
        </div>
        <h4 className="font-semibold text-sm text-primary-900">年龄分布</h4>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ left: 10, right: 20, top: 5, bottom: 5 }}
          >
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "#78716C" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `${val}%`}
            />
            <YAxis
              type="category"
              dataKey="range"
              tick={{ fontSize: 11, fill: "#57534E" }}
              tickLine={false}
              axisLine={false}
              width={45}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, "占比"]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #E7E5E4",
                boxShadow: "0 4px 16px rgba(30, 58, 95, 0.08)",
              }}
            />
            <Bar
              dataKey="percentage"
              radius={[0, 6, 6, 0]}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
              fill="url(#ageGradient)"
            >
              <defs>
                <linearGradient id="ageGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8DA9CF" />
                  <stop offset="100%" stopColor="#1E3A5F" />
                </linearGradient>
              </defs>
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

interface GeoMapHeatProps {
  data: AudienceData["geoDistribution"]
  className?: string
}

export function GeoMapHeat({ data, className }: GeoMapHeatProps) {
  const maxValue = Math.max(...data.map((d) => d.percentage), 1)

  const getHeatColor = (value: number) => {
    const ratio = value / maxValue
    const index = Math.min(
      Math.floor(ratio * HEATMAP_COLORS.length),
      HEATMAP_COLORS.length - 1
    )
    return HEATMAP_COLORS[index]
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-success-50">
          <Users className="h-4 w-4 text-success-600" />
        </div>
        <h4 className="font-semibold text-sm text-primary-900">地域分布</h4>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {data.map((item, index) => (
          <motion.div
            key={item.region}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: 0.05 * index,
              ease: "easeOut",
            }}
            className="relative rounded-lg overflow-hidden aspect-square flex flex-col items-center justify-center text-white shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{ backgroundColor: getHeatColor(item.percentage) }}
          >
            <span className="text-xs font-bold opacity-90">
              {item.region}
            </span>
            <span className="text-[10px] mt-0.5 opacity-80">
              {item.percentage}%
            </span>
          </motion.div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-4">
        <span className="text-[10px] text-neutral-500">低</span>
        {HEATMAP_COLORS.map((color, index) => (
          <div
            key={index}
            className="w-5 h-2 rounded-sm"
            style={{ backgroundColor: color }}
          />
        ))}
        <span className="text-[10px] text-neutral-500">高</span>
      </div>
    </motion.div>
  )
}

interface InterestTagsProps {
  data: AudienceData["interests"]
  className?: string
}

export function InterestTags({ data, className }: InterestTagsProps) {
  const maxScore = Math.max(...data.map((d) => d.score), 1)

  const getTagSize = (score: number) => {
    const ratio = score / maxScore
    if (ratio > 0.8) return "text-sm py-2 px-3.5"
    if (ratio > 0.6) return "text-xs py-1.5 px-3"
    if (ratio > 0.4) return "text-xs py-1 px-2.5"
    return "text-[11px] py-1 px-2"
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-white rounded-xl border border-neutral-200 p-5",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-warning-50">
          <Users className="h-4 w-4 text-warning-600" />
        </div>
        <h4 className="font-semibold text-sm text-primary-900">兴趣标签</h4>
      </div>
      <div className="flex flex-wrap gap-2">
        {data.map((item, index) => (
          <motion.span
            key={item.tag}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: 0.05 * index,
              ease: "easeOut",
            }}
            whileHover={{
              scale: 1.05,
              transition: { duration: 0.15 },
            }}
            className={cn(
              "inline-flex items-center rounded-full border font-medium cursor-default",
              getTagSize(item.score),
              INTEREST_COLORS[index % INTEREST_COLORS.length]
            )}
          >
            {item.tag}
            <span className="ml-1.5 opacity-60 text-[10px]">
              {item.score}
            </span>
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

interface AudienceChartsProps {
  data: AudienceData
  className?: string
}

export function AudienceCharts({ data, className }: AudienceChartsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-4",
        className
      )}
    >
      <GenderDonut data={data.genderRatio} />
      <AgeBarChart data={data.ageDistribution} />
      <GeoMapHeat data={data.geoDistribution} />
      <InterestTags data={data.interests} />
    </div>
  )
}
