const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const fullKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, fullKey);

async function main() {
  console.log('Fetching all offerable_items for company obdtr to identify duplicates by SKU...');
  
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
    .select('*')
    .eq('company_id', company.id);

  if (error) {
    console.error('Error fetching items:', error);
    return;
  }

  // Group items by SKU/code
  const skuGroups = {};
  for (const item of items) {
    if (item.brand === 'DELETED' || item.category === 'DELETED') continue;
    const sku = item.code;
    if (!sku) continue;
    if (!skuGroups[sku]) skuGroups[sku] = [];
    skuGroups[sku].push(item);
  }

  console.log('Checking for duplicates...');
  for (const sku in skuGroups) {
    const group = skuGroups[sku];
    if (group.length > 1) {
      console.log(`\nDuplicate found for SKU: ${sku} (${group.length} items)`);
      
      // Sort group by created_at ascending (first created is original)
      group.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
      const original = group[0];
      const duplicates = group.slice(1);

      console.log(`  Original ID: ${original.id} (${original.name})`);
      for (const dup of duplicates) {
        console.log(`  Duplicate ID to merge & delete: ${dup.id} (${dup.name})`);
        
        // 1. Find stocks pointing to duplicate product ID
        const { data: stocks } = await supabase
          .from('product_stocks')
          .select('id, quantity')
          .eq('product_id', dup.id);
        
        if (stocks && stocks.length > 0) {
          console.log(`    Moving ${stocks.length} stock record(s) to original product ID...`);
          for (const s of stocks) {
            const { error: updErr } = await supabase
              .from('product_stocks')
              .update({ product_id: original.id })
              .eq('id', s.id);
            if (updErr) console.error('    Error moving stock:', updErr);
            else console.log(`      Moved stock row ${s.id} (qty ${s.quantity}) to original`);
          }
        }
        
        // 2. Delete duplicate product from offerable_items
        console.log(`    Deleting duplicate catalog product ID ${dup.id}...`);
        const { error: delErr } = await supabase
          .from('offerable_items')
          .delete()
          .eq('id', dup.id);
        if (delErr) console.error('    Error deleting duplicate:', delErr);
        else console.log(`      Deleted duplicate catalog product successfully`);
      }
    }
  }
  console.log('\nDatabase cleanup and stock merge complete!');
}

main().catch(console.error);
