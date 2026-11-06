# Site incelemesi ve veri denetimi

Güncel durum: ProfList_son.xlsx / Sheet1 artık esas kaynaktır. Yeni dosyada yıllık ve sütun toplamları doğrulanmıştır: 1001 toplam, 218 araştırma, 670 derleme, 113 KTR. Aşağıdaki bulgular önceki ProfList.xls incelemesinin tarihsel notlarıdır; güncel veri için geçerli değildir. Aktarım komutu: `python scripts/import_stats.py PATH_TO_SOURCE.xlsx`; ek kütüphane gerektirmez.

Kaynak: Kullanıcının belirttiği ProfList.xlsx bulunamadı. Downloads klasöründeki ProfList.xls / Sheet1 incelendi. Orijinal belge değiştirilmedi. İstatistikler tekil yayın kayıtlarını içermediğinden yayın düzeyinde mükerrerlik bu belgeyle kanıtlanamaz.

## Düzeltilen eşlemeler

- Eski 444 araştırma etiketi hatalıydı: S49, yurt içi dergi / Türkçe derleme sütunudur.
- Eski 94 derleme etiketi toplam değildir: Y49, yurt içi konferans / Türkçe derleme sütunudur.
- B49=69 ve C49=44, KTR yurt dışı İngilizce ve yurt içi Türkçe değerleridir. E49=70 araştırma / yurt dışı dergi / İngilizce değeridir. Bunlar kitap, tez, rapor olarak ayrılamaz.
- 1986 kaynak toplamı 4 iken eski sitede 6 idi.
- Eski dil sütunları gerçek dil dağılımıyla uyuşmuyordu. Yeni arayüz kategori toplamlarını doğrudan kaynak hücrelerinden türetir.

## Kaynak içindeki tutarsızlıklar

- B42:AA42 toplamı 54; AE42 (2021) 53. Hangi kalemin yanlış olduğu belgeyle belirlenemez.
- 2026 B47:AA47 toplamı 9; AE47 boş. Eski site 6 gösteriyordu.
- 2027 satırı boş; sıfır yayın olarak gösterilmez.
- AE49=991, dolu yıllık toplamların toplamıyla eşleşir. Tüm kalemler 1001 eder. Fark 2021'deki 1 ve 2026'daki 9'dur.
- J42=1 ve V39=1, V45=1 mevcutken J49 ve V49 boş. Bu nedenle özet satırını kategori hesaplarında kullanmak kayıt kaybettirir.
- AB:AD dil toplamları 2002'den itibaren boş; 95/59/5 tüm kariyerin dil dağılımı değildir. 2001 dil toplamı 15, yıllık toplamı 17'dir.

Hesaplanan kategoriler: KTR 113; araştırma dergi 124; araştırma konferans 94; derleme dergi 512; derleme konferans 158. Araştırma 218, derleme 670. Kaynak toplamı ve hesaplanan toplam ayrı etiketlenmiştir; belgedeki şüpheli sayılar tahminen düzeltilmemiştir.

## Sonraki öncelikler

1. Ana sayfadaki 285 yayın, 1566 atıf, h=18 ve 37 proje değerlerine kaynak ve ölçüm tarihi eklenmeli. ProfList bunları doğrulamaz.
2. app.js kitap adlarından yıl, baskı ve sayıları silerek tekilleştiriyor. Farklı baskıları yanlış birleştirebilir. DOI/ISBN ve baskı bilgisiyle kimlik oluşturulmalı; belirsiz eşleşmeler manuel incelenmeli.
3. 28 kitap ve 77 bölüm sayıları sabit; liste slice ile kesiliyor. Kaynak katalog doğrulandıktan sonra sayaçlar gerçek kayıt sayısından hesaplanmalı.
4. Mobil kitap kartları 78x118 piksele sabitlenmiş; uzun başlıklar taşabilir. Kart yüksekliği içeriğe göre belirlenmeli, kapaklar contain ile gösterilmeli.
5. Yayın arşivine başlık/yıl/tür araması, DOI bağlantıları ve sonuç sayısı eklenmeli.
6. Modal açılışında odak taşınmalı, odak içeride tutulmalı ve kapanışta tetikleyiciye dönmeli.
7. Uzun, büyük harfli başlıklar sadeleştirilmeli; mobil navigasyon ve sabit başlığın anchor hedeflerini örtmesi kontrol edilmeli.

## Veri güncelleme

`python scripts/import_stats.py PATH_TO_SOURCE.xls` (xlrd gerekir). Ham hücreler null/number olarak saklanır; boşlar korunur. Kaynağın SHA256 özeti ve satır numaraları veri dosyasındadır. Tekrarlanan yıl aktarımı durdurur. Grafik, tablo ve kartlar aynı veri kaynağından üretilir. Özet belgeye kayıt düzeyinde tekilleştirme uygulanmaz.

## Doğrulama sınırı

JavaScript sözdizimi ve kaynak aritmetiği kontrol edildi. Uygulama içi tarayıcı localhost önizlemesinde bağlantı zaman aşımı verdi; masaüstü/mobil ekran görüntüsü doğrulaması tamamlanamadı. Değişiklikler yereldir.
