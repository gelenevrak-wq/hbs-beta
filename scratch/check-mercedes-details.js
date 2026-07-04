const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Checking detailed fields of active Mercedes products...");

  const ids = ['9aaca09a-f53d-411f-adf8-ef192b1ff772', '40610c42-2299-42f2-bc72-9af19900cb4a'];

  const { data, error } = await supabase
    .from('offerable_items')
    .select('*')
    .in('id', ids);

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  console.log(`Fetched details for ${data.length} items.`);
  data.forEach((item, idx) => {
    console.log(`--- Product ${idx + 1} ---`);
    console.log("ID:", item.id);
    console.log("Name:", item.name);
    console.log("Brand:", item.brand);
    console.log("Category:", item.category);
    console.log("Storefront Visible:", item.is_visible_in_storefront);
    console.log("Public Search Visible:", item.is_visible_in_public_search);
    console.log("Code/SKU:", item.code);
  });
}

run();
