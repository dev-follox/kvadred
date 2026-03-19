
-- Shops table
CREATE TABLE IF NOT EXISTS public.shops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL DEFAULT 'Мой магазин',
  description text,
  logo_url text,
  gamification_enabled boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_shops" ON public.shops FOR SELECT USING (true);
CREATE POLICY "insert_shops" ON public.shops FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_shops" ON public.shops FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "delete_shops" ON public.shops FOR DELETE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Shop-Designer relationships
CREATE TABLE IF NOT EXISTS public.shop_designers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  designer_user_id uuid NOT NULL,
  base_bonus_pct numeric NOT NULL DEFAULT 5,
  max_bonus_pct numeric NOT NULL DEFAULT 15,
  current_bonus_pct numeric NOT NULL DEFAULT 5,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(shop_id, designer_user_id)
);
ALTER TABLE public.shop_designers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_owner_all_sd" ON public.shop_designers FOR ALL USING (EXISTS (SELECT 1 FROM public.shops WHERE id = shop_designers.shop_id AND user_id = auth.uid()));
CREATE POLICY "designer_view_own_sd" ON public.shop_designers FOR SELECT USING (designer_user_id = auth.uid());
CREATE POLICY "admin_all_sd" ON public.shop_designers FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Gamification rules
CREATE TABLE IF NOT EXISTS public.gamification_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  rule_type text NOT NULL DEFAULT 'by_amount',
  months_required integer NOT NULL DEFAULT 3,
  threshold_value numeric NOT NULL DEFAULT 0,
  bonus_increase_pct numeric NOT NULL DEFAULT 1,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.gamification_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_owner_gr" ON public.gamification_rules FOR ALL USING (EXISTS (SELECT 1 FROM public.shops WHERE id = gamification_rules.shop_id AND user_id = auth.uid()));
CREATE POLICY "designer_view_gr" ON public.gamification_rules FOR SELECT USING (EXISTS (SELECT 1 FROM public.shop_designers WHERE shop_id = gamification_rules.shop_id AND designer_user_id = auth.uid()));
CREATE POLICY "admin_all_gr" ON public.gamification_rules FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Catalog items
CREATE TABLE IF NOT EXISTS public.catalog_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric,
  preview_image_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.catalog_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_owner_ci" ON public.catalog_items FOR ALL USING (EXISTS (SELECT 1 FROM public.shops WHERE id = catalog_items.shop_id AND user_id = auth.uid()));
CREATE POLICY "auth_view_ci" ON public.catalog_items FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_ci" ON public.catalog_items FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- 3D files
CREATE TABLE IF NOT EXISTS public.catalog_3d_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  catalog_item_id uuid REFERENCES public.catalog_items(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text,
  file_url text,
  preview_image_url text,
  file_size_bytes bigint,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.catalog_3d_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_owner_3d" ON public.catalog_3d_files FOR ALL USING (EXISTS (SELECT 1 FROM public.shops WHERE id = catalog_3d_files.shop_id AND user_id = auth.uid()));
CREATE POLICY "auth_view_3d" ON public.catalog_3d_files FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "admin_all_3d" ON public.catalog_3d_files FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Sales
CREATE TABLE IF NOT EXISTS public.sales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id uuid NOT NULL REFERENCES public.shops(id) ON DELETE CASCADE,
  designer_user_id uuid NOT NULL,
  catalog_item_id uuid REFERENCES public.catalog_items(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  amount numeric NOT NULL,
  sale_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'pending',
  bonus_pct numeric,
  bonus_amount numeric,
  platform_commission numeric,
  confirmed_at timestamptz,
  payable_at timestamptz,
  paid_at timestamptz,
  rejected_at timestamptz,
  rejection_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_owner_sales" ON public.sales FOR ALL USING (EXISTS (SELECT 1 FROM public.shops WHERE id = sales.shop_id AND user_id = auth.uid()));
CREATE POLICY "designer_view_sales" ON public.sales FOR SELECT USING (designer_user_id = auth.uid());
CREATE POLICY "designer_insert_sales" ON public.sales FOR INSERT WITH CHECK (designer_user_id = auth.uid());
CREATE POLICY "admin_all_sales" ON public.sales FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Additional profile policies for cross-role visibility
CREATE POLICY "shops_view_designer_profiles" ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.shop_designers sd
    JOIN public.shops s ON s.id = sd.shop_id
    WHERE sd.designer_user_id = profiles.user_id AND s.user_id = auth.uid()
  ));
CREATE POLICY "admins_view_all_profiles" ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admins_update_all_profiles" ON public.profiles FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Update handle_new_user to support shop role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _role app_role;
BEGIN
  BEGIN
    _role := (NEW.raw_user_meta_data->>'role')::app_role;
  EXCEPTION WHEN OTHERS THEN
    _role := 'designer';
  END;
  IF _role IS NULL THEN _role := 'designer'; END IF;

  INSERT INTO public.profiles (user_id, full_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''), NEW.email)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role, plan)
  VALUES (NEW.id, _role, 'free')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.notification_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  IF _role = 'company' THEN
    INSERT INTO public.shops (user_id, name)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'shop_name', 'Мой магазин'))
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

-- Updated_at triggers
CREATE OR REPLACE TRIGGER update_shops_updated_at BEFORE UPDATE ON public.shops FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_shop_designers_updated_at BEFORE UPDATE ON public.shop_designers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_catalog_items_updated_at BEFORE UPDATE ON public.catalog_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE OR REPLACE TRIGGER update_sales_updated_at BEFORE UPDATE ON public.sales FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
