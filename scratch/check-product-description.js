const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fetching some products to inspect 'name' and 'description' values...");
  const { data, error } = await supabase
    .from('offerable_items')
    .select('id, name, description')
    .limit(10);

  if (error) {
    console.error("Error fetching items:", error);
  } else {
    data.forEach((p, idx) => {
      console.log(`\nProduct [${idx}]: ID=${p.id}`);
      console.log("Name type:", typeof p.name, "Value:", p.name);
      console.log("Description type:", typeof p.description, "Value:", p.description);
    });
  }
}

run();
