import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  projects as initialProjects,
  messages as initialMessages,
  wallets as initialWallets,
  transactions as initialTransactions,
  creators,
  brands,
  type Project,
  type Milestone,
  type ProjectStatus,
  type MilestoneStatus,
  type ListingType,
  type Platform,
  type Message,
  type Wallet,
  type Transaction,
  type TransactionType,
} from '@/services/mockData';
import type { SponsorshipListing, Package as ListingPackage } from '@/types';

interface CreateMilestoneInput {
  title: string;
  description: string;
  dueDate: string;
  deliverables: string[];
}

interface CreateProjectInput {
  brandId: string;
  creatorId: string;
  packageId?: string;
  title: string;
  description: string;
  type: ListingType;
  budget: number;
  platform: Platform;
  startDate: string;
  endDate: string;
  milestones: CreateMilestoneInput[];
  requirements: string[];
}

interface Conversation {
  id: string;
  projectId: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
}

export interface Settlement {
  id: string;
  projectId: string;
  totalAmount: number;
  platformFee: number;
  finalAmount: number;
  status: 'pending' | 'approved' | 'paid' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  paidAt?: string;
}

export interface PerformanceReport {
  id: string;
  projectId: string;
  projectName: string;
  views: number;
  engagementRate: number;
  likes: number;
  comments: number;
  shares: number;
  conversionRate?: number;
  targetViews: number;
  targetEngagementRate: number;
  overallScore: number;
  summary: string;
  generatedAt: string;
}

export interface ListingWithStats extends SponsorshipListing {
  views: number;
  favorites: number;
}

interface CreateListingPackageInput {
  id?: string;
  name: string;
  type: string;
  description: string;
  price: number;
  deliveryDays: number;
  deliverables: string[];
  recommended?: boolean;
}

interface CreateListingInput {
  title: string;
  description: string;
  coverImage: string;
  packages: CreateListingPackageInput[];
}

export type ChatMessage = Message;

interface AppState {
  projects: Project[];
  messages: Message[];
  conversations: Conversation[];
  wallets: Wallet[];
  transactions: Transaction[];
  settlements: Settlement[];
  performanceReports: PerformanceReport[];

  createProject: (input: CreateProjectInput) => Project;
  getProjectById: (id: string) => Project | undefined;
  getProjectsByBrand: (brandId: string) => Project[];
  getProjectsByCreator: (creatorId: string) => Project[];
  updateProjectStatus: (projectId: string, status: ProjectStatus) => Project | null;

  submitMilestoneContent: (
    projectId: string,
    milestoneId: string,
    content: string
  ) => Milestone | null;
  approveMilestone: (
    projectId: string,
    milestoneId: string,
    feedback?: string
  ) => Milestone | null;
  rejectMilestone: (
    projectId: string,
    milestoneId: string,
    feedback: string
  ) => Milestone | null;
  getSubmittedMilestones: () => Array<{
    project: Project;
    milestone: Milestone;
  }>;

  addSystemMessage: (projectId: string, content: string) => Message;
  getMessagesByProject: (projectId: string) => Message[];
  sendMessage: (projectId: string, senderId: string, content: string) => Message;

  getWalletByUserId: (userId: string) => Wallet | undefined;
  getTransactionsByUserId: (userId: string) => Transaction[];
  deposit: (userId: string, amount: number, description: string) => Transaction;
  withdraw: (userId: string, amount: number, description: string) => Transaction;

  createSettlement: (projectId: string) => Settlement;
  getSettlementsByCreatorId: (creatorId: string) => Settlement[];
  getSettlementsByBrandId: (brandId: string) => Settlement[];
  approveSettlement: (settlementId: string) => void;

  generateReport: (projectId: string) => PerformanceReport;
  getReportsByProjectId: (projectId: string) => PerformanceReport[];

  listings: ListingWithStats[];
  currentCreatorId: string;
  currentBrandId: string;

