const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rxihusojlhtmbohdxmju.supabase.co';
const fullKey = 'sb_publishable_L1xdyrJQI4Zkg6k6B1cBbg_XThTkPbP';

const supabase = createClient(supabaseUrl, fullKey);

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function main() {
  const storeSlug = 'obdtr';
  const targetCompanyId = 'a123bc45-6789-abcd-ef01-234567890123';
  
  // Let's mock a split operation:
  // Original product ID: 4b95ca23-550c-40a4-b80a-f3d753aff968 (Opel Grubu MD2)
  // Original quantity: 10, shelf: "" (unplaced)
  // We place 1 unit on A-01-01.
  // So:
  // - Original product gets quantity 9, shelf ""
  // - New split product gets a new UUID, quantity 1, shelf "A-01-01"
  
  const productId = '4b95ca23-550c-40a4-b80a-f3d753aff968';
  const newId = 'e2b96ea3-8822-4745-9876-c56a7ffe8cba'; // generated UUID
  
  const oldProducts = [
    {
      id: productId,
      name: 'Opel Grubu MD2 Yetkili Servis Cihazı',
      category: 'Genel',
      brand: 'OPEL',
      sku: 'OBDTR-OPEL-MD2',
      barcode: '',
      quantity: '10',
      warehouse: 'Ana Depo',
      shelf: ''
    }
  ];

  const updatedList = [
    {
      id: productId,
      name: 'Opel Grubu MD2 Yetkili Servis Cihazı',
      category: 'Genel',
      brand: 'OPEL',
      sku: 'OBDTR-OPEL-MD2',
      barcode: '',
      quantity: '9', // reduced by 1
      warehouse: 'Ana Depo',
      shelf: ''
    },
    {
      id: newId, // new split product
      name: 'Opel Grubu MD2 Yetkili Servis Cihazı',
      category: 'Genel',
      brand: 'OPEL',
      sku: 'OBDTR-OPEL-MD2',
      barcode: '',
      quantity: '1', // placed 1
      warehouse: 'Ana Depo',
      shelf: 'A-01-01'
    }
  ];

  console.log('Simulating saveProductsStateAndSync...');
  
  const finalList = [...updatedList];
  const insertsPayload = [];
  const stockUpdates = [];

  for (let i = 0; i < finalList.length; i++) {
    const prod = finalList[i];
    const oldProd = oldProducts.find(p => p.id === prod.id);
    const hasChanged = !oldProd || 
      oldProd.quantity !== prod.quantity || 
      oldProd.warehouse !== prod.warehouse || 
      oldProd.shelf !== prod.shelf;

    if (hasChanged) {
      const isUuid = uuidRegex.test(prod.id);
      if (isUuid && oldProd) {
        stockUpdates.push(prod);
      } else if (!oldProd) {
        insertsPayload.push({ index: i, prod });
      }
    }
  }

  console.log('stockUpdates:', JSON.stringify(stockUpdates, null, 2));
  console.log('insertsPayload:', JSON.stringify(insertsPayload, null, 2));

  // 1. Update existing products' stocks
  for (const prod of stockUpdates) {
    try {
      console.log(`Processing stock update for prod.id = ${prod.id} (${prod.name})`);
      let locId = null;
      let whId = null;
      
      if (prod.shelf) {
        const { data: loc } = await supabase
          .from("warehouse_locations")
          .select("id, warehouse_id")
          .ilike("name", prod.shelf.trim())
          .limit(1)
          .maybeSingle();
        if (loc) {
          locId = loc.id;
          whId = loc.warehouse_id;
        }
      }

      if (!whId && prod.warehouse) {
        const { data: wh } = await supabase
          .from("warehouses")
          .select("id")
          .eq("company_id", targetCompanyId)
          .ilike("name", prod.warehouse.trim())
          .limit(1)
          .maybeSingle();
        if (wh) whId = wh.id;
      }

      console.log(`Resolved location_id: ${locId}, warehouse_id: ${whId}`);

      const { data: existingStock } = await supabase
        .from("product_stocks")
        .select("id")
        .eq("product_id", prod.id)
        .maybeSingle();

      const qtyVal = parseFloat(prod.quantity) || 0;
      console.log(`existingStock:`, existingStock, `qtyVal:`, qtyVal);

      if (existingStock) {
        console.log(`Updating existing stock row ${existingStock.id} to qty = ${qtyVal}, location = ${locId}`);
        const { error: updErr } = await supabase
          .from("product_stocks")
          .update({
            quantity: qtyVal,
            warehouse_id: whId || undefined,
            location_id: locId
          })
          .eq("id", existingStock.id);
        if (updErr) console.error('Update error:', updErr);
      } else {
        console.log(`Inserting new stock row for product_id = ${prod.id}`);
        const { error: insErr } = await supabase
          .from("product_stocks")
          .insert({
            product_id: prod.id,
            warehouse_id: whId || null,
            location_id: locId || null,
            quantity: qtyVal,
            status: "available"
          });
        if (insErr) console.error('Insert error:', insErr);
      }
    } catch (e) {
      console.error("Error updating stock levels inside loop:", e);
    }
  }

  // 2. Insert new products and then create their stocks
  for (const item of insertsPayload) {
    const { prod, index } = item;
    try {
      console.log(`Processing insert for prod.id = ${prod.id} (${prod.name})`);
      const { data, error } = await supabase
        .from("offerable_items")
        .insert({
          company_id: targetCompanyId,
          type: "product",
          name: prod.name,
          category: prod.category || "Genel",
          brand: prod.brand || "",
          code: prod.sku || `SKU-${Date.now()}`,
          barcode: prod.barcode || "",
          sale_price: parseFloat(prod.salePrice) || null,
          purchase_price: parseFloat(prod.purchasePrice) || null,
          description: prod.description || "",
          photo_urls: prod.imageUrl ? [prod.imageUrl] : []
        })
        .select()
        .single();

      if (error) {
        console.error("Database insert failed for new product transfer:", error.message, error.code);
      } else if (data) {
        console.log(`Successfully inserted new offerable_item! New ID = ${data.id}`);
        finalList[index] = {
          ...prod,
          id: data.id
        };
        
        let locId = null;
        let whId = null;
        
        if (prod.shelf) {
          const { data: loc } = await supabase
            .from("warehouse_locations")
            .select("id, warehouse_id")
            .ilike("name", prod.shelf.trim())
            .limit(1)
            .maybeSingle();
          if (loc) {
            locId = loc.id;
            whId = loc.warehouse_id;
          }
        }

        if (!whId && prod.warehouse) {
          const { data: wh } = await supabase
            .from("warehouses")
            .select("id")
            .eq("company_id", targetCompanyId)
            .ilike("name", prod.warehouse.trim())
            .limit(1)
            .maybeSingle();
          if (wh) whId = wh.id;
        }

        console.log(`Inserting stock record for new product ID = ${data.id} at location = ${locId}, qty = ${prod.quantity}`);
        const { error: stockInsErr } = await supabase
          .from("product_stocks")
          .insert({
            product_id: data.id,
            warehouse_id: whId || null,
            location_id: locId || null,
            quantity: parseFloat(prod.quantity) || 0,
            status: "available"
          });
        if (stockInsErr) console.error('Stock insert error:', stockInsErr);
      }
    } catch (e) {
      console.error("Error inserting new product inside loop:", e);
    }
  }
}

main().catch(console.error);
