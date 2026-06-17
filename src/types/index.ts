export interface User {
  id: string;
  role: 'creator' | 'brand' | 'admin';
  email: string;
  name: string;
  avatar: string;
  company?: string;
  verified: boolean;
}

export interface Platform {
  type: string;
  handle: string;
  followers: number;
  avgViews: number;
}

export interface AudienceData {
  genderRatio: {
    male: number;
    female: number;
    other: number;
  };
  ageDistribution: {
    range: string;
    percentage: number;
  }[];
  geoDistribution: {
    region: string;
    percentage: number;
  }[];
  interests: {
    tag: string;
    score: number;
  }[];
}

export interface CaseStudy {
  id: string;
  creatorId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  description: string;
  coverImage: string;
  deliverables: string[];
  metrics: {
    name: string;
    value: number;
    unit: string;
  }[];
  startDate: string;
  endDate: string;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  platforms: Platform[];
  totalFollowers: number;
  categories: string[];
  bio: string;
  location: string;
  audienceData: AudienceData;
  pastCases: CaseStudy[];
}

export interface BrandProfile {
  id: string;
  userId: string;
  name: string;
  logo: string;
  industry: string;
  description: string;
  website?: string;
  contactEmail: string;
  contactPhone?: string;
  location: string;
  establishedYear?: number;
  pastCollaborations: string[];
  preferredCategories: string[];
  avgBudget: number;
}

export type PackageType = 'mention' | 'overlay' | 'collab' | 'custom';

export type ProjectStatus = 'pending' | 'negotiating' | 'signed' | 'executing' | 'delivered' | 'completed' | 'cancelled';

export interface Package {
  id: string;
  name: string;
  type: PackageType;
  description: string;
  deliverables: string[];
  price: number;
  deliveryDays: number;
  recommended?: boolean;
}

export interface SponsorshipPackage {
  id: string;
  creatorId: string;
  type: PackageType;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  includes: string[];
  createdAt: string;
  recommended?: boolean;
}

export interface SponsorshipListing {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  coverImage: string;
  packages: Package[];
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
}

export interface Submission {
  id: string;
  content: string;
  attachments: string[];
  version: number;
  submittedAt: string;
}

export interface Feedback {
  id: string;
  authorId: string;
  content: string;
  createdAt: string;
  resolved: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'submitted' | 'approved' | 'rejected';
  submission?: Submission;
  feedback?: Feedback[];
}

export interface KpiTerm {
  id: string;
  metric: string;
  targetValue: number;
  unit: string;
  weight: number;
}

export interface Contract {
  id: string;
  projectId: string;
  content: string;
  kpiTerms: KpiTerm[];
  creatorSignedAt?: string;
  brandSignedAt?: string;
  status: 'draft' | 'pending_signature' | 'signed' | 'terminated';
}

export interface PerformanceData {
  projectId: string;
  metrics: {
    metric: string;
    actual: number;
    target: number;
    unit: string;
  }[];
  overallScore: number;
  dataSources: string[];
  reportGeneratedAt: string;
}

export interface Project {
  id: string;
  listingId: string;
  creatorId: string;
  brandId: string;
  packageId: string;
  status: ProjectStatus;
  title: string;
  budget: number;
  brief: string;
  milestones: Milestone[];
  contract?: Contract;
  performance?: PerformanceData;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  frozen: number;
  pending: number;
  currency: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'hold' | 'release' | 'refund' | 'deduction';
  amount: number;
  projectId?: string;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export interface Settlement {
  id: string;
  projectId: string;
  totalAmount: number;
  deductionAmount: number;
  finalAmount: number;
  deductionReason: string;
  status: 'pending_negotiation' | 'agreed' | 'paid';
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'file' | 'system';
  attachments?: string[];
  createdAt: string;
  readBy: string[];
}

export interface Conversation {
  id: string;
  projectId: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface LoginRequest {
  role: 'creator' | 'brand';
  email: string;
  password: string;
}
