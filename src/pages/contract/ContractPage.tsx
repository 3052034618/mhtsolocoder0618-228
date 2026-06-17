import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  Download,
  Printer,
  Share2,
  FileText,
  User,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Circle,
  PenLine,
  Shield,
  Award,
  ChevronDown,
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/Badge"
import { Card } from "@/components/ui/Card"
import { SignaturePad } from "@/components/business/SignaturePad"
import { projects, creators, brands } from "@/services/mockData"
import type { Milestone as MilestoneMock } from "@/services/mockData"
import type { KpiTerm } from "@/types"

interface ContractData {
  contractNo: string
  projectTitle: string
  signedDate: string
  effectiveDate: string
  expireDate: string
  creator: {
    name: string
    avatar: string
    company?: string
    contact: string
    signedAt?: string
    signature?: string
  }
  brand: {
    name: string
    logo: string
    contactName: string
    contact: string
    signedAt?: string
    signature?: string
  }
  amount: number
  kpiTerms: KpiTerm[]
  milestones: MilestoneMock[]
  status: "draft" | "pending_signature" | "signed" | "terminated"
}

const getContractData = (projectId: string): ContractData | null => {
  const project = projects.find((p) => p.id === projectId)
  if (!project) return null
  const creator = creators.find((c) => c.id === project.creatorId)
  const brand = brands.find((b) => b.id === project.brandId)

  return {
    contractNo: `HT-${new Date().getFullYear()}-${projectId.toUpperCase().slice(-4)}-${String(Math.floor(Math.random() * 10000)).padStart(4, "0")}`,
    projectTitle: project.title,
    signedDate: project.signedAt || new Date().toISOString(),
    effectiveDate: project.startDate,
    expireDate: project.endDate,
    creator: {
      name: creator?.name || "创作方",
      avatar: creator?.avatar || "",
      company: creator?.name,
      contact: "138****8001",
      signedAt: project.status === "signed" || project.status === "executing" || project.status === "completed" ? new Date().toISOString() : undefined,
    },
    brand: {
      name: brand?.name || "品牌方",
      logo: brand?.logo || "",
      contactName: brand?.contactName || "",
      contact: brand?.contactPhone || "",
      signedAt: project.status === "signed" || project.status === "executing" || project.status === "completed" ? new Date().toISOString() : undefined,
    },
    amount: project.budget,
    kpiTerms: [
      { id: "k1", metric: "视频播放量", targetValue: 5000000, unit: "次", weight: 30 },
      { id: "k2", metric: "互动率（点赞+评论+转发）", targetValue: 5, unit: "%", weight: 25 },
      { id: "k3", metric: "品牌搜索指数提升", targetValue: 50, unit: "%", weight: 20 },
      { id: "k4", metric: "转化点击量", targetValue: 50000, unit: "次", weight: 15 },
      { id: "k5", metric: "内容留存率（7天）", targetValue: 35, unit: "%", weight: 10 },
    ],
    milestones: project.milestones,
    status:
      project.status === "signed" || project.status === "executing" || project.status === "completed"
        ? "signed"
        : project.status === "negotiating"
        ? "pending_signature"
        : "draft",
  }
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function ContractPage() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const [contract, setContract] = React.useState<ContractData | null>(null)
  const [showCreatorPad, setShowCreatorPad] = React.useState(false)
  const [showBrandPad, setShowBrandPad] = React.useState(false)
  const [creatorSignature, setCreatorSignature] = React.useState<string | undefined>(contract?.creator.signature)
  const [brandSignature, setBrandSignature] = React.useState<string | undefined>(contract?.brand.signature)

  React.useEffect(() => {
    if (projectId) {
      const data = getContractData(projectId)
      setContract(data)
      setCreatorSignature(data?.creator.signature)
      setBrandSignature(data?.brand.signature)
    }
  }, [projectId])

  const handleCreatorSign = (signatureData: string) => {
    setCreatorSignature(signatureData)
    setShowCreatorPad(false)
    if (contract) {
      setContract({
        ...contract,
        creator: { ...contract.creator, signature: signatureData, signedAt: new Date().toISOString() },
        status: brandSignature ? "signed" : "pending_signature",
      })
    }
  }

  const handleBrandSign = (signatureData: string) => {
    setBrandSignature(signatureData)
    setShowBrandPad(false)
    if (contract) {
      setContract({
        ...contract,
        brand: { ...contract.brand, signature: signatureData, signedAt: new Date().toISOString() },
        status: creatorSignature ? "signed" : "pending_signature",
      })
    }
  }

  if (!contract) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-500">加载中...</p>
      </div>
    )
  }

  const isFullySigned = contract.creator.signedAt && contract.brand.signedAt

  return (
    <div className="h-full flex flex-col bg-gradient-subtle overflow-hidden">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-neutral-200 flex items-center justify-between shrink-0"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-4 w-4" />} onClick={() => navigate(-1)}>
            返回
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-gold flex items-center justify-center shadow-gold">
              <FileText className="h-5 w-5 text-primary-900" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-primary-900 font-display flex items-center gap-2">
                赞助合作合同
                <Badge
                  variant={contract.status === "signed" ? "success" : contract.status === "pending_signature" ? "warning" : "default"}
                  dot
                  pulse={contract.status === "pending_signature"}
                >
                  {contract.status === "signed" ? "已签署" : contract.status === "pending_signature" ? "待签署" : contract.status === "terminated" ? "已终止" : "草稿"}
                </Badge>
              </h1>
              <p className="text-xs text-neutral-500">合同编号：{contract.contractNo}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Download className="h-4 w-4" />}>
            下载PDF
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Printer className="h-4 w-4" />}>
            打印
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Share2 className="h-4 w-4" />}>
            分享
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl mx-auto space-y-6"
        >
          <div className="flex items-center justify-center gap-16 py-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center border-2 border-primary-200">
                <User className="h-8 w-8 text-primary-500" />
              </div>
              <p className="font-medium text-primary-900">{contract.creator.name}</p>
              <Badge variant="success">创作方</Badge>
              <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                {contract.creator.signedAt ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />
                    已签署 {formatDate(contract.creator.signedAt)}
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5 text-warning-500" />
                    待签署
                  </>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.35 }}
              className="relative"
            >
              <div className="w-20 h-20 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold-lg">
                <Shield className="h-10 w-10 text-primary-900" />
              </div>
              {isFullySigned && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.5 }}
                  className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-success-500 flex items-center justify-center shadow-lg"
                >
                  <Award className="h-4 w-4 text-white" />
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-16 h-16 rounded-full bg-gold-50 flex items-center justify-center border-2 border-gold-300">
                <Building2 className="h-8 w-8 text-gold-600" />
              </div>
              <p className="font-medium text-primary-900">{contract.brand.name}</p>
              <Badge variant="primary">品牌方</Badge>
              <div className="flex items-center gap-1 text-xs text-neutral-500 mt-1">
                {contract.brand.signedAt ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-success-500" />
                    已签署 {formatDate(contract.brand.signedAt)}
                  </>
                ) : (
                  <>
                    <Clock className="h-3.5 w-3.5 text-warning-500" />
                    待签署
                  </>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-2xl shadow-elevated border border-neutral-200 overflow-hidden"
          >
            <div className="bg-gradient-elegant px-8 py-6 text-white">
              <h2 className="text-2xl font-display font-semibold text-center tracking-wide">
                赞助合作协议
              </h2>
              <p className="text-center text-white/80 text-sm mt-2">SPONSORSHIP COOPERATION AGREEMENT</p>
            </div>

            <div className="p-8 bg-texture-paper">
              <div className="space-y-8 font-body text-primary-800 leading-relaxed">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 text-neutral-500 shrink-0">合同编号：</span>
                    <span className="font-mono text-primary-900">{contract.contractNo}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 text-neutral-500 shrink-0">签订日期：</span>
                    <span className="font-mono text-primary-900">{formatDate(contract.signedDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium w-24 text-neutral-500 shrink-0">签订地点：</span>
                    <span className="font-mono text-primary-900">中华人民共和国 · 上海市</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-gold-300 pt-6 space-y-5">
                  <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-gold rounded-full" />
                    第一条 协议双方
                  </h3>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-primary-50/50 rounded-xl border border-primary-100">
                      <p className="text-xs text-primary-500 font-medium mb-2">甲方（创作方）</p>
                      <p className="font-semibold text-primary-900 mb-1">{contract.creator.name}</p>
                      <p className="text-sm text-neutral-600">联系人：{contract.creator.name}</p>
                      <p className="text-sm text-neutral-600">联系电话：{contract.creator.contact}</p>
                    </div>
                    <div className="p-4 bg-gold-50/50 rounded-xl border border-gold-200">
                      <p className="text-xs text-gold-600 font-medium mb-2">乙方（品牌方）</p>
                      <p className="font-semibold text-primary-900 mb-1">{contract.brand.name}</p>
                      <p className="text-sm text-neutral-600">联系人：{contract.brand.contactName}</p>
                      <p className="text-sm text-neutral-600">联系电话：{contract.brand.contact}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-gold-300 pt-6 space-y-3">
                  <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-gold rounded-full" />
                    第二条 合作内容
                  </h3>
                  <p className="text-sm indent-8">
                    甲方同意按照本协议约定为乙方提供内容创作及推广服务，项目名称为"
                    <span className="font-semibold text-primary-900">{contract.projectTitle}</span>
                    "。乙方应按照协议约定支付相应费用。
                  </p>
                </div>

                <div className="border-t border-dashed border-gold-300 pt-6 space-y-3">
                  <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-gold rounded-full" />
                    第三条 合同金额
                  </h3>
                  <p className="text-sm indent-8">
                    本合同总金额为：
                    <span className="font-semibold text-gold-700 text-lg mx-1">
                      {formatCurrency(contract.amount)}
                    </span>
                    （人民币大写：{["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾"][0]}元整）。
                  </p>
                </div>

                <div className="border-t border-dashed border-gold-300 pt-6 space-y-4">
                  <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-gold rounded-full" />
                    第四条 交付要求
                  </h3>
                  <p className="text-sm indent-8">
                    甲方应严格按照双方确认的创意方案和时间节点进行内容创作，并按约定渠道发布。所有交付内容需经乙方审核确认后方可正式发布。
                  </p>
                </div>

                <div className="border-t border-dashed border-gold-300 pt-6 space-y-4">
                  <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-gold rounded-full" />
                    第五条 KPI考核条款
                  </h3>
                  <p className="text-sm text-neutral-600">
                    本项目KPI考核指标及权重如下，最终结算金额将根据KPI达成比例进行调整：
                  </p>

                  <div className="overflow-hidden rounded-xl border border-neutral-200">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-primary-50">
                          <th className="px-4 py-3 text-left font-semibold text-primary-800">考核指标</th>
                          <th className="px-4 py-3 text-center font-semibold text-primary-800">目标值</th>
                          <th className="px-4 py-3 text-center font-semibold text-primary-800">权重</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contract.kpiTerms.map((kpi, index) => (
                          <motion.tr
                            key={kpi.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                            className={cn("border-t border-neutral-100", index % 2 === 0 ? "bg-white" : "bg-neutral-50/50")}
                          >
                            <td className="px-4 py-3 text-primary-900 font-medium">{kpi.metric}</td>
                            <td className="px-4 py-3 text-center text-primary-700">
                              {kpi.targetValue.toLocaleString()} {kpi.unit}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-1 rounded-md bg-gold-100 text-gold-700 font-semibold">
                                {kpi.weight}%
                              </span>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="border-t border-dashed border-gold-300 pt-6 space-y-4">
                  <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-gold rounded-full" />
                    第六条 交付节点
                  </h3>

                  <div className="relative pl-8">
                    <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-primary-300 via-gold-400 to-primary-300" />
                    {contract.milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.08 }}
                        className="relative mb-6 last:mb-0"
                      >
                        <div
                          className={cn(
                            "absolute -left-5 w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            milestone.status === "approved"
                              ? "bg-success-500 border-success-500"
                              : milestone.status === "submitted"
                              ? "bg-warning-500 border-warning-500"
                              : milestone.status === "in_progress"
                              ? "bg-primary-500 border-primary-500"
                              : milestone.status === "rejected"
                              ? "bg-danger-500 border-danger-500"
                              : "bg-white border-neutral-300"
                          )}
                        >
                          {milestone.status === "approved" && (
                            <CheckCircle2 className="h-2.5 w-2.5 text-white" />
                          )}
                          {milestone.status === "in_progress" && (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              className="w-2 h-2 rounded-full bg-white"
                            />
                          )}
                        </div>
                        <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-soft">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-primary-900">{milestone.title}</h4>
                              <p className="text-xs text-neutral-500 mt-0.5">{milestone.description}</p>
                            </div>
                            <Badge
                              variant={
                                milestone.status === "approved"
                                  ? "success"
                                  : milestone.status === "submitted"
                                  ? "warning"
                                  : milestone.status === "in_progress"
                                  ? "primary"
                                  : milestone.status === "rejected"
                                  ? "danger"
                                  : "default"
                              }
                              dot={milestone.status === "in_progress"}
                              pulse={milestone.status === "in_progress"}
                            >
                              {milestone.status === "approved"
                                ? "已完成"
                                : milestone.status === "submitted"
                                ? "已提交"
                                : milestone.status === "in_progress"
                                ? "进行中"
                                : milestone.status === "rejected"
                                ? "已驳回"
                                : "待开始"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <Calendar className="h-3.5 w-3.5" />
                            截止日期：{formatDate(milestone.dueDate)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-dashed border-gold-300 pt-6 space-y-3">
                  <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-gold rounded-full" />
                    第七条 违约条款
                  </h3>
                  <p className="text-sm indent-8">
                    任何一方违反本协议约定，应向守约方支付合同总金额20%的违约金，并赔偿守约方因此遭受的全部损失。
                    如因甲方原因导致交付延迟超过7天，乙方有权单方解除合同并要求甲方退还已收取的全部费用。
                  </p>
                </div>

                <div className="border-t border-dashed border-gold-300 pt-6 space-y-3">
                  <h3 className="text-base font-semibold text-primary-900 flex items-center gap-2">
                    <span className="w-1 h-5 bg-gradient-gold rounded-full" />
                    第八条 其他约定
                  </h3>
                  <p className="text-sm indent-8">
                    本协议一式两份，甲乙双方各执一份，具有同等法律效力。本协议自双方签字（盖章）之日起生效。
                    未尽事宜由双方友好协商解决，协商不成可向合同签订地人民法院提起诉讼。
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="grid grid-cols-2 gap-6"
          >
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                    <PenLine className="h-4 w-4 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-primary-900">创作方签署</h3>
                </div>
                {contract.creator.signedAt ? (
                  <Badge variant="success" dot>已签署</Badge>
                ) : (
                  <Badge variant="warning" dot pulse>待签署</Badge>
                )}
              </div>

              <AnimatePresence mode="wait">
                {creatorSignature ? (
                  <motion.div
                    key="signed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-3"
                  >
                    <div className="h-32 bg-neutral-50 rounded-xl border-2 border-success-200 flex items-center justify-center relative overflow-hidden">
                      <img src={creatorSignature} alt="签名" className="h-full object-contain p-4" />
                      {isFullySigned && (
                        <motion.div
                          initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
                          animate={{ opacity: 1, rotate: -6, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                          className="absolute right-4 top-4"
                        >
                          <div className="w-16 h-16 rounded-full border-4 border-red-500 flex items-center justify-center bg-red-50/50 backdrop-blur-sm">
                            <span className="text-red-600 font-bold text-xs rotate-[-6deg] text-center leading-tight">
                              合同<br/>专用章
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 text-center">
                      签署时间：{contract.creator.signedAt ? formatDate(contract.creator.signedAt) : "-"}
                    </p>
                  </motion.div>
                ) : showCreatorPad ? (
                  <motion.div
                    key="pad"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <SignaturePad
                      onConfirm={handleCreatorSign}
                      onCancel={() => setShowCreatorPad(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="unsigned"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                      <AlertCircle className="h-8 w-8 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">尚未签署此合同</p>
                    <Button
                      variant="primary"
                      leftIcon={<PenLine className="h-4 w-4" />}
                      onClick={() => setShowCreatorPad(true)}
                    >
                      立即签署
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gold-100 flex items-center justify-center">
                    <PenLine className="h-4 w-4 text-gold-700" />
                  </div>
                  <h3 className="font-semibold text-primary-900">品牌方签署</h3>
                </div>
                {contract.brand.signedAt ? (
                  <Badge variant="success" dot>已签署</Badge>
                ) : (
                  <Badge variant="warning" dot pulse>待签署</Badge>
                )}
              </div>

              <AnimatePresence mode="wait">
                {brandSignature ? (
                  <motion.div
                    key="signed"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="space-y-3"
                  >
                    <div className="h-32 bg-neutral-50 rounded-xl border-2 border-success-200 flex items-center justify-center relative overflow-hidden">
                      <img src={brandSignature} alt="签名" className="h-full object-contain p-4" />
                      {isFullySigned && (
                        <motion.div
                          initial={{ opacity: 0, rotate: 10, scale: 0.8 }}
                          animate={{ opacity: 1, rotate: 6, scale: 1 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                          className="absolute left-4 top-4"
                        >
                          <div className="w-16 h-16 rounded-full border-4 border-primary-600 flex items-center justify-center bg-primary-50/50 backdrop-blur-sm">
                            <span className="text-primary-700 font-bold text-xs rotate-[6deg] text-center leading-tight">
                              公司<br/>公章
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 text-center">
                      签署时间：{contract.brand.signedAt ? formatDate(contract.brand.signedAt) : "-"}
                    </p>
                  </motion.div>
                ) : showBrandPad ? (
                  <motion.div
                    key="pad"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <SignaturePad
                      onConfirm={handleBrandSign}
                      onCancel={() => setShowBrandPad(false)}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="unsigned"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-6"
                  >
                    <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-3">
                      <AlertCircle className="h-8 w-8 text-neutral-400" />
                    </div>
                    <p className="text-sm text-neutral-500 mb-4">等待品牌方签署</p>
                    <Button
                      variant="gold"
                      leftIcon={<PenLine className="h-4 w-4" />}
                      onClick={() => setShowBrandPad(true)}
                    >
                      立即签署
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>

          {isFullySigned && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.9 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-success-50 via-white to-gold-50 border border-success-200 flex items-center justify-center gap-4"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                className="w-12 h-12 rounded-full bg-success-500 flex items-center justify-center shadow-lg shadow-success-500/30"
              >
                <CheckCircle2 className="h-6 w-6 text-white" />
              </motion.div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-success-800">合同已正式生效</h3>
                <p className="text-sm text-neutral-600 mt-0.5">
                  双方均已完成签署，本合同自 {formatDate(contract.signedDate)} 起生效
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
