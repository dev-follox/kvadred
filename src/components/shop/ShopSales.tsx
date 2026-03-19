import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "outline" },
  confirmed: { label: "Подтверждена", variant: "secondary" },
  payable: { label: "К выплате", variant: "default" },
  paid: { label: "Выплачено", variant: "default" },
  rejected: { label: "Отклонена", variant: "destructive" },
};

export default function ShopSales() {
  const { shopId } = useShop();
  const [sales, setSales] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const load = async () => {
    if (!shopId) return;
    const { data } = await supabase.from("sales").select("*").eq("shop_id", shopId).order("created_at", { ascending: false });
    if (data) {
      setSales(data);
      const uids = [...new Set(data.map(s => s.designer_user_id))];
      if (uids.length > 0) {
        const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", uids);
        const map: Record<string, string> = {};
        profs?.forEach(p => { map[p.user_id] = p.full_name || ""; });
        setProfiles(map);
      }
    }
  };

  useEffect(() => { load(); }, [shopId]);

  const getEffectiveStatus = (sale: any) => {
    if (sale.status === "confirmed" && sale.confirmed_at) {
      const days = (Date.now() - new Date(sale.confirmed_at).getTime()) / 86400000;
      if (days >= 14) return "payable";
    }
    return sale.status;
  };

  const confirmSale = async (sale: any) => {
    const { data: sd } = await supabase
      .from("shop_designers")
      .select("current_bonus_pct")
      .eq("shop_id", shopId!)
      .eq("designer_user_id", sale.designer_user_id)
      .single();

    const pct = sd?.current_bonus_pct || 5;
    const bonusAmount = Math.round(sale.amount * pct / 100);
    const commission = Math.round(bonusAmount * 0.05);

    await supabase.from("sales").update({
      status: "confirmed",
      confirmed_at: new Date().toISOString(),
      bonus_pct: pct,
      bonus_amount: bonusAmount,
      platform_commission: commission,
    }).eq("id", sale.id);

    toast({ title: "Продажа подтверждена" });
    load();
  };

  const rejectSale = async (id: string) => {
    await supabase.from("sales").update({ status: "rejected", rejected_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "Продажа отклонена" });
    load();
  };

  const markPaid = async (id: string) => {
    await supabase.from("sales").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
    toast({ title: "Выплата отмечена" });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Продажи</h1>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Дизайнер</TableHead>
                <TableHead>Товар</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Бонус</TableHead>
                <TableHead>Комиссия 5%</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map(s => {
                const es = getEffectiveStatus(s);
                const st = statusConfig[es] || statusConfig.pending;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-nowrap">{s.sale_date}</TableCell>
                    <TableCell>{profiles[s.designer_user_id] || "—"}</TableCell>
                    <TableCell>{s.product_name}</TableCell>
                    <TableCell className="whitespace-nowrap">{Number(s.amount).toLocaleString()} ₸</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {s.bonus_amount ? `${Number(s.bonus_amount).toLocaleString()} ₸ (${s.bonus_pct}%)` : "—"}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {s.platform_commission ? `${Number(s.platform_commission).toLocaleString()} ₸` : "—"}
                    </TableCell>
                    <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {es === "pending" && (
                          <>
                            <Button size="sm" variant="ghost" onClick={() => confirmSale(s)} title="Подтвердить">
                              <Check className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => rejectSale(s.id)} title="Отклонить">
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                        {es === "payable" && (
                          <Button size="sm" variant="ghost" onClick={() => markPaid(s.id)} title="Отметить выплату">
                            <Banknote className="h-4 w-4 text-primary" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-muted-foreground py-8">Нет продаж</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
