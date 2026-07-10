const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: comp } = await supabase
    .from('companies')
    .select('id, name, code')
    .eq('code', 'ozgur-motor')
    .single();

  console.log("Company:", comp);

  if (comp) {
    const { data: whs } = await supabase
      .from('warehouses')
      .select('*')
      .eq('company_id', comp.id);
    console.log("Warehouses for ozgur-motor:", whs);
  }
}

run();
