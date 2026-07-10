const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const fullKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, fullKey);

const ANA_DEPO_ID = 'a04b1c7a-29c4-4e1b-9934-aa718e92237b';

async function main() {
  console.log('Restoring product quantities back to 10 for all 27 active products...');
  
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
        warehouse_id,
        location_id
      )
    `)
    .eq('company_id', company.id);

  if (error) {
    console.error('Error fetching items:', error);
    return;
  }

  // Filter out items that are marked as deleted
  const activeItems = items.filter(item => {
    let nameStr = '';
    if (typeof item.name === 'string') nameStr = item.name;
    else if (item.name && typeof item.name === 'object') nameStr = item.name.tr || item.name.en || '';
    return nameStr && !nameStr.includes('DELETED') && item.brand !== 'DELETED' && item.category !== 'DELETED';
  });

  console.log(`Active items count: ${activeItems.length}`);

  for (const item of activeItems) {
    const trName = typeof item.name === 'object' ? item.name.tr : item.name;
    const stocks = item.product_stocks || [];
    
    // Sum total quantity currently in database for this item
    const totalQty = stocks.reduce((acc, s) => acc + (parseFloat(s.quantity) || 0), 0);
    console.log(`- Product: "${trName}" | Current Total Qty: ${totalQty}`);

    if (totalQty < 10) {
      const missingQty = 10 - totalQty;
      console.log(`  Need to add ${missingQty} units...`);

      // Find if there is an existing unplaced stock record for this warehouse
      const unplacedStock = stocks.find(s => s.warehouse_id === ANA_DEPO_ID && !s.location_id);

      if (unplacedStock) {
        const newQty = (parseFloat(unplacedStock.quantity) || 0) + missingQty;
        console.log(`  Updating existing unplaced stock ID ${unplacedStock.id} to new quantity: ${newQty}`);
        const { error: updErr } = await supabase
          .from('product_stocks')
          .update({ quantity: newQty })
          .eq('id', unplacedStock.id);
        if (updErr) console.error('  Error updating stock:', updErr);
      } else {
        console.log(`  Inserting new unplaced stock of ${missingQty} units in Ana Depo...`);
        const { error: insErr } = await supabase
          .from('product_stocks')
          .insert({
            product_id: item.id,
            warehouse_id: ANA_DEPO_ID,
            location_id: null,
            quantity: missingQty,
            status: 'available'
          });
        if (insErr) console.error('  Error inserting stock:', insErr.message);
      }
    } else {
      console.log('  Quantity is already 10 or greater. No action needed.');
    }
  }

  console.log('Restoration complete!');
}

main().catch(console.error);
