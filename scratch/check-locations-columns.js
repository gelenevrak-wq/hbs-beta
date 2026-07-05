const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: wh, error: whErr } = await supabase
    .from('warehouses')
    .insert({
      company_id: 'a123bc45-6789-abcd-ef01-234567890123',
      name: 'TEMP_WH_LOC_2',
      type: 'store'
    })
    .select('*');

  if (whErr) {
    console.error("WH Insert error:", whErr);
    return;
  }

  const whId = wh[0].id;

  console.log("Inserting blank row into warehouse_locations to see columns...");
  const { data, error } = await supabase
    .from('warehouse_locations')
    .insert({
      warehouse_id: whId
    })
    .select('*');

  if (error) {
    console.error("Insert error detail:", error);
  } else {
    console.log("Success! Columns in warehouse_locations:", Object.keys(data[0]));
    console.log("Inserted row data:", data[0]);

    // Clean up
    await supabase
      .from('warehouse_locations')
      .delete()
      .eq('id', data[0].id);
  }

  // Clean up wh
  await supabase
    .from('warehouses')
    .delete()
    .eq('id', whId);
}

run();
