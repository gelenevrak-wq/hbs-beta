const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Testing update on oem_codes with a string value...");

  const testId = '9aaca09a-f53d-411f-adf8-ef192b1ff772'; // Mercedes Grubu C4 Set
  
  const { data, error } = await supabase
    .from('offerable_items')
    .update({ oem_codes: 'W205, W213, W222' })
    .eq('id', testId)
    .select();

  console.log("Update result - Error:", error, "Data:", data);
}

run();
