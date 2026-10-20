// theme-toggle.js
// The head script in _layouts/default.html has already set data-theme from
// the stored choice or, failing that, the OS preference. This file only reads
// that attribute; it never imposes a default of its own.
// The button's accessible name is its visible text ("Dark mode"); its state
// is aria-pressed. Storage may be blocked, so every access is guarded.
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;
  const root = document.documentElement;
  const mark = toggle.querySelector(".toggle-state");

  const render = () => {
    const dark = root.getAttribute("data-theme") === "dark";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    if (mark) mark.textContent = dark ? "●" : "○";
  };

  render();

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: theme lasts this page only */ }
    render();
  });
});
