import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  LayoutGrid,
  List,
  FolderKanban,
  FileText,
  Clock,
  CheckCircle2,
  Calendar,
  ChevronRight,
  GripVertical,
  Search,
  Users,
  Package,
  X,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';
import { creators, sponsorshipPackages } from '@/services/mockData';
import type { Creator, SponsorshipPackage, Project } from '@/services/mockData';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

type ViewMode = 'kanban' | 'list';
type KanbanColumn = 'negotiating' | 'signed' | 'executing' | 'delivered';

const columnConfig: { key: KanbanColumn; title: string; color: string; bgColor: string }[] = [
  { key: 'negotiating', title: '洽谈中', color: 'primary', bgColor: 'bg-primary-50' },
  { key: 'signed', title: '已签约', color: 'warning', bgColor: 'bg-warning-50' },
  { key: 'executing', title: '执行中', color: 'success', bgColor: 'bg-success-50' },
  { key: 'delivered', title: '已交付', color: 'gold', bgColor: 'bg-gold-50' },
];

const columnStatusMap: Record<KanbanColumn, Project['status'][]> = {
  negotiating: ['negotiating'],
  signed: ['signed'],
  executing: ['executing'],
  delivered: ['completed'],
};

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

function getCreatorById(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}

function getProjectProgress(project: Project): number {
  const approved = project.milestones.filter((m) => m.status === 'approved').length;
  return Math.round((approved / project.milestones.length) * 100);
}

function getNextMilestoneDate(project: Project): string {
  const next = project.milestones.find((m) => m.status !== 'approved');
  return next?.dueDate ?? project.endDate;
}

