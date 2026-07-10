const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyand_XThTkPbP'; // Wait, let's use the correct key from env.local
const fullKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, fullKey);

async function main() {
  console.log('Fetching stock movements for Opel Grubu MD2...');
  
  const { data: movements, error } = await supabase
    .from('stock_movements')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching movements:', error);
    return;
  }

  console.log(`Found ${movements.length} movements.`);
  for (const m of movements) {
    console.log(`\nMovement:`, JSON.stringify(m, null, 2));
  }
}

main().catch(console.error);
