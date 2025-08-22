const track = document.querySelector('.carousel-track');
const slides = Array.from(track.children);
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const carouselContainer = document.querySelector('.carousel-container');
let currentIndex = 0;
let autoScrollInterval;


// Кількість видимих слайдів
function getVisibleSlidesCount() {
    const width = window.innerWidth;
    if (width < 1000) return 1;
    if (width < 1500) return 2;
    return 4;
}

// Оновлення каруселі
function updateCarousel() {
    const visibleCount = getVisibleSlidesCount();
    const slideWidth = 100 / visibleCount;
    const maxIndex = Math.max(0, slides.length - visibleCount);

    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;

    slides.forEach(slide => {
        slide.style.flex = `0 0 ${slideWidth}%`;
    });

    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    updateIndicators();
}

// Прокрутка стрілками
nextButton.addEventListener('click', () => {
    const step = getVisibleSlidesCount();
    const maxIndex = Math.max(0, slides.length - step);
    currentIndex = currentIndex + step <= maxIndex ? currentIndex + step : maxIndex;
    updateCarousel();
    startAutoScroll();
});

prevButton.addEventListener('click', () => {
    const step = getVisibleSlidesCount();
    currentIndex = currentIndex - step >= 0 ? currentIndex - step : 0;
    updateCarousel();
    startAutoScroll();
});

// Індикатори
const indicatorContainer = document.createElement('div');
indicatorContainer.classList.add('carousel-indicators');
carouselContainer.appendChild(indicatorContainer);

function createIndicators() {
    indicatorContainer.innerHTML = '';
    const visibleCount = getVisibleSlidesCount();
    const totalGroups = Math.ceil(slides.length / visibleCount);

    for (let i = 0; i < totalGroups; i++) {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => {
            currentIndex = i * visibleCount;
            updateCarousel();
            startAutoScroll();
        });
        indicatorContainer.appendChild(dot);
    }
    updateIndicators();
}

function updateIndicators() {
    const dots = indicatorContainer.querySelectorAll('.dot');
    const visibleCount = getVisibleSlidesCount();
    const activeIndex = Math.floor(currentIndex / visibleCount);

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
    });
}

// Автопрокрутка
function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
        const step = getVisibleSlidesCount();
        const maxIndex = Math.max(0, slides.length - step);
        currentIndex = currentIndex + step <= maxIndex ? currentIndex + step : 0;
        updateCarousel();
    }, 7000);
}

function stopAutoScroll() {
    clearInterval(autoScrollInterval);
}

// Свайп
let startX = 0;
track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
});

track.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    const step = getVisibleSlidesCount();
    const maxIndex = Math.max(0, slides.length - step);

    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex + step <= maxIndex) {
            currentIndex += step;
        } else if (diff < 0 && currentIndex - step >= 0) {
            currentIndex -= step;
        }
        updateCarousel();
        startAutoScroll();
    }
});

// Hover-пауза
carouselContainer.addEventListener('mouseenter', stopAutoScroll);
carouselContainer.addEventListener('mouseleave', startAutoScroll);

// Resize адаптація
window.addEventListener('resize', () => {
    createIndicators();
    updateCarousel();
});

// Запуск
track.style.display = 'flex';
track.style.transition = 'transform 0.4s ease-in-out';
createIndicators();
updateCarousel();
startAutoScroll();

// Меню: відкриття/закриття
const toggleButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

toggleButton.addEventListener('click', () => {
    menu.classList.toggle('menu-open'); // замінив active на menu-open
});

// Закриття меню при кліку на посилання
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    menu.classList.remove('menu-open'); // замінив active на menu-open
  });
});


// Вимкнув взаємне відкриття/закриття project-container (щоб всі були відкриті)
// Якщо треба – це можна увімкнути або зробити окремо

// На мобільних показуємо всі project-links відкритими, тому тут нічого не трогаємо


// При завантаженні сторінки…
window.addEventListener('DOMContentLoaded', () => {
  // Якщо ширина вікна менша за 768px
  if (window.innerWidth < 768) {
    document.querySelectorAll('.image-overlay').forEach(overlay => {
      overlay.addEventListener('click', () => {
        // при кожному тапі перемикаємо клас
        overlay.classList.toggle('show-text');
      });
    });
  }
});


//,,,,,//
// Створюємо IntersectionObserver
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const overlay = entry.target;
    clearTimeout(overlay.hideTimeout);  // Знімаємо попередній таймер

    if (entry.isIntersecting) {
      overlay.classList.add('show-text');

      // Ставимо таймер на зникнення
      overlay.hideTimeout = setTimeout(() => {
        overlay.classList.remove('show-text');
      }, 3000); // 3000 мс = 3 секунди

    } else {
      overlay.classList.remove('show-text');
    }
  });
}, {
  threshold: 0.5
});

document.querySelectorAll('.image-overlay').forEach(el => {
  observer.observe(el);
});



const languageSwitcher = document.querySelector('.language-switcher');
const languageButton = languageSwitcher.querySelector('.language-button');
const languagePopup = languageSwitcher.querySelector('.language-popup');
const arrow = languageButton.querySelector('.arrow');

languageButton.addEventListener('click', () => {
  languageSwitcher.classList.toggle('active');
  // Змінюємо стрілочку
  if (languageSwitcher.classList.contains('active')) {
    arrow.style.transform = 'rotate(-135deg)';
  } else {
    arrow.style.transform = 'rotate(45deg)';
  }
});



// вибираємо всі project-container
document.querySelectorAll('.project-container').forEach(container => {
  const links = container.querySelector('.project-links');

  container.addEventListener('click', (e) => {
    // запобігаємо якщо клік по внутрішніх посиланнях
    if (e.target.tagName.toLowerCase() === 'a') return;

    const isOpen = container.classList.toggle('active'); // додає або прибирає active

    if (isOpen) {
      // розраховуємо, скільки місця доступно від верхнього краю links до низу вікна
      const rect = links.getBoundingClientRect();
      const available = Math.max(120, window.innerHeight - rect.top - 20); // мінімум 120px
      // ставимо реальну обмежену висоту (не більше фактичного контенту)
      links.style.maxHeight = Math.min(links.scrollHeight, available) + 'px';
      links.style.overflowY = 'auto';
      links.style.WebkitOverflowScrolling = 'touch';
    } else {
      // плавно ховаємо
      links.style.maxHeight = '0';
    }
  });
});

// Оновлюємо відкриті списки при ресайзі
window.addEventListener('resize', () => {
  document.querySelectorAll('.project-container.active .project-links').forEach(links => {
    const rect = links.getBoundingClientRect();
    const available = Math.max(120, window.innerHeight - rect.top - 20);
    links.style.maxHeight = Math.min(links.scrollHeight, available) + 'px';
  });
});

