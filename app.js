const bookShelfList = document.getElementById("bookShelfList");
const chapterList = document.getElementById("chapterList");
const shelfRoot = document.getElementById("bookshelf_slider_widget");
const booksSection = document.getElementById("kitaplar");
const chaptersSection = document.getElementById("bolumler");
const bookCountEl = document.getElementById("bookCount");
const chapterCountEl = document.getElementById("chapterCount");
const books = Array.isArray(window.booksData) ? window.booksData : [];

const normalizeBookTitle = (title = "") => String(title || "")
  .toLowerCase()
  .replace(/[_-]+/g, " ")
  .replace(/\b(?:mockup|edition|volume|vol|b|k|bk|cover|kitap)\b/gi, " ")
  .replace(/\b(?:second|2nd)\b\s*edition\b/gi, " ")
  .replace(/\b\d{4}\b/g, " ")
  .replace(/\b\d+\s*[xX×]\s*\d+\b/g, " ")
  .replace(/\b\d+\b/g, " ")
  .replace(/\([^)]*\)/g, " ")
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const keepBestTitle = (title) => {
  const cleaned = String(title || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b(?:mockup|edition|volume|vol|b|k|bk|cover|kitap)\b/gi, " ")
    .replace(/\b(?:second|2nd)\b\s*edition\b/gi, " ")
    .replace(/\b\d{4}\b/g, " ")
    .replace(/\b\d+\s*[xX×]\s*\d+\b/g, " ")
    .replace(/\b\d+\b/g, " ")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+$/g, "")
    .trim();

  return cleaned.replace(/\s+[–-]\s+.*$/g, "").trim();
};

const dedupedBooks = Array.from(
  books.reduce((acc, book) => {
    const rawTitle = keepBestTitle(book.title) || book.title;
    const key = normalizeBookTitle(rawTitle);
    if (!key) return acc;

    const candidate = { ...book, title: rawTitle };
    const existing = acc.get(key);
    if (!existing) {
      acc.set(key, candidate);
      return acc;
    }

    const existingTitle = keepBestTitle(existing.title) || existing.title;
    const candidateTitle = keepBestTitle(candidate.title) || candidate.title;
    const currentIsCleaner = candidateTitle.length < existingTitle.length;

    if (currentIsCleaner || (candidateTitle.length === existingTitle.length && candidate.image.length < existing.image.length)) {
      acc.set(key, candidate);
    }

    return acc;
  }, new Map()).values()
);

const TARGET_BOOK_COUNT = 28;
const TARGET_CHAPTER_COUNT = 77;
const visibleBooks = dedupedBooks.slice(0, TARGET_BOOK_COUNT);

const normalizeAssetName = (value = "") => String(value)
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "")
  .trim();

