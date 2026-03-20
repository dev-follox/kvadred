import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import GamificationBadge from "@/components/GamificationBadge";

export default function DesignerOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ pending: 0, confirmed: 0, payable: 0, paid: 0 });
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);
  const [shops, setShops] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: sales } = await supabase.from("sales").select("*").eq("designer_user_id", user.id);
      if (sales) {
        const calc = (status: string) => sales.filter(s => s.status === status).reduce((sum, s) => sum + Number(s.bonus_amount || 0), 0);
        setStats({ pending: calc("pending"), confirmed: calc("confirmed"), payable: calc("payable"), paid: calc("paid") });

        const monthlyMap: Record<string, number> = {};
        sales.filter(s => s.status === "paid").forEach(s => {
          const m = s.sale_date?.slice(0, 7) || "";
          if (m) monthlyMap[m] = (monthlyMap[m] || 0) + Number(s.bonus_amount || 0);
        });
        setMonthlyData(Object.entries(monthlyMap).sort().slice(-6).map(([month, amount]) => ({ month, amount })));
      }

      const { data: connections } = await supabase
        .from("shop_designers")
        .select("id, current_bonus_pct, base_bonus_pct, max_bonus_pct, shops(name, gamification_enabled)")
        .eq("designer_user_id", user.id);
      if (connections) setShops(connections);
    };
    load();
  }, [user]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground uppercase tracking-wide">Мой дашборд</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Ожидают", value: stats.pending },
          { label: "Подтверждены", value: stats.confirmed },
          { label: "К выплате", value: stats.payable },
          { label: "Выплачено", value: stats.paid, highlight: true },
        ].map((s, i) => (
          <div key={i} className="bg-card border border-border p-6">
            <div className="text-sm text-secondary-alpha mb-2">{s.label}</div>
            <div className={`text-2xl font-bold font-mono ${s.highlight ? "text-primary" : "text-foreground"}`}>
              {s.value.toLocaleString()} ₸
            </div>
          </div>
        ))}
      </div>

      {monthlyData.length > 0 && (
        <div className="bg-card border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">Заработок по месяцам</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} ₸`, "Бонус"]}
                  contentStyle={{ backgroundColor: '#243029', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                />
                <Bar dataKey="amount" fill="hsl(140, 16%, 55%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {shops.length > 0 && (
        <div className="bg-card border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">Мои магазины</h2>
          <div className="space-y-2">
            {shops.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between p-3 border border-border">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{s.shops?.name}</span>
                  {s.shops?.gamification_enabled && <GamificationBadge />}
                </div>
                <div className="text-right">
                  <span className="text-lg font-semibold text-primary font-mono">{s.current_bonus_pct}%</span>
                  <p className="text-xs text-secondary-alpha">макс. {s.max_bonus_pct}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
