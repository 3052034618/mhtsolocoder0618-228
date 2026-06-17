export type Platform = 'douyin' | 'bilibili' | 'xiaohongshu' | 'youtube' | 'weibo' | 'kuaishou';

export type ListingType = 'mention' | 'patch' | 'collab';

export type ProjectStatus = 'pending' | 'negotiating' | 'signed' | 'executing' | 'delivered' | 'completed' | 'cancelled';

export type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';

export type TransactionType = 'deposit' | 'withdraw' | 'payment' | 'refund' | 'commission';

export type UserRole = 'creator' | 'brand';

export interface AudienceData {
  gender: { male: number; female: number; other: number };
  ageDistribution: { range: string; percentage: number }[];
  regionDistribution: { province: string; percentage: number }[];
  interests: { tag: string; percentage: number }[];
}

export interface SponsorshipPackage {
  id: string;
  creatorId: string;
  type: ListingType;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  includes: string[];
  recommended?: boolean;
  createdAt: string;
}

export interface Creator {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  bio: string;
  platforms: { platform: Platform; handle: string; followers: number; url: string }[];
  categories: string[];
  audience: AudienceData;
  avgEngagementRate: number;
  verified: boolean;
  rating: number;
  totalCollaborations: number;
  createdAt: string;
}

export interface CollaborationCase {
  id: string;
  creatorId: string;
  brandName: string;
  brandLogo: string;
  projectName: string;
  type: ListingType;
  platform: Platform;
  views: number;
  engagementRate: number;
  description: string;
  thumbnail: string;
  completedAt: string;
}

export interface Brand {
  id: string;
  userId: string;
  name: string;
  logo: string;
  description: string;
  industry: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
}

export interface Milestone {
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
}

export interface Project {
  id: string;
  brandId: string;
  creatorId: string;
  title: string;
  description: string;
  type: ListingType;
  budget: number;
  status: ProjectStatus;
  platform: Platform;
  startDate: string;
  endDate: string;
  milestones: Milestone[];
  requirements: string[];
  createdAt: string;
  signedAt?: string;
  completedAt?: string;
}

