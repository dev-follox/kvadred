import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, Users, DollarSign, Percent, Store, Clock, CheckCircle2, AlertCircle, Banknote } from "lucide-react";
import GamificationBadge from "@/components/GamificationBadge";

/* ─── mock data ─── */
const shopStats = [
  { label: "Активные дизайнеры", value: "6", icon: Users },
  { label: "Продажи за месяц", value: "1 240 000 ₸", icon: DollarSign },
  { label: "Ожидающие выплаты", value: "87 300 ₸", icon: Clock },
  { label: "Комиссия платформы", value: "4 365 ₸", icon: Percent },
];

const topDesigners = [
  { name: "Айгерим С.", sales: "420 000 ₸", pct: "9%", gamification: true },
  { name: "Марат А.", sales: "310 000 ₸", pct: "7%", gamification: false },
  { name: "Дана К.", sales: "245 000 ₸", pct: "6%", gamification: false },
  { name: "Артём К.", sales: "165 000 ₸", pct: "5%", gamification: true },
];

const shopSales = [
  { product: "Люстра Crystal Grand", designer: "Айгерим С.", amount: "245 000 ₸", status: "pending" },
  { product: "Торшер Nordic", designer: "Марат А.", amount: "78 000 ₸", status: "confirmed" },
  { product: "Бра Loft", designer: "Дана К.", amount: "32 000 ₸", status: "payable" },
];

const designerStats = [
  { label: "Заработано в этом месяце", value: "37 800 ₸", icon: Banknote },
  { label: "Ожидает подтверждения", value: "12 250 ₸", icon: Clock },
  { label: "К выплате", value: "25 550 ₸", icon: DollarSign },
];

const designerShops = [
  { name: "LightHouse", pct: "9%", gamification: true },
  { name: "Мебель & Стиль", pct: "4%", gamification: false },
  { name: "КерамикаПро", pct: "6%", gamification: true },
];

const designerSales = [
  { product: "Люстра Crystal Grand", shop: "LightHouse", amount: "245 000 ₸", status: "paid" },
  { product: "Стул Elegance", shop: "Мебель & Стиль", amount: "89 000 ₸", status: "confirmed" },
  { product: "Керамогранит Marble", shop: "КерамикаПро", amount: "56 000 ₸", status: "pending" },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Ожидает", color: "text-amber-500 bg-amber-500/10", icon: AlertCircle },
  confirmed: { label: "Подтверждена", color: "text-blue-500 bg-blue-500/10", icon: CheckCircle2 },
  payable: { label: "К выплате", color: "text-emerald-500 bg-emerald-500/10", icon: Banknote },
  paid: { label: "Выплачено", color: "text-emerald-600 bg-emerald-600/10", icon: CheckCircle2 },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = statusConfig[status] || statusConfig.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
      <cfg.icon className="h-3 w-3" />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Users }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-lg font-bold text-foreground">{value}</div>
    </div>
  );
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function DemoPreview({ open, onClose }: Props) {
  const [tab, setTab] = useState<"shop" | "designer">("shop");

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="bg-card border border-border rounded-2xl shadow-card w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-bold text-foreground">Демо платформы</h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4">
              <div className="flex bg-muted rounded-lg p-1 w-fit">
                <button
                  onClick={() => setTab("shop")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === "shop" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Store className="h-4 w-4" /> Для магазина
                </button>
                <button
                  onClick={() => setTab("designer")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${tab === "designer" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <Users className="h-4 w-4" /> Для дизайнера
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {tab === "shop" ? (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {shopStats.map((s, i) => <StatCard key={i} {...s} />)}
                  </div>

                  {/* Top designers */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-primary" /> Топ дизайнеров
                    </h3>
                    <div className="bg-muted/30 rounded-xl border border-border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-muted-foreground text-xs border-b border-border">
                            <th className="text-left px-4 py-2.5 font-medium">Дизайнер</th>
                            <th className="text-right px-4 py-2.5 font-medium">Продажи</th>
                            <th className="text-right px-4 py-2.5 font-medium">Бонус %</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topDesigners.map((d, i) => (
                            <tr key={i} className="border-b border-border/50 last:border-0">
                              <td className="px-4 py-2.5 font-medium text-foreground flex items-center gap-2">
                                {d.name}
                                {d.gamification && <GamificationBadge />}
                              </td>
                              <td className="px-4 py-2.5 text-right text-foreground">{d.sales}</td>
                              <td className="px-4 py-2.5 text-right text-primary font-semibold">{d.pct}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Recent sales */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Последние продажи</h3>
                    <div className="space-y-2">
                      {shopSales.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-muted/30 border border-border rounded-lg px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.product}</p>
                            <p className="text-xs text-muted-foreground">{s.designer}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-foreground">{s.amount}</span>
                            <StatusBadge status={s.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    {designerStats.map((s, i) => <StatCard key={i} {...s} />)}
                  </div>

                  {/* Shops */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Store className="h-4 w-4 text-primary" /> Мои магазины
                    </h3>
                    <div className="grid gap-2">
                      {designerShops.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-muted/30 border border-border rounded-lg px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Store className="h-4 w-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{s.name}</span>
                            {s.gamification && <GamificationBadge />}
                          </div>
                          <span className="text-sm font-semibold text-primary">{s.pct}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sales history */}
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-3">История продаж</h3>
                    <div className="space-y-2">
                      {designerSales.map((s, i) => (
                        <div key={i} className="flex items-center justify-between bg-muted/30 border border-border rounded-lg px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{s.product}</p>
                            <p className="text-xs text-muted-foreground">{s.shop}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-foreground">{s.amount}</span>
                            <StatusBadge status={s.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
