import { motion } from 'framer-motion';
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Heart,
} from 'lucide-react';

const footerLinks = {
  product: {
    title: '产品服务',
    links: [
      { label: '赞助市场', href: '/marketplace' },
      { label: '创作者中心', href: '/creators' },
      { label: '品牌方入驻', href: '/brand' },
      { label: '合作案例', href: '/cases' },
    ],
  },
  support: {
    title: '帮助支持',
    links: [
      { label: '使用指南', href: '/help' },
      { label: '常见问题', href: '/faq' },
      { label: '联系客服', href: '/contact' },
      { label: '意见反馈', href: '/feedback' },
    ],
  },
  company: {
    title: '关于我们',
    links: [
      { label: '公司介绍', href: '/about' },
      { label: '加入我们', href: '/careers' },
      { label: '新闻动态', href: '/news' },
      { label: '合作伙伴', href: '/partners' },
    ],
  },
  legal: {
    title: '法律条款',
    links: [
      { label: '用户协议', href: '/terms' },
      { label: '隐私政策', href: '/privacy' },
      { label: '版权声明', href: '/copyright' },
      { label: '免责声明', href: '/disclaimer' },
    ],
  },
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-primary-900 to-primary-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-texture-grid opacity-5" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-elegant flex items-center justify-center shadow-gold">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-display font-bold bg-gradient-to-r from-gold-400 to-gold-500 bg-clip-text text-transparent">
                  Spark赞助平台
                </span>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed mb-6 max-w-sm">
                连接优质创作者与品牌方，打造高效、透明、可信赖的商务赞助合作平台，让每一次合作都闪耀价值。
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-gold-400" />
                  </div>
                  <span>contact@spark-platform.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-gold-400" />
                  </div>
                  <span>400-888-8888</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-neutral-300">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gold-400" />
                  </div>
                  <span>北京市朝阳区建国路88号</span>
                </div>
              </div>
            </motion.div>
          </div>

          {Object.entries(footerLinks).map(([key, section], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <h4 className="font-semibold text-white mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-gold-400 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-400 flex items-center gap-1.5">
              © {currentYear} Spark赞助平台. Made with
              <Heart className="w-4 h-4 text-danger-500 fill-danger-500" />
              by Spark Team
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-neutral-400 hover:text-gold-400 transition-colors">
                京ICP备12345678号
              </a>
              <a href="#" className="text-sm text-neutral-400 hover:text-gold-400 transition-colors">
                京公网安备11010502000000号
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
