const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  console.log("Simulating deleteProduct function with exact parameters...");

  const testId = 'ad7259b7-7121-47fa-927e-b179d1c7aae5'; // Autel Ultra S2 EV Kit & VCMI 2
  
  try {
    const { error, count } = await supabase
      .from("offerable_items")
      .delete({ count: "exact" })
      .eq("id", testId);

    console.log("Delete call result - Error:", error, "Count:", count);
    
    if (error || count === 0) {
      console.log("Falling back to soft-delete update...");
      const { data, error: updateError } = await supabase
        .from("offerable_items")
        .update({ brand: "DELETED", category: "DELETED", is_visible_in_storefront: false })
        .eq("id", testId)
        .select();
        
      console.log("Update result - Error:", updateError, "Data:", data);
    }
  } catch (e) {
    console.error("Exception caught in delete logic:", e);
  }
}

run();