const resolveChapterImage = (imageValue = "") => {
  const raw = String(imageValue || "").trim();
  if (!raw) return "books/placeholder.jpg";

  const cleaned = raw.replace(/^\.\//, "").replace(/^books\//, "");
  const aliasMap = new Map([
    [normalizeAssetName("nanomaterials-ecotoxicity-safety-and-public-perception-k.jpg"), "nanomaterials-ecotoxicity-safety-and-public-perception-k.jpg"],
    [normalizeAssetName("enstrumental-gida-analizleri-k.jpg"), "enstrumental-gida-analizleri-k.jpg"],
    [normalizeAssetName("lipids and edible oils-k.jpg"), "lipids and edible oils-k.jpg"],
    [normalizeAssetName("Bioactive Peptides 2024.jpg"), "Bioactive Peptides 2024.jpg"],
    [normalizeAssetName("MUTFAGIN GİZEMLERİ MUTFAK KİMYASI.jpg"), "MUTFAGIN GİZEMLERİ MUTFAK KİMYASI.jpg"],
    [normalizeAssetName("Handbook of Analysis and Extraction Methods of Anthocyanins 2025.jpg"), "Handbook of Analysis and Extraction Methods of Anthocyanins 2025.jpg"],
    [normalizeAssetName("Copper Nanostructures 2022.jpg"), "Copper Nanostructures 2022.jpg"],
    [normalizeAssetName("Flavoromics 2024.jpg"), "Flavoromics 2024.jpg"],
    [normalizeAssetName("Food Waste Recovery Second Edition 2021.jpg"), "Food Waste Recovery Second Edition 2021.jpg"],
    [normalizeAssetName("Functional Foods 2022.jpg"), "Functional Foods 2022.jpg"],
    [normalizeAssetName("Handbook of Seafood and Seafood Products Analysis 2024.jpg"), "Handbook of Seafood and Seafood Products Analysis 2024.jpg"],
    [normalizeAssetName("Mass Spectroscopy in Food Analysis 2022.jpg"), "Mass Spectroscopy in Food Analysis 2022.jpg"],
    [normalizeAssetName("Mutfakta Gıdamı İşliyorum 2021.jpg"), "Mutfakta Gıdamı İşliyorum 2021.jpg"],
    [normalizeAssetName("Phytopharmaceuticals, Potential Therapeutic Applications 2021.jpg"), "Phytopharmaceuticals, Potential Therapeutic Applications 2021.jpg"],
    [normalizeAssetName("PLM Enabling Smart X 2020.jpg"), "PLM Enabling Smart X 2020.jpg"],
    [normalizeAssetName("Studies of Natural Products Chemistry2021.jpg"), "Studies of Natural Products Chemistry2021.jpg"],
    [normalizeAssetName("Kaplumbağalar Kitabı 2022.png"), "Kaplumbağalar Kitabı 2022.png"],
    [normalizeAssetName("Bioactive Compounds from Food 2024.jpg"), "Bioactive Compounds from Food 2024.jpg"],
    [normalizeAssetName("Encyclopedia of Food Safety 2024.jpg"), "Encyclopedia of Food Safety 2024.jpg"],
    [normalizeAssetName("gida-nanobiyoteknolojisi-2023.jpg"), "gida-nanobiyoteknolojisi-2023.jpg"],
    [normalizeAssetName("Statistics in Food and Biotechnology 2024.jpg"), "Statistics in Food and Biotechnology 2024.jpg"]
  ]);

  const normalizedInput = normalizeAssetName(cleaned);
  const exactAlias = aliasMap.get(normalizedInput);
  if (exactAlias) return `books/${exactAlias}`;

  const finalPath = cleaned.startsWith("books/") ? cleaned : `books/${cleaned}`;
  return finalPath;
};

const chapterCatalog = [
  { title: "Probiotics and Probiotics in Food, Nutrition and Health", image: "probiotics.jpg" },
  { title: "Methods Of Analysis Of Food Components And Additives", image: "MethodsOfAnalysisOfFoodComponentsAndAdditives.jpg" },
  { title: "Methods of Analysis of Food components and Additives (Second Edition)", image: "MethodsOfAnalysisOfFoodComponentsAndAdditives2.jpg" },
  { title: "Arı Ürünleri ve Sağlık", image: "ariurunlerivesaglik.jpg" },
  { title: "Handbook Of Food Analysis Instruments", image: "HandbookOfFoodAnalysisInstruments.jpg" },
  { title: "Case Studies in Food Safety and Environmental Health", image: "casestudies.jpg" },
  { title: "Comprehensive Analytical Chemistry", image: "comprehensiveanalyticalchemistry.jpg" },
  { title: "Dietary Supplements", image: "dietarysupplements.jpg" },
  { title: "Akdeniz Usulü Beslenme", image: "akdenizusulubeslenme.jpg" },
  { title: "Flow Inkection Analysis of Food Addititives", image: "flowinjectionanalysis.jpg" },
  { title: "Food Colorants - Chemical and Functional Properties", image: "foodcolorants.jpg" },
  { title: "Food Fortification and Supplementation", image: "foodfortification.jpg" },
  { title: "Chemical, Biological and Functional Aspects of Food Lipids", image: "foodlipids.jpg" },
  { title: "Kanserden Korunmada Gıdalar ve Beslenme", image: "kanserden_korunmada_gidalar_ve_beslenme-76x107.jpg" },
  { title: "Food Waste Recovery", image: "foodwasterecovery.jpg" },
  { title: "Handbook of Food Analysis", image: "handbookoffoodanalysis.jpg" },
  { title: "Handbook of Food Chemistry", image: "handbookoffoodchemistry.jpg" },
  { title: "Microbial Food Safety and Preservation Techniques", image: "microbialfoodsafety.jpg" },
  { title: "Nanotechnologies in Food and Agriculture", image: "nanotechnologyinfood.jpg" },
  { title: "Novel Technologies in Food Science", image: "noveltechnologies.jpg" },
  { title: "Nutraceuticals", image: "nutraceuticals.jpg" },
  { title: "Sofralık Zeytin ve Zeytinyağı Teknolojisi", image: "sofralikzeytin.jpg" },
  { title: "Tıp Şarap - Sağlık Yaşam", image: "tipsarap.jpg" },
  { title: "Traditional Foods", image: "traditionalfoods.jpg" },
  { title: "Functional Properties of Traditional Foods", image: "traditionalfoods2.jpg" },
  { title: "Zeytinyağı ve Sağlık", image: "zeytinyagivesaglik.jpg" },
  { title: "Advances in Food Diagnostics", image: "AdvancesFoodDiagnostics2017-75x109.jpg" },
  { title: "Anne Sütü ve Emzirme", image: "AnneSutuveEmzirme-74x109.jpg" },
  { title: "Nanotechnology 2017", image: "Nanotechnology2017Prasad-109x109.jpg" },
  { title: "Russian", image: "Rusca-75x109.jpg" },
  { title: "Çince", image: "cince-75x109.jpg" },
  { title: "Spectroscopic Methodsin Food Analysis", image: "SpectroscopicMethodsinFoodAnalysis-74x109.jpg" },
  { title: "Sustainable Food Systems from Agriculture to Industry", image: "SustainableFoodSystemsfromAgricultureToIndustry-89x109.jpg" },
  { title: "Emerging Trends in Agro-Nanotechnonology 2018", image: "EmergingTrendsinAgro-Nanotechnonology2018-76x109.jpg" },
  { title: "Nanotechnology Application in the Food Industry 2018", image: "NanotechnologyApplicationintheFoodIndustry2018-72x109.jpg" },
  { title: "Sarımsak", image: "Sarimsak.jpg" },
  { title: "İçecekler", image: "icecekler.jpg" },
  { title: "Zeytinyağı", image: "zeytinyagi-on.jpg" },
  { title: "Nar Kitabi 2018", image: "NarKitabi2018mockup1-163x109.jpg" },
  { title: "Enginar Kitabi 2018", image: "EnginarKitabiK.jpg" },
  { title: "Bioactive Molecules in Food", image: "BioactiveMoleculesinFood-k.jpg" },
  { title: "Engineering Tools in The Beverage Industry", image: "ENGINEERINGTOOLSINTHEBEVERAGEINDUSTRYVolume3TheScienceofBeverages2019-k.jpg" },
  { title: "Fermented Beverages", image: "FermentedBeveragesVolume5TheScienceofBeverages-k.jpg" },
  { title: "Fingerprint Techniques 2018", image: "FingerprintTechniques2018-k.jpg" },
  { title: "Microstructure of Dairy Products", image: "MicrostructureDairyProducts2018-k.jpg" },
  { title: "Nanomaterials: Ecotoxicity, Safety and Public Perception", image: "nanomaterials-ecotoxicity-safety-and-public-perception-k.jpg" },
  { title: "Production And Management of Beverages", image: "TheScienceofBeveragesVolume1ProductandManagementofBeverages-k.jpg" },
  { title: "Ambient Mass Spectroscopy Techniques in Food and the Environment", image: "Ambient_Mass_Spectroscopy_Techniques_in_Food_and_the_Environment2019-k.jpg" },
  { title: "Functional and Medicinal Beverages", image: "FunctionalandMedicinalBeverages2019-k.jpg" },
  { title: "İzmir'in Lezzet Öyküsü", image: "Izmirin_Lezzet_Oykusu-k.jpg" },
  { title: "Saving Food", image: "Saving_Food_2019-k.jpg" },
  { title: "Sirke Kadim bir İksir", image: "Sirke2019-k.jpg" },
  { title: "Enstrümental Gıda Analizleri", image: "enstrumental-gida-analizleri-k.jpg" },
  { title: "Lipids and Edible Oils", image: "lipids and edible oils-k.jpg" },
  { title: "Ebelik ve Toplum Sağlığı", image: "ebelik-ve-toplum-sagligi-k.jpg" },
  { title: "Yetiştiricilikten Kültüre Türklerde Keçi", image: "yetistiriciliktenkultureturklerdekeci-k.jpg" },
  { title: "Food Packaging Innovations and Shelf Life", image: "food_packaging_innovations_and_shelf-life-k.jpg" },
  { title: "Mass Spectrometry Imaging in Food Analysis", image: "mass_spectrometry_imaging_in_food_analysis-k.jpg" },
  { title: "Proteomics For Food Authentication", image: "proteomics_for_food_authentication-k.jpg" },
  { title: "Bioactive Peptides From Food", image: "Bioactive Peptides 2024.jpg" },
  { title: "MUTFAĞIN GİZEMLERİ MUTFAK KİMYASI", image: "MUTFAGIN GİZEMLERİ MUTFAK KİMYASI.jpg" },
  { title: "Handbook of Analysis And Extraction Methods of Anthocyanins", image: "Handbook of Analysis and Extraction Methods of Anthocyanins 2025.jpg" },
  { title: "Copper Nanostructures Next-Generation of Agrochemicals for Sustainable Agroecosystems", image: "Copper Nanostructures 2022.jpg" },
  { title: "Flavoromics", image: "Flavoromics 2024.jpg" },
  { title: "Food Waste Recovery (Second Edition)", image: "Food Waste Recovery Second Edition 2021.jpg" },
  { title: "Functional Foods", image: "Functional Foods 2022.jpg" },
  { title: "Handbook of Seafood and Seafood Products Analysis", image: "Handbook of Seafood and Seafood Products Analysis 2024.jpg" },
  { title: "Mass Spectroscopy in Food Analysis", image: "Mass Spectroscopy in Food Analysis 2022.jpg" },
  { title: "Mutfakta Gıdamı İşliyorum", image: "Mutfakta Gıdamı İşliyorum 2021.jpg" },
  { title: "Phytopharmaceuticals, Potential Therapeutic Applications", image: "Phytopharmaceuticals, Potential Therapeutic Applications 2021.jpg" },
  { title: "Product Lifecycle Management Enabling Smart X", image: "PLM Enabling Smart X 2020.jpg" },
  { title: "Studies of Natural Products Chemistry", image: "Studies of Natural Products Chemistry2021.jpg" },
  { title: "Kaplumbağalar", image: "Kaplumbağalar Kitabı 2022.png" },
  { title: "Bioactive Compounds from Food", image: "Bioactive Compounds from Food 2024.jpg" },
  { title: "Encyclopedia of Food Safety", image: "Encyclopedia of Food Safety 2024.jpg" },
  { title: "Gıda Nanobiyoteknolojisi Food Nanobiotechnology", image: "gida-nanobiyoteknolojisi-2023.jpg" },
  { title: "Statistics in Food and Biotechnology", image: "Statistics in Food and Biotechnology 2024.jpg" }
];
const visibleChapterEntries = chapterCatalog.slice(0, TARGET_CHAPTER_COUNT);

const modal = document.getElementById("bookModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");

function openBookModal(book) {
  if (!modal || !modalImage || !modalTitle || !book) return;
  modalImage.src = book.image;
  modalImage.alt = book.title;
  modalTitle.textContent = book.title;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
}

function closeBookModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
}

