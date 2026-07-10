const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const fullKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, fullKey);

async function main() {
  console.log('Fetching only items that HAVE stocks in the database for company obdtr...');
  
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('code', 'obdtr')
    .single();

  if (!company) {
    console.error('Company not found!');
    return;
  }

  const { data: stocks, error } = await supabase
    .from('product_stocks')
    .select(`
      id,
      quantity,
      product_id,
      warehouses(name),
      warehouse_locations(name),
      offerable_items(name, code)
    `)
    .eq('offerable_items.company_id', company.id);

  if (error) {
    console.error('Error:', error);
    return;
  }

  // Filter out stocks where offerable_items is null (means they are for another company)
  const obdtrStocks = stocks.filter(s => s.offerable_items);

  console.log(`Found ${obdtrStocks.length} stock records:`);
  for (const s of obdtrStocks) {
    const item = s.offerable_items;
    let nameStr = '';
    if (typeof item.name === 'string') {
      nameStr = item.name;
    } else if (item.name && typeof item.name === 'object') {
      nameStr = item.name.tr || item.name.en || JSON.stringify(item.name);
    }
    console.log(`- Stock ID: ${s.id} | Qty: ${s.quantity} | Item: ${nameStr} (SKU: ${item.code}) | Wh: ${s.warehouses?.name || 'none'} | Shelf: ${s.warehouse_locations?.name || 'none'}`);
  }
}

main().catch(console.error);
