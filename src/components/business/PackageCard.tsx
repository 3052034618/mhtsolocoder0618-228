import { motion } from "framer-motion"
import { Check, Clock, Flame, Sparkles, Send } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { formatCurrency } from "@/utils/format"
import type { Package, PackageType } from "@/types"

const packageTypeLabels: Record<PackageType, { label: string; variant: "primary" | "gold" | "success" | "warning" }> = {
  mention: { label: "口播", variant: "primary" },
  overlay: { label: "贴片", variant: "warning" },
  collab: { label: "联名", variant: "gold" },
  custom: { label: "定制", variant: "success" },
}

interface PackageCardProps {
  pkg: Package
  onCooperate?: (pkg: Package) => void
}

export function PackageCard({ pkg, onCooperate }: PackageCardProps) {
  const typeInfo = packageTypeLabels[pkg.type] ?? packageTypeLabels.custom
  const isRecommended = pkg.recommended

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: isRecommended ? -10 : -4,
        scale: isRecommended ? 1.02 : 1,
        transition: { duration: 0.25, ease: "easeOut" },
      }}
      className={cn(
        "relative rounded-xl overflow-hidden",
        isRecommended && "z-10"
      )}
    >
      {isRecommended && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none animate-gold-glow"
          style={{
            background:
              "linear-gradient(135deg, rgba(201, 169, 97, 0.08) 0%, rgba(219, 197, 141, 0.04) 100%)",
          }}
        />
      )}

      <div
        className={cn(
          "relative rounded-xl border overflow-hidden transition-all duration-300",
          isRecommended
            ? "border-2 border-gold-400 bg-gradient-to-br from-gold-50/60 via-white to-gold-50/40 shadow-gold-lg"
            : "border-neutral-200 bg-white hover:border-gold-300 hover:shadow-elevated"
        )}
      >
        {isRecommended && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="absolute top-0 right-0"
          >
            <div className="relative">
              <div className="bg-gradient-gold text-primary-900 px-4 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-gold">
                <Flame className="h-3.5 w-3.5" />
                <span className="text-xs font-bold tracking-wide">HOT</span>
              </div>
              <Sparkles className="absolute -top-1 -left-1 h-3 w-3 text-gold-600 animate-pulse-soft" />
            </div>
          </motion.div>
        )}

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-lg text-primary-900 font-display leading-tight">
                {pkg.name}
              </h3>
              <div className="mt-2">
                <Badge variant={typeInfo.variant} dot={isRecommended}>
                  {typeInfo.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary-900 font-mono tabular-nums">
              {formatCurrency(pkg.price)}
            </span>
          </div>

          <div className="mt-5">
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
              <Clock className="h-3.5 w-3.5" />
              <span>交付周期：{pkg.deliveryDays} 天</span>
            </div>
            <div className="space-y-2">
              {pkg.deliverables.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.3,
                    delay: 0.1 + index * 0.06,
                    ease: "easeOut",
                  }}
                  className="flex items-start gap-2"
                >
                  <div
                    className={cn(
                      "inline-flex items-center justify-center rounded-full p-0.5 shrink-0 mt-0.5",
                      isRecommended
                        ? "bg-gradient-gold"
                        : "bg-primary-500"
                    )}
                  >
                    <Check className="h-2.5 w-2.5 text-white" />
                  </div>
                  <span className="text-sm text-neutral-600 leading-relaxed">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "p-5 pt-0",
            !isRecommended && "border-t border-neutral-100 mt-2 pt-4"
          )}
        >
          <Button
            variant={isRecommended ? "gold" : "primary"}
            size="md"
            className="w-full group/btn"
            onClick={() => onCooperate?.(pkg)}
          >
            <Send className="h-4 w-4 mr-1.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            发起合作
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
