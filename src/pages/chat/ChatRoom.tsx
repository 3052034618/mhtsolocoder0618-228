import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  FileText,
  Package,
  BarChart3,
  Send,
  Smile,
  Paperclip,
  AtSign,
  Sparkles,
  Download,
  Check,
  CheckCheck,
  Search,
  MoreVertical,
  ChevronRight,
  Clock,
  Star,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Avatar } from "@/components/ui/Avatar"
import { Badge } from "@/components/ui/Badge"
import { projects, creators, brands, users } from "@/services/mockData"
import { useAppStore } from "@/store/appStore"
import { useAuthStore } from "@/store/authStore"
import type { Message } from "@/services/mockData"

type MessageType = "text" | "file" | "system"

interface UIMessage {
  id: string
  conversationId: string
  senderId: string
  receiverId: string
  content: string
  type: MessageType
  senderName: string
  senderAvatar: string
  senderRole: "brand" | "creator" | "system"
  fileName?: string
  fileSize?: string
  timestamp: string
  isRead: boolean
}

interface ConversationInfo {
  projectId: string
  projectTitle: string
  projectStatus: string
  creatorName: string
  creatorAvatar: string
  brandName: string
  brandAvatar: string
}

const quickTemplates = [
  "您好，请问有什么可以帮您的？",
  "好的，我这边马上处理~",
  "收到，稍后给您反馈。",
  "方案已收到，正在审核中。",
  "感谢您的耐心等待！",
]

