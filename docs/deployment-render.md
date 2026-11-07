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

Alan adı henüz satın alınmış veya müsaitliği doğrulanmış değildir. Örnek isimler rezervasyon anlamına gelmez.

1. Son alan adını satın alın. `semihotles.com` daha kısa; `profdrsemihotles.com` ve `profdrsemihotles.com.tr` de kullanılabilir. Seçimi müsaitlik ve yenileme bedeline göre yapın.
2. Satın alınan kök alan adını `render.yaml` içindeki yorumlu `domains` listesine yazın ve izlenen branch'e push edin. Render, kök alan adı eklenince `www` adresini de ekleyip kök adrese yönlendirir. Alan adını Blueprint'e yazmak tescil veya DNS ayarı yapmaz.
3. Alan adı sağlayıcısında Render panelinin gösterdiği DNS kayıtlarını uygulayın. Genel kayıt düzeni:

   | Tür | Ad | Hedef |
   | --- | --- | --- |
   | A | `@` | Render'ın güncel panelinde verilen IPv4 adresi (belgelerde `216.24.57.1`) |
   | CNAME | `www` | Servisin paneldeki gerçek `*.onrender.com` adresi |

   Sağlayıcı `ALIAS` / `ANAME` destekliyorsa kök alan adı için Render'ın ilgili sağlayıcı yönergesini izleyebilirsiniz. Siteye ait çakışan A/AAAA kayıtlarını düzeltin; mevcut e-posta MX/TXT kayıtlarını koruyun.
4. Render **Settings → Custom Domains → Verify** üzerinden doğrulayın. HTTPS sertifikası Render tarafından otomatik sağlanır ve yenilenir.
5. Render servisinin Environment bölümünde `SITE_URL` değerini son kök adres olarak ayarlayın: örneğin `https://profdrsemihotles.com.tr`. Ardından yeniden build/deploy başlatın. Değer yalnızca HTTPS origin olmalı; alt sayfa, query veya fragment içermemelidir.
6. Build, bu değerle `index.html` içine canonical adresi ekler; `sitemap.xml` ve buna işaret eden `robots.txt` üretir. Alan adı değişirse `SITE_URL` değerini değiştirip yeniden deploy edin. Değer verilmezse yanlış bir domain yazılmaz; sitemap ve canonical üretilmez.
7. HTTPS ve DNS çalıştıktan sonra Google Search Console'da domaini doğrulayıp `/sitemap.xml` adresini gönderin. İki domain alırsanız aynı içeriği ayrı siteler olarak yayınlamak yerine ikincisini seçilen asıl domaine kalıcı yönlendirin.

## Yayın paketi ve içerik güncelleme

`dist/` her build'de yeniden oluşturulur ve Git'e eklenmez. Yalnızca kullanılan HTML/CSS/JS dosyaları, yayın arşivi ve `assets/`, `books/`, `images/` klasörlerindeki görseller kopyalanır. `.git`, `.local-tools`, testler, inceleme belgeleri, Python araçları, geçici resim kopyaları ve eski HTML sürümleri yayın paketine girmez. Public GitHub deposuna commit edilmiş dosyalar ise GitHub'da zaten erişilebilirdir.

- Yeni görselleri bu üç görsel klasöründen birine koyup sayfada kullanabilirsiniz. JPG, JPEG, PNG, SVG, WebP, AVIF, GIF ve ICO desteklenir. Büyük fotoğrafları web için boyutlandırın; fotoğraflarda WebP/AVIF tercih edilebilir. Yeni bir görsel klasörü eklenirse build listesi de güncellenmelidir.
- Dosya adlarının büyük/küçük harfleri referanslarla tam eşleşmelidir; Render Linux üzerinde çalışır. Mevcut kitap ve bölüm kapakları için bu kontrol testte yapılır.
- Yeni bir kök JS/CSS dosyası eklenirse `scripts/build-static.cjs` içindeki yayın listesine ekleyin. HTML'in işaret ettiği yerel dosya listede yoksa build hata verir.
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
$env:SITE_URL = 'https://profdrsemihotles.com.tr'
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
