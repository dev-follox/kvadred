import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Users, Receipt, ChevronDown, LogOut, Shield } from "lucide-react";
import kvadredLogo from "@/assets/kvadred-logo.png";

const roleLabels: Record<string, string> = { company: "Магазин", designer: "Дизайнер", admin: "Админ", owner: "Владелец" };

export default function AdminConsole() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalVolume: 0, totalCommissions: 0, totalShops: 0, totalDesigners: 0 });

  useEffect(() => {
    const load = async () => {
      const { data: roles } = await supabase.from("user_roles").select("*");
      const { data: profiles } = await supabase.from("profiles").select("*");
      const enriched = roles?.map(r => ({ ...r, profile: profiles?.find(p => p.user_id === r.user_id) })) || [];
      setUsers(enriched);

      const { data: allSales } = await (supabase as any).from("sales").select("*").order("created_at", { ascending: false });
      setSales(allSales || []);

      const totalVolume = (allSales || []).reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0);
      const totalCommissions = (allSales || []).filter((s: any) => s.status === "paid").reduce((sum: number, s: any) => sum + Number(s.platform_commission || 0), 0);
      setStats({ totalVolume, totalCommissions, totalShops: enriched.filter(u => u.role === "company").length, totalDesigners: enriched.filter(u => u.role === "designer").length });
    };
    load();
  }, []);

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-soft">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred" className="h-7 w-7 object-contain" />
            <span className="text-lg font-bold text-foreground">Kvadred</span>
            <Badge variant="destructive" className="ml-2">Админ</Badge>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full hover:bg-muted px-2 py-1">
                <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center"><Shield className="h-4 w-4 text-destructive" /></div>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="px-3 py-2"><p className="text-sm font-medium text-foreground">{user?.email}</p></div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/app")}>Приложение</DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive"><LogOut className="h-4 w-4 mr-2" /> Выйти</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-foreground">Панель администратора</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Оборот платформы</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">{stats.totalVolume.toLocaleString()} ₸</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Комиссии (5%)</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-primary">{stats.totalCommissions.toLocaleString()} ₸</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Магазинов</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">{stats.totalShops}</div></CardContent></Card>
          <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Дизайнеров</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-foreground">{stats.totalDesigners}</div></CardContent></Card>
        </div>
        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users"><Users className="h-4 w-4 mr-2" /> Пользователи</TabsTrigger>
            <TabsTrigger value="transactions"><Receipt className="h-4 w-4 mr-2" /> Транзакции</TabsTrigger>
          </TabsList>
          <TabsContent value="users" className="mt-4">
            <Card><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead>Имя</TableHead><TableHead>Email</TableHead><TableHead>Роль</TableHead><TableHead>Тариф</TableHead><TableHead>Дата</TableHead>
              </TableRow></TableHeader><TableBody>
                {users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.profile?.full_name || "—"}</TableCell>
                    <TableCell>{u.profile?.email || "—"}</TableCell>
                    <TableCell><Badge variant={u.role === "admin" ? "destructive" : u.role === "company" ? "default" : "secondary"}>{roleLabels[u.role] || u.role}</Badge></TableCell>
                    <TableCell>{u.plan}</TableCell>
                    <TableCell>{new Date(u.created_at).toLocaleDateString("ru")}</TableCell>
                  </TableRow>
                ))}
              </TableBody></Table>
            </CardContent></Card>
          </TabsContent>
          <TabsContent value="transactions" className="mt-4">
            <Card><CardContent className="p-0">
              <Table><TableHeader><TableRow>
                <TableHead>Дата</TableHead><TableHead>Товар</TableHead><TableHead>Сумма</TableHead><TableHead>Бонус</TableHead><TableHead>Комиссия</TableHead><TableHead>Статус</TableHead>
              </TableRow></TableHeader><TableBody>
                {sales.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.sale_date}</TableCell>
                    <TableCell>{s.product_name}</TableCell>
                    <TableCell>{Number(s.amount).toLocaleString()} ₸</TableCell>
                    <TableCell>{s.bonus_amount ? `${Number(s.bonus_amount).toLocaleString()} ₸` : "—"}</TableCell>
                    <TableCell>{s.platform_commission ? `${Number(s.platform_commission).toLocaleString()} ₸` : "—"}</TableCell>
                    <TableCell><Badge>{s.status}</Badge></TableCell>
                  </TableRow>
                ))}
                {sales.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Нет транзакций</TableCell></TableRow>}
              </TableBody></Table>
            </CardContent></Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
