import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock,
  Download,
  GitCompare,
  ChevronRight,
  FileText,
  Video,
  Image,
  User,
  Calendar,
  AtSign,
  Paperclip,
  Send,
  AlertCircle,
  History,
  ThumbsUp,
  ThumbsDown,
  Eye,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { formatDate, formatRelativeTime } from '@/utils/format';
import { cn } from '@/lib/utils';
import { projects, creators } from '@/services/mockData';
import type { Project, Milestone } from '@/services/mockData';

interface ReviewItem {
  id: string;
  projectId: string;
  milestoneId: string;
  projectTitle: string;
  creatorName: string;
  creatorAvatar: string;
  title: string;
  version: number;
  submittedAt: string;
  contentDescription: string;
  contentType: 'video' | 'image' | 'text';
  attachments: { name: string; size: string; type: string }[];
  reviewed: boolean;
}

interface ReviewHistory {
  id: string;
  reviewer: string;
  reviewerAvatar: string;
  action: 'approved' | 'rejected' | 'commented';
  comment: string;
  version: number;
  createdAt: string;
  mentions?: string[];
}

const reviewItems: ReviewItem[] = [
  {
    id: 'r1',
    projectId: 'proj2',
    milestoneId: 'm5',
    projectTitle: '智航智能手表深度测评',
    creatorName: '张评测说数码',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    title: '深度测试视频成片V2',
    version: 2,
    submittedAt: '2024-11-12T15:30:00Z',
    contentDescription: '完成7天真实使用测试，包含健康监测准确性对比、续航测试、运动功能实测等核心内容。视频时长14分32秒，已加入品牌方要求的ECG功能特写镜头。',
    contentType: 'video',
    attachments: [
      { name: '智航手表测评V2.mp4', size: '856MB', type: 'video' },
      { name: '测评脚本V2.pdf', size: '2.3MB', type: 'pdf' },
      { name: '测试数据对比.xlsx', size: '156KB', type: 'excel' },
    ],
    reviewed: false,
  },
  {
    id: 'r2',
    projectId: 'proj4',
    milestoneId: 'm10',
    projectTitle: '悦味茶饮周边穿搭联名',
    creatorName: '小美穿搭日记',
    creatorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    title: '联名系列设计稿',
    version: 1,
    submittedAt: '2024-11-11T10:20:00Z',
    contentDescription: '完成茶饮周边穿搭联名系列设计稿，包含帽子、T恤、帆布袋三个品类共8款设计，融入悦味品牌茶饮元素和品牌主色调。',
    contentType: 'image',
    attachments: [
      { name: '联名设计稿全套.zip', size: '128MB', type: 'zip' },
      { name: '设计说明文档.pdf', size: '5.6MB', type: 'pdf' },
    ],
    reviewed: false,
  },
  {
    id: 'r3',
    projectId: 'proj1',
    milestoneId: 'm3',
    projectTitle: '悦味夏季新品茶饮推广',
    creatorName: '林小雨的美食日记',
    creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    title: '探店视频成片',
    version: 3,
    submittedAt: '2024-06-28T14:00:00Z',
    contentDescription: '根据品牌方反馈修改后的最终成片，已调整背景音乐、增加门店定位画面、优化购买引导话术。',
    contentType: 'video',
    attachments: [
      { name: '悦味探店最终版.mp4', size: '512MB', type: 'video' },
    ],
    reviewed: true,
  },
];

const reviewHistory: ReviewHistory[] = [
  {
    id: 'h1',
    reviewer: '李美丽',
    reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    action: 'commented',
    comment: '整体视频节奏不错，建议在1:30处增加产品特写镜头，突出手表的外观设计细节。 @张评测 请看下这个修改意见。',
    version: 1,
    createdAt: '2024-11-10T16:30:00Z',
    mentions: ['张评测'],
  },
  {
    id: 'h2',
    reviewer: '李美丽',
    reviewerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    action: 'rejected',
    comment: 'V1版本续航测试部分数据对比不够直观，请补充与竞品的柱状图对比。另外ECG功能展示时长不够，需要增加特写镜头。',
    version: 1,
    createdAt: '2024-11-10T17:00:00Z',
  },
  {
    id: 'h3',
    reviewer: '王总',
    reviewerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    action: 'commented',
    comment: '视频整体质量很好，创意和执行都到位。建议在结尾处增加品牌slogan的文字展示。',
    version: 2,
    createdAt: '2024-11-12T16:00:00Z',
  },
];

function ContentIcon({ type }: { type: 'video' | 'image' | 'text' }) {
  if (type === 'video') return <Video className="w-4 h-4" />;
  if (type === 'image') return <Image className="w-4 h-4" />;
  return <FileText className="w-4 h-4" />;
}

