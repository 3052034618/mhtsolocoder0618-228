import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search,
  TrendingUp,
  Users,
  Building2,
  Star,
  Shield,
  BarChart3,
  Zap,
  Headphones,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileSignature,
  Package,
  Wallet,
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Tabs, TabList, Tab } from '@/components/ui/Tabs';
import { useCountUp } from '@/hooks/useCountUp';
import { getCreators, getListings } from '@/services/creatorService';
import {
  platformNames,
  listingTypeNames,
  type Creator,
  type SponsorshipPackage,
  type Platform,
} from '@/services/mockData';
import { useAppStore } from '@/store/appStore';
import { formatCurrency, formatNumber, cn } from '@/utils/format';

const platformTabs: { value: Platform | 'all'; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'douyin', label: '抖音' },
  { value: 'bilibili', label: 'B站' },
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'youtube', label: 'YouTube' },
];

const followerRanges = [
  { label: '1万以下', min: 0, max: 10000 },
  { label: '1-10万', min: 10000, max: 100000 },
  { label: '10-100万', min: 100000, max: 1000000 },
  { label: '100万以上', min: 1000000, max: undefined },
];

const categories = ['美食', '数码', '旅行', '时尚', '健身', '科技', '生活', '美妆'];

const priceRanges = [
  { label: '¥1万以下', min: 0, max: 10000 },
  { label: '¥1-5万', min: 10000, max: 50000 },
  { label: '¥5-10万', min: 50000, max: 100000 },
  { label: '¥10万以上', min: 100000, max: undefined },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

function StatCard({
  icon: Icon,
  value,
  label,
  suffix,
  delay,
}: {
  icon: typeof TrendingUp;
  value: number;
  label: string;
  suffix?: string;
  delay: number;
}) {
  const { value: displayValue } = useCountUp(value, {
    duration: 2000,
    startOnMount: true,
    decimals: value % 1 !== 0 ? 1 : 0,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-colors"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
        <Icon className="w-6 h-6 text-primary-900" />
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-display font-bold text-white">
          {suffix === '亿'
            ? `${(displayValue / 100000000).toFixed(1)}亿`
            : suffix === '%'
            ? `${displayValue.toFixed(1)}%`
            : displayValue.toLocaleString('zh-CN')}
          {suffix && suffix !== '亿' && suffix !== '%' ? suffix : ''}
        </div>
        <div className="text-sm text-white/70 mt-0.5">{label}</div>
      </div>
    </motion.div>
  );
}

function CreatorCard({ creator, index }: { creator: Creator; index: number }) {
  const totalFollowers = creator.platforms.reduce((sum, p) => sum + p.followers, 0);
  const getMinPriceByCreatorId = useAppStore((state) => state.getMinPriceByCreatorId);
  const minPrice = useMemo(() => {
    return getMinPriceByCreatorId(creator.id);
  }, [creator.id, getMinPriceByCreatorId]);

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6 }}
    >
      <Link to={`/creator/${creator.id}`}>
        <Card hoverable className="h-full group cursor-pointer">
          <div className="relative h-32 bg-gradient-primary overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-gold-400 blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-primary-300 blur-3xl" />
            </div>
            <div className="absolute top-3 right-3 flex gap-1.5">
              {creator.verified && (
                <Badge variant="gold" dot pulse>
                  已认证
                </Badge>
              )}
            </div>
            <div className="absolute -bottom-10 left-5">
              <Avatar
                src={creator.avatar}
                alt={creator.name}
                size="lg"
                goldBorder={creator.verified}
              />
            </div>
          </div>
          <CardContent className="pt-14">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-display font-semibold text-lg text-primary-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                {creator.name}
              </h3>
              <div className="flex items-center gap-1 text-warning-600 shrink-0">
                <Star className="w-4 h-4 fill-warning-500" />
                <span className="text-sm font-medium">{creator.rating}</span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 line-clamp-2 mb-3 h-10">
              {creator.bio}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {creator.categories.slice(0, 3).map((cat) => (
                <Badge key={cat} variant="primary">
                  {cat}
                </Badge>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <div className="flex items-center gap-3">
                {creator.platforms.slice(0, 3).map((p) => (
                  <div key={p.platform} className="flex items-center gap-1 text-xs text-neutral-500">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                    {platformNames[p.platform]}
                  </div>
                ))}
              </div>
              <div className="text-right">
                <div className="text-xs text-neutral-400">起价</div>
                <div className="text-sm font-semibold text-gold-600">
                  {minPrice > 0 ? formatCurrency(minPrice) : '面议'}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <Users className="w-3.5 h-3.5" />
                <span>{formatNumber(totalFollowers)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{creator.totalCollaborations}次合作</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-500">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{creator.avgEngagementRate}%互动</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

function PackageCard({ pkg, index }: { pkg: SponsorshipPackage; index: number }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.03 }}
      className="shrink-0 w-72 md:w-80"
    >
      <Card hoverable className="h-full flex flex-col">
        <CardContent className="flex flex-col h-full">
          <div className="flex items-start justify-between mb-3">
            <Badge variant="gold">{listingTypeNames[pkg.type]}</Badge>
            <div className="text-right">
              <div className="text-2xl font-display font-bold text-primary-900">
                {formatCurrency(pkg.price)}
              </div>
              <div className="text-xs text-neutral-400">
                {pkg.deliveryDays}天交付
              </div>
            </div>
          </div>
          <h4 className="font-semibold text-primary-900 mb-2 line-clamp-1">
            {pkg.name}
          </h4>
          <p className="text-sm text-neutral-500 line-clamp-2 mb-4 flex-1">
            {pkg.description}
          </p>
          <div className="space-y-2 mb-4">
            {pkg.includes.slice(0, 4).map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full group">
            查看详情
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AdvantageCard({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: typeof Shield;
  title: string;
  description: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-50 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="relative pt-8 pb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-elegant flex items-center justify-center mb-4 shadow-primary group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-display font-semibold text-xl text-primary-900 mb-2">
            {title}
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

const workflowSteps = [
  { icon: Search, title: '浏览筛选', desc: '按平台、粉丝、行业精准搜索创作者' },
  { icon: Sparkles, title: '发起意向', desc: '一键发送合作意向，快速触达创作者' },
  { icon: MessageSquare, title: '沟通确认', desc: '在线沟通需求细节，确认合作方案' },
  { icon: FileSignature, title: '签约托管', desc: '电子合同签约，资金平台安全托管' },
  { icon: Package, title: '创作交付', desc: '创作者按里程碑交付，品牌方验收' },
  { icon: Wallet, title: '结算评价', desc: '验收通过自动结算，双方互评反馈' },
];

function WorkflowStep({
  icon: Icon,
  title,
  desc,
  index,
  isLast,
}: {
  icon: typeof Search;
  title: string;
  desc: string;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex gap-4"
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold relative z-10"
        >
          <Icon className="w-6 h-6 text-primary-900" />
        </motion.div>
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-xs font-bold text-gold-600 mt-2 bg-white px-1.5 rounded">
          {index + 1}
        </div>
        {!isLast && (
          <div className="absolute top-12 left-1/2 w-px h-[calc(100%-48px+24px)] bg-gradient-to-b from-gold-300 to-primary-200" />
        )}
      </div>
      <div className="flex-1 pb-8 pt-1">
        <h4 className="font-semibold text-primary-900 mb-1">{title}</h4>
        <p className="text-sm text-neutral-500">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activePlatform, setActivePlatform] = useState<Platform | 'all'>('all');
  const [selectedFollowers, setSelectedFollowers] = useState<{ min?: number; max?: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<{ min?: number; max?: number } | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [packages, setPackages] = useState<SponsorshipPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [creatorsResult, packagesResult] = await Promise.all([
          getCreators({}, { pageSize: 8 }),
          getListings({}),
        ]);
        setCreators(creatorsResult.list);
        setPackages(packagesResult.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getMinPriceByCreatorId = useAppStore((state) => state.getMinPriceByCreatorId);

  const filteredCreators = useMemo(() => {
    return creators.filter((c) => {
      if (activePlatform !== 'all' && !c.platforms.some((p) => p.platform === activePlatform)) {
        return false;
      }
      if (selectedFollowers) {
        const maxFollowers = Math.max(...c.platforms.map((p) => p.followers));
        if (selectedFollowers.min !== undefined && maxFollowers < selectedFollowers.min) return false;
        if (selectedFollowers.max !== undefined && maxFollowers >= selectedFollowers.max) return false;
      }
      if (selectedCategory && !c.categories.includes(selectedCategory)) {
        return false;
      }
      if (selectedPrice) {
        const minPrice = getMinPriceByCreatorId(c.id);
        if (minPrice === 0) return false;
        if (selectedPrice.min !== undefined && minPrice < selectedPrice.min) return false;
        if (selectedPrice.max !== undefined && minPrice >= selectedPrice.max) return false;
      }
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.bio.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [creators, activePlatform, selectedFollowers, selectedCategory, selectedPrice, searchQuery, getMinPriceByCreatorId]);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-primary">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 rounded-full bg-primary-300/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-texture-grid opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/40 to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-4xl mx-auto mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm text-gold-300 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span>领先的创作者商务赞助平台</span>
            </motion.div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white leading-tight mb-6">
              连接优质创作与
              <span className="bg-gradient-to-r from-gold-400 via-gold-300 to-gold-500 bg-clip-text text-transparent">
                品牌商业价值
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              汇聚12,580+优质创作者，5,600+品牌方信赖之选，高效对接、安全托管、数据透明
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold-500/50 to-primary-400/50 rounded-2xl blur opacity-60" />
                <div className="relative flex items-center gap-2 p-2 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                  <div className="flex-1 flex items-center gap-3 px-4">
                    <Search className="w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="搜索创作者名称、行业、内容方向..."
                      className="flex-1 bg-transparent text-white placeholder:text-white/50 outline-none py-2 text-base"
                    />
                  </div>
                  <Button variant="gold" size="lg">
                    搜索
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
            >
              <StatCard icon={TrendingUp} value={320000000} label="累计成交额" suffix="亿" delay={0.4} />
              <StatCard icon={Users} value={12580} label="签约创作者" delay={0.5} />
              <StatCard icon={Building2} value={5600} label="合作品牌方" suffix="+" delay={0.6} />
              <StatCard icon={Star} value={98.6} label="用户好评率" suffix="%" delay={0.7} />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="relative -mt-8 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-elevated">
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="w-5 h-5 text-primary-500" />
                  <span className="font-semibold text-primary-900">筛选条件</span>
                </div>

                <Tabs defaultValue="all" onValueChange={(v) => setActivePlatform(v as Platform | 'all')}>
                  <TabList scrollable className="mb-4">
                    {platformTabs.map((tab) => (
                      <Tab key={tab.value} value={tab.value}>
                        {tab.label}
                      </Tab>
                    ))}
                  </TabList>
                </Tabs>

                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-neutral-500 w-16 shrink-0">粉丝量级</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedFollowers(null)}
                        className={cn(
                          'px-3 py-1.5 text-sm rounded-lg border transition-all',
                          !selectedFollowers
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                        )}
                      >
                        全部
                      </button>
                      {followerRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => setSelectedFollowers(range)}
                          className={cn(
                            'px-3 py-1.5 text-sm rounded-lg border transition-all',
                            selectedFollowers?.min === range.min && selectedFollowers?.max === range.max
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-neutral-500 w-16 shrink-0">行业分类</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={cn(
                          'px-3 py-1.5 text-sm rounded-lg border transition-all',
                          !selectedCategory
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                        )}
                      >
                        全部
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={cn(
                            'px-3 py-1.5 text-sm rounded-lg border transition-all',
                            selectedCategory === cat
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-neutral-500 w-16 shrink-0">价格区间</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedPrice(null)}
                        className={cn(
                          'px-3 py-1.5 text-sm rounded-lg border transition-all',
                          !selectedPrice
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                        )}
                      >
                        全部
                      </button>
                      {priceRanges.map((range) => (
                        <button
                          key={range.label}
                          onClick={() => setSelectedPrice(range)}
                          className={cn(
                            'px-3 py-1.5 text-sm rounded-lg border transition-all',
                            selectedPrice?.min === range.min && selectedPrice?.max === range.max
                              ? 'bg-primary-500 text-white border-primary-500'
                              : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'
                          )}
                        >
                          {range.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Recommended Creators */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 text-gold-600 text-sm font-medium mb-3">
                <TrendingUp className="w-4 h-4" />
                热门推荐
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">
                优质创作者
              </h2>
              <p className="text-neutral-500 mt-2">发现与您品牌最匹配的优质创作者</p>
            </div>
            <Button variant="ghost" className="hidden md:inline-flex">
              查看全部
              <ChevronRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-80 rounded-xl bg-white animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6"
            >
              {filteredCreators.length > 0 ? (
                filteredCreators.map((creator, index) => (
                  <CreatorCard key={creator.id} creator={creator} index={index} />
                ))
              ) : (
                <div className="col-span-full py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500">暂无符合条件的创作者</p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Popular Packages */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-10"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-3">
                <Package className="w-4 h-4" />
                精选套餐
              </div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900">
                热门赞助套餐
              </h2>
              <p className="text-neutral-500 mt-2">多种合作形式，灵活满足不同品牌需求</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {packages.map((pkg, index) => (
                <PackageCard key={pkg.id} pkg={pkg} index={index} />
              ))}
            </div>
            <div className="absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </section>

      {/* Platform Advantages */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-50 text-success-600 text-sm font-medium mb-3">
              <Shield className="w-4 h-4" />
              平台保障
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-900 mb-3">
              为什么选择我们
            </h2>
            <p className="text-neutral-500">全方位服务保障，让每一次合作都安心无忧</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            <AdvantageCard
              icon={Shield}
              title="安全托管"
              description="资金平台全程托管，验收通过后结算，保障双方权益"
              index={0}
            />
            <AdvantageCard
              icon={BarChart3}
              title="数据透明"
              description="真实数据第三方监测，投放效果一目了然，拒绝数据造假"
              index={1}
            />
            <AdvantageCard
              icon={Zap}
              title="高效对接"
              description="智能匹配推荐，1小时内响应，平均3天达成合作意向"
              index={2}
            />
            <AdvantageCard
              icon={Headphones}
              title="专业服务"
              description="1对1专属客户经理，全程跟进合作流程，问题快速响应"
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary-900 to-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-texture-grid opacity-10" />
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-primary-400/10 blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-gold-300 text-sm font-medium mb-3 border border-white/20">
              <Clock className="w-4 h-4" />
              6步闭环
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-3">
              标准化合作流程
            </h2>
            <p className="text-white/60">简单六步，高效完成品牌与创作者的商务合作</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {workflowSteps.map((step, index) => (
              <WorkflowStep
                key={step.title}
                icon={step.icon}
                title={step.title}
                desc={step.desc}
                index={index}
                isLast={index === workflowSteps.length - 1}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center mt-10"
          >
            <Button variant="gold" size="lg">
              立即开启合作
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
