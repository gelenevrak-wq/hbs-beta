const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Testing insert/update anonymously with random ID...");

  // Generate a random UUID-like string or let postgres generate it
  // Actually, we can omit 'id' and let postgres generate a UUID!
  
  // Try to insert a dummy item
  const { data: insertData, error: insertError } = await supabase
    .from('offerable_items')
    .insert({
      company_id: 'a123bc45-6789-abcd-ef01-234567890123',
      name: 'TEST INSERT ANON ' + Date.now(),
      type: 'product',
      code: 'SKU-' + Date.now(),
      currency: 'TRY',
      is_visible_in_storefront: true
    })
    .select();

  if (insertError) {
    console.error("Insert Error details:", insertError);
  } else {
    console.log("Insert succeeded anonymously! Data:", insertData);
    const newId = insertData[0].id;
    console.log("New ID is:", newId);

    // Try to update it
    const { data: updateData, error: updateError } = await supabase
      .from('offerable_items')
      .update({ name: 'TEST UPDATE ANON ' + Date.now() })
      .eq('id', newId)
      .select();

    if (updateError) {
      console.error("Update Error details:", updateError);
    } else {
      console.log("Update succeeded anonymously! Data:", updateData);
    }

    // Try to delete it
    const { error: deleteError, count } = await supabase
      .from('offerable_items')
      .delete({ count: 'exact' })
      .eq('id', newId);

    if (deleteError) {
      console.error("Delete Error details:", deleteError);
    } else {
      console.log("Delete succeeded for our inserted item! Count:", count);
    }
  }
}

run();
