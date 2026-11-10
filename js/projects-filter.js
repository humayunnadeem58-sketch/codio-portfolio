/**
 * Projects Category Filter
 * Accessible filtering for project items with screen reader status announcements
 */

export function initProjectsFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card[data-category]");
  const announcer = document.getElementById("projects-filter-status");

  if (!filterButtons.length || !projectCards.length) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedFilter = btn.getAttribute("data-filter");

      // Update button active state & aria attributes
      filterButtons.forEach((b) => {
        const isActive = b === btn;
        b.classList.toggle("active", isActive);
        b.setAttribute("aria-pressed", isActive ? "true" : "false");
      });

      let visibleCount = 0;

      projectCards.forEach((card) => {
        const categories = (card.getAttribute("data-category") || "").split(" ");
        const shouldShow = selectedFilter === "all" || categories.includes(selectedFilter);

        if (shouldShow) {
          card.style.display = "flex";
          visibleCount++;
        } else {
          card.style.display = "none";
        }
      });

      // Announce filter change to assistive tech
      if (announcer) {
        const filterName = btn.textContent.trim();
        announcer.textContent = `Showing ${visibleCount} projects for category: ${filterName}`;
      }
    });
  });
}
