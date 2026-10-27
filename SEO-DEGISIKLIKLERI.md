# MG Dijital — SEO güncelleme notları

Bu paket, mevcut statik HTML sitenin görünümünü koruyarak temel teknik SEO ve içerik iyileştirmeleri içerir.

## Yapılan değişiklikler

- Ana sayfanın `title`, `meta description`, H1 ve canonical adresi arama niyetine göre düzenlendi.
- Ana sayfa, iletişim ve demo sayfalarına canonical, Open Graph ve Twitter paylaşım metaverileri eklendi.
- Ana sayfaya `Organization` ve `WebSite`; iletişim sayfasına `ContactPage`; demo sayfasına `WebPage` yapılandırılmış verisi eklendi.
- `dijital-servis-formu.html` adlı özgün içerikli bir SEO sayfası eklendi. Sayfada form alanları, faydalar, kullanım alanları ve sık sorulan sorular bulunur.
- Ana sayfadan yeni SEO sayfasına bağlamsal iç bağlantı eklendi.
- Sosyal paylaşımlarda kullanılmak üzere 1200×630 boyutlarında `img/og-cover.png` üretildi.
- Demo bağlantıları `/demo/` canonical adresiyle tutarlı hâle getirildi.
- Sitemap, canonical URL'lerle eşleştirildi ve yeni sayfa eklendi.
- Gerçek LinkedIn adresi verilmediği için `[LINKEDIN]` yer tutucusu kaldırıldı.
- İletişim kartlarının ilk HTML içeriğine gerçek e-posta, telefon ve WhatsApp bağlantıları eklendi; formun e-posta taslağı açtığına dair mevcut açıklama korundu.
- Logo görsellerine açıklayıcı alt metin ve boyut nitelikleri eklendi.

## Yayına alma kontrol listesi

1. Değişiklikleri GitHub deposuna yükleyin veya mevcut yayınlama yönteminizle siteyi yeniden dağıtın.
2. Aşağıdaki sayfaların yayında açıldığını test edin:
   - `https://www.mgdijitalcozumler.com/`
   - `https://www.mgdijitalcozumler.com/dijital-servis-formu.html`
   - `https://www.mgdijitalcozumler.com/iletisim.html`
   - `https://www.mgdijitalcozumler.com/demo/`
3. `https://www.mgdijitalcozumler.com/robots.txt` ve `https://www.mgdijitalcozumler.com/sitemap.xml` dosyalarını kontrol edin.
4. Google Search Console'da sitemap'i gönderin; ana sayfa ve yeni içerik sayfası için URL Denetleme aracından dizine eklenmesini isteyin.
5. Google'ın sayfaları dizine eklemesi ve aramalardaki performansı göstermesi zaman alabilir. Bu dosyalar sıralama garantisi vermez.

## Dikkat edilmesi gerekenler

- Canonical adresler `https://www.mgdijitalcozumler.com` alan adını esas alır. Yayında alan adının `www` ve `www` olmayan sürümlerinin tek bir tercih edilen sürüme yönlendirildiğini kontrol edin.
- Mevcut form demosu tarayıcının yazdırma penceresi üzerinden PDF kaydını gösterir. Bu paket, arka uçta e-posta gönderimi, form veritabanı kaydı veya hukuken geçerli elektronik imza altyapısı eklemez.
- Yeni sayfadaki sektör ve mevzuat açıklamaları genel bilgilendirme amaçlıdır; sektör bazındaki zorunlu kayıt/imza koşulları ayrıca doğrulanmalıdır.
