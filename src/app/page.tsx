"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Mail,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  BookOpen,
  Eye,
  Menu,
  X,
  MapPin,
  GraduationCap,
  Sparkles,
} from "lucide-react";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="24"
    height="24"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// Project Type Definition
interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  objective: string;
  approach: string;
  complications: string;
  debrief: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
  archDiagram: string;
}

const PROJECTS: Project[] = [
  {
    id: "circuitguard",
    title: "CircuitGuard",
    subtitle: "PCB Defect Detection System",
    description: "Automated visual defect inspection on printed circuit boards using deep learning and computer vision preprocessing.",
    objective: "Automating visual defect inspection on printed circuit boards. Solder defects, micro-cracks, and missing surface-mount components are difficult to detect reliably under changing manufacturing line lights and camera angles.",
    approach: "Instead of building a simple flat classifier, I split the system into preprocessing and deep-feature extraction. OpenCV handles deskewing and histogram equalization to normalize the input. An EfficientNet-B4 backbone extracts fine structural features, which are then passed to a localized classification head.",
    complications: "Severe class imbalance. Normal solder joints are abundant; short-circuits and missing resistors are rare. Standard cross-entropy caused the model to ignore critical defects. I resolved this by applying weighted cross-entropy loss, using a custom Focal Loss implementation, and generating synthetic training examples using OpenCV patch-grafting.",
    debrief: "Learned that image alignment and noise reduction in preprocessing are more valuable than stacking additional neural layers. Normalizing structural orientation before the model forward pass reduced validation error by 4.2%.",
    tech: ["PyTorch", "EfficientNet-B4", "OpenCV", "Python"],
    github: "https://github.com/K4rthik14",
    live: "https://github.com/K4rthik14",
    image: "/images/circuitguard.png",
    archDiagram: `[Raw PCB Image] ──▸ [OpenCV Preprocessing]
                           │
                           ▾ (Denoise & Align)
                    [Patch Extraction] (Sliding Window / YOLO crop)
                           │
                           ▾
                    [EfficientNet-B4 Backbone]
                           │
                           ▾
                    [Defect Classifier] ──▸ (Pass / Fail / Defect Class)
                           │
                           └──▸ [Inference Benchmark: ~45ms / board]`
  },
  {
    id: "dev-logger-agent",
    title: "dev-logger-agent",
    subtitle: "Autonomous CLI Dev-Log Generator",
    description: "A stateful LangGraph agent that parses git diffs, reasons about code changes, and outputs structured engineering logs automatically.",
    objective: "Traditional commit messages lack the structural context required to generate human-readable engineering logs. I wanted a tool that would parse raw git diffs, reason about the code adjustments, and output a clean, categorized change log automatically.",
    approach: "I built the parser as a CLI tool in Python and packaged it for PyPI. The core analysis engine is designed as a stateful LangGraph agent using the ReAct pattern. The agent breaks down massive diffs into manageable chunks, determines the scope of the edits, and incrementally builds a structured markdown document.",
    complications: "LLM context windows and token cost when parsing large refactoring commits. To prevent context overflow, I wrote a pre-filtering parser in Python that strips out non-code changes (like formatting, whitespace-only modifications, and lockfile updates) before sending the payload to the LLM agent.",
    debrief: "Learned how to design robust, state-based LLM architectures using LangGraph. Explicit state transitions are much easier to debug than free-form agent prompts.",
    tech: ["LangGraph", "ReAct", "PyPI", "Python", "Git"],
    github: "https://github.com/K4rthik14",
    live: "https://pypi.org/project/dev-logger-agent/",
    image: "/images/devlogger.png",
    archDiagram: `[Git Commit History] ──▸ [Parser / Diffs Extractor]
                                │
                                ▾ (Raw Markdown Diffs)
                        [LangGraph Agent Loop] ◂── State Manager
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▾                       ▾                       ▾
[Change Categorizer]     [Impact Scorer]        [Markdown Formatter]
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                │
                                ▾
                       [Formatted Dev Log]`
  },
  {
    id: "askmy-notes",
    title: "askmy-notes",
    subtitle: "Conversational RAG Pipeline",
    description: "A modular retrieval-augmented generation pipeline that answers questions from personal notes and lecture documents with high-fidelity context.",
    objective: "Standard RAG implementations suffer from retrieval noise when scanning long lecture notes and complex textbooks. Relevant context gets lost in translation, resulting in hallucinated responses.",
    approach: "I architected a modular retrieval pipeline using FastAPI and ChromaDB. For chunking, I chose a recursive character splitter with strict token-size overlaps. I used a local MiniLM model for fast vector embeddings, sending context-enriched payloads to LLMs for final generation.",
    complications: "Handling multi-page tables and math equations in PDF notes. Standard text splitters split tables mid-row, destroying tabular integrity. I solved this by implementing a heuristic table-parser that extracts tables as Markdown blocks and treats them as single, cohesive chunks with high retrieval weights.",
    debrief: "Data parsing is 90% of RAG success. A simple LLM with clean, structured context easily outperforms a state-of-the-art model fed with noisy, half-broken data segments.",
    tech: ["FastAPI", "ChromaDB", "LangChain", "Python", "PostgreSQL"],
    github: "https://github.com/K4rthik14",
    live: "https://github.com/K4rthik14",
    image: "/images/askmynotes.png",
    archDiagram: `[PDF/Notes Ingestion] ──▸ [Text Chunker (Recursive Character)]
                                  │
                                  ▾
                       [Embedding Model (MiniLM-L6)]
                                  │
                                  ▾
                        [ChromaDB Vector Store]
                                  ▲
                                  │ (Cosine Similarity Query)
[User Query] ──▸ [FastAPI Backend] ──▸ [LLM (Gemini/OpenAI)] ──▸ [Answer]`
  },
  {
    id: "karsh",
    title: "karsh",
    subtitle: "Custom Unix Shell",
    description: "A complete Unix shell written in C from scratch — lexer, parser, execution engine, pipe chaining, I/O redirection, and signal handling.",
    objective: "I wanted to understand how operating systems manage processes, allocate file descriptors, and route input/output streams at the system call level.",
    approach: "I wrote a complete Unix shell in C from scratch, adhering to POSIX standards. The codebase features a custom lexer/parser, an execution loop using fork() and execvp(), and low-level file descriptor mapping via dup2() for I/O redirection and pipe chaining.",
    complications: "Process isolation and cleaning up zombie processes. When chaining multiple commands using pipes, managing background jobs and handling terminal control signals (SIGINT, SIGTSTP) was incredibly difficult. I resolved it by implementing strict signal traps and structured waitpid() sweeps inside a clean execution loop.",
    debrief: "Debugging file descriptor leaks taught me to be extremely disciplined with resource management. Every open file descriptor must have a clear close path, or the system will quickly run out of handles under sustained use.",
    tech: ["C", "Unix Systems", "POSIX", "Linux"],
    github: "https://github.com/K4rthik14",
    live: "https://github.com/K4rthik14",
    image: "/images/karsh.png",
    archDiagram: `[User Input] ──▸ [Lexer (Tokenization)]
                        │
                        ▾
                 [Parser (AST Generation)]
                        │
                        ▾
           [Command Executor (fork() & execvp())]
                        │
       ┌────────────────┴────────────────┐
       │                                 │
       ▾ (Pipes & Redirection)           ▾ (Signal Handling)
[dup2() File Descriptors]         [SIGINT & SIGTSTP Traps]`
  }
];

