import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Calendar,
  Package,
  Star,
  MoreHorizontal,
  FileText,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { formatCurrency, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';
import { useAppStore, type ListingWithStats } from '@/store/appStore';
import { useAuthStore } from '@/store/authStore';

type ListingStatus = 'all' | 'published' | 'draft' | 'archived';

const statusConfig: Record<ListingWithStats['status'], { label: string; variant: 'success' | 'warning' | 'default' }> = {
  published: { label: '已发布', variant: 'success' },
  draft: { label: '草稿', variant: 'warning' },
  archived: { label: '已下架', variant: 'default' },
};

export default function Listings() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const listings = useAppStore((state) => state.listings);
  const getCreatorByUserId = useAppStore((state) => state.getCreatorByUserId);
  const deleteListing = useAppStore((state) => state.deleteListing);
  const publishListing = useAppStore((state) => state.publishListing);
  const archiveListing = useAppStore((state) => state.archiveListing);
  const createListing = useAppStore((state) => state.createListing);

  const [activeTab, setActiveTab] = useState<ListingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const currentCreator = user ? getCreatorByUserId(user.id) : undefined;

  const creatorListings = useMemo(() => {
    if (!currentCreator) return [];
    return listings.filter((l) => l.creatorId === currentCreator.id);
  }, [listings, currentCreator]);

  const filteredListings = useMemo(() => {
    return creatorListings.filter((listing) => {
      const matchesStatus = activeTab === 'all' || listing.status === activeTab;
      const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [creatorListings, activeTab, searchQuery]);

  const handleDelete = async () => {
    if (!deletingId) return;
    const success = await deleteListing(deletingId);
    if (success) {
      setDeleteModalOpen(false);
      setDeletingId(null);
    }
  };

  const handleCopy = async (listing: ListingWithStats) => {
    const newListing = await createListing(
      {
        title: `${listing.title} (副本)`,
        description: listing.description,
        coverImage: listing.coverImage,
        packages: listing.packages,
      },
      'draft',
      user?.id
    );
    setActionMenuOpen(null);
  };

  const togglePublish = async (listing: ListingWithStats) => {
    if (listing.status === 'published') {
      await archiveListing(listing.id);
    } else {
      await publishListing(listing.id);
    }
    setActionMenuOpen(null);
  };

  const getCounts = () => ({
    all: creatorListings.length,
    published: creatorListings.filter((l) => l.status === 'published').length,
    draft: creatorListings.filter((l) => l.status === 'draft').length,
    archived: creatorListings.filter((l) => l.status === 'archived').length,
  });

  const counts = getCounts();

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
            <h1 className="text-2xl font-display font-bold text-primary-900">招募页管理</h1>
            <p className="text-sm text-neutral-500 mt-1">管理您的赞助招募页面，吸引品牌方合作</p>
          </div>
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/creator/listing/new')}
          >
            新建招募
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-0">
              <div className="p-4 sm:p-6 border-b border-neutral-100">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 max-w-md">
                    <Input
                      placeholder="搜索招募页标题或描述..."
                      prefixIcon={<Search className="w-4 h-4" />}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as ListingStatus)}>
                    <TabList>
                      <Tab value="all">全部 <span className="ml-1.5 text-xs text-neutral-400">({counts.all})</span></Tab>
                      <Tab value="published">已发布 <span className="ml-1.5 text-xs text-neutral-400">({counts.published})</span></Tab>
                      <Tab value="draft">草稿 <span className="ml-1.5 text-xs text-neutral-400">({counts.draft})</span></Tab>
                      <Tab value="archived">已下架 <span className="ml-1.5 text-xs text-neutral-400">({counts.archived})</span></Tab>
                    </TabList>
                  </Tabs>
                </div>
              </div>

              <TabPanel value="all" className="p-0">
                <ListingsGrid
                  listings={filteredListings}
                  loading={loading}
                  actionMenuOpen={actionMenuOpen}
                  setActionMenuOpen={setActionMenuOpen}
                  onEdit={(listing) => navigate(`/dashboard/creator/listing/${listing.id}`)}
                  onDelete={(id) => { setDeletingId(id); setDeleteModalOpen(true); setActionMenuOpen(null); }}
                  onCopy={handleCopy}
                  onTogglePublish={togglePublish}
                />
              </TabPanel>
              <TabPanel value="published" className="p-0">
                <ListingsGrid
                  listings={filteredListings}
                  loading={loading}
                  actionMenuOpen={actionMenuOpen}
                  setActionMenuOpen={setActionMenuOpen}
                  onEdit={(listing) => navigate(`/dashboard/creator/listing/${listing.id}`)}
                  onDelete={(id) => { setDeletingId(id); setDeleteModalOpen(true); setActionMenuOpen(null); }}
                  onCopy={handleCopy}
                  onTogglePublish={togglePublish}
                />
              </TabPanel>
              <TabPanel value="draft" className="p-0">
                <ListingsGrid
                  listings={filteredListings}
                  loading={loading}
                  actionMenuOpen={actionMenuOpen}
                  setActionMenuOpen={setActionMenuOpen}
                  onEdit={(listing) => navigate(`/dashboard/creator/listing/${listing.id}`)}
                  onDelete={(id) => { setDeletingId(id); setDeleteModalOpen(true); setActionMenuOpen(null); }}
                  onCopy={handleCopy}
                  onTogglePublish={togglePublish}
                />
              </TabPanel>
              <TabPanel value="archived" className="p-0">
                <ListingsGrid
                  listings={filteredListings}
                  loading={loading}
                  actionMenuOpen={actionMenuOpen}
                  setActionMenuOpen={setActionMenuOpen}
                  onEdit={(listing) => navigate(`/dashboard/creator/listing/${listing.id}`)}
                  onDelete={(id) => { setDeletingId(id); setDeleteModalOpen(true); setActionMenuOpen(null); }}
                  onCopy={handleCopy}
                  onTogglePublish={togglePublish}
                />
              </TabPanel>
            </CardContent>
          </Card>
        </motion.div>

        <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} size="sm">
          <ModalHeader
            title="确认删除"
            description="删除后将无法恢复，确定要删除这个招募页吗？"
          />
          <ModalBody>
            <p className="text-sm text-neutral-500">此操作将永久删除该招募页及其所有配置。</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>取消</Button>
            <Button variant="danger" onClick={handleDelete}>确认删除</Button>
          </ModalFooter>
        </Modal>
      </div>
    </DashboardLayout>
  );
}

