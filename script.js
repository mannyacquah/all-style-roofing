// Language switching
let currentLang = 'en';

document.getElementById('langSwitch').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'de' : 'en';
  document.getElementById('langSwitch').textContent = currentLang === 'en' ? 'DE' : 'EN';
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-en]').forEach(el => {
    el.innerHTML = el.getAttribute(`data-${currentLang}`);
  });

  document.querySelectorAll('[data-placeholder-en]').forEach(el => {
    el.placeholder = el.getAttribute(`data-placeholder-${currentLang}`);
  });
});

// Mobile menu
const toggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');
toggle.addEventListener('click', () => {
  toggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    toggle.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});