function renderBooks() {
  if (!bookShelfList) return;

  if (bookCountEl) {
    bookCountEl.textContent = String(TARGET_BOOK_COUNT);
  }

  if (chapterCountEl) {
    chapterCountEl.textContent = String(TARGET_CHAPTER_COUNT);
  }

  bookShelfList.innerHTML = visibleBooks.map((book) => `
    <article class="product" data-title="${book.title}" tabindex="0" aria-label="${book.title}">
      <img src="${book.image}" alt="${book.title}" class="img_thumb" />
      <div class="product_title"><p>${book.title}</p></div>
      <img class="fx_magazine" src="images/magazine_fx.png" alt="" />
      <img class="fx_shadow" src="images/shadow_fx.png" alt="" />
      <div class="icons_sprite"></div>
    </article>
  `).join("");

  bookShelfList.querySelectorAll(".product").forEach((product) => {
    const title = product.dataset.title;
    const matchedBook = visibleBooks.find((book) => book.title === title);

    product.addEventListener("click", () => openBookModal(matchedBook));
    product.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && matchedBook) {
        event.preventDefault();
        openBookModal(matchedBook);
      }
    });
  });
}

function renderChapters() {
  if (!chapterList) return;

  chapterList.innerHTML = visibleChapterEntries.map((entry) => {
    const resolvedImage = resolveChapterImage(entry.image);
    return `
      <article class="chapter-card" data-title="${entry.title}" tabindex="0" aria-label="${entry.title}">
        <img src="${resolvedImage}" alt="${entry.title}" class="chapter-card__image" />
        <div class="chapter-card__title">${entry.title}</div>
      </article>
    `;
  }).join("");

  chapterList.querySelectorAll(".chapter-card").forEach((card) => {
    const title = card.dataset.title;
    const match = visibleChapterEntries.find((entry) => entry.title === title);

    card.addEventListener("click", () => {
      if (!match) return;
      openBookModal({ title: match.title, image: resolveChapterImage(match.image) });
    });
    card.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && match) {
        event.preventDefault();
        openBookModal({ title: match.title, image: resolveChapterImage(match.image) });
      }
    });
  });
}

function setShelfView(view) {
  if (!shelfRoot) return;
  shelfRoot.dataset.view = view;

  const buttons = document.querySelectorAll(".button_bar");
  buttons.forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle("active", isActive);
  });

  if (bookShelfList) {
    bookShelfList.classList.toggle("is-view-hidden", view !== "books");
  }

  if (chapterList) {
    chapterList.classList.toggle("is-view-hidden", view !== "chapters");
  }

  if (view === "chapters") {
    renderChapters();
  } else {
    renderBooks();
  }
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.classList.contains("book-modal__backdrop")) {
      closeBookModal();
    }
  });

  const closeButton = document.querySelector(".book-modal__close");
  if (closeButton) {
    closeButton.addEventListener("click", closeBookModal);
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeBookModal();
    }
  });
}

document.querySelectorAll(".button_bar").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    setShelfView(button.dataset.view);
  });
});

renderBooks();
setShelfView("books");
