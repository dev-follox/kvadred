import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Мой дашборд</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Ожидают", value: stats.pending },
          { label: "Подтверждены", value: stats.confirmed },
          { label: "К выплате", value: stats.payable },
          { label: "Выплачено", value: stats.paid, highlight: true },
        ].map((s, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">{s.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${s.highlight ? "text-primary" : "text-foreground"}`}>
                {s.value.toLocaleString()} ₸
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {monthlyData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Заработок по месяцам</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ₸`, "Бонус"]} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {shops.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Мои магазины</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {shops.map((s: any) => (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{s.shops?.name}</span>
                    {s.shops?.gamification_enabled && <GamificationBadge />}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-semibold text-primary">{s.current_bonus_pct}%</span>
                    <p className="text-xs text-muted-foreground">макс. {s.max_bonus_pct}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
