# Akademik profil aktarım notları

## Kapsam ve kaynaklar

Bu feature yalnızca kullanıcının verdiği `Özgeçmiş.doc` ve `Resume.doc` içeriklerine dayanır. Kaynak dosyalar değiştirilmemiş ve siteye yüklenmemiştir. Eski Word dosyaları yerelde word-extractor ile okunmuştur; geçici metinler Git dışında `.local-tools` altında tutulur.

`academic-profile-data.js` ziyaretçiye sunulan bilgilerin tek kaynağıdır. Her görevde `sources` alanı, Resume.doc / Work experience başlığındaki kaynak sırasını `W001`–`W136` olarak izler. Kaynak başlıkları, üyelik, ödül, burs ve proje kapsamları aşağıda kayıtlıdır. Veri kontrol notları ziyaretçi arayüzünde gösterilmez.

Kaynak dosyaların SHA256 özetleri:

- Özgeçmiş.doc: `83E8A037A90AB18CCD5F95A3C88D62414CD2117A98AE0780102A8217E77FD71A`
- Resume.doc: `AA11DD182D1278E18BF538E5596288F9115344383D74533076331FAE8C11B183`

## Eksiksizlik ve tekilleştirme

- Resume.doc / Work experience: 136 kaynak satırı, 132 görev kaydı ve eğitim çizelgesinde 1 doktora sonrası araştırma kaydıyla kapsanır.
- W004 (1991–1992 doktora sonrası araştırma), Education bölümünde de bulunduğu için eğitim çizelgesinde tek kez gösterilir.
- W038 + W071: Turkish Journal of Fisheries and Aquatic Sciences hakemliği. 2004 ve 2008 tarihleri korunarak tek kayıtta birleştirildi.
- W054 + W123: Journal of Food Processing and Preservation hakemliği. 2006 ve 2015 tarihleri korunarak tek kayıtta birleştirildi.
- W070 + W082: Turkish Journal of Agriculture and Forestry hakemliği. 2008 ve 2010 tarihleri korunarak tek kayıtta birleştirildi.
- Aynı kurumda farklı görevler veya ayrı kapalı dönemler korunur. Örneğin PLM müdürlüğü (2015–2020) ve yürütme kurulu üyeliği (2020); Gıda Kimyası başkanlığının 2008–2011 ve 2013–2021 dönemleri ayrı kayıtlardır.
- Varsayılan görünümde 3 yönetim görevi öne çıkarılır; diğer görevler listesinde 129 kayıt vardır. Arama veya kategori filtresinde öne çıkan alan gizlenir ve 132 görevin tamamı aramaya dahil edilir. Böylece bir kayıt aynı görünümde iki kez yer almaz.
- Türkçe belgedeki görevler, İngilizce belgedeki ilgili görevlerle örtüşür; ikinci bir kopya oluşturulmadı. Özellikle APOCP, dergi hakemlikleri, Drink-Tech, Food-Info, TÜBİTAK-TOVAG, ANCS, Gıda Bilimleri Anabilim Dalı başkanlığı, SNSF/Innosuisse ve 2020 hakemliği kapsanır.
- Memberships: Kaynaktaki 15 adın tamamı korundu. Açılımı verilmeyen kısaltmalar tahminen genişletilmedi. GMD ve GMO farklı kaynak etiketleri olarak korundu.
- Awards: 2004 ve 2006 FP6 Proje Önerisi Ödülleri; 2008 Hizmet Ödülü; 2018 En İyi Sunum Ödülü; 2019 En İyi Makale Ödülü. Toplam 5 ödül, iki belgede tekrarlanan ödüller ikinci kez sayılmaz.
- Travel and Workshop Scholarships: 8 kurumun tamamı korundu. Research Fellowship: 4 kurumun tamamı korundu. Aynı kurumun farklı destek türlerinde yer alması tekrar değildir. Belgede olmayan tarihler eklenmedi.
- EC and Other Projects / AB ve Diğer Önemli Projeler: 14 kayıt, ad/kod üzerinden tekilleştirildi. Her proje sayfalamayla erişilebilir. Proje ortaklığı veya değerlendirme görevi ile proje kaydı farklı bağlamlardır; proje rolü tahminen atanmamıştır.
- Education: Lisans, yüksek lisans, doktora, doktora sonrası araştırma, doçentlik ve profesörlük dahil 6 kayıt.
- Research Interests: 8 alanın tamamı. Languages: İngilizce, Almanca, Felemenkçe ve Japonca; yeterlilik düzeyi eklenmedi. Hobbies: bilgisayar, yürüyüş, müzik.

