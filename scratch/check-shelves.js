const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: locs, error } = await supabase
    .from('warehouse_locations')
    .select('*');
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log(`Found ${locs.length} locations:`);
    const invalid = locs.filter(l => !l.name || typeof l.name !== 'string');
    console.log(`Invalid locations count: ${invalid.length}`);
    if (invalid.length > 0) {
      console.log("Sample invalid:", invalid.slice(0, 10));
    }
  }
}

run();
