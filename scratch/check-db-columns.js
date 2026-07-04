const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Checking columns of offerable_items...");

  const { data, error } = await supabase
    .from('offerable_items')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  if (data.length === 0) {
    console.log("No items found.");
    return;
  }

  console.log("Columns:", Object.keys(data[0]));
  console.log("Sample values:", data[0]);
}

run();
