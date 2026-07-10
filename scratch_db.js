const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('Fetching offerable_items for company obdtr...');
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('code', 'obdtr')
    .single();

  if (!company) {
    console.error('Company not found!');
    return;
  }
  console.log('Company ID:', company.id);

  const { data: items, error } = await supabase
    .from('offerable_items')
    .select(`
      id,
      name,
      brand,
      code,
      barcode,
      product_stocks(
        id,
        quantity,
        warehouse_id,
        location_id,
        warehouses(name),
        warehouse_locations(name)
      )
    `)
    .eq('company_id', company.id);

  if (error) {
    console.error('Error fetching items:', error);
    return;
  }

  console.log(`Found ${items.length} items. Filtering for items with "Opel" or "Peugeot" or quantities...`);
  for (const item of items) {
    const name = item.name || '';
    if (name.toLowerCase().includes('opel') || name.toLowerCase().includes('peugeot')) {
      console.log(`\n- Item: ${name} (${item.brand})`);
      console.log(`  ID: ${item.id}`);
      console.log(`  SKU: ${item.code}, Barcode: ${item.barcode}`);
      console.log(`  Stocks:`, JSON.stringify(item.product_stocks, null, 2));
    }
  }
}

main().catch(console.error);
