import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, MessageSquare, Filter, Star, Inbox, Clock, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { projects, creators, brands, users } from "@/services/mockData"
import { useAuthStore } from "@/store/authStore"
import { useAppStore } from "@/store/appStore"

type FilterType = "all" | "unread" | "important"

interface ConversationItem {
  id: string
  projectId: string
  projectTitle: string
  projectStatus: string
  counterpartName: string
  counterpartAvatar: string
  counterpartRole: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isImportant: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
}

const formatTime = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays === 0) {
    return date.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })
  } else if (diffDays === 1) {
    return "昨天"
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  }
  return date.toLocaleDateString("zh-CN", { month: "2-digit", day: "2-digit" })
}

const getMockConversations = (userId?: string, userRole?: string): ConversationItem[] => {
  let filteredProjects = projects
  
  if (userId && userRole) {
    if (userRole === 'creator') {
      const creator = creators.find((c) => c.userId === userId)
      if (creator) {
        filteredProjects = projects.filter((p) => p.creatorId === creator.id)
      }
    } else if (userRole === 'brand') {
      const brand = brands.find((b) => b.userId === userId)
      if (brand) {
        filteredProjects = projects.filter((p) => p.brandId === brand.id)
      }
    }
  }

  return filteredProjects.map((project, index) => {
    const creator = creators.find((c) => c.id === project.creatorId)
    const brand = brands.find((b) => b.id === project.brandId)
    
    let counterpart: typeof creators[number] | typeof brands[number] | undefined
    let counterpartUser: typeof users[number] | undefined
    let counterpartRole: string
    
    if (userRole === 'creator') {
      counterpart = brand
      counterpartUser = users.find((u) => u.id === brand?.userId)
      counterpartRole = "品牌方"
    } else if (userRole === 'brand') {
      counterpart = creator
      counterpartUser = users.find((u) => u.id === creator?.userId)
      counterpartRole = "创作方"
    } else {
      counterpart = index % 2 === 0 ? creator : brand
      counterpartUser = users.find(
        (u) => u.id === (index % 2 === 0 ? creator?.userId : brand?.userId)
      )
      counterpartRole = index % 2 === 0 ? "创作方" : "品牌方"
    }

    const lastMessages = [
      "您好，请问合作方案有什么新的进展吗？",
      "脚本已经修改好了，请查收附件~",
      "拍摄效果非常棒，期待成片！",
      "合同已经签署，请确认一下。",
      "KPI数据已达标，可以进行结算了。",
      "新品发布会时间确定了吗？",
    ]

    const times = [
      new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    ]

    const counterpartAvatar = userRole === 'brand'
      ? (counterpart as typeof creators[number])?.avatar || counterpartUser?.avatar || ""
      : (counterpart as typeof brands[number])?.logo || counterpartUser?.avatar || ""
      
    return {
      id: `conv-${project.id}`,
      projectId: project.id,
      projectTitle: project.title,
      projectStatus: project.status,
      counterpartName: counterpart?.name || counterpartUser?.name || "未知用户",
      counterpartAvatar,
      counterpartRole,
      lastMessage: lastMessages[index % lastMessages.length],
      lastMessageTime: times[index % times.length],
      unreadCount: index === 0 ? 3 : index === 1 ? 1 : 0,
      isImportant: index === 0 || index === 3,
    }
  })
}

