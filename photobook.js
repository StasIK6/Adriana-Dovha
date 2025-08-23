document.addEventListener("DOMContentLoaded", () => {
    const bookCover = document.querySelector('.book-cover');
    const lightbox = document.querySelector('.lightbox');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.prev-page');
    const nextBtn = document.querySelector('.next-page');
    const pages = document.querySelectorAll('.lightbox-img');

    let currentIndex = 0;

    // Відкриття книги (з обкладинки)
    bookCover.addEventListener("click", () => {
        openLightbox(0);
    });

    function openLightbox(index) {
        currentIndex = index;
        updatePages();
        lightbox.style.display = "flex";
    }

    function updatePages() {
        pages.forEach((page, index) => {
            page.classList.toggle('active', index === currentIndex);
        });
    }

    closeBtn.addEventListener("click", () => {
        lightbox.style.display = "none";
    });

    prevBtn.addEventListener("click", () => {
        if (currentIndex > 0) {
            currentIndex--;
            updatePages();
        }
    });

    nextBtn.addEventListener("click", () => {
        if (currentIndex < pages.length - 1) {
            currentIndex++;
            updatePages();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "ArrowRight") nextBtn.click();
        if (e.key === "Escape") closeBtn.click();
    });
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

//малі форми
function updatePages() {
    pages.forEach((page, index) => {
        page.classList.toggle('active', index === currentIndex);

        // Адаптація під мобільні екрани
        if(window.innerWidth <= 768) {
            page.style.maxHeight = window.innerHeight * 0.7 + "px";
            page.style.width = "90%";
        } else {
            page.style.maxHeight = "";
            page.style.width = "";
        }
    });
}

// Адаптація при зміні розміру вікна
window.addEventListener("resize", updatePages);

document.addEventListener("DOMContentLoaded", () => {
  const bookCover = document.querySelector(".book-cover");
  const lightbox = document.querySelector(".lightbox");
  const closeBtn = document.querySelector(".close-lightbox");
  const prevBtn = document.querySelector(".prev-page");
  const nextBtn = document.querySelector(".next-page");
  const pages = document.querySelectorAll(".lightbox-img");

  // нові елементи
  const hint = document.querySelector(".lightbox-hint");
  const zoomControls = document.querySelector(".zoom-controls");
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
    updatePages(true);       // true = після перемикання/відкриття скидаємо зум
    lightbox.style.display = "flex";
    document.body.classList.add("no-scroll");

    showHintOnce();          // показуємо підказку при відкритті
  }

  function closeLightbox() {
    lightbox.style.display = "none";
    document.body.classList.remove("no-scroll");
    hideHintInstant();       // щоб у наступне відкриття з’явилась коректно
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
        page.style.transform = ""; // прибираємо будь-який масштаб з неактивних
      }
    });
    if (resetZoom) resetZoomToDefault();
  }

// ==================== СВАЙПИ ====================
let touchStartX = 0;
let touchEndX = 0;
const SWIPE_THRESHOLD = 50; // мінімальна дистанція для визнання свайпу

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
      // свайп вправо → попередня сторінка
      prevBtn?.click();
    } else {
      // свайп вліво → наступна сторінка
      nextBtn?.click();
    }
  }
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

  // Кнопки зуму
  zoomButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const mode = e.currentTarget.dataset.zoom;
      if (mode === "in") zoomIn();
      else if (mode === "out") zoomOut();
      else if (mode === "reset") zoomReset();
    });
  });

  // Подвійний клік/тап по зображенню — швидкий зум/скидання
  lightbox.addEventListener("dblclick", (e) => {
    // зумимо тільки якщо двічі клацнули на зображенні
    if (e.target.classList.contains("lightbox-img")) {
      if (scale === 1) {
        scale = 2; // швидко наблизити
      } else {
        scale = 1; // або скинути
      }
      applyZoom();
    }
  });

  // Zoom жестом: Ctrl/⌘ + колесо — зручно на трекпаді
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

  // ---------- ПІДКАЗКА: ПЛАВНО ПОКАЗАТИ/СХОВАТИ ПІСЛЯ ПЕРШОЇ ВЗАЄМОДІЇ ----------
  function showHintOnce() {
    if (!hint) return;
    // показ
    hint.classList.add("is-visible");

    // зняти після ПЕРШОЇ взаємодії
    const hideOnce = () => hideHintSmooth(true);

    // кліки/тапи по всьому лайтбоксу, стрілки на клавіатурі — усе вважаємо взаємодією
    lightbox.addEventListener("click", hideOnce, { once: true, capture: true });
    document.addEventListener("keydown", hideOnce, { once: true });
    // свайп (просте наближення: якщо буде touchmove — вважаємо взаємодією)
    lightbox.addEventListener("touchstart", hideOnce, { once: true, passive: true });
  }

  function hideHintSmooth(keepVisibleStateClean = false) {
    if (!hint) return;
    // просто прибираємо клас — CSS зробить плавний фейдаут
    hint.classList.remove("is-visible");

    // якщо хочеш гарантувати "чистоту" стану після анімації — розкоментуй:
    // setTimeout(() => { if (!hint.classList.contains('is-visible')) hint.style.display = ''; }, 500);
  }

  function hideHintInstant() {
    if (!hint) return;
    hint.classList.remove("is-visible");
  }

  // ---------- КНОПКИ ЛАЙТБОКСУ ----------
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      closeLightbox();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--;
        updatePages(true); // перемикаємо сторінку та скидаємо зум
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (currentIndex < pages.length - 1) {
        currentIndex++;
        updatePages(true); // перемикаємо сторінку та скидаємо зум
      }
    });
  }

  // ---------- КЛАВІАТУРА ----------
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display !== "flex") return;

    if (e.key === "ArrowLeft") {
      prevBtn?.click();
    } else if (e.key === "ArrowRight") {
      nextBtn?.click();
    } else if (e.key === "Escape") {
      closeBtn?.click();
    } else if (e.key === "+" || e.key === "=") {
      zoomIn();
    } else if (e.key === "-" || e.key === "_") {
      zoomOut();
    } else if (e.key.toLowerCase() === "0") {
      zoomReset();
    }
  });

  // ---------- ДОПОМОЖНІ: АДАПТАЦІЯ ПРИ РОЗМІРІ ВІКНА ----------
  // тримаємо зображення «акуратним» після resize
  window.addEventListener("resize", () => {
    applyZoom();
  });
});

/////////////////////////////

function showFloatingText(id) {
  const el = document.getElementById(id);
  el.style.display = 'block';

  // автоматично сховати через 5с
  setTimeout(() => {
    el.style.display = 'none';
  }, 5000);

  // ховається при кліку
  el.onclick = () => {
    el.style.display = 'none';
  };
}

// При завантаженні сторінки показуємо правильний текст
window.onload = () => {
  if (window.innerWidth <= 768) {
    showFloatingText("mobileText");
  } else {
    showFloatingText("desktopText");
  }
};
