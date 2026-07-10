const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const fullKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, fullKey);

async function main() {
  console.log('Fetching all offerable_items for company obdtr...');
  
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

  console.log('Processing duplicate SKUs for soft delete...');
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
        console.log(`  Duplicate ID to merge & soft-delete: ${dup.id} (${dup.name})`);
        
        // 1. Move stocks pointing to duplicate product ID to original product ID
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
        
        // 2. Set duplicate product brand/category to 'DELETED'
        console.log(`    Soft-deleting catalog item ${dup.id} by setting brand/category to DELETED...`);
        const { error: softDelErr } = await supabase
          .from('offerable_items')
          .update({ brand: 'DELETED', category: 'DELETED' })
          .eq('id', dup.id);
        if (softDelErr) console.error('    Error soft-deleting:', softDelErr);
        else console.log(`      Soft-deleted catalog product successfully`);

        // 3. Clear any remaining stocks left on this duplicate product
        await supabase
          .from('product_stocks')
          .delete()
          .eq('product_id', dup.id);
      }
    }
  }

  // Also verify total quantities under the original product IDs
  console.log('\nVerifying and consolidating stocks for original products...');
  for (const sku in skuGroups) {
    const group = skuGroups[sku];
    const original = group[0];
    
    const { data: stocks } = await supabase
      .from('product_stocks')
      .select('id, quantity, location_id')
      .eq('product_id', original.id);
    
    if (stocks && stocks.length > 0) {
      // Sum the total stock
      const totalQty = stocks.reduce((acc, s) => acc + (parseFloat(s.quantity) || 0), 0);
      console.log(`- Product "${sku}": Total Quantity = ${totalQty}`);
      
      // If total exceeds 10, reduce unplaced stock so that total is exactly 10
      if (totalQty > 10) {
        const excess = totalQty - 10;
        console.log(`  Excess stock detected: ${excess} units. Adjusting unplaced stocks...`);
        const unplacedStocks = stocks.filter(s => !s.location_id);
        let remainingExcess = excess;
        
        for (const ups of unplacedStocks) {
          const qty = parseFloat(ups.quantity) || 0;
          if (qty >= remainingExcess) {
            const newQty = qty - remainingExcess;
            if (newQty === 0) {
              await supabase.from('product_stocks').delete().eq('id', ups.id);
              console.log(`    Deleted empty unplaced stock record ${ups.id}`);
            } else {
              await supabase.from('product_stocks').update({ quantity: newQty }).eq('id', ups.id);
              console.log(`    Reduced unplaced stock record ${ups.id} to ${newQty}`);
            }
            remainingExcess = 0;
            break;
          } else {
            await supabase.from('product_stocks').delete().eq('id', ups.id);
            console.log(`    Deleted excess unplaced stock record ${ups.id}`);
            remainingExcess -= qty;
          }
        }
      }
    }
  }

  console.log('\nSoft delete cleanup and stock consolidation complete!');
}

main().catch(console.error);
