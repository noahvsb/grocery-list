import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qheywsmuneawbbeykkxo.supabase.co";
const supabaseKey = "sb_publishable_f6RmRRjD3N2Nr85E7DMgNQ_V-S85cyF";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;