export interface User {
  id: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  name: string;
  avatar: string;
  createdAt: string;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  frozenAmount: number;
  currency: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: number;
  description: string;
  projectId?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export const platforms: Platform[] = ['douyin', 'bilibili', 'xiaohongshu', 'youtube', 'weibo', 'kuaishou'];

export const platformNames: Record<Platform, string> = {
  douyin: '抖音',
  bilibili: '哔哩哔哩',
  xiaohongshu: '小红书',
  youtube: 'YouTube',
  weibo: '微博',
  kuaishou: '快手',
};

export const listingTypeNames: Record<ListingType, string> = {
  mention: '口播',
  patch: '贴片',
  collab: '联名',
};

export const projectStatusNames: Record<ProjectStatus, string> = {
  pending: '待审核',
  negotiating: '洽谈中',
  signed: '已签约',
  executing: '执行中',
  delivered: '已交付',
  completed: '已完成',
  cancelled: '已取消',
};

export const milestoneStatusNames: Record<MilestoneStatus, string> = {
  pending: '待开始',
  in_progress: '进行中',
  submitted: '已提交',
  approved: '已通过',
  rejected: '已驳回',
};

export const users: User[] = [
  {
    id: 'u1',
    email: 'linxiaoyu@email.com',
    phone: '13800138001',
    password: '123456',
    role: 'creator',
    name: '林小雨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'u2',
    email: 'zhangtech@email.com',
    phone: '13800138002',
    password: '123456',
    role: 'creator',
    name: '张评测',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    createdAt: '2024-01-20T14:20:00Z',
  },
  {
    id: 'u3',
    email: 'li.fashion@email.com',
    phone: '13800138003',
    password: '123456',
    role: 'brand',
    name: '李美丽',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    createdAt: '2024-05-10T09:15:00Z',
  },
  {
    id: 'u4',
    email: 'wang.ceo@email.com',
    phone: '13800138004',
    password: '123456',
    role: 'brand',
    name: '王总',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    createdAt: '2024-02-28T16:45:00Z',
  },
];

export const creators: Creator[] = [
  {
    id: 'c1',
    userId: 'u1',
    name: '林小雨的美食日记',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
    bio: '95后美食博主，专注探店和家庭美食制作。抖音美食垂类TOP100创作者，用镜头记录每一道让人幸福的味道。',
    platforms: [
      { platform: 'douyin', handle: '@林小雨的美食日记', followers: 2580000, url: 'https://douyin.com/user/linxiaoyu' },
      { platform: 'xiaohongshu', handle: '@小雨爱吃', followers: 860000, url: 'https://xiaohongshu.com/user/linxiaoyu' },
      { platform: 'bilibili', handle: '@林小雨的美食', followers: 420000, url: 'https://bilibili.com/linxiaoyu' },
    ],
    categories: ['美食', '探店', '生活'],
    audience: {
      gender: { male: 32, female: 65, other: 3 },
      ageDistribution: [
        { range: '18-24', percentage: 28 },
        { range: '25-34', percentage: 42 },
        { range: '35-44', percentage: 20 },
        { range: '45+', percentage: 10 },
      ],
      regionDistribution: [
        { province: '广东', percentage: 18 },
        { province: '北京', percentage: 12 },
        { province: '上海', percentage: 11 },
        { province: '浙江', percentage: 9 },
        { province: '江苏', percentage: 8 },
        { province: '四川', percentage: 7 },
        { province: '其他', percentage: 35 },
      ],
      interests: [
        { tag: '美食探店', percentage: 85 },
        { tag: '烹饪教程', percentage: 72 },
        { tag: '生活方式', percentage: 65 },
        { tag: '旅行', percentage: 48 },
        { tag: '美妆时尚', percentage: 35 },
      ],
    },
    avgEngagementRate: 5.8,
    verified: true,
    rating: 4.9,
    totalCollaborations: 86,
    createdAt: '2024-03-15T10:30:00Z',
  },
  {
    id: 'c2',
    userId: 'u2',
    name: '张评测说数码',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    bio: '硬核数码评测师，10年科技媒体经验。专注手机、笔记本、智能设备深度测评，不恰烂饭，只说真话。',
    platforms: [
      { platform: 'bilibili', handle: '@张评测', followers: 3200000, url: 'https://bilibili.com/zhangpingce' },
      { platform: 'youtube', handle: '@ZhangReview', followers: 680000, url: 'https://youtube.com/@zhangpingce' },
      { platform: 'weibo', handle: '@张评测说数码', followers: 1500000, url: 'https://weibo.com/zhangpingce' },
    ],
    categories: ['数码', '科技', '测评'],
    audience: {
      gender: { male: 78, female: 20, other: 2 },
      ageDistribution: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 38 },
        { range: '35-44', percentage: 18 },
        { range: '45+', percentage: 9 },
      ],
      regionDistribution: [
        { province: '广东', percentage: 16 },
        { province: '北京', percentage: 15 },
        { province: '上海', percentage: 12 },
        { province: '浙江', percentage: 10 },
        { province: '江苏', percentage: 9 },
        { province: '四川', percentage: 6 },
        { province: '其他', percentage: 32 },
      ],
      interests: [
        { tag: '数码产品', percentage: 92 },
        { tag: '科技资讯', percentage: 85 },
        { tag: '游戏', percentage: 58 },
        { tag: '汽车', percentage: 42 },
        { tag: '投资理财', percentage: 30 },
      ],
    },
    avgEngagementRate: 7.2,
    verified: true,
    rating: 4.8,
    totalCollaborations: 124,
    createdAt: '2024-01-20T14:20:00Z',
  },
  {
    id: 'c3',
    userId: 'u5',
    name: 'Alex环球旅行',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    bio: '旅行达人，已走过60+国家。用镜头和文字分享世界的精彩，专注高端旅行和户外探险内容。',
    platforms: [
      { platform: 'xiaohongshu', handle: '@Alex环球旅行', followers: 1200000, url: 'https://xiaohongshu.com/user/alex' },
      { platform: 'youtube', handle: '@AlexTravelWorld', followers: 950000, url: 'https://youtube.com/@alextravel' },
      { platform: 'douyin', handle: '@Alex看世界', followers: 2100000, url: 'https://douyin.com/user/alex' },
    ],
    categories: ['旅行', '户外', '生活'],
    audience: {
      gender: { male: 45, female: 52, other: 3 },
      ageDistribution: [
        { range: '18-24', percentage: 22 },
        { range: '25-34', percentage: 45 },
        { range: '35-44', percentage: 23 },
        { range: '45+', percentage: 10 },
      ],
      regionDistribution: [
        { province: '北京', percentage: 15 },
        { province: '上海', percentage: 14 },
        { province: '广东', percentage: 13 },
        { province: '浙江', percentage: 10 },
        { province: '江苏', percentage: 8 },
        { province: '福建', percentage: 6 },
        { province: '其他', percentage: 34 },
      ],
      interests: [
        { tag: '旅行攻略', percentage: 88 },
        { tag: '摄影', percentage: 72 },
        { tag: '户外运动', percentage: 60 },
        { tag: '美食', percentage: 52 },
        { tag: '酒店体验', percentage: 45 },
      ],
    },
    avgEngagementRate: 6.5,
    verified: true,
    rating: 4.7,
    totalCollaborations: 58,
    createdAt: '2024-06-05T11:00:00Z',
  },
  {
    id: 'c4',
    userId: 'u6',
    name: '健身教练王猛',
    avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=200&h=200&fit=crop',
    bio: '国家一级健身运动员，10年健身教练经验。分享科学健身方法、营养饮食计划，帮你练出理想身材。',
    platforms: [
      { platform: 'douyin', handle: '@健身教练王猛', followers: 4800000, url: 'https://douyin.com/user/wangmeng' },
      { platform: 'kuaishou', handle: '@王猛健身', followers: 1950000, url: 'https://kuaishou.com/wangmeng' },
      { platform: 'bilibili', handle: '@王猛健身课堂', followers: 560000, url: 'https://bilibili.com/wangmeng' },
    ],
    categories: ['健身', '运动', '健康'],
    audience: {
      gender: { male: 62, female: 36, other: 2 },
      ageDistribution: [
        { range: '18-24', percentage: 30 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 20 },
        { range: '45+', percentage: 10 },
      ],
      regionDistribution: [
        { province: '广东', percentage: 17 },
        { province: '山东', percentage: 10 },
        { province: '北京', percentage: 9 },
        { province: '河南', percentage: 8 },
        { province: '江苏', percentage: 7 },
        { province: '浙江', percentage: 6 },
        { province: '其他', percentage: 43 },
      ],
      interests: [
        { tag: '健身增肌', percentage: 85 },
        { tag: '减脂塑形', percentage: 78 },
        { tag: '健康饮食', percentage: 70 },
        { tag: '运动装备', percentage: 52 },
        { tag: '蛋白粉补剂', percentage: 45 },
      ],
    },
    avgEngagementRate: 8.1,
    verified: true,
    rating: 4.9,
    totalCollaborations: 156,
    createdAt: '2024-02-10T08:30:00Z',
  },
  {
    id: 'c5',
    userId: 'u7',
    name: '小美穿搭日记',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    bio: '时尚穿搭博主，专注日常穿搭、约会穿搭、职场穿搭分享。让每个女孩都能找到属于自己的风格。',
    platforms: [
      { platform: 'xiaohongshu', handle: '@小美穿搭日记', followers: 2850000, url: 'https://xiaohongshu.com/user/xiaomei' },
      { platform: 'weibo', handle: '@小美爱穿搭', followers: 1680000, url: 'https://weibo.com/xiaomei' },
      { platform: 'douyin', handle: '@小美穿搭', followers: 920000, url: 'https://douyin.com/user/xiaomei' },
    ],
    categories: ['时尚', '穿搭', '美妆'],
    audience: {
      gender: { male: 8, female: 90, other: 2 },
      ageDistribution: [
        { range: '18-24', percentage: 38 },
        { range: '25-34', percentage: 40 },
        { range: '35-44', percentage: 16 },
        { range: '45+', percentage: 6 },
      ],
      regionDistribution: [
        { province: '上海', percentage: 16 },
        { province: '广东', percentage: 14 },
        { province: '北京', percentage: 12 },
        { province: '浙江', percentage: 11 },
        { province: '江苏', percentage: 9 },
        { province: '四川', percentage: 7 },
        { province: '其他', percentage: 31 },
      ],
      interests: [
        { tag: '穿搭分享', percentage: 92 },
        { tag: '美妆护肤', percentage: 80 },
        { tag: '奢侈品', percentage: 55 },
        { tag: '发型造型', percentage: 62 },
        { tag: '美甲', percentage: 48 },
      ],
    },
    avgEngagementRate: 9.3,
    verified: true,
    rating: 4.8,
    totalCollaborations: 203,
    createdAt: '2024-04-18T15:45:00Z',
  },
];

