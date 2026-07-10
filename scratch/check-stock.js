const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: comp } = await supabase
    .from('companies')
    .select('id, name, code')
    .eq('code', 'ozgur-motor')
    .single();

  console.log("Company:", comp);

  if (comp) {
    const { data: items, error } = await supabase
      .from('offerable_items')
      .select('id, name, product_stocks(*, warehouses(name), warehouse_locations(name))')
      .eq('company_id', comp.id);
    
    if (error) {
      console.error("Error fetching items:", error);
    } else {
      console.log(`Found ${items.length} items:`);
      const stocks = items.filter(item => item.product_stocks && item.product_stocks.length > 0);
      console.log(`Found ${stocks.length} items with stock records:`);
      stocks.slice(0, 10).forEach(item => {
        const s = item.product_stocks[0];
        console.log(`Product: ${item.name}, Qty: ${s.quantity}, Warehouse: ${s.warehouses?.name}, Location: ${s.warehouse_locations?.name}`);
      });
    }
  }
}

run();