export default function Review() {
  const [selectedId, setSelectedId] = useState<string>(reviewItems[0].id);
  const [feedback, setFeedback] = useState('');
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null);

  const selectedItem = reviewItems.find((r) => r.id === selectedId);
  const pendingCount = reviewItems.filter((r) => !r.reviewed).length;

  const handleApprove = () => {
    setActionLoading('approve');
    setTimeout(() => {
      setActionLoading(null);
    }, 1500);
  };

  const handleReject = () => {
    if (!feedback.trim()) return;
    setActionLoading('reject');
    setTimeout(() => {
      setActionLoading(null);
      setFeedback('');
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary-900">内容审核中心</h1>
          <p className="text-sm text-neutral-500 mt-1">审核创作方提交的内容，提供反馈意见</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" dot pulse>
            {pendingCount} 项待审核
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-220px)]">
        <Card className="lg:col-span-3 overflow-hidden flex flex-col">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-primary-900">待审核项目</h3>
              <Badge variant="warning" size="sm">{pendingCount}</Badge>
            </div>
            <div className="flex-1 overflow-y-auto">
              {reviewItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    'p-4 border-b border-neutral-100 cursor-pointer transition-all duration-200 relative',
                    selectedId === item.id
                      ? 'bg-primary-50 border-l-4 border-l-primary-500'
                      : 'hover:bg-neutral-50 border-l-4 border-l-transparent'
                  )}
                >
                  {!item.reviewed && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
                  )}
                  <div className="flex items-start gap-3">
                    <Avatar src={item.creatorAvatar} alt={item.creatorName} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-primary-900 truncate pr-6">
                        {item.title}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5 truncate">
                        {item.projectTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={item.contentType === 'video' ? 'primary' : item.contentType === 'image' ? 'success' : 'default'}
                          size="sm"
                          className="inline-flex items-center gap-1"
                        >
                          <ContentIcon type={item.contentType} />
                          {item.contentType === 'video' ? '视频' : item.contentType === 'image' ? '图文' : '文案'}
                        </Badge>
                        <Badge variant="gold" size="sm">V{item.version}</Badge>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1.5">
                        {formatRelativeTime(item.submittedAt)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 overflow-hidden flex flex-col">
          <CardContent className="p-0 flex flex-col h-full">
            {selectedItem ? (
              <>
                <div className="px-5 py-4 border-b border-neutral-200 flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-base text-primary-900 flex items-center gap-2">
                      {selectedItem.title}
                      <Badge variant="gold" size="sm">V{selectedItem.version}</Badge>
                    </h3>
                    <p className="text-sm text-neutral-500 mt-1">
                      {selectedItem.projectTitle} · {selectedItem.creatorName}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    leftIcon={<GitCompare className="w-4 h-4" />}
                    onClick={() => setShowCompareModal(true)}
                  >
                    版本对比
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  <div className="aspect-video rounded-xl bg-gradient-to-br from-primary-100 via-neutral-100 to-gold-100 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-texture-grid opacity-30" />
                    <div className="relative text-center">
                      {selectedItem.contentType === 'video' ? (
                        <div className="w-20 h-20 rounded-full bg-white/90 shadow-xl flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-105 transition-transform">
                          <div className="w-0 h-0 border-l-[24px] border-l-primary-600 border-y-[14px] border-y-transparent ml-1" />
                        </div>
                      ) : selectedItem.contentType === 'image' ? (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className="w-20 h-20 rounded-lg bg-white/80 shadow-sm flex items-center justify-center"
                            >
                              <Image className="w-8 h-8 text-neutral-400" />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <FileText className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                      )}
                      <p className="text-sm text-neutral-600 font-medium">
                        {selectedItem.contentType === 'video' ? '点击预览视频内容' :
                         selectedItem.contentType === 'image' ? '点击查看图文素材' : '点击查看文案内容'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-primary-900 mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary-500" />
                      内容描述
                    </h4>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {selectedItem.contentDescription}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-primary-900 mb-3 flex items-center gap-2">
                      <Paperclip className="w-4 h-4 text-primary-500" />
                      附件下载
                    </h4>
                    <div className="space-y-2">
                      {selectedItem.attachments.map((att, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, duration: 0.3 }}
                          className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 group-hover:bg-primary-100 flex items-center justify-center transition-colors">
                              <FileText className="w-5 h-5 text-neutral-500 group-hover:text-primary-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-primary-900">{att.name}</p>
                              <p className="text-xs text-neutral-500">{att.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                            下载
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-neutral-500 pt-3 border-t border-neutral-100">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      提交时间：{formatDate(selectedItem.submittedAt, 'YYYY-MM-DD HH:mm')}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Eye className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                  <p className="text-neutral-500">请选择左侧待审核项目</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 overflow-hidden flex flex-col">
          <CardContent className="p-0 flex flex-col h-full">
            <div className="px-5 py-4 border-b border-neutral-200">
              <h3 className="font-semibold text-sm text-primary-900">审核操作</h3>
            </div>

            <div className="flex-1 overflow-y-auto flex flex-col">
              <Tabs defaultValue="action" className="flex-1 flex flex-col">
                <TabList className="px-5">
                  <Tab value="action">审核操作</Tab>
                  <Tab value="history">审核历史</Tab>
                </TabList>

                <TabPanel value="action" className="flex-1 flex flex-col p-5 pt-4 space-y-5">
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-1"
                      leftIcon={<ThumbsUp className="w-4 h-4" />}
                      onClick={handleApprove}
                      loading={actionLoading === 'approve'}
                    >
                      通过审核
                    </Button>
                    <Button
                      variant="danger"
                      size="lg"
                      className="flex-1"
                      leftIcon={<ThumbsDown className="w-4 h-4" />}
                      onClick={handleReject}
                      loading={actionLoading === 'reject'}
                      disabled={!feedback.trim()}
                    >
                      驳回修改
                    </Button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary-500" />
                      批注反馈
                    </label>
                    <Textarea
                      placeholder="请输入审核意见，使用 @ 提及相关人员..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      showCount
                      maxLength={500}
                      rows={5}
                    />
                    <div className="flex items-center justify-between mt-2">
                      <button className="flex items-center gap-1 text-xs text-neutral-500 hover:text-primary-600 transition-colors">
                        <AtSign className="w-3.5 h-3.5" />
                        提及成员
                      </button>
                      <Button
                        variant="ghost"
                        size="sm"
                        rightIcon={<Send className="w-3.5 h-3.5" />}
                        disabled={!feedback.trim()}
                      >
                        发送反馈
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-xl bg-primary-50 border border-primary-200 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-primary-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-primary-900">审核提示</p>
                        <ul className="mt-2 space-y-1 text-xs text-primary-700">
                          <li>· 通过审核后内容将进入发布流程</li>
                          <li>· 驳回时请务必填写具体修改意见</li>
                          <li>· 可使用 @ 功能通知创作方相关人员</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabPanel>

                <TabPanel value="history" className="flex-1 p-5 pt-4">
                  <div className="relative">
                    {reviewHistory.map((item, index) => (
                      <div key={item.id} className="flex gap-4 pb-6 last:pb-0">
                        <div className="relative flex flex-col items-center">
                          <Avatar
                            src={item.reviewerAvatar}
                            alt={item.reviewer}
                            size="sm"
                          />
                          {index < reviewHistory.length - 1 && (
                            <div className="absolute top-11 w-px h-full bg-neutral-200" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-primary-900">
                                {item.reviewer}
                              </span>
                              <Badge
                                variant={
                                  item.action === 'approved' ? 'success' :
                                  item.action === 'rejected' ? 'danger' : 'default'
                                }
                                size="sm"
                                className="inline-flex items-center gap-1"
                              >
                                {item.action === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                                {item.action === 'rejected' && <XCircle className="w-3 h-3" />}
                                {item.action === 'commented' && <MessageSquare className="w-3 h-3" />}
                                {item.action === 'approved' ? '已通过' :
                                 item.action === 'rejected' ? '已驳回' : '评论'}
                              </Badge>
                              <Badge variant="gold" size="sm">V{item.version}</Badge>
                            </div>
                            <span className="text-xs text-neutral-400">
                              {formatRelativeTime(item.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-600 mt-2 leading-relaxed">
                            {item.comment.split(/(@\S+)/g).map((part, i) =>
                              part.startsWith('@') ? (
                                <span key={i} className="text-primary-600 font-medium">{part}</span>
                              ) : (
                                <span key={i}>{part}</span>
                              )
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal open={showCompareModal} onClose={() => setShowCompareModal(false)} size="full">
        <ModalHeader
          title="版本对比"
          description="对比不同版本的内容差异"
        />
        <ModalBody>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="warning" size="lg">V1 旧版本</Badge>
                <span className="text-xs text-neutral-500">2024-11-08 14:30</span>
              </div>
              <div className="aspect-video rounded-xl bg-neutral-100 flex items-center justify-center relative overflow-hidden">
                <div className="text-center">
                  <Video className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500">智航手表测评V1.mp4</p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200">
                <h5 className="font-medium text-sm text-primary-900 mb-2">版本说明</h5>
                <p className="text-xs text-neutral-600">
                  初始提交版本，包含基础测评内容和测试数据。
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="success" size="lg">V2 当前版本</Badge>
                <span className="text-xs text-neutral-500">2024-11-12 15:30</span>
              </div>
              <div className="aspect-video rounded-xl bg-primary-50 flex items-center justify-center relative overflow-hidden border-2 border-primary-300">
                <div className="text-center">
                  <Video className="w-12 h-12 text-primary-500 mx-auto mb-3" />
                  <p className="text-sm text-primary-700 font-medium">智航手表测评V2.mp4</p>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-success-50 border border-success-200">
                <h5 className="font-medium text-sm text-primary-900 mb-2">更新内容</h5>
                <ul className="text-xs text-neutral-600 space-y-1">
                  <li>· 增加ECG功能特写镜头</li>
                  <li>· 优化健康监测数据对比展示</li>
                  <li>· 调整视频节奏和转场效果</li>
                  <li>· 补充竞品数据对比图表</li>
                </ul>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCompareModal(false)}>
            关闭
          </Button>
        </ModalFooter>
      </Modal>
      </div>
    </DashboardLayout>
  );
}