export const sponsorshipPackages: SponsorshipPackage[] = [
  {
    id: 'p1',
    creatorId: 'c1',
    type: 'mention',
    name: '美食视频口播植入',
    description: '在美食制作或探店视频中进行30-60秒产品口播介绍，自然融入内容场景。',
    price: 25000,
    deliveryDays: 7,
    includes: ['30-60秒口播介绍', '视频简介区产品链接', '抖音+小红书双平台发布', '数据报告交付'],
    createdAt: '2024-08-10T10:00:00Z',
  },
  {
    id: 'p2',
    creatorId: 'c1',
    type: 'patch',
    name: '视频贴片广告',
    description: '视频开头或结尾15秒品牌贴片，包含品牌Logo和slogan展示。',
    price: 15000,
    deliveryDays: 5,
    includes: ['15秒视频贴片', '指定位置投放', '3条视频投放', '曝光数据统计'],
    createdAt: '2024-08-10T10:00:00Z',
  },
  {
    id: 'p3',
    creatorId: 'c1',
    type: 'collab',
    name: '品牌联名探店',
    description: '为品牌定制专属探店内容，深度体验品牌产品/门店，制作2-3条系列内容。',
    price: 88000,
    deliveryDays: 14,
    includes: ['2-3条系列内容', '深度场景植入', '全平台同步发布', '线下体验拍摄', '品牌方内容审核权'],
    createdAt: '2024-08-10T10:00:00Z',
  },
  {
    id: 'p4',
    creatorId: 'c2',
    type: 'mention',
    name: '数码产品深度测评',
    description: '对数码产品进行专业深度测评，10-15分钟视频详细讲解产品优缺点。',
    price: 68000,
    deliveryDays: 10,
    includes: ['10-15分钟深度测评', '专业测试数据对比', 'B站+YouTube+微博三平台', '完整数据报告'],
    createdAt: '2024-07-20T14:30:00Z',
  },
  {
    id: 'p5',
    creatorId: 'c2',
    type: 'patch',
    name: '视频中插广告',
    description: '视频中间位置60秒品牌广告位，硬核粉丝精准触达。',
    price: 35000,
    deliveryDays: 7,
    includes: ['60秒中插广告', '每月2条视频投放', 'B站+YouTube双平台', '点击数据追踪'],
    createdAt: '2024-07-20T14:30:00Z',
  },
  {
    id: 'p6',
    creatorId: 'c2',
    type: 'collab',
    name: '品牌联合发布会',
    description: '作为品牌嘉宾参与新品发布会直播，进行产品首测体验分享。',
    price: 128000,
    deliveryDays: 20,
    includes: ['发布会直播嘉宾', '专属测评视频', '全平台宣传推广', '粉丝互动环节设计', '传播数据全案报告'],
    createdAt: '2024-07-20T14:30:00Z',
  },
  {
    id: 'p7',
    creatorId: 'c3',
    type: 'mention',
    name: '旅行Vlog场景植入',
    description: '在旅行Vlog中自然植入品牌产品，展示产品在真实旅行场景中的使用。',
    price: 45000,
    deliveryDays: 10,
    includes: ['旅行场景自然植入', '小红书+抖音+YouTube三平台', '精美图文+视频内容', '旅行打卡定位'],
    createdAt: '2024-09-01T09:00:00Z',
  },
  {
    id: 'p8',
    creatorId: 'c3',
    type: 'collab',
    name: '品牌目的地定制游',
    description: '为品牌定制专属旅行目的地内容，制作5-7条系列内容深度种草。',
    price: 188000,
    deliveryDays: 30,
    includes: ['5-7条系列内容', '目的地深度拍摄', '全平台矩阵发布', '品牌定制话题活动', '用户UGC引导'],
    createdAt: '2024-09-01T09:00:00Z',
  },
  {
    id: 'p9',
    creatorId: 'c4',
    type: 'mention',
    name: '健身教程产品植入',
    description: '在健身教学视频中植入运动补剂、健身装备等产品推荐。',
    price: 38000,
    deliveryDays: 7,
    includes: ['健身场景产品植入', '专业使用方法演示', '抖音+快手+B站三平台', '转化数据追踪'],
    createdAt: '2024-06-15T16:00:00Z',
  },
  {
    id: 'p10',
    creatorId: 'c4',
    type: 'patch',
    name: '系列视频贴片',
    description: '健身系列课程视频开头贴片，持续触达精准健身人群。',
    price: 22000,
    deliveryDays: 5,
    includes: ['每月10条视频贴片', '15秒品牌展示', '全平台覆盖', '曝光数据周报'],
    createdAt: '2024-06-15T16:00:00Z',
  },
  {
    id: 'p11',
    creatorId: 'c4',
    type: 'collab',
    name: '品牌代言健身挑战赛',
    description: '发起品牌冠名的健身挑战赛，带动粉丝参与和UGC内容爆发。',
    price: 158000,
    deliveryDays: 25,
    includes: ['挑战赛发起视频', '21天打卡跟练', '品牌专属话题', '精选UGC转发', '活动结案报告'],
    createdAt: '2024-06-15T16:00:00Z',
  },
  {
    id: 'p12',
    creatorId: 'c5',
    type: 'mention',
    name: '穿搭笔记单品推荐',
    description: '在穿搭笔记/视频中推荐品牌服饰单品，搭配完整造型展示。',
    price: 32000,
    deliveryDays: 5,
    includes: ['穿搭图文+视频', '单品细节展示', '购买链接引导', '小红书+微博+抖音三平台'],
    createdAt: '2024-08-25T11:30:00Z',
  },
  {
    id: 'p13',
    creatorId: 'c5',
    type: 'patch',
    name: '穿搭合集品牌露出',
    description: '在月度/季度穿搭合集中进行品牌多单品露出。',
    price: 18000,
    deliveryDays: 7,
    includes: ['3-5套穿搭展示', '品牌Logo露出', '合集内容置顶', '平台流量扶持'],
    createdAt: '2024-08-25T11:30:00Z',
  },
  {
    id: 'p14',
    creatorId: 'c5',
    type: 'collab',
    name: '品牌联名穿搭系列',
    description: '与品牌推出联名穿搭系列，从设计到宣发全程参与。',
    price: 218000,
    deliveryDays: 45,
    includes: ['联名系列设计参与', '10+套穿搭内容', '新品发布直播', '全平台宣发矩阵', '销售数据追踪'],
    createdAt: '2024-08-25T11:30:00Z',
  },
];

