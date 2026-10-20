// splash.js: homepage intro overlay.
//
// The page underneath is always rendered; the splash only sits on top of it.
// It runs only when the head script in _layouts/default.html added
// html.splash-active (homepage, first view this session, not arriving from
// another page of this site). Total run is about 3-4 s. A click or tap
// anywhere on it, or any key, skips it. Under prefers-reduced-motion it shows
// static (all lines at once, no cursor blink) for about 1.5 s.
//
// Lines come from _data/splash_lines.yml, rendered into
// <script type="application/json" id="splash-pool"> by the layout:
//   { count, rare_weight, final, lines: [{ text, rarity: common|rare }] }
// If that is missing or malformed, FALLBACK below is used.
(function () {
  const root = document.documentElement;
  const splash = document.getElementById("splash");
  if (!splash || !root.classList.contains("splash-active")) return;

  const FALLBACK = {
    count: 3,
    rare_weight: 0.12,
    final: ". . . Welcome to Qweary's Blog.",
    lines: [
      { text: "[OK] Bypassing biometric lock...", rarity: "common" },
      { text: "[OK] Initializing secure comms...", rarity: "common" },
      { text: "[OK] Loading encrypted modules...", rarity: "common" },
      { text: "[OK] Spoofing MAC address...", rarity: "common" }
    ]
  };

  let pool = FALLBACK;
  try {
    const el = document.getElementById("splash-pool");
    const data = el ? JSON.parse(el.textContent) : null;
    if (data && Array.isArray(data.lines) && data.lines.length) pool = data;
  } catch (e) { /* keep FALLBACK */ }

  const rareWeight = typeof pool.rare_weight === "number" ? pool.rare_weight : 0.12;
  const count = Math.max(1, Math.min(pool.count || 3, pool.lines.length));
  const finals = Array.isArray(pool.final) ? pool.final : [pool.final || FALLBACK.final];

  // Weighted sampling without replacement: rare lines are weighted low.
  const pick = () => {
    const bag = pool.lines
      .map(l => (typeof l === "string" ? { text: l, rarity: "common" } : l))
      .filter(l => l && l.text);
    const out = [];
    while (out.length < count && bag.length) {
      const weights = bag.map(l => (l.rarity === "rare" ? rareWeight : 1));
      let r = Math.random() * weights.reduce((a, b) => a + b, 0);
      let i = 0;
      while (i < bag.length - 1 && (r -= weights[i]) > 0) i++;
      out.push(bag.splice(i, 1)[0].text);
    }
    return out;
  };

  const messages = pick();
  const finalMessage = finals[Math.floor(Math.random() * finals.length)];
  const container = document.getElementById("splash-lines");
  const skipBtn = document.getElementById("skip-button");
  const reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  let ended = false;

  function endSplash() {
    if (ended) return;
    ended = true;
    timers.forEach(clearTimeout);
    document.removeEventListener("keydown", onKey, true);
    // Reveal underneath at the start of the fade, not the end.
    root.classList.remove("splash-active");
    root.classList.add("splash-leaving");
    const done = () => {
      root.classList.remove("splash-leaving");
      splash.remove();
    };
    if (reduced) done(); else setTimeout(done, 300);
  }

  function onKey(e) {
    if (e.key === "Tab") return; // let keyboard users reach the skip button
    endSplash();
  }

  const addLine = (text, isFinal) => {
    const line = document.createElement("div");
    line.className = "splash-line" + (isFinal ? " final-line" : "");
    container.appendChild(line);
    return line;
  };

  const typeLine = (text, isFinal, next) => {
    const line = addLine(text, isFinal);
    let i = 0;
    const step = () => {
      line.textContent = text.slice(0, ++i);
      if (i < text.length) later(step, 14);
      else later(next, isFinal ? 700 : 150);
    };
    later(step, isFinal ? 300 : 0);
  };

  splash.addEventListener("click", endSplash);
  document.addEventListener("keydown", onKey, true);
  if (skipBtn) skipBtn.focus({ preventScroll: true });

  const wrapper = splash.querySelector(".ascii-wrapper");
  if (wrapper) wrapper.scrollLeft = 0;

  if (reduced) {
    messages.forEach(m => { addLine(m, false).textContent = m; });
    addLine(finalMessage, true).textContent = finalMessage;
    later(endSplash, 1500);
    return;
  }

  let idx = 0;
  const next = () => {
    if (idx < messages.length) typeLine(messages[idx++], false, next);
    else if (idx++ === messages.length) typeLine(finalMessage, true, endSplash);
  };
  next();
  later(endSplash, 5000); // safety net
})();
