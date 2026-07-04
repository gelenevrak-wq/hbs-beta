const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Checking current products for obdtr in database...");

  const { data, error } = await supabase
    .from('offerable_items')
    .select('*, companies!inner(code)')
    .eq('companies.code', 'obdtr');

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  console.log(`Found ${data.length} total items in DB for obdtr.`);
  data.forEach((item, idx) => {
    console.log(`[${idx + 1}] ID: ${item.id}, Name: ${item.name}, Brand: ${item.brand}, Category: ${item.category}, Visible: ${item.is_visible_in_storefront}`);
  });
}

run();
