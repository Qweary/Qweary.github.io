// flicker.js: brief CRT glitch on same-origin navigation.
// Skipped entirely under prefers-reduced-motion. Never applied to in-page
// #fragment links (skip link, footnotes, TOCs), new-tab or modified clicks,
// or download links. Navigation is delayed by only ~150 ms.
document.addEventListener("DOMContentLoaded", () => {
  const flickerOverlay = document.getElementById("flicker-overlay");
  if (!flickerOverlay) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const DELAY = 150;

  const reset = () => {
    flickerOverlay.classList.remove("glitch");
    document.body.classList.remove("glitch-color");
    document.querySelectorAll(".glitch-line, .crt-overlay").forEach(el => el.remove());
  };
  // Coming back via the back/forward cache must not leave the glitch on screen.
  window.addEventListener("pageshow", reset);

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

    // Brief RGB split
    document.body.classList.add("glitch-color");
    setTimeout(() => document.body.classList.remove("glitch-color"), 150);
  };

  document.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const link = e.target.closest && e.target.closest("a[href]");
    if (!link || link.target === "_blank" || link.hasAttribute("download")) return;

    let url;
    try { url = new URL(link.href, window.location.href); } catch (err) { return; }
    if (url.origin !== window.location.origin) return;
    if (!/^https?:$/.test(url.protocol)) return;
    // In-page fragment link: same document, only the hash differs.
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

    e.preventDefault();
    triggerGlitch();
    setTimeout(() => { window.location.href = link.href; }, DELAY);
  });
});
