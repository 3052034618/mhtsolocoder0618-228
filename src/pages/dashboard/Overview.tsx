import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Bell,
  Calendar,
  FolderKanban,
  Clock,
  Star,
  CheckCircle2,
  Users,
  Eye,
  DollarSign,
  Target,
  ArrowUpRight,
  Sparkles,
  FileText,
  Briefcase,
  Activity,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { useAuthStore } from '@/store/authStore';
import { getProjects } from '@/services/projectService';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { Project } from '@/services/mockData';

interface CreatorStats {
  monthlyIncome: number;
  incomeGrowth: number;
  activeProjects: number;
  pendingTasks: number;
  totalFollowers: number;
  avgResponseTime: number;
  rating: number;
  completionRate: number;
}

interface BrandStats {
  monthlyBudget: number;
  budgetUsage: number;
  activeProjects: number;
  pendingReviews: number;
  totalImpressions: number;
  avgResponseTime: number;
  satisfaction: number;
  completionRate: number;
}

const trendData = [
  { name: '第1周', value: 12000 },
  { name: '第2周', value: 19000 },
  { name: '第3周', value: 15000 },
  { name: '第4周', value: 28000 },
];

const recentActivities = [
  { id: 1, type: 'project', title: '智航智能手表测评项目', desc: '进入拍摄阶段', time: '10分钟前', icon: FolderKanban, color: 'primary' },
  { id: 2, type: 'message', title: '李美丽', desc: '发送了新的合作消息', time: '30分钟前', icon: MessageSquare, color: 'success' },
  { id: 3, type: 'payment', title: '海底捞探店项目', desc: '款项 ¥98,000 已到账', time: '2小时前', icon: DollarSign, color: 'gold' },
  { id: 4, type: 'milestone', title: '脚本策划', desc: '已通过品牌方审核', time: '昨天', icon: CheckCircle2, color: 'success' },
  { id: 5, type: 'invite', title: '悦味茶饮', desc: '邀请您合作夏季新品', time: '2天前', icon: Sparkles, color: 'warning' },
];

function StatNumber({ value, suffix = '', prefix = '', decimals = 0 }: { value: number; suffix?: string; prefix?: string; decimals?: number }) {
  const { value: animatedValue } = useCountUp(value, { decimals });
  return (
    <span>
      {prefix}
      {decimals > 0 ? animatedValue.toFixed(decimals) : Math.round(animatedValue).toLocaleString()}
      {suffix}
    </span>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 6) return '凌晨好';
  if (hour < 12) return '早上好';
  if (hour < 14) return '中午好';
  if (hour < 18) return '下午好';
  return '晚上好';
}

