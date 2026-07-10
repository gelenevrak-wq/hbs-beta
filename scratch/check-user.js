const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*, companies(*)');
  
  if (error) {
    console.error("Error fetching profiles:", error);
  } else {
    console.log(`Found ${profiles.length} profiles:`);
    profiles.forEach(p => {
      console.log(`Email: ${p.email}, Role: ${p.role}, Company Code: ${p.companies?.code}, Company Name: ${p.companies?.name}`);
    });
  }
}

run();
