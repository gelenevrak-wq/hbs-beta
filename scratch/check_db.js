const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase
    .from('offerable_items')
    .select(`
      id,
      name,
      code,
      companies!inner(code),
      product_stocks(
        quantity,
        warehouses(name),
        warehouse_locations(name)
      )
    `)
    .eq('companies.code', 'ozgur-motor')
    .limit(2);

  if (error) {
    console.error("Error fetching joined product stocks:", error);
  } else {
    console.log("Success! Data:", JSON.stringify(data, null, 2));
  }
}

run();