const SIGNALS = [
  {
    date: "JUN 2026",
    type: "BUILD LOG",
    title: "Benchmarking Inference Latency on Edge Devices",
    content: "Tuning YOLOv8 model inference latency for multi-camera streams in our stealth startup's surveillance backend. Benchmarked TensorRT vs ONNX Runtime on NVIDIA T4; saw a 2.4x throughput increase."
  },
  {
    date: "MAY 2026",
    type: "STUDY",
    title: "Data Partitions & Replication Lag",
    content: "Read chapters 5 and 6 of Designing Data-Intensive Applications. Spent the weekend analyzing how replica lag manifests as stale reads in eventual consistency models and how to mitigate it at the API layer."
  },
  {
    date: "APR 2026",
    type: "BUILD LOG",
    title: "Testing LangGraph Rollbacks",
    content: "Wrote a custom script to automate testing of LangGraph state machine rollback features. Ensured that if an external API tool fails, the agent cleanly reverts to the last stable state checkpoint instead of crashing."
  },
  {
    date: "MAR 2026",
    type: "DEPLOYMENT",
    title: "Publishing dev-logger-agent to PyPI",
    content: "Released dev-logger-agent CLI tool on PyPI. Designed its ReAct agent loop using LangGraph to parse and classify git diffs automatically. Handled edge cases where files are deleted or renamed in git history."
  },
  {
    date: "JAN 2026",
    type: "EVENT",
    title: "Organizing Build with AI Hackathon",
    content: "Organized the 'Build with AI — Kannur 2026' hackathon (50+ participants) through µLearn GCEK. Managed event flow, set up developer challenges, and helped coordinate mentorship."
  },
  {
    date: "NOV 2024",
    type: "BUILD LOG",
    title: "Pipe Redirection & FD Leaks in C",
    content: "Finished karsh, a custom Unix shell in C. Spent three days debugging file descriptor leaks in the pipe-chaining mechanism. Taught me the value of systematic logging and tracing syscalls with strace."
  },
  {
    date: "JUL 2024",
    type: "DEPLOYMENT",
    title: "Infosys Internship & CircuitGuard",
    content: "Built CircuitGuard for Infosys Springboard internship. Benchmarked ResNet-50 vs EfficientNet-B4 on PCB defect datasets. Selected as National Finalist at IIM Indore."
  }
];

