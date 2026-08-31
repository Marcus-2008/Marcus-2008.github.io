// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Scroll reveal ----------
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealEls = document.querySelectorAll('.reveal');
if (reduceMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

// ---------- Hero signal trace: single orchestrated draw-in ----------
const tracePath = document.getElementById('tracePath');
if (tracePath) {
  const length = tracePath.getTotalLength();
  tracePath.style.strokeDasharray = length;
  tracePath.style.strokeDashoffset = reduceMotion ? 0 : length;

  if (!reduceMotion) {
    requestAnimationFrame(() => {
      tracePath.style.transition = 'stroke-dashoffset 2.2s cubic-bezier(0.16, 1, 0.3, 1)';
      tracePath.style.strokeDashoffset = 0;
    });
  }
}

// ---------- Hero stat counters (run once, on load) ----------
const statNums = document.querySelectorAll('.stat__num');

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (reduceMotion || !target) {
    el.textContent = target;
    return;
  }
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNums.forEach(animateCount);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.4 });

const statsBlock = document.querySelector('.hero__stats');
if (statsBlock) statsObserver.observe(statsBlock);
