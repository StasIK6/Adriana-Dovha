document.addEventListener("DOMContentLoaded", () => {
  const bookCover = document.querySelector(".book-cover");
  const lightbox = document.querySelector(".lightbox");
  const closeBtn = document.querySelector(".close-lightbox");
  const prevBtn = document.querySelector(".prev-page");
  const nextBtn = document.querySelector(".next-page");
  const pages = document.querySelectorAll(".lightbox-img");

  // нові елементи
  const hint = document.querySelector(".lightbox-hint");
  const zoomButtons = document.querySelectorAll(".zoom-btn");

  let currentIndex = 0;

  // Зум стан
  let scale = 1;
  const SCALE_STEP = 0.2;
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 3;

  // ---------- ВІДКРИТТЯ ЛАЙТБОКСУ З ОБКЛАДИНКИ ----------
  if (bookCover) {
    bookCover.addEventListener("click", () => {
      openLightbox(0);
    });
  }

  function openLightbox(index) {
    currentIndex = clampIndex(index);
    updatePages(true);
    lightbox.style.display = "flex";
    document.body.classList.add("no-scroll");
    showHintOnce();
  }

  function closeLightbox() {
    lightbox.style.display = "none";
    document.body.classList.remove("no-scroll");
    hideHintInstant();
  }

  // ---------- ПЕРЕМІКАННЯ СТОРІНОК ----------
  function clampIndex(i) {
    return Math.max(0, Math.min(pages.length - 1, i));
  }

  function updatePages(resetZoom = false) {
    pages.forEach((page, index) => {
      const active = index === currentIndex;
      page.classList.toggle("active", active);
      if (!active) {
        page.style.transform = "";
      }

      // Адаптація під мобільні
      if (window.innerWidth <= 768) {
        page.style.maxHeight = window.innerHeight * 0.7 + "px";
        page.style.width = "90%";
      } else {
        page.style.maxHeight = "";
        page.style.width = "";
      }
    });
    if (resetZoom) resetZoomToDefault();
  }

  // ---------- ЗУМ ----------
  function applyZoom() {
    const active = document.querySelector(".lightbox-img.active");
    if (!active) return;
    active.style.transform = `scale(${scale})`;
  }

  function resetZoomToDefault() {
    scale = 1;
    applyZoom();
  }

  function zoomIn() {
    scale = Math.min(MAX_SCALE, round2(scale + SCALE_STEP));
    applyZoom();
  }

  function zoomOut() {
    scale = Math.max(MIN_SCALE, round2(scale - SCALE_STEP));
    applyZoom();
  }

  function zoomReset() {
    resetZoomToDefault();
  }

  function round2(val) {
    return Math.round(val * 100) / 100;
  }

  zoomButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const mode = e.currentTarget.dataset.zoom;
      if (mode === "in") zoomIn();
      else if (mode === "out") zoomOut();
      else if (mode === "reset") zoomReset();
    });
  });

  // Подвійний клік/тап
  lightbox.addEventListener("dblclick", (e) => {
    if (e.target.classList.contains("lightbox-img")) {
      scale = scale === 1 ? 2 : 1;
      applyZoom();
    }
  });

  // Zoom колесом (з Ctrl/⌘)
  lightbox.addEventListener(
    "wheel",
    (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) zoomIn();
        else zoomOut();
      }
    },
    { passive: false }
  );

  // ---------- СВАЙПИ ----------
  let touchStartX = 0;
  let touchEndX = 0;
  const SWIPE_THRESHOLD = 50;

  if (lightbox) {
    lightbox.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    lightbox.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) {
        prevBtn?.click();
      } else {
        nextBtn?.click();
      }
    }
  }

  // ---------- ПІДКАЗКА ----------
  function showHintOnce() {
    if (!hint) return;
    hint.classList.add("is-visible");

    const hideOnce = () => hideHintSmooth(true);
    lightbox.addEventListener("click", hideOnce, { once: true, capture: true });
    document.addEventListener("keydown", hideOnce, { once: true });
    lightbox.addEventListener("touchstart", hideOnce, { once: true, passive: true });
  }

  function hideHintSmooth() {
    if (!hint) return;
    hint.classList.remove("is-visible");
  }

  function hideHintInstant() {
    if (!hint) return;
    hint.classList.remove("is-visible");
  }

  // ---------- КНОПКИ ----------
  closeBtn?.addEventListener("click", () => closeLightbox());
  prevBtn?.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updatePages(true);
    }
  });
  nextBtn?.addEventListener("click", () => {
    if (currentIndex < pages.length - 1) {
      currentIndex++;
      updatePages(true);
    }
  });

  // ---------- КЛАВІАТУРА ----------
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display !== "flex") return;

    if (e.key === "ArrowLeft") prevBtn?.click();
    else if (e.key === "ArrowRight") nextBtn?.click();
    else if (e.key === "Escape") closeBtn?.click();
    else if (e.key === "+" || e.key === "=") zoomIn();
    else if (e.key === "-" || e.key === "_") zoomOut();
    else if (e.key.toLowerCase() === "0") zoomReset();
  });

  // ---------- RESIZE ----------
  window.addEventListener("resize", () => applyZoom());
});

// ==================== LANGUAGE SWITCHER ====================
const languageSwitcher = document.querySelector('.language-switcher');
if (languageSwitcher) {
  const languageButton = languageSwitcher.querySelector('.language-button');
  const arrow = languageButton?.querySelector('.arrow');

  languageButton?.addEventListener('click', () => {
    languageSwitcher.classList.toggle('active');
    if (arrow) {
      arrow.style.transform = languageSwitcher.classList.contains('active') ? 'rotate(-135deg)' : 'rotate(45deg)';
    }
  });
}

// ==================== MENU TOGGLE ====================
function toggleMenu() {
  const menu = document.querySelector('.menu');
  if (menu) menu.classList.toggle('menu-open');
}

const toggleButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

if (toggleButton && menu) {
  toggleButton.addEventListener('click', () => {
    menu.classList.toggle('menu-open');
  });

  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('menu-open');
    });
  });
}

// ==================== FLOATING TEXT ====================
function showFloatingText(id) {
  const el = document.getElementById(id);
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
  el.onclick = () => { el.style.display = 'none'; };
}

window.onload = () => {
  if (window.innerWidth <= 768) {
    showFloatingText("mobileText");
  } else {
    showFloatingText("desktopText");
  }
};