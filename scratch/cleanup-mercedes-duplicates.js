const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Cleaning up duplicate Mercedes products...");

  // Keep these active IDs
  const keepIds = [
    '9aaca09a-f53d-411f-adf8-ef192b1ff772', // Mercedes Grubu C4 Set (Visible: true)
    '40610c42-2299-42f2-bc72-9af19900cb4a'  // Mercedes Grubu C6 Set (Visible: true)
  ];

  // Fetch all Mercedes products to identify duplicates
  const { data: items, error } = await supabase
    .from('offerable_items')
    .select('id, name, is_visible_in_storefront')
    .ilike('name', '%Mercedes%');

  if (error) {
    console.error("Fetch error:", error);
    return;
  }

  const deleteIds = items
    .filter(item => !keepIds.includes(item.id))
    .map(item => item.id);

  console.log("Deleting duplicate Mercedes IDs:", deleteIds);

  for (const id of deleteIds) {
    // Attempt hard delete
    const { error: deleteErr, count } = await supabase
      .from('offerable_items')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (deleteErr || count === 0) {
      console.log(`Hard delete blocked for ID ${id}. Applying soft delete update...`);
      await supabase
        .from('offerable_items')
        .update({ brand: 'DELETED', category: 'DELETED', is_visible_in_storefront: false })
        .eq('id', id);
    } else {
      console.log(`Hard deleted duplicate ID ${id} successfully.`);
    }
  }

  // Ensure active ones are visible
  console.log("Enabling storefront visibility for the remaining active Mercedes products...");
  await supabase
    .from('offerable_items')
    .update({ is_visible_in_storefront: true, is_visible_in_public_search: true })
    .in('id', keepIds);

  console.log("Mercedes cleanup complete!");
}

run();
