import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  Bell,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/services/mockData';

const navLinks = [
  { label: '赞助市场', href: '/marketplace' },
  { label: '热门创作者', href: '/creators' },
  { label: '合作案例', href: '/cases' },
  { label: '关于我们', href: '/about' },
];

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'creator', label: '创作方' },
  { value: 'brand', label: '品牌方' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const roleDropdownRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, switchRole, login } = useAuthStore();
  const currentRole = user?.role ?? 'creator';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target as Node)) {
        setRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSwitch = async (role: UserRole) => {
    if (isAuthenticated) {
      await switchRole(role);
    } else {
      await login(role);
    }
    setRoleDropdownOpen(false);
  };

  const currentRoleLabel = roleOptions.find((r) => r.value === currentRole)?.label ?? '创作方';

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white/70 dark:bg-primary-900/70 backdrop-blur-xl shadow-soft border-b border-neutral-200/50 dark:border-white/10'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-elegant flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-display font-bold bg-gradient-to-r from-gold-500 via-primary-500 to-gold-600 bg-clip-text text-transparent">
                Spark赞助平台
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="relative px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-gold-400 transition-colors duration-200 rounded-lg hover:bg-neutral-100/50 dark:hover:bg-white/5"
              >
                {link.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <motion.div
              className="hidden md:flex items-center"
              animate={{ width: searchFocused ? 280 : 200 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={cn(
                  'relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200',
                  searchFocused
                    ? 'border-primary-400 ring-4 ring-primary-100 dark:ring-primary-800 bg-white dark:bg-primary-800'
                    : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-primary-900/50'
                )}
              >
                <Search className="w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="搜索创作者、品牌..."
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  className="bg-transparent text-sm text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 outline-none w-full"
                />
              </div>
            </motion.div>

            <div className="hidden sm:flex items-center gap-2">
              <button className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary-600 dark:hover:text-gold-400 transition-colors duration-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-white/5">
                登录
              </button>
              <button className="px-5 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg shadow-soft hover:shadow-card transition-all duration-200 hover:scale-[1.02]">
                注册
              </button>
            </div>

            <div className="hidden sm:block relative" ref={roleDropdownRef}>
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200"
              >
                <span>{currentRoleLabel}</span>
                <motion.div
                  animate={{ rotate: roleDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="w-4 h-4"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </button>
              <AnimatePresence>
                {roleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-36 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-primary-900 shadow-card overflow-hidden"
                  >
                    {roleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleRoleSwitch(option.value)}
                        className={cn(
                          'w-full px-4 py-2.5 text-sm text-left transition-colors duration-150',
                          currentRole === option.value
                            ? 'bg-primary-50 dark:bg-primary-800 text-primary-600 dark:text-gold-400'
                            : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-primary-800'
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              className="lg:hidden p-2 rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-white dark:bg-primary-900 border-t border-neutral-200 dark:border-white/10"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-sm font-medium text-neutral-700 dark:text-neutral-200 rounded-lg hover:bg-neutral-50 dark:hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-neutral-200 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-2 px-4 py-3">
                  <Search className="w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="搜索创作者、品牌..."
                    className="bg-transparent text-sm text-neutral-700 dark:text-neutral-200 placeholder:text-neutral-400 outline-none flex-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    登录
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-primary rounded-lg">
                    注册
                  </button>
                </div>
                <div className="flex gap-2">
                  {roleOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleRoleSwitch(option.value)}
                      className={cn(
                        'flex-1 px-4 py-2 text-sm font-medium rounded-lg border transition-colors duration-150',
                        currentRole === option.value
                          ? 'bg-primary-50 dark:bg-primary-800 border-primary-300 dark:border-primary-600 text-primary-600 dark:text-gold-400'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200'
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
