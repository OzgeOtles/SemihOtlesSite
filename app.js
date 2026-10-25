const bookShelfList = document.getElementById("bookShelfList");
const chapterList = document.getElementById("chapterList");
const shelfRoot = document.getElementById("bookshelf_slider_widget");
const books = Array.isArray(window.booksData) ? window.booksData : [];

const normalizeBookTitle = (title = "") => String(title || "")
  .toLowerCase()
  .replace(/[_-]+/g, " ")
  .replace(/\b(?:mockup|edition|volume|vol|b|k|bk|cover|kitap)\b/gi, " ")
  .replace(/\b\d{4}\b/g, " ")
  .replace(/\b\d+\s*[xX×]\s*\d+\b/g, " ")
  .replace(/\b\d+\b/g, " ")
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const keepBestTitle = (title) => String(title || "")
  .replace(/[_-]+/g, " ")
  .replace(/\b(?:mockup|edition|volume|vol|b|k|bk|cover|kitap)\b/gi, " ")
  .replace(/\b\d{4}\b/g, " ")
  .replace(/\b\d+\s*[xX×]\s*\d+\b/g, " ")
  .replace(/\b\d+\b/g, " ")
  .replace(/\s{2,}/g, " ")
  .replace(/\s+$/g, "")
  .trim();

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

  const totalCount = document.getElementById("totalBookCount");
  if (totalCount) {
    totalCount.textContent = String(dedupedBooks.length);
  }

  bookShelfList.innerHTML = dedupedBooks.map((book) => `
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
    const matchedBook = dedupedBooks.find((book) => book.title === title);

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

  chapterList.innerHTML = dedupedBooks.map((book) => `
    <article class="chapter-panel">
      <h3>${book.title}</h3>
      <ul>
        ${book.chapters.map((chapter) => `<li>${chapter}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function setShelfView(view) {
  if (!shelfRoot) return;
  shelfRoot.dataset.view = view;

  const buttons = document.querySelectorAll(".button_bar");
  buttons.forEach((button) => {
    const isActive = button.dataset.view === view;
    button.classList.toggle("active", isActive);
  });

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
