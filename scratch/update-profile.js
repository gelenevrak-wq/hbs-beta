const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const profileId = 'ff77ec47-8031-44a5-88c5-ec1a2138397e';
  const companyId = '5cb94c7b-cc66-44a7-89c7-9cfd5c5d3036'; // Özgür Motor

  const { data, error } = await supabase
    .from('profiles')
    .update({ company_id: companyId })
    .eq('id', profileId)
    .select();
  
  if (error) {
    console.error("Error updating profile:", error);
  } else {
    console.log("Profile updated successfully:", data);
  }
}

run();
