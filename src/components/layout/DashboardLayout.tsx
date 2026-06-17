import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Search,
  ChevronDown,
  UserCircle,
  Settings,
  LogOut,
  Menu,
  Mail,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUiStore } from '@/store/uiStore';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const { user, logout } = useAuthStore();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    { id: 1, title: '新合作邀请', desc: '悦味茶饮邀请您合作夏季新品推广', time: '5分钟前', unread: true },
    { id: 2, title: '项目进展更新', desc: '智航智能手表测评项目进入拍摄阶段', time: '1小时前', unread: true },
    { id: 3, title: '款项已到账', desc: '海底捞探店项目款项 ¥98,000 已到账', time: '昨天', unread: false },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-primary-950">
      <Sidebar />

      <motion.div
        initial={false}
        animate={{ marginLeft: sidebarCollapsed ? 72 : 256 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col min-h-screen"
      >
        <header className="sticky top-0 z-30 h-16 lg:h-20 bg-white/80 dark:bg-primary-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-white/10">
          <div className="flex items-center justify-between h-full px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
              >
                <Menu className="w-5 h-5" />
              </button>

              <motion.div
                animate={{ width: searchFocused ? 320 : 240 }}
                transition={{ duration: 0.3 }}
                className="hidden sm:block"
              >
                <div
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200',
                    searchFocused
                      ? 'border-primary-400 ring-4 ring-primary-100 dark:ring-primary-800 bg-white dark:bg-primary-800'
                      : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-primary-900/50'
                  )}
                >
                  <Search className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="搜索项目、消息..."
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className="bg-transparent text-sm text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 outline-none w-full"
                  />
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                <HelpCircle className="w-5 h-5" />
              </button>

              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger-500" />
                </button>
                <AnimatePresence>
                  {notificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-primary-900 shadow-elevated overflow-hidden"
                    >
                      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-white/10">
                        <h3 className="font-semibold text-neutral-800 dark:text-neutral-100">消息通知</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-gold-400">
                          {notifications.filter((n) => n.unread).length} 条未读
                        </span>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            className={cn(
                              'px-4 py-3 border-b border-neutral-100 dark:border-white/5 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors cursor-pointer',
                              n.unread && 'bg-primary-50/50 dark:bg-primary-800/30'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-elegant flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100">{n.title}</p>
                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 line-clamp-2">{n.desc}</p>
                                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">{n.time}</p>
                              </div>
                              {n.unread && <span className="w-2 h-2 rounded-full bg-primary-500 mt-1.5" />}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="w-full px-4 py-3 text-sm text-primary-600 dark:text-gold-400 font-medium hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                        查看全部通知
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button className="p-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors">
                <Mail className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-neutral-200 dark:bg-white/10 mx-1 hidden sm:block" />

              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-elegant flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-neutral-800 dark:text-neutral-100 leading-tight">
                      {user?.name ?? '用户'}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {user?.role === 'creator' ? '创作方' : '品牌方'}
                    </p>
                  </div>
                  <ChevronDown className={cn(
                    'w-4 h-4 text-neutral-400 hidden sm:block transition-transform duration-200',
                    userMenuOpen && 'rotate-180'
                  )} />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 rounded-2xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-primary-900 shadow-elevated overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-neutral-200 dark:border-white/10">
                        <p className="font-medium text-neutral-800 dark:text-neutral-100">{user?.name ?? '用户'}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">{user?.email}</p>
                      </div>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
                        <Settings className="w-4 h-4" />
                        <span>账户设置</span>
                      </button>
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/30 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>退出登录</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </motion.div>
    </div>
  );
}
