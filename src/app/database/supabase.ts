import { createClient } from "@supabase/supabase-js";
import { environment } from "src/environments/environment";

export const supabase = createClient(
    environment.SUPA_BASE.supaBaseUrl,
    environment.SUPA_BASE.apiKey
)