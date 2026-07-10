const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: comp } = await supabase
    .from('companies')
    .select('id, name, code')
    .eq('code', 'obdtr')
    .single();

  console.log("Company 'obdtr' ID:", comp.id);

  const { data: whs } = await supabase
    .from('warehouses')
    .select('id, name, company_id')
    .eq('company_id', comp.id);
  
  console.log(`Found ${whs.length} warehouses matching company ID directly:`);
  whs.forEach(w => {
    console.log(`Warehouse: ${w.name}, company_id: ${w.company_id}`);
  });
}

run();