export const collaborationCases: CollaborationCase[] = [
  {
    id: 'case1',
    creatorId: 'c1',
    brandName: '海底捞',
    brandLogo: 'https://logo.clearbit.com/haidilao.com',
    projectName: '海底捞新品探店',
    type: 'collab',
    platform: 'douyin',
    views: 5680000,
    engagementRate: 8.5,
    description: '探店海底捞夏季新品，拍摄3条系列短视频，包含锅底、菜品、服务全方位展示，带动门店到店率提升30%。',
    thumbnail: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop',
    completedAt: '2024-08-15T00:00:00Z',
  },
  {
    id: 'case2',
    creatorId: 'c1',
    brandName: '三只松鼠',
    brandLogo: 'https://logo.clearbit.com/3songshu.com',
    projectName: '零食开箱口播推荐',
    type: 'mention',
    platform: 'xiaohongshu',
    views: 1250000,
    engagementRate: 12.3,
    description: '在零食开箱视频中口播推荐三只松鼠新品坚果，小红书笔记点赞超8万，电商转化效果显著。',
    thumbnail: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400&h=300&fit=crop',
    completedAt: '2024-07-22T00:00:00Z',
  },
  {
    id: 'case3',
    creatorId: 'c2',
    brandName: '小米',
    brandLogo: 'https://logo.clearbit.com/mi.com',
    projectName: '小米14 Ultra深度测评',
    type: 'mention',
    platform: 'bilibili',
    views: 8920000,
    engagementRate: 9.8,
    description: '对小米14 Ultra进行全方位深度测评，包含影像、性能、续航等专业测试，B站播放量近900万。',
    thumbnail: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    completedAt: '2024-05-10T00:00:00Z',
  },
  {
    id: 'case4',
    creatorId: 'c2',
    brandName: '联想',
    brandLogo: 'https://logo.clearbit.com/lenovo.com',
    projectName: '拯救者新品联合发布会',
    type: 'collab',
    platform: 'bilibili',
    views: 3200000,
    engagementRate: 15.2,
    description: '作为特邀嘉宾参与联想拯救者新品线上发布会，直播同时在线人数峰值50万+。',
    thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    completedAt: '2024-06-18T00:00:00Z',
  },
  {
    id: 'case5',
    creatorId: 'c3',
    brandName: '携程',
    brandLogo: 'https://logo.clearbit.com/ctrip.com',
    projectName: '三亚旅行攻略定制',
    type: 'collab',
    platform: 'xiaohongshu',
    views: 2850000,
    engagementRate: 11.6,
    description: '为携程定制三亚高端旅行攻略，5篇系列笔记总曝光超2800万，带动携程三亚订单增长25%。',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    completedAt: '2024-09-05T00:00:00Z',
  },
  {
    id: 'case6',
    creatorId: 'c4',
    brandName: 'Keep',
    brandLogo: 'https://logo.clearbit.com/keep.com',
    projectName: '21天健身挑战赛',
    type: 'collab',
    platform: 'douyin',
    views: 12500000,
    engagementRate: 18.7,
    description: '与Keep联合发起21天健身挑战赛，话题播放量超1.2亿，参与用户超50万，Keep新增下载显著提升。',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop',
    completedAt: '2024-08-28T00:00:00Z',
  },
  {
    id: 'case7',
    creatorId: 'c4',
    brandName: '肌肉科技',
    brandLogo: 'https://logo.clearbit.com/muscletech.com',
    projectName: '乳清蛋白粉专业测评',
    type: 'mention',
    platform: 'bilibili',
    views: 1560000,
    engagementRate: 7.9,
    description: '对肌肉科技乳清蛋白粉进行成分分析和使用效果测评，专业内容获得健身圈广泛认可。',
    thumbnail: 'https://images.unsplash.com/photo-1579722821273-0f6c1b5d0b77?w=400&h=300&fit=crop',
    completedAt: '2024-07-12T00:00:00Z',
  },
  {
    id: 'case8',
    creatorId: 'c5',
    brandName: '太平鸟',
    brandLogo: 'https://logo.clearbit.com/peacebird.com',
    projectName: '秋冬系列联名穿搭',
    type: 'collab',
    platform: 'xiaohongshu',
    views: 4680000,
    engagementRate: 14.5,
    description: '与太平鸟联名推出秋冬穿搭系列，12套穿搭笔记+3条视频，总曝光超4600万，品牌搜索量提升80%。',
    thumbnail: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=300&fit=crop',
    completedAt: '2024-10-08T00:00:00Z',
  },
  {
    id: 'case9',
    creatorId: 'c5',
    brandName: '完美日记',
    brandLogo: 'https://logo.clearbit.com/perfectdiary.com',
    projectName: '妆容单品推荐',
    type: 'mention',
    platform: 'xiaohongshu',
    views: 2100000,
    engagementRate: 16.8,
    description: '在约会妆容教程中推荐完美日记新品口红，笔记点赞超15万，天猫旗舰店该色号售罄。',
    thumbnail: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=300&fit=crop',
    completedAt: '2024-09-20T00:00:00Z',
  },
];

