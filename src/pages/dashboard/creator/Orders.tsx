import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Clock,
  MessageCircle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  MoreHorizontal,
  Filter,
  Handshake,
  ClipboardList,
  Sparkles,
  FileText,
  Building2,
  ArrowRight,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Avatar } from '@/components/ui/Avatar';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';
import { getProjects, updateProjectStatus } from '@/services/projectService';
import { brands } from '@/services/mockData';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { Project, ProjectStatus } from '@/services/mockData';

type OrderTab = 'all' | 'pending' | 'negotiating' | 'executing' | 'completed';

interface ProjectWithBrand extends Project {
  brandName: string;
  brandLogo: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

const statusConfig: Record<ProjectStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'gold' | 'primary' }> = {
  pending: { label: '待响应', variant: 'warning' },
  negotiating: { label: '洽谈中', variant: 'primary' },
  signed: { label: '已签约', variant: 'gold' },
  executing: { label: '执行中', variant: 'gold' },
  delivered: { label: '已交付', variant: 'success' },
  completed: { label: '已完成', variant: 'success' },
  cancelled: { label: '已取消', variant: 'danger' },
};

export default function Orders() {
  const [orders, setOrders] = useState<ProjectWithBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<OrderTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [responseModal, setResponseModal] = useState<{ open: boolean; project: ProjectWithBrand | null; accept: boolean }>({
    open: false,
    project: null,
    accept: true,
  });
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const result = await getProjects({ creatorId: 'c1' }, { pageSize: 20 });
        const ordersWithBrand: ProjectWithBrand[] = result.list.map((project) => {
          const brand = brands.find((b) => b.id === project.brandId);
          return {
            ...project,
            brandName: brand?.name ?? '未知品牌',
            brandLogo: brand?.logo ?? '',
            lastMessage: '您好，希望能与您合作推广我们的新品~',
            lastMessageTime: '2小时前',
          };
        });
        setOrders(ordersWithBrand);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    let matchesTab = true;
    if (activeTab !== 'all') {
      if (activeTab === 'executing') {
        matchesTab = order.status === 'executing' || order.status === 'signed';
      } else {
        matchesTab = order.status === activeTab;
      }
    }
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.brandName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStats = () => ({
    pending: orders.filter((o) => o.status === 'pending').length,
    negotiating: orders.filter((o) => o.status === 'negotiating').length,
    executing: orders.filter((o) => o.status === 'executing' || o.status === 'signed').length,
    completed: orders.filter((o) => o.status === 'completed' || o.status === 'delivered').length,
  });

  const stats = getStats();

  const handleRespond = async (accept: boolean) => {
    if (!responseModal.project) return;
    if (accept) {
      await updateProjectStatus(responseModal.project.id, 'negotiating');
      setOrders((prev) => prev.map((o) => (o.id === responseModal.project!.id ? { ...o, status: 'negotiating' } : o)));
    } else {
      await updateProjectStatus(responseModal.project.id, 'cancelled');
      setOrders((prev) => prev.map((o) => (o.id === responseModal.project!.id ? { ...o, status: 'cancelled' } : o)));
    }
    setResponseModal({ open: false, project: null, accept: true });
    setRejectReason('');
  };

  const statsCards = [
    { label: '待响应', value: stats.pending, icon: Clock, variant: 'warning' as const, color: 'from-warning-500 to-warning-400' },
    { label: '洽谈中', value: stats.negotiating, icon: MessageCircle, variant: 'primary' as const, color: 'from-primary-500 to-primary-400' },
    { label: '执行中', value: stats.executing, icon: ClipboardList, variant: 'gold' as const, color: 'from-gold-500 to-gold-400' },
    { label: '已完成', value: stats.completed, icon: CheckCircle2, variant: 'success' as const, color: 'from-success-500 to-success-400' },
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
            <h1 className="text-2xl font-display font-bold text-primary-900">合作订单</h1>
            <p className="text-sm text-neutral-500 mt-1">管理品牌方合作邀请和项目进度</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.05 }}
              >
                <Card hoverable>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-neutral-500">{stat.label}</p>
                        <p className="text-3xl font-display font-bold text-primary-900 mt-1">{stat.value}</p>
                      </div>
                      <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', stat.color)}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="p-4 sm:p-6 border-b border-neutral-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="搜索项目名称或品牌..."
                      prefixIcon={<Search className="w-4 h-4" />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="md" leftIcon={<Filter className="w-4 h-4" />}>
                    筛选
                  </Button>
                </div>
                <div className="mt-4">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as OrderTab)}>
                    <TabList>
                      <Tab value="all">全部</Tab>
                      <Tab value="pending">
                        待响应
                        {stats.pending > 0 && (
                          <span className="ml-1.5 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs rounded-full bg-warning-100 text-warning-700">
                            {stats.pending}
                          </span>
                        )}
                      </Tab>
                      <Tab value="negotiating">洽谈中</Tab>
                      <Tab value="executing">执行中</Tab>
                      <Tab value="completed">已完成</Tab>
                    </TabList>
                  </Tabs>
                </div>
              </div>

              {(['all', 'pending', 'negotiating', 'executing', 'completed'] as OrderTab[]).map((tab) => (
                <TabPanel key={tab} value={tab} className="p-0">
                  <OrderList
                    orders={filteredOrders}
                    loading={loading}
                    expandedId={expandedId}
                    setExpandedId={setExpandedId}
                    onAccept={(project) => setResponseModal({ open: true, project, accept: true })}
                    onReject={(project) => setResponseModal({ open: true, project, accept: false })}
                  />
                </TabPanel>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <Modal
          open={responseModal.open}
          onClose={() => setResponseModal({ open: false, project: null, accept: true })}
          size="md"
        >
          <ModalHeader
            title={responseModal.accept ? '接受合作邀请' : '拒绝合作邀请'}
            description={
              responseModal.accept
                ? `确定接受「${responseModal.project?.brandName}」的合作邀请吗？`
                : `请告知拒绝「${responseModal.project?.brandName}」合作邀请的原因`
            }
          />
          <ModalBody>
            {responseModal.accept ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <Handshake className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-primary-900">{responseModal.project?.title}</p>
                      <p className="text-sm text-neutral-500">
                        预算 {responseModal.project?.budget ? formatCurrency(responseModal.project.budget) : '面议'}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-neutral-600">
                  接受后将进入洽谈阶段，您可以与品牌方进一步沟通项目细节和合作条款。
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-primary-800">拒绝原因</label>
                  <div className="space-y-2">
                    {['档期冲突', '预算不符合预期', '合作方向不匹配', '其他原因'].map((reason) => (
                      <label
                        key={reason}
                        className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-primary-300 cursor-pointer transition-colors"
                      >
                        <input
                          type="radio"
                          name="rejectReason"
                          value={reason}
                          checked={rejectReason === reason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          className="w-4 h-4 text-primary-500"
                        />
                        <span className="text-sm text-neutral-700">{reason}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setResponseModal({ open: false, project: null, accept: true })}>
              取消
            </Button>
            <Button
              variant={responseModal.accept ? 'primary' : 'danger'}
              onClick={() => handleRespond(responseModal.accept)}
              disabled={!responseModal.accept && !rejectReason}
              leftIcon={responseModal.accept ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
            >
              {responseModal.accept ? '确认接受' : '确认拒绝'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

interface OrderListProps {
  orders: ProjectWithBrand[];
  loading: boolean;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  onAccept: (project: ProjectWithBrand) => void;
  onReject: (project: ProjectWithBrand) => void;
}

function OrderList({ orders, loading, expandedId, setExpandedId, onAccept, onReject }: OrderListProps) {
  if (loading) {
    return (
      <div className="divide-y divide-neutral-100">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 animate-pulse">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-neutral-200" />
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-neutral-200 rounded w-1/3" />
                <div className="h-3 bg-neutral-100 rounded w-1/2" />
                <div className="h-2 bg-neutral-100 rounded w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-primary-900 mb-2">暂无订单</h3>
        <p className="text-sm text-neutral-500">完善您的招募页，吸引更多品牌合作</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-neutral-100">
      <AnimatePresence>
        {orders.map((order, index) => (
          <OrderItem
            key={order.id}
            order={order}
            index={index}
            expanded={expandedId === order.id}
            onToggle={() => setExpandedId(expandedId === order.id ? null : order.id)}
            onAccept={() => onAccept(order)}
            onReject={() => onReject(order)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

interface OrderItemProps {
  order: ProjectWithBrand;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onAccept: () => void;
  onReject: () => void;
}

function OrderItem({ order, index, expanded, onToggle, onAccept, onReject }: OrderItemProps) {
  const statusInfo = statusConfig[order.status];
  const completedMilestones = order.milestones.filter((m) => m.status === 'approved').length;
  const progressPercent = order.milestones.length > 0
    ? Math.round((completedMilestones / order.milestones.length) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <div
        className={cn(
          'p-5 transition-all duration-300 cursor-pointer',
          expanded ? 'bg-primary-50/30' : 'hover:bg-neutral-50'
        )}
        onClick={onToggle}
      >
        <div className="flex items-start gap-4">
          <Avatar
            src={order.brandLogo}
            alt={order.brandName}
            size="lg"
            fallback={<Building2 className="w-6 h-6" />}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-primary-900 truncate">{order.title}</h3>
                  <Badge variant={statusInfo.variant} dot pulse={order.status === 'pending' || order.status === 'negotiating'}>
                    {statusInfo.label}
                  </Badge>
                </div>
                <p className="text-sm text-neutral-500 mb-2">
                  <span className="font-medium text-neutral-700">{order.brandName}</span>
                  <span className="mx-2">·</span>
                  <span>{formatDate(order.startDate)} - {formatDate(order.endDate)}</span>
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-lg font-bold text-primary-600">{formatCurrency(order.budget)}</p>
                  <p className="text-xs text-neutral-400">项目预算</p>
                </div>
                <motion.div
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-1"
                >
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-3">
              {order.status !== 'completed' && order.status !== 'cancelled' && order.milestones.length > 0 && (
                <div className="flex-1 max-w-xs">
                  <Progress value={progressPercent} variant="gold" size="sm" />
                </div>
              )}

              {order.lastMessage && (
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <MessageCircle className="w-4 h-4" />
                  <span className="line-clamp-1">{order.lastMessage}</span>
                  <span className="text-neutral-400 shrink-0">· {order.lastMessageTime}</span>
                </div>
              )}
            </div>

            {order.status === 'pending' && (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={(e) => { e.stopPropagation(); onAccept(); }}
                >
                  接受邀请
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={<XCircle className="w-4 h-4" />}
                  onClick={(e) => { e.stopPropagation(); onReject(); }}
                  className="text-danger-600 hover:bg-danger-50 hover:text-danger-600"
                >
                  拒绝
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  发起洽谈
                </Button>
              </div>
            )}

            {(order.status === 'negotiating' || order.status === 'executing' || order.status === 'signed') && (
              <div className="flex items-center gap-2 mt-4">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<MessageCircle className="w-4 h-4" />}
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  继续洽谈
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<FileText className="w-4 h-4" />}
                  onClick={(e) => { e.stopPropagation(); }}
                >
                  查看详情
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-2">
              <div className="ml-16 pl-4 border-l-2 border-primary-100 space-y-6">
                <section>
                  <h4 className="text-sm font-semibold text-primary-800 mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    项目时间线
                  </h4>
                  <div className="space-y-3">
                    {order.milestones.map((milestone, mIndex) => (
                      <div key={milestone.id} className="flex items-start gap-3">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold z-10',
                              milestone.status === 'approved'
                                ? 'bg-success-100 text-success-700'
                                : milestone.status === 'in_progress'
                                ? 'bg-gold-100 text-gold-700'
                                : milestone.status === 'submitted'
                                ? 'bg-warning-100 text-warning-700'
                                : milestone.status === 'rejected'
                                ? 'bg-danger-100 text-danger-700'
                                : 'bg-neutral-100 text-neutral-500'
                            )}
                          >
                            {milestone.status === 'approved' ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              mIndex + 1
                            )}
                          </div>
                          {mIndex < order.milestones.length - 1 && (
                            <div
                              className={cn(
                                'absolute top-8 w-0.5 h-10',
                                milestone.status === 'approved' ? 'bg-success-300' : 'bg-neutral-200'
                              )}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-primary-900">{milestone.title}</p>
                            <span className="text-xs text-neutral-500">截止 {formatDate(milestone.dueDate, 'MM-DD')}</span>
                          </div>
                          <p className="text-sm text-neutral-500 mt-1">{milestone.description}</p>
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
                            className="mt-2"
                          >
                            {milestone.status === 'pending'
                              ? '待开始'
                              : milestone.status === 'in_progress'
                              ? '进行中'
                              : milestone.status === 'submitted'
                              ? '已提交'
                              : milestone.status === 'approved'
                              ? '已通过'
                              : '已驳回'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h4 className="text-sm font-semibold text-primary-800 mb-3 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    最新消息
                  </h4>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar src={order.brandLogo} alt={order.brandName} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-primary-900">{order.brandName}</span>
                            <span className="text-xs text-neutral-400">{order.lastMessageTime}</span>
                          </div>
                          <p className="text-sm text-neutral-600">{order.lastMessage}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>

                <section>
                  <h4 className="text-sm font-semibold text-primary-800 mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    项目金额
                  </h4>
                  <Card>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-neutral-500">合同总金额</p>
                          <p className="text-lg font-bold text-primary-900 mt-1">{formatCurrency(order.budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">已结算</p>
                          <p className="text-lg font-bold text-success-600 mt-1">
                            {formatCurrency(Math.floor(order.budget * (progressPercent / 100)))}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-neutral-500">待结算</p>
                          <p className="text-lg font-bold text-warning-600 mt-1">
                            {formatCurrency(order.budget - Math.floor(order.budget * (progressPercent / 100)))}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
