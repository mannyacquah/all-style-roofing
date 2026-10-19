// Language: default is 'de'
let currentLang = 'de';

const langSwitchNav = document.getElementById('langSwitchNav');
const overlay = document.getElementById('navOverlay');
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');

// Toggle nav overlay
function openNav() {
  overlay.classList.add('is-open');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
  menuClose.focus();
}
function closeNav() {
  if (!overlay.classList.contains('is-open')) return;
  overlay.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
  menuToggle.focus({ preventScroll: true });
}

menuToggle.addEventListener('click', openNav);
document.getElementById('logoToggle').addEventListener('click', openNav);
menuClose.addEventListener('click', closeNav);

overlay.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeNav);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (galleryOpen) return closeGallery();
    closeNav();
  }
});

overlay.querySelector('.nav-overlay-backdrop').addEventListener('click', closeNav);

// Language switching
function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  langSwitchNav.textContent = lang === 'de' ? 'English' : 'Deutsch';
  langSwitchNav.lang = lang === 'de' ? 'en' : 'de';
  menuToggle.setAttribute('aria-label', lang === 'de' ? 'Menü' : 'Menu');
  document.getElementById('logoToggle').setAttribute('aria-label', lang === 'de' ? 'Menü' : 'Menu');
  menuClose.setAttribute('aria-label', lang === 'de' ? 'Schließen' : 'Close');
  updateCounts();

  document.querySelectorAll('[data-de]').forEach(el => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });
  document.querySelectorAll('[data-placeholder-de]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
  });
}

function updateCounts() {
  document.querySelectorAll('.gallery-trigger').forEach(card => {
    const n = JSON.parse(card.dataset.gallery).length;
    card.dataset.count = `${n} ${currentLang === 'de' ? 'Fotos' : 'photos'}`;
    card.setAttribute('aria-label', `${card.getAttribute(`data-title-${currentLang}`)} – ${card.dataset.count}`);
  });
}

langSwitchNav.addEventListener('click', () => {
  setLang(currentLang === 'de' ? 'en' : 'de');
});

// ===== Gallery =====
const gallery = document.getElementById('gallery');
const galleryImg = document.getElementById('galleryImg');
const galleryTitle = gallery.querySelector('.gallery-title');
const galleryCurrent = document.getElementById('galleryCurrent');
const galleryTotal = document.getElementById('galleryTotal');
const galleryDots = document.getElementById('galleryDots');
const galleryClose = document.getElementById('galleryClose');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');

const smallScreen = window.matchMedia('(max-width: 767px)');

// Mobile gets the 960px variant, desktop the full 1920px image
function imageSrc(path) {
  return smallScreen.matches ? path.replace(/\.webp$/, '-sm.webp') : path;
}

function preloadSlide(index) {
  if (index < 0 || index >= galleryImages.length) return;
  const img = new Image();
  img.decoding = 'async';
  img.src = imageSrc(galleryImages[index]);
}

function setSlide(index) {
  galleryIndex = index;
  galleryImg.src = imageSrc(galleryImages[index]);
  galleryCurrent.textContent = index + 1;
  updateDots();
  preloadSlide(index + 1);
  preloadSlide(index - 1);
}

let galleryOpen = false;
let lastFocus = null;
let galleryImages = [];
let galleryIndex = 0;

function openGallery(trigger) {
  lastFocus = trigger;
  galleryImages = JSON.parse(trigger.dataset.gallery);
  galleryIndex = 0;

  const titleKey = `data-title-${currentLang}`;
  galleryTitle.textContent = trigger.getAttribute(titleKey);
  galleryImg.alt = galleryTitle.textContent;

  galleryTotal.textContent = galleryImages.length;
  renderDots();
  showSlide(0, null);

  gallery.classList.remove('is-closing');
  gallery.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  galleryOpen = true;
  galleryClose.focus({ preventScroll: true });
}

function closeGallery() {
  gallery.classList.add('is-closing');
  gallery.classList.remove('is-open');
  galleryOpen = false;

  setTimeout(() => {
    gallery.classList.remove('is-closing');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }, 400);
}

function showSlide(index, direction) {
  if (index < 0 || index >= galleryImages.length) return;

  // Slide-out animation
  if (direction !== null) {
    const slideClass = direction === 'left' ? 'is-sliding-left' : 'is-sliding-right';
    galleryImg.classList.add(slideClass);

    setTimeout(() => {
      setSlide(index);
      // Slide in from opposite side
      galleryImg.classList.remove(slideClass);
      const enterClass = direction === 'left' ? 'is-sliding-right' : 'is-sliding-left';
      galleryImg.classList.add(enterClass);
      // Force reflow then remove
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          galleryImg.classList.remove(enterClass);
        });
      });
    }, 250);
  } else {
    // Initial load — no animation
    setSlide(index);
  }
}

function renderDots() {
  galleryDots.innerHTML = '';
  galleryImages.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'gallery-dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('aria-label', `Image ${i + 1}`);
    dot.addEventListener('click', () => {
      const dir = i > galleryIndex ? 'left' : 'right';
      showSlide(i, dir);
    });
    galleryDots.appendChild(dot);
  });
}

function updateDots() {
  galleryDots.querySelectorAll('.gallery-dot').forEach((dot, i) => {
    dot.classList.toggle('is-active', i === galleryIndex);
  });
}

// Event listeners
document.querySelectorAll('.gallery-trigger').forEach(card => {
  card.addEventListener('click', e => {
    e.preventDefault();
    openGallery(card);
  });
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openGallery(card);
    }
  });
});

galleryClose.addEventListener('click', closeGallery);
gallery.querySelector('.gallery-backdrop').addEventListener('click', closeGallery);

galleryPrev.addEventListener('click', () => {
  if (galleryIndex > 0) showSlide(galleryIndex - 1, 'right');
});
galleryNext.addEventListener('click', () => {
  if (galleryIndex < galleryImages.length - 1) showSlide(galleryIndex + 1, 'left');
});

updateCounts();

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!galleryOpen) return;
  if (e.key === 'ArrowLeft') {
    if (galleryIndex > 0) showSlide(galleryIndex - 1, 'right');
  } else if (e.key === 'ArrowRight') {
    if (galleryIndex < galleryImages.length - 1) showSlide(galleryIndex + 1, 'left');
  }
});

// Touch swipe support
let touchStartX = 0;
let touchStartY = 0;
let swiping = false;

gallery.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  swiping = true;
}, { passive: true });

gallery.addEventListener('touchend', e => {
  if (!swiping) return;
  swiping = false;
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;

  // Only count horizontal swipes (not scrolls)
  if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return;

  if (dx < 0 && galleryIndex < galleryImages.length - 1) {
    showSlide(galleryIndex + 1, 'left');
  } else if (dx > 0 && galleryIndex > 0) {
    showSlide(galleryIndex - 1, 'right');
  }
}, { passive: true });


// ===== Lazy-loaded card images: fade in once decoded =====
document.querySelectorAll('img.card-img[loading="lazy"]').forEach(img => {
  if (img.complete) return;
  img.classList.add('is-pending');
  const done = () => img.classList.remove('is-pending');
  img.addEventListener('load', done, { once: true });
  img.addEventListener('error', done, { once: true });
});
