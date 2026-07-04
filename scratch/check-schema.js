const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Checking schema of offerable_items...");

  const { data: items, error } = await supabase
    .from('offerable_items')
    .select('*')
    .limit(1);

  if (error) {
    console.error("Schema error:", error);
    return;
  }

  if (items.length === 0) {
    console.log("No items in offerable_items to inspect.");
    return;
  }

  console.log("First item record:", JSON.stringify(items[0], null, 2));
}

run();
