/**
 * BigBar Search - Interaction Enhancements
 * Handles pulse hint effect (removed initial slide-in animation)
 */
document.addEventListener("DOMContentLoaded", () => {
  // Get reference to the BigBar search component
  const bigbar = document.querySelector(".bigbar");
  if (!bigbar) return;

  // Removed initial pop-in animation code

  // Setup pulse hint after a delay
  setTimeout(setupPulseHint, 2000);

  // Setup intersection observer for scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // If BigBar comes into view and wasn't recently focused
        if (
          entry.isIntersecting &&
          !bigbar.classList.contains("recently-focused")
        ) {
          setupPulseHint();
        } else if (!entry.isIntersecting) {
          bigbar.classList.remove("pulse-hint");
        }
      });
    },
    { threshold: 0.5 }
  );

  // Start observing the BigBar element
  observer.observe(bigbar);

  // Function to setup the pulse hint effect
  function setupPulseHint() {
    // Only add pulse effect if the bar isn't focused
    if (
      !bigbar.matches(":focus-within") &&
      !document.activeElement.closest(".bigbar")
    ) {
      bigbar.classList.add("pulse-hint");
    }
  }

  // Stop pulse animation when any element in BigBar is focused
  bigbar.addEventListener("focusin", () => {
    bigbar.classList.remove("pulse-hint");

    // Mark as recently focused to prevent immediate re-animation
    bigbar.classList.add("recently-focused");

    // Clear the recently-focused flag after a period
    setTimeout(() => {
      bigbar.classList.remove("recently-focused");
    }, 5000);
  });

  // Also stop animation on pointer events
  bigbar.addEventListener("pointerdown", () => {
    bigbar.classList.remove("pulse-hint");
  });
});
