const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: companies } = await supabase.from('companies').select('*');
  console.log("All companies:", companies);

  const { data: warehouses } = await supabase.from('warehouses').select('*, companies(code)');
  console.log("All warehouses count:", warehouses.length);
  warehouses.forEach(w => {
    console.log(`Warehouse: ${w.name}, Company Code: ${w.companies?.code}`);
  });
}

run();
