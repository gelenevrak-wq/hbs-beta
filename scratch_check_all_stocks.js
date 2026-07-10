const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const fullKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, fullKey);

async function main() {
  console.log('Fetching all offerable_items and their stocks for company obdtr...');
  
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('code', 'obdtr')
    .single();

  if (!company) {
    console.error('Company not found!');
    return;
  }

  const { data: items, error } = await supabase
    .from('offerable_items')
    .select(`
      id,
      name,
      code,
      product_stocks(
        id,
        quantity,
        warehouses(name),
        warehouse_locations(name)
      )
    `)
    .eq('company_id', company.id);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Found ${items.length} items:`);
  for (const item of items) {
    let nameStr = '';
    if (typeof item.name === 'string') {
      nameStr = item.name;
    } else if (item.name && typeof item.name === 'object') {
      nameStr = item.name.tr || item.name.en || JSON.stringify(item.name);
    }
    
    if (nameStr.includes('DELETED')) continue;
    
    const stocks = item.product_stocks || [];
    console.log(`- ${nameStr} (SKU: ${item.code})`);
    if (stocks.length === 0) {
      console.log('  [NO STOCKS]');
    } else {
      for (const s of stocks) {
        console.log(`  * Stock ID ${s.id}: Qty ${s.quantity} | Wh: ${s.warehouses?.name || 'none'} | Shelf: ${s.warehouse_locations?.name || 'none'}`);
      }
    }
  }
}

main().catch(console.error);
