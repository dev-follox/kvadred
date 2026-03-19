import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Store, Package, Box } from "lucide-react";
import GamificationBadge from "@/components/GamificationBadge";

export default function DesignerShops() {
  const { user } = useAuth();
  const [shops, setShops] = useState<any[]>([]);
  const [myConnections, setMyConnections] = useState<Record<string, any>>({});
  const [selectedShop, setSelectedShop] = useState<any>(null);
  const [catalogItems, setCatalogItems] = useState<any[]>([]);
  const [files3d, setFiles3d] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const { data: allShops } = await supabase.from("shops").select("*");
      if (allShops) setShops(allShops);

      const { data: connections } = await supabase.from("shop_designers").select("*").eq("designer_user_id", user.id);
      const map: Record<string, any> = {};
      connections?.forEach(c => { map[c.shop_id] = c; });
      setMyConnections(map);
    };
    load();
  }, [user]);

  const openShop = async (shop: any) => {
    setSelectedShop(shop);
    const { data: items } = await supabase.from("catalog_items").select("*").eq("shop_id", shop.id);
    const { data: files } = await supabase.from("catalog_3d_files").select("*").eq("shop_id", shop.id);
    setCatalogItems(items || []);
    setFiles3d(files || []);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Магазины</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shops.map(shop => (
          <Card
            key={shop.id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => openShop(shop)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Store className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{shop.name}</h3>
                  {shop.gamification_enabled && <GamificationBadge />}
                </div>
              </div>
              {shop.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
              )}
              {myConnections[shop.id] && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-sm text-foreground">
                    Мой бонус: <span className="font-semibold text-primary">{myConnections[shop.id].current_bonus_pct}%</span>
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        {shops.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-8">Нет магазинов на платформе</p>
        )}
      </div>

      <Dialog open={!!selectedShop} onOpenChange={() => setSelectedShop(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedShop?.name}
              {selectedShop?.gamification_enabled && <GamificationBadge />}
            </DialogTitle>
          </DialogHeader>

          {selectedShop?.description && (
            <p className="text-muted-foreground">{selectedShop.description}</p>
          )}

          {myConnections[selectedShop?.id] && (
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm text-foreground">
                Текущий бонус: <span className="font-bold text-primary">{myConnections[selectedShop?.id].current_bonus_pct}%</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Базовый: {myConnections[selectedShop?.id].base_bonus_pct}% | Макс: {myConnections[selectedShop?.id].max_bonus_pct}%
              </p>
            </div>
          )}

          <h3 className="font-semibold mt-4 flex items-center gap-2 text-foreground">
            <Package className="h-4 w-4" /> Каталог товаров
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {catalogItems.map(item => (
              <div key={item.id} className="p-3 rounded-lg border border-border">
                <p className="font-medium text-sm text-foreground">{item.name}</p>
                {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                {item.price && <p className="text-primary font-semibold mt-1">{Number(item.price).toLocaleString()} ₸</p>}
              </div>
            ))}
            {catalogItems.length === 0 && (
              <p className="col-span-2 text-sm text-muted-foreground">Каталог пуст</p>
            )}
          </div>

          {files3d.length > 0 && (
            <>
              <h3 className="font-semibold mt-4 flex items-center gap-2 text-foreground">
                <Box className="h-4 w-4" /> 3D файлы
              </h3>
              <div className="space-y-2">
                {files3d.map(f => (
                  <div key={f.id} className="flex items-center gap-2 p-2 rounded border border-border">
                    <Box className="h-4 w-4 text-primary" />
                    <div>
                      <span className="text-sm font-medium text-foreground">{f.name}</span>
                      {f.description && <p className="text-xs text-muted-foreground">{f.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
