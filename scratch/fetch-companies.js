const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fetching companies from Supabase...");

  const { data: companies, error } = await supabase
    .from('companies')
    .select('*');

  if (error) {
    console.error("Companies fetch error:", error);
    return;
  }

  console.log("Companies:", companies);
}

run();
