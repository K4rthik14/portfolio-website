document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor & Spotlight System ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Cursor Physics State
    let mouse = { x: 0, y: 0 }; // Current mouse position
    let cursor = { x: 0, y: 0 }; // Current cursor position (lagging)
    const smoothFactor = 0.15; // Higher = faster/lighter (0.15 is snappy but smooth)

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Instant dot movement
        cursorDot.style.transform = `translate(${mouse.x}px, ${mouse.y}px) translate(-50%, -50%)`;
    });

    // Animation Loop for Smooth Cursor & Spotlight
    function animateCursor() {
        // Linear Interpolation (Lerp) for the outline
        cursor.x += (mouse.x - cursor.x) * smoothFactor;
        cursor.y += (mouse.y - cursor.y) * smoothFactor;

        cursorOutline.style.transform = `translate(${cursor.x}px, ${cursor.y}px) translate(-50%, -50%)`;

        // Update Spotlight on Cards
        updateSpotlights();

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Spotlight Logic
    const cards = document.querySelectorAll('.card');

    // Inject the spotlight element into each card
    cards.forEach(card => {
        const spotlight = document.createElement('div');
        spotlight.className = 'card-spotlight-effect';
        card.appendChild(spotlight);
    });

    function updateSpotlights() {
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = mouse.x - rect.left;
            const y = mouse.y - rect.top;

            // Set CSS variables for the gradient position
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    // Hover effect for interactive elements (Magnetic Pull / Lift)
    const interactiveElements = document.querySelectorAll('.card, .orbit-card, a, button');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.width = '70px'; // Larger expansion
            cursorOutline.style.height = '70px';
            cursorOutline.style.borderColor = 'var(--accent-cyan)';
            cursorOutline.style.backgroundColor = 'rgba(0, 243, 255, 0.05)'; // Subtle fill
        });

        el.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '50px';
            cursorOutline.style.height = '50px';
            cursorOutline.style.borderColor = 'rgba(0, 243, 255, 0.3)';
            cursorOutline.style.backgroundColor = 'transparent';
        });
    });

    // --- 2. Background System (Antigravity) ---
    const bgNoise = document.getElementById('bg-noise');
    const bgFog = document.getElementById('bg-fog');
    const bgGrid = document.getElementById('bg-grid');
    const heroContent = document.querySelector('.hero-content');

    // 2.1 Generate Micro Star Field (Noise)
    function generateNoise() {
        // Create a canvas for static noise to avoid DOM heaviness
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // distinct canvas size for performance (doesn't need to match screen exactly if pattern repeats)
        // scaling it up slightly to avoid obvious repetition
        const w = window.innerWidth;
        const h = window.innerHeight;
        canvas.width = w;
        canvas.height = h;

        // Configuration
        const starCount = Math.floor((w * h) / 3000); // 1 star per 3000px sq

        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < starCount; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const opacity = Math.random() * 0.5 + 0.1; // 0.1 to 0.6
            const size = Math.random() * 1.5 + 0.5; // 0.5px to 2px

            ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        const url = canvas.toDataURL();
        bgNoise.style.backgroundImage = `url(${url})`;
        bgNoise.style.backgroundRepeat = 'repeat';
    }

    // Generate initial noise
    generateNoise();
    // Debounced resize handler
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(generateNoise, 200);
    });

    // --- 3. Parallax & Scroll Depth ---
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;

    // Track inputs
    window.addEventListener('mousemove', (e) => {
        // Normalize coordinates -1 to 1
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });

    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    // Animation Loop for smooth performance
    function animateBackground() {
        // Parallax Intensity (Low for subtle effect)
        const pNoise = 15; // px movement max
        const pFog = 40;
        const pGrid = 10;

        // Scroll Speeds (Parallax on scroll)
        // noise moves slowest (distant)
        // fog moves slightly faster
        // grid moves moderate
        const sNoise = scrollY * 0.1;
        const sFog = scrollY * 0.2;
        const sGrid = scrollY * 0.05;

        if (bgNoise) {
            bgNoise.style.transform = `
                translate3d(${mouseX * pNoise}px, ${mouseY * pNoise + sNoise}px, 0)
            `;
        }

        if (bgFog) {
            bgFog.style.transform = `
                translate3d(${mouseX * pFog}px, ${mouseY * pFog + sFog}px, 0)
            `;
        }

        if (bgGrid) {
            bgGrid.style.transform = `
                translate3d(${mouseX * pGrid}px, ${mouseY * pGrid + sGrid}px, 0)
            `;
        }

        requestAnimationFrame(animateBackground);
    }
    animateBackground();

    // Smooth Scroll for Internal Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- 4. System Status Timer ---
    const timeDisplay = document.getElementById('system-time');
    const startTime = new Date(); // Reset on page load

    function updateTime() {
        const now = new Date();
        const diff = Math.floor((now - startTime) / 1000);

        // Calculate hours, minutes, seconds
        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = diff % 60;

        // Pad with zeros
        const hStr = h.toString().padStart(2, '0');
        const mStr = m.toString().padStart(2, '0');
        const sStr = s.toString().padStart(2, '0');

        if (timeDisplay) {
            timeDisplay.textContent = `${hStr}:${mStr}:${sStr}`;
        }
    }

    // Update every second
    setInterval(updateTime, 1000);
    updateTime(); // Initial call

});