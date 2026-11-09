# Render üzerinde yayınlama

Bu proje HTML, CSS, JavaScript, görseller ve kaynak belgelerden doğrulanmış veri dosyalarından oluşur. Render **Static Site** olarak yayınlanır. Python sunucusu, çalışan bir Node.js servisi ve veritabanı gerekmez. Node.js yalnızca yayın dosyalarını hazırlamak için kullanılır; ek paket kurulumu yoktur.

## Hazır ayarlar

| Ayar | Değer |
| --- | --- |
| Blueprint dosyası | `render.yaml` |
| Servis | `semih-otles` |
| Tür | Static Site (`type: web`, `runtime: static`) |
| Build komutu | `node scripts/build-static.cjs` |
| Publish directory | `./dist` |
| Yayın branch'i | `main` |
| Otomatik deploy | `main` güncellendiğinde |
| Build Node sürümü | 24.x |
| Asıl adres / SITE_URL | `https://www.profdrsemihotles.com.tr` |
| Veritabanı / ortam sırrı | Gerekmiyor |

`plan`, `startCommand` ve `region` eklenmez: bunlar bu Static Site için kullanılmaz. Dosyalar Render'ın global CDN'i üzerinden sunulur. Static Site barındırması ücretsizdir; trafik ve build kullanımı workspace kotasına dahildir. Kota ve ücretlendirme koşulları için Render panelini kontrol edin.

## İlk yayın

1. Hazırlanan değişiklikler kullanıcı onayıyla commit edilip GitHub'a push edilmelidir. Önce mevcut özellik PR'ları, ardından bu dağıtım ayarlarını içeren PR `main` üzerine birleştirilmelidir. `main`, hem `render.yaml` hem `scripts/build-static.cjs` dosyasını ve güncel site içeriğini içermelidir.
2. Render'a GitHub hesabıyla giriş yapın. `OzgeOtles/SemihOtlesSite` deposunu seçebilmek için Render GitHub uygulamasına bu depo için erişim verin. Public depo olması, uygulamanın hesaptaki yetkilerinin yerini tutmaz.
3. **New → Blueprint** yolunda depoyu ve **`main`** branch'ini seçin. Oluşacak kaynağın **Static Site** olduğunu kontrol ederek kurulumu başlatın. `render.yaml` henüz `main` üzerinde yoksa kurulumu PR'lar birleştirilene kadar bekletin.
4. Blueprint'te `branch: main` açıkça tanımlıdır. Hem Blueprint'in kaynak branch'i hem servisin yayın branch'i `main` olmalıdır. Özellik branch'lerine push yapılması canlı siteyi değiştirmez; `main` güncellendiğinde yeni build/deploy başlar.
5. Build başarılı olduğunda panelde verilen gerçek `*.onrender.com` adresini açın. Servis adından URL tahmin etmeyin.
6. Sonraki özellikleri güncel `main` üzerinden yeni `fke/` branch'lerinde geliştirin ve PR ile `main` üzerine birleştirin. Böylece yalnızca onaylanıp birleştirilen değişiklikler yayına çıkar.

### Mevcut bağımlı PR zinciri

Mevcut özellikler birbirinin üzerine geliştirildiği için branch'ler önceki özelliklerin commit'lerini de içerir. PR'ların tamamı `main` hedefleyecek şekilde düzenlenmiştir. #1 → #2 → #3 → #4 → #5 → #6 sırasıyla birleştirin; dağıtım PR'ını en sona bırakın. Önceki PR birleştirilene kadar sonraki PR'ların diff'inde önceki özellikler de görünür. Her birleştirmeden sonra sıradaki PR'ın diff'ini kontrol edin. Önceki PR'ın birleştirilmesi, sonraki PR'ın değişikliklerini kendiliğinden `main`'e taşımaz.

Bu mevcut zincirde **Create a merge commit** kullanmak ortak commit geçmişini korur. Squash/rebase yöntemi kullanılmışsa sonraki PR'ların base ve diff'lerini ayrıca düzenlemek gerekebilir; eski commit'lerin yeniden görünmesini veri duplikasyonu olarak yorumlamayın. PR hedefini değiştirmek kodu birleştirmez veya canlı yayını tetiklemez.

## Alan adı ve DNS

Kullanıcının belirttiği asıl adres **https://www.profdrsemihotles.com.tr/** olarak yapılandırılmıştır. DNS ve Render domain doğrulaması ayrıca kontrol edilmelidir; kaynak kodundaki adres, bu işlemlerin tamamlandığını göstermez.