export default function ChatIndex() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getCreatorByUserId, getBrandByUserId } = useAppStore()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterType, setFilterType] = React.useState<FilterType>("all")

  const conversations = React.useMemo<ConversationItem[]>(() => {
    if (!user) return []
    return getMockConversations(user.id, user.role)
  }, [user])

  const filteredConversations = React.useMemo(() => {
    return conversations.filter((conv) => {
      const matchesSearch =
        conv.projectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.counterpartName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

      if (filterType === "unread") {
        return matchesSearch && conv.unreadCount > 0
      }
      if (filterType === "important") {
        return matchesSearch && conv.isImportant
      }
      return matchesSearch
    })
  }, [conversations, searchQuery, filterType])

  const handleOpenChat = (projectId: string) => {
    navigate(`/chat/${projectId}`)
  }

  const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "全部", icon: <Inbox className="h-4 w-4" /> },
    { key: "unread", label: "未读", icon: <MessageSquare className="h-4 w-4" /> },
    { key: "important", label: "重要", icon: <Star className="h-4 w-4" /> },
  ]

  return (
    <div className="h-full flex flex-col bg-gradient-subtle">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-6 pt-6 pb-4 bg-white/80 backdrop-blur-sm border-b border-neutral-200"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-primary-900 font-display">沟通中心</h1>
            <p className="text-sm text-neutral-500 mt-1">管理所有项目的商务沟通</p>
          </div>
          <Button
            variant="gold"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {}}
          >
            新建会话
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="搜索项目名称、联系人或消息..."
              prefixIcon={<Search className="h-4 w-4" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg">
            {filters.map((filter) => (
              <motion.button
                key={filter.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setFilterType(filter.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  filterType === filter.key
                    ? "bg-white text-primary-700 shadow-sm"
                    : "text-neutral-600 hover:text-primary-600"
                )}
              >
                {filter.icon}
                {filter.label}
                {filter.key === "unread" &&
                  conversations.filter((c) => c.unreadCount > 0).length > 0 && (
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-danger-500 text-white rounded-full">
                      {conversations.filter((c) => c.unreadCount > 0).length}
                    </span>
                  )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-6">
        <AnimatePresence mode="wait">
          {filteredConversations.length > 0 ? (
            <motion.div
              key="list"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid gap-3"
            >
              {filteredConversations.map((conv) => (
                <motion.div
                  key={conv.id}
                  variants={itemVariants}
                  whileHover={{ x: 4, backgroundColor: "rgba(30, 58, 95, 0.03)" }}
                  whileTap={{ scale: 0.995 }}
                  onClick={() => handleOpenChat(conv.projectId)}
                  className={cn(
                    "relative p-4 bg-white rounded-xl border cursor-pointer transition-all duration-200",
                    conv.unreadCount > 0
                      ? "border-primary-200 shadow-soft"
                      : "border-neutral-200 hover:border-primary-200"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <Avatar
                        src={conv.counterpartAvatar}
                        alt={conv.counterpartName}
                        size="lg"
                        status="online"
                        goldBorder={conv.isImportant}
                      />
                      {conv.unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 25 }}
                          className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center px-1.5 text-xs font-bold text-white bg-danger-500 rounded-full shadow-md"
                        >
                          {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                        </motion.span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3
                            className={cn(
                              "font-semibold truncate",
                              conv.unreadCount > 0 ? "text-primary-900" : "text-primary-800"
                            )}
                          >
                            {conv.projectTitle}
                          </h3>
                          {conv.isImportant && (
                            <Star className="h-4 w-4 shrink-0 text-gold-500 fill-gold-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <Clock className="h-3.5 w-3.5 text-neutral-400" />
                          <span className="text-xs text-neutral-500">
                            {formatTime(conv.lastMessageTime)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-neutral-600">{conv.counterpartName}</span>
                        <Badge variant="primary" className="text-[10px] px-1.5 py-0">
                          {conv.counterpartRole}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <p
                          className={cn(
                            "text-sm truncate",
                            conv.unreadCount > 0
                              ? "text-primary-700 font-medium"
                              : "text-neutral-500"
                          )}
                        >
                          {conv.lastMessage}
                        </p>
                        <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 mb-5 rounded-full bg-primary-50 flex items-center justify-center"
              >
                <MessageSquare className="h-10 w-10 text-primary-300" />
              </motion.div>
              <h3 className="text-lg font-semibold text-primary-800 mb-2">暂无会话</h3>
              <p className="text-sm text-neutral-500 mb-6 max-w-xs">
                {searchQuery || filterType !== "all"
                  ? "没有找到符合条件的会话，试试其他关键词或筛选条件"
                  : "开始您的第一个商务合作对话吧"}
              </p>
              <Button
                variant="gold"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => {}}
              >
                新建会话
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
