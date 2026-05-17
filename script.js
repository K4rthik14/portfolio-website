// Mouse Glow Effect
const cursorGlow = document.querySelector('.cursor-glow');
document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// Navbar Scroll Effect
const nav = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Staggered Entry Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // If the entry has children with .stagger-in, reveal them with a delay
            const children = entry.target.querySelectorAll('.stagger-in');
            children.forEach((child, index) => {
                setTimeout(() => {
                    child.classList.add('visible');
                }, index * 100);
            });
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// System Insight Modal Logic
const modal = document.getElementById('insight-modal');
const closeModal = document.querySelector('.close-modal');
const typewriterOutput = document.getElementById('typewriter-output');
const insightButtons = document.querySelectorAll('.btn-insight');

const insights = {
    circuitguard: "Initializing CNN backbone... \nLoading pre-trained weights for PCB defect localization... \nInput Resolution: 1024x1024 \nAnalysis of 500+ manufacturing samples complete. \n[LOG] Bottleneck identified in edge-case noise filtering. \n[SUCCESS] Optimized via Dynamic Thresholding & Morphological closing. \nAccuracy: 98%. Ready for production deployment.",
    devlogger: "Bootstrapping LangGraph ReAct Agent... \nLoading GitPython diff retriever tool... \n[LOG] Scanning commit history for structured change patterns... \n[TOOL_CALL] get_git_diff → 14 commits analyzed. \n[REASONING] Categorizing changes: feature, fix, refactor... \nRouting to Groq LLM for markdown summary generation... \n[SUCCESS] Dev log generated in 1.2s. Zero manual effort. \nInstallable via pipx. Agent: ACTIVE.",
    pipeline: "Parsing GEM5 trace logs for 5-stage classic RISC... \nGenerating Hazard Matrix... \n[LOG] Data dependency detected at ID/EX stage (R1 -> R1). \n[ANALYSIS] Structural bottleneck at MEM/WB stage during high-velocity branch prediction. \n[SUGGESTION] Implementing improved Load-Store unit scheduling to mitigate stalls. \nSimulation: COMPLETE.",
    fraud: "Vectorizing corpus (N=10,000)... \nTF-IDF Matrix Density: 0.15 \nTraining Random Forest Ensemble (100 estimators)... \n[LOG] Suspicious pattern detected in Header-Auth-Spoofing. \n[RESULT] F1-Score: 0.95. False Positive Rate minimized to 2%. \nDeployment: STABLE."
};

let typewriterInterval;

function typeWriter(text, i = 0) {
    if (i < text.length) {
        typewriterOutput.innerHTML += text.charAt(i) === '\n' ? '<br>' : text.charAt(i);
        i++;
        typewriterInterval = setTimeout(() => typeWriter(text, i), 20);
    }
}

insightButtons.forEach(button => {
    button.addEventListener('click', () => {
        const projectKey = button.getAttribute('data-project');
        const text = insights[projectKey];

        typewriterOutput.innerHTML = '';
        clearTimeout(typewriterInterval);
        modal.classList.add('active');

        // Start typing after a short modal opening delay
        setTimeout(() => typeWriter(text), 400);
    });
});

closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
    clearTimeout(typewriterInterval);
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('active');
        clearTimeout(typewriterInterval);
    }
});