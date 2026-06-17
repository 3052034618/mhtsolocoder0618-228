import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Wallet,
  Shield,
  CheckCircle2,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  Filter,
  ChevronRight,
  Calendar,
  Search,
  Receipt,
  Download,
  Clock,
  AlertCircle,
  MoreHorizontal,
  CreditCard,
  TrendingUp,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { useCountUp } from '@/hooks/useCountUp';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/format';
import { cn } from '@/lib/utils';
import { projects, creators, wallets, transactions } from '@/services/mockData';
import type { Transaction } from '@/services/mockData';

type TransactionFilter = 'all' | 'deposit' | 'payment' | 'refund' | 'commission' | 'withdraw';

const brandTransactions = transactions.filter((t) => t.walletId === 'w3' || t.walletId === 'w4');

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

function getTransactionIcon(type: Transaction['type']) {
  switch (type) {
    case 'deposit': return <Plus className="w-4 h-4" />;
    case 'withdraw': return <ArrowDownLeft className="w-4 h-4" />;
    case 'payment': return <ArrowUpRight className="w-4 h-4" />;
    case 'refund': return <ArrowDownLeft className="w-4 h-4" />;
    case 'commission': return <TrendingUp className="w-4 h-4" />;
    default: return <Wallet className="w-4 h-4" />;
  }
}

function getTransactionName(type: Transaction['type']) {
  switch (type) {
    case 'deposit': return '账户充值';
    case 'withdraw': return '提现';
    case 'payment': return '项目付款';
    case 'refund': return '退款';
    case 'commission': return '平台奖励';
    default: return '其他';
  }
}

