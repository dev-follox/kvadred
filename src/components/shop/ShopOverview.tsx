import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useShop } from "@/hooks/useShop";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CheckCircle, Clock, Users } from "lucide-react";

export default function ShopOverview() {
  const { shopId } = useShop();
  const [stats, setStats] = useState({ totalPaid: 0, totalPending: 0, activeDesigners: 0 });
  const [monthlyData, setMonthlyData] = useState<{ month: string; amount: number }[]>([]);

  useEffect(() => {
    if (!shopId) return;
    const load = async () => {
      const { data: sales } = await supabase.from("sales").select("*").eq("shop_id", shopId);
      const { data: designers } = await supabase.from("shop_designers").select("id").eq("shop_id", shopId).eq("status", "active");

      const paidSales = sales?.filter(s => s.status === "paid") || [];
      const pendingSales = sales?.filter(s => ["pending", "confirmed", "payable"].includes(s.status)) || [];

      const totalPaid = paidSales.reduce((sum, s) => sum + Number(s.bonus_amount || 0), 0);
      const totalPending = pendingSales.reduce((sum, s) => sum + Number(s.bonus_amount || 0), 0);

      const monthlyMap: Record<string, number> = {};
      (sales || []).forEach(s => {
        const month = s.sale_date?.slice(0, 7) || "";
        if (month) monthlyMap[month] = (monthlyMap[month] || 0) + Number(s.amount || 0);
      });

      setStats({ totalPaid, totalPending, activeDesigners: designers?.length || 0 });
      setMonthlyData(Object.entries(monthlyMap).sort().slice(-6).map(([month, amount]) => ({ month, amount })));
    };
    load();
  }, [shopId]);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-foreground uppercase tracking-wide">Дашборд магазина</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Выплачено бонусов", value: `${stats.totalPaid.toLocaleString()} ₸`, icon: CheckCircle, iconCls: "text-primary" },
          { label: "Ожидает выплаты", value: `${stats.totalPending.toLocaleString()} ₸`, icon: Clock, iconCls: "text-warning" },
          { label: "Активных дизайнеров", value: String(stats.activeDesigners), icon: Users, iconCls: "text-primary" },
        ].map((item, i) => (
          <div key={i} className="bg-card border border-border p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-secondary-alpha">{item.label}</span>
              <item.icon className={`h-4 w-4 ${item.iconCls}`} strokeWidth={1.5} />
            </div>
            <div className="text-2xl font-bold text-foreground font-mono">{item.value}</div>
          </div>
        ))}
      </div>

      {monthlyData.length > 0 && (
        <div className="bg-card border border-border p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 uppercase tracking-wide">Продажи по месяцам</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                <YAxis tick={{ fill: 'rgba(255,255,255,0.55)', fontSize: 12 }} />
                <Tooltip
                  formatter={(value: number) => [`${value.toLocaleString()} ₸`, "Сумма"]}
                  contentStyle={{ backgroundColor: '#243029', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
                />
                <Bar dataKey="amount" fill="hsl(140, 16%, 55%)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
