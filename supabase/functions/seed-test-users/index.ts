import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const results: string[] = [];

  // Helper to create user
  async function createUser(email: string, password: string, meta: Record<string, string>) {
    const { data: existing } = await admin.auth.admin.listUsers();
    const found = existing?.users?.find((u: any) => u.email === email);
    if (found) {
      results.push(`${email} already exists (${found.id})`);
      return found.id;
    }
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: meta,
    });
    if (error) { results.push(`ERROR creating ${email}: ${error.message}`); return null; }
    results.push(`Created ${email} (${data.user.id})`);
    return data.user.id;
  }

  // 1. Admin
  const adminId = await createUser("admin@kvadred.kz", "Admin2024!", { full_name: "Админ Kvadred", role: "admin" });
  if (adminId) {
    await admin.from("user_roles").upsert({ user_id: adminId, role: "admin", plan: "free" }, { onConflict: "user_id" });
  }

  // 2. Shop
  const shopId = await createUser("shop@kvadred.kz", "Shop2024!", { full_name: "LightHouse", role: "company", shop_name: "LightHouse — магазин освещения" });
  
  // 3. Designer
  const designerId = await createUser("designer@kvadred.kz", "Designer2024!", { full_name: "Айгерим Сейткали", role: "designer" });

  // Wait for triggers to finish
  await new Promise(r => setTimeout(r, 2000));

  // Get shop record
  if (shopId) {
    const { data: shopRecord } = await admin.from("shops").select("id").eq("user_id", shopId).single();
    const sId = shopRecord?.id;

    if (sId) {
      // Catalog items
      const catalogItems = [
        { shop_id: sId, name: "Люстра Crystal Grand", description: "Хрустальная люстра на 12 рожков", price: 245000 },
        { shop_id: sId, name: "Бра настенное Loft", description: "Настенный светильник в стиле лофт", price: 32000 },
        { shop_id: sId, name: "Торшер Nordic", description: "Напольный торшер скандинавский стиль", price: 78000 },
        { shop_id: sId, name: "Подвесной светильник Sphere", description: "Шар из матового стекла", price: 56000 },
        { shop_id: sId, name: "Точечный светильник LED Pro", description: "Встраиваемый LED даунлайт", price: 12500 },
        { shop_id: sId, name: "Трековый светильник Track-3", description: "Трековая система 3 спота", price: 89000 },
        { shop_id: sId, name: "Настольная лампа Desk Elite", description: "С диммером и USB", price: 41000 },
        { shop_id: sId, name: "LED лента Premium 5м", description: "RGBW лента с контроллером", price: 18500 },
      ];
      await admin.from("catalog_items").upsert(catalogItems, { onConflict: "id" });
      results.push(`Created ${catalogItems.length} catalog items`);

      // 3D files
      const files3d = [
        { shop_id: sId, name: "Crystal Grand 3D", description: "3DS Max модель люстры", file_url: "#", preview_image_url: "#" },
        { shop_id: sId, name: "Nordic Торшер 3D", description: "SketchUp модель торшера", file_url: "#", preview_image_url: "#" },
        { shop_id: sId, name: "Sphere подвес 3D", description: "Blender модель подвесного", file_url: "#", preview_image_url: "#" },
      ];
      await admin.from("catalog_3d_files").upsert(files3d, { onConflict: "id" });
      results.push(`Created ${files3d.length} 3D files`);

      // Gamification rules
      await admin.from("shops").update({ gamification_enabled: true }).eq("id", sId);
      await admin.from("gamification_rules").upsert([
        { shop_id: sId, rule_type: "by_amount", months_required: 3, threshold_value: 500000, bonus_increase_pct: 2, is_active: true },
        { shop_id: sId, rule_type: "by_count", months_required: 3, threshold_value: 5, bonus_increase_pct: 1, is_active: true },
      ], { onConflict: "id" });
      results.push("Gamification enabled with 2 rules");

      // Create 6 fake designers (+ real designer)
      const fakeDesignerIds: string[] = [];
      const designerNames = ["Марат Абдуллин", "Дана Касымова", "Артём Ким", "Жанна Нурланова", "Руслан Тлеуов"];
      for (const name of designerNames) {
        const fakeEmail = name.toLowerCase().replace(/\s/g, ".").replace(/[а-яё]/g, (c) => {
          const map: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya" };
          return map[c] || c;
        }) + "@test.kz";
        const fId = await createUser(fakeEmail, "Test2024!", { full_name: name, role: "designer" });
        if (fId) fakeDesignerIds.push(fId);
      }

      // Link all designers to the shop
      const allDesignerIds = designerId ? [designerId, ...fakeDesignerIds] : fakeDesignerIds;
      const bonusConfigs = [
        { base: 5, max: 15, current: 7 },
        { base: 4, max: 12, current: 4 },
        { base: 6, max: 18, current: 9 },
        { base: 5, max: 15, current: 5 },
        { base: 7, max: 20, current: 10 },
        { base: 3, max: 10, current: 3 },
      ];
      for (let i = 0; i < allDesignerIds.length; i++) {
        const cfg = bonusConfigs[i] || { base: 5, max: 15, current: 5 };
        await admin.from("shop_designers").upsert({
          shop_id: sId,
          designer_user_id: allDesignerIds[i],
          base_bonus_pct: cfg.base,
          max_bonus_pct: cfg.max,
          current_bonus_pct: cfg.current,
          status: "active",
        }, { onConflict: "id" });
      }
      results.push(`Linked ${allDesignerIds.length} designers to shop`);

      // Get catalog item ids for sales
      const { data: items } = await admin.from("catalog_items").select("id, name, price").eq("shop_id", sId);
      if (items && items.length > 0) {
        const salesData: any[] = [];
        const statuses = ["pending", "confirmed", "payable", "paid", "rejected"];
        const now = new Date();
        for (let m = 0; m < 3; m++) {
          for (let s = 0; s < 7; s++) {
            const dIdx = s % allDesignerIds.length;
            const item = items[s % items.length];
            const saleDate = new Date(now.getFullYear(), now.getMonth() - m, 5 + s * 3);
            const status = statuses[s % statuses.length];
            const bonusPct = bonusConfigs[dIdx]?.current || 5;
            const amount = item.price || 50000;
            const bonusAmt = Math.round(amount * bonusPct / 100);
            const commission = Math.round(bonusAmt * 0.05);

            const sale: any = {
              shop_id: sId,
              designer_user_id: allDesignerIds[dIdx],
              catalog_item_id: item.id,
              product_name: item.name,
              amount,
              sale_date: saleDate.toISOString().split("T")[0],
              bonus_pct: bonusPct,
              bonus_amount: bonusAmt,
              platform_commission: commission,
              status,
            };
            if (status === "confirmed" || status === "payable" || status === "paid") {
              sale.confirmed_at = new Date(saleDate.getTime() + 86400000).toISOString();
            }
            if (status === "payable" || status === "paid") {
              sale.payable_at = new Date(saleDate.getTime() + 86400000 * 15).toISOString();
            }
            if (status === "paid") {
              sale.paid_at = new Date(saleDate.getTime() + 86400000 * 20).toISOString();
            }
            if (status === "rejected") {
              sale.rejected_at = new Date(saleDate.getTime() + 86400000 * 2).toISOString();
              sale.rejection_reason = "Клиент вернул товар";
            }
            salesData.push(sale);
          }
        }
        const { error: salesErr } = await admin.from("sales").insert(salesData);
        if (salesErr) results.push(`Sales error: ${salesErr.message}`);
        else results.push(`Created ${salesData.length} sales`);
      }

      // Create 2 more fake shops for designer to be connected to
      const fakeShops = [
        { name: "Мебель & Стиль", desc: "Премиальная мебель" },
        { name: "КерамикаПро", desc: "Плитка и керамогранит" },
      ];
      for (const fs of fakeShops) {
        const fsUserId = await createUser(fs.name.toLowerCase().replace(/[^a-zа-я]/g, "") + "@test.kz", "Test2024!", { full_name: fs.name, role: "company", shop_name: fs.name });
        if (fsUserId) {
          await new Promise(r => setTimeout(r, 500));
          const { data: fsShop } = await admin.from("shops").select("id").eq("user_id", fsUserId).single();
          if (fsShop && designerId) {
            await admin.from("shops").update({ description: fs.desc }).eq("id", fsShop.id);
            await admin.from("shop_designers").upsert({
              shop_id: fsShop.id,
              designer_user_id: designerId,
              base_bonus_pct: 4,
              max_bonus_pct: 12,
              current_bonus_pct: 4,
              status: "active",
            }, { onConflict: "id" });
            results.push(`Created shop "${fs.name}" and linked designer`);
          }
        }
      }
    }
  }

  return new Response(JSON.stringify({ success: true, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
