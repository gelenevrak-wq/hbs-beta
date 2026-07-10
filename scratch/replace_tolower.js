const fs = require('fs');

let content = fs.readFileSync('app/dashboard/warehouses/page.tsx', 'utf8');

// Replace unsafe toLowerCase calls on product properties to use the safeLower helper
content = content.replace(/\bp\.warehouse\.toLowerCase\(\)/g, 'safeLower(p.warehouse)');
content = content.replace(/\bp\.shelf\.toLowerCase\(\)/g, 'safeLower(p.shelf)');
content = content.replace(/\bw\.name\.toLowerCase\(\)/g, 'safeLower(w.name)');
content = content.replace(/\bwh\.name\.toLowerCase\(\)/g, 'safeLower(wh.name)');
content = content.replace(/\bactiveWh\.name\.toLowerCase\(\)/g, 'safeLower(activeWh.name)');
content = content.replace(/\bsh\.toLowerCase\(\)/g, 'safeLower(sh)');
content = content.replace(/\bscannedShelfCode\.toLowerCase\(\)/g, 'safeLower(scannedShelfCode)');
content = content.replace(/\bstep\.shelf\.toLowerCase\(\)/g, 'safeLower(step.shelf)');
content = content.replace(/\bdestWh\.name\.toLowerCase\(\)/g, 'safeLower(destWh.name)');
content = content.replace(/\btransferDestShelf\.toLowerCase\(\)/g, 'safeLower(transferDestShelf)');
content = content.replace(/\btrans\.destWh\.toLowerCase\(\)/g, 'safeLower(trans.destWh)');
content = content.replace(/\btrans\.destShelf\.toLowerCase\(\)/g, 'safeLower(trans.destShelf)');
content = content.replace(/\bm\.warehouse\.toLowerCase\(\)/g, 'safeLower(m.warehouse)');
content = content.replace(/\bm\.shelf\.toLowerCase\(\)/g, 'safeLower(m.shelf)');
content = content.replace(/\bselectedWhiteboardShelfCode\.toLowerCase\(\)/g, 'safeLower(selectedWhiteboardShelfCode)');
content = content.replace(/\bwarehouseName\.toLowerCase\(\)/g, 'safeLower(warehouseName)');
content = content.replace(/\bshelfTransferToWarehouse\.toLowerCase\(\)/g, 'safeLower(shelfTransferToWarehouse)');
content = content.replace(/\bshelfTransferToShelf\.toLowerCase\(\)/g, 'safeLower(shelfTransferToShelf)');

fs.writeFileSync('app/dashboard/warehouses/page.tsx', content, 'utf8');
console.log('Successfully replaced all unsafe toLowerCase calls in app/dashboard/warehouses/page.tsx with safeLower!');
