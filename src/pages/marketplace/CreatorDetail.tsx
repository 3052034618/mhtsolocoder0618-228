import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  CheckCircle2,
  Users,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Mail,
  Phone,
  Globe,
  HeartOff,
  Calendar,
  BarChart2,
  PieChart,
  MapPin,
  Tag,
  Sparkles,
  ChevronRight,
  Calculator,
  Send,
  ExternalLink,
  Award,
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { getCreatorById, getListings, getCreatorCases } from '@/services/creatorService';
import {
  platformNames,
  listingTypeNames,
  type Creator,
  type SponsorshipPackage,
  type CollaborationCase,
  brands,
} from '@/services/mockData';
import { formatCurrency, formatNumber, cn } from '@/utils/format';
import { useAppStore } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

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

const GENDER_COLORS = ['#1E3A5F', '#C9A961', '#8DA9CF'];
const AGE_COLORS = ['#1E3A5F', '#2A4D7A', '#4D6FA4', '#C9A961', '#DBC58D'];
const REGION_COLORS = ['#1E3A5F', '#2A4D7A', '#4D6FA4', '#8DA9CF', '#C9A961', '#DBC58D', '#B3C6DF'];

function PlatformStatCard({
  platform,
  followers,
  index,
}: {
  platform: string;
  followers: number;
  avgViews?: number;
  completionRate?: number;
  engagementRate?: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-primary-500" />
              {platform}
            </span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-neutral-500 text-sm mb-1">
                <Users className="w-4 h-4" />
                粉丝总数
              </div>
              <div className="text-2xl font-display font-bold text-primary-900">
                {formatNumber(followers)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
              <div>
                <div className="text-xs text-neutral-400 mb-0.5">平均播放</div>
                <div className="text-sm font-semibold text-neutral-700">
                  {formatNumber(Math.floor(followers * 0.35))}
                </div>
              </div>
              <div>
                <div className="text-xs text-neutral-400 mb-0.5">互动率</div>
                <div className="text-sm font-semibold text-success-600">
                  {(Math.random() * 5 + 3).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function AudienceChartCard({
  icon: Icon,
  title,
  children,
  index,
}: {
  icon: typeof PieChart;
  title: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-elegant flex items-center justify-center">
              <Icon className="w-4 h-4 text-white" />
            </div>
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </motion.div>
  );
}

function PackageCompareCard({
  pkg,
  index,
  selected,
  onSelect,
  recommended,
}: {
  pkg: SponsorshipPackage;
  index: number;
  selected: boolean;
  onSelect: () => void;
  recommended?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      onClick={onSelect}
      className={cn('cursor-pointer h-full', selected && 'z-10')}
    >
      <Card
        variant={recommended ? 'gold' : 'default'}
        hoverable
        className={cn(
          'h-full relative',
          selected && 'ring-2 ring-primary-500 ring-offset-2'
        )}
      >
        {recommended && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge variant="gold" dot pulse className="shadow-gold">
              <Sparkles className="w-3 h-3 mr-1" />
              推荐
            </Badge>
          </div>
        )}
        <CardContent className="pt-6 flex flex-col h-full">
          <div className="text-center mb-4">
            <Badge variant="primary" className="mb-3">
              {listingTypeNames[pkg.type]}
            </Badge>
            <h3 className="font-display font-semibold text-xl text-primary-900 mb-2">
              {pkg.name}
            </h3>
            <p className="text-sm text-neutral-500 mb-4">{pkg.description}</p>
            <div className="text-3xl font-display font-bold text-primary-900">
              {formatCurrency(pkg.price)}
            </div>
            <div className="text-sm text-neutral-400 mt-1">
              <Calendar className="w-3.5 h-3.5 inline mr-1" />
              {pkg.deliveryDays}天交付
            </div>
          </div>
          <div className="border-t border-neutral-100 pt-4 mb-4 flex-1">
            <div className="text-sm font-medium text-primary-900 mb-2">套餐包含：</div>
            <ul className="space-y-2">
              {pkg.includes.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                  <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            variant={selected ? 'primary' : 'outline'}
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
          >
            {selected ? '已选择' : '选择此套餐'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function CaseCard({ caseData, index }: { caseData: CollaborationCase; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card hoverable className="h-full overflow-hidden">
        <div className="relative h-48 bg-neutral-100">
          <img
            src={caseData.thumbnail}
            alt={caseData.projectName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="gold">{listingTypeNames[caseData.type]}</Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Badge variant="primary">{platformNames[caseData.platform]}</Badge>
          </div>
        </div>
        <CardContent>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden">
              <img
                src={caseData.brandLogo}
                alt={caseData.brandName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div>
              <div className="font-semibold text-primary-900">{caseData.brandName}</div>
              <div className="text-xs text-neutral-400">合作品牌</div>
            </div>
          </div>
          <h4 className="font-semibold text-primary-900 mb-2 line-clamp-1">
            {caseData.projectName}
          </h4>
          <p className="text-sm text-neutral-500 line-clamp-2 mb-4 h-10">
            {caseData.description}
          </p>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-neutral-100">
            <div>
              <div className="flex items-center gap-1 text-xs text-neutral-400 mb-0.5">
                <Eye className="w-3 h-3" />
                总曝光
              </div>
              <div className="text-sm font-semibold text-primary-900">
                {formatNumber(caseData.views)}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 text-xs text-neutral-400 mb-0.5">
                <TrendingUp className="w-3 h-3" />
                互动率
              </div>
              <div className="text-sm font-semibold text-success-600">
                {caseData.engagementRate}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CreatorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createProject } = useAppStore();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [packages, setPackages] = useState<SponsorshipPackage[]>([]);
  const [cases, setCases] = useState<CollaborationCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [budget, setBudget] = useState(50000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setLoading(true);
      try {
        const [creatorData, packagesData, casesData] = await Promise.all([
          getCreatorById(id),
          getListings({ creatorId: id }),
          getCreatorCases(id),
        ]);
        setCreator(creatorData);
        setPackages(packagesData);
        setCases(casesData);
        if (packagesData.length > 0) {
          const recommended = packagesData.find((p) => p.type === 'collab') || packagesData[1] || packagesData[0];
          setSelectedPackageId(recommended.id);
          setBudget(recommended.price);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const totalFollowers = useMemo(() => {
    return creator?.platforms.reduce((sum, p) => sum + p.followers, 0) ?? 0;
  }, [creator]);

  const genderData = useMemo(() => {
    if (!creator) return [];
    return [
      { name: '男性', value: creator.audience.gender.male },
      { name: '女性', value: creator.audience.gender.female },
      { name: '其他', value: creator.audience.gender.other },
    ];
  }, [creator]);

  const ageData = useMemo(() => {
    if (!creator) return [];
    return creator.audience.ageDistribution.map((a) => ({
      age: a.range,
      占比: a.percentage,
    }));
  }, [creator]);

  const regionData = useMemo(() => {
    if (!creator) return [];
    return creator.audience.regionDistribution.slice(0, 6).map((r) => ({
      name: r.province,
      value: r.percentage,
    }));
  }, [creator]);

  const interestData = useMemo(() => {
    if (!creator) return [];
    return creator.audience.interests.slice(0, 6).map((i) => ({
      subject: i.tag,
      score: i.percentage,
      fullMark: 100,
    }));
  }, [creator]);

  const selectedPackage = packages.find((p) => p.id === selectedPackageId);

  const handleInitiateCooperation = async () => {
    if (!creator || !selectedPackage || !user) return;

    setIsSubmitting(true);
    try {
      const brand = brands.find((b) => b.userId === user.id);
      if (!brand) {
        alert('请先登录品牌方账号');
        return;
      }

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

      const newProject = createProject({
        brandId: brand.id,
        creatorId: creator.id,
        packageId: selectedPackage.id,
        title: `${creator.name} - ${selectedPackage.name}合作`,
        description: selectedPackage.description,
        type: selectedPackage.type,
        budget: selectedPackage.price,
        platform: creator.platforms[0]?.platform || 'douyin',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        milestones,
        requirements: selectedPackage.includes,
      });

      alert('合作意向已发起！正在跳转到项目详情...');
      navigate('/dashboard/brand/projects');
    } catch (error) {
      console.error('发起合作失败:', error);
      alert('发起合作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedROI = useMemo(() => {
    if (!selectedPackage) return 0;
    const avgEngagement = creator?.avgEngagementRate ?? 5;
    return Math.floor((budget / selectedPackage.price) * totalFollowers * (avgEngagement / 100) * 10);
  }, [budget, selectedPackage, totalFollowers, creator]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-64 rounded-2xl bg-white" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 rounded-xl bg-white" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-display font-bold text-primary-900 mb-4">创作者不存在</h2>
          <Button onClick={() => navigate('/marketplace')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回市场
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 bg-gradient-primary overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-80 h-80 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-primary-300/20 blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-texture-grid opacity-10" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/marketplace')}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回赞助市场
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row gap-8 items-start"
          >
            <div className="relative">
              <Avatar
                src={creator.avatar}
                alt={creator.name}
                size="2xl"
                goldBorder={creator.verified}
                className="ring-4 ring-white/20 shadow-elevated"
              />
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                  <Award className="w-4 h-4 text-primary-900" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="text-3xl md:text-4xl font-display font-bold text-white">
                  {creator.name}
                </h1>
                {creator.verified && (
                  <Badge variant="gold" dot pulse>
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    官方认证
                  </Badge>
                )}
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
                  <Star className="w-4 h-4 text-gold-400 fill-gold-400" />
                  <span className="text-white font-medium">{creator.rating}</span>
                </div>
              </div>

              <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-5">
                {creator.bio}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {creator.categories.map((cat) => (
                  <Badge
                    key={cat}
                    className="bg-white/10 text-white/90 border-white/20 hover:bg-white/20"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {cat}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>{formatNumber(totalFollowers)} 粉丝</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    <span>{creator.avgEngagementRate}% 互动率</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{creator.totalCollaborations} 次合作</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Button
                  variant={isFollowing ? 'outline' : 'gold'}
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={cn(
                    isFollowing && 'bg-white/10 text-white border-white/30 hover:bg-white/20'
                  )}
                >
                  {isFollowing ? (
                    <>
                      <HeartOff className="w-4 h-4 mr-1.5" />
                      已关注
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4 mr-1.5" />
                      关注
                    </>
                  )}
                </Button>
                <Button variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">
                  <MessageCircle className="w-4 h-4 mr-1.5" />
                  私信沟通
                </Button>
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all">
                    <Mail className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all">
                    <Phone className="w-4 h-4" />
                  </button>
                  {creator.platforms.map((p) => (
                    <a
                      key={p.platform}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 hover:text-white transition-all"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Content */}
            <div className="flex-1 min-w-0">
              {/* Platform Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-900 mb-2">
                      平台数据概览
                    </h2>
                    <p className="text-neutral-500">多平台运营数据一览</p>
                  </div>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5"
                >
                  {creator.platforms.map((p, index) => (
                    <PlatformStatCard
                      key={p.platform}
                      platform={platformNames[p.platform]}
                      followers={p.followers}
                      index={index}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Audience Profile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-600 text-sm font-medium mb-2">
                      <BarChart2 className="w-4 h-4" />
                      数据分析
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-900 mb-2">
                      受众画像分析
                    </h2>
                    <p className="text-neutral-500">深度了解创作者粉丝群体特征</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AudienceChartCard icon={PieChart} title="性别分布" index={0}>
                    <div className="h-48 flex items-center">
                      <ResponsiveContainer width="60%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={genderData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={70}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {genderData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-2">
                        {genderData.map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: GENDER_COLORS[index % GENDER_COLORS.length] }}
                              />
                              <span className="text-neutral-600">{item.name}</span>
                            </div>
                            <span className="font-medium text-primary-900">{item.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AudienceChartCard>

                  <AudienceChartCard icon={BarChart2} title="年龄分布" index={1}>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                          <XAxis dataKey="age" tick={{ fontSize: 12, fill: '#78716C' }} />
                          <YAxis tick={{ fontSize: 12, fill: '#78716C' }} />
                          <Tooltip />
                          <Bar dataKey="占比" fill="#1E3A5F" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AudienceChartCard>

                  <AudienceChartCard icon={MapPin} title="地域分布" index={2}>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={regionData}
                          layout="vertical"
                          margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                          <XAxis type="number" tick={{ fontSize: 12, fill: '#78716C' }} />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={50}
                            tick={{ fontSize: 12, fill: '#78716C' }}
                          />
                          <Tooltip />
                          <Bar dataKey="value" fill="#C9A961" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </AudienceChartCard>

                  <AudienceChartCard icon={Heart} title="兴趣标签" index={3}>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={interestData}>
                          <PolarGrid stroke="#E7E5E4" />
                          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#78716C' }} />
                          <PolarRadiusAxis tick={{ fontSize: 10, fill: '#A8A29E' }} />
                          <Radar
                            name="兴趣度"
                            dataKey="score"
                            stroke="#1E3A5F"
                            fill="#1E3A5F"
                            fillOpacity={0.3}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </AudienceChartCard>
                </div>
              </motion.div>

              {/* Sponsorship Packages */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10"
              >
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 text-gold-600 text-sm font-medium mb-2">
                      <Sparkles className="w-4 h-4" />
                      赞助方案
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-900 mb-2">
                      赞助套餐
                    </h2>
                    <p className="text-neutral-500">选择适合您品牌需求的合作方案</p>
                  </div>
                </div>
                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
                >
                  {packages.map((pkg, index) => (
                    <PackageCompareCard
                      key={pkg.id}
                      pkg={pkg}
                      index={index}
                      selected={selectedPackageId === pkg.id}
                      onSelect={() => {
                        setSelectedPackageId(pkg.id);
                        setBudget(pkg.price);
                      }}
                      recommended={pkg.type === 'collab'}
                    />
                  ))}
                </motion.div>
              </motion.div>

              {/* Collaboration Cases */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success-50 text-success-600 text-sm font-medium mb-2">
                      <Award className="w-4 h-4" />
                      成功案例
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-900 mb-2">
                      历史合作案例
                    </h2>
                    <p className="text-neutral-500">
                      已完成 {creator.totalCollaborations} 次品牌合作
                    </p>
                  </div>
                  <Button variant="ghost" className="hidden md:inline-flex">
                    查看全部
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                {cases.length > 0 ? (
                  <>
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="text-sm text-neutral-500 mr-2 py-1">合作品牌：</div>
                      {Array.from(new Set(cases.map((c) => c.brandName))).map((brand) => (
                        <Badge key={brand} variant="default" className="px-3 py-1">
                          {brand}
                        </Badge>
                      ))}
                    </div>
                    <motion.div
                      variants={staggerContainer}
                      initial="initial"
                      whileInView="animate"
                      viewport={{ once: true }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                      {cases.slice(0, 6).map((caseData, index) => (
                        <CaseCard key={caseData.id} caseData={caseData} index={index} />
                      ))}
                    </motion.div>
                  </>
                ) : (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                        <Award className="w-8 h-8 text-neutral-400" />
                      </div>
                      <p className="text-neutral-500">暂无合作案例</p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </div>

            {/* Right Sticky Sidebar */}
            <div className="lg:w-80 xl:w-96 shrink-0">
              <div className="lg:sticky lg:top-24 space-y-5">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Card variant="gold">
                    <CardContent className="pt-6">
                      <div className="text-center mb-5">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/50 text-gold-700 text-sm font-medium mb-3">
                          <Sparkles className="w-4 h-4" />
                          快速发起合作
                        </div>
                        <h3 className="text-xl font-display font-bold text-primary-900">
                          开启品牌合作
                        </h3>
                        <p className="text-sm text-neutral-500 mt-1">
                          专业顾问1对1服务，高效对接
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-primary-800 mb-1.5 block">
                            选择套餐
                          </label>
                          <select
                            value={selectedPackageId ?? ''}
                            onChange={(e) => {
                              setSelectedPackageId(e.target.value);
                              const pkg = packages.find((p) => p.id === e.target.value);
                              if (pkg) setBudget(pkg.price);
                            }}
                            className="w-full h-11 px-4 rounded-md border border-neutral-300 bg-white text-primary-900 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 transition-all"
                          >
                            {packages.map((pkg) => (
                              <option key={pkg.id} value={pkg.id}>
                                {pkg.name} - {formatCurrency(pkg.price)}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-primary-800">
                              <Calculator className="w-4 h-4 inline mr-1" />
                              预算计算器
                            </label>
                            <span className="text-lg font-display font-bold text-primary-900">
                              {formatCurrency(budget)}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={10000}
                            max={500000}
                            step={5000}
                            value={budget}
                            onChange={(e) => setBudget(Number(e.target.value))}
                            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-gold-500"
                          />
                          <div className="flex justify-between text-xs text-neutral-400 mt-1">
                            <span>¥1万</span>
                            <span>¥50万</span>
                          </div>
                        </div>

                        {selectedPackage && (
                          <div className="p-4 rounded-xl bg-primary-50/50 border border-primary-100">
                            <div className="text-sm font-medium text-primary-900 mb-2">
                              预计投放效果
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">预计触达用户</span>
                                <span className="font-semibold text-primary-900">
                                  {formatNumber(Math.floor(totalFollowers * (budget / selectedPackage.price)))}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">预计互动量</span>
                                <span className="font-semibold text-success-600">
                                  {formatNumber(estimatedROI)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-neutral-500">合作形式</span>
                                <span className="font-semibold text-gold-600">
                                  {listingTypeNames[selectedPackage.type]}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          variant="gold"
                          size="lg"
                          className="w-full"
                          onClick={handleInitiateCooperation}
                          loading={isSubmitting}
                          disabled={!selectedPackageId}
                        >
                          <Send className="w-4 h-4 mr-1.5" />
                          {isSubmitting ? '提交中...' : '发起合作意向'}
                        </Button>
                        <p className="text-center text-xs text-neutral-400">
                          提交后专属顾问将在1小时内联系您
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="font-semibold text-primary-900 mb-4 flex items-center gap-2">
                        <HeadphonesIcon />
                        专属顾问服务
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                          <span className="text-neutral-600">需求分析与创作者精准匹配</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                          <span className="text-neutral-600">合作方案定制与价格谈判</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                          <span className="text-neutral-600">合同签署与资金安全托管</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-success-500 shrink-0 mt-0.5" />
                          <span className="text-neutral-600">项目执行跟进与数据报告</span>
                        </div>
                      </div>
                      <div className="mt-5 pt-4 border-t border-neutral-100">
                        <div className="text-xs text-neutral-400 mb-1">咨询热线</div>
                        <div className="text-lg font-display font-bold text-primary-900">
                          400-888-8888
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function HeadphonesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-primary-500"
    >
      <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
    </svg>
  );
}
