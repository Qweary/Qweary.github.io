document.addEventListener("DOMContentLoaded", () => {
  const flickerOverlay = document.getElementById("flicker-overlay");
  if (!flickerOverlay) return;

  // Intercept all internal link clicks
  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return; // Skip external

    link.addEventListener('click', (e) => {
      // Allow normal behavior for new tabs or modifier keys
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;

      e.preventDefault();
      flickerOverlay.classList.add("flicker-in");

      setTimeout(() => {
        window.location.href = link.href;
      }, 150); // Flicker duration before navigation
    });
  });
});
