import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  MousePointerClick,
  TrendingUp,
  Target,
  FileText,
  Download,
  ChevronRight,
  BarChart3,
  Activity,
  Calendar,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  CheckCircle2,
  Clock,
  X,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { KpiGauge } from '@/components/charts/KpiGauge';
import { useCountUp } from '@/hooks/useCountUp';
import { formatNumber, formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { projects, creators } from '@/services/mockData';
import { useAppStore, type PerformanceReport } from '@/store/appStore';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';

const trendData = [
  { date: '11/01', impressions: 520000, clicks: 15600 },
  { date: '11/02', impressions: 680000, clicks: 20400 },
  { date: '11/03', impressions: 750000, clicks: 22500 },
  { date: '11/04', impressions: 820000, clicks: 24600 },
  { date: '11/05', impressions: 910000, clicks: 27300 },
  { date: '11/06', impressions: 1050000, clicks: 31500 },
  { date: '11/07', impressions: 980000, clicks: 29400 },
  { date: '11/08', impressions: 1120000, clicks: 33600 },
  { date: '11/09', impressions: 1250000, clicks: 37500 },
  { date: '11/10', impressions: 1180000, clicks: 35400 },
  { date: '11/11', impressions: 1350000, clicks: 40500 },
  { date: '11/12', impressions: 1480000, clicks: 44400 },
  { date: '11/13', impressions: 1420000, clicks: 42600 },
  { date: '11/14', impressions: 1580000, clicks: 47400 },
];

const completedProjects = projects.filter((p) => p.status === 'completed' || p.status === 'executing');

const projectKpiData: Record<string, {
  impressions: { actual: number; target: number };
  clicks: { actual: number; target: number };
  conversionRate: { actual: number; target: number };
  engagementRate: { actual: number; target: number };
}> = {
  proj1: {
    impressions: { actual: 5680000, target: 5000000 },
    clicks: { actual: 170400, target: 150000 },
    conversionRate: { actual: 3.0, target: 2.5 },
    engagementRate: { actual: 8.5, target: 6.0 },
  },
  proj2: {
    impressions: { actual: 6200000, target: 8000000 },
    clicks: { actual: 186000, target: 240000 },
    conversionRate: { actual: 2.8, target: 3.0 },
    engagementRate: { actual: 7.2, target: 8.0 },
  },
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

export default function Performance() {
  const { generateReport, getReportsByProjectId } = useAppStore();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(completedProjects[0]?.id || 'proj1');
  const [exportLoading, setExportLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<PerformanceReport | null>(null);

  const getReportKpiData = (report: PerformanceReport) => {
    return [
      {
        metric: '曝光量',
        actual: report.views,
        target: report.targetViews,
        unit: '次',
        completionRate: Math.round((report.views / report.targetViews) * 100),
      },
      {
        metric: '互动率',
        actual: report.engagementRate,
        target: report.targetEngagementRate,
        unit: '%',
        completionRate: Math.round((report.engagementRate / report.targetEngagementRate) * 100),
      },
      {
        metric: '点赞数',
        actual: report.likes,
        target: Math.round(report.targetViews * 0.03),
        unit: '次',
        completionRate: Math.round((report.likes / (report.targetViews * 0.03)) * 100),
      },
      {
        metric: '评论数',
        actual: report.comments,
        target: Math.round(report.targetViews * 0.005),
        unit: '次',
        completionRate: Math.round((report.comments / (report.targetViews * 0.005)) * 100),
      },
    ];
  };

  const projectReports = useMemo(() => {
    return getReportsByProjectId(selectedProjectId);
  }, [selectedProjectId, getReportsByProjectId]);

  const latestReport = projectReports.length > 0 ? projectReports[0] : null;

  const overallStats = {
    totalImpressions: 28600000,
    totalClicks: 858000,
    avgConversionRate: 3.0,
    avgKpiCompletion: 92,
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const selectedKpi = projectKpiData[selectedProjectId] || projectKpiData['proj1'];
  const creator = selectedProject ? creators.find((c) => c.id === selectedProject.creatorId) : undefined;

  const handleExport = () => {
    setExportLoading(true);
    setTimeout(() => {
      generateReport(selectedProjectId);
      setExportLoading(false);
    }, 2000);
  };

  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleDownloadReport = () => {
    alert('下载PDF报告（占位功能）');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary-900">KPI履约看板</h1>
          <p className="text-sm text-neutral-500 mt-1">追踪合作项目的KPI数据和履约情况</p>
        </div>
        <Button
          variant="gold"
          size="md"
          leftIcon={<FileText className="w-4 h-4" />}
          onClick={handleExport}
          loading={exportLoading}
        >
          生成履约报告
        </Button>
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
                  <Eye className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex items-center gap-1 text-xs text-success-600">
                  <ArrowUpRight className="w-3 h-3" />
                  +12.5%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">总曝光量</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={overallStats.totalImpressions / 10000} suffix="万" decimals={1} />
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
                <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
                  <MousePointerClick className="w-5 h-5 text-success-600" />
                </div>
                <div className="flex items-center gap-1 text-xs text-success-600">
                  <ArrowUpRight className="w-3 h-3" />
                  +8.3%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">总点击量</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={overallStats.totalClicks / 10000} suffix="万" decimals={1} />
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
                <div className="w-10 h-10 rounded-xl bg-warning-50 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-warning-600" />
                </div>
                <div className="flex items-center gap-1 text-xs text-danger-600">
                  <ArrowDownRight className="w-3 h-3" />
                  -0.5%
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">平均转化率</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={overallStats.avgConversionRate} suffix="%" decimals={1} />
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
                <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
                  <Award className="w-5 h-5 text-gold-600" />
                </div>
                <Badge variant="gold">优秀</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">平均KPI完成率</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={overallStats.avgKpiCompletion} suffix="%" />
                </h3>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <div className="px-5 py-4 border-b border-neutral-200">
              <h3 className="font-semibold text-sm text-primary-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-primary-500" />
                项目列表
              </h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {completedProjects.map((project, index) => {
                const projCreator = creators.find((c) => c.id === project.creatorId);
                const kpi = projectKpiData[project.id] || projectKpiData['proj1'];
                const avgCompletion = Math.round(
                  ((kpi.impressions.actual / kpi.impressions.target) +
                   (kpi.clicks.actual / kpi.clicks.target) +
                   (kpi.conversionRate.actual / kpi.conversionRate.target) +
                   (kpi.engagementRate.actual / kpi.engagementRate.target)) / 4 * 100
                );

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={cn(
                      'p-4 cursor-pointer transition-all duration-200 border-l-4',
                      selectedProjectId === project.id
                        ? 'bg-primary-50 border-l-primary-500'
                        : 'hover:bg-neutral-50 border-l-transparent'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {projCreator && (
                        <Avatar src={projCreator.avatar} alt={projCreator.name} size="sm" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-primary-900 truncate">
                          {project.title}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">
                          {projCreator?.name}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              avgCompletion >= 100 ? 'success' :
                              avgCompletion >= 80 ? 'primary' :
                              avgCompletion >= 60 ? 'warning' : 'danger'
                            }
                            size="sm"
                          >
                            {avgCompletion}% 完成
                          </Badge>
                        </div>
                      </div>
                      <ChevronRight className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        selectedProjectId === project.id ? 'text-primary-500' : 'text-neutral-400'
                      )} />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          {selectedProject && (
            <motion.div
              key={selectedProject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                    <div className="flex items-start gap-4">
                      {creator && (
                        <Avatar src={creator.avatar} alt={creator.name} size="lg" goldBorder />
                      )}
                      <div>
                        <h2 className="text-xl font-display font-semibold text-primary-900">
                          {selectedProject.title}
                        </h2>
                        <p className="text-sm text-neutral-500 mt-1">
                          {creator?.name} · 预算 {formatCurrency(selectedProject.budget)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <Badge
                            variant={
                              selectedProject.status === 'completed' ? 'success' : 'primary'
                            }
                          >
                            {selectedProject.status === 'completed' ? '已完成' : '执行中'}
                          </Badge>
                          <span className="text-xs text-neutral-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(selectedProject.startDate, 'YYYY/MM/DD')} - {formatDate(selectedProject.endDate, 'YYYY/MM/DD')}
                          </span>
                          {latestReport && (
                            <Badge variant="success" className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              报告已生成
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {latestReport && (
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Download className="w-3.5 h-3.5" />}
                          onClick={handleDownloadReport}
                        >
                          下载PDF
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        rightIcon={<Download className="w-3.5 h-3.5" />}
                      >
                        导出数据
                      </Button>
                    </div>
                  </div>

                  {latestReport && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 rounded-xl bg-success-50 border border-success-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-success-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-success-900">最新履约报告</p>
                            <p className="text-xs text-success-600 mt-0.5">
                              生成时间：{formatDate(latestReport.generatedAt, 'YYYY-MM-DD HH:mm')} · 综合得分 {latestReport.overallScore}分
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(latestReport)}
                          >
                            查看详情
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            leftIcon={<Download className="w-4 h-4" />}
                            onClick={handleDownloadReport}
                          >
                            下载
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                    <KpiGauge
                      actual={selectedKpi.impressions.actual}
                      target={selectedKpi.impressions.target}
                      label="曝光量"
                      unit="次"
                      threshold={0.6}
                    />
                    <KpiGauge
                      actual={selectedKpi.clicks.actual}
                      target={selectedKpi.clicks.target}
                      label="点击量"
                      unit="次"
                      threshold={0.6}
                    />
                    <KpiGauge
                      actual={selectedKpi.conversionRate.actual}
                      target={selectedKpi.conversionRate.target}
                      label="转化率"
                      unit="%"
                      threshold={0.7}
                    />
                    <KpiGauge
                      actual={selectedKpi.engagementRate.actual}
                      target={selectedKpi.engagementRate.target}
                      label="互动率"
                      unit="%"
                      threshold={0.7}
                    />
                  </div>

                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="font-semibold text-sm text-primary-900 mb-4 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary-500" />
                      KPI数据对比
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-neutral-200">
                            <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">指标</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">合同KPI</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">实际数据</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">行业均值</th>
                            <th className="text-right px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">完成率</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { name: '曝光量', actual: selectedKpi.impressions.actual, target: selectedKpi.impressions.target, industry: 4500000, unit: '次' },
                            { name: '点击量', actual: selectedKpi.clicks.actual, target: selectedKpi.clicks.target, industry: 135000, unit: '次' },
                            { name: '转化率', actual: selectedKpi.conversionRate.actual, target: selectedKpi.conversionRate.target, industry: 2.0, unit: '%' },
                            { name: '互动率', actual: selectedKpi.engagementRate.actual, target: selectedKpi.engagementRate.target, industry: 4.5, unit: '%' },
                          ].map((row, idx) => {
                            const completion = Math.round((row.actual / row.target) * 100);
                            return (
                              <tr key={idx} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors">
                                <td className="px-4 py-4">
                                  <span className="text-sm font-medium text-primary-900">{row.name}</span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <span className="text-sm text-neutral-600 font-mono">
                                    {formatNumber(row.target)}{row.unit}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <span className="text-sm font-semibold text-primary-900 font-mono">
                                    {formatNumber(row.actual)}{row.unit}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <span className="text-sm text-neutral-500 font-mono">
                                    {formatNumber(row.industry)}{row.unit}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <Badge
                                    variant={
                                      completion >= 100 ? 'success' :
                                      completion >= 80 ? 'primary' :
                                      completion >= 60 ? 'warning' : 'danger'
                                    }
                                    size="md"
                                  >
                                    {completion}%
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-base text-primary-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary-500" />
                  报告记录
                </h3>
                <span className="text-xs text-neutral-500">共 {projectReports.length} 份报告</span>
              </div>
              {projectReports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm text-neutral-500">暂无报告记录</p>
                  <p className="text-xs text-neutral-400 mt-1">点击"生成履约报告"按钮生成第一份报告</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {projectReports.map((report, index) => (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-primary-900">
                              履约报告 #{projectReports.length - index}
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5 flex items-center gap-2">
                              <Clock className="w-3 h-3" />
                              {formatDate(report.generatedAt, 'YYYY-MM-DD HH:mm')}
                              <span className="mx-1">·</span>
                              综合得分 <span className="font-semibold text-primary-600">{report.overallScore}分</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={report.overallScore >= 90 ? 'success' : report.overallScore >= 70 ? 'primary' : 'warning'}
                            size="sm"
                          >
                            {report.overallScore >= 90 ? '优秀' : report.overallScore >= 70 ? '良好' : '待改进'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewReport(report)}
                          >
                            查看详情
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Download className="w-4 h-4" />}
                            onClick={handleDownloadReport}
                          >
                            下载
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-base text-primary-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary-500" />
                  数据趋势
                </h3>
                <div className="flex items-center gap-2">
                  <Badge variant="primary">近14天</Badge>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E3A5F" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1E3A5F" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C9A961" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#737373', fontSize: 12 }}
                      axisLine={{ stroke: '#E7E5E4' }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#737373', fontSize: 12 }}
                      axisLine={{ stroke: '#E7E5E4' }}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 10000).toFixed(0)}万`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E7E5E4',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                      formatter={(value: number, name: string) => [
                        formatNumber(value),
                        name === 'impressions' ? '曝光量' : '点击量',
                      ]}
                    />
                    <Legend
                      iconType="circle"
                      formatter={(value: string) =>
                        value === 'impressions' ? '曝光量' : '点击量'
                      }
                    />
                    <Line
                      type="monotone"
                      dataKey="impressions"
                      stroke="#1E3A5F"
                      strokeWidth={3}
                      dot={{ fill: '#1E3A5F', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="#C9A961"
                      strokeWidth={3}
                      dot={{ fill: '#C9A961', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Modal open={showReportModal} onClose={() => setShowReportModal(false)} size="lg">
        <ModalHeader
          title="履约报告详情"
          description={selectedReport ? `${selectedReport.projectName} · 生成于 ${formatDate(selectedReport.generatedAt, 'YYYY-MM-DD HH:mm')}` : ''}
        />
        <ModalBody>
          {selectedReport && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-50 to-gold-50 border border-primary-100">
                <div>
                  <p className="text-sm text-neutral-500">综合得分</p>
                  <p className="text-3xl font-display font-bold text-primary-900 mt-1">
                    {selectedReport.overallScore}
                    <span className="text-lg text-neutral-400 ml-1">分</span>
                  </p>
                </div>
                <Badge
                  variant={selectedReport.overallScore >= 90 ? 'success' : selectedReport.overallScore >= 70 ? 'primary' : 'warning'}
                  size="md"
                >
                  {selectedReport.overallScore >= 90 ? '优秀' : selectedReport.overallScore >= 70 ? '良好' : '待改进'}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-primary-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary-500" />
                  KPI 完成情况
                </h4>
                <div className="space-y-3">
                  {getReportKpiData(selectedReport).map((kpi, index) => (
                    <div key={index} className="p-4 rounded-xl border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-primary-900">{kpi.metric}</span>
                        <Badge
                          variant={kpi.completionRate >= 100 ? 'success' : kpi.completionRate >= 80 ? 'primary' : 'warning'}
                          size="sm"
                        >
                          {kpi.completionRate}%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
                        <span>目标：{formatNumber(kpi.target)}{kpi.unit}</span>
                        <span>实际：<span className="font-semibold text-primary-700">{formatNumber(kpi.actual)}{kpi.unit}</span></span>
                      </div>
                      <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(kpi.completionRate, 100)}%` }}
                          transition={{ duration: 0.6, delay: index * 0.1 }}
                          className={cn(
                            'h-full rounded-full',
                            kpi.completionRate >= 100 ? 'bg-success-500' :
                            kpi.completionRate >= 80 ? 'bg-primary-500' :
                            'bg-warning-500'
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-primary-900">生成时间</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDate(selectedReport.generatedAt, 'YYYY年MM月DD日 HH:mm:ss')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowReportModal(false)}>
            关闭
          </Button>
          <Button
            variant="primary"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleDownloadReport}
          >
            下载PDF
          </Button>
        </ModalFooter>
      </Modal>
      </div>
    </DashboardLayout>
  );
}
