const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const slug = 'ozgur-motor';
  const { data, error } = await supabase
    .from("offerable_items")
    .select(`
      *,
      companies!inner(code),
      product_stocks(
        quantity,
        warehouses(name),
        warehouse_locations(name)
      )
    `)
    .eq("companies.code", slug);
  
  if (error) {
    console.error("Supabase Query Error:", error);
  } else {
    console.log("Query Succeeded, items count:", data.length);
  }
}

run();
