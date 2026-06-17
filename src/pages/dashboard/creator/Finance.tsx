import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Lock,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Download,
  Plus,
  Search,
  Filter,
  ChevronRight,
  Receipt,
  CreditCard,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Eye,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Progress } from '@/components/ui/Progress';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { wallets, transactions, projects, brands } from '@/services/mockData';
import { useAuthStore } from '@/store/authStore';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';
import type { Transaction, TransactionType } from '@/services/mockData';

const incomeTrend = [
  { month: '6月', income: 85000 },
  { month: '7月', income: 128000 },
  { month: '8月', income: 98000 },
  { month: '9月', income: 156000 },
  { month: '10月', income: 142000 },
  { month: '11月', income: 186000 },
];

const transactionTypeConfig: Record<TransactionType, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  deposit: { label: '充值', icon: ArrowUpRight, color: 'text-success-600 bg-success-50' },
  withdraw: { label: '提现', icon: ArrowDownLeft, color: 'text-danger-600 bg-danger-50' },
  payment: { label: '项目收入', icon: Wallet, color: 'text-primary-600 bg-primary-50' },
  refund: { label: '退款', icon: ArrowUpRight, color: 'text-warning-600 bg-warning-50' },
  commission: { label: '平台奖励', icon: Sparkles, color: 'text-gold-600 bg-gold-50' },
};

const transactionStatusConfig: Record<Transaction['status'], { label: string; variant: 'success' | 'warning' | 'danger' | 'default' }> = {
  completed: { label: '已完成', variant: 'success' },
  pending: { label: '处理中', variant: 'warning' },
  failed: { label: '失败', variant: 'danger' },
};

interface TransactionWithProject extends Transaction {
  projectTitle?: string;
  brandName?: string;
}

