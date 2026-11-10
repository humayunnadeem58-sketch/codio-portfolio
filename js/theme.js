/**
 * Theme Manager
 * Dark / Light theme toggle with persistence and system preference sync
 */

const THEME_KEY = "portfolio-theme";

export function initTheme() {
  const themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");
  const currentTheme = getPreferredTheme();
  
  applyTheme(currentTheme);

  themeToggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const activeTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = activeTheme === "dark" ? "light" : "dark";
      applyTheme(newTheme);
      localStorage.setItem(THEME_KEY, newTheme);
      
      const toast = window.showToast;
      if (typeof toast === "function") {
        toast(`Switched to ${newTheme} theme`);
      }
    });
  });

  // Listen for OS theme changes if user hasn't explicitly set a preference
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
}

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme) {
    return savedTheme;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");
  
  themeToggleButtons.forEach((btn) => {
    const isLight = theme === "light";
    btn.setAttribute("aria-pressed", isLight ? "true" : "false");
    btn.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
    btn.title = isLight ? "Switch to dark theme" : "Switch to light theme";
    
    // Toggle sun / moon SVG icons
    const iconSun = btn.querySelector(".icon-sun");
    const iconMoon = btn.querySelector(".icon-moon");
    if (iconSun && iconMoon) {
      if (isLight) {
        iconSun.style.display = "none";
        iconMoon.style.display = "block";
      } else {
        iconSun.style.display = "block";
        iconMoon.style.display = "none";
      }
    }
  });
}
