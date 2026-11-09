# Semih Ötleş için SEO çalışması

Asıl adres: **https://www.profdrsemihotles.com.tr/**. Değişiklikler `fke/semih-otles-seo` dalında inceleme için hazırlanmıştır; commit ve yayın ayrıca kullanıcı onayı gerektirir.

## Hedef aramalar

| Arama grubu | Sayfadaki karşılığı |
| --- | --- |
| Semih Ötleş, Semih Otles | Adı içeren ana başlık, sayfa başlığı, kişi şeması ve akademik profil bağlantıları |
| Profesör Semih Ötleş, doktor Semih Ötleş, profesör doktor Semih Ötleş | `Prof. Dr.` ana başlığı; biyografide doğal biçimde geçen `Profesör Doktor` unvanı |
| Semih Ötleş gıda mühendisi, gıda mühendisliği, gıda kimyası | Giriş metni, açıklama, araştırma alanları ve meslek bilgisi |
| Semih Ötleş Ege Üniversitesi, rektör yardımcısı, dekan yardımcısı, PLM | Tarihleriyle birlikte doğrudan HTML'de sunulan akademik ve idari görevler |
| Semih Ötleş kitapları, yayınları, ödülleri | Mevcut kitap/yayın bölümleri ve ilk HTML yanıtına eklenen ödüller |

`Gıda mühendisi` tek başına çok daha geniş bir arama niyetidir; başlangıç önceliği isim, unvan, üniversite ve uzmanlık birleşimleridir. Yanlış yazımlar için ayrı sayfalar, tekrar eden anahtar kelime listeleri ve `meta keywords` eklenmemiştir. Doktor unvanı akademik bağlamda kullanılır; hekimlik veya sağlık hizmeti iddiası kurulmaz.

## Uygulanan değişiklikler

- Başlık: **Prof. Dr. Semih Ötleş | Gıda Mühendisi ve Akademisyen**.
- Açıklama, gıda mühendisliği, Ege Üniversitesi görevleri, gıda kimyası, kitaplar ve yayınları özetler. Ana `h1` kişiyi adıyla tanımlar; bölüm başlıkları içerikleri açıkça belirtir.
- Eğitim, araştırma alanları, 132 görev kaydı, üyelikler, ödüller ve projeler build sırasında HTML'e aktarılır. Tarayıcıda aynı ortak renderer üzerine arama, filtreleme ve sayfalama eklenir. JavaScript kapalıyken çalışmayan arama ve filtre kontrolleri gizlidir. Kitap kataloğu ve yayın arşivinin mevcut tarayıcı işleyişi devam eder.
- `WebSite`, `ProfilePage` ve `Person` JSON-LD grafiği; kişinin adı, gerçek portresi, `Semih Otles` yazımı, akademik unvanı, araştırma alanları, ödülleri ve sayfada da görünen Ege Üniversitesi / Google Scholar bağlantılarıyla oluşturulur. Üniversite mezuniyeti belirtilir; geçmiş idari görevler güncel işveren/görev olarak işaretlenmez.
- Canonical, sitemap, Open Graph ve Twitter URL'leri aynı asıl HTTPS adresinden üretilir. Profil portresi paylaşım görselidir. `render.yaml` içinde `SITE_URL` açıkça tanımlıdır; build betiğinin varsayılanı da bu adrestir.
- Sitemap yalnızca gerçek ana sayfayı içerir. Bölüm bağlantıları ayrı URL gibi eklenmez. Gerçek bir içerik değişikliğine dayanmayan `lastmod` veya görünür başarı/istatistik iddiaları üretilmez.

