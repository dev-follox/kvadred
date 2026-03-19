import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "Ожидает", variant: "outline" },
  confirmed: { label: "Подтверждена", variant: "secondary" },
  payable: { label: "К выплате", variant: "default" },
  paid: { label: "Выплачено", variant: "default" },
  rejected: { label: "Отклонена", variant: "destructive" },
};

export default function DesignerSales() {
  const { user } = useAuth();
  const [sales, setSales] = useState<any[]>([]);
  const [connectedShops, setConnectedShops] = useState<any[]>([]);
  const [shopNames, setShopNames] = useState<Record<string, string>>({});
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedShopId, setSelectedShopId] = useState("");
  const [productName, setProductName] = useState("");
  const [amount, setAmount] = useState("");
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const { toast } = useToast();

  const loadSales = async () => {
    if (!user) return;
    const { data } = await supabase.from("sales").select("*").eq("designer_user_id", user.id).order("created_at", { ascending: false });
    if (data) setSales(data);
  };

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      await loadSales();
      const { data: conn } = await supabase
        .from("shop_designers")
        .select("shop_id, shops(id, name)")
        .eq("designer_user_id", user.id);
      if (conn) {
        const shops = conn.map((c: any) => c.shops).filter(Boolean);
        setConnectedShops(shops);
        const names: Record<string, string> = {};
        shops.forEach((s: any) => { names[s.id] = s.name; });
        setShopNames(names);
      }
    };
    load();
  }, [user]);

  const onShopSelect = async (shopId: string) => {
    setSelectedShopId(shopId);
    setProductName("");
    const { data } = await supabase.from("catalog_items").select("*").eq("shop_id", shopId);
    setCatalogItems(data || []);
  };

  const submit = async () => {
    if (!user || !selectedShopId || !productName || !amount) return;
    const { error } = await supabase.from("sales").insert({
      shop_id: selectedShopId,
      designer_user_id: user.id,
      product_name: productName,
      amount: Number(amount),
      sale_date: saleDate,
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Продажа отправлена на подтверждение" });
      setDialogOpen(false);
      setProductName("");
      setAmount("");
      setSelectedShopId("");
      loadSales();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Мои продажи</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Новая продажа</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Зафиксировать продажу</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Магазин</Label>
                <Select value={selectedShopId} onValueChange={onShopSelect}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Выберите магазин" /></SelectTrigger>
                  <SelectContent>
                    {connectedShops.map((s: any) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Товар</Label>
                {catalogItems.length > 0 ? (
                  <Select value={productName} onValueChange={setProductName}>
                    <SelectTrigger className="mt-1"><SelectValue placeholder="Выберите товар" /></SelectTrigger>
                    <SelectContent>
                      {catalogItems.map(ci => (
                        <SelectItem key={ci.id} value={ci.name}>
                          {ci.name}{ci.price ? ` — ${Number(ci.price).toLocaleString()} ₸` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input value={productName} onChange={e => setProductName(e.target.value)} placeholder="Название товара" className="mt-1" />
                )}
              </div>
              <div>
                <Label>Сумма (₸)</Label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0" className="mt-1" />
              </div>
              <div>
                <Label>Дата продажи</Label>
                <Input type="date" value={saleDate} onChange={e => setSaleDate(e.target.value)} className="mt-1" />
              </div>
              <Button onClick={submit} className="w-full">Отправить на подтверждение</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Магазин</TableHead>
                <TableHead>Товар</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Бонус</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map(s => {
                const st = statusConfig[s.status] || statusConfig.pending;
                return (
                  <TableRow key={s.id}>
                    <TableCell className="whitespace-nowrap">{s.sale_date}</TableCell>
                    <TableCell>{shopNames[s.shop_id] || "—"}</TableCell>
                    <TableCell>{s.product_name}</TableCell>
                    <TableCell className="whitespace-nowrap">{Number(s.amount).toLocaleString()} ₸</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {s.bonus_amount ? `${Number(s.bonus_amount).toLocaleString()} ₸` : "—"}
                    </TableCell>
                    <TableCell><Badge variant={st.variant}>{st.label}</Badge></TableCell>
                  </TableRow>
                );
              })}
              {sales.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Нет продаж. Зафиксируйте первую!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