export const brands: Brand[] = [
  {
    id: 'b1',
    userId: 'u3',
    name: '悦味茶饮',
    logo: 'https://logo.clearbit.com/heytea.com',
    description: '新生代茶饮品牌，主打新鲜、健康、创意茶饮。全国门店超500家，深受年轻消费者喜爱。',
    industry: '餐饮茶饮',
    website: 'https://yuewei-tea.com',
    contactName: '李美丽',
    contactEmail: 'li.meili@yuewei-tea.com',
    contactPhone: '13900139001',
    createdAt: '2024-05-10T09:15:00Z',
  },
  {
    id: 'b2',
    userId: 'u4',
    name: '智航科技',
    logo: 'https://logo.clearbit.com/xiaomi.com',
    description: '智能硬件创新公司，专注智能家居、消费电子领域，致力于用科技让生活更美好。',
    industry: '智能硬件',
    website: 'https://zhihang-tech.com',
    contactName: '王总',
    contactEmail: 'wang.ceo@zhihang-tech.com',
    contactPhone: '13900139002',
    createdAt: '2024-02-28T16:45:00Z',
  },
  {
    id: 'b3',
    userId: 'u8',
    name: '逸动运动',
    logo: 'https://logo.clearbit.com/nike.com',
    description: '专业运动装备品牌，产品线覆盖跑步、健身、户外等多个运动场景，为运动爱好者提供高品质装备。',
    industry: '运动服饰',
    website: 'https://yidong-sports.com',
    contactName: '陈经理',
    contactEmail: 'chen.manager@yidong-sports.com',
    contactPhone: '13900139003',
    createdAt: '2024-04-05T13:20:00Z',
  },
];

