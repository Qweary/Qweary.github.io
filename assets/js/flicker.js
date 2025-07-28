document.addEventListener("DOMContentLoaded", () => {
  const flickerOverlay = document.getElementById("flicker-overlay");
  if (!flickerOverlay) return;

  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return; // Skip external

    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || link.target === '_blank') return;

      e.preventDefault();
      flickerOverlay.classList.remove("glitch");
      void flickerOverlay.offsetWidth; // Force reflow for retrigger
      flickerOverlay.classList.add("glitch");

      setTimeout(() => {
        window.location.href = link.href;
      }, 400); // Match CSS glitch duration
    });
  });
});
