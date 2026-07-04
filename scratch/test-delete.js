const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Signing in as Altan Cancı...");

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'altancanci@obdtr.com',
    password: 'CANCI35'
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }

  console.log("Logged in successfully! User ID:", authData.user.id);

  // 1. Fetch some items
  const { data: items, error: fetchError } = await supabase
    .from('offerable_items')
    .select('id, name, code')
    .limit(5);

  if (fetchError) {
    console.error("Fetch error:", fetchError);
    return;
  }

  console.log("Fetched items under session:", items);

  if (items.length === 0) {
    console.log("No items in offerable_items to test delete.");
    return;
  }

  // Try to delete the first item
  const targetItem = items[0];
  console.log(`Attempting to delete item under auth: ${targetItem.name} (ID: ${targetItem.id}, Code: ${targetItem.code})...`);

  const { error: deleteError, count } = await supabase
    .from('offerable_items')
    .delete({ count: 'exact' })
    .eq('id', targetItem.id);

  if (deleteError) {
    console.error("Delete Error details:", deleteError);
  } else {
    console.log("Delete succeeded under auth! Count:", count);
  }
}

run();