export const projects: Project[] = [
  {
    id: 'proj1',
    brandId: 'b1',
    creatorId: 'c1',
    title: '悦味夏季新品茶饮推广',
    description: '推广悦味茶饮2024夏季限定新品，包含水果茶系列和冰淇淋系列，目标用户18-35岁年轻人群。',
    type: 'collab',
    budget: 98000,
    status: 'completed',
    platform: 'douyin',
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    milestones: [
      {
        id: 'm1',
        projectId: 'proj1',
        title: '脚本策划',
        description: '完成探店脚本策划和创意方案，提交品牌方审核',
        dueDate: '2024-06-05',
        status: 'approved',
        deliverables: ['创意方案PPT', '分镜脚本', '拍摄计划'],
        approvedAt: '2024-06-04T10:00:00Z',
      },
      {
        id: 'm2',
        projectId: 'proj1',
        title: '内容拍摄',
        description: '完成3条探店视频拍摄和素材采集',
        dueDate: '2024-06-15',
        status: 'approved',
        deliverables: ['原片素材', '精修图片', '拍摄花絮'],
        approvedAt: '2024-06-14T16:30:00Z',
      },
      {
        id: 'm3',
        projectId: 'proj1',
        title: '后期制作与发布',
        description: '完成视频剪辑制作，全平台发布，交付数据报告',
        dueDate: '2024-06-30',
        status: 'approved',
        deliverables: ['3条成片视频', '发布链接', '数据结案报告'],
        approvedAt: '2024-06-29T18:00:00Z',
      },
    ],
    requirements: [
      '突出新品茶饮的颜值和口感',
      '拍摄需包含门店环境和制作过程',
      '视频风格轻松活泼，符合夏日氛围',
      '每条视频需包含门店定位和购买引导',
    ],
    createdAt: '2024-05-20T10:00:00Z',
    signedAt: '2024-05-25T14:00:00Z',
    completedAt: '2024-06-30T23:59:59Z',
  },
  {
    id: 'proj2',
    brandId: 'b2',
    creatorId: 'c2',
    title: '智航智能手表深度测评',
    description: '对智航科技最新款智能手表进行全方位深度测评，涵盖健康监测、运动功能、续航等核心卖点。',
    type: 'mention',
    budget: 75000,
    status: 'executing',
    platform: 'bilibili',
    startDate: '2024-11-01',
    endDate: '2024-11-20',
    milestones: [
      {
        id: 'm4',
        projectId: 'proj2',
        title: '产品接收与测试方案',
        description: '接收产品，制定详细测试方案',
        dueDate: '2024-11-03',
        status: 'approved',
        deliverables: ['测试方案文档', '测试用例列表'],
        approvedAt: '2024-11-02T11:00:00Z',
      },
      {
        id: 'm5',
        projectId: 'proj2',
        title: '深度测试与拍摄',
        description: '进行7天真实使用测试，拍摄测试过程和素材',
        dueDate: '2024-11-12',
        status: 'in_progress',
        deliverables: ['测试数据记录', '拍摄素材', '对比数据'],
      },
      {
        id: 'm6',
        projectId: 'proj2',
        title: '视频制作与发布',
        description: '完成测评视频制作，全平台发布',
        dueDate: '2024-11-20',
        status: 'pending',
        deliverables: ['测评视频成片', '发布链接', '数据跟踪报告'],
      },
    ],
    requirements: [
      '测评需客观真实，包含优缺点分析',
      '重点展示健康监测功能的准确性',
      '与市场同类产品进行对比测试',
      '视频时长控制在12-15分钟',
    ],
    createdAt: '2024-10-25T09:00:00Z',
    signedAt: '2024-10-28T15:00:00Z',
  },
  {
    id: 'proj3',
    brandId: 'b3',
    creatorId: 'c4',
    title: '逸动跑步鞋新品推广',
    description: '推广逸动运动2024冬季新款专业跑步鞋，主打缓震科技和轻量设计。',
    type: 'collab',
    budget: 168000,
    status: 'negotiating',
    platform: 'douyin',
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    milestones: [
      {
        id: 'm7',
        projectId: 'proj3',
        title: '创意方案确认',
        description: '确认挑战赛创意方案和活动规则',
        dueDate: '2024-12-03',
        status: 'pending',
        deliverables: ['活动策划方案', '挑战赛规则', '传播节奏表'],
      },
      {
        id: 'm8',
        projectId: 'proj3',
        title: '挑战赛内容制作',
        description: '制作挑战赛发起视频和跟练教学内容',
        dueDate: '2024-12-15',
        status: 'pending',
        deliverables: ['发起视频', '跟练教程', '宣传海报'],
      },
      {
        id: 'm9',
        projectId: 'proj3',
        title: '活动执行与数据报告',
        description: '活动全程运营，结案数据报告',
        dueDate: '2024-12-31',
        status: 'pending',
        deliverables: ['活动运营记录', 'UGC内容精选', '结案报告'],
      },
    ],
    requirements: [
      '挑战赛话题需体现产品缓震科技卖点',
      '邀请3-5位健身KOL联动参与',
      '设置丰富奖品激励用户参与',
      '活动期内品牌方直播联动不少于2场',
    ],
    createdAt: '2024-11-15T14:00:00Z',
  },
  {
    id: 'proj4',
    brandId: 'b1',
    creatorId: 'c5',
    title: '悦味茶饮周边穿搭联名',
    description: '悦味茶饮与时尚博主联名推出茶饮周边穿搭系列，结合品牌元素打造时尚单品。',
    type: 'collab',
    budget: 258000,
    status: 'signed',
    platform: 'xiaohongshu',
    startDate: '2024-12-10',
    endDate: '2025-01-20',
    milestones: [
      {
        id: 'm10',
        projectId: 'proj4',
        title: '联名设计阶段',
        description: '完成联名系列设计稿和打样',
        dueDate: '2024-12-20',
        status: 'pending',
        deliverables: ['设计稿', '样品实物', '产品图册'],
      },
      {
        id: 'm11',
        projectId: 'proj4',
        title: '内容制作阶段',
        description: '拍摄联名系列穿搭内容',
        dueDate: '2025-01-05',
        status: 'pending',
        deliverables: ['10+套穿搭图文', '3条穿搭视频', '产品细节图'],
      },
      {
        id: 'm12',
        projectId: 'proj4',
        title: '宣发与销售阶段',
        description: '全平台宣发，跟踪销售数据',
        dueDate: '2025-01-20',
        status: 'pending',
        deliverables: ['宣发内容链接', '销售数据报表', '结案报告'],
      },
    ],
    requirements: [
      '设计需融入悦味品牌色彩和茶饮元素',
      '产品线涵盖帽子、T恤、帆布袋等品类',
      '穿搭内容需覆盖日常、约会、通勤多个场景',
      '限量发售，制造稀缺感',
    ],
    createdAt: '2024-11-10T10:00:00Z',
    signedAt: '2024-11-18T16:00:00Z',
  },
  {
    id: 'proj5',
    brandId: 'b2',
    creatorId: 'c3',
    title: '智航便携无人机旅行测评',
    description: '旅行博主实测智航便携无人机，在真实旅拍场景中展示产品便携性和拍摄效果。',
    type: 'mention',
    budget: 58000,
    status: 'pending',
    platform: 'youtube',
    startDate: '2024-12-15',
    endDate: '2025-01-10',
    milestones: [
      {
        id: 'm13',
        projectId: 'proj5',
        title: '产品接收与行程规划',
        description: '接收产品，规划旅拍行程路线',
        dueDate: '2024-12-18',
        status: 'pending',
        deliverables: ['行程规划', '拍摄场景列表'],
      },
      {
        id: 'm14',
        projectId: 'proj5',
        title: '旅拍内容创作',
        description: '在旅行中拍摄无人机使用场景和素材',
        dueDate: '2025-01-03',
        status: 'pending',
        deliverables: ['航拍素材', '使用场景视频', '旅行Vlog素材'],
      },
      {
        id: 'm15',
        projectId: 'proj5',
        title: '视频制作发布',
        description: '完成测评视频制作，全平台发布',
        dueDate: '2025-01-10',
        status: 'pending',
        deliverables: ['测评Vlog', '航拍集锦', '发布链接'],
      },
    ],
    requirements: [
      '重点展示产品便携性和易操作性',
      '航拍画面需体现画质稳定性',
      '场景需包含自然风光和城市景观',
      '视频风格轻松愉悦，符合旅行博主人设',
    ],
    createdAt: '2024-11-20T11:00:00Z',
  },
];