export default function Finance() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const wallet = wallets.find((w) => w.userId === user?.id) ?? wallets[0];
  const availableBalance = wallet.balance - wallet.frozenAmount;

  const { value: animatedBalance } = useCountUp(wallet.balance, { decimals: 2 });
  const { value: animatedFrozen } = useCountUp(wallet.frozenAmount, { decimals: 2 });

  const [transactionsWithInfo, setTransactionsWithInfo] = useState<TransactionWithProject[]>([]);

  useEffect(() => {
    const enriched: TransactionWithProject[] = transactions
      .filter((t) => t.walletId === wallet.id)
      .map((t) => {
        const project = projects.find((p) => p.id === t.projectId);
        const brand = project ? brands.find((b) => b.id === project.brandId) : undefined;
        return {
          ...t,
          projectTitle: project?.title,
          brandName: brand?.name,
        };
      });
    setTransactionsWithInfo(enriched);
  }, [wallet.id]);

  const filteredTransactions = transactionsWithInfo.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.projectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (t.brandName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalIncome = transactions
    .filter((t) => t.walletId === wallet.id && (t.type === 'payment' || t.type === 'commission' || t.type === 'refund'))
    .reduce((sum, t) => sum + t.amount, 0);

  const statCards = [
    {
      label: '账户余额',
      value: animatedBalance,
      prefix: '¥',
      icon: Wallet,
      gradient: 'from-primary-500 to-primary-600',
      bgColor: 'bg-primary-50',
      iconColor: 'text-primary-600',
    },
    {
      label: '冻结中',
      value: animatedFrozen,
      prefix: '¥',
      icon: Lock,
      gradient: 'from-warning-500 to-warning-600',
      bgColor: 'bg-warning-50',
      iconColor: 'text-warning-600',
    },
    {
      label: '待结算',
      value: Math.floor(totalIncome * 0.15),
      prefix: '¥',
      icon: Clock,
      gradient: 'from-gold-500 to-gold-600',
      bgColor: 'bg-gold-50',
      iconColor: 'text-gold-600',
    },
    {
      label: '累计收入',
      value: totalIncome,
      prefix: '¥',
      icon: TrendingUp,
      gradient: 'from-success-500 to-success-600',
      bgColor: 'bg-success-50',
      iconColor: 'text-success-600',
      trend: '+12.5%',
    },
  ];

  const invoices = [
    { id: 'inv-1', title: '悦味夏季新品茶饮推广', amount: 98000, status: '已开票', date: '2024-07-02', type: '增值税专用发票' },
    { id: 'inv-2', title: '智航智能手表深度测评', amount: 37500, status: '待开票', date: '2024-10-30', type: '增值税普通发票' },
    { id: 'inv-3', title: '平台推荐奖励', amount: 2000, status: '已开票', date: '2024-11-01', type: '增值税普通发票' },
  ];

  const pendingSettlements = [
    {
      id: 'set-1',
      projectTitle: '智航智能手表深度测评',
      brandName: '智航科技',
      totalAmount: 75000,
      receivedAmount: 37500,
      pendingAmount: 37500,
      progress: 50,
      expectedDate: '2024-11-25',
    },
    {
      id: 'set-2',
      projectTitle: '逸动跑步鞋新品推广',
      brandName: '逸动运动',
      totalAmount: 168000,
      receivedAmount: 0,
      pendingAmount: 168000,
      progress: 0,
      expectedDate: '2024-12-20',
    },
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
            <h1 className="text-2xl font-display font-bold text-primary-900">财务中心</h1>
            <p className="text-sm text-neutral-500 mt-1">管理您的收入、结算和发票</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md" leftIcon={<Download className="w-4 h-4" />}>
              导出流水
            </Button>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setWithdrawModalOpen(true)}
            >
              申请结算
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
              >
                <Card hoverable className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-neutral-500">{stat.label}</p>
                        <p className="text-2xl font-display font-bold text-primary-900 mt-1.5">
                          {stat.prefix}
                          {typeof stat.value === 'number'
                            ? stat.value.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                            : stat.value}
                        </p>
                        {stat.trend && (
                          <div className="flex items-center gap-1 mt-2">
                            <Badge variant="success" className="text-xs">
                              <ArrowUpRight className="w-3 h-3 mr-0.5" />
                              {stat.trend}
                            </Badge>
                            <span className="text-xs text-neutral-500">较上月</span>
                          </div>
                        )}
                      </div>
                      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', stat.bgColor)}>
                        <Icon className={cn('w-5 h-5', stat.iconColor)} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-primary-900">收入趋势</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">近6个月收入变化</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    近6个月
                  </Button>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={incomeTrend}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C9A961" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C9A961" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(v) => `¥${(v / 10000).toFixed(0)}万`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #E5E7EB',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      }}
                      formatter={(value: number) => [formatCurrency(value), '收入']}
                    />
                    <Area
                      type="monotone"
                      dataKey="income"
                      stroke="#C9A961"
                      strokeWidth={3}
                      fill="url(#incomeGradient)"
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
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-primary-900">结算进度追踪</h2>
                  <p className="text-sm text-neutral-500 mt-0.5">查看进行中的项目结算状态</p>
                </div>
                <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
                  查看全部
                </Button>
              </div>

              <div className="space-y-4">
                {pendingSettlements.map((settlement, index) => (
                  <motion.div
                    key={settlement.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-xl border border-neutral-200 hover:border-primary-200 hover:bg-primary-50/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-primary-900 truncate">{settlement.projectTitle}</h3>
                        </div>
                        <p className="text-sm text-neutral-500">{settlement.brandName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm text-neutral-500">待结算</p>
                        <p className="text-lg font-bold text-warning-600">{formatCurrency(settlement.pendingAmount)}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-neutral-500">
                          已结算 {formatCurrency(settlement.receivedAmount)} / {formatCurrency(settlement.totalAmount)}
                        </span>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          预计到账 {formatDate(settlement.expectedDate, 'MM-DD')}
                        </span>
                      </div>
                      <Progress value={settlement.progress} variant="gold" size="sm" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-0">
              <Tabs defaultValue="transactions">
                <div className="px-6 pt-4 border-b border-neutral-100">
                  <TabList>
                    <Tab value="transactions" icon={<Receipt className="w-4 h-4" />}>
                      资金流水
                    </Tab>
                    <Tab value="invoices" icon={<FileText className="w-4 h-4" />}>
                      发票管理
                    </Tab>
                  </TabList>
                </div>

                <TabPanel value="transactions" className="p-0">
                  <div className="p-4 sm:p-6 border-b border-neutral-100">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1 max-w-md">
                        <Input
                          placeholder="搜索项目、品牌或描述..."
                          prefixIcon={<Search className="w-4 h-4" />}
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value as TransactionType | 'all')}
                          className="h-11 px-4 rounded-md border border-neutral-300 bg-white text-sm text-neutral-700 hover:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                        >
                          <option value="all">全部类型</option>
                          <option value="payment">项目收入</option>
                          <option value="withdraw">提现</option>
                          <option value="refund">退款</option>
                          <option value="commission">平台奖励</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-neutral-100">
                          <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                            日期
                          </th>
                          <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                            项目/描述
                          </th>
                          <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                            类型
                          </th>
                          <th className="text-right text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                            金额
                          </th>
                          <th className="text-center text-xs font-medium text-neutral-500 uppercase tracking-wider px-6 py-3">
                            状态
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center">
                              <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-3">
                                <Receipt className="w-6 h-6 text-neutral-400" />
                              </div>
                              <p className="text-sm text-neutral-500">暂无交易记录</p>
                            </td>
                          </tr>
                        ) : (
                          filteredTransactions.map((tx, index) => {
                            const typeConfig = transactionTypeConfig[tx.type];
                            const TypeIcon = typeConfig.icon;
                            const statusConfig = transactionStatusConfig[tx.status];
                            const isIncome = tx.type === 'payment' || tx.type === 'refund' || tx.type === 'commission';

                            return (
                              <motion.tr
                                key={tx.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.02 }}
                                className={cn(
                                  'border-b border-neutral-50 transition-colors hover:bg-neutral-50',
                                  index % 2 === 1 && 'bg-neutral-50/50'
                                )}
                              >
                                <td className="px-6 py-4">
                                  <p className="text-sm text-neutral-700">{formatDate(tx.createdAt, 'YYYY-MM-DD')}</p>
                                  <p className="text-xs text-neutral-400">{formatDate(tx.createdAt, 'HH:mm')}</p>
                                </td>
                                <td className="px-6 py-4">
                                  <p className="text-sm font-medium text-primary-900">
                                    {tx.projectTitle ?? tx.description}
                                  </p>
                                  {tx.brandName && (
                                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                      <Building2 className="w-3 h-3" />
                                      {tx.brandName}
                                    </p>
                                  )}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium', typeConfig.color)}>
                                    <TypeIcon className="w-3.5 h-3.5" />
                                    {typeConfig.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <p
                                    className={cn(
                                      'text-sm font-semibold',
                                      isIncome ? 'text-success-600' : tx.type === 'withdraw' ? 'text-danger-600' : 'text-primary-900'
                                    )}
                                  >
                                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                                  </p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <Badge variant={statusConfig.variant} dot={statusConfig.variant === 'warning'}>
                                    {statusConfig.label}
                                  </Badge>
                                </td>
                              </motion.tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </TabPanel>

                <TabPanel value="invoices" className="p-0">
                  <div className="p-4 sm:p-6 border-b border-neutral-100 flex justify-end">
                    <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                      申请开票
                    </Button>
                  </div>

                  <div className="divide-y divide-neutral-100">
                    {invoices.map((invoice, index) => (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-4 sm:p-6 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-6 h-6 text-primary-600" />
                          </div>
                          <div>
                            <p className="font-medium text-primary-900">{invoice.title}</p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-neutral-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(invoice.date)}
                              </span>
                              <span className="text-xs text-neutral-500 flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {invoice.type}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 shrink-0">
                          <p className="text-lg font-bold text-primary-900">{formatCurrency(invoice.amount)}</p>
                          <Badge variant={invoice.status === '已开票' ? 'success' : 'warning'}>
                            {invoice.status}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
                              查看
                            </Button>
                            {invoice.status === '已开票' && (
                              <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                                下载
                              </Button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabPanel>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <Modal open={withdrawModalOpen} onClose={() => setWithdrawModalOpen(false)} size="md">
          <ModalHeader
            title="申请结算"
            description="将账户余额提现到您的银行卡"
          />
          <ModalBody className="space-y-5">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-gold-50 border border-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">可提现金额</p>
                  <p className="text-2xl font-bold text-primary-900 mt-1">{formatCurrency(availableBalance)}</p>
                </div>
                <Badge variant="warning">
                  <Lock className="w-3 h-3 mr-1" />
                  冻结 {formatCurrency(wallet.frozenAmount)}
                </Badge>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-800 mb-2">提现金额</label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="请输入提现金额"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  prefixIcon={<span className="text-neutral-500 font-medium">¥</span>}
                />
                <button
                  onClick={() => setWithdrawAmount(String(availableBalance))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  全部提现
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-800 mb-2">到账账户</label>
              <div className="p-4 rounded-xl border border-neutral-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-primary-900">中国工商银行</p>
                  <p className="text-sm text-neutral-500">储蓄卡 ···· 8888</p>
                </div>
                <Button variant="ghost" size="sm">更换</Button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-warning-50 border border-warning-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-warning-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-warning-700">
                  <p className="font-medium">提现说明</p>
                  <p className="mt-1 text-warning-600">提现将在1-3个工作日内到账，单笔最低提现 ¥100，最高 ¥500,000</p>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setWithdrawModalOpen(false)}>取消</Button>
            <Button
              variant="primary"
              onClick={() => {
                setWithdrawModalOpen(false);
                setWithdrawAmount('');
              }}
              disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > availableBalance}
              leftIcon={<CheckCircle2 className="w-4 h-4" />}
            >
              确认提现
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </DashboardLayout>
  );
}
