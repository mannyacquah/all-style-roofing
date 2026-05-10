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

// Close nav when clicking a link
overlay.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeNav);
});

// Close on escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeNav();
});

// Close on backdrop click
overlay.querySelector('.nav-overlay-backdrop').addEventListener('click', closeNav);

// Language switching
function setLang(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Update button text
  langSwitchNav.textContent = lang === 'de' ? 'English' : 'Deutsch';

  // Update all translatable elements
  document.querySelectorAll('[data-de]').forEach(el => {
    el.innerHTML = el.getAttribute(`data-${lang}`);
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder-de]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${lang}`);
  });
}

langSwitchNav.addEventListener('click', () => {
  setLang(currentLang === 'de' ? 'en' : 'de');
});
