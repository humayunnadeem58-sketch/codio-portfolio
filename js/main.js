/**
 * Main Application Orchestrator — Animations + Interactions
 * CODIO Portfolio Edition (Black & Glowing Red)
 */

import { initTheme } from "./theme.js";
import { initNavigation } from "./navigation.js";
import { initProjectsFilter } from "./projects-filter.js";
import { initContactForm } from "./contact.js";

/* ── Global toast ─────────────────────────────────────────────────────── */
window.showToast = function (message, duration = 3000) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.setAttribute("aria-atomic", "true");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => toast.classList.remove("show"), duration);
};

/* ── Hero animated background injection ──────────────────────────────── */
function injectHeroBg() {
  const hero = document.getElementById("hero");
  if (!hero) return;

  // Prevent multiple injections
  if (hero.querySelector(".hero-bg-grid")) return;

  // Animated grid
  const grid = document.createElement("div");
  grid.className = "hero-bg-grid";
  grid.setAttribute("aria-hidden", "true");
  hero.prepend(grid);

  // Radial glow
  const glow = document.createElement("div");
  glow.className = "hero-bg-glow";
  glow.setAttribute("aria-hidden", "true");
  hero.prepend(glow);

  // Scan line
  const scan = document.createElement("div");
  scan.className = "hero-scan-line";
  scan.setAttribute("aria-hidden", "true");
  hero.prepend(scan);

  // Floating particles
  const particles = document.createElement("div");
  particles.className = "hero-particles";
  particles.setAttribute("aria-hidden", "true");
  const particleData = [
    { w: 4, t: 20, l: 10, dur: 7, delay: 0 },
    { w: 3, t: 60, l: 80, dur: 9, delay: 1 },
    { w: 5, t: 80, l: 25, dur: 8, delay: 2 },
    { w: 3, t: 30, l: 70, dur: 6, delay: 0.5 },
    { w: 4, t: 70, l: 55, dur: 10, delay: 3 },
    { w: 2, t: 15, l: 45, dur: 8, delay: 1.5 },
    { w: 3, t: 50, l: 5,  dur: 11, delay: 4 },
    { w: 4, t: 40, l: 90, dur: 7, delay: 2.5 },
    { w: 2, t: 55, l: 35, dur: 9, delay: 5 },
    { w: 3, t: 25, l: 60, dur: 8, delay: 3.5 },
  ];
  particleData.forEach(p => {
    const dot = document.createElement("div");
    dot.className = "hero-particle";
    dot.style.cssText = `
      width:${p.w}px; height:${p.w}px; top:${p.t}%; left:${p.l}%;
      --dur:${p.dur}s; --delay:${p.delay}s;
      box-shadow: 0 0 ${p.w * 2}px rgba(220,20,20,0.9);
      border-radius: 50%;
    `;
    particles.appendChild(dot);
  });
  hero.prepend(particles);
}

/* ── Typewriter effect for CODIO ───────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById("typewriter-role");
  if (!el) return;

  const defaultPhrases = [
    "Custom Website Development",
    "Modern & Responsive Websites",
    "E-Commerce Solutions",
    "Performance-Driven Web Experiences"
  ];

  let phrases = defaultPhrases;
  if (el.dataset.phrases) {
    try {
      phrases = JSON.parse(el.dataset.phrases);
    } catch (e) {
      phrases = defaultPhrases;
    }
  }

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const speed = { type: 75, delete: 40, pause: 2200 };

  function tick() {
    const phrase = phrases[phraseIdx];
    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, speed.pause);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? speed.delete : speed.type);
  }

  setTimeout(tick, 500);
}

/* ── Scroll-reveal (IntersectionObserver) ────────────────────────────── */
function initScrollReveal() {
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children").forEach(el => {
      el.classList.add("visible");
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  });

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children").forEach(el => {
    observer.observe(el);
  });
}

/* ── Header scroll shadow ────────────────────────────────────────────── */
function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });
}

/* ── Smooth scroll with header offset ───────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const offset = window.scrollY + targetEl.getBoundingClientRect().top - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
      targetEl.setAttribute("tabindex", "-1");
      targetEl.focus({ preventScroll: true });
    });
  });
}

/* ── Copy to clipboard buttons ───────────────────────────────────────── */
function initCopyButtons() {
  document.querySelectorAll("[data-copy-email]").forEach(btn => {
    btn.addEventListener("click", () => {
      const text = btn.getAttribute("data-copy-email");
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        window.showToast(`Copied ${text} to clipboard!`);
      }).catch(() => {
        window.showToast("Could not access clipboard.");
      });
    });
  });
}

/* ── Add reveal classes to sections ──────────────────────────────────── */
function decorateRevealTargets() {
  document.querySelectorAll(".section-header").forEach(el => el.classList.add("reveal"));

  const aboutBio = document.querySelector(".about-bio");
  if (aboutBio) aboutBio.classList.add("reveal-left");

  const aboutPillars = document.querySelector(".about-pillars");
  if (aboutPillars) {
    aboutPillars.classList.add("stagger-children");
  }

  document.querySelectorAll(".skill-category-card").forEach((el, i) => {
    el.classList.add(i % 2 === 0 ? "reveal-left" : "reveal-right");
  });

  document.querySelectorAll(".project-card").forEach(el => {
    el.classList.add("reveal-scale");
  });

  document.querySelectorAll(".timeline-item").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  document.querySelectorAll(".service-card").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.transitionDelay = `${i * 0.1}s`;
  });

  const statCards = document.querySelector(".hero-stats");
  if (statCards) statCards.classList.add("stagger-children");

  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    heroContent.querySelectorAll("p.hero-greeting, h1.hero-title, p.hero-role, p.hero-lead, .hero-actions, .hero-stats").forEach((el, i) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = `opacity 0.6s ease, transform 0.6s ease`;
      el.style.transitionDelay = `${i * 0.1}s`;
      setTimeout(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 100 + i * 100);
    });
  }

  const contactGrid = document.querySelector(".contact-grid");
  if (contactGrid) {
    contactGrid.querySelector(".contact-info")?.classList.add("reveal-left");
    contactGrid.querySelector(".contact-form-container")?.classList.add("reveal-right");
  }
}

/* ── DOMContentLoaded boot ───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNavigation();
  initProjectsFilter();
  initContactForm();

  injectHeroBg();
  decorateRevealTargets();
  initScrollReveal();
  initTypewriter();
  initHeaderScroll();
  initSmoothScroll();
  initCopyButtons();

  // Current year
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
