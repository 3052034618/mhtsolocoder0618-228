import { motion } from "framer-motion"
import {
  BadgeCheck,
  Users,
  Eye,
  Heart,
  DollarSign,
  ChevronRight,
  Music,
  Video,
  BookOpen,
  PlayCircle,
  MessageCircle,
  Zap,
} from "lucide-react"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { formatNumber, formatCurrency } from "@/utils/format"
import type { CreatorProfile } from "@/types"

const platformIcons: Record<string, React.ReactNode> = {
  douyin: <Music className="h-3 w-3" />,
  bilibili: <Video className="h-3 w-3" />,
  xiaohongshu: <BookOpen className="h-3 w-3" />,
  youtube: <PlayCircle className="h-3 w-3" />,
  weibo: <MessageCircle className="h-3 w-3" />,
  kuaishou: <Zap className="h-3 w-3" />,
}

const platformNames: Record<string, string> = {
  douyin: "抖音",
  bilibili: "哔哩哔哩",
  xiaohongshu: "小红书",
  youtube: "YouTube",
  weibo: "微博",
  kuaishou: "快手",
}

interface CreatorCardProps {
  creator: CreatorProfile
  onViewDetail?: (creator: CreatorProfile) => void
  avgViews?: number
  engagementRate?: number
  startingPrice?: number
}

export function CreatorCard({
  creator,
  onViewDetail,
  avgViews,
  engagementRate,
  startingPrice,
}: CreatorCardProps) {
  const totalFollowers = creator.platforms.reduce(
    (sum, p) => sum + p.followers,
    0
  )

  const defaultAvgViews =
    avgViews ??
    creator.platforms.reduce((sum, p) => sum + p.avgViews, 0) /
      Math.max(creator.platforms.length, 1)

  const stats = [
    {
      icon: Eye,
      label: "平均播放量",
      value: formatNumber(defaultAvgViews),
      color: "from-primary-50 to-primary-100 text-primary-700 border-primary-200",
      iconBg: "bg-primary-500",
    },
    {
      icon: Heart,
      label: "互动率",
      value: `${(engagementRate ?? 5.8).toFixed(1)}%`,
      color: "from-gold-50 to-gold-100 text-gold-700 border-gold-300",
      iconBg: "bg-gradient-gold",
    },
    {
      icon: DollarSign,
      label: "起投价",
      value: formatCurrency(startingPrice ?? 15000),
      color: "from-success-50 to-success-100 text-success-700 border-success-200",
      iconBg: "bg-success-500",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -6,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className="group relative rounded-xl bg-white overflow-hidden"
    >
      <div
        className={cn(
          "absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "border-2 border-gold-400 shadow-gold-lg",
          "before:absolute before:inset-0 before:rounded-xl before:pointer-events-none",
          "before:bg-gradient-to-br before:from-gold-100/30 before:via-transparent before:to-gold-100/20"
        )}
      />

      <div className="relative p-5 border border-neutral-200 rounded-xl group-hover:border-transparent transition-colors duration-300 bg-white">
        <div className="flex items-start gap-4">
          <Avatar
            src={creator.avatar}
            alt={creator.name}
            size="lg"
            goldBorder
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg text-primary-900 truncate font-display">
                {creator.name}
              </h3>
              <BadgeCheck className="h-5 w-5 text-gold-500 shrink-0" />
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Users className="h-3.5 w-3.5 text-neutral-500" />
              <span className="text-sm text-neutral-600">
                总粉丝 {formatNumber(totalFollowers)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {creator.platforms.map((platform) => (
            <Badge
              key={platform.type}
              variant="default"
              className="gap-1"
            >
              {platformIcons[platform.type] ?? (
                <Zap className="h-3 w-3" />
              )}
              <span>{platformNames[platform.type] ?? platform.type}</span>
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5 mt-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 0.1 + index * 0.08,
                  ease: "easeOut",
                }}
                className={cn(
                  "rounded-lg p-2.5 border bg-gradient-to-br",
                  stat.color
                )}
              >
                <div
                  className={cn(
                    "inline-flex items-center justify-center rounded-md p-1 mb-1",
                    stat.iconBg
                  )}
                >
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <div className="font-bold text-sm">{stat.value}</div>
                <div className="text-[10px] opacity-75 mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {creator.categories.slice(0, 4).map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-full bg-neutral-50 px-2.5 py-1 text-xs text-neutral-600 border border-neutral-200"
            >
              {category}
            </span>
          ))}
          {creator.categories.length > 4 && (
            <span className="inline-flex items-center rounded-full bg-neutral-50 px-2.5 py-1 text-xs text-neutral-500 border border-neutral-200">
              +{creator.categories.length - 4}
            </span>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-100">
          <Button
            variant="outline"
            size="sm"
            className="w-full group/btn"
            onClick={() => onViewDetail?.(creator)}
          >
            查看详情
            <ChevronRight className="h-4 w-4 ml-1 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
