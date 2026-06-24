const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/profile.php?id=61589443176518",
  instagram: "https://www.instagram.com/anamaykh/",
  telegram: "https://t.me/phasukarphan"
};

function applySocialLinks() {
  document.querySelectorAll("[data-social]").forEach((link) => {
    const key = link.dataset.social;
    const url = SOCIAL_LINKS[key] || "#";

    link.href = url;

    if (url !== "#") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });
}

function initMenu() {
  const openMenu = document.getElementById("openMenu");
  const closeMenu = document.getElementById("closeMenu");
  const sideMenu = document.getElementById("sideMenu");
  const menuBackdrop = document.getElementById("menuBackdrop");

  if (!openMenu || !closeMenu || !sideMenu || !menuBackdrop) return;

  function closeSideMenu() {
    sideMenu.classList.remove("is-open");
    menuBackdrop.classList.remove("is-visible");
  }

  openMenu.addEventListener("click", () => {
    sideMenu.classList.add("is-open");
    menuBackdrop.classList.add("is-visible");
  });

  closeMenu.addEventListener("click", closeSideMenu);
  menuBackdrop.addEventListener("click", closeSideMenu);
}

const basePath = document.body.classList.contains("home-page") ? "./" : "../";

const PRODUCTS = [

  {
    name: "Anamay Original",
    price: "$0.75",
    keywords: ["original", "classic", "coconut", "olive", "shea", "soap"],
    url: `${basePath}anamay-original/`,
    image: `${basePath}images/product-original.webp`
  },
  {
    name: "Anamay Turmeric & Honey",
    price: "$1.00",
    keywords: ["turmeric", "honey", "essential oil", "soap"],
    url: `${basePath}turmeric-honey/`,
    image: `${basePath}images/product-turmeric-honey.webp`
  },
  {
    name: "Anamay Jasmine",
    price: "$1.00",
    keywords: ["jasmine", "jasmine oil", "soap"],
    url: `${basePath}jasmine/`,
    image: `${basePath}images/product-jasmine.webp`
  }
];

function initSearch() {
  const searchToggle = document.getElementById("searchToggle");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  if (!searchToggle || !searchInput || !searchResults) return;

  function renderResults(query) {
    const cleanQuery = query.trim().toLowerCase();

    const matches = cleanQuery
      ? PRODUCTS.filter((product) => {
          const haystack = [product.name, ...product.keywords].join(" ").toLowerCase();
          return haystack.includes(cleanQuery);
        })
      : PRODUCTS;

    searchResults.classList.add("is-visible");

    if (matches.length === 0) {
      searchResults.innerHTML = `<div class="search-empty">No product found. Try “Original”, “Turmeric”, “Honey”, or “Jasmine”.</div>`;
      return;
    }

    searchResults.innerHTML = matches.map((product) => `
      <a class="search-result-item" href="${product.url}">
        <img src="${product.image}" alt="${product.name}" />
        <div>
          <strong>${product.name}</strong>
          <span>${product.price}</span>
        </div>
      </a>
    `).join("");
  }

  searchToggle.addEventListener("click", () => {
    searchInput.classList.toggle("is-visible");

    if (searchInput.classList.contains("is-visible")) {
      searchInput.focus();
      renderResults(searchInput.value);
    } else {
      searchResults.classList.remove("is-visible");
    }
  });

  searchInput.addEventListener("input", () => {
    renderResults(searchInput.value);
  });

  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const cleanQuery = searchInput.value.trim().toLowerCase();
      const firstMatch = PRODUCTS.find((product) => {
        const haystack = [product.name, ...product.keywords].join(" ").toLowerCase();
        return haystack.includes(cleanQuery);
      });

      if (firstMatch) {
        window.location.href = firstMatch.url;
      }
    }

    if (event.key === "Escape") {
      searchResults.classList.remove("is-visible");
      searchInput.classList.remove("is-visible");
    }
  });

  document.addEventListener("click", (event) => {
    const clickedInside = event.target.closest(".header-search");

    if (!clickedInside) {
      searchResults.classList.remove("is-visible");
    }
  });
}


function initGalleries() {
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const mainImage = gallery.querySelector(".main-gallery-image");
    const thumbnails = Array.from(gallery.querySelectorAll(".thumbnail"));

    if (!mainImage || thumbnails.length === 0) return;

    const slides = thumbnails.map((thumbnail) => thumbnail.dataset.image);
    let currentIndex = 0;
    let slideTimer;

    function showImage(index) {
      const safeIndex = ((index % slides.length) + slides.length) % slides.length;

      mainImage.src = slides[safeIndex];

      thumbnails.forEach((item, idx) => {
        item.classList.toggle("is-active", idx === safeIndex);
      });

      currentIndex = safeIndex;
    }

    function startAutoSlide() {
      clearInterval(slideTimer);

      slideTimer = setInterval(() => {
        showImage(currentIndex + 1);
      }, 3500);
    }

    thumbnails.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        showImage(index);
        startAutoSlide();
      });
    });

    showImage(0);
    startAutoSlide();
  });
}

function initSizeOptions() {
  const productPrice = document.getElementById("productPrice");
  const sizeOptions = document.querySelectorAll(".size-option");

  if (!productPrice || sizeOptions.length === 0) return;

  sizeOptions.forEach((option) => {
    option.addEventListener("click", () => {
      sizeOptions.forEach((item) => {
        item.classList.remove("is-selected");
        item.setAttribute("aria-checked", "false");
      });

      option.classList.add("is-selected");
      option.setAttribute("aria-checked", "true");

      productPrice.textContent = option.dataset.price;
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  applySocialLinks();
  initMenu();
  initSearch();
  initGalleries();
  initSizeOptions();
});
