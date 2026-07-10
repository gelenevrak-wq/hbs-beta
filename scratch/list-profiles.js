const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, company_id, full_name, role');
  
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("All profiles:", profiles);
  }
}

run();
