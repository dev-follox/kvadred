import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Дашборд магазина</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Выплачено бонусов</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-foreground">{stats.totalPaid.toLocaleString()} ₸</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ожидает выплаты</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-foreground">{stats.totalPending.toLocaleString()} ₸</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Активных дизайнеров</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-foreground">{stats.activeDesigners}</div></CardContent>
        </Card>
      </div>

      {monthlyData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Продажи по месяцам</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip formatter={(value: number) => [`${value.toLocaleString()} ₸`, "Сумма"]} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
