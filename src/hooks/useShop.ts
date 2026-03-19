import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useShop() {
  const { user } = useAuth();
  const [shopId, setShopId] = useState<string | null>(null);
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("shops")
      .select("id, name")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setShopId(data.id);
          setShopName(data.name);
        }
        setLoading(false);
      });
  }, [user]);

  return { shopId, shopName, loading };
}