export default function Overview() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const isCreator = user?.role === 'creator';

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const result = await getProjects({}, { pageSize: 10 });
        setProjects(result.list);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  const inProgressProjects = projects.filter(
    (p) => p.status === 'executing' || p.status === 'signed' || p.status === 'negotiating'
  );

  const creatorStats: CreatorStats = {
    monthlyIncome: 156800,
    incomeGrowth: 12.5,
    activeProjects: 4,
    pendingTasks: 8,
    totalFollowers: 3860000,
    avgResponseTime: 1.2,
    rating: 4.9,
    completionRate: 96,
  };

  const brandStats: BrandStats = {
    monthlyBudget: 520000,
    budgetUsage: 68,
    activeProjects: 3,
    pendingReviews: 5,
    totalImpressions: 12800000,
    avgResponseTime: 2.5,
    satisfaction: 94,
    completionRate: 92,
  };

  const stats: CreatorStats | BrandStats = isCreator ? creatorStats : brandStats;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Avatar src={user?.avatar} alt={user?.name} size="lg" goldBorder />
          <div>
            <h1 className="text-2xl font-display font-bold text-primary-900">
              {getGreeting()}，{user?.name ?? '用户'}
              <span className="ml-2">👋</span>
            </h1>
            <p className="text-sm text-neutral-500 mt-0.5 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(new Date(), 'YYYY年MM月DD日 dddd')}
              <span className="text-neutral-300">|</span>
              <Badge variant={isCreator ? 'primary' : 'gold'} dot pulse>
                {isCreator ? '创作方' : '品牌方'}
              </Badge>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="md" leftIcon={<Bell className="w-4 h-4" />}>
            通知中心
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
          >
            {isCreator ? '发布合作' : '发起项目'}
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2 lg:row-span-2"
        >
          <Card className="h-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-texture-grid opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <CardContent className="relative p-6 h-full flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-primary-200 text-sm font-medium">
                    {isCreator ? '本月收入' : '本月预算使用'}
                  </p>
                  <h2 className="text-4xl font-display font-bold text-white mt-2">
                    {isCreator ? (
                      <StatNumber value={(stats as CreatorStats).monthlyIncome} prefix="¥" />
                    ) : (
                      <>
                        <StatNumber value={(stats as BrandStats).monthlyBudget} prefix="¥" />
                        <span className="text-lg text-primary-200 ml-2">总预算</span>
                      </>
                    )}
                  </h2>
                  {isCreator ? (
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="success" className="bg-white/10 text-success-300 border-success-400/30">
                        <ArrowUpRight className="w-3 h-3" />
                        {(stats as CreatorStats).incomeGrowth}%
                      </Badge>
                      <span className="text-sm text-primary-200">较上月增长</span>
                    </div>
                  ) : (
                    <div className="mt-3 w-48">
                      <Progress value={(stats as BrandStats).budgetUsage} variant="gold" size="md" showLabel labelPosition="inside" />
                    </div>
                  )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  {isCreator ? (
                    <DollarSign className="w-6 h-6 text-gold-300" />
                  ) : (
                    <Target className="w-6 h-6 text-gold-300" />
                  )}
                </div>
              </div>

              <div className="flex-1 mt-6 min-h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#C9A961" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }}
                    />
                    <YAxis hide />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#162A47',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '8px',
                        color: '#fff',
                      }}
                      formatter={(value: number) => [formatCurrency(value), '金额']}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#C9A961"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <Card hoverable className="h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <FolderKanban className="w-5 h-5 text-primary-600" />
                </div>
                <Badge variant="primary">进行中</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">进行中项目</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={stats.activeProjects} />
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-success-600">
                <ArrowUpRight className="w-3 h-3" />
                较上周 +2
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card hoverable className="h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-warning-600" />
                </div>
                <Badge variant="warning">待处理</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">
                  {isCreator ? '待处理事项' : '待审核内容'}
                </p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={isCreator ? (stats as CreatorStats).pendingTasks : (stats as BrandStats).pendingReviews} />
                </h3>
              </div>
              <div className="mt-4 flex items-center gap-1 text-xs text-danger-600">
                <Clock className="w-3 h-3" />
                3项需尽快处理
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <Card hoverable className="h-full">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
                  {isCreator ? (
                    <Users className="w-5 h-5 text-success-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-success-600" />
                  )}
                </div>
                <Badge variant="success">累计</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">
                  {isCreator ? '累计粉丝' : '累计曝光'}
                </p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber
                    value={isCreator ? (stats as CreatorStats).totalFollowers / 10000 : (stats as BrandStats).totalImpressions / 10000}
                    suffix="万"
                    decimals={1}
                  />
                </h3>
              </div>
              <div className="mt-4">
                <Progress
                  value={72}
                  variant="success"
                  size="sm"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="lg:col-span-2"
        >
          <Card hoverable className="h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-neutral-500">平均响应时长</p>
                  <h3 className="text-2xl font-display font-bold text-primary-900 mt-0.5">
                    <StatNumber value={stats.avgResponseTime} suffix="小时" decimals={1} />
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-success-600">
                    <ArrowUpRight className="w-3 h-3" />
                    优于 85% 用户
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <Card hoverable className="h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
                  <Star className="w-5 h-5 text-gold-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">
                    {isCreator ? '好评率' : '满意度'}
                  </p>
                  <h3 className="text-2xl font-display font-bold text-primary-900 mt-0.5">
                    {isCreator ? (
                      <StatNumber value={(stats as CreatorStats).rating} suffix="分" decimals={1} />
                    ) : (
                      <StatNumber value={(stats as BrandStats).satisfaction} suffix="%" />
                    )}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card hoverable className="h-full">
            <CardContent className="p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success-600" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">项目完成率</p>
                  <h3 className="text-2xl font-display font-bold text-primary-900 mt-0.5">
                    <StatNumber value={stats.completionRate} suffix="%" />
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-display font-semibold text-primary-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary-600" />
              进行中的项目
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              共 {inProgressProjects.length} 个项目正在推进中
            </p>
          </div>
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
            查看全部
          </Button>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="w-80 shrink-0 animate-pulse">
                <CardContent className="p-5">
                  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2 mb-4" />
                  <div className="h-2 bg-neutral-100 rounded w-full mb-2" />
                  <div className="h-2 bg-neutral-100 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : inProgressProjects.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {inProgressProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-500">暂无进行中的项目</p>
              <Button variant="primary" size="sm" className="mt-4">
                {isCreator ? '去发现合作机会' : '发起新项目'}
              </Button>
            </CardContent>
          </Card>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-display font-semibold text-primary-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary-600" />
              最近动态
            </h2>
            <p className="text-sm text-neutral-500 mt-0.5">您的最新操作记录</p>
          </div>
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
            全部动态
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="relative">
              {recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4 p-4 last:pb-4">
                  <div className="relative flex flex-col items-center">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10',
                        activity.color === 'primary' && 'bg-primary-50',
                        activity.color === 'success' && 'bg-success-50',
                        activity.color === 'warning' && 'bg-warning-50',
                        activity.color === 'gold' && 'bg-gold-50',
                        activity.color === 'danger' && 'bg-danger-50',
                      )}
                    >
                      <activity.icon
                        className={cn(
                          'w-5 h-5',
                          activity.color === 'primary' && 'text-primary-600',
                          activity.color === 'success' && 'text-success-600',
                          activity.color === 'warning' && 'text-warning-600',
                          activity.color === 'gold' && 'text-gold-600',
                          activity.color === 'danger' && 'text-danger-600',
                        )}
                      />
                    </div>
                    {index < recentActivities.length - 1 && (
                      <div className="absolute top-10 w-px h-full bg-neutral-200" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-primary-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-neutral-500 mt-0.5">
                          {activity.desc}
                        </p>
                      </div>
                      <span className="text-xs text-neutral-400 shrink-0">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const progress = Math.round(
    (project.milestones.filter((m) => m.status === 'approved').length / project.milestones.length) * 100
  );

  const statusColorMap = {
    pending: 'warning',
    negotiating: 'primary',
    signed: 'primary',
    executing: 'success',
    completed: 'success',
  } as const;

  const statusNameMap = {
    pending: '待审核',
    negotiating: '洽谈中',
    signed: '已签约',
    executing: '执行中',
    completed: '已完成',
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="w-80 shrink-0"
    >
      <Card hoverable className="h-full">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-start justify-between">
            <Badge variant={statusColorMap[project.status] as 'primary' | 'success' | 'warning' | 'gold' | 'danger' | 'default'}>
              {statusNameMap[project.status]}
            </Badge>
            <span className="text-xs text-neutral-400">
              {formatDate(project.startDate, 'MM/DD')} - {formatDate(project.endDate, 'MM/DD')}
            </span>
          </div>

          <h3 className="text-base font-semibold text-primary-900 mt-3 line-clamp-2">
            {project.title}
          </h3>

          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-neutral-500">项目进度</span>
              <span className="font-medium text-primary-600">{progress}%</span>
            </div>
            <Progress value={progress} variant="primary" size="sm" />
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
            <div className="text-sm">
              <span className="text-neutral-500">预算 </span>
              <span className="font-semibold text-primary-900">
                {formatCurrency(project.budget)}
              </span>
            </div>
            <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
              详情
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
