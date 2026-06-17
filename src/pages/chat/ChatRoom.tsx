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

type MessageType = "text" | "file" | "system"

interface ChatMessage {
  id: string
  type: MessageType
  senderId: string
  senderName: string
  senderAvatar: string
  senderRole: "creator" | "brand"
  content: string
  timestamp: string
  isRead: boolean
  fileName?: string
  fileSize?: string
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

const getMockConversation = (projectId: string): ConversationInfo | null => {
  const project = projects.find((p) => p.id === projectId)
  if (!project) return null
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

const getMockMessages = (): ChatMessage[] => {
  const creator = creators[0]
  const brand = brands[0]

  return [
    {
      id: "m1",
      type: "system",
      senderId: "system",
      senderName: "系统",
      senderAvatar: "",
      senderRole: "brand",
      content: "李美丽提交了V2版本草稿",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      isRead: true,
    },
    {
      id: "m2",
      type: "text",
      senderId: "u3",
      senderName: brand.name,
      senderAvatar: brand.logo,
      senderRole: "brand",
      content:
        "您好林老师，这是我们修改后的第二版脚本，主要调整了产品展示的节奏和时长，您看一下是否符合预期~",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 60000).toISOString(),
      isRead: true,
    },
    {
      id: "m3",
      type: "file",
      senderId: "u3",
      senderName: brand.name,
      senderAvatar: brand.logo,
      senderRole: "brand",
      content: "",
      fileName: "悦味夏季新品-脚本方案V2.pdf",
      fileSize: "2.4 MB",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2 + 120000).toISOString(),
      isRead: true,
    },
    {
      id: "m4",
      type: "text",
      senderId: "u1",
      senderName: creator.name,
      senderAvatar: creator.avatar,
      senderRole: "creator",
      content:
        "收到！我正在看，整体的节奏调整很到位，产品展示的时机也更自然了。有几个小地方想和您再确认一下：",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isRead: true,
    },
    {
      id: "m5",
      type: "text",
      senderId: "u1",
      senderName: creator.name,
      senderAvatar: creator.avatar,
      senderRole: "creator",
      content:
        "1. 第30秒的产品特写镜头，我们是否可以增加一些动态效果？\n2. 结尾的购买引导部分，是否可以加上门店定位？\n3. 背景音乐的选择，我这边有几首备选可以发给您听听。",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 + 60000).toISOString(),
      isRead: true,
    },
    {
      id: "m6",
      type: "text",
      senderId: "u3",
      senderName: brand.name,
      senderAvatar: brand.logo,
      senderRole: "brand",
      content:
        "好的没问题！动态效果可以加，门店定位也完全OK。背景音乐您发过来我们一起选~",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: true,
    },
    {
      id: "m7",
      type: "file",
      senderId: "u1",
      senderName: creator.name,
      senderAvatar: creator.avatar,
      senderRole: "creator",
      content: "",
      fileName: "背景音乐备选方案.zip",
      fileSize: "18.6 MB",
      timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
      isRead: false,
    },
    {
      id: "m8",
      type: "text",
      senderId: "u1",
      senderName: creator.name,
      senderAvatar: creator.avatar,
      senderRole: "creator",
      content:
        "这是5首背景音乐的备选，都已经获得商用授权，您可以听听看哪首更符合品牌调性~",
      timestamp: new Date(Date.now() - 1000 * 60 * 10 + 30000).toISOString(),
      isRead: false,
    },
  ]
}

export default function ChatRoom() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [conversation, setConversation] = React.useState<ConversationInfo | null>(null)
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = React.useState("")
  const [showTemplates, setShowTemplates] = React.useState(false)

  React.useEffect(() => {
    if (projectId) {
      setConversation(getMockConversation(projectId))
      setMessages(getMockMessages())
    }
  }, [projectId])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return
    const currentUser = users[0]
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      type: "text",
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderRole: currentUser.role as "creator" | "brand",
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    }
    setMessages((prev) => [...prev, newMessage])
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
          <div className="space-y-1.5">
            {projects.slice(0, 5).map((project, index) => {
              const isActive = project.id === projectId
              const isCreatorSide = index % 2 === 0
              const counterpart = isCreatorSide ? creators[index] : brands[index]
              const counterpartAvatar = isCreatorSide
                ? (counterpart as typeof creators[number])?.avatar
                : (counterpart as typeof brands[number])?.logo
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
                  {index < 2 && (
                    <span className="shrink-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold text-white bg-danger-500 rounded-full">
                      {index === 0 ? 3 : 1}
                    </span>
                  )}
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
              const isCurrentUser = message.senderId === "u1"

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
