// ============================================================
// KSP Crime Intelligence Platform — App Core (SPA Router)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // Navigation
  const navItems = document.querySelectorAll(".nav-item[data-page]");
  navItems.forEach(item => {
    item.addEventListener("click", () => navigateTo(item.dataset.page, item.dataset.title, item.dataset.subtitle));
  });

  // Default page
  navigateTo("dashboard", "Command & Control Dashboard", "Real-time crime intelligence overview — Karnataka 2024");

  // Clock
  updateClock();
  setInterval(updateClock, 1000);

  // Init alert counter animation
  animateCounters();
});

function navigateTo(pageId, title, subtitle) {
  // Hide all pages
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  // Show target
  const page = document.getElementById(`page-${pageId}`);
  if (page) {
    page.classList.add("active");
    page.style.animation = "none";
    requestAnimationFrame(() => {
      page.style.animation = "fadeInUp 0.3s ease";
    });
  }

  // Active nav
  const navItem = document.querySelector(`[data-page="${pageId}"]`);
  if (navItem) navItem.classList.add("active");

  // Update topbar
  const h2 = document.querySelector(".topbar-title h2");
  const p  = document.querySelector(".topbar-title p");
  if (h2 && title) h2.textContent = title;
  if (p && subtitle) p.textContent = subtitle;

  // Lazy-init modules on first visit
  switch(pageId) {
    case "dashboard":
      if (!window._dashInit) { window._dashInit = true; initDashboard(); }
      break;
    case "map":
      if (!window._mapInit) { window._mapInit = true; setTimeout(initCrimeMap, 100); }
      break;
    case "network":
      if (!window._netInit)  { window._netInit = true;  setTimeout(initNetworkGraph, 100); }
      break;
    case "predictive":
      if (!window._predInit) { window._predInit = true; initPredictive(); }
      break;
    case "trends":
      if (!window._trendInit){ window._trendInit = true; initTrends(); }
      break;
    case "offenders":
      if (!window._ofInit)   { window._ofInit = true;   renderOffenderCards(); }
      break;
  }
}

function updateClock() {
  const el = document.getElementById("live-clock");
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleTimeString("en-IN", { hour12: false });
}

function animateCounters() {
  document.querySelectorAll("[data-counter]").forEach(el => {
    const target = parseInt(el.dataset.counter, 10);
    let current  = 0;
    const step   = Math.ceil(target / 60);
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(timer);
    }, 20);
  });
}
