const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Fetching database tables list using query...");
  // Let's run a select query on pg_tables or information_schema.tables via a fetch to RPC if exists,
  // or query a known table, or check metadata.
  // Actually, we can fetch all tables using an RPC or SQL if there's any RPC defined.
  // Let's inspect the supabase client keys or query.
  // Let's check what happens if we query a dummy table name - it might return error with suggestion or lists.
  // But wait! Is there any schema info?
  // Let's check if there is an table named 'warehouses' and if we can insert/upsert to it!
  const { data, error } = await supabase.from('warehouses').select('*');
  console.log("warehouses table query:", { data, error });
}

run();