export default function Projects() {
  const { user } = useAuthStore();
  const { getBrandByUserId, getProjectsByBrand, createProject } = useAppStore();
  const [viewMode, setViewMode] = useState<ViewMode>('kanban');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<SponsorshipPackage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const currentBrand = user ? getBrandByUserId(user.id) : undefined;

  const brandProjects = useMemo(() => {
    if (!currentBrand) return [];
    return getProjectsByBrand(currentBrand.id);
  }, [currentBrand, getProjectsByBrand]);

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return brandProjects;
    const kw = searchQuery.toLowerCase();
    return brandProjects.filter((p) =>
      p.title.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw)
    );
  }, [brandProjects, searchQuery]);

  const getProjectsByStatus = (statuses: typeof filteredProjects[0]['status'][]) => {
    return filteredProjects.filter((p) => statuses.includes(p.status));
  };

  const stats = useMemo(() => ({
    inProgress: brandProjects.filter((p) => p.status === 'executing').length,
    pendingSign: brandProjects.filter((p) => p.status === 'negotiating').length,
    pendingReview: brandProjects.filter((p) => p.status === 'signed').length,
    completed: brandProjects.filter((p) => p.status === 'completed').length,
  }), [brandProjects]);

  const availablePackages = selectedCreator
    ? sponsorshipPackages.filter((p) => p.creatorId === selectedCreator.id)
    : [];

  const handleCreateProject = async () => {
    if (!selectedCreator || !selectedPackage || !currentBrand) return;

    setIsCreating(true);
    try {

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + selectedPackage.deliveryDays + 7);

      const milestones = [
        {
          title: '创意方案确认',
          description: '完成创意方案和脚本策划，提交品牌方审核',
          dueDate: new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          deliverables: ['创意方案', '脚本大纲', '拍摄计划'],
        },
        {
          title: '内容制作',
          description: '完成内容拍摄和制作',
          dueDate: new Date(startDate.getTime() + (selectedPackage.deliveryDays - 3) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          deliverables: ['成片视频', '图片素材', '文案内容'],
        },
        {
          title: '发布与数据交付',
          description: '全平台发布，交付数据报告',
          dueDate: endDate.toISOString().split('T')[0],
          deliverables: ['发布链接', '数据报告', '结案总结'],
        },
      ];

      createProject({
        brandId: currentBrand.id,
        creatorId: selectedCreator.id,
        packageId: selectedPackage.id,
        title: `${selectedCreator.name} - ${selectedPackage.name}合作`,
        description: selectedPackage.description,
        type: selectedPackage.type,
        budget: selectedPackage.price,
        platform: selectedCreator.platforms[0]?.platform || 'douyin',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        milestones,
        requirements: selectedPackage.includes,
      });

      setModalOpen(false);
      setSelectedCreator(null);
      setSelectedPackage(null);
      alert('合作意向已创建成功！');
    } catch (error) {
      console.error('创建项目失败:', error);
      alert('创建项目失败，请重试');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary-900">合作项目看板</h1>
          <p className="text-sm text-neutral-500 mt-1">管理所有品牌合作项目的全流程</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              placeholder="搜索项目..."
              className="pl-9 w-48"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-neutral-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'p-2 rounded-md transition-all duration-200',
                viewMode === 'kanban' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-primary-500'
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 rounded-md transition-all duration-200',
                viewMode === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-primary-500'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
          >
            新建合作意向
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
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
                  <StatNumber value={stats.inProgress} />
                </h3>
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
                <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-warning-600" />
                </div>
                <Badge variant="warning">待签约</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">待签约项目</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={stats.pendingSign} />
                </h3>
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
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold-600" />
                </div>
                <Badge variant="gold">待审核</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">待审核项目</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={stats.pendingReview} />
                </h3>
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
                  <CheckCircle2 className="w-5 h-5 text-success-600" />
                </div>
                <Badge variant="success">已完成</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">已完成项目</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={stats.completed} />
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
          {columnConfig.map((column, colIndex) => (
            <motion.div
              key={column.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + colIndex * 0.1, duration: 0.4 }}
              className="min-h-[600px]"
            >
              <Card className="h-full">
                <CardContent className="p-4">
                  <div className={cn('flex items-center gap-2 px-3 py-2 rounded-lg mb-4', column.bgColor)}>
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      column.color === 'primary' && 'bg-primary-500',
                      column.color === 'warning' && 'bg-warning-500',
                      column.color === 'success' && 'bg-success-500',
                      column.color === 'gold' && 'bg-gold-500',
                    )} />
                    <h3 className="font-semibold text-sm text-primary-900">{column.title}</h3>
                    <Badge variant={column.color as 'primary' | 'success' | 'warning' | 'gold' | 'danger' | 'default'} size="sm">
                      {getProjectsByStatus(columnStatusMap[column.key]).length}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {getProjectsByStatus(columnStatusMap[column.key]).map((project, index) => {
                      const creator = getCreatorById(project.creatorId);
                      const progress = getProjectProgress(project);
                      const nextDate = getNextMilestoneDate(project);

                      return (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05, duration: 0.3 }}
                          whileHover={{ scale: 1.01, y: -2 }}
                          className="group bg-white rounded-xl border border-neutral-200 p-4 cursor-grab active:cursor-grabbing hover:border-primary-300 hover:shadow-soft transition-all duration-200"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <GripVertical className="w-4 h-4 text-neutral-400" />
                            </div>
                            <Badge
                              variant={
                                project.status === 'negotiating' ? 'primary' :
                                project.status === 'signed' ? 'warning' :
                                project.status === 'executing' ? 'success' : 'gold'
                              }
                              size="sm"
                            >
                              {project.type === 'mention' ? '口播' : project.type === 'patch' ? '贴片' : '联名'}
                            </Badge>
                          </div>

                          <h4 className="font-semibold text-sm text-primary-900 line-clamp-2 mb-3">
                            {project.title}
                          </h4>

                          {creator && (
                            <div className="flex items-center gap-2 mb-3">
                              <Avatar src={creator.avatar} alt={creator.name} size="xs" />
                              <span className="text-xs text-neutral-600 truncate">{creator.name}</span>
                            </div>
                          )}

                          <div className="mb-3">
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="text-neutral-500">项目进度</span>
                              <span className="font-medium text-primary-600">{progress}%</span>
                            </div>
                            <Progress
                              value={progress}
                              variant={
                                progress < 50 ? 'danger' :
                                progress < 80 ? 'warning' :
                                progress < 100 ? 'primary' : 'success'
                              }
                              size="sm"
                            />
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                            <div className="text-sm">
                              <span className="font-semibold text-primary-900">
                                {formatCurrency(project.budget)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-neutral-500">
                              <Calendar className="w-3 h-3" />
                              {formatDate(nextDate, 'MM/DD')}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}

                    {getProjectsByStatus(columnStatusMap[column.key]).length === 0 && (
                      <div className="py-12 text-center">
                        <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                          <FolderKanban className="w-6 h-6 text-neutral-400" />
                        </div>
                        <p className="text-sm text-neutral-400">暂无项目</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">项目名称</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">创作方</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">类型</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">预算</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">进度</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">状态</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">下一节点</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-neutral-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project, index) => {
                    const creator = getCreatorById(project.creatorId);
                    const progress = getProjectProgress(project);
                    const nextDate = getNextMilestoneDate(project);

                    return (
                      <motion.tr
                        key={project.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-medium text-sm text-primary-900">{project.title}</p>
                        </td>
                        <td className="px-6 py-4">
                          {creator && (
                            <div className="flex items-center gap-2">
                              <Avatar src={creator.avatar} alt={creator.name} size="xs" />
                              <span className="text-sm text-neutral-700">{creator.name}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              project.type === 'mention' ? 'primary' :
                              project.type === 'patch' ? 'warning' : 'gold'
                            }
                            size="sm"
                          >
                            {project.type === 'mention' ? '口播' : project.type === 'patch' ? '贴片' : '联名'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-primary-900">
                            {formatCurrency(project.budget)}
                          </span>
                        </td>
                        <td className="px-6 py-4 w-40">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={progress}
                              variant={
                                progress < 50 ? 'danger' :
                                progress < 80 ? 'warning' :
                                progress < 100 ? 'primary' : 'success'
                              }
                              size="sm"
                            />
                            <span className="text-xs font-medium text-neutral-600 w-10">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              project.status === 'negotiating' ? 'primary' :
                              project.status === 'signed' ? 'warning' :
                              project.status === 'executing' ? 'success' :
                              project.status === 'completed' ? 'gold' : 'default'
                            }
                            size="sm"
                          >
                            {project.status === 'pending' ? '待审核' :
                             project.status === 'negotiating' ? '洽谈中' :
                             project.status === 'signed' ? '已签约' :
                             project.status === 'executing' ? '执行中' :
                             project.status === 'completed' ? '已完成' : '已取消'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-neutral-600">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(nextDate, 'YYYY/MM/DD')}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                            详情
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="xl">
        <ModalHeader
          title="新建合作意向"
          description="选择创作者和合作套餐，发起新的合作项目"
        />
        <ModalBody>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
                选择创作者
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                {creators.map((creator) => (
                  <div
                    key={creator.id}
                    onClick={() => {
                      setSelectedCreator(creator);
                      setSelectedPackage(null);
                    }}
                    className={cn(
                      'p-3 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      selectedCreator?.id === creator.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar src={creator.avatar} alt={creator.name} size="md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-primary-900 truncate">{creator.name}</p>
                        <p className="text-xs text-neutral-500 truncate">
                          {creator.categories.slice(0, 2).join(' · ')}
                        </p>
                        <p className="text-xs text-gold-600 mt-0.5">
                          评分 {creator.rating} · {creator.totalCollaborations}次合作
                        </p>
                      </div>
                      {selectedCreator?.id === creator.id && (
                        <CheckCircle2 className="w-5 h-5 text-primary-500 shrink-0" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedCreator && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <label className="block text-sm font-medium text-primary-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary-500" />
                  选择套餐
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availablePackages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg)}
                      className={cn(
                        'p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative',
                        selectedPackage?.id === pkg.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                      )}
                    >
                      {pkg.recommended && (
                        <Badge variant="gold" size="sm" className="absolute top-2 right-2">
                          推荐
                        </Badge>
                      )}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-sm text-primary-900">{pkg.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {pkg.type === 'mention' ? '口播' : pkg.type === 'patch' ? '贴片' : '联名'} · {pkg.deliveryDays}天交付
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-600 mb-3 line-clamp-2">{pkg.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-900">
                          {formatCurrency(pkg.price)}
                        </span>
                        {selectedPackage?.id === pkg.id && (
                          <CheckCircle2 className="w-5 h-5 text-primary-500" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setModalOpen(false)}>
            取消
          </Button>
          <Button
            variant="primary"
            disabled={!selectedCreator || !selectedPackage || isCreating}
            onClick={handleCreateProject}
            loading={isCreating}
          >
            {isCreating ? '创建中...' : '确认发起合作'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
    </DashboardLayout>
  );
}