1. Render **Settings → Custom Domains** bölümünde `www.profdrsemihotles.com.tr` adresini doğrulayın ve asıl adres olarak seçin. Sağlayıcıda Render panelinin gösterdiği DNS kayıtlarını kullanın; mevcut e-posta MX/TXT kayıtlarını koruyun.
2. `https://profdrsemihotles.com.tr/` ve HTTP sürümleri asıl HTTPS `www` adresine tek yönde kalıcı yönlenmelidir. Render'daki asıl domain ve canonical yönü eşleşmelidir. Aksi yönde mevcut bir yönlendirme varsa yayın öncesinde düzeltin.
3. `render.yaml`, `SITE_URL=https://www.profdrsemihotles.com.tr` değerini içerir. Mevcut servisin Environment bölümünde bu değeri kontrol edin. Build betiğinin varsayılan adresi de aynıdır. Ortam değişkeni yalnızca HTTPS origin olabilir; alt sayfa, query veya fragment içeremez.
4. `node scripts/build-static.cjs`, canonical, Open Graph, Twitter ve `WebSite` / `ProfilePage` / `Person` JSON-LD verilerini aynı adresten üretir. `sitemap.xml` yalnızca gerçek ana sayfayı içerir; `#kariyer` gibi sayfa içi bağlantılar ayrı sayfa değildir. `robots.txt`, sitemap'e işaret eder.
5. HTTPS ve DNS çalıştıktan sonra Google Search Console'da alan adını doğrulayın, `/sitemap.xml` gönderin ve ana sayfa için URL Denetimi yapın. Ayrıntılar: [SEO uygulaması ve yayın sonrası adımlar](seo.md).
6. Alan adı değişirse Render `SITE_URL` değerini, build varsayılanını ve ilgili belgeleri birlikte güncelleyin. `siteUrl: ''` ile yalnızca yerel testlerde mutlak URL metadata'sı kapatılabilir.

## Yayın paketi ve içerik güncelleme

`dist/` her build'de yeniden oluşturulur ve Git'e eklenmez. Yalnızca kullanılan HTML/CSS/JS dosyaları, yayın arşivi ve `assets/`, `books/`, `images/` klasörlerindeki görseller kopyalanır. `.git`, `.local-tools`, testler, inceleme belgeleri, Python araçları, geçici resim kopyaları ve eski HTML sürümleri yayın paketine girmez. Public GitHub deposuna commit edilmiş dosyalar ise GitHub'da zaten erişilebilirdir.

- Yeni görselleri bu üç görsel klasöründen birine koyup sayfada kullanabilirsiniz. JPG, JPEG, PNG, SVG, WebP, AVIF, GIF ve ICO desteklenir. Büyük fotoğrafları web için boyutlandırın; fotoğraflarda WebP/AVIF tercih edilebilir. Yeni bir görsel klasörü eklenirse build listesi de güncellenmelidir.
- Dosya adlarının büyük/küçük harfleri referanslarla tam eşleşmelidir; Render Linux üzerinde çalışır. Mevcut kitap ve bölüm kapakları için bu kontrol testte yapılır.
- Yeni bir kök JS/CSS dosyası eklenirse `scripts/build-static.cjs` içindeki yayın listesine ekleyin. HTML'in işaret ettiği yerel dosya listede yoksa build hata verir.
- Eğitim, araştırma alanları, görevler, üyelikler, ödüller ve projeler build sırasında ilk HTML yanıtına yazılır. Tarayıcı betiği bu içeriğe arama, filtreleme ve sayfalama ekler. Görünümün ortak kaynağı `academic-profile-renderer.js` dosyasıdır.
- Akademik veriler mevcut doğrulanmış JS dosyalarında kalır. Kaynak Excel/Word güncellenince veri kontrol edilip dosyalar değiştirilir; Git geçmişi önceki sürüme dönüş sağlar.
- Yayın listesi `js/yayinlar` dosyasından okunur. Uzantısız dosyanın UTF-8 metin olarak sunulması Blueprint'te ayarlanmıştır.
- Sayfa içi bölüm bağlantıları hash (`#...`) kullanır. Her bilinmeyen adresi ana sayfaya yönlendiren SPA rewrite kuralı gerekmez; hatalı dosya adresleri gerçek 404 döndürmelidir.
- Cache ayarı, aynı dosya adıyla yapılan veri ve görsel güncellemelerinin yeniden doğrulanmasını sağlar.

Veritabanı ancak ziyaretçi hesabı, panelden içerik düzenleme, kayıt/form geçmişi gibi sunucuda saklanan veriler gerektiğinde değerlendirilir. Panelden görsel yükleme eklenirse görseller için dosya depolama, başlık/kategori gibi bilgiler için gerekirse veritabanı kullanılır. Mevcut sayfa ve projeye eklenen görseller bunları gerektirmez.

## Yerel kontrol

```powershell
node --test tests/*.test.cjs
node scripts/build-static.cjs
python -m http.server 8001 --directory dist
```

Son komut çalışırken `http://localhost:8001/` üzerinden gerçek yayın paketini kontrol edin. Mevcut `http://localhost:8000/` geliştirme sunucusu kullanılmaya devam edilebilir. Özel domainli build kontrolü için:

```powershell
$env:SITE_URL = 'https://www.profdrsemihotles.com.tr'
node scripts/build-static.cjs
Remove-Item Env:SITE_URL
```

İlk canlı yayında portre/ikon, kitap kapakları, bölüm kapakları, yayın arşivi, istatistikler ve mobil görünüm kontrol edilmelidir. Render panelinde dosyayı düzenlemeyin; değişiklikleri depodan deploy edin.

## Kaynaklar

- [Render Static Sites](https://render.com/docs/static-sites)
- [Render Blueprint YAML](https://render.com/docs/blueprint-spec)
- [Render ücretsiz kullanım koşulları](https://render.com/docs/free)
- [Render özel alan adları ve HTTPS](https://render.com/docs/custom-domains)
- [Render DNS yönergesi](https://render.com/docs/configure-other-dns)
- [Google: ülke ve dil hedefleme](https://developers.google.com/search/docs/specialty/international/managing-multi-regional-sites)
