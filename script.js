// ── Scroll-Reveal Animations ──
const elementsToReveal = document.querySelectorAll(
  '.intro-headline, .intro-text, .now-card, .project-entry, .timeline-item, .experience-item, .stack-col, .certifications-block'
);

// Apply reveal class programmatically
elementsToReveal.forEach((el, index) => {
  el.classList.add('reveal');
  // Subtle stagger effect using transition delay
  const staggerDelay = (index % 4) * 0.05;
  el.style.transitionDelay = `${staggerDelay}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { 
  threshold: 0.05, 
  rootMargin: '0px 0px -40px 0px' 
});

elementsToReveal.forEach(el => revealObserver.observe(el));

// ── Active Navigation Link Highlighting ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, { 
  threshold: 0.15,
  rootMargin: '-20% 0px -60% 0px'
});

sections.forEach(s => sectionObserver.observe(s));

// ── Smooth Scroll with Header Offset ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      
      const header = document.querySelector('header');
      const headerHeight = header ? header.offsetHeight : 0;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20; // 20px extra padding
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});
