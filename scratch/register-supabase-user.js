const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Attempting to register Altan Cancı in Supabase Auth...");

  const { data, error } = await supabase.auth.signUp({
    email: 'altancanci@obdtr.com',
    password: 'CANCI35',
    options: {
      data: {
        full_name: 'Altan Cancı',
        role: 'owner'
      }
    }
  });

  if (error) {
    console.error("Sign up error:", error);
  } else {
    console.log("Sign up succeeded! User details:", data.user);
  }
}

run();
