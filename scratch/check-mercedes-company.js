const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Checking company relationships of Mercedes products...");

  const { data, error } = await supabase
    .from('offerable_items')
    .select('id, name, is_visible_in_storefront, companies(code)')
    .ilike('name', '%Mercedes%');

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  console.log(`Found ${data.length} Mercedes products.`);
  data.forEach((item, idx) => {
    console.log(`[${idx + 1}] ID: ${item.id}, Name: ${item.name}, Visible: ${item.is_visible_in_storefront}, Store Code: ${item.companies ? item.companies.code : 'None'}`);
  });
}

run();
