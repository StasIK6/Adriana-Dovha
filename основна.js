// ==================== SCROLL TO TOP ====================
document.addEventListener('DOMContentLoaded', () => {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (!scrollToTopBtn) return;

  let firstScrollDetected = false;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      if (!firstScrollDetected) {
        firstScrollDetected = true;
        setTimeout(() => {
          scrollToTopBtn.classList.add('show');
          scrollToTopBtn.classList.remove('hide');
        }, 300);
      } else {
        scrollToTopBtn.classList.add('show');
        scrollToTopBtn.classList.remove('hide');
      }
    } else {
      scrollToTopBtn.classList.add('hide');
      scrollToTopBtn.classList.remove('show');
    }
  });

  scrollToTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

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

// ==================== LIGHTBOX ====================
// --- Основні елементи ---
const images = document.querySelectorAll('.images a');
const lightbox = document.getElementById('lightbox');

const lbCloseBtn = document.createElement('span');
lbCloseBtn.classList.add('close');
lbCloseBtn.innerHTML = '&times;';

const lbPrevBtn = document.createElement('span');
lbPrevBtn.classList.add('prev');
lbPrevBtn.textContent = '←';

const lbNextBtn = document.createElement('span');
lbNextBtn.classList.add('next');
lbNextBtn.textContent = '→';

const lightboxImg = document.createElement('img');
lightboxImg.classList.add('lightbox-img');

if (lightbox) {
  lightbox.appendChild(lbCloseBtn);
  lightbox.appendChild(lbPrevBtn);
  lightbox.appendChild(lbNextBtn);
  lightbox.appendChild(lightboxImg);
}

let currentIndex = 0;

// --- Блокування скролу сторінки під лайтбоксом ---
function lockScroll(lock) {
  if (lock) {
    document.body.classList.add('no-scroll');
  } else {
    document.body.classList.remove('no-scroll');
  }
}

// --- Відкриття / закриття зображень ---
function showImage(index) {
  if (!lightbox) return;
  currentIndex = index;
  lightbox.style.display = 'flex';
  const a = images[currentIndex];
  const full = a?.dataset?.full || a?.getAttribute('href') || a?.querySelector('img')?.src || '';
  lightboxImg.src = full;
  updateNavButtons();
  lockScroll(true);
}

function updateNavButtons() {
  lbPrevBtn.style.display = currentIndex === 0 ? 'none' : 'block';
  lbNextBtn.style.display = currentIndex === images.length - 1 ? 'none' : 'block';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.style.display = 'none';
  lightboxImg.src = '';
  lockScroll(false);
}

// --- Події лайтбоксу ---
images.forEach((link, index) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    showImage(index);
  });
});

lbPrevBtn.addEventListener('click', () => {
  if (currentIndex > 0) showImage(currentIndex - 1);
});
lbNextBtn.addEventListener('click', () => {
  if (currentIndex < images.length - 1) showImage(currentIndex + 1);
});
lbCloseBtn.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox || lightbox.style.display !== 'flex') return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lbPrevBtn.click();
  if (e.key === 'ArrowRight') lbNextBtn.click();
});

// --- Свайп на мобільних ---
let startX = 0;
lightboxImg.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
}, { passive: true });

lightboxImg.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  if (endX - startX > 50) {
    lbPrevBtn.click();
  } else if (startX - endX > 50) {
    lbNextBtn.click();
  }
}, { passive: true });

// --- Заборона прокрутки жестами всередині лайтбоксу ---
lightbox?.addEventListener('touchmove', (e) => {
  e.preventDefault();
}, { passive: false });

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

// ==================== PROJECT CONTAINER ACCORDIONS ====================
document.querySelectorAll('.project-container').forEach(container => {
  const links = container.querySelector('.project-links');
  container.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'a') return;
    const isOpen = container.classList.toggle('active');

    if (isOpen) {
      const rect = links.getBoundingClientRect();
      const available = Math.max(120, window.innerHeight - rect.top - 20);
      links.style.maxHeight = Math.min(links.scrollHeight, available) + 'px';
      links.style.overflowY = 'auto';
      links.style.WebkitOverflowScrolling = 'touch';
    } else {
      links.style.maxHeight = '0';
    }
  });
});

window.addEventListener('resize', () => {
  document.querySelectorAll('.project-container.active .project-links').forEach(links => {
    const rect = links.getBoundingClientRect();
    const available = Math.max(120, window.innerHeight - rect.top - 20);
    links.style.maxHeight = Math.min(links.scrollHeight, available) + 'px';
  });
});

// ==================== RECOMMENDATIONS (by category) ====================
document.addEventListener('DOMContentLoaded', () => {
  const gallery = document.querySelector('.recommendations .gallery');
  if (!gallery) return;

  const currentFile = location.pathname.split('/').pop();
  const category = document.body.dataset.category || '';

  const allLinks = Array.from(document.querySelectorAll(`.project-container[data-category="${category}"] .project-links a`));

  let items = allLinks
    .filter(a => !a.href.endsWith(currentFile))
    .map(a => ({
      link: a.href,
      text: a.textContent.trim(),
      img: a.dataset.img || a.querySelector('img')?.src || 'фото основ/default.jpg'
    }));

  if (items.length === 0) return;

  items.sort(() => Math.random() - 0.5);
  const selected = items.slice(0, 3);

  gallery.innerHTML = '';
  selected.forEach(item => {
    const a = document.createElement('a');
    a.href = item.link;
    a.classList.add('image-overlay');

    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.text;

    const div = document.createElement('div');
    div.classList.add('overlay-text');
    div.textContent = item.text;

    a.appendChild(img);
    a.appendChild(div);
    gallery.appendChild(a);
  });

  const cards = gallery.querySelectorAll('.image-overlay');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const card = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        card.classList.add('show-overlay');
        setTimeout(() => {
          card.classList.remove('show-overlay');
        }, 5000);
      } else {
        card.classList.remove('show-overlay');
      }
    });
  }, { threshold: 0.5 });

  cards.forEach(card => io.observe(card));
});

// ==================== MOBILE TAP TOGGLE TEXT ====================
window.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth < 768) {
    document.querySelectorAll('.image-overlay').forEach(overlay => {
      overlay.addEventListener('click', () => {
        overlay.classList.toggle('show-text');
      });
    });
  }
});
