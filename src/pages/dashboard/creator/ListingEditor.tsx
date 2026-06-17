import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Eye,
  Upload,
  Plus,
  X,
  CheckCircle2,
  Info,
  Image as ImageIcon,
  Users,
  Package as PackageIcon,
  Briefcase,
  ChevronRight,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/format';
import { listingTypeNames, type ListingType } from '@/services/mockData';

type StepKey = 'basic' | 'audience' | 'packages' | 'cases' | 'preview';

interface WizardStep {
  key: StepKey;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const wizardSteps: WizardStep[] = [
  { key: 'basic', title: '基本信息', description: '设置招募页标题和封面', icon: Info },
  { key: 'audience', title: '受众数据', description: '展示您的粉丝画像', icon: Users },
  { key: 'packages', title: '赞助套餐', description: '配置合作套餐和价格', icon: PackageIcon },
  { key: 'cases', title: '合作案例', description: '添加过往成功案例', icon: Briefcase },
  { key: 'preview', title: '预览发布', description: '预览并发布招募页', icon: Eye },
];

interface PackageFormData {
  id: string;
  type: ListingType;
  name: string;
  description: string;
  price: number;
  deliveryDays: number;
  includes: string[];
  recommended?: boolean;
}

interface CaseFormData {
  id: string;
  brandName: string;
  projectName: string;
  description: string;
  thumbnail: string;
  views: number;
  engagementRate: number;
}

interface ListingFormData {
  title: string;
  description: string;
  coverImage: string;
  packages: PackageFormData[];
  cases: CaseFormData[];
}

export default function ListingEditor() {
  const [currentStep, setCurrentStep] = useState<StepKey>('basic');
  const [formData, setFormData] = useState<ListingFormData>({
    title: '',
    description: '',
    coverImage: '',
    packages: [
      {
        id: 'new-1',
        type: 'mention',
        name: '',
        description: '',
        price: 0,
        deliveryDays: 7,
        includes: [],
      },
    ],
    cases: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newInclude, setNewInclude] = useState('');
  const [activePackageId, setActivePackageId] = useState<string>('new-1');

  const currentStepIndex = wizardSteps.findIndex((s) => s.key === currentStep);
  const progressPercent = ((currentStepIndex + 1) / wizardSteps.length) * 100;

  const validateStep = (step: StepKey): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'basic':
        if (!formData.title.trim()) newErrors.title = '请输入招募页标题';
        if (!formData.description.trim()) newErrors.description = '请输入招募页描述';
        if (formData.description.length < 50) newErrors.description = '描述至少需要50个字符';
        break;
      case 'packages':
        if (formData.packages.length === 0) newErrors.packages = '请至少添加一个套餐';
        formData.packages.forEach((pkg, index) => {
          if (!pkg.name.trim()) newErrors[`package-${index}-name`] = '请输入套餐名称';
          if (pkg.price <= 0) newErrors[`package-${index}-price`] = '请输入有效价格';
        });
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;
    if (currentStepIndex < wizardSteps.length - 1) {
      setCurrentStep(wizardSteps[currentStepIndex + 1].key);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(wizardSteps[currentStepIndex - 1].key);
    }
  };

  const handleSaveDraft = () => {
    alert('草稿已保存');
  };

  const handlePreview = () => {
    setCurrentStep('preview');
  };

  const updateFormData = (updates: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const addPackage = () => {
    const newId = `new-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      packages: [
        ...prev.packages,
        {
          id: newId,
          type: 'mention',
          name: '',
          description: '',
          price: 0,
          deliveryDays: 7,
          includes: [],
        },
      ],
    }));
    setActivePackageId(newId);
  };

  const removePackage = (id: string) => {
    if (formData.packages.length <= 1) return;
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.filter((p) => p.id !== id),
    }));
    if (activePackageId === id) {
      setActivePackageId(formData.packages[0].id === id ? formData.packages[1]?.id : formData.packages[0].id);
    }
  };

  const updatePackage = (id: string, updates: Partial<PackageFormData>) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  };

  const addInclude = (packageId: string) => {
    if (!newInclude.trim()) return;
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((p) =>
        p.id === packageId ? { ...p, includes: [...p.includes, newInclude.trim()] } : p
      ),
    }));
    setNewInclude('');
  };

  const removeInclude = (packageId: string, index: number) => {
    setFormData((prev) => ({
      ...prev,
      packages: prev.packages.map((p) =>
        p.id === packageId ? { ...p, includes: p.includes.filter((_, i) => i !== index) } : p
      ),
    }));
  };

  const addCase = () => {
    const newId = `case-${Date.now()}`;
    setFormData((prev) => ({
      ...prev,
      cases: [
        ...prev.cases,
        {
          id: newId,
          brandName: '',
          projectName: '',
          description: '',
          thumbnail: '',
          views: 0,
          engagementRate: 0,
        },
      ],
    }));
  };

  const removeCase = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      cases: prev.cases.filter((c) => c.id !== id),
    }));
  };

  const updateCase = (id: string, updates: Partial<CaseFormData>) => {
    setFormData((prev) => ({
      ...prev,
      cases: prev.cases.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const activePackage = formData.packages.find((p) => p.id === activePackageId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              返回列表
            </Button>
            <div>
              <h1 className="text-2xl font-display font-bold text-primary-900">新建招募页</h1>
              <p className="text-sm text-neutral-500 mt-0.5">完成以下步骤创建您的赞助招募页</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveDraft}>
              保存草稿
            </Button>
            <Button variant="outline" size="md" leftIcon={<Eye className="w-4 h-4" />} onClick={handlePreview}>
              预览
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <span>步骤 {currentStepIndex + 1}</span>
                  <span>/</span>
                  <span>{wizardSteps.length}</span>
                </div>
                <div className="flex-1 max-w-md mx-8">
                  <Progress value={progressPercent} variant="gold" size="sm" />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-8">
                {wizardSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = step.key === currentStep;
                  const isCompleted = index < currentStepIndex;

                  return (
                    <button
                      key={step.key}
                      onClick={() => isCompleted && setCurrentStep(step.key)}
                      className={cn(
                        'relative flex flex-col items-center p-4 rounded-xl transition-all duration-300',
                        isActive
                          ? 'bg-primary-50 border-2 border-primary-300'
                          : isCompleted
                          ? 'bg-success-50 border border-success-200 hover:bg-success-100 cursor-pointer'
                          : 'bg-neutral-50 border border-neutral-200 opacity-60'
                      )}
                    >
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors',
                          isActive
                            ? 'bg-primary-500 text-white'
                            : isCompleted
                            ? 'bg-success-500 text-white'
                            : 'bg-neutral-200 text-neutral-500'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <p
                        className={cn(
                          'text-sm font-medium',
                          isActive ? 'text-primary-700' : isCompleted ? 'text-success-700' : 'text-neutral-500'
                        )}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 text-center hidden md:block">
                        {step.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="min-h-[400px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {currentStep === 'basic' && (
                      <StepBasic
                        formData={formData}
                        updateFormData={updateFormData}
                        errors={errors}
                      />
                    )}
                    {currentStep === 'audience' && <StepAudience />}
                    {currentStep === 'packages' && (
                      <StepPackages
                        formData={formData}
                        activePackageId={activePackageId}
                        setActivePackageId={setActivePackageId}
                        addPackage={addPackage}
                        removePackage={removePackage}
                        updatePackage={updatePackage}
                        addInclude={addInclude}
                        removeInclude={removeInclude}
                        newInclude={newInclude}
                        setNewInclude={setNewInclude}
                        errors={errors}
                      />
                    )}
                    {currentStep === 'cases' && (
                      <StepCases
                        formData={formData}
                        addCase={addCase}
                        removeCase={removeCase}
                        updateCase={updateCase}
                      />
                    )}
                    {currentStep === 'preview' && <StepPreview formData={formData} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-6 mt-6 border-t border-neutral-100">
                <Button
                  variant="ghost"
                  size="md"
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                  onClick={handlePrev}
                  disabled={currentStepIndex === 0}
                >
                  上一步
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveDraft}>
                    保存草稿
                  </Button>
                  {currentStepIndex < wizardSteps.length - 1 ? (
                    <Button
                      variant="primary"
                      size="md"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                      onClick={handleNext}
                    >
                      下一步
                    </Button>
                  ) : (
                    <Button variant="gold" size="md" rightIcon={<CheckCircle2 className="w-4 h-4" />}>
                      发布招募
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

interface StepBasicProps {
  formData: ListingFormData;
  updateFormData: (updates: Partial<ListingFormData>) => void;
  errors: Record<string, string>;
}

function StepBasic({ formData, updateFormData, errors }: StepBasicProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary-900 mb-2">基本信息</h2>
          <p className="text-sm text-neutral-500">填写招募页的标题和详细描述</p>
        </div>

        <Input
          label="招募页标题"
          placeholder="例如：美食博主探店合作"
          value={formData.title}
          onChange={(e) => updateFormData({ title: e.target.value })}
          error={!!errors.title}
          errorMessage={errors.title}
        />

        <Textarea
          label="招募页描述"
          placeholder="详细介绍您的内容风格、合作优势、受众群体等..."
          value={formData.description}
          onChange={(e) => updateFormData({ description: e.target.value })}
          error={!!errors.description}
          errorMessage={errors.description}
          showCount
          maxLength={500}
          className="min-h-[160px]"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input label="合作行业（可选）" placeholder="例如：餐饮、美妆" />
          <Input label="合作平台" placeholder="例如：抖音、小红书" />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-primary-900 mb-2">封面图片</h2>
          <p className="text-sm text-neutral-500">上传一张吸引人的封面图展示您的风格</p>
        </div>

        <div
          className={cn(
            'relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer',
            formData.coverImage
              ? 'border-primary-300 bg-primary-50'
              : 'border-neutral-300 hover:border-primary-400 hover:bg-primary-50/50'
          )}
        >
          {formData.coverImage ? (
            <div className="relative">
              <img
                src={formData.coverImage}
                alt="封面预览"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => updateFormData({ coverImage: '' })}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-neutral-600 hover:text-danger-600 hover:bg-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-8">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-sm font-medium text-primary-700 mb-1">点击上传封面图片</p>
              <p className="text-xs text-neutral-500">支持 JPG、PNG 格式，建议尺寸 1200x800</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <Upload className="w-4 h-4 text-neutral-400" />
                <span className="text-sm text-neutral-500">或拖拽文件到此处</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium text-primary-800 mb-3">推荐图片</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=150&fit=crop',
              'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=200&h=150&fit=crop',
              'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=200&h=150&fit=crop',
              'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=200&h=150&fit=crop',
            ].map((url, i) => (
              <button
                key={i}
                onClick={() => updateFormData({ coverImage: url })}
                className={cn(
                  'relative aspect-video rounded-lg overflow-hidden border-2 transition-all',
                  formData.coverImage === url
                    ? 'border-primary-500 ring-2 ring-primary-200'
                    : 'border-transparent hover:border-primary-300'
                )}
              >
                <img src={url} alt={`推荐${i + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StepAudience() {
  const audienceData = {
    totalFollowers: 3860000,
    gender: { male: 32, female: 65, other: 3 },
    ageDistribution: [
      { range: '18-24', percentage: 28 },
      { range: '25-34', percentage: 42 },
      { range: '35-44', percentage: 20 },
      { range: '45+', percentage: 10 },
    ],
    topRegions: [
      { region: '广东', percentage: 18 },
      { region: '北京', percentage: 12 },
      { region: '上海', percentage: 11 },
      { region: '浙江', percentage: 9 },
      { region: '江苏', percentage: 8 },
    ],
    interests: [
      { tag: '美食探店', percentage: 85 },
      { tag: '烹饪教程', percentage: 72 },
      { tag: '生活方式', percentage: 65 },
      { tag: '旅行', percentage: 48 },
      { tag: '美妆时尚', percentage: 35 },
    ],
    avgEngagementRate: 5.8,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-primary-900 mb-2">受众数据</h2>
        <p className="text-sm text-neutral-500">以下是根据您的账号自动同步的粉丝画像数据</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary-500 to-primary-700 text-white border-0">
          <CardContent className="p-5">
            <p className="text-sm text-primary-100">累计粉丝</p>
            <p className="text-3xl font-bold mt-2">{(audienceData.totalFollowers / 10000).toFixed(1)}万</p>
            <Badge variant="gold" className="mt-3 bg-gold-400/20 text-gold-300 border-gold-400/30">
              美食垂类 TOP 100
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-neutral-500">平均互动率</p>
            <p className="text-3xl font-bold text-primary-900 mt-2">{audienceData.avgEngagementRate}%</p>
            <p className="text-xs text-success-600 mt-3">高于行业平均 68%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-neutral-500">合作案例</p>
            <p className="text-3xl font-bold text-primary-900 mt-2">86</p>
            <p className="text-xs text-neutral-500 mt-3">累计成功合作项目</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-primary-900 mb-4">性别分布</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-neutral-600">女性</span>
                  <span className="font-medium text-primary-700">{audienceData.gender.female}%</span>
                </div>
                <Progress value={audienceData.gender.female} variant="primary" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-neutral-600">男性</span>
                  <span className="font-medium text-primary-700">{audienceData.gender.male}%</span>
                </div>
                <Progress value={audienceData.gender.male} variant="gold" size="sm" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-neutral-600">其他</span>
                  <span className="font-medium text-primary-700">{audienceData.gender.other}%</span>
                </div>
                <Progress value={audienceData.gender.other} variant="success" size="sm" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-primary-900 mb-4">年龄分布</h3>
            <div className="flex items-end justify-between h-40 gap-2">
              {audienceData.ageDistribution.map((age) => (
                <div key={age.range} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex-1 flex items-end">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${age.percentage * 2}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="w-full bg-gradient-to-t from-primary-500 to-gold-400 rounded-t-lg"
                    />
                  </div>
                  <span className="text-xs text-neutral-500">{age.range}</span>
                  <span className="text-sm font-semibold text-primary-700">{age.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-primary-900 mb-4">地域分布 TOP5</h3>
            <div className="space-y-3">
              {audienceData.topRegions.map((region, index) => (
                <div key={region.region} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-semibold flex items-center justify-center">
                    {index + 1}
                  </span>
                  <span className="text-sm text-neutral-700 w-16">{region.region}</span>
                  <div className="flex-1">
                    <Progress value={region.percentage * 3} variant="primary" size="sm" />
                  </div>
                  <span className="text-sm font-medium text-primary-700 w-12 text-right">{region.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-semibold text-primary-900 mb-4">兴趣标签</h3>
            <div className="flex flex-wrap gap-2">
              {audienceData.interests.map((interest) => (
                <Badge
                  key={interest.tag}
                  variant="primary"
                  className="px-3 py-1.5 text-sm"
                >
                  {interest.tag}
                  <span className="ml-1.5 text-xs opacity-80">{interest.percentage}%</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface StepPackagesProps {
  formData: ListingFormData;
  activePackageId: string;
  setActivePackageId: (id: string) => void;
  addPackage: () => void;
  removePackage: (id: string) => void;
  updatePackage: (id: string, updates: Partial<PackageFormData>) => void;
  addInclude: (packageId: string) => void;
  removeInclude: (packageId: string, index: number) => void;
  newInclude: string;
  setNewInclude: (v: string) => void;
  errors: Record<string, string>;
}

function StepPackages({
  formData,
  activePackageId,
  setActivePackageId,
  addPackage,
  removePackage,
  updatePackage,
  addInclude,
  removeInclude,
  newInclude,
  setNewInclude,
  errors,
}: StepPackagesProps) {
  const activePackage = formData.packages.find((p) => p.id === activePackageId);
  const activeIndex = formData.packages.findIndex((p) => p.id === activePackageId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary-900 mb-2">赞助套餐</h2>
          <p className="text-sm text-neutral-500">设置不同层级的合作套餐，满足品牌方多样化需求</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addPackage}>
          添加套餐
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {formData.packages.map((pkg, index) => (
            <motion.button
              key={pkg.id}
              onClick={() => setActivePackageId(pkg.id)}
              className={cn(
                'w-full p-4 rounded-xl text-left transition-all duration-200 relative',
                activePackageId === pkg.id
                  ? 'bg-primary-50 border-2 border-primary-400'
                  : 'bg-white border border-neutral-200 hover:border-primary-300'
              )}
            >
              {pkg.recommended && (
                <Badge variant="gold" className="absolute -top-2 -right-2 text-xs">
                  推荐
                </Badge>
              )}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-500">套餐 {index + 1}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                  {listingTypeNames[pkg.type]}
                </span>
              </div>
              <p className="font-medium text-primary-900 line-clamp-1">
                {pkg.name || '未命名套餐'}
              </p>
              <p className="text-lg font-bold text-primary-600 mt-2">
                {pkg.price > 0 ? formatCurrency(pkg.price) : '待设置'}
              </p>
              {formData.packages.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removePackage(pkg.id);
                  }}
                  className="absolute top-2 right-2 p-1 rounded text-neutral-400 hover:text-danger-500 hover:bg-danger-50 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </motion.button>
          ))}

          {errors.packages && (
            <p className="text-xs text-danger-600 font-medium">{errors.packages}</p>
          )}
        </div>

        <div className="lg:col-span-3">
          {activePackage && (
            <Card>
              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-800 mb-1.5">套餐类型</label>
                    <Tabs
                      value={activePackage.type}
                      onValueChange={(v) => updatePackage(activePackage.id, { type: v as ListingType })}
                    >
                      <TabList>
                        {(Object.keys(listingTypeNames) as ListingType[]).map((type) => (
                          <Tab key={type} value={type}>
                            {listingTypeNames[type]}
                          </Tab>
                        ))}
                      </TabList>
                    </Tabs>
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={activePackage.recommended || false}
                        onChange={(e) => updatePackage(activePackage.id, { recommended: e.target.checked })}
                        className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                      />
                      <span className="text-sm text-neutral-700">设为推荐套餐</span>
                    </label>
                  </div>
                </div>

                <Input
                  label="套餐名称"
                  placeholder="例如：标准口播合作"
                  value={activePackage.name}
                  onChange={(e) => updatePackage(activePackage.id, { name: e.target.value })}
                  error={!!errors[`package-${activeIndex}-name`]}
                  errorMessage={errors[`package-${activeIndex}-name`]}
                />

                <Textarea
                  label="套餐描述"
                  placeholder="详细描述该套餐包含的服务内容..."
                  value={activePackage.description}
                  onChange={(e) => updatePackage(activePackage.id, { description: e.target.value })}
                  className="min-h-[100px]"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="合作价格（元）"
                    type="number"
                    placeholder="例如：25000"
                    value={activePackage.price || ''}
                    onChange={(e) => updatePackage(activePackage.id, { price: Number(e.target.value) })}
                    error={!!errors[`package-${activeIndex}-price`]}
                    errorMessage={errors[`package-${activeIndex}-price`]}
                  />
                  <Input
                    label="交付周期（天）"
                    type="number"
                    placeholder="例如：7"
                    value={activePackage.deliveryDays || ''}
                    onChange={(e) => updatePackage(activePackage.id, { deliveryDays: Number(e.target.value) })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-800 mb-2">包含服务</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {activePackage.includes.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-50 border border-primary-200 rounded-full text-sm text-primary-700"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {item}
                        <button
                          onClick={() => removeInclude(activePackage.id, index)}
                          className="ml-1 text-neutral-400 hover:text-danger-500 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </motion.div>
                    ))}
                    {activePackage.includes.length === 0 && (
                      <span className="text-sm text-neutral-400">暂未添加服务项</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入服务项，例如：30秒口播介绍"
                      value={newInclude}
                      onChange={(e) => setNewInclude(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addInclude(activePackage.id);
                        }
                      }}
                      className="flex-1"
                    />
                    <Button variant="outline" onClick={() => addInclude(activePackage.id)}>
                      添加
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

interface StepCasesProps {
  formData: ListingFormData;
  addCase: () => void;
  removeCase: (id: string) => void;
  updateCase: (id: string, updates: Partial<CaseFormData>) => void;
}

function StepCases({ formData, addCase, removeCase, updateCase }: StepCasesProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-primary-900 mb-2">合作案例</h2>
          <p className="text-sm text-neutral-500">展示您的过往成功案例，增强品牌方信任</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={addCase}>
          添加案例
        </Button>
      </div>

      {formData.cases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-primary-900 mb-2">还没有合作案例</h3>
            <p className="text-sm text-neutral-500 mb-6">添加成功案例可以显著提升招募页转化率</p>
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />} onClick={addCase}>
              添加第一个案例
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {formData.cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-primary-900">案例 {index + 1}</h3>
                    <button
                      onClick={() => removeCase(caseItem.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-danger-500 hover:bg-danger-50 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                    <div className="lg:col-span-1">
                      <label className="block text-sm font-medium text-primary-800 mb-2">案例封面</label>
                      <div className="aspect-video rounded-lg border-2 border-dashed border-neutral-300 flex items-center justify-center bg-neutral-50 overflow-hidden">
                        {caseItem.thumbnail ? (
                          <img src={caseItem.thumbnail} alt="案例封面" className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center p-4">
                            <ImageIcon className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
                            <p className="text-xs text-neutral-500">点击上传图片</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="lg:col-span-3 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="品牌名称"
                          placeholder="例如：海底捞"
                          value={caseItem.brandName}
                          onChange={(e) => updateCase(caseItem.id, { brandName: e.target.value })}
                        />
                        <Input
                          label="项目名称"
                          placeholder="例如：夏季新品探店"
                          value={caseItem.projectName}
                          onChange={(e) => updateCase(caseItem.id, { projectName: e.target.value })}
                        />
                      </div>

                      <Textarea
                        label="案例描述"
                        placeholder="简要描述合作内容和效果..."
                        value={caseItem.description}
                        onChange={(e) => updateCase(caseItem.id, { description: e.target.value })}
                        className="min-h-[80px]"
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="播放/浏览量"
                          type="number"
                          placeholder="例如：5000000"
                          value={caseItem.views || ''}
                          onChange={(e) => updateCase(caseItem.id, { views: Number(e.target.value) })}
                        />
                        <Input
                          label="互动率 (%)"
                          type="number"
                          placeholder="例如：8.5"
                          value={caseItem.engagementRate || ''}
                          onChange={(e) => updateCase(caseItem.id, { engagementRate: Number(e.target.value) })}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

interface StepPreviewProps {
  formData: ListingFormData;
}

function StepPreview({ formData }: StepPreviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-primary-900 mb-2">预览招募页</h2>
        <p className="text-sm text-neutral-500">以下是招募页在品牌方面前的展示效果</p>
      </div>

      <Card className="overflow-hidden max-w-4xl mx-auto">
        <div className="relative h-56 bg-gradient-to-br from-primary-100 to-gold-100 overflow-hidden">
          {formData.coverImage ? (
            <img src={formData.coverImage} alt="封面" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-16 h-16 text-neutral-300" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <h1 className="text-2xl font-bold text-white mb-2">
              {formData.title || '您的招募页标题'}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="success">已认证创作者</Badge>
              <Badge variant="gold">美食垂类 TOP 100</Badge>
            </div>
          </div>
        </div>

        <CardContent className="p-6 space-y-8">
          <section>
            <h2 className="text-lg font-semibold text-primary-900 mb-3">关于合作</h2>
            <p className="text-neutral-600 leading-relaxed">
              {formData.description || '这里将显示您填写的招募页描述，介绍您的内容风格和合作优势。'}
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-primary-900 mb-4">赞助套餐</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={cn(
                    'relative rounded-xl border-2 p-5 transition-all',
                    pkg.recommended
                      ? 'border-gold-400 bg-gold-50/30'
                      : 'border-neutral-200 bg-white'
                  )}
                >
                  {pkg.recommended && (
                    <Badge variant="gold" className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      推荐
                    </Badge>
                  )}
                  <div className="text-center mb-4">
                    <span className="text-xs px-2 py-1 rounded-full bg-primary-100 text-primary-600">
                      {listingTypeNames[pkg.type]}
                    </span>
                    <h3 className="font-semibold text-primary-900 mt-2">
                      {pkg.name || '套餐名称'}
                    </h3>
                    <div className="mt-3">
                      <span className="text-3xl font-bold text-primary-600">
                        {pkg.price > 0 ? formatCurrency(pkg.price) : '面议'}
                      </span>
                      {pkg.price > 0 && (
                        <span className="text-sm text-neutral-500 ml-1">/{pkg.deliveryDays}天</span>
                      )}
                    </div>
                  </div>
                  {pkg.includes.length > 0 && (
                    <ul className="space-y-2">
                      {pkg.includes.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-neutral-600">
                          <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button variant={pkg.recommended ? 'gold' : 'outline'} size="sm" className="w-full mt-4">
                    选择此套餐
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {formData.cases.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-primary-900 mb-4">过往合作案例</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.cases.map((caseItem) => (
                  <div key={caseItem.id} className="flex gap-4 p-4 rounded-xl border border-neutral-200">
                    <div className="w-24 h-16 rounded-lg bg-neutral-100 overflow-hidden flex-shrink-0">
                      {caseItem.thumbnail && (
                        <img src={caseItem.thumbnail} alt={caseItem.projectName} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-neutral-500">{caseItem.brandName || '品牌名称'}</p>
                      <h4 className="font-medium text-primary-900 mt-0.5">
                        {caseItem.projectName || '项目名称'}
                      </h4>
                      <div className="flex items-center gap-3 mt-2 text-xs text-neutral-500">
                        <span>浏览 {caseItem.views.toLocaleString()}</span>
                        <span>互动 {caseItem.engagementRate}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