export const wallets: Wallet[] = [
  { id: 'w1', userId: 'u1', balance: 156800, frozenAmount: 25000, currency: 'CNY', updatedAt: '2024-11-18T10:00:00Z' },
  { id: 'w2', userId: 'u2', balance: 285000, frozenAmount: 75000, currency: 'CNY', updatedAt: '2024-11-18T10:00:00Z' },
  { id: 'w3', userId: 'u3', balance: 520000, frozenAmount: 168000, currency: 'CNY', updatedAt: '2024-11-18T10:00:00Z' },
  { id: 'w4', userId: 'u4', balance: 890000, frozenAmount: 75000, currency: 'CNY', updatedAt: '2024-11-18T10:00:00Z' },
];

export const transactions: Transaction[] = [
  { id: 't1', walletId: 'w3', type: 'deposit', amount: 500000, description: '账户充值', status: 'completed', createdAt: '2024-10-01T09:00:00Z' },
  { id: 't2', walletId: 'w3', type: 'payment', amount: 98000, description: '悦味夏季新品茶饮推广项目款', projectId: 'proj1', status: 'completed', createdAt: '2024-05-25T14:00:00Z' },
  { id: 't3', walletId: 'w1', type: 'payment', amount: 98000, description: '悦味夏季新品茶饮推广项目收入', projectId: 'proj1', status: 'completed', createdAt: '2024-07-02T10:00:00Z' },
  { id: 't4', walletId: 'w4', type: 'deposit', amount: 1000000, description: '账户充值', status: 'completed', createdAt: '2024-06-01T10:00:00Z' },
  { id: 't5', walletId: 'w4', type: 'payment', amount: 75000, description: '智航智能手表深度测评项目款', projectId: 'proj2', status: 'completed', createdAt: '2024-10-28T15:00:00Z' },
  { id: 't6', walletId: 'w2', type: 'payment', amount: 37500, description: '智航智能手表测评项目首款（50%）', projectId: 'proj2', status: 'completed', createdAt: '2024-10-30T10:00:00Z' },
  { id: 't7', walletId: 'w3', type: 'payment', amount: 258000, description: '悦味茶饮周边穿搭联名项目款', projectId: 'proj4', status: 'pending', createdAt: '2024-11-18T16:00:00Z' },
  { id: 't8', walletId: 'w4', type: 'payment', amount: 58000, description: '智航便携无人机旅行测评项目款', projectId: 'proj5', status: 'pending', createdAt: '2024-11-20T11:00:00Z' },
  { id: 't9', walletId: 'w1', type: 'withdraw', amount: 50000, description: '提现到银行卡', status: 'completed', createdAt: '2024-08-15T14:00:00Z' },
  { id: 't10', walletId: 'w2', type: 'withdraw', amount: 100000, description: '提现到银行卡', status: 'completed', createdAt: '2024-09-01T10:00:00Z' },
  { id: 't11', walletId: 'w3', type: 'refund', amount: 10000, description: '项目取消退款', status: 'completed', createdAt: '2024-10-15T09:00:00Z' },
  { id: 't12', walletId: 'w1', type: 'commission', amount: 2000, description: '平台推荐奖励', status: 'completed', createdAt: '2024-11-01T10:00:00Z' },
];

