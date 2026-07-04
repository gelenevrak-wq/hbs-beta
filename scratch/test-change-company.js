const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Testing company_id nullification for soft-delete...");

  // 1. Insert a test item
  const { data: insertData, error: insertError } = await supabase
    .from('offerable_items')
    .insert({
      company_id: 'a123bc45-6789-abcd-ef01-234567890123',
      name: 'TEST SOFT DELETE ' + Date.now(),
      type: 'product',
      code: 'SKU-SD-' + Date.now(),
      currency: 'TRY'
    })
    .select();

  if (insertError) {
    console.error("Insert error:", insertError);
    return;
  }

  const newId = insertData[0].id;
  console.log("Inserted item successfully! ID:", newId);

  // 2. Try to update company_id to null
  console.log("Attempting to set company_id to null...");
  const { data: updateData1, error: updateError1 } = await supabase
    .from('offerable_items')
    .update({ company_id: null })
    .eq('id', newId)
    .select();

  if (updateError1) {
    console.error("Update to null failed:", updateError1);
    
    // If null is not allowed (due to NOT NULL constraint), try to set it to a dummy UUID
    console.log("Trying to set company_id to a dummy UUID...");
    const { data: updateData2, error: updateError2 } = await supabase
      .from('offerable_items')
      .update({ company_id: '00000000-0000-0000-0000-000000000000' }) // a invalid UUID
      .eq('id', newId)
      .select();

    if (updateError2) {
      console.error("Update to dummy UUID failed too:", updateError2);
    } else {
      console.log("Update to dummy UUID succeeded!", updateData2);
    }
  } else {
    console.log("Update to null succeeded!", updateData1);
  }
}

run();
