const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fetching all warehouses...");
  const { data: warehouses, error: whErr } = await supabase
    .from('warehouses')
    .select('*');

  if (whErr) {
    console.error("Fetch warehouses error:", whErr);
    return;
  }

  console.log(`Found ${warehouses.length} warehouses.`);

  // Group by name (lowercase and trimmed) and company_id
  const groups = {};
  warehouses.forEach(wh => {
    const key = `${wh.company_id}::${wh.name.trim().toLowerCase()}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(wh);
  });

  for (const key in groups) {
    const list = groups[key];
    if (list.length <= 1) continue;

    console.log(`\nDuplicate found for group: "${key}" (${list.length} instances)`);
    
    // We will keep the first instance
    const keepWh = list[0];
    const duplicates = list.slice(1);

    console.log(`Keeping warehouse ID: ${keepWh.id} ("${keepWh.name}")`);

    for (const dup of duplicates) {
      console.log(`Processing duplicate ID: ${dup.id} ("${dup.name}")...`);

      // 1. Move any product stock pointing to duplicate warehouse to the kept warehouse
      const { data: stocks, error: stockFetchErr } = await supabase
        .from('product_stocks')
        .select('id, location_id')
        .eq('warehouse_id', dup.id);

      if (stockFetchErr) {
        console.error("Error fetching stocks for duplicate:", stockFetchErr);
        continue;
      }

      if (stocks && stocks.length > 0) {
        console.log(`Moving ${stocks.length} stock rows to kept warehouse...`);
        for (const stock of stocks) {
          // If the stock has a location (shelf), we need to find or create that location in the kept warehouse!
          let newLocId = null;
          if (stock.location_id) {
            const { data: oldLoc } = await supabase
              .from('warehouse_locations')
              .select('name')
              .eq('id', stock.location_id)
              .maybeSingle();

            if (oldLoc) {
              const { data: newLoc } = await supabase
                .from('warehouse_locations')
                .select('id')
                .eq('warehouse_id', keepWh.id)
                .ilike('name', oldLoc.name.trim())
                .maybeSingle();

              if (newLoc) {
                newLocId = newLoc.id;
              } else {
                // Insert the location into the kept warehouse
                const { data: insertedLoc } = await supabase
                  .from('warehouse_locations')
                  .insert({
                    warehouse_id: keepWh.id,
                    name: oldLoc.name,
                    sort_order: 10
                  })
                  .select('id')
                  .single();
                if (insertedLoc) newLocId = insertedLoc.id;
              }
            }
          }

          await supabase
            .from('product_stocks')
            .update({
              warehouse_id: keepWh.id,
              location_id: newLocId
            })
            .eq('id', stock.id);
        }
      }

      // 2. Delete locations associated with duplicate warehouse
      await supabase
        .from('warehouse_locations')
        .delete()
        .eq('warehouse_id', dup.id);

      // 3. Delete the duplicate warehouse itself
      const { error: deleteErr } = await supabase
        .from('warehouses')
        .delete()
        .eq('id', dup.id);

      if (deleteErr) {
        console.error(`Failed to delete warehouse duplicate ${dup.id}:`, deleteErr);
      } else {
        console.log(`Deleted warehouse duplicate ${dup.id} successfully.`);
      }
    }
  }

  console.log("\nWarehouse deduplication and stock migration complete!");
}

run();