const EXPERIENCE = [
  {
    period: "2025 — PRESENT",
    role: "Founding AI Engineer",
    org: "Stealth AI Startup",
    desc: "Architecting real-time computer vision pipelines processing 10+ RTSP camera streams concurrently. Designing low-latency object detection and occupancy analytics engines using YOLOv8 and ByteTrack. Implementing asynchronous FastAPI endpoints and Redis queues to stream real-time analytics to clients."
  },
  {
    period: "2025 — PRESENT",
    role: "Campus Co-Lead",
    org: "µLearn GCEK · Kannur",
    desc: "Spearheading technical community operations and leading the organization of 'Build with AI - Kannur 2026' hackathon (50+ participants)."
  },
  {
    period: "2024",
    role: "AI/ML Intern",
    org: "Infosys Springboard · Remote",
    desc: "Developed CircuitGuard — an automated PCB defect detection system using EfficientNet-B4 and OpenCV. Trained on manufacturing imagery across 6 defect categories, achieving 98% accuracy. Selected as national finalist at IIM Indore hackathon."
  },
  {
    period: "2023 — PRESENT",
    role: "B.Tech Computer Science",
    org: "Government College of Engineering, Kannur",
    desc: "Focusing on operating systems, computer architecture, databases, and algorithm analysis."
  }
];

const CREDENTIALS = [
  { year: "2026", name: "AWS AI & ML Scholars Program", badge: "ACTIVE" },
  { year: "2025", name: "Google × Kaggle AI Agents Intensive", badge: "CAPSTONE" },
  { year: "2025", name: "Snowflake BUILD Asia Pacific", badge: "SELECTED" },
  { year: "2024", name: "National Hackathon Finalist", badge: "IIM INDORE" }
];

