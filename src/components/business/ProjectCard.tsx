import { motion } from "framer-motion"
import {
  DollarSign,
  MessageCircle,
  FileText,
  MoreHorizontal,
  Calendar,
  Circle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"
import { Avatar, AvatarGroup } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Progress } from "@/components/ui/Progress"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDate } from "@/utils/format"
import type { Project, Milestone } from "@/types"

type ProjectStatus = Project["status"]

const statusConfig: Record<
  ProjectStatus,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "gold" | "primary"; dot: boolean }
> = {
  pending: { label: "待审核", variant: "default", dot: true },
  negotiating: { label: "洽谈中", variant: "warning", dot: true },
  signed: { label: "已签约", variant: "primary", dot: true },
  executing: { label: "执行中", variant: "gold", dot: true },
  delivered: { label: "已交付", variant: "success", dot: false },
  completed: { label: "已完成", variant: "success", dot: false },
  cancelled: { label: "已取消", variant: "danger", dot: false },
}

const milestoneStatusIcon: Record<Milestone["status"], React.ReactNode> = {
  pending: <Circle className="h-3 w-3 text-neutral-400" />,
  in_progress: <Clock className="h-3 w-3 text-gold-500" />,
  submitted: <Clock className="h-3 w-3 text-warning-500" />,
  approved: <CheckCircle2 className="h-3 w-3 text-success-500" />,
  rejected: <XCircle className="h-3 w-3 text-danger-500" />,
}

interface ProjectCardProps {
  project: Project
  creatorAvatar?: string
  creatorName?: string
  brandAvatar?: string
  brandName?: string
  onMessage?: (project: Project) => void
  onViewDetail?: (project: Project) => void
  onMore?: (project: Project) => void
}

export function ProjectCard({
  project,
  creatorAvatar,
  creatorName,
  brandAvatar,
  brandName,
  onMessage,
  onViewDetail,
  onMore,
}: ProjectCardProps) {
  const statusInfo = statusConfig[project.status]

  const completedMilestones = project.milestones.filter(
    (m) => m.status === "approved"
  ).length
  const progressPercent = project.milestones.length > 0
    ? Math.round((completedMilestones / project.milestones.length) * 100)
    : 0

  const progressVariant =
    project.status === "completed" || project.status === "delivered"
      ? "success"
      : project.status === "cancelled"
      ? "danger"
      : "gold"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -4,
        boxShadow: "0 12px 40px rgba(30, 58, 95, 0.12)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className="rounded-xl bg-white border border-neutral-200 overflow-hidden hover:border-gold-300 transition-colors duration-300"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-primary-900 truncate font-display">
                {project.title}
              </h3>
            </div>
            <div className="mt-1.5">
              <Badge variant={statusInfo.variant} dot={statusInfo.dot} pulse={statusInfo.dot}>
                {statusInfo.label}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <div className="flex items-center gap-1">
            <AvatarGroup size="sm" max={2}>
              {creatorAvatar && (
                <Avatar src={creatorAvatar} alt={creatorName ?? "创作方"} size="sm" />
              )}
              {brandAvatar && (
                <Avatar src={brandAvatar} alt={brandName ?? "品牌方"} size="sm" />
              )}
            </AvatarGroup>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <DollarSign className="h-3.5 w-3.5" />
            <span className="font-semibold text-primary-700">
              {formatCurrency(project.budget)}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-500">项目进度</span>
            <span className="text-xs font-medium text-primary-700">
              {completedMilestones}/{project.milestones.length} 节点
            </span>
          </div>
          <Progress
            value={progressPercent}
            variant={progressVariant}
            size="sm"
          />
        </div>

        <div className="mt-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-2.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>关键节点</span>
          </div>
          <div className="flex items-center gap-0">
            {project.milestones.slice(0, 4).map((milestone, index) => (
              <div key={milestone.id} className="flex items-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 + index * 0.08,
                    ease: "easeOut",
                  }}
                  className="flex items-center justify-center"
                  title={`${milestone.title} - ${formatDate(milestone.dueDate)}`}
                >
                  {milestoneStatusIcon[milestone.status]}
                </motion.div>
                {index < Math.min(project.milestones.length, 4) - 1 && (
                  <div
                    className={cn(
                      "w-6 h-0.5 mx-1",
                      milestone.status === "approved"
                        ? "bg-success-400"
                        : "bg-neutral-200"
                    )}
                  />
                )}
              </div>
            ))}
            {project.milestones.length > 4 && (
              <span className="text-xs text-neutral-400 ml-1.5">
                +{project.milestones.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-5 py-3 bg-neutral-50/50 border-t border-neutral-100">
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onMessage?.(project)}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">消息</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={() => onViewDetail?.(project)}
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">详情</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onMore?.(project)}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