  getCreatorByUserId: (userId: string) => typeof creators[number] | undefined;
  getBrandByUserId: (userId: string) => typeof brands[number] | undefined;
  setCurrentUser: (userId: string, role?: 'creator' | 'brand') => void;

  fetchListings: (creatorId?: string) => Promise<void>;
  createListing: (input: CreateListingInput, status?: 'draft' | 'published', userId?: string) => Promise<SponsorshipListing>;
  updateListing: (id: string, updates: Partial<CreateListingInput> & { status?: 'draft' | 'published' | 'archived' }) => Promise<SponsorshipListing | null>;
  deleteListing: (id: string) => Promise<boolean>;
  publishListing: (id: string) => Promise<boolean>;
  archiveListing: (id: string) => Promise<boolean>;
  getListingById: (id: string) => SponsorshipListing | undefined;
  getMinPriceByCreatorId: (creatorId: string) => number;

  saveFormDraft: (id: string, data: unknown) => void;
  getFormDraft: (id: string) => unknown;
  clearFormDraft: (id: string) => void;
}

const generateId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const createInitialMilestones = (
  projectId: string,
  inputMilestones: CreateMilestoneInput[]
): Milestone[] => {
  return inputMilestones.map((m, index) => ({
    id: generateId('m'),
    projectId,
    title: m.title,
    description: m.description,
    dueDate: m.dueDate,
    status: 'pending' as MilestoneStatus,
    deliverables: m.deliverables,
  }));
};

const initialConversations: Conversation[] = initialProjects
  .map((p) => {
    const projectMessages = initialMessages.filter((m) => {
      const conv = `conv-${p.id}`;
      return m.conversationId === conv || m.conversationId.endsWith(p.id);
    });
    return {
      id: `conv-${p.id}`,
      projectId: p.id,
      participants: [p.brandId, p.creatorId],
      lastMessage: projectMessages.length > 0 ? projectMessages[projectMessages.length - 1] : undefined,
      unreadCount: projectMessages.filter((m) => !m.read).length,
    };
  })
  .filter((c) => c.lastMessage || true);

