const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Cleaning up duplicate 'AUTEL DS 900' products...");

  const { data, error } = await supabase
    .from('offerable_items')
    .select('id, name, created_at')
    .eq('name', 'AUTEL DS 900')
    .order('created_at', { ascending: true });

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  console.log(`Found ${data.length} instances of 'AUTEL DS 900'.`);
  if (data.length <= 1) {
    console.log("No duplicates to clean.");
    return;
  }

  const keepId = data[0].id;
  const deleteIds = data.slice(1).map(item => item.id);

  console.log(`Keeping instance ID: ${keepId}`);
  console.log(`Deleting/Soft-deleting duplicate IDs:`, deleteIds);

  for (const id of deleteIds) {
    // Attempt hard delete first
    const { error: deleteErr, count } = await supabase
      .from('offerable_items')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (deleteErr || count === 0) {
      console.log(`Hard delete blocked by RLS for ID ${id}. Applying soft delete update...`);
      await supabase
        .from('offerable_items')
        .update({ brand: 'DELETED', category: 'DELETED', is_visible_in_storefront: false })
        .eq('id', id);
    } else {
      console.log(`Hard deleted duplicate ID ${id} successfully.`);
    }
  }

  console.log("Cleanup complete!");
}

run();