export const messages: Message[] = [
  {
    id: 'msg1',
    conversationId: 'conv1',
    senderId: 'u3',
    receiverId: 'u1',
    content: '您好，我是悦味茶饮的李美丽，看到您的美食探店内容非常棒，想邀请您合作我们的夏季新品推广~',
    read: true,
    createdAt: '2024-05-20T10:05:00Z',
  },
  {
    id: 'msg2',
    conversationId: 'conv1',
    senderId: 'u1',
    receiverId: 'u3',
    content: '您好李经理！非常感谢贵品牌的认可，我很感兴趣。请问具体合作形式和预算是怎样的呢？',
    read: true,
    createdAt: '2024-05-20T11:30:00Z',
  },
  {
    id: 'msg3',
    conversationId: 'conv1',
    senderId: 'u3',
    receiverId: 'u1',
    content: '我们希望做一个系列探店合作，3条短视频+小红书图文，预算大概在8-10万，可以根据您的方案调整。',
    read: true,
    createdAt: '2024-05-20T14:00:00Z',
  },
  {
    id: 'msg4',
    conversationId: 'conv1',
    senderId: 'u1',
    receiverId: 'u3',
    content: '好的，我这边做一个详细的创意方案，包含拍摄场景、内容结构、传播计划等，明天发给您确认可以吗？',
    read: true,
    createdAt: '2024-05-20T15:20:00Z',
  },
  {
    id: 'msg5',
    conversationId: 'conv1',
    senderId: 'u3',
    receiverId: 'u1',
    content: '太好了！期待您的方案，有任何问题随时沟通~',
    read: true,
    createdAt: '2024-05-20T15:30:00Z',
  },
  {
    id: 'msg6',
    conversationId: 'conv2',
    senderId: 'u4',
    receiverId: 'u2',
    content: '张老师您好，我是智航科技的王总，我们即将发布一款智能手表，非常希望能邀请您做一期深度测评。',
    read: true,
    createdAt: '2024-10-25T09:10:00Z',
  },
  {
    id: 'msg7',
    conversationId: 'conv2',
    senderId: 'u2',
    receiverId: 'u4',
    content: '王总您好！感谢信任，可以先介绍一下产品的核心卖点和目标人群吗？我好针对性地做测评方案。',
    read: true,
    createdAt: '2024-10-25T10:45:00Z',
  },
  {
    id: 'msg8',
    conversationId: 'conv2',
    senderId: 'u4',
    receiverId: 'u2',
    content: '这款产品主打医疗级健康监测，支持ECG心电图、血氧、睡眠等功能，目标人群是25-45岁关注健康的职场人士。',
    read: true,
    createdAt: '2024-10-25T11:30:00Z',
  },
  {
    id: 'msg9',
    conversationId: 'conv2',
    senderId: 'u2',
    receiverId: 'u4',
    content: '了解了，我这边可以做一个7天真实使用测试，对比苹果手表和华为手表的同类型功能，确保测评客观专业。',
    read: false,
    createdAt: '2024-11-18T09:00:00Z',
  },
  {
    id: 'msg10',
    conversationId: 'conv3',
    senderId: 'u4',
    receiverId: 'u5',
    content: 'Alex您好！我们有一款便携无人机新品，非常适合您的旅行内容，感兴趣合作测评吗？',
    read: true,
    createdAt: '2024-11-20T11:05:00Z',
  },
];
