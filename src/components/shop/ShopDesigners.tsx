import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DesignerRow {
  id: string;
  designer_user_id: string;
  base_bonus_pct: number;
  max_bonus_pct: number;
  current_bonus_pct: number;
  status: string;
  profile?: { full_name: string | null; email: string | null };
}

export default function ShopDesigners() {
  const { shopId } = useShop();
  const [designers, setDesigners] = useState<DesignerRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newBase, setNewBase] = useState("5");
  const [newMax, setNewMax] = useState("15");
  const { toast } = useToast();

  const load = async () => {
    if (!shopId) return;
    const { data } = await supabase.from("shop_designers").select("*").eq("shop_id", shopId);
    if (!data) return;

    const userIds = data.map(d => d.designer_user_id);
    const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", userIds);

    setDesigners(
      data.map(d => ({
        ...d,
        profile: profiles?.find(p => p.user_id === d.designer_user_id) as any,
      }))
    );
  };

  useEffect(() => { load(); }, [shopId]);

  const handleAdd = async () => {
    if (!shopId || !newEmail) return;
    const { data: profile } = await supabase.from("profiles").select("user_id").eq("email", newEmail).single();
    if (!profile) {
      toast({ title: "Дизайнер не найден", description: "Пользователь с таким email не зарегистрирован на платформе", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("shop_designers").insert({
      shop_id: shopId,
      designer_user_id: profile.user_id,
      base_bonus_pct: Number(newBase),
      max_bonus_pct: Number(newMax),
      current_bonus_pct: Number(newBase),
    });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Дизайнер добавлен" });
      setDialogOpen(false);
      setNewEmail("");
      setNewBase("5");
      setNewMax("15");
      load();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Дизайнеры</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><UserPlus className="h-4 w-4 mr-2" /> Добавить дизайнера</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Добавить дизайнера</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Email дизайнера</Label>
                <Input value={newEmail} onChange={e => setNewEmail(e.target.value)} placeholder="designer@email.com" className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Базовый % бонуса</Label>
                  <Input type="number" value={newBase} onChange={e => setNewBase(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Макс. % бонуса</Label>
                  <Input type="number" value={newMax} onChange={e => setNewMax(e.target.value)} className="mt-1" />
                </div>
              </div>
              <Button onClick={handleAdd} className="w-full">Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Имя</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Базовый %</TableHead>
                <TableHead>Текущий %</TableHead>
                <TableHead>Макс. %</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {designers.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.profile?.full_name || "—"}</TableCell>
                  <TableCell>{d.profile?.email || "—"}</TableCell>
                  <TableCell>{d.base_bonus_pct}%</TableCell>
                  <TableCell className="font-semibold text-primary">{d.current_bonus_pct}%</TableCell>
                  <TableCell>{d.max_bonus_pct}%</TableCell>
                  <TableCell>
                    <Badge variant={d.status === "active" ? "default" : "secondary"}>
                      {d.status === "active" ? "Активен" : "Неактивен"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {designers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Нет дизайнеров. Добавьте первого!
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