## Belirsizlikler ve kararlar

1. MoniQA tarihleri Türkçe belgede 2008–2011, İngilizce belgede 2007–2012. Proje ve `FOOD-CT-2006-036337` kodu korunur; tarih seçilmez. Kullanıcıdan doğrulama beklenir.
2. ISEKI-MUNDUS İngilizce proje listesinde tarihsiz; Türkçe listede 2004–2007. Türkçe belgedeki dönem kullanıldı. Work experience bölümündeki 2007 ortaklık başlangıcı farklı bir bilgi olarak korundu. Proje kodundaki yıl başlangıç tarihi olarak yorumlanmadı.
3. IFood4'ün 2011–2014 dönemi İngilizce belgeden alınmıştır; Türkçe belgede yalnızca proje kodu vardır.
4. W004'te Melle Research Centre, Education kısmında Meat Research Center yazılır. Her ikisinde ortak olan Ghent Üniversitesi / Belçika ve 1991–1992 bilgisi gösterilir; merkez adı hakkında tercih yapılmaz.
5. Tek yılı ve açık uçlu dönemleri olan görevlerde yalnızca belgede yazan başlangıç yılı gösterilir. Bunlardan “halen devam ediyor” sonucu çıkarılmaz; bitiş yılı üretilmez.
6. W119 kurumunun resmi Türkçe adı belgede bulunmadığından İngilizce adı korunur. W124'teki TÜBİTAK-TEYDEP yazımı da kaynakta olduğu gibi korunur; proje listesindeki TEYDEB kaydıyla tahminen birleştirilmez.
7. Eski ana sayfada bulunan 285 yayın, 1566 atıf, h=18, 37 proje değerleri bu iki belgede desteklenmez. Bunların yerine doğrulanmış doktora/profesörlük yılları ve 15 üyelik / 5 ödül gösterilir. Yayın istatistiğinin Excel kaynağı değiştirilmez.
8. Doğum tarihi, medeni durum, aile bilgisi, özel telefon/faks ve adres bilgileri yayımlanmaz. Eski kişisel web adresleri güncel bağlantı olarak varsayılmaz.

## Doğrulama

`node tests/academic-profile.test.cjs` kaynak görev satırlarının W001–W136 aralığında tam bir kez temsil edildiğini, üyelik/ödül/burs/proje sayılarını, benzersiz kimlikleri ve MoniQA için tarih uydurulmadığını kontrol eder. Özgün Word dosyalarından çıkarılan 136 görev bloğunun her biri veri kaydıyla karşılaştırılmıştır.

Yerel tarayıcı kontrolü: 320, 390, 768 ve 1280 px genişliklerinde sayfa geneline taşma görülmedi. Görev araması (Türkçe karakter olmadan TÜBİTAK dahil), öne çıkan görevlerin aramada bulunması, kategoriler, boş arama sonucu, görevlerin son sayfası ve projelerin son sayfası test edildi. 5 ödül ve 12 burs kurumu DOM'da doğrulandı; masaüstü ve mobil yerleşimleri görsel olarak incelendi. Tarayıcı hata kaydı bulunmadı.

Yeni feature branch'i: `fke/academic-profile-and-recognition`. Commit işlemi kullanıcı onayıyla yapılır. Olası ayrım: kaynak verisi ve eğitim/profil düzeltmeleri; kariyer, üyelik, ödül ve proje sunumu.
