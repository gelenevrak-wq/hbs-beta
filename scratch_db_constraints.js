const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const supabaseAnonKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function main() {
  console.log('Testing raw insert to see what fails...');
  const { data, error } = await supabase
    .from('offerable_items')
    .insert({
      company_id: 'a123bc45-6789-abcd-ef01-234567890123',
      type: 'product',
      name: 'Test Duplicate',
      category: 'Genel',
      brand: 'Test',
      code: 'OBDTR-OPEL-MD2', // Same SKU as Opel MD2
      barcode: '',
      sale_price: 100,
      purchase_price: 50,
      description: 'Test'
    });

  if (error) {
    console.error('Insert failed with error:', error.message, error.code, error.details);
  } else {
    console.log('Insert succeeded! Data:', data);
  }
}

main().catch(console.error);
