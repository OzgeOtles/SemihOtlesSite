import json
import os
import re

root = r"c:\Users\ÖZGE\Desktop\İndexyedek2025ekim\books"
books_dir = os.path.join(root, "books")

files = []
for name in sorted(os.listdir(books_dir)):
    fp = os.path.join(books_dir, name)
    if os.path.isfile(fp) and name.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) and not name.endswith(".tmp"):
        files.append(name)


def clean_title(filename):
    stem = os.path.splitext(filename)[0]
    stem = stem.replace("_", " ").replace("-", " ")
    stem = re.sub(r"(?<=[a-zA-Z])(?=[A-Z][a-z])", " ", stem)
    stem = re.sub(r"(?<=[a-zA-Z])(?=\d)", " ", stem)
    stem = re.sub(r"(?<=\d)(?=[A-Za-z])", " ", stem)
    stem = re.sub(r"\s+", " ", stem).strip()
    stem = re.sub(r"(?i)\b(?:k|b)\b$", "", stem).strip()
    stem = re.sub(r"(?i)\bmockup\d*\b", "", stem).strip()
    stem = re.sub(r"\b\d{2,4}x\d{2,4}\b", "", stem).strip()
    stem = re.sub(r"\s+\d{4}\s*$", "", stem).strip()
    return stem.title() if stem else os.path.splitext(filename)[0].title()


def detect_year(filename):
    match = re.search(r"(19\d{2}|20\d{2})", filename)
    return match.group(1) if match else "2024"


def detect_category(filename):
    name = filename.lower()
    if any(token in name for token in ["analiz", "analysis", "instrument", "spectroscopy", "chromat", "mass spect", "fingerprint", "proteomics"]):
        return "Gıda Analizi"
    if any(token in name for token in ["zeytin", "olive", "yağı", "oil", "lipid", "flavor", "beverage", "drink"]):
        return "Zeytinyağı ve Bitkisel Yağlar"
    if any(token in name for token in ["bal", "bee", "arı", "honey"]):
        return "Arıcılık Ürünleri"
    if any(token in name for token in ["beslenme", "nutrition", "diet", "health", "saglik"]):
        return "Beslenme ve Sağlık"
    if any(token in name for token in ["kimya", "chem", "food", "gida"]):
        return "Gıda Kimyası"
    if any(token in name for token in ["nanotech", "microbial", "probiotic", "phyt", "ferment", "biotech", "bioactive"]):
        return "Bilim ve Teknoloji"
    return "Gıda Bilimi"


chapters_by_category = {
    "Gıda Analizi": ["Temel kavramlar", "Örnek hazırlama", "Analitik yöntemler", "Kalıbrasyon ve kontrol", "Sonuçların değerlendirilmesi"],
    "Zeytinyağı ve Bitkisel Yağlar": ["Üretim ve kalite", "Kimyasal bileşenler", "Özellikler ve fonksiyonlar", "Sağlık etkileri", "Pazarlama ve kullanım"],
    "Arıcılık Ürünleri": ["Arı ürünleri", "Kimyasal bileşim", "Üretim süreçleri", "Kalite ve güvenlik", "Sağlık faydaları"],
    "Beslenme ve Sağlık": ["Beslenme ilkeleri", "Gıda ve sağlık ilişkisi", "Makro ve mikro besinler", "Diyet modelleri", "Öneriler ve uygulamalar"],
    "Gıda Kimyası": ["Temel bileşenler", "Kimyasal dönüşümler", "Gıda işleme", "Stabilite ve kalite", "Güvenlik ve standartlar"],
    "Bilim ve Teknoloji": ["Temel yaklaşım", "Yöntemler ve araçlar", "Teknolojik uygulamalar", "Güvenlik ve etki", "Gelecek yönelimleri"],
    "Gıda Bilimi": ["Giriş", "Besin bileşenleri", "Üretim teknolojisi", "Kalite kontrol", "Değerlendirme ve sonuç"],
}

books = []
for fn in files:
    title = clean_title(fn)
    category = detect_category(fn)
    chapters = chapters_by_category.get(category, chapters_by_category["Gıda Bilimi"])
    books.append({
        "title": title,
        "category": category,
        "year": detect_year(fn),
        "image": "books/" + fn,
        "description": "Bu eser, bilimsel yaklaşım, gıda kalite ölçümü ve beslenme bilimi çerçevesinde araştırma ve uygulama temelli içerik sunar.",
        "chapters": chapters,
    })

js = (
    "const books = "
    + json.dumps(books, ensure_ascii=False, indent=2)
    + ";\n\n"
    + "const bookGrid = document.getElementById(\"bookGrid\");\n"
    + "const chapterList = document.getElementById(\"chapterList\");\n\n"
    + "function renderBooks() {\n"
    + "  bookGrid.innerHTML = books.map(book => `\n"
    + "    <article class=\"book-card\">\n"
    + "      <img class=\"book-cover\" src=\"${book.image}\" alt=\"${book.title}\" />\n"
    + "      <div class=\"book-body\">\n"
    + "        <div class=\"meta-row\">\n"
    + "          <span class=\"tag\">${book.category}</span>\n"
    + "          <span class=\"year\">${book.year}</span>\n"
    + "        </div>\n"
    + "        <h3>${book.title}</h3>\n"
    + "        <p>${book.description}</p>\n"
    + "        <ul class=\"chapter-list\">\n"
    + "          ${book.chapters.slice(0, 4).map(chapter => `<li>${chapter}</li>`).join(\"\")}\n"
    + "        </ul>\n"
    + "      </div>\n"
    + "    </article>\n"
    + "  `).join(\"\");\n"
    + "}\n\n"
    + "function renderChapters() {\n"
    + "  chapterList.innerHTML = books.map(book => `\n"
    + "    <div class=\"chapter-panel\">\n"
    + "      <h3>${book.title}</h3>\n"
    + "      <ul>\n"
    + "        ${book.chapters.map(chapter => `<li>${chapter}</li>`).join(\"\")}\n"
    + "      </ul>\n"
    + "    </div>\n"
    + "  `).join(\"\");\n"
    + "}\n\n"
    + "renderBooks();\n"
    + "renderChapters();\n"
)

with open(os.path.join(root, "app.js"), "w", encoding="utf-8") as f:
    f.write(js)

print(f"Generated {len(files)} books.")