const TECH_STACK = {
  "Core Languages": ["Python", "C", "POSIX Shell", "SQL"],
  "AI & Computer Vision": ["PyTorch", "OpenCV", "YOLOv8", "ByteTrack", "EfficientNet", "HuggingFace"],
  "Backend & Vectors": ["FastAPI", "ChromaDB", "PostgreSQL", "Redis", "LangGraph", "LangChain"],
  "Infrastructure": ["Linux", "Docker", "Git", "GitHub Actions", "AWS"]
};

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<Record<string, boolean>>({});
  const [systemTime, setSystemTime] = useState("");

  // Sync system time on client
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setSystemTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleProject = (id: string) => {
    setExpandedProjects((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="relative min-h-screen bg-[#090909] text-zinc-100 flex flex-col font-sans select-none">

      {/* ═══ NAVIGATION ═══ */}
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled
          ? "bg-[#090909]/75 backdrop-blur-md border-b border-zinc-900/60 py-3"
          : "bg-transparent py-5"
          }`}
      >
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="font-heading font-semibold text-lg tracking-tight hover:text-blue-400 transition-colors">
            Karthik S
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#projects" className="hover:text-zinc-100 transition-colors">Projects</a>
            <a href="#experience" className="hover:text-zinc-100 transition-colors">Experience</a>
            <a href="#writing" className="hover:text-zinc-100 transition-colors">Writing</a>
            <a href="#about" className="hover:text-zinc-100 transition-colors">About</a>
            <a href="https://github.com/K4rthik14" target="_blank" rel="noreferrer" className="hover:text-zinc-100 transition-colors">GitHub</a>
            <a
              href="#contact"
              className="px-4 py-1.5 bg-white text-black rounded font-medium hover:bg-zinc-200 transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-1 text-zinc-400 hover:text-zinc-100"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#090909]/95 backdrop-blur-lg flex flex-col justify-center items-center"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-1 text-zinc-400 hover:text-zinc-100"
              aria-label="Close navigation menu"
            >
              <X className="w-6 h-6" />
            </button>
            <nav className="flex flex-col gap-6 text-xl text-center text-zinc-400">
              <a
                href="#projects"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-zinc-100 transition-colors"
              >
                Projects
              </a>
              <a
                href="#experience"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-zinc-100 transition-colors"
              >
                Experience
              </a>
              <a
                href="#writing"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-zinc-100 transition-colors"
              >
                Writing
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-zinc-100 transition-colors"
              >
                About
              </a>
              <a
                href="https://github.com/K4rthik14"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-100 transition-colors"
              >
                GitHub
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="px-6 py-2 bg-white text-black rounded font-medium hover:bg-zinc-200 transition-colors inline-block mt-4"
              >
                Contact
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing.png"
            alt="Landscape background"
            fill
            className="object-cover opacity-60 pointer-events-none"
            priority
          />
          {/* 30% Dark Overlay and Gradient Fade */}
          <div className="absolute inset-0 bg-black/30 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#090909]/40 to-[#090909] z-15" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            <span className="font-mono text-xs text-blue-400 tracking-[0.2em] uppercase mb-4">
              Karthik S
            </span>
            <h1 className="font-heading text-4xl sm:text-6xl font-medium text-white tracking-tight mb-6 leading-[1.1]">
              Applied AI Engineer
            </h1>
            <p className="font-heading text-lg sm:text-2xl text-zinc-300 font-light max-w-2xl leading-relaxed mb-8">
              Building production AI systems powered by Computer Vision, LLMs, and intelligent agents.
            </p>
            <p className="text-sm sm:text-base text-zinc-400 max-w-lg mb-10 font-normal leading-relaxed">
              Currently building real-world AI products while pursuing Computer Science.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <a
                href="#projects"
                className="w-full sm:w-auto px-6 py-3 bg-white text-black text-sm font-medium rounded hover:bg-zinc-200 transition-colors shadow-sm"
              >
                View Projects
              </a>
              <a
                href="https://github.com/K4rthik14"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-6 py-3 border border-zinc-800 text-zinc-300 text-sm font-medium rounded hover:bg-zinc-900/50 hover:text-white transition-colors"
              >
                GitHub Profile
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer text-zinc-500 hover:text-zinc-300 transition-colors"
          onClick={() => {
            document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="font-mono text-[10px] tracking-widest uppercase">SCROLL</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </section>

      {/* ═══ FEATURED PROJECTS ═══ */}
      <section id="projects" className="py-24 sm:py-32 relative z-20 max-w-5xl mx-auto px-6 w-full">
        <div className="mb-20">
          <span className="font-mono text-xs text-blue-400 tracking-[0.25em] uppercase block mb-3">01 // PROJECTS</span>
          <h2 className="font-heading text-3xl sm:text-4xl font-normal text-white">Featured Projects</h2>
          <p className="text-zinc-500 text-sm mt-2">Systems engineered to solve specific constraints, presenting real problems and structured solutions.</p>
        </div>

        <div className="flex flex-col gap-24 sm:gap-32">
          {PROJECTS.map((project, index) => {
            const isExpanded = !!expandedProjects[project.id];
            const isEven = index % 2 === 0;

            return (
              <div
                key={project.id}
                className={`flex flex-col gap-8 items-start lg:grid lg:grid-cols-12 lg:gap-12`}
              >
                {/* Text Side */}
                <div
                  className={`flex flex-col w-full lg:col-span-6 ${isEven ? "lg:order-1" : "lg:order-2"
                    }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-mono text-[11px] text-zinc-500 tracking-wider">PROJECT 0{index + 1}</span>
                    <span className="h-px bg-zinc-800 flex-1" />
                  </div>
                  <h3 className="font-heading text-2xl font-normal text-white mb-2">{project.title}</h3>
                  <p className="text-sm font-medium text-blue-400/80 mb-4">{project.subtitle}</p>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 bg-zinc-900/60 border border-zinc-800 text-zinc-400 rounded text-[11px] font-mono hover:border-zinc-700 transition-colors"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4 items-center mb-6">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                      CODE <ExternalLink className="w-3 h-3" />
                    </a>
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        {project.id === "dev-logger-agent" ? "VIEW ON PYPI" : "LIVE DEMO"}
                      </a>
                    )}
                    <button
                      onClick={() => toggleProject(project.id)}
                      className="ml-auto flex items-center gap-2 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {isExpanded ? (
                        <>
                          COLLAPSE DEEP DIVE <ChevronUp className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          SYSTEM DEEP DIVE <ChevronDown className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Image Side */}
                <div
                  className={`w-full lg:col-span-6 flex items-center justify-center ${isEven ? "lg:order-2" : "lg:order-1"
                    }`}
                >
                  <div className="relative w-full aspect-square max-w-[420px] rounded-lg border border-zinc-800/80 bg-zinc-950 overflow-hidden shadow-md group">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-w-768px) 100vw, 420px"
                    />
                  </div>
                </div>

                {/* Expanded Deep Dive Details */}
                <div className="w-full lg:col-span-12">
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-6 mt-6 border-t border-zinc-900 flex flex-col gap-6">
                          {/* System Architecture */}
                          <div className="bg-[#0b0b0c] border border-zinc-900 rounded p-4 overflow-x-auto">
                            <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-widest block mb-3 border-b border-zinc-900/60 pb-2">
                              SYSTEM ARCHITECTURE
                            </span>
                            <pre className="font-mono text-[11px] text-zinc-400 leading-relaxed whitespace-pre">
                              {project.archDiagram}
                            </pre>
                          </div>

                          {/* Briefing Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="flex flex-col gap-2">
                              <h4 className="font-mono text-[10px] text-blue-400 uppercase tracking-wider">OBJECTIVE</h4>
                              <p className="text-zinc-400 leading-relaxed font-light">{project.objective}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <h4 className="font-mono text-[10px] text-blue-400 uppercase tracking-wider">APPROACH</h4>
                              <p className="text-zinc-400 leading-relaxed font-light">{project.approach}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <h4 className="font-mono text-[10px] text-blue-400 uppercase tracking-wider">COMPLICATIONS</h4>
                              <p className="text-zinc-400 leading-relaxed font-light">{project.complications}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <h4 className="font-mono text-[10px] text-blue-400 uppercase tracking-wider">DEBRIEF</h4>
                              <p className="text-zinc-400 leading-relaxed font-light">{project.debrief}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ EXPERIENCE SECTION ═══ */}
      <section id="experience" className="py-24 sm:py-32 relative z-20 max-w-5xl mx-auto px-6 w-full border-t border-zinc-900/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Section Header */}
          <div className="lg:col-span-4">
            <span className="font-mono text-xs text-blue-400 tracking-[0.25em] uppercase block mb-3">02 // EXPERIENCE</span>
            <h2 className="font-heading text-3xl font-normal text-white">Active Deployments</h2>
            <p className="text-zinc-500 text-sm mt-3 leading-relaxed">
              Industrial contributions and academic pathways building high-performance systems.
            </p>

            {/* Credentials Verified */}
            <div className="mt-12">
              <span className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest block mb-4 border-b border-zinc-900 pb-2">
                VERIFIED CREDENTIALS
              </span>
              <div className="flex flex-col gap-3">
                {CREDENTIALS.map((cred) => (
                  <div key={cred.name} className="flex justify-between items-center bg-[#0b0b0c] border border-zinc-900/60 p-3 rounded">
                    <div>
                      <span className="font-mono text-[10px] text-zinc-500 mr-2">{cred.year}</span>
                      <span className="text-xs text-zinc-300">{cred.name}</span>
                    </div>
                    <span className="font-mono text-[9px] text-blue-400/90 border border-blue-500/20 px-2 py-0.5 rounded bg-blue-500/5">
                      {cred.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {EXPERIENCE.map((exp, index) => (
              <div
                key={exp.role + index}
                className="bg-[#0b0b0c] border border-zinc-900/60 rounded p-6 hover:border-zinc-800 transition-colors"
              >
                <span className="font-mono text-[11px] text-zinc-500 block mb-2">{exp.period}</span>
                <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4 gap-1">
                  <h3 className="font-heading text-lg font-normal text-white">{exp.role}</h3>
                  <span className="font-mono text-xs text-blue-400">{exp.org}</span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed font-light">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TECH STACK ═══ */}
      <section className="py-24 sm:py-32 relative z-20 max-w-5xl mx-auto px-6 w-full border-t border-zinc-900/60">
        <div className="mb-16">
          <span className="font-mono text-xs text-blue-400 tracking-[0.25em] uppercase block mb-3">03 // TECH STACK</span>
          <h2 className="font-heading text-3xl font-normal text-white">Technical Arsenal</h2>
          <p className="text-zinc-500 text-sm mt-2">Categorized systems framework and technologies designed to perform under pressure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(TECH_STACK).map(([category, items]) => (
            <div
              key={category}
              className="bg-[#0b0b0c] border border-zinc-900/60 p-6 rounded hover:border-zinc-800 transition-colors flex flex-col"
            >
              <h3 className="font-mono text-[11px] text-zinc-500 uppercase tracking-widest mb-4 border-b border-zinc-900 pb-2">
                {category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-2.5 py-1 bg-zinc-950 border border-zinc-900 text-zinc-400 rounded text-[11px] font-mono hover:border-zinc-800 hover:text-white transition-colors"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ SIGNAL LOG (WRITING) ═══ */}
      <section id="writing" className="py-24 sm:py-32 relative z-20 max-w-5xl mx-auto px-6 w-full border-t border-zinc-900/60">
        <div className="mb-16">
          <span className="font-mono text-xs text-blue-400 tracking-[0.25em] uppercase block mb-3">04 // WRITING</span>
          <h2 className="font-heading text-3xl font-normal text-white">Signal Transmissions</h2>
          <p className="text-zinc-500 text-sm mt-2">A chronological record of engineering logs, studies, and deployments.</p>
        </div>

        <div className="relative border-l border-zinc-900 pl-6 sm:pl-8 flex flex-col gap-12 ml-4">
          {SIGNALS.map((signal, index) => (
            <div key={signal.title + index} className="relative group">
              {/* Dot */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-2 h-2 rounded-full bg-zinc-800 border border-zinc-950 group-hover:bg-blue-400 group-hover:shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all duration-300" />

              <div className="flex flex-col items-start">
                <span className="font-mono text-[10px] text-zinc-500 tracking-wider mb-2">{signal.date}</span>
                <span className="px-2 py-0.5 bg-blue-500/5 border border-blue-500/10 text-blue-400 font-mono text-[9px] rounded mb-3">
                  {signal.type}
                </span>
                <h3 className="font-heading text-lg font-normal text-white mb-2 group-hover:text-blue-400/90 transition-colors">
                  {signal.title}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed font-light max-w-2xl">
                  {signal.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ ABOUT (OPERATOR DOSSIER) ═══ */}
      <section id="about" className="py-24 sm:py-32 relative z-20 max-w-5xl mx-auto px-6 w-full border-t border-zinc-900/60">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Dossier info and briefing */}
          <div className="lg:col-span-6 flex flex-col gap-8">
            <div>
              <span className="font-mono text-xs text-blue-400 tracking-[0.25em] uppercase block mb-3">05 // OPERATOR</span>
              <h2 className="font-heading text-3xl font-normal text-white mb-4">Operator Briefing</h2>

              <div className="bg-[#0b0b0c] border border-zinc-900 p-6 rounded mb-8">
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 mb-6 border-b border-zinc-900 pb-3">
                  <span>CLASSIFICATION: BUILDER</span>
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ACTIVE
                  </span>
                </div>

                <h3 className="font-heading text-2xl font-normal text-zinc-100 mb-2">Karthik</h3>
                <p className="font-mono text-xs text-blue-400 mb-6">Founding AI Engineer · Stealth Startup</p>

                <div className="flex flex-col gap-2.5 text-xs text-zinc-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                    <span>Kerala, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                    <span>B.Tech CS · Government College of Engineering, Kannur</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="font-mono">SYS.TIME: {systemTime || "12:00:00"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="font-heading text-xl font-normal text-white">Designing systems that keep working long after I close my laptop.</h3>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                I spend my time building real-time computer vision pipelines, multi-agent systems, and backend services. I value simplicity, systems-level understanding, and writing code that lasts. I don't collect projects — I build to solve real bottlenecks and learn how systems behave under stress.
              </p>
            </div>
          </div>

          {/* Right Column: Obsession / Bookshelf */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Obsession */}
            <div className="bg-[#0b0b0c] border border-zinc-900/60 p-6 rounded hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-2.5 mb-4">
                <Cpu className="w-4 h-4 text-blue-400" />
                <h3 className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider">ENGINEERING OBSESSION</h3>
              </div>
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                Optimizing multi-stream RTSP frame processing queues. Minimizing CPU-to-GPU transfer latency and preventing queue bottlenecks when handling concurrent camera streams under high frame-rates.
              </p>
            </div>

            {/* Currently Exploring */}
            <div className="bg-[#0b0b0c] border border-zinc-900/60 p-6 rounded hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-2.5 mb-4">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h3 className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider">CURRENTLY EXPLORING</h3>
              </div>
              <ul className="flex flex-col gap-2.5 text-zinc-400 text-sm font-light">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 font-mono">→</span>
                  <span>Low-latency model inference engines (TensorRT, ONNX Runtime)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 font-mono">→</span>
                  <span>Distributed consensus protocols and replication schemes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 font-mono">→</span>
                  <span>Local-first web database architectures</span>
                </li>
              </ul>
            </div>

            {/* Bookshelf */}
            <div className="bg-[#0b0b0c] border border-zinc-900/60 p-6 rounded hover:border-zinc-800 transition-colors">
              <div className="flex items-center gap-2.5 mb-4">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <h3 className="font-mono text-[11px] text-zinc-400 uppercase tracking-wider">ON THE BOOKSHELF</h3>
              </div>
              <ul className="flex flex-col gap-2.5 text-zinc-400 text-sm font-light">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 font-mono">→</span>
                  <span>
                    <em className="text-zinc-300">Designing Data-Intensive Applications</em> — Martin Kleppmann (studying partitioning & replication)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 font-mono">→</span>
                  <span>
                    <em className="text-zinc-300">Operating Systems: Three Easy Pieces</em> — Remzi H. Arpaci-Dusseau
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CONTACT SECTION ═══ */}
      <section id="contact" className="py-24 sm:py-32 relative z-20 max-w-5xl mx-auto px-6 w-full border-t border-zinc-900/60 flex flex-col items-center text-center">
        <span className="font-mono text-xs text-blue-400 tracking-[0.25em] uppercase block mb-3">06 // CONTACT</span>
        <h2 className="font-heading text-3xl sm:text-4xl font-normal text-white mb-4">Have a hard engineering problem?</h2>
        <p className="text-zinc-500 text-sm mb-10 max-w-md">Open a channel. Let&apos;s build stable solutions.</p>

        <a
          href="mailto:karthik1000x@gmail.com"
          className="px-8 py-4 bg-white text-black font-semibold rounded hover:bg-zinc-200 transition-colors inline-flex items-center gap-2 shadow-sm text-base"
        >
          <Mail className="w-4 h-4" />
          karthik1000x@gmail.com
        </a>

        <div className="flex gap-6 mt-12 text-zinc-400 text-sm font-mono">
          <a
            href="https://github.com/K4rthik14"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <GithubIcon className="w-4 h-4" />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/karthik-k4"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <LinkedinIcon className="w-4 h-4" />
            LinkedIn
          </a>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 border-t border-zinc-900/60 relative z-20 mt-auto bg-[#080809]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-600 font-mono">
          <span>Karthik S · Kerala, India</span>
          <span>© {new Date().getFullYear()} Karthik S. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
