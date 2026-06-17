import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Circle,
  ChevronRight,
  MessageSquare,
  Paperclip,
  Send,
  History,
  Eye,
  Building2,
  Calendar,
  AlertCircle,
  Check,
  RefreshCw,
  Plus,
  X,
  Sparkles,
  ArrowRightLeft,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { brands } from '@/services/mockData';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { MilestoneStatus } from '@/services/mockData';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

interface ProjectWithBrand {
  id: string;
  brandId: string;
  creatorId: string;
  title: string;
  description: string;
  type: string;
  budget: number;
  status: string;
  platform: string;
  startDate: string;
  endDate: string;
  milestones: Array<{
    id: string;
    projectId: string;
    title: string;
    description: string;
    dueDate: string;
    status: MilestoneStatus;
    deliverables: string[];
    submittedContent?: string;
    feedback?: string;
    approvedAt?: string;
    submittedAt?: string;
  }>;
  requirements: string[];
  createdAt: string;
  signedAt?: string;
  completedAt?: string;
  brandName: string;
  brandLogo: string;
}

interface FeedbackItem {
  id: string;
  author: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
  resolved: boolean;
  isBrand: boolean;
}

const milestoneStatusIcon: Record<MilestoneStatus, React.ReactNode> = {
  pending: <Circle className="w-4 h-4" />,
  in_progress: <Clock className="w-4 h-4" />,
  submitted: <Clock className="w-4 h-4" />,
  approved: <CheckCircle2 className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

const milestoneStatusColor: Record<MilestoneStatus, string> = {
  pending: 'text-neutral-400 bg-neutral-100',
  in_progress: 'text-gold-600 bg-gold-100',
  submitted: 'text-warning-600 bg-warning-100',
  approved: 'text-success-600 bg-success-100',
  rejected: 'text-danger-600 bg-danger-100',
};

const milestoneStatusLabel: Record<MilestoneStatus, string> = {
  pending: '待开始',
  in_progress: '进行中',
  submitted: '已提交',
  approved: '已通过',
  rejected: '已驳回',
};

export default function Deliverables() {
  const { user } = useAuthStore();
  const { getCreatorByUserId, getProjectsByCreator, submitMilestoneContent } = useAppStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitContentText, setSubmitContentText] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [newFeedback, setNewFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentCreator = user ? getCreatorByUserId(user.id) : undefined;

  const creatorProjects = useMemo(() => {
    if (!currentCreator) return [];
    const projects = getProjectsByCreator(currentCreator.id);
    return projects
      .map((project) => {
        const brand = brands.find((b) => b.id === project.brandId);
        return {
          ...project,
          brandName: brand?.name ?? '未知品牌',
          brandLogo: brand?.logo ?? '',
        } as ProjectWithBrand;
      });
  }, [currentCreator, getProjectsByCreator]);

  const activeProjects = useMemo(() => {
    return creatorProjects.filter((p) =>
      ['executing', 'signed', 'negotiating'].includes(p.status)
    );
  }, [creatorProjects]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeProjects.length > 0) {
        if (!selectedProjectId) {
          setSelectedProjectId(activeProjects[0].id);
          const firstActiveMilestone = activeProjects[0].milestones.find(
            (m) => m.status === 'in_progress' || m.status === 'pending' || m.status === 'rejected'
          );
          if (firstActiveMilestone) {
            setSelectedMilestoneId(firstActiveMilestone.id);
          } else if (activeProjects[0].milestones.length > 0) {
            setSelectedMilestoneId(activeProjects[0].milestones[0].id);
          }
        }
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [activeProjects, selectedProjectId]);

  const selectedProject = activeProjects.find((p) => p.id === selectedProjectId);
  const selectedMilestone = selectedProject?.milestones.find((m) => m.id === selectedMilestoneId);

  const feedbacks = useMemo(() => {
    if (!selectedMilestone) return [];
    const result: FeedbackItem[] = [];

    if (selectedMilestone.feedback && selectedMilestone.status === 'rejected') {
      const brand = brands.find((b) => b.id === selectedProject?.brandId);
      result.push({
        id: `fb-rejected-${selectedMilestone.id}`,
        author: brand?.contactName || '品牌方',
        authorAvatar: brand?.logo || '',
        content: selectedMilestone.feedback,
        createdAt: selectedMilestone.submittedAt || new Date().toISOString(),
        resolved: false,
        isBrand: true,
      });
    }

    if (selectedMilestone.feedback && selectedMilestone.status === 'approved') {
      const brand = brands.find((b) => b.id === selectedProject?.brandId);
      result.push({
        id: `fb-approved-${selectedMilestone.id}`,
        author: brand?.contactName || '品牌方',
        authorAvatar: brand?.logo || '',
        content: selectedMilestone.feedback,
        createdAt: selectedMilestone.approvedAt || new Date().toISOString(),
        resolved: true,
        isBrand: true,
      });
    }

    return result;
  }, [selectedMilestone, selectedProject]);

  const handleSubmitContent = async () => {
    if (!selectedProject || !selectedMilestone || !submitContentText.trim()) return;

    setIsSubmitting(true);
    try {
      submitMilestoneContent(selectedProject.id, selectedMilestone.id, submitContentText);
      setSubmitContentText('');
      alert('内容提交成功，等待品牌方审核！');
    } catch (error) {
      console.error('提交内容失败:', error);
      alert('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendFeedback = () => {
    if (!newFeedback.trim()) return;
    setNewFeedback('');
    alert('消息已发送（聊天功能待集成）');
  };

  const versionHistory = [
    { version: 3, content: '最终版脚本，已根据品牌方意见调整口播节奏和产品展示镜头', submittedAt: '2024-11-15T14:30:00Z', status: 'approved' },
    { version: 2, content: '第二版脚本，增加产品特写镜头，优化文案', submittedAt: '2024-11-12T10:15:00Z', status: 'changes_requested' },
    { version: 1, content: '初稿脚本，包含创意方案和分镜设计', submittedAt: '2024-11-08T16:45:00Z', status: 'changes_requested' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-900">内容交付中心</h1>
            <p className="text-sm text-neutral-500 mt-1">提交创作内容，跟进审核反馈</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardContent className="p-4">
                <h3 className="font-semibold text-primary-900 mb-4 px-2">进行中的项目</h3>
                {loading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-3 rounded-lg animate-pulse">
                        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-neutral-100 rounded w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {activeProjects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setSelectedProjectId(project.id);
                          const activeMilestone = project.milestones.find(
                            (m) => m.status === 'in_progress' || m.status === 'pending' || m.status === 'rejected'
                          );
                          setSelectedMilestoneId(activeMilestone?.id ?? project.milestones[0]?.id ?? null);
                        }}
                        className={cn(
                          'w-full p-3 rounded-xl text-left transition-all duration-200',
                          selectedProjectId === project.id
                            ? 'bg-primary-50 border-2 border-primary-300'
                            : 'hover:bg-neutral-50 border-2 border-transparent'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar
                            src={project.brandLogo}
                            alt={project.brandName}
                            size="md"
                            fallback={<Building2 className="w-5 h-5" />}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-primary-900 text-sm line-clamp-1">{project.title}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{project.brandName}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant={
                                  project.status === 'executing' ? 'gold' : project.status === 'signed' ? 'primary' : 'warning'
                                }
                                className="text-xs"
                              >
                                {project.status === 'executing'
                                  ? '执行中'
                                  : project.status === 'signed'
                                  ? '已签约'
                                  : '洽谈中'}
                              </Badge>
                              <span className="text-xs text-neutral-400">
                                {project.milestones.filter((m) => m.status === 'approved').length}/
                                {project.milestones.length}节点
                              </span>
                            </div>
                          </div>
                          {selectedProjectId === project.id && (
                            <ChevronRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="lg:col-span-3 space-y-6"
          >
            {selectedProject ? (
              <>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <Avatar
                          src={selectedProject.brandLogo}
                          alt={selectedProject.brandName}
                          size="xl"
                          fallback={<Building2 className="w-8 h-8" />}
                        />
                        <div>
                          <h2 className="text-xl font-bold text-primary-900">{selectedProject.title}</h2>
                          <p className="text-sm text-neutral-500 mt-1">
                            {selectedProject.brandName} · 预算 {formatCurrency(selectedProject.budget)}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Calendar className="w-4 h-4 text-neutral-400" />
                            <span className="text-sm text-neutral-500">
                              {formatDate(selectedProject.startDate)} - {formatDate(selectedProject.endDate)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" rightIcon={<MessageSquare className="w-4 h-4" />}>
                        联系品牌方
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-semibold text-primary-800 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-gold-500" />
                        项目里程碑
                      </h3>
                      <div className="relative">
                        <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-neutral-200" />
                        <div className="space-y-2">
                          {selectedProject.milestones.map((milestone, index) => {
                            const isSelected = selectedMilestoneId === milestone.id;
                            const isActive =
                              milestone.status === 'in_progress' ||
                              milestone.status === 'pending' ||
                              milestone.status === 'rejected';

                            return (
                              <motion.button
                                key={milestone.id}
                                onClick={() => isActive && setSelectedMilestoneId(milestone.id)}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={cn(
                                  'relative w-full flex items-start gap-4 p-4 rounded-xl text-left transition-all duration-200',
                                  isSelected
                                    ? 'bg-primary-50 border-2 border-primary-300'
                                    : isActive
                                    ? 'hover:bg-neutral-50 border-2 border-transparent cursor-pointer'
                                    : 'opacity-60 cursor-default border-2 border-transparent'
                                )}
                                disabled={!isActive}
                              >
                                <div
                                  className={cn(
                                    'relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                                    milestoneStatusColor[milestone.status]
                                  )}
                                >
                                  {milestoneStatusIcon[milestone.status]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="font-medium text-primary-900">{milestone.title}</p>
                                    <Badge
                                      variant={
                                        milestone.status === 'approved'
                                          ? 'success'
                                          : milestone.status === 'in_progress'
                                          ? 'gold'
                                          : milestone.status === 'submitted'
                                          ? 'warning'
                                          : milestone.status === 'rejected'
                                          ? 'danger'
                                          : 'default'
                                      }
                                    >
                                      {milestoneStatusLabel[milestone.status]}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-neutral-500 mt-1">{milestone.description}</p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                                    <span>截止: {formatDate(milestone.dueDate, 'MM-DD')}</span>
                                    {milestone.deliverables.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <FileText className="w-3.5 h-3.5" />
                                        {milestone.deliverables.length}项交付物
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {selectedMilestone && (
                  <Tabs defaultValue="submit">
                    <TabList>
                      <Tab value="submit" icon={<Upload className="w-4 h-4" />}>
                        提交内容
                      </Tab>
                      <Tab value="feedback" icon={<MessageSquare className="w-4 h-4" />}>
                        反馈意见
                        {feedbacks.filter((f) => !f.resolved).length > 0 && (
                          <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs rounded-full bg-danger-100 text-danger-700">
                            {feedbacks.filter((f) => !f.resolved).length}
                          </span>
                        )}
                      </Tab>
                      <Tab value="history" icon={<History className="w-4 h-4" />}>
                        版本历史
                      </Tab>
                    </TabList>

                    <TabPanel value="submit">
                      <Card>
                        <CardContent className="p-6 space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-primary-900">{selectedMilestone.title}</h3>
                              <p className="text-sm text-neutral-500 mt-1">{selectedMilestone.description}</p>
                            </div>
                            <Badge
                              variant={
                                selectedMilestone.status === 'approved'
                                  ? 'success'
                                  : selectedMilestone.status === 'in_progress'
                                  ? 'gold'
                                  : selectedMilestone.status === 'submitted'
                                  ? 'warning'
                                  : selectedMilestone.status === 'rejected'
                                  ? 'danger'
                                  : 'default'
                              }
                              className="px-3 py-1"
                            >
                              {milestoneStatusLabel[selectedMilestone.status]}
                            </Badge>
                          </div>

                          <div>
                            <h4 className="text-sm font-medium text-primary-800 mb-3">交付物清单</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedMilestone.deliverables.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-sm text-neutral-700"
                                >
                                  <FileText className="w-4 h-4 text-neutral-400" />
                                  {item}
                                </div>
                              ))}
                            </div>
                          </div>

                          {(selectedMilestone.status === 'in_progress' ||
                            selectedMilestone.status === 'rejected' ||
                            selectedMilestone.status === 'pending') && (
                            <>
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium text-primary-800">内容描述</h4>
                                  <span className="text-xs text-neutral-400">v{(versionHistory[0]?.version || 0) + 1}</span>
                                </div>
                                <Textarea
                                  placeholder="请详细描述本次提交的内容，包括创意说明、修改点、注意事项等..."
                                  value={submitContentText}
                                  onChange={(e) => setSubmitContentText(e.target.value)}
                                  className="min-h-[120px]"
                                />
                              </div>

                              <div>
                                <h4 className="text-sm font-medium text-primary-800 mb-3">文件上传</h4>
                                <div className="border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary-400 hover:bg-primary-50/30 transition-all duration-200 cursor-pointer">
                                  <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-3">
                                    <Upload className="w-6 h-6 text-primary-500" />
                                  </div>
                                  <p className="text-sm font-medium text-primary-700 mb-1">点击或拖拽文件到此处</p>
                                  <p className="text-xs text-neutral-500">支持 MP4、MOV、PDF、PSD、ZIP 等格式，单文件最大 500MB</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                                <Button variant="ghost" leftIcon={<RefreshCw className="w-4 h-4" />}>
                                  保存草稿
                                </Button>
                                <Button
                                  variant="primary"
                                  leftIcon={<Send className="w-4 h-4" />}
                                  onClick={handleSubmitContent}
                                  disabled={!submitContentText.trim() || isSubmitting}
                                  loading={isSubmitting}
                                >
                                  {isSubmitting ? '提交中...' : '提交审核'}
                                </Button>
                              </div>
                            </>
                          )}

                          {selectedMilestone.status === 'submitted' && (
                            <div className="p-4 rounded-xl bg-warning-50 border border-warning-200">
                              <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-warning-800">内容已提交，等待品牌方审核</p>
                                  <p className="text-sm text-warning-600 mt-1">
                                    提交时间：{selectedMilestone.submittedAt ? formatRelativeTime(selectedMilestone.submittedAt) : '刚刚'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {selectedMilestone.status === 'approved' && (
                            <div className="p-4 rounded-xl bg-success-50 border border-success-200">
                              <div className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium text-success-800">内容已通过审核</p>
                                  {selectedMilestone.feedback && (
                                    <p className="text-sm text-success-600 mt-1">品牌方评语：{selectedMilestone.feedback}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabPanel>

                    <TabPanel value="feedback">
                      <Card>
                        <CardContent className="p-0">
                          <div className="p-4 border-b border-neutral-100">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-primary-900">品牌方反馈</h3>
                              <span className="text-sm text-neutral-500">
                                {feedbacks.length} 条反馈，{feedbacks.filter((f) => !f.resolved).length} 条待处理
                              </span>
                            </div>
                          </div>

                          <div className="divide-y divide-neutral-100 max-h-[400px] overflow-y-auto">
                            {feedbacks.length === 0 ? (
                              <div className="p-12 text-center">
                                <MessageSquare className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                                <p className="text-sm text-neutral-500">暂无反馈意见</p>
                              </div>
                            ) : (
                              feedbacks.map((feedback, index) => (
                                <motion.div
                                  key={feedback.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                  className={cn(
                                    'p-4 transition-colors',
                                    feedback.resolved ? 'bg-neutral-50/50' : ''
                                  )}
                                >
                                  <div className="flex items-start gap-3">
                                    <Avatar src={feedback.authorAvatar} alt={feedback.author} size="md" />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-primary-900">{feedback.author}</span>
                                          {feedback.isBrand && (
                                            <Badge variant="primary" className="text-xs">品牌方</Badge>
                                          )}
                                          {feedback.resolved ? (
                                            <Badge variant="success" className="text-xs">已解决</Badge>
                                          ) : (
                                            <Badge variant="warning" className="text-xs">待处理</Badge>
                                          )}
                                        </div>
                                        <span className="text-xs text-neutral-400 flex-shrink-0">
                                          {formatRelativeTime(feedback.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-neutral-700 mt-2 leading-relaxed">{feedback.content}</p>
                                      {!feedback.isBrand && !feedback.resolved && (
                                        <div className="flex items-center gap-2 mt-3">
                                          <Button variant="ghost" size="sm" leftIcon={<ArrowRightLeft className="w-4 h-4" />}>
                                            回复
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))
                            )}
                          </div>

                          <div className="p-4 border-t border-neutral-100">
                            <div className="flex items-end gap-3">
                              <div className="flex-1">
                                <Textarea
                                  placeholder="输入回复内容..."
                                  value={newFeedback}
                                  onChange={(e) => setNewFeedback(e.target.value)}
                                  className="min-h-[80px]"
                                />
                              </div>
                              <Button
                                variant="primary"
                                leftIcon={<Send className="w-4 h-4" />}
                                onClick={handleSendFeedback}
                                disabled={!newFeedback.trim()}
                              >
                                发送
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabPanel>

                    <TabPanel value="history">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="font-semibold text-primary-900">版本历史</h3>
                            <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                              版本对比
                            </Button>
                          </div>

                          <div className="relative">
                            <div className="absolute left-5 top-2 bottom-2 w-0.5 bg-gradient-to-b from-success-300 via-warning-300 to-neutral-200" />
                            <div className="space-y-4">
                              {versionHistory.map((version, index) => (
                                <motion.div
                                  key={version.version}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="relative pl-14"
                                >
                                  <div
                                    className={cn(
                                      'absolute left-0 w-10 h-10 rounded-full flex items-center justify-center z-10',
                                      version.status === 'approved'
                                        ? 'bg-success-100 text-success-600'
                                        : 'bg-warning-100 text-warning-600'
                                    )}
                                  >
                                    {version.status === 'approved' ? (
                                      <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                      <AlertCircle className="w-5 h-5" />
                                    )}
                                  </div>
                                  <div
                                    className={cn(
                                      'p-4 rounded-xl border transition-all',
                                      index === 0
                                        ? 'bg-primary-50 border-primary-200'
                                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                                    )}
                                  >
                                    <div className="flex items-center justify-between gap-2 mb-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-semibold text-primary-900">V{version.version}</span>
                                        {index === 0 && (
                                          <Badge variant="primary" className="text-xs">当前版本</Badge>
                                        )}
                                        <Badge
                                          variant={version.status === 'approved' ? 'success' : 'warning'}
                                          className="text-xs"
                                        >
                                          {version.status === 'approved' ? '已通过' : '需修改'}
                                        </Badge>
                                      </div>
                                      <span className="text-sm text-neutral-500">{formatRelativeTime(version.submittedAt)}</span>
                                    </div>
                                    <p className="text-sm text-neutral-600">{version.content}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                      <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                                        查看
                                      </Button>
                                      <Button variant="ghost" size="sm" leftIcon={<ArrowRightLeft className="w-4 h-4" />}>
                                        对比
                                      </Button>
                                      {index !== 0 && (
                                        <Button variant="outline" size="sm" leftIcon={<RefreshCw className="w-4 h-4" />}>
                                          恢复此版本
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabPanel>
                  </Tabs>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary-900 mb-2">暂无进行中的项目</h3>
                  <p className="text-sm text-neutral-500 mb-6">接受合作邀请后，项目将显示在这里</p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
