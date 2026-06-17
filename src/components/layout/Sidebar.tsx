import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  ClipboardList,
  Handshake,
  FileText,
  Wallet,
  BarChart3,
  FolderKanban,
  Eye,
  CheckCircle2,
  Building2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LogOut,
  User,
  Settings,
  UserCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/services/mockData';

const creatorMenu = [
  { icon: LayoutDashboard, label: '工作台', href: '/dashboard' },
  { icon: ClipboardList, label: '招募管理', href: '/dashboard/recruitments' },
  { icon: Handshake, label: '合作订单', href: '/dashboard/orders' },
  { icon: FileText, label: '内容交付', href: '/dashboard/deliveries' },
  { icon: Wallet, label: '财务中心', href: '/dashboard/finance' },
  { icon: BarChart3, label: '数据中心', href: '/dashboard/analytics' },
];

const brandMenu = [
  { icon: LayoutDashboard, label: '工作台', href: '/dashboard' },
  { icon: FolderKanban, label: '合作项目', href: '/dashboard/projects' },
  { icon: Eye, label: '内容审核', href: '/dashboard/review' },
  { icon: CheckCircle2, label: 'KPI履约', href: '/dashboard/kpi' },
  { icon: Wallet, label: '资金管理', href: '/dashboard/funds' },
  { icon: Building2, label: '供应商库', href: '/dashboard/suppliers' },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();
  const [activeItem, setActiveItem] = useState('/dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentRole: UserRole = user?.role ?? 'creator';
  const menuItems = currentRole === 'creator' ? creatorMenu : brandMenu;

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 256 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={cn(
        'fixed left-0 top-0 h-screen z-40 flex flex-col bg-white dark:bg-primary-900 border-r border-neutral-200 dark:border-white/10 shadow-soft'
      )}
    >
      <div className={cn(
        'flex items-center h-16 lg:h-20 px-4 border-b border-neutral-200 dark:border-white/10',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <div className={cn(
          'flex items-center gap-2 overflow-hidden',
          sidebarCollapsed && 'justify-center w-full'
        )}>
          <div className="w-9 h-9 rounded-xl bg-gradient-elegant flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-lg font-display font-bold bg-gradient-to-r from-gold-500 via-primary-500 to-gold-600 bg-clip-text text-transparent whitespace-nowrap"
              >
                Spark赞助
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeItem === item.href;

          return (
            <motion.button
              key={item.href}
              onClick={() => setActiveItem(item.href)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className={cn(
                'relative w-full flex items-center gap-3 px-3 py-3 rounded-xl group transition-all duration-200',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-800/50 text-primary-600 dark:text-gold-400'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-gold-400',
                sidebarCollapsed ? 'justify-center' : ''
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebarActiveIndicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-gradient-to-b from-gold-500 to-primary-500"
                  style={{ left: sidebarCollapsed ? 0 : 0 }}
                />
              )}
              <Icon className={cn(
                'w-5 h-5 flex-shrink-0 transition-transform duration-200',
                isActive ? 'scale-110' : 'group-hover:scale-105'
              )} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      <div className="border-t border-neutral-200 dark:border-white/10 p-3">
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={cn(
              'w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-neutral-50 dark:hover:bg-white/5',
              sidebarCollapsed ? 'justify-center' : ''
            )}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-elegant flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-5 h-5 text-white" />
              )}
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                  className="flex-1 text-left min-w-0"
                >
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 truncate">
                    {user?.name ?? '用户'}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {currentRole === 'creator' ? '创作方' : '品牌方'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          <AnimatePresence>
            {showUserMenu && !sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full left-0 right-0 mb-2 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-primary-800 shadow-elevated overflow-hidden"
              >
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors duration-150">
                  <Settings className="w-4 h-4" />
                  <span>设置</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 transition-colors duration-150"
                >
                  <LogOut className="w-4 h-4" />
                  <span>退出登录</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={toggleSidebar}
          className={cn(
            'mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-all duration-200',
            sidebarCollapsed ? '' : ''
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">收起</span>
            </>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