Bu uygulama, başlıkların ve ana içeriğin anlaşılır olması, ilk HTML yanıtının içeriği taşıması ve kişi odaklı profil işaretlemesi konularında Google yönergelerini izler. Yapılandırılmış veri, belirli bir sıralama veya özel sonuç görünümü garantilemez. [Başlık bağlantıları](https://developers.google.com/search/docs/appearance/title-link), [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), [profil sayfası işaretlemesi](https://developers.google.com/search/docs/appearance/structured-data/profile-page).

## Canlı sitede gözlenen başlangıç durumu

9 Kasım 2026 tarihindeki salt okunur kontrolde:

- `https://www.profdrsemihotles.com.tr/`: **200**, mevcut canonical doğru `www` adresidir.
- `https://profdrsemihotles.com.tr/`: **301** ile asıl adrese yönlenir.
- `http://www.profdrsemihotles.com.tr/`: **301** ile asıl HTTPS adresine yönlenir.
- `/robots.txt` ve `/sitemap.xml`: **200**; sitemap doğru `www` adresini içerir.
- Mevcut ana başlık kişinin adını içermez; `Person` / `ProfilePage` JSON-LD ve sosyal paylaşım metadata'sı yoktur. Eğitim/araştırma/görev alanları ilk HTML'de boş yer tutuculardır.

Bu gözlemler hazırlanan dalın yayına çıktığı anlamına gelmez. Search Console hesabı ve arama performansı incelenmemiştir.

## Yayından sonra

1. Onaylanan değişiklikler `main` üzerine alındıktan sonra Render build/deploy sonucunu kontrol edin. `SITE_URL` değerinin `https://www.profdrsemihotles.com.tr` olduğundan emin olun.
2. Ana sayfanın kaynak HTML'inde başlık, tek canonical, JSON-LD ve görevlerin bulunduğunu; sitemap, robots ve portre URL'lerinin 200 döndürdüğünü doğrulayın. HTTPS ve diğer domain yönlendirmeleri yukarıdaki yönde kalmalıdır.
3. [Google Search Console](https://search.google.com/search-console) içinde domain mülkünü `profdrsemihotles.com.tr` adıyla ekleyin. Google'ın verdiği TXT kaydını DNS'e ekleyip sahipliği doğrulayın. Mevcut doğrulanmış mülk varsa onu kullanın. Doğrulama kodu paylaşılmadan koda veya DNS'e rastgele kayıt eklenmez.
4. Sitemaps bölümünde `https://www.profdrsemihotles.com.tr/sitemap.xml` adresini gönderin. URL Denetimi'nde asıl adresi canlı test edip indeksleme isteyin. Rich Results Test ile yayındaki profil şemasını kontrol edin; bunlar yerel kod testlerinden ayrı kontrollerdir.
5. Kişinin kontrolündeki üniversite profili, Google Scholar ve mesleki profil alanlarından bu siteye bağlantı ekleyin. Mevcut dış profiller bu çalışma sırasında değiştirilmemiştir. Bağlantıların ad ve unvanı tutarlı olmalıdır.
6. Search Console Performans raporunda yukarıdaki isim/unvan sorgularının gösterim, tıklama, tıklama oranı ve ortalama konum değerlerini takip edin. Önce yeterli veri oluşmasını bekleyin; arama sonuçlarının değişmesi yeniden tarama ve indekslemeye bağlıdır. [Google Search Console kullanım rehberi](https://developers.google.com/search/docs/monitor-debug/search-console-start).

## Yerel doğrulama

```powershell
node --test tests/*.test.cjs
node scripts/build-static.cjs
```

Testler domain/metadata tutarlılığını, JSON-LD ilişkilerini, tüm akademik kayıtların ilk HTML'e ulaşmasını, veri kaçışını ve yayın paketinin sınırlarını kontrol eder. Yayın istatistiklerinin kaynak verileri değiştirilmemiştir.

9 Kasım 2026 yerel kontrolde 8 otomatik test geçti. Chromium ile 320, 390, 768 ve 1280 px genişliklerde, JavaScript açık ve kapalı olmak üzere 8 görünüm kontrol edildi; sayfa genelinde yatay taşma veya tarayıcı kaynak/betik hatası görülmedi. JavaScript açıkken görev araması, kategori seçimi, sayfalama, fotoğraf görüntüleyicisi ve mobil menü de kontrol edildi. Google Rich Results Test ve Search Console kontrolleri yayın sonrasına bırakılmıştır.
