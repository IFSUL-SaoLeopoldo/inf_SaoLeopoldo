/* ============================================
   VESTIBULAR INVERNO 2026 — Scripts
   ============================================ */

document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initScrollReveal();
  initSmoothScroll();
  initMobileCta();
});

/* --- Countdown Timer --- */
function initCountdown() {
  const deadline = new Date('2026-05-14T19:00:00-03:00').getTime();
  const container = document.getElementById('countdown-timer');
  const liveRegion = document.getElementById('countdown-status');
  if (!container) return;

  let lastAnnouncement = '';

  function update() {
    const now = Date.now();
    const diff = deadline - now;

    if (diff <= 0) {
      container.innerHTML = '<p class="countdown-expired">Inscrições encerradas. Acompanhe os resultados no site oficial.</p>';
      if (liveRegion) liveRegion.textContent = 'As inscrições foram encerradas.';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    container.innerHTML = `
      <div class="countdown-item"><span class="number">${String(days).padStart(2, '0')}</span><span class="label">Dias</span></div>
      <div class="countdown-item"><span class="number">${String(hours).padStart(2, '0')}</span><span class="label">Horas</span></div>
      <div class="countdown-item"><span class="number">${String(minutes).padStart(2, '0')}</span><span class="label">Min</span></div>
      <div class="countdown-item"><span class="number">${String(seconds).padStart(2, '0')}</span><span class="label">Seg</span></div>
    `;

    if (liveRegion) {
      const announcement = `Faltam ${days} dias, ${hours} horas e ${minutes} minutos para o encerramento das inscrições.`;
      if (announcement !== lastAnnouncement) {
        liveRegion.textContent = announcement;
        lastAnnouncement = announcement;
      }
    }
  }

  update();
  setInterval(update, 1000);
}

/* --- Scroll Reveal --- */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* --- Smooth Scroll for Anchor Links --- */
function initSmoothScroll() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });
}

/* --- Mobile sticky CTA visibility --- */
function initMobileCta() {
  const bar = document.querySelector('.mobile-cta-bar');
  const hero = document.querySelector('.hero');
  const finalCta = document.querySelector('.cta-final');
  if (!bar || !hero || !finalCta) return;

  const mobileQuery = window.matchMedia('(max-width: 640px)');

  function updateVisibility() {
    if (!mobileQuery.matches) {
      bar.classList.remove('is-visible');
      return;
    }

    const heroBottom = hero.getBoundingClientRect().bottom;
    const finalTop = finalCta.getBoundingClientRect().top;
    const shouldShow = heroBottom < 120 && finalTop > window.innerHeight - 120;
    bar.classList.toggle('is-visible', shouldShow);
  }

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });
  window.addEventListener('resize', updateVisibility);
  mobileQuery.addEventListener('change', updateVisibility);
}
