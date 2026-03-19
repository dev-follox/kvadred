import { supabase } from "@/integrations/supabase/client";

// Helper for querying new tables not yet in auto-generated types
// This will be unnecessary once types.ts regenerates after migration
export const db = supabase as any;