interface ListingsGridProps {
  listings: ListingWithStats[];
  loading: boolean;
  actionMenuOpen: string | null;
  setActionMenuOpen: (id: string | null) => void;
  onEdit: (listing: ListingWithStats) => void;
  onDelete: (id: string) => void;
  onCopy: (listing: ListingWithStats) => void;
  onTogglePublish: (listing: ListingWithStats) => void;
}

function ListingsGrid({
  listings,
  loading,
  actionMenuOpen,
  setActionMenuOpen,
  onEdit,
  onDelete,
  onCopy,
  onTogglePublish,
}: ListingsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 sm:p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 bg-neutral-200 rounded-t-xl" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
              <div className="h-3 bg-neutral-100 rounded w-1/2" />
              <div className="flex gap-2">
                <div className="h-6 bg-neutral-100 rounded w-16" />
                <div className="h-6 bg-neutral-100 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-neutral-400" />
        </div>
        <h3 className="text-lg font-semibold text-primary-900 mb-2">暂无招募页</h3>
        <p className="text-sm text-neutral-500 mb-6">创建您的第一个招募页，开始吸引品牌合作</p>
        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => { window.location.href = '/dashboard/creator/listing/new'; }}>
          新建招募
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4 sm:p-6">
      <AnimatePresence>
        {listings.map((listing, index) => (
          <motion.div
            key={listing.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -4 }}
            className="group relative rounded-xl bg-white border border-neutral-200 overflow-hidden hover:border-gold-300 hover:shadow-lg hover:shadow-gold-500/5 transition-all duration-300"
          >
            <div className="relative h-40 bg-gradient-to-br from-primary-100 to-gold-100 overflow-hidden">
              <img
                src={listing.coverImage}
                alt={listing.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop`;
                }}
              />
              <div className="absolute top-3 left-3">
                <Badge variant={statusConfig[listing.status].variant}>
                  {statusConfig[listing.status].label}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                <div className="relative">
                  <button
                    onClick={() => setActionMenuOpen(actionMenuOpen === listing.id ? null : listing.id)}
                    className="p-2 rounded-lg bg-white/90 backdrop-blur-sm text-neutral-600 hover:text-primary-600 hover:bg-white transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                  <AnimatePresence>
                    {actionMenuOpen === listing.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-36 rounded-xl bg-white border border-neutral-200 shadow-elevated overflow-hidden z-10"
                      >
                        <button
                          onClick={() => onEdit(listing)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                          编辑
                        </button>
                        <button
                          onClick={() => onTogglePublish(listing)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          {listing.status === 'published' ? (
                            <><EyeOff className="w-4 h-4" />下架</>
                          ) : (
                            <><Eye className="w-4 h-4" />上架</>
                          )}
                        </button>
                        <button
                          onClick={() => onCopy(listing)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                          复制
                        </button>
                        <button
                          onClick={() => onDelete(listing.id)}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-base text-primary-900 line-clamp-1">
                {listing.title}
              </h3>
              <p className="text-sm text-neutral-500 mt-1 line-clamp-2">
                {listing.description}
              </p>

              <div className="flex items-center gap-4 mt-4 text-xs text-neutral-500">
                <div className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  <span>{listing.packages.length} 个套餐</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>{listing.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5" />
                  <span>{listing.favorites}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-1 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatDate(listing.createdAt, 'YYYY-MM-DD')}</span>
                </div>
                <div className="text-lg font-bold text-primary-600">
                  {listing.packages.length > 0
                    ? formatCurrency(Math.min(...listing.packages.map((p) => p.price)))
                    : '面议'}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  leftIcon={<Edit2 className="w-4 h-4" />}
                  onClick={() => onEdit(listing)}
                >
                  编辑
                </Button>
                <Button
                  variant={listing.status === 'published' ? 'ghost' : 'primary'}
                  size="sm"
                  className="flex-1"
                  leftIcon={listing.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  onClick={() => onTogglePublish(listing)}
                >
                  {listing.status === 'published' ? '下架' : '上架'}
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
