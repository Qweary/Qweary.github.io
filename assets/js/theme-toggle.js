// theme-toggle.js
// The head script in _layouts/default.html has already set data-theme from
// the stored choice or, failing that, the OS preference. This file only reads
// that attribute; it never imposes a default of its own.
// The button's accessible name is its visible text ("Dark mode"); its state
// is aria-pressed. Storage may be blocked, so every access is guarded.
//
// Easter egg: 5 clicks within 3 s switch to the P1 green phosphor mode.
// While a phosphor mode is on, each click steps P1 -> P3 amber -> Aurora dark,
// so a normal click always leads back. The choice is stored like any theme.
// eggs.js can also set a mode by dispatching "qweary:theme" with
// detail = "light" | "dark" | "p1" | "p3".
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("theme-toggle");
  const root = document.documentElement;
  const LABELS = { p1: "P1 phosphor", p3: "P3 amber" };
  const RAPID = 5, WINDOW_MS = 3000;
  let clicks = [];

  const mark = toggle && toggle.querySelector(".toggle-state");
  const label = toggle && Array.from(toggle.childNodes).find(n => n.nodeType === 3 && n.textContent.trim());

  const render = () => {
    if (!toggle) return;
    const t = root.getAttribute("data-theme");
    const dark = t !== "light";
    toggle.setAttribute("aria-pressed", dark ? "true" : "false");
    if (mark) mark.textContent = dark ? "●" : "○";
    if (label) label.textContent = " " + (LABELS[t] || "Dark mode");
  };

  const announce = (text) => {
    document.dispatchEvent(new CustomEvent("qweary:toast", { detail: { text } }));
  };

  const setTheme = (next, say) => {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: theme lasts this page only */ }
    render();
    if (say) announce(say);
  };

  document.addEventListener("qweary:theme", (e) => {
    const t = e.detail;
    if (t === "light" || t === "dark" || t === "p1" || t === "p3") setTheme(t);
  });

  if (!toggle) return;
  render();

  toggle.addEventListener("click", () => {
    const now = Date.now();
    clicks = clicks.filter(t => now - t < WINDOW_MS);
    clicks.push(now);
    const current = root.getAttribute("data-theme");

    if (current === "p1") { clicks = []; setTheme("p3", "P3 amber phosphor. One more click returns to Aurora."); return; }
    if (current === "p3") { clicks = []; setTheme("dark", "Back to Aurora."); return; }
    if (clicks.length >= RAPID) { clicks = []; setTheme("p1", "P1 green phosphor. Click again for P3 amber."); return; }
    setTheme(current === "dark" ? "light" : "dark");
  });
});
