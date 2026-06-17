import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Building2,
  TrendingUp,
  Users,
  Award,
  Github,
  Chrome,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/services/mockData';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

const statCards = [
  {
    icon: Users,
    value: '12,000+',
    label: '入驻创作者',
    gradient: 'from-cyan-500/30 to-blue-500/30',
  },
  {
    icon: Building2,
    value: '3,500+',
    label: '合作品牌方',
    gradient: 'from-purple-500/30 to-pink-500/30',
  },
  {
    icon: TrendingUp,
    value: '¥8.6亿',
    label: '累计成交金额',
    gradient: 'from-amber-500/30 to-orange-500/30',
  },
];

const valuePropositions = [
  '精准匹配品牌与创作者，高效促成商务合作',
  '全流程项目管理，从签约到交付一站式服务',
  '透明安全的资金托管，保障双方权益',
];

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [activeRole, setActiveRole] = useState<UserRole>('creator');
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
    mode: 'onTouched',
  });

  const onSubmit = async () => {
    try {
      await login(activeRole);
      navigate('/dashboard');
    } catch {
      console.error('Login failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-texture-grid opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold-lg">
                <Award className="w-6 h-6 text-primary-900" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">合桥</h1>
                <p className="text-sm text-primary-200">Brand × Creator Bridge</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-4xl xl:text-5xl font-display font-bold text-white leading-tight">
                让优质内容
                <br />
                <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">
                  遇见卓越品牌
                </span>
              </h2>
              <p className="mt-4 text-lg text-primary-200 leading-relaxed max-w-md">
                连接创作者与品牌的专业商务合作平台，为每一次合作创造更大价值。
              </p>
            </div>

            <ul className="space-y-4">
              {valuePropositions.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3 text-primary-100"
                >
                  <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                  <span className="text-base">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="grid grid-cols-3 gap-4"
          >
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ y: 20, opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.5, type: 'spring' }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  'relative rounded-2xl p-5 backdrop-blur-sm',
                  'bg-white/5 border border-white/10',
                )}
              >
                <div
                  className={cn(
                    'absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50',
                    card.gradient,
                  )}
                />
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                    <card.icon className="w-5 h-5 text-gold-300" />
                  </div>
                  <p className="text-2xl font-display font-bold text-white">
                    {card.value}
                  </p>
                  <p className="text-sm text-primary-200 mt-1">{card.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-gold">
                <Award className="w-5 h-5 text-primary-900" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-primary-900">合桥</h1>
                <p className="text-xs text-neutral-500">Brand × Creator Bridge</p>
              </div>
            </div>

            <h2 className="text-3xl font-display font-bold text-primary-900">
              欢迎回来
            </h2>
            <p className="mt-2 text-neutral-500">
              登录您的账户，开启商务合作之旅
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-8"
          >
            <Tabs
              defaultValue="creator"
              onValueChange={(v) => setActiveRole(v as UserRole)}
            >
              <TabList>
                <Tab
                  value="creator"
                  icon={<User className="w-4 h-4" />}
                >
                  创作方登录
                </Tab>
                <Tab
                  value="brand"
                  icon={<Building2 className="w-4 h-4" />}
                >
                  品牌方登录
                </Tab>
              </TabList>

              <AnimatePresence mode="wait">
                <TabPanel value="creator">
                  <LoginFormContent
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    role="creator"
                  />
                </TabPanel>
                <TabPanel value="brand">
                  <LoginFormContent
                    register={register}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                    role="brand"
                  />
                </TabPanel>
              </AnimatePresence>
            </Tabs>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8"
          >
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-neutral-50 text-neutral-400">
                  或使用第三方账号登录
                </span>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Chrome className="w-4 h-4" />
                <span className="text-sm font-medium">Google</span>
              </motion.button>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 h-11 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:border-primary-300 hover:bg-primary-50 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm font-medium">GitHub</span>
              </motion.button>
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 text-center text-sm text-neutral-500"
          >
            还没有账号？
            <Link
              to="/register"
              className="ml-1 text-primary-600 font-medium hover:text-primary-700 inline-flex items-center gap-1 group"
            >
              立即注册
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}

interface LoginFormContentProps {
  register: ReturnType<typeof useForm<LoginFormData>>['register'];
  errors: ReturnType<typeof useForm<LoginFormData>>['formState']['errors'];
  handleSubmit: ReturnType<typeof useForm<LoginFormData>>['handleSubmit'];
  showPassword: boolean;
  setShowPassword: (v: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
  role: UserRole;
}

function LoginFormContent({
  register,
  errors,
  handleSubmit,
  showPassword,
  setShowPassword,
  onSubmit,
  isLoading,
  role,
}: LoginFormContentProps) {
  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <motion.form
      key={role}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleFormSubmit}
      className="space-y-5 pt-2"
    >
      <Input
        label="邮箱地址"
        type="email"
        size="lg"
        placeholder={role === 'creator' ? 'creator@example.com' : 'brand@example.com'}
        prefixIcon={<Mail className="w-4 h-4" />}
        error={!!errors.email}
        errorMessage={errors.email?.message}
        {...register('email', {
          required: '请输入邮箱地址',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: '请输入有效的邮箱地址',
          },
        })}
      />

      <Input
        label="登录密码"
        type={showPassword ? 'text' : 'password'}
        size="lg"
        placeholder="请输入密码"
        prefixIcon={<Lock className="w-4 h-4" />}
        suffixIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 rounded-md text-neutral-400 hover:text-primary-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        }
        error={!!errors.password}
        errorMessage={errors.password?.message}
        {...register('password', {
          required: '请输入密码',
          minLength: {
            value: 6,
            message: '密码长度至少为6位',
          },
        })}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            {...register('remember')}
            className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
          />
          <span className="text-sm text-neutral-600">记住我</span>
        </label>
        <button
          type="button"
          className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          忘记密码？
        </button>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={isLoading}
        className="w-full"
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        {isLoading ? '登录中...' : '登录'}
      </Button>
    </motion.form>
  );
}
