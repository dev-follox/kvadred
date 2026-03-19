import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useShop } from "@/hooks/useShop";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp, Save } from "lucide-react";

interface Rule {
  id?: string;
  rule_type: string;
  months_required: number;
  threshold_value: number;
  bonus_increase_pct: number;
  is_active: boolean;
}

export default function ShopSettings() {
  const { shopId } = useShop();
  const [gamificationEnabled, setGamificationEnabled] = useState(false);
  const [rules, setRules] = useState<Rule[]>([]);
  const [shopName, setShopName] = useState("");
  const [shopDesc, setShopDesc] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!shopId) return;
    const load = async () => {
      const { data: shop } = await supabase.from("shops").select("*").eq("id", shopId).single();
      if (shop) {
        setShopName(shop.name);
        setShopDesc(shop.description || "");
        setGamificationEnabled(shop.gamification_enabled);
      }
      const { data: gr } = await supabase.from("gamification_rules").select("*").eq("shop_id", shopId);
      if (gr) setRules(gr as Rule[]);
    };
    load();
  }, [shopId]);

  const saveShop = async () => {
    if (!shopId) return;
    await supabase.from("shops").update({ name: shopName, description: shopDesc, gamification_enabled: gamificationEnabled }).eq("id", shopId);
    toast({ title: "Настройки сохранены" });
  };

  const saveRule = async (rule: Rule) => {
    if (!shopId) return;
    if (rule.id) {
      await supabase.from("gamification_rules").update({
        months_required: rule.months_required,
        threshold_value: rule.threshold_value,
        bonus_increase_pct: rule.bonus_increase_pct,
        is_active: rule.is_active,
      }).eq("id", rule.id);
    } else {
      await supabase.from("gamification_rules").insert({ ...rule, shop_id: shopId });
    }
    toast({ title: "Правило сохранено" });
    const { data: gr } = await supabase.from("gamification_rules").select("*").eq("shop_id", shopId);
    if (gr) setRules(gr as Rule[]);
  };

  const updateRule = (index: number, field: keyof Rule, value: any) => {
    const updated = [...rules];
    (updated[index] as any)[field] = value;
    setRules(updated);
  };

  const addRule = (type: string) => {
    setRules([...rules, { rule_type: type, months_required: 3, threshold_value: type === "by_count" ? 5 : 500000, bonus_increase_pct: 1, is_active: true }]);
  };

  const renderRuleEditor = (type: string, label: string, desc: string, unit: string) => {
    const rule = rules.find(r => r.rule_type === type);
    if (!rule) return (
      <Button variant="outline" onClick={() => addRule(type)} className="w-full justify-start">
        + Добавить правило: {label}
      </Button>
    );
    const idx = rules.indexOf(rule);
    return (
      <div className="space-y-3 p-4 border border-border rounded-lg">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-foreground">{label}</h4>
          <Switch checked={rule.is_active} onCheckedChange={v => updateRule(idx, "is_active", v)} />
        </div>
        <p className="text-sm text-muted-foreground">{desc}</p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Месяцев подряд</Label>
            <Input type="number" value={rule.months_required} onChange={e => updateRule(idx, "months_required", Number(e.target.value))} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Порог ({unit})</Label>
            <Input type="number" value={rule.threshold_value} onChange={e => updateRule(idx, "threshold_value", Number(e.target.value))} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs">Рост бонуса (%)</Label>
            <Input type="number" value={rule.bonus_increase_pct} onChange={e => updateRule(idx, "bonus_increase_pct", Number(e.target.value))} className="mt-1" />
          </div>
        </div>
        <Button size="sm" onClick={() => saveRule(rule)}><Save className="h-4 w-4 mr-2" /> Сохранить правило</Button>
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Настройки магазина</h1>

      <Card>
        <CardHeader><CardTitle>Основные данные</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Название магазина</Label>
            <Input value={shopName} onChange={e => setShopName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label>Описание</Label>
            <Input value={shopDesc} onChange={e => setShopDesc(e.target.value)} className="mt-1" placeholder="Краткое описание магазина" />
          </div>
          <Button onClick={saveShop}><Save className="h-4 w-4 mr-2" /> Сохранить</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" /> Геймификация
              </CardTitle>
              <CardDescription className="mt-1">
                Автоматический рост бонусного % для активных дизайнеров
              </CardDescription>
            </div>
            <Switch checked={gamificationEnabled} onCheckedChange={setGamificationEnabled} />
          </div>
        </CardHeader>
        {gamificationEnabled && (
          <CardContent className="space-y-4">
            {renderRuleEditor(
              "by_amount",
              "По сумме продаж",
              "Если дизайнер N месяцев подряд приносит продажи на сумму от X ₸ — бонус растёт",
              "₸"
            )}
            {renderRuleEditor(
              "by_count",
              "По количеству продаж",
              "Если дизайнер N месяцев подряд делает от X продаж — бонус растёт",
              "шт"
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
