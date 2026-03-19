import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Package, Box, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ShopCatalog() {
  const { shopId } = useShop();
  const [items, setItems] = useState<any[]>([]);
  const [files3d, setFiles3d] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const { toast } = useToast();

  const load = async () => {
    if (!shopId) return;
    const { data: ci } = await supabase.from("catalog_items").select("*").eq("shop_id", shopId).order("created_at", { ascending: false });
    const { data: f3d } = await supabase.from("catalog_3d_files").select("*").eq("shop_id", shopId);
    if (ci) setItems(ci);
    if (f3d) setFiles3d(f3d);
  };

  useEffect(() => { load(); }, [shopId]);

  const addItem = async () => {
    if (!shopId || !name) return;
    const { error } = await supabase.from("catalog_items").insert({
      shop_id: shopId, name, description: desc, price: price ? Number(price) : null,
    });
    if (error) toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Товар добавлен" });
      setDialogOpen(false);
      setName(""); setDesc(""); setPrice("");
      load();
    }
  };

  const deleteItem = async (id: string) => {
    await supabase.from("catalog_items").delete().eq("id", id);
    toast({ title: "Товар удалён" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Каталог</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> Добавить товар</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Новый товар</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Название</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1" /></div>
              <div><Label>Описание</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} className="mt-1" /></div>
              <div><Label>Цена (₸)</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} className="mt-1" /></div>
              <Button onClick={addItem} className="w-full">Добавить</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products"><Package className="h-4 w-4 mr-2" /> Товары ({items.length})</TabsTrigger>
          <TabsTrigger value="3d"><Box className="h-4 w-4 mr-2" /> 3D файлы ({files3d.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {items.map(item => (
              <Card key={item.id} className="group">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-foreground">{item.name}</h3>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100" onClick={() => deleteItem(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                  {item.price && <p className="text-lg font-bold text-primary mt-2">{Number(item.price).toLocaleString()} ₸</p>}
                </CardContent>
              </Card>
            ))}
            {items.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">Каталог пуст. Добавьте первый товар!</p>
            )}
          </div>
        </TabsContent>
        <TabsContent value="3d">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {files3d.map(f => (
              <Card key={f.id}>
                <CardContent className="p-4 flex items-start gap-3">
                  <Box className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground">{f.name}</h3>
                    {f.description && <p className="text-sm text-muted-foreground mt-1">{f.description}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
            {files3d.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-8">Нет 3D файлов</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
