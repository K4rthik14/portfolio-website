/**
 * ══════════════════════════════════════════════════
 *  ATMOSPHERE ENGINE
 *  Canvas-based particle system with subtle parallax,
 *  floating grid lines, and ambient depth effects.
 *  Respects prefers-reduced-motion.
 * ══════════════════════════════════════════════════
 */

(function () {
  'use strict';

  // ── Reduced Motion Check ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Canvas Setup ──
  const canvas = document.getElementById('atmosphere-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, dpr;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let particles = [];
  let gridLines = [];
  let animationId = null;

  // ── Configuration ──
  const CONFIG = {
    particleCount: 80,
    particleMinSize: 0.5,
    particleMaxSize: 1.8,
    particleSpeed: 0.15,
    parallaxStrength: 0.02,
    gridLineCount: 6,
    gridLineSpeed: 0.08,
    colors: {
      particleDim: 'rgba(45, 212, 191, 0.08)',
      particleMid: 'rgba(45, 212, 191, 0.15)',
      particleBright: 'rgba(45, 212, 191, 0.3)',
      gridLine: 'rgba(30, 41, 59, 0.25)',
      warmParticle: 'rgba(245, 158, 11, 0.1)',
    }
  };

  // ── Resize Handler ──
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // ── Particle Class ──
  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = CONFIG.particleMinSize + Math.random() * (CONFIG.particleMaxSize - CONFIG.particleMinSize);
      this.speedX = (Math.random() - 0.5) * CONFIG.particleSpeed;
      this.speedY = (Math.random() - 0.5) * CONFIG.particleSpeed;
      this.depth = 0.2 + Math.random() * 0.8; // 0.2 = far, 1.0 = near
      this.opacity = 0.05 + Math.random() * 0.2;
      this.baseOpacity = this.opacity;
      this.pulseSpeed = 0.002 + Math.random() * 0.008;
      this.pulseOffset = Math.random() * Math.PI * 2;
      this.isWarm = Math.random() < 0.1; // 10% warm-colored particles
    }

    update(time) {
      // Movement
      this.x += this.speedX;
      this.y += this.speedY;

      // Parallax offset based on mouse
      const parallaxX = (mouseX - width / 2) * CONFIG.parallaxStrength * this.depth;
      const parallaxY = (mouseY - height / 2) * CONFIG.parallaxStrength * this.depth;

      // Wrap around
      if (this.x + parallaxX < -20) this.x = width + 20;
      if (this.x + parallaxX > width + 20) this.x = -20;
      if (this.y + parallaxY < -20) this.y = height + 20;
      if (this.y + parallaxY > height + 20) this.y = -20;

      // Pulse opacity
      this.opacity = this.baseOpacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.05;

      return { x: this.x + parallaxX, y: this.y + parallaxY };
    }

    draw(pos) {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, this.size * this.depth, 0, Math.PI * 2);

      if (this.isWarm) {
        ctx.fillStyle = `rgba(245, 158, 11, ${this.opacity * 0.7})`;
      } else if (this.depth > 0.7) {
        ctx.fillStyle = `rgba(45, 212, 191, ${this.opacity})`;
      } else {
        ctx.fillStyle = `rgba(148, 163, 184, ${this.opacity * 0.5})`;
      }

      ctx.fill();
    }
  }

  // ── Grid Line Class ──
  class GridLine {
    constructor(isHorizontal) {
      this.isHorizontal = isHorizontal;
      this.reset();
    }

    reset() {
      if (this.isHorizontal) {
        this.position = Math.random() * height;
        this.speed = CONFIG.gridLineSpeed * (0.5 + Math.random() * 0.5);
      } else {
        this.position = Math.random() * width;
        this.speed = CONFIG.gridLineSpeed * (0.3 + Math.random() * 0.3);
      }
      this.opacity = 0.02 + Math.random() * 0.05;
      this.length = 0.3 + Math.random() * 0.5;
    }

    update() {
      this.position += this.speed;
      if (this.isHorizontal && this.position > height + 10) {
        this.position = -10;
        this.opacity = 0.02 + Math.random() * 0.05;
      }
      if (!this.isHorizontal && this.position > width + 10) {
        this.position = -10;
        this.opacity = 0.02 + Math.random() * 0.05;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.strokeStyle = `rgba(30, 41, 59, ${this.opacity})`;
      ctx.lineWidth = 0.5;

      if (this.isHorizontal) {
        const startX = width * (1 - this.length) * 0.5;
        const endX = width - startX;
        ctx.moveTo(startX, this.position);
        ctx.lineTo(endX, this.position);
      } else {
        const startY = height * (1 - this.length) * 0.5;
        const endY = height - startY;
        ctx.moveTo(this.position, startY);
        ctx.lineTo(this.position, endY);
      }

      ctx.stroke();
    }
  }

  // ── Initialize ──
  function init() {
    resize();

    // Adjust particle count for mobile
    const isMobile = width < 768;
    const count = isMobile ? Math.floor(CONFIG.particleCount * 0.4) : CONFIG.particleCount;

    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    gridLines = [];
    const gridCount = isMobile ? 3 : CONFIG.gridLineCount;
    for (let i = 0; i < gridCount; i++) {
      gridLines.push(new GridLine(i % 2 === 0));
    }
  }

  // ── Animation Loop ──
  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Smooth mouse interpolation
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Draw grid lines
    for (const line of gridLines) {
      line.update();
      line.draw();
    }

    // Draw particles
    for (const particle of particles) {
      const pos = particle.update(time);
      particle.draw(pos);
    }

    animationId = requestAnimationFrame(animate);
  }

  // ── Mouse Tracking ──
  function onMouseMove(e) {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  }

  // ── Events ──
  window.addEventListener('resize', () => {
    resize();
    init();
  });

  document.addEventListener('mousemove', onMouseMove, { passive: true });

  // ── Start ──
  if (!prefersReducedMotion) {
    init();
    animate(0);
  }

  // ══════════════════════════════════════════════════
  //  BOOT SEQUENCE
  // ══════════════════════════════════════════════════

  const bootScreen = document.getElementById('boot-screen');
  const bootTerminal = document.getElementById('boot-terminal');
  const bootProgressBar = document.getElementById('boot-progress-bar');
  const bootSkipBtn = document.getElementById('boot-skip');
  const consoleWrapper = document.getElementById('console-wrapper');

  if (!bootScreen || !consoleWrapper) return;

  // Skip for reduced motion
  if (prefersReducedMotion) {
    bootScreen.style.display = 'none';
    consoleWrapper.classList.remove('console-hidden');
    consoleWrapper.classList.add('console-visible');
    return;
  }

  const bootLines = [
    { text: '> Initializing system...', delay: 400 },
    { text: '> Loading core modules ████████ OK', delay: 300 },
    { text: '> Atmosphere engine ........ ONLINE', delay: 250 },
    { text: '> Operator profile ......... LOADED', delay: 200, class: 'accent' },
    { text: '> Mission dossiers ......... 4 FOUND', delay: 200 },
    { text: '> Signal log ............... SYNCED', delay: 200 },
    { text: '> Systems manifest ......... VERIFIED', delay: 200 },
    { text: '> Transmission terminal .... READY', delay: 200, class: 'accent' },
    { text: '', delay: 150 },
    { text: '> All systems operational.', delay: 300, class: 'warm' },
    { text: '> Welcome, Operator.', delay: 500, class: 'accent' },
  ];

  let bootIndex = 0;
  let bootComplete = false;

  function addBootLine() {
    if (bootComplete || bootIndex >= bootLines.length) {
      finishBoot();
      return;
    }

    const line = bootLines[bootIndex];
    const lineEl = document.createElement('div');
    lineEl.className = 'boot-line' + (line.class ? ' ' + line.class : '');
    lineEl.textContent = line.text;
    bootTerminal.appendChild(lineEl);

    // Update progress bar
    const progress = ((bootIndex + 1) / bootLines.length) * 100;
    bootProgressBar.style.width = progress + '%';

    bootIndex++;
    setTimeout(addBootLine, line.delay);
  }

  function finishBoot() {
    if (bootComplete) return;
    bootComplete = true;

    bootProgressBar.style.width = '100%';

    setTimeout(() => {
      bootScreen.classList.add('boot-complete');
      consoleWrapper.classList.remove('console-hidden');
      consoleWrapper.classList.add('console-visible');
    }, 400);
  }

  // Start boot sequence
  setTimeout(addBootLine, 800);

  // Skip button
  if (bootSkipBtn) {
    bootSkipBtn.addEventListener('click', finishBoot);
  }

  // Allow skip with Enter/Space
  document.addEventListener('keydown', (e) => {
    if (!bootComplete && (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape')) {
      finishBoot();
    }
  });

})();
