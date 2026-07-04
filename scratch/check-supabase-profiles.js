const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fetching profiles from Supabase...");

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*, companies(*)');

  if (error) {
    console.error("Profiles error:", error);
    return;
  }

  console.log("Profiles list in Supabase:");
  profiles.forEach(p => {
    console.log(`ID: ${p.id}, Full Name: ${p.full_name}, Role: ${p.role}, Company: ${p.companies ? p.companies.name : 'None'} (Code: ${p.companies ? p.companies.code : 'N/A'})`);
  });
}

run();