export default function Funds() {
  const [filter, setFilter] = useState<TransactionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const wallet = wallets.find((w) => w.userId === 'u3') || wallets[2];

  const stats = {
    balance: wallet.balance,
    held: wallet.frozenAmount,
    settled: 98000,
    totalBudget: 520000,
  };

  const escrowProjects = projects.filter((p) => p.status === 'executing' || p.status === 'signed');

  const settlements = [
    {
      id: 's1',
      projectTitle: '智航智能手表深度测评',
      creatorName: '张评测说数码',
      creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
      totalAmount: 75000,
      releasedAmount: 37500,
      progress: 50,
      status: 'pending',
    },
    {
      id: 's2',
      projectTitle: '悦味茶饮周边穿搭联名',
      creatorName: '小美穿搭日记',
      creatorAvatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
      totalAmount: 258000,
      releasedAmount: 0,
      deductionAmount: 0,
      progress: 0,
      status: 'negotiating',
    },
    {
      id: 's3',
      projectTitle: '悦味夏季新品茶饮推广',
      creatorName: '林小雨的美食日记',
      creatorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
      totalAmount: 98000,
      releasedAmount: 98000,
      progress: 100,
      status: 'completed',
    },
  ];

  const filteredTransactions = brandTransactions.filter((t) => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (searchQuery && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const filterOptions: { value: TransactionFilter; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'deposit', label: '充值' },
    { value: 'payment', label: '付款' },
    { value: 'refund', label: '退款' },
    { value: 'withdraw', label: '提现' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary-900">资金管理</h1>
          <p className="text-sm text-neutral-500 mt-1">管理账户资金、项目托管和结算</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="md"
            leftIcon={<ArrowDownLeft className="w-4 h-4" />}
            onClick={() => setShowWithdrawModal(true)}
          >
            提现
          </Button>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setShowRechargeModal(true)}
          >
            充值
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="lg:col-span-2 lg:row-span-2"
        >
          <Card className="h-full bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-texture-grid opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
            <CardContent className="relative p-6 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-gold-300" />
                  </div>
                  <Badge variant="gold" className="bg-white/10 text-gold-300 border-gold-400/30">
                    品牌账户
                  </Badge>
                </div>
                <p className="text-primary-200 text-sm font-medium mt-5">账户可用余额</p>
                <h2 className="text-5xl font-display font-bold text-white mt-2">
                  <StatNumber value={stats.balance} prefix="¥" />
                </h2>
                <p className="text-primary-200 text-sm mt-2">
                  上次更新：{formatDate(new Date(), 'YYYY-MM-DD HH:mm')}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/10">
                <div>
                  <p className="text-primary-200 text-xs">冻结金额</p>
                  <p className="text-white text-xl font-semibold mt-1">
                    {formatCurrency(stats.held)}
                  </p>
                </div>
                <div>
                  <p className="text-primary-200 text-xs">总预算</p>
                  <p className="text-white text-xl font-semibold mt-1">
                    {formatCurrency(stats.totalBudget)}
                  </p>
                </div>
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
                  <Shield className="w-5 h-5 text-warning-600" />
                </div>
                <Badge variant="warning">托管中</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">已托管资金</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={stats.held} prefix="¥" />
                </h3>
              </div>
              <div className="mt-3 text-xs text-neutral-500">
                共 {escrowProjects.length} 个项目托管中
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
                <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-success-600" />
                </div>
                <Badge variant="success">已结算</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">已结算金额</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={stats.settled} prefix="¥" />
                </h3>
              </div>
              <div className="mt-3 text-xs text-success-600 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" />
                本月结算 2 笔
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
                <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                  <PiggyBank className="w-5 h-5 text-primary-600" />
                </div>
                <Badge variant="primary">本月</Badge>
              </div>
              <div className="mt-4">
                <p className="text-sm text-neutral-500">本月预算使用</p>
                <h3 className="text-3xl font-display font-bold text-primary-900 mt-1">
                  <StatNumber value={68} suffix="%" />
                </h3>
              </div>
              <div className="mt-3">
                <Progress value={68} variant="primary" size="sm" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-base text-primary-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                项目资金托管
              </h3>
              <Badge variant="primary">{escrowProjects.length} 个进行中</Badge>
            </div>
            <div className="space-y-4">
              {escrowProjects.map((project, index) => {
                const creator = creators.find((c) => c.id === project.creatorId);
                const progress = Math.round(
                  (project.milestones.filter((m) => m.status === 'approved').length / project.milestones.length) * 100
                );
                const releasedAmount = Math.round(project.budget * (progress / 100));

                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    className="p-4 rounded-xl border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {creator && (
                          <Avatar src={creator.avatar} alt={creator.name} size="sm" />
                        )}
                        <div>
                          <p className="font-medium text-sm text-primary-900">{project.title}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">{creator?.name}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          project.status === 'executing' ? 'success' :
                          project.status === 'signed' ? 'warning' : 'primary'
                        }
                        size="sm"
                      >
                        {project.status === 'executing' ? '执行中' : project.status === 'signed' ? '已签约' : '洽谈中'}
                      </Badge>
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-neutral-500">释放进度</span>
                        <span className="font-medium text-primary-600">{progress}%</span>
                      </div>
                      <Progress
                        value={progress}
                        variant={progress < 50 ? 'warning' : progress < 100 ? 'primary' : 'success'}
                        size="sm"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm pt-3 border-t border-neutral-100">
                      <div>
                        <span className="text-neutral-500">托管总额 </span>
                        <span className="font-semibold text-primary-900">{formatCurrency(project.budget)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">已释放 </span>
                        <span className="font-semibold text-success-600">{formatCurrency(releasedAmount)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Tabs defaultValue="pending" className="h-full flex flex-col">
              <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="font-semibold text-base text-primary-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  结算审批
                </h3>
              </div>
              <TabList className="px-6">
                <Tab value="pending">
                  待审批
                  <Badge variant="warning" size="sm" className="ml-1.5">1</Badge>
                </Tab>
                <Tab value="negotiating">
                  扣款协商中
                  <Badge variant="danger" size="sm" className="ml-1.5">1</Badge>
                </Tab>
                <Tab value="completed">已完成</Tab>
              </TabList>

              <TabPanel value="pending" className="flex-1 p-6 pt-4">
                <div className="space-y-4">
                  {settlements.filter((s) => s.status === 'pending').map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-warning-200 bg-warning-50/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={s.creatorAvatar} alt={s.creatorName} size="sm" />
                          <div>
                            <p className="font-medium text-sm text-primary-900">{s.projectTitle}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{s.creatorName}</p>
                          </div>
                        </div>
                        <Badge variant="warning" className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          待审批
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-3">
                        <div>
                          <span className="text-neutral-500">申请结算 </span>
                          <span className="font-semibold text-primary-900">{formatCurrency(s.totalAmount - s.releasedAmount)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">进度 </span>
                          <span className="font-medium text-neutral-700">{s.progress}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="primary" size="sm">同意结算</Button>
                        <Button variant="outline" size="sm">查看详情</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>

              <TabPanel value="negotiating" className="flex-1 p-6 pt-4">
                <div className="space-y-4">
                  {settlements.filter((s) => s.status === 'negotiating').map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-danger-200 bg-danger-50/50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={s.creatorAvatar} alt={s.creatorName} size="sm" />
                          <div>
                            <p className="font-medium text-sm text-primary-900">{s.projectTitle}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{s.creatorName}</p>
                          </div>
                        </div>
                        <Badge variant="danger" className="flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          扣款协商中
                        </Badge>
                      </div>
                      <div className="text-xs text-danger-700 mb-3 p-2 rounded-lg bg-danger-100/50 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>品牌方申请扣款 ¥5,000，原因：KPI未达标，待创作方确认</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">查看详情</Button>
                        <Button variant="ghost" size="sm">参与协商</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>

              <TabPanel value="completed" className="flex-1 p-6 pt-4">
                <div className="space-y-4">
                  {settlements.filter((s) => s.status === 'completed').map((s) => (
                    <div key={s.id} className="p-4 rounded-xl border border-neutral-200">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar src={s.creatorAvatar} alt={s.creatorName} size="sm" />
                          <div>
                            <p className="font-medium text-sm text-primary-900">{s.projectTitle}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{s.creatorName}</p>
                          </div>
                        </div>
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          已完成
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <span className="text-neutral-500">结算金额 </span>
                          <span className="font-semibold text-success-600">{formatCurrency(s.totalAmount)}</span>
                        </div>
                        <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                          详情
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabPanel>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
              <h3 className="font-semibold text-base text-primary-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                交易流水
              </h3>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <Input
                    placeholder="搜索交易..."
                    className="pl-9 w-40"
                    size="sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
                  筛选
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-5">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilter(opt.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    filter === opt.value
                      ? 'bg-primary-500 text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto -mx-6">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-neutral-200 bg-neutral-50/50">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">交易类型</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">描述</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">金额</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">状态</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">时间</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx, index) => (
                    <motion.tr
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03, duration: 0.3 }}
                      className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center',
                            tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission'
                              ? 'bg-success-50 text-success-600'
                              : 'bg-warning-50 text-warning-600'
                          )}>
                            {getTransactionIcon(tx.type)}
                          </div>
                          <span className="text-sm font-medium text-neutral-700">
                            {getTransactionName(tx.type)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-600 truncate max-w-xs">{tx.description}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={cn(
                          'text-sm font-semibold font-mono',
                          tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission'
                            ? 'text-success-600'
                            : 'text-danger-600'
                        )}>
                          {tx.type === 'deposit' || tx.type === 'refund' || tx.type === 'commission' ? '+' : '-'}
                          {formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={tx.status === 'completed' ? 'success' : tx.status === 'pending' ? 'warning' : 'danger'}
                          size="sm"
                        >
                          {tx.status === 'completed' ? '已完成' : tx.status === 'pending' ? '处理中' : '失败'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-500">{formatRelativeTime(tx.createdAt)}</p>
                      </td>
                    </motion.tr>
                  ))}
                  {filteredTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <p className="text-sm text-neutral-500">暂无交易记录</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-base text-primary-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary-500" />
                发票管理
              </h3>
              <Button variant="ghost" size="sm" rightIcon={<ChevronRight className="w-3.5 h-3.5" />}>
                全部
              </Button>
            </div>

            <div className="space-y-3 mb-5">
              {[
                { id: 'inv1', title: '悦味夏季新品茶饮推广', amount: 98000, status: 'issued', date: '2024-07-05' },
                { id: 'inv2', title: '智航智能手表深度测评', amount: 75000, status: 'pending', date: '2024-11-15' },
                { id: 'inv3', title: '平台服务费Q3', amount: 5200, status: 'issued', date: '2024-10-01' },
              ].map((inv, idx) => (
                <motion.div
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.3 }}
                  className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50/30 transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-primary-900 truncate max-w-[160px]">{inv.title}</p>
                      <p className="text-xs text-neutral-500">{inv.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-900">{formatCurrency(inv.amount)}</p>
                    <Badge variant={inv.status === 'issued' ? 'success' : 'warning'} size="sm" className="mt-1">
                      {inv.status === 'issued' ? '已开票' : '待开票'}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-neutral-200">
              <Button variant="outline" className="w-full" leftIcon={<Plus className="w-4 h-4" />}>
                申请开票
              </Button>
              <Button variant="ghost" className="w-full" leftIcon={<Download className="w-4 h-4" />}>
                下载发票记录
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal open={showRechargeModal} onClose={() => setShowRechargeModal(false)} size="md">
        <ModalHeader
          title="账户充值"
          description="充值金额将实时到账，可用于项目托管和结算"
        />
        <ModalBody>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">充值金额</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[10000, 50000, 100000, 500000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setRechargeAmount(String(amount))}
                    className={cn(
                      'py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border',
                      rechargeAmount === String(amount)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-neutral-700 border-neutral-200 hover:border-primary-300'
                    )}
                  >
                    ¥{(amount / 10000).toFixed(0)}万
                  </button>
                ))}
              </div>
              <Input
                type="number"
                placeholder="请输入充值金额"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                prefixIcon={<span className="text-neutral-500">¥</span>}
              />
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200">
              <p className="text-xs text-neutral-600">
                <span className="font-medium text-neutral-700">支付方式：</span>
                对公转账 / 支付宝 / 微信
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                充值后资金将进入品牌托管账户，专款专用
              </p>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowRechargeModal(false)}>
            取消
          </Button>
          <Button
            variant="primary"
            disabled={!rechargeAmount || Number(rechargeAmount) <= 0}
            onClick={() => {
              setShowRechargeModal(false);
              setRechargeAmount('');
            }}
          >
            确认充值
          </Button>
        </ModalFooter>
      </Modal>

      <Modal open={showWithdrawModal} onClose={() => setShowWithdrawModal(false)} size="md">
        <ModalHeader
          title="申请提现"
          description={`可提现余额：${formatCurrency(stats.balance)}`}
        />
        <ModalBody>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">提现金额</label>
              <Input
                type="number"
                placeholder="请输入提现金额"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                prefixIcon={<span className="text-neutral-500">¥</span>}
              />
              <button
                onClick={() => setWithdrawAmount(String(stats.balance))}
                className="text-xs text-primary-600 hover:text-primary-700 mt-2"
              >
                全部提现
              </button>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">提现到</span>
                <span className="text-neutral-700 font-medium">招商银行 ****8888</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">预计到账</span>
                <span className="text-neutral-700">1-3个工作日</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">手续费</span>
                <span className="text-success-600 font-medium">免费</span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowWithdrawModal(false)}>
            取消
          </Button>
          <Button
            variant="primary"
            disabled={!withdrawAmount || Number(withdrawAmount) <= 0 || Number(withdrawAmount) > stats.balance}
            onClick={() => {
              setShowWithdrawModal(false);
              setWithdrawAmount('');
            }}
          >
            确认提现
          </Button>
        </ModalFooter>
      </Modal>
      </div>
    </DashboardLayout>
  );
}