const initialSettlements: Settlement[] = [];
const initialReports: PerformanceReport[] = [];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: initialProjects,
      messages: initialMessages,
      conversations: initialConversations,
      wallets: initialWallets,
      transactions: initialTransactions,
      settlements: initialSettlements,
      performanceReports: initialReports,

      createProject: (input: CreateProjectInput) => {
        const projectId = generateId('proj');
        const milestones = createInitialMilestones(projectId, input.milestones);

        const newProject: Project = {
          id: projectId,
          brandId: input.brandId,
          creatorId: input.creatorId,
          title: input.title,
          description: input.description,
          type: input.type,
          budget: input.budget,
          status: 'negotiating',
          platform: input.platform,
          startDate: input.startDate,
          endDate: input.endDate,
          milestones,
          requirements: input.requirements,
          createdAt: new Date().toISOString(),
        } as Project;

        set((state) => ({
          projects: [...state.projects, newProject],
        }));

        const systemMessage = get().addSystemMessage(
          projectId,
          '品牌方发起了合作意向，期待与您沟通合作详情。'
        );

        set((state) => {
          const newConversation: Conversation = {
            id: `conv-${projectId}`,
            projectId,
            participants: [input.brandId, input.creatorId],
            lastMessage: systemMessage,
            unreadCount: 1,
          };
          return {
            conversations: [...state.conversations, newConversation],
          };
        });

        return newProject;
      },

      getProjectById: (id: string) => {
        return get().projects.find((p) => p.id === id);
      },

      getProjectsByBrand: (brandId: string) => {
        return get().projects.filter((p) => p.brandId === brandId);
      },

      getProjectsByCreator: (creatorId: string) => {
        return get().projects.filter((p) => p.creatorId === creatorId);
      },

      updateProjectStatus: (projectId: string, status: ProjectStatus) => {
        let updatedProject: Project | null = null;

        set((state) => {
          const projects = state.projects.map((p) => {
            if (p.id === projectId) {
              const updated = {
                ...p,
                status,
                updatedAt: new Date().toISOString(),
              } as Project;
              if (status === 'signed' && !(p as any).signedAt) {
                (updated as any).signedAt = new Date().toISOString();
              }
              if (status === 'completed' && !(p as any).completedAt) {
                (updated as any).completedAt = new Date().toISOString();
              }
              updatedProject = updated;
              return updated;
            }
            return p;
          });
          return { projects };
        });

        return updatedProject;
      },

      submitMilestoneContent: (
        projectId: string,
        milestoneId: string,
        content: string
      ) => {
        let updatedMilestone: Milestone | null = null;

        set((state) => {
          const projects = state.projects.map((p) => {
            if (p.id === projectId) {
              const milestones = p.milestones.map((m) => {
                if (m.id === milestoneId) {
                  const updated = {
                    ...m,
                    status: 'submitted' as MilestoneStatus,
                    submittedContent: content,
                    submittedAt: new Date().toISOString(),
                  };
                  updatedMilestone = updated;
                  return updated;
                }
                return m;
              });
              return { ...p, milestones, updatedAt: new Date().toISOString() } as Project;
            }
            return p;
          });
          return { projects };
        });

        return updatedMilestone;
      },

      approveMilestone: (
        projectId: string,
        milestoneId: string,
        feedback?: string
      ) => {
        let updatedMilestone: Milestone | null = null;

        set((state) => {
          const projects = state.projects.map((p) => {
            if (p.id === projectId) {
              const milestones = p.milestones.map((m) => {
                if (m.id === milestoneId) {
                  const updated = {
                    ...m,
                    status: 'approved' as MilestoneStatus,
                    feedback: feedback || m.feedback,
                    approvedAt: new Date().toISOString(),
                  };
                  updatedMilestone = updated;
                  return updated;
                }
                return m;
              });

              const allApproved = milestones.every((m) => m.status === 'approved');
              const projectStatus: ProjectStatus = allApproved ? 'delivered' : p.status;

              return {
                ...p,
                milestones,
                status: projectStatus,
                updatedAt: new Date().toISOString(),
              } as Project;
            }
            return p;
          });
          return { projects };
        });

        return updatedMilestone;
      },

      rejectMilestone: (
        projectId: string,
        milestoneId: string,
        feedback: string
      ) => {
        let updatedMilestone: Milestone | null = null;

        set((state) => {
          const projects = state.projects.map((p) => {
            if (p.id === projectId) {
              const milestones = p.milestones.map((m) => {
                if (m.id === milestoneId) {
                  const updated = {
                    ...m,
                    status: 'rejected' as MilestoneStatus,
                    feedback,
                  };
                  updatedMilestone = updated;
                  return updated;
                }
                return m;
              });
              return { ...p, milestones, updatedAt: new Date().toISOString() } as Project;
            }
            return p;
          });
          return { projects };
        });

        return updatedMilestone;
      },

      getSubmittedMilestones: () => {
        const result: Array<{ project: Project; milestone: Milestone }> = [];
        const projects = get().projects;

        for (const project of projects) {
          for (const milestone of project.milestones) {
            if (milestone.status === 'submitted') {
              result.push({ project, milestone });
            }
          }
        }

        return result.sort(
          (a, b) =>
            new Date(b.milestone.submittedAt || 0).getTime() -
            new Date(a.milestone.submittedAt || 0).getTime()
        );
      },

      addSystemMessage: (projectId: string, content: string) => {
        const conversationId = `conv-${projectId}`;
        const newMessage = {
          id: generateId('msg'),
          conversationId,
          senderId: 'system',
          receiverId: '',
          content,
          read: false,
          createdAt: new Date().toISOString(),
        } as Message;

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        set((state) => {
          const conversations = state.conversations.map((c) => {
            if (c.projectId === projectId) {
              return {
                ...c,
                lastMessage: newMessage,
                unreadCount: c.unreadCount + 1,
              };
            }
            return c;
          });
          return { conversations };
        });

        return newMessage;
      },

      getMessagesByProject: (projectId: string) => {
        const conversationId = `conv-${projectId}`;
        return get()
          .messages.filter((m) => m.conversationId === conversationId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },

      getMessagesByConversationId: (projectId: string) => {
        const conversationId = `conv-${projectId}`;
        return get()
          .messages.filter((m) => m.conversationId === conversationId)
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },

      sendMessage: (projectId: string, senderId: string, content: string) => {
        const conversationId = `conv-${projectId}`;
        const newMessage = {
          id: generateId('msg'),
          conversationId,
          senderId,
          receiverId: '',
          content,
          read: false,
          createdAt: new Date().toISOString(),
        } as Message;

        set((state) => ({
          messages: [...state.messages, newMessage],
        }));

        set((state) => {
          const conversations = state.conversations.map((c) => {
            if (c.projectId === projectId) {
              return {
                ...c,
                lastMessage: newMessage,
                unreadCount: c.unreadCount + 1,
              };
            }
            return c;
          });
          return { conversations };
        });

        return newMessage;
      },

      getWalletByUserId: (userId: string) => {
        return get().wallets.find((w) => w.userId === userId);
      },

      getTransactionsByUserId: (userId: string) => {
        const wallet = get().wallets.find((w) => w.userId === userId);
        if (!wallet) return [];
        return get()
          .transactions.filter((t) => t.walletId === wallet.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      deposit: (userId: string, amount: number, description: string) => {
        const wallet = get().wallets.find((w) => w.userId === userId);
        if (!wallet) {
          throw new Error('钱包不存在');
        }

        const newTransaction = {
          id: generateId('tx'),
          walletId: wallet.id,
          type: 'deposit' as const,
          amount,
          description,
          status: 'completed' as const,
          createdAt: new Date().toISOString(),
        } as Transaction;

        set((state) => {
          const wallets = state.wallets.map((w) => {
            if (w.userId === userId) {
              return { ...w, balance: w.balance + amount, updatedAt: new Date().toISOString() };
            }
            return w;
          });
          return {
            wallets,
            transactions: [...state.transactions, newTransaction],
          };
        });

        return newTransaction;
      },

      withdraw: (userId: string, amount: number, description: string) => {
        const wallet = get().wallets.find((w) => w.userId === userId);
        if (!wallet || wallet.balance < amount) {
          throw new Error('余额不足');
        }

        const newTransaction = {
          id: generateId('tx'),
          walletId: wallet.id,
          type: 'withdraw' as const,
          amount,
          description,
          status: 'completed' as const,
          createdAt: new Date().toISOString(),
        } as Transaction;

        set((state) => {
          const wallets = state.wallets.map((w) => {
            if (w.userId === userId) {
              return { ...w, balance: w.balance - amount, updatedAt: new Date().toISOString() };
            }
            return w;
          });
          return {
            wallets,
            transactions: [...state.transactions, newTransaction],
          };
        });

        return newTransaction;
      },

      createSettlement: (projectId: string) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) {
          throw new Error('项目不存在');
        }

        const platformFee = project.budget * 0.1;
        const newSettlement: Settlement = {
          id: generateId('set'),
          projectId,
          totalAmount: project.budget,
          platformFee,
          finalAmount: project.budget - platformFee,
          status: 'pending',
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          settlements: [...state.settlements, newSettlement],
        }));

        return newSettlement;
      },

      getSettlementsByCreatorId: (creatorId: string) => {
        const creatorProjects = get().projects.filter((p) => p.creatorId === creatorId);
        const projectIds = creatorProjects.map((p) => p.id);
        return get().settlements.filter((s) => projectIds.includes(s.projectId));
      },

      getSettlementsByBrandId: (brandId: string) => {
        const brandProjects = get().projects.filter((p) => p.brandId === brandId);
        const projectIds = brandProjects.map((p) => p.id);
        return get().settlements.filter((s) => projectIds.includes(s.projectId));
      },

      approveSettlement: (settlementId: string) => {
        set((state) => {
          const settlements = state.settlements.map((s) => {
            if (s.id === settlementId) {
              return { ...s, status: 'approved' as const, approvedAt: new Date().toISOString() };
            }
            return s;
          });
          return { settlements };
        });
      },

      generateReport: (projectId: string) => {
        const project = get().projects.find((p) => p.id === projectId);
        if (!project) {
          throw new Error('项目不存在');
        }

        const report: PerformanceReport = {
          id: generateId('rep'),
          projectId,
          projectName: project.title,
          views: Math.floor(Math.random() * 50000) + 10000,
          engagementRate: Math.random() * 5 + 1,
          likes: Math.floor(Math.random() * 5000) + 500,
          comments: Math.floor(Math.random() * 500) + 50,
          shares: Math.floor(Math.random() * 200) + 20,
          targetViews: 30000,
          targetEngagementRate: 3,
          overallScore: Math.floor(Math.random() * 30) + 70,
          summary: '项目整体表现良好，达到预期目标。',
          generatedAt: new Date().toISOString(),
        };

        set((state) => ({
          performanceReports: [...state.performanceReports, report],
        }));

        return report;
      },

      getReportsByProjectId: (projectId: string) => {
        return get().performanceReports.filter((r) => r.projectId === projectId);
      },

      listings: [
        {
          id: 'l-1',
          creatorId: 'c1',
          title: '美食博主探店合作',
          description: '专业美食博主，专注探店测评内容创作，粉丝覆盖全国一二线城市，适合餐饮品牌、食品品牌合作。',
          coverImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop',
          packages: [
            { id: 'p-1', name: '标准探店', type: 'mention', description: '包含1条探店视频，口播介绍品牌', price: 15000, deliveryDays: 7, deliverables: ['1条60秒探店视频', '品牌口播介绍', '视频置顶评论链接'], recommended: true },
            { id: 'p-2', name: '深度合作', type: 'collab', description: '包含2条视频+1篇图文，全方位品牌展示', price: 35000, deliveryDays: 14, deliverables: ['2条探店视频', '1篇图文笔记', '品牌深度植入', '专属优惠码'] },
          ],
          status: 'published',
          createdAt: '2024-01-15T10:00:00Z',
          views: 12500,
          favorites: 186,
        },
        {
          id: 'l-2',
          creatorId: 'c1',
          title: '品牌定制内容合作',
          description: '根据品牌需求量身定制内容，结合产品特点创作有趣有料的视频内容。',
          coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
          packages: [
            { id: 'p-3', name: '单条定制', type: 'custom', description: '单条品牌定制视频', price: 25000, deliveryDays: 10, deliverables: ['1条品牌定制视频', '脚本创意策划', '视频拍摄剪辑'] },
          ],
          status: 'draft',
          createdAt: '2024-02-01T08:00:00Z',
          views: 0,
          favorites: 0,
        },
      ],
      currentCreatorId: 'c1',
      currentBrandId: 'b1',

      getCreatorByUserId: (userId: string) => {
        return creators.find((c) => c.userId === userId);
      },

      getBrandByUserId: (userId: string) => {
        return brands.find((b) => b.userId === userId);
      },

      setCurrentUser: (userId: string, role?: 'creator' | 'brand') => {
        if (role === 'creator' || !role) {
          const creator = creators.find((c) => c.userId === userId);
          if (creator) {
            set({ currentCreatorId: creator.id });
          }
        }
        if (role === 'brand' || !role) {
          const brand = brands.find((b) => b.userId === userId);
          if (brand) {
            set({ currentBrandId: brand.id });
          }
        }
      },

      fetchListings: async (creatorId?: string) => {
        const targetCreatorId = creatorId || get().currentCreatorId;
        const allListings = get().listings;
        const filtered = allListings.filter((l) => l.creatorId === targetCreatorId);
        set({ listings: filtered });
      },

      createListing: async (input, status = 'published', userId) => {
        let creatorId = get().currentCreatorId;
        if (userId) {
          const creator = creators.find((c) => c.userId === userId);
          if (creator) {
            creatorId = creator.id;
          }
        }
        const newListing = {
          id: generateId('l'),
          creatorId,
          title: input.title,
          description: input.description,
          coverImage: input.coverImage,
          packages: input.packages.map((p) => ({
            ...p,
            id: p.id && !p.id.startsWith('new-') ? p.id : generateId('p'),
          })) as unknown as ListingPackage[],
          status,
          createdAt: new Date().toISOString(),
          views: 0,
          favorites: 0,
        } as ListingWithStats;
        set((state) => ({ listings: [newListing, ...state.listings] }));
        return newListing;
      },

      updateListing: async (id, updates) => {
        const listing = get().listings.find((l) => l.id === id);
        if (!listing) return null;

        const updatedListing = {
          ...listing,
          ...(updates.title !== undefined ? { title: updates.title } : {}),
          ...(updates.description !== undefined ? { description: updates.description } : {}),
          ...(updates.coverImage !== undefined ? { coverImage: updates.coverImage } : {}),
          ...(updates.packages !== undefined
            ? {
                packages: updates.packages.map((p) => ({
                  ...p,
                  id: p.id && !p.id.startsWith('new-') ? p.id : generateId('p'),
                })) as unknown as ListingPackage[],
              }
            : {}),
          ...(updates.status !== undefined ? { status: updates.status } : {}),
        } as ListingWithStats;

        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? updatedListing : l)),
        }));

        return updatedListing;
      },

      deleteListing: async (id) => {
        const exists = get().listings.some((l) => l.id === id);
        if (!exists) return false;
        set((state) => ({ listings: state.listings.filter((l) => l.id !== id) }));
        return true;
      },

      publishListing: async (id) => {
        const listing = get().listings.find((l) => l.id === id);
        if (!listing) return false;
        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? { ...l, status: 'published' } : l)),
        }));
        return true;
      },

      archiveListing: async (id) => {
        const listing = get().listings.find((l) => l.id === id);
        if (!listing) return false;
        set((state) => ({
          listings: state.listings.map((l) => (l.id === id ? { ...l, status: 'archived' } : l)),
        }));
        return true;
      },

      getListingById: (id) => {
        return get().listings.find((l) => l.id === id);
      },

      getMinPriceByCreatorId: (creatorId) => {
        const creatorListings = get().listings.filter(
          (l) => l.creatorId === creatorId && l.status === 'published'
        );
        const allPrices = creatorListings.flatMap((l) => l.packages.map((p) => p.price));
        if (allPrices.length === 0) return 0;
        return Math.min(...allPrices);
      },

      saveFormDraft: (id, data) => {
        try {
          const drafts = JSON.parse(localStorage.getItem('listing_form_drafts') || '{}');
          drafts[id] = data;
          localStorage.setItem('listing_form_drafts', JSON.stringify(drafts));
        } catch (e) {
          console.error('Failed to save form draft:', e);
        }
      },

      getFormDraft: (id) => {
        try {
          const drafts = JSON.parse(localStorage.getItem('listing_form_drafts') || '{}');
          return drafts[id] || null;
        } catch (e) {
          console.error('Failed to get form draft:', e);
          return null;
        }
      },

      clearFormDraft: (id) => {
        try {
          const drafts = JSON.parse(localStorage.getItem('listing_form_drafts') || '{}');
          delete drafts[id];
          localStorage.setItem('listing_form_drafts', JSON.stringify(drafts));
        } catch (e) {
          console.error('Failed to clear form draft:', e);
        }
      },
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        projects: state.projects,
        messages: state.messages,
        conversations: state.conversations,
        wallets: state.wallets,
        transactions: state.transactions,
        settlements: state.settlements,
        performanceReports: state.performanceReports,
        listings: state.listings,
        currentCreatorId: state.currentCreatorId,
        currentBrandId: state.currentBrandId,
      }),
    }
  )
);
