// Language: default is 'de'
let currentLang = 'de';

const langSwitchNav = document.getElementById('langSwitchNav');
const overlay = document.getElementById('navOverlay');
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');

// Toggle nav overlay
function openNav() { overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
function closeNav() { overlay.classList.remove('is-open'); document.body.style.overflow = ''; }

menuToggle.addEventListener('click', openNav);
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

  document.querySelectorAll('[data-de]').forEach(el => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });
  document.querySelectorAll('[data-placeholder-de]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
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

let galleryOpen = false;
let galleryImages = [];
let galleryIndex = 0;

function openGallery(trigger) {
  galleryImages = JSON.parse(trigger.dataset.gallery);
  galleryIndex = 0;

  const titleKey = `data-title-${currentLang}`;
  galleryTitle.textContent = trigger.getAttribute(titleKey);

  galleryTotal.textContent = galleryImages.length;
  renderDots();
  showSlide(0, null);

  gallery.classList.remove('is-closing');
  gallery.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  galleryOpen = true;
}

function closeGallery() {
  gallery.classList.add('is-closing');
  gallery.classList.remove('is-open');
  galleryOpen = false;

  setTimeout(() => {
    gallery.classList.remove('is-closing');
    document.body.style.overflow = '';
  }, 400);
}

function showSlide(index, direction) {
  if (index < 0 || index >= galleryImages.length) return;

  // Slide-out animation
  if (direction !== null) {
    const slideClass = direction === 'left' ? 'is-sliding-left' : 'is-sliding-right';
    galleryImg.classList.add(slideClass);

    setTimeout(() => {
      galleryIndex = index;
      galleryImg.src = galleryImages[index];
      galleryCurrent.textContent = index + 1;
      updateDots();
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
    galleryIndex = index;
    galleryImg.src = galleryImages[index];
    galleryCurrent.textContent = index + 1;
    updateDots();
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
});

galleryClose.addEventListener('click', closeGallery);
gallery.querySelector('.gallery-backdrop').addEventListener('click', closeGallery);

galleryPrev.addEventListener('click', () => {
  if (galleryIndex > 0) showSlide(galleryIndex - 1, 'right');
});
galleryNext.addEventListener('click', () => {
  if (galleryIndex < galleryImages.length - 1) showSlide(galleryIndex + 1, 'left');
});

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
