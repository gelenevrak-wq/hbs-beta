# HBS Clean Mobile Serious Build

Bu paket mevcut HBS projesinin temizlenmiş ve mobil tarafı ciddi biçimde sıkılaştırılmış sürümüdür.

## Çalıştırma

```bash
npm install
npm run dev
```

Tarayıcı:

```text
http://localhost:3001
```

Port 3001 değilse terminalde görünen Local adresi kullanın.

## Yapılan temel işler

- Ana sayfa mobilde kompakt hale getirildi.
- Dil seçici dropdown bozulmayacak şekilde küçültüldü.
- Müşteri portalı mobilde arama ve sonuç odaklı hale getirildi.
- Karışık Türkçe/Almanca sabit metinlerin büyük kısmı tek dil mantığına bağlandı.
- `components/layout` klasör adı Linux/production uyumluluğu için düzeltildi.
- `node_modules`, `.next`, iç içe geçmiş eski HBS klasörleri ve backup karmaşası paketten çıkarıldı.
