/**
 * ══════════════════════════════════════════════════
 *  CONSOLE INTERACTIONS
 *  Navigation, scroll reveals, mission dossier
 *  expand/collapse, status bar updates, and
 *  keyboard navigation.
 * ══════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ── Scroll Reveal System ──
  const revealElements = document.querySelectorAll('.reveal-element');

  revealElements.forEach((el, index) => {
    // Stagger delay based on sibling position within parent
    const siblings = el.parentElement.querySelectorAll('.reveal-element');
    const siblingIndex = Array.from(siblings).indexOf(el);
    el.style.transitionDelay = `${siblingIndex * 0.08}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -30px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ── Active Navigation Module Detection ──
  const modules = document.querySelectorAll('.console-module');
  const hudModuleLinks = document.querySelectorAll('.hud-module-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const statusbarModule = document.getElementById('statusbar-module');

  const moduleNames = {
    'module-operator': 'OPERATOR',
    'module-missions': 'MISSIONS',
    'module-signals': 'SIGNALS',
    'module-systems': 'SYSTEMS',
    'module-transmission': 'COMMS'
  };

  const moduleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const moduleName = moduleNames[id] || 'UNKNOWN';

        // Update HUD nav
        hudModuleLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.module === id.replace('module-', ''));
        });

        // Update mobile nav
        mobileNavLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.module === id.replace('module-', ''));
        });

        // Update status bar
        if (statusbarModule) {
          statusbarModule.textContent = `MODULE: ${moduleName}`;
        }
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '-15% 0px -65% 0px'
  });

  modules.forEach(m => moduleObserver.observe(m));

  // ── Smooth Scroll with Header Offset ──
  function smoothScrollTo(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;

    const header = document.getElementById('console-hud');
    const headerHeight = header ? header.offsetHeight : 0;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 16;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      e.preventDefault();
      smoothScrollTo(targetId);

      // Close mobile nav if open
      closeMobileNav();
    });
  });

  // ── Mission Dossier Expand/Collapse ──
  const missionHeaders = document.querySelectorAll('.mission-header');

  missionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      toggleMission(header);
    });

    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMission(header);
      }
    });
  });

  function toggleMission(header) {
    const dossier = header.closest('.mission-dossier');
    const contentId = header.getAttribute('aria-controls');
    const content = document.getElementById(contentId);

    if (!content) return;

    const isExpanded = header.getAttribute('aria-expanded') === 'true';

    // Close all other dossiers
    missionHeaders.forEach(otherHeader => {
      if (otherHeader !== header) {
        const otherDossier = otherHeader.closest('.mission-dossier');
        const otherContentId = otherHeader.getAttribute('aria-controls');
        const otherContent = document.getElementById(otherContentId);

        if (otherContent && otherHeader.getAttribute('aria-expanded') === 'true') {
          otherHeader.setAttribute('aria-expanded', 'false');
          otherDossier.classList.remove('expanded');
          otherContent.hidden = true;
        }
      }
    });

    // Toggle current
    if (isExpanded) {
      header.setAttribute('aria-expanded', 'false');
      dossier.classList.remove('expanded');
      content.hidden = true;
    } else {
      header.setAttribute('aria-expanded', 'true');
      dossier.classList.add('expanded');
      content.hidden = false;

      // Add border glow effect when expanded
      dossier.style.borderColor = 'rgba(45, 212, 191, 0.15)';
      dossier.style.boxShadow = '0 0 30px rgba(45, 212, 191, 0.04)';
    }

    // Reset border when collapsed
    if (isExpanded) {
      dossier.style.borderColor = '';
      dossier.style.boxShadow = '';
    }
  }

  // ── Mobile Navigation ──
  const hamburger = document.getElementById('hud-hamburger');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');

  function closeMobileNav() {
    if (hamburger && mobileOverlay) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (hamburger && mobileOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    // Close on overlay click
    mobileOverlay.addEventListener('click', (e) => {
      if (e.target === mobileOverlay) {
        closeMobileNav();
      }
    });
  }

  // ── Status Bar Clock ──
  const statusbarTime = document.getElementById('statusbar-time');

  function updateClock() {
    if (!statusbarTime) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    statusbarTime.textContent = `SYS.TIME: ${hours}:${minutes}:${seconds}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ── Keyboard Navigation ──
  document.addEventListener('keydown', (e) => {
    // Navigate between modules with arrow keys
    if (e.key === 'ArrowDown' && e.altKey) {
      e.preventDefault();
      navigateModule(1);
    }
    if (e.key === 'ArrowUp' && e.altKey) {
      e.preventDefault();
      navigateModule(-1);
    }
  });

  function navigateModule(direction) {
    const moduleIds = Array.from(modules).map(m => m.id);
    const currentModule = statusbarModule ? statusbarModule.textContent.replace('MODULE: ', '') : '';

    let currentIndex = -1;
    for (let i = 0; i < moduleIds.length; i++) {
      if (moduleNames[moduleIds[i]] === currentModule) {
        currentIndex = i;
        break;
      }
    }

    const nextIndex = Math.max(0, Math.min(moduleIds.length - 1, currentIndex + direction));
    if (nextIndex !== currentIndex) {
      smoothScrollTo('#' + moduleIds[nextIndex]);
    }
  }

  // ── Hover Effects for Dossier Cards ──
  const dossierCards = document.querySelectorAll('.mission-dossier');

  dossierCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      if (!card.classList.contains('expanded')) {
        card.style.borderColor = 'rgba(30, 41, 59, 0.6)';
      }
    });

    card.addEventListener('mouseleave', () => {
      if (!card.classList.contains('expanded')) {
        card.style.borderColor = '';
      }
    });
  });

})();
