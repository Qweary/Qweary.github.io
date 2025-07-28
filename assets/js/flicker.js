document.addEventListener("DOMContentLoaded", () => {
  const flickerOverlay = document.getElementById("flicker-overlay");
  if (!flickerOverlay) return;

  const triggerGlitch = () => {
    flickerOverlay.classList.remove("glitch");
    void flickerOverlay.offsetWidth; // Force reflow
    flickerOverlay.classList.add("glitch");

    // Add CRT-style flicker lines (randomized)
    const glitchCount = Math.floor(Math.random() * 3) + 3;
    for (let i = 0; i < glitchCount; i++) {
      const line = document.createElement("div");
      line.classList.add("glitch-line");
      line.style.top = `${Math.floor(Math.random() * 95)}vh`; // Random Y position
      line.style.left = `${Math.random() * 2 - 1}px`; // Subtle horizontal jitter
      document.body.appendChild(line);
      setTimeout(() => line.remove(), 300);
    }

    // Add a faint full-screen CRT-style overlay
    const overlay = document.createElement("div");
    overlay.classList.add("crt-overlay");
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 300);

    // Optional: Add RGB split briefly
    document.body.classList.add("glitch-color");
    setTimeout(() => document.body.classList.remove("glitch-color"), 200);
  };

  document.querySelectorAll('a[href]').forEach(link => {
    const url = new URL(link.href, window.location.origin);
    if (url.origin !== window.location.origin) return;

    link.addEventListener('click', (e) => {
      if (
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey ||
        link.target === '_blank'
      ) return;

      e.preventDefault();
      triggerGlitch();

      setTimeout(() => {
        window.location.href = link.href;
      }, 400); // Match glitchFade timing
    });
  });
});
