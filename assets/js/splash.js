// splash.js: homepage intro overlay.
//
// The page underneath is always rendered; the splash only sits on top of it.
// It runs only when the head script in _layouts/default.html added
// html.splash-active (homepage, first view this session, not arriving from
// another page of this site). A full run takes about 9-12 s, depending on the
// lines drawn (see TIMING). A click or tap anywhere on it, or any key, skips
// it. Under prefers-reduced-motion it shows static (all lines at once, no
// cursor blink) for about 1.5 s.
//
// Lines come from _data/splash_lines.yml, rendered into
// <script type="application/json" id="splash-pool"> by the layout:
//   { count, rare_weight, final, lines: [{ text, rarity: common|rare }] }
// If that is missing or malformed, FALLBACK below is used.

// ---- Pacing: every timing value lives here. Tune freely. ----
const SPLASH_TIMING = {
  CHAR_MS: 40,           // per typed character
  LINE_GAP_MS: 500,      // pause after each boot line
  PRE_FINAL_MS: 800,     // extra pause before the final line starts typing
  FINAL_HOLD_MS: 2500,   // hold after the final line finishes, before the fade
  FADE_MS: 300,          // fade-out (keep in step with splash.css .splash-leaving)
  REDUCED_HOLD_MS: 1500, // reduced motion: how long the static splash shows
  SAFETY_MARGIN_MS: 1500 // safety net = computed run length + this
};

(function () {
  const T = SPLASH_TIMING;
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
  let finalMessage = finals[Math.floor(Math.random() * finals.length)];
  // Easter egg: at 13:37 local time.
  const clock = new Date();
  if (clock.getHours() === 13 && clock.getMinutes() === 37) finalMessage += " (13:37. nice.)";
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Safety net, computed from the actual lines: typing + gaps + holds + margin.
  // Published for the head-script failsafe so it never fires before a normal
  // run has finished.
  const typedChars = messages.reduce((n, m) => n + m.length, 0) + finalMessage.length;
  const runMs = reducedMotion
    ? T.REDUCED_HOLD_MS
    : typedChars * T.CHAR_MS + messages.length * T.LINE_GAP_MS + T.PRE_FINAL_MS + T.FINAL_HOLD_MS;
  const safetyMs = runMs + T.SAFETY_MARGIN_MS;
  root.setAttribute("data-splash-deadline", String(Date.now() + safetyMs));

  const container = document.getElementById("splash-lines");
  const skipBtn = document.getElementById("skip-button");
  const reduced = reducedMotion;

  // While the overlay is up, the page behind it is inert, so Tab cannot
  // wander under it. Restored when the splash ends (and by the head-script
  // failsafe if this file ever fails).
  const behind = [document.getElementById("site-content"), document.querySelector(".skip-link")].filter(Boolean);
  behind.forEach(el => { el.inert = true; });

  // The skip hint matches the input: touch-only devices have no keys.
  let touchOnly = false;
  try { touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches; } catch (e) {}
  if (skipBtn && touchOnly) skipBtn.textContent = "Tap to skip intro";

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
    behind.forEach(el => { el.inert = false; });
    root.classList.add("splash-leaving");
    const done = () => {
      root.classList.remove("splash-leaving");
      splash.remove();
    };
    if (reduced) done(); else setTimeout(done, T.FADE_MS);
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
      if (i < text.length) later(step, T.CHAR_MS);
      else later(next, isFinal ? T.FINAL_HOLD_MS : T.LINE_GAP_MS);
    };
    later(step, isFinal ? T.PRE_FINAL_MS : 0);
  };

  splash.addEventListener("click", endSplash);
  document.addEventListener("keydown", onKey, true);
  if (skipBtn) skipBtn.focus({ preventScroll: true });

  const wrapper = splash.querySelector(".ascii-wrapper");
  if (wrapper) wrapper.scrollLeft = 0;

  if (reduced) {
    messages.forEach(m => { addLine(m, false).textContent = m; });
    addLine(finalMessage, true).textContent = finalMessage;
    later(endSplash, T.REDUCED_HOLD_MS);
    return;
  }

  let idx = 0;
  const next = () => {
    if (idx < messages.length) typeLine(messages[idx++], false, next);
    else if (idx++ === messages.length) typeLine(finalMessage, true, endSplash);
  };
  next();
  later(endSplash, safetyMs); // safety net, computed above
})();