const formatMessageTime = (dateStr: string): string => {
  return new Date(dateStr).toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const getMockConversation = (projectId: string, userId?: string, userRole?: string): ConversationInfo | null => {
  const project = projects.find((p) => p.id === projectId)
  if (!project) return null
  
  if (userId && userRole) {
    if (userRole === 'creator') {
      const creator = creators.find((c) => c.userId === userId)
      if (!creator || project.creatorId !== creator.id) return null
    } else if (userRole === 'brand') {
      const brand = brands.find((b) => b.userId === userId)
      if (!brand || project.brandId !== brand.id) return null
    }
  }
  
  const creator = creators.find((c) => c.id === project.creatorId)
  const brand = brands.find((b) => b.id === project.brandId)
  return {
    projectId: project.id,
    projectTitle: project.title,
    projectStatus: project.status,
    creatorName: creator?.name || "创作方",
    creatorAvatar: creator?.avatar || "",
    brandName: brand?.name || "品牌方",
    brandAvatar: brand?.logo || "",
  }
}

export default function ChatRoom() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [conversation, setConversation] = React.useState<ConversationInfo | null>(null)
  const [inputValue, setInputValue] = React.useState("")
  const [showTemplates, setShowTemplates] = React.useState(false)
  const { user } = useAuthStore()
  const { getMessagesByProject, sendMessage, getCreatorByUserId, getBrandByUserId, getProjectsByCreator, getProjectsByBrand } = useAppStore()

  const convertToUIMessage = (msg: Message): UIMessage => {
    const isSystem = msg.senderId === "system"
    let sender = { name: "未知用户", avatar: "", role: "creator" as "brand" | "creator" | "system" }

    if (isSystem) {
      sender = { name: "系统", avatar: "", role: "system" }
    } else {
      const creator = creators.find((c) => c.userId === msg.senderId)
      if (creator) {
        sender = { name: creator.name, avatar: creator.avatar, role: "creator" }
      } else {
        const brand = brands.find((b) => b.userId === msg.senderId)
        if (brand) {
          sender = { name: brand.name, avatar: brand.logo, role: "brand" }
        }
      }
    }

    return {
      id: msg.id,
      conversationId: msg.conversationId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      content: msg.content,
      type: isSystem ? "system" : "text",
      senderName: sender.name,
      senderAvatar: sender.avatar,
      senderRole: sender.role,
      timestamp: msg.createdAt,
      isRead: msg.read,
    }
  }

  const messages = React.useMemo(() => {
    if (!projectId) return []
    const storeMessages = getMessagesByProject(projectId)
    return storeMessages.map(convertToUIMessage)
  }, [projectId, getMessagesByProject])
  
  const userProjects = React.useMemo(() => {
    if (!user) return []
    if (user.role === 'creator') {
      const creator = getCreatorByUserId(user.id)
      if (creator) {
        return getProjectsByCreator(creator.id)
      }
    } else if (user.role === 'brand') {
      const brand = getBrandByUserId(user.id)
      if (brand) {
        return getProjectsByBrand(brand.id)
      }
    }
    return []
  }, [user, getCreatorByUserId, getBrandByUserId, getProjectsByCreator, getProjectsByBrand])

  React.useEffect(() => {
    if (projectId && user) {
      const conv = getMockConversation(projectId, user.id, user.role)
      setConversation(conv)
    }
  }, [projectId, user])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim() || !projectId || !user) return
    sendMessage(projectId, user.id, inputValue.trim())
    setInputValue("")
    setShowTemplates(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectTemplate = (template: string) => {
    setInputValue(template)
    setShowTemplates(false)
  }

  if (!conversation) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="h-full flex bg-gradient-subtle">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-72 shrink-0 border-r border-neutral-200 bg-white/60 backdrop-blur-sm flex flex-col"
      >
        <div className="p-4 border-b border-neutral-200">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            onClick={() => navigate("/chat")}
            className="mb-3"
          >
            返回会话列表
          </Button>
          <h3 className="text-sm font-medium text-neutral-500 mb-3">项目会话</h3>
          <div className="space-y-1.5 max-h-96 overflow-y-auto">
            {userProjects.map((project, index) => {
              const isActive = project.id === projectId
              const isCreatorSide = user?.role === 'brand'
              const counterpart = isCreatorSide
                ? creators.find((c) => c.id === project.creatorId)
                : brands.find((b) => b.id === project.brandId)
              const counterpartAvatar = user?.role === 'brand'
                ? (counterpart as typeof creators[number] | undefined)?.avatar || ""
                : (counterpart as typeof brands[number] | undefined)?.logo || ""
              return (
                <motion.button
                  key={project.id}
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(`/chat/${project.id}`)}
                  className={cn(
                    "w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all duration-200",
                    isActive
                      ? "bg-primary-50 border border-primary-200"
                      : "hover:bg-neutral-50 border border-transparent"
                  )}
                >
                  <Avatar
                    src={counterpartAvatar}
                    alt={counterpart?.name}
                    size="sm"
                    goldBorder={index === 0}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium truncate",
                        isActive ? "text-primary-700" : "text-primary-900"
                      )}
                    >
                      {project.title}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {counterpart?.name}
                    </p>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col min-w-0">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-neutral-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar src={conversation.creatorAvatar} alt={conversation.creatorName} size="md" />
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 text-gold-500 mx-1" />
                </div>
                <Avatar src={conversation.brandAvatar} alt={conversation.brandName} size="md" goldBorder />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h2 className="text-lg font-semibold text-primary-900 font-display">
                    {conversation.projectTitle}
                  </h2>
                  <Badge variant="gold" dot pulse>
                    {conversation.projectStatus === "completed"
                      ? "已完成"
                      : conversation.projectStatus === "executing"
                      ? "执行中"
                      : conversation.projectStatus === "signed"
                      ? "已签约"
                      : conversation.projectStatus === "negotiating"
                      ? "洽谈中"
                      : "待审核"}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500">
                  {conversation.creatorName} · {conversation.brandName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<FileText className="h-4 w-4" />}
                onClick={() => navigate(`/contract/${conversation.projectId}`)}
              >
                查看合同
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<Package className="h-4 w-4" />}>
                交付物
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<BarChart3 className="h-4 w-4" />}>
                效果报告
              </Button>
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => {
              const isSystem = message.type === "system"
              const isCurrentUser = message.senderId === user?.id

              if (isSystem) {
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center py-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-300" />
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-200">
                        <Sparkles className="h-3.5 w-3.5 text-gold-600" />
                        <span className="text-xs font-medium text-gold-700">{message.content}</span>
                      </div>
                      <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-300" />
                    </div>
                  </motion.div>
                )
              }

              const isFile = message.type === "file"

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={cn("flex gap-3", isCurrentUser ? "justify-end" : "justify-start")}
                >
                  {!isCurrentUser && (
                    <Avatar
                      src={message.senderAvatar}
                      alt={message.senderName}
                      size="sm"
                      className="mt-1"
                    />
                  )}

                  <div
                    className={cn(
                      "flex flex-col max-w-[60%] gap-1",
                      isCurrentUser ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2 text-xs text-neutral-500 mb-0.5",
                        isCurrentUser ? "flex-row-reverse" : ""
                      )}
                    >
                      <span className="font-medium text-neutral-600">{message.senderName}</span>
                      <Badge variant={message.senderRole === "brand" ? "primary" : "success"} className="text-[10px]">
                        {message.senderRole === "brand" ? "品牌方" : "创作方"}
                      </Badge>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.005 }}
                      className={cn(
                        "rounded-2xl px-4 py-3 shadow-sm",
                        isFile && "p-3",
                        isCurrentUser
                          ? "bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-br-md"
                          : "bg-white border border-neutral-200 text-primary-900 rounded-bl-md"
                      )}
                    >
                      {isFile ? (
                        <div className="flex items-center gap-3 min-w-[240px]">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                              isCurrentUser ? "bg-white/20" : "bg-primary-50"
                            )}
                          >
                            <FileText
                              className={cn(
                                "h-6 w-6",
                                isCurrentUser ? "text-white" : "text-primary-500"
                              )}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "text-sm font-medium truncate",
                                isCurrentUser ? "text-white" : "text-primary-900"
                              )}
                            >
                              {message.fileName}
                            </p>
                            <p
                              className={cn(
                                "text-xs mt-0.5",
                                isCurrentUser ? "text-white/70" : "text-neutral-500"
                              )}
                            >
                              {message.fileSize}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant={isCurrentUser ? "ghost" : "outline"}
                            className={cn(
                              "shrink-0",
                              isCurrentUser && "text-white hover:bg-white/20 hover:text-white border-transparent"
                            )}
                            leftIcon={<Download className="h-4 w-4" />}
                          />
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                          {message.content}
                        </p>
                      )}
                    </motion.div>

                    <div
                      className={cn(
                        "flex items-center gap-1.5 text-[11px] text-neutral-400",
                        isCurrentUser ? "flex-row-reverse" : ""
                      )}
                    >
                      <Clock className="h-3 w-3" />
                      <span>{formatMessageTime(message.timestamp)}</span>
                      {isCurrentUser && (
                        message.isRead ? (
                          <CheckCheck className="h-3.5 w-3.5 text-primary-400" />
                        ) : (
                          <Check className="h-3.5 w-3.5 text-neutral-400" />
                        )
                      )}
                    </div>
                  </div>

                  {isCurrentUser && (
                    <Avatar
                      src={message.senderAvatar}
                      alt={message.senderName}
                      size="sm"
                      className="mt-1"
                    />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="px-8 py-4 bg-white/80 backdrop-blur-sm border-t border-neutral-200"
        >
          <AnimatePresence>
            {showTemplates && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: 10, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-4 overflow-hidden"
              >
                <p className="text-xs font-medium text-neutral-500 mb-2">快捷回复模板</p>
                <div className="flex flex-wrap gap-2">
                  {quickTemplates.map((template, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectTemplate(template)}
                      className="px-3 py-1.5 text-sm bg-neutral-100 hover:bg-primary-50 hover:text-primary-700 text-neutral-600 rounded-lg border border-neutral-200 hover:border-primary-200 transition-all duration-200"
                    >
                      {template}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-end gap-3">
            <div className="flex items-center gap-1 pb-2">
              <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                <Smile className="h-5 w-5 text-neutral-500" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                <Paperclip className="h-5 w-5 text-neutral-500" />
              </Button>
              <Button variant="ghost" size="sm" className="rounded-full h-9 w-9 p-0">
                <AtSign className="h-5 w-5 text-neutral-500" />
              </Button>
              <Button
                variant={showTemplates ? "primary" : "ghost"}
                size="sm"
                className="rounded-full h-9 px-3"
                leftIcon={<Sparkles className="h-4 w-4" />}
                onClick={() => setShowTemplates(!showTemplates)}
              >
                快捷回复
              </Button>
            </div>

            <div className="flex-1 relative">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入消息... (Enter发送，Shift+Enter换行)"
                rows={1}
                className={cn(
                  "w-full resize-none rounded-xl border border-neutral-300 bg-white px-4 py-3 pr-14",
                  "text-primary-900 placeholder:text-neutral-400 text-sm",
                  "transition-all duration-200 ease-out",
                  "focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30",
                  "min-h-[48px] max-h-[160px]"
                )}
                style={{
                  height: inputValue ? Math.min(Math.max(inputValue.split("\n").length * 24 + 24, 48), 160) : 48,
                }}
              />
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="gold"
                size="lg"
                className="h-12 w-12 rounded-xl p-0"
                onClick={handleSend}
                disabled={!inputValue.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
