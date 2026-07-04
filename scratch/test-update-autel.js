const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Testing update on existing Autel product anonymously...");

  const targetId = '22222222-2222-2222-2222-222222222222';

  const { data, error } = await supabase
    .from('offerable_items')
    .update({ brand: 'AUTEL_TEST' })
    .eq('id', targetId)
    .select();

  if (error) {
    console.error("Update error:", error);
  } else {
    console.log("Update result (data):", data);
  }
}

run();
