---
# Processed by Jekyll so the `history` egg lists every post (site.posts).
# Avoid Liquid-looking braces anywhere in the JavaScript below.
---
// eggs.js: small easter eggs. Loaded with `defer`; nothing here is needed to
// read the site, and with JS off none of it exists.
//
// Shared rules:
// - One status line (role="status", aria-live="polite"), bottom-left. It never
//   takes focus, stays at least 10 s, and closes on Esc, its x button, or a
//   click on its text.
// - Typed triggers use a rolling buffer of the last 12 keys. Keys typed in
//   inputs, textareas, selects or contenteditable are ignored, as are Ctrl,
//   Alt and Meta combos. preventDefault is never called.
// - No network, no clipboard, no tracking. Storage is used only by the theme
//   toggle, always inside try/catch.
// - Sound plays only after a click on the visible play button.
//
// Eggs here: console greeting + qweary.help(), `2+2`, `history`, `audiohax`
// (and a long-press on a post banner), qweary.decode() for the footer's
// zero-width message, the 404 stream name, and the July 23 uptime line.
// The phosphor modes live in theme-toggle.js, the 13:37 line in splash.js.
(function () {
  "use strict";

  var HISTORY = [
    {%- assign oldest_first = site.posts | reverse -%}
    {%- for post in oldest_first -%}
    {%- assign default_cmd = "less " | append: post.slug | append: ".md" -%}
    {%- assign cmd = site.data.history[post.slug] | default: default_cmd %}
    { "c": {{ cmd | jsonify }}, "u": {{ post.url | relative_url | jsonify }}, "t": {{ post.title | strip | jsonify }} }{% unless forloop.last %},{% endunless %}
    {%- endfor %}
  ];

  // ---------- status line ----------
  var toast = null, region = null, closeTimer = null, onClose = null;

  function buildToast() {
    if (toast) return;
    toast = document.createElement("div");
    toast.className = "egg-toast";
    toast.hidden = true;
    region = document.createElement("div");
    region.className = "egg-msg";
    region.setAttribute("role", "status");
    region.setAttribute("aria-live", "polite");
    var x = document.createElement("button");
    x.type = "button";
    x.className = "egg-close";
    x.setAttribute("aria-label", "Dismiss");
    x.textContent = "x";
    x.addEventListener("click", closeToast);
    toast.appendChild(region);
    toast.appendChild(x);
    toast.addEventListener("click", function (e) {
      if (e.target.closest("a, button")) return;
      closeToast();
    });
    // Never auto-close while the reader is pointing at or inside it.
    toast.addEventListener("mouseenter", function () { clearTimeout(closeTimer); });
    toast.addEventListener("focusin", function () { clearTimeout(closeTimer); });
    document.body.appendChild(toast);
  }

  function closeToast() {
    if (!toast || toast.hidden) return;
    clearTimeout(closeTimer);
    if (onClose) { var f = onClose; onClose = null; f(); }
    toast.hidden = true;
    region.textContent = "";
  }

  // show(nodeOrText, sticky): sticky panels (with links or buttons) stay
  // until dismissed; plain messages close after 12 s.
  function show(content, sticky) {
    buildToast();
    if (onClose) { var f = onClose; onClose = null; f(); }
    clearTimeout(closeTimer);
    toast.hidden = false;
    region.textContent = "";
    // Fill on the next tick so the live region is already rendered and the
    // new text is announced.
    setTimeout(function () {
      region.textContent = "";
      if (typeof content === "string") {
        content.split("\n").forEach(function (line) {
          var p = document.createElement("p");
          p.textContent = line;
          region.appendChild(p);
        });
      } else {
        region.appendChild(content);
      }
    }, 30);
    if (!sticky) closeTimer = setTimeout(closeToast, 12000);
  }

  document.addEventListener("qweary:toast", function (e) {
    if (e.detail && e.detail.text) show(e.detail.text);
  });

  // ---------- 2+2 ----------
  function twoPlusTwo() { show("4\noutputTokens: 1"); }

  // ---------- history ----------
  function historyPanel() {
    var wrap = document.createElement("div");
    wrap.className = "egg-history";
    var ol = document.createElement("ol");
    HISTORY.forEach(function (h, i) {
      var li = document.createElement("li");
      var n = document.createElement("span");
      n.className = "egg-n";
      n.setAttribute("aria-hidden", "true");
      n.textContent = String(i + 1).padStart(4, " ") + "  ";
      var a = document.createElement("a");
      a.href = h.u;
      a.textContent = h.c;
      var t = document.createElement("span");
      t.className = "visually-hidden";
      t.textContent = " (post: " + h.t + ")";
      a.appendChild(t);
      li.appendChild(n);
      li.appendChild(a);
      ol.appendChild(li);
    });
    var last = document.createElement("li");
    var n2 = document.createElement("span");
    n2.className = "egg-n";
    n2.setAttribute("aria-hidden", "true");
    n2.textContent = String(HISTORY.length + 1).padStart(4, " ") + "  ";
    last.appendChild(n2);
    last.appendChild(document.createTextNode("history -c"));
    ol.appendChild(last);
    var p = document.createElement("p");
    p.textContent = "cleared. (lesson from the \"$\" account: erase your history.)";
    wrap.appendChild(ol);
    wrap.appendChild(p);
    return wrap;
  }

  function showHistory() { show(historyPanel(), true); }

  // ---------- audiohax: the logo as a melody ----------
  var LOGO = [
    "██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗",
    "██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝",
    "██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝",
    "██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝",
    "╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║",
    " ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝"
  ];

  // Column -> note: the highest full block in a column sets the pitch (top row
  // = highest), a column with no full block is a rest. Repeats are merged into
  // held notes. F minor pentatonic around a trombone's middle register.
  function score() {
    var ROW_SEMI = [15, 12, 10, 7, 5, 3];
    var cols = Math.max.apply(null, LOGO.map(function (r) { return r.length; }));
    var notes = [];
    for (var c = 0; c < cols; c++) {
      var pitch = null;
      for (var r = 0; r < LOGO.length; r++) {
        if (LOGO[r].charAt(c) === "█") { pitch = ROW_SEMI[r]; break; }
      }
      var prev = notes[notes.length - 1];
      if (prev && prev.p === pitch) prev.len++;
      else notes.push({ p: pitch, len: 1 });
    }
    return { notes: notes, cols: cols };
  }

  var audio = null; // { ctx, timer }

  function stopAudio() {
    if (!audio) return;
    clearTimeout(audio.timer);
    try { audio.ctx.close(); } catch (e) {}
    audio = null;
  }

  function play(btn) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) { btn.textContent = "no WebAudio here"; btn.disabled = true; return; }
    var ctx = new AC();
    var s = score();
    var STEP = 6 / s.cols;          // about 6 s for the whole logo
    var BASE = 174.61;              // F3
    var t0 = ctx.currentTime + 0.08;

    var master = ctx.createGain();
    master.gain.value = 0.12;       // low gain
    master.connect(ctx.destination);

    var amp = ctx.createGain();
    amp.gain.setValueAtTime(0, ctx.currentTime);
    var lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.Q.value = 2;
    lp.frequency.setValueAtTime(700, ctx.currentTime);
    var osc = ctx.createOscillator();
    osc.type = "sawtooth";
    var vib = ctx.createOscillator();
    var vibDepth = ctx.createGain();
    vib.frequency.value = 5;
    vibDepth.gain.value = 3;
    vib.connect(vibDepth);
    vibDepth.connect(osc.frequency);
    osc.connect(lp);
    lp.connect(amp);
    amp.connect(master);

    var t = t0, first = true;
    s.notes.forEach(function (n) {
      var dur = n.len * STEP;
      if (n.p === null) {
        amp.gain.setTargetAtTime(0, t, 0.02);
      } else {
        var f = BASE * Math.pow(2, n.p / 12);
        if (first) { osc.frequency.setValueAtTime(f, t); first = false; }
        else osc.frequency.setTargetAtTime(f, t, 0.045); // the slide
        amp.gain.setTargetAtTime(1, t, 0.015);
        lp.frequency.setTargetAtTime(1600, t, 0.02);     // brassy bite
        lp.frequency.setTargetAtTime(750, t + 0.06, 0.08);
      }
      t += dur;
    });
    amp.gain.setTargetAtTime(0, t, 0.05);
    osc.start(t0);
    vib.start(t0);
    osc.stop(t + 0.4);
    vib.stop(t + 0.4);

    audio = { ctx: ctx, timer: setTimeout(function () { stopAudio(); setIdle(btn); }, (t - ctx.currentTime + 0.5) * 1000) };
    btn.textContent = "■ stop";
    btn.setAttribute("aria-label", "Stop the QWEARY melody");
  }

  function setIdle(btn) {
    btn.textContent = "▶ play QWEARY";
    btn.removeAttribute("aria-label");
  }

  function showAudiohax() {
    var wrap = document.createElement("div");
    var p = document.createElement("p");
    p.textContent = "audiohax: the logo, read as a score. Sound, about 6 s.";
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "egg-play";
    setIdle(btn);
    btn.addEventListener("click", function () {
      if (audio) { stopAudio(); setIdle(btn); }
      else play(btn);
    });
    wrap.appendChild(p);
    wrap.appendChild(btn);
    show(wrap, true);
    onClose = stopAudio;
  }

  // Long-press (600 ms) on a post's ASCII banner.
  (function () {
    var banner = document.querySelector(".ascii-banner");
    if (!banner) return;
    var timer = null, x0 = 0, y0 = 0;
    var cancel = function () { clearTimeout(timer); timer = null; };
    banner.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      x0 = e.clientX; y0 = e.clientY;
      cancel();
      timer = setTimeout(function () { timer = null; showAudiohax(); }, 600);
    });
    banner.addEventListener("pointermove", function (e) {
      if (timer && Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 10) cancel();
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) { banner.addEventListener(ev, cancel); });
  })();

  // ---------- typed triggers ----------
  var buf = "";
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeToast(); return; }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    var t = e.target;
    if (t && (t.isContentEditable || (t.closest && t.closest("input, textarea, select, [contenteditable]")))) return;
    if (!e.key || e.key.length !== 1) return;
    buf = (buf + e.key.toLowerCase()).slice(-12);
    if (/2\+2$/.test(buf)) { buf = ""; twoPlusTwo(); }
    else if (/history$/.test(buf)) { buf = ""; showHistory(); }
    else if (/audiohax$/.test(buf)) { buf = ""; showAudiohax(); }
  });

  // ---------- footer zero-width message ----------
  function decode() {
    var el = document.querySelector("footer .zw");
    if (!el) return "";
    return el.textContent.split("‍").map(function (g) {
      var bits = g.replace(/​/g, "0").replace(/‌/g, "1");
      return bits ? String.fromCharCode(parseInt(bits, 2)) : "";
    }).join("");
  }

  // ---------- 404: name the missing stream ----------
  (function () {
    var slots = document.querySelectorAll("[data-requested-name]");
    if (!slots.length) return;
    var parts = location.pathname.split("/").filter(Boolean);
    var name = "this-page";
    try { name = decodeURIComponent(parts[parts.length - 1] || name); } catch (e) {}
    name = name.replace(/[\u0000-\u001f\u007f]/g, "");
    if (name.length > 40) name = name.slice(0, 39) + "~";
    var dir = parts.slice(0, -1).join("\\");
    Array.prototype.forEach.call(slots, function (s) { s.textContent = name; });
    if (dir) {
      var shown = "\\" + (dir.length > 40 ? dir.slice(0, 39) + "~" : dir);
      Array.prototype.forEach.call(document.querySelectorAll("[data-requested-dir]"), function (d) { d.textContent = shown; });
    }
  })();

  // ---------- July 23: uptime ----------
  (function () {
    var now = new Date();
    if (now.getMonth() !== 6 || now.getDate() !== 23) return;
    var copy = document.querySelector("footer .footer-copy");
    if (!copy) return;
    var n = now.getFullYear() - 2025; // first post: 2025-07-23
    var p = document.createElement("p");
    p.className = "uptime";
    p.textContent = n > 0 ? "uptime: " + n + (n === 1 ? " year" : " years") : "uptime: first boot";
    copy.parentNode.insertBefore(p, copy.nextSibling);
  })();

  // ---------- console ----------
  var PHOSPHOR = { green: "p1", p1: "p1", amber: "p3", p3: "p3", aurora: "dark", dark: "dark", light: "light" };
  window.qweary = {
    help: function () {
      console.log([
        "qweary.phosphor('green' | 'amber' | 'aurora')   swap the screen phosphor",
        "qweary.history()                                  what I have been running",
        "qweary.decode()                                   read the footer's nameless stream",
        "qweary.audiohax()                                 the logo, as a tune (you press play)",
        "",
        "elsewhere: type 2+2 on any page. click the theme toggle like you mean it. print a post."
      ].join("\n"));
    },
    phosphor: function (mode) {
      var t = PHOSPHOR[String(mode || "green").toLowerCase()];
      if (!t) { console.log("phosphor: try 'green', 'amber' or 'aurora'"); return; }
      document.dispatchEvent(new CustomEvent("qweary:theme", { detail: t }));
      console.log(t === "p1" ? "P1. 1949 called." : t === "p3" ? "P3. warm." : "back to Aurora.");
    },
    history: function () {
      HISTORY.forEach(function (h, i) { console.log(String(i + 1).padStart(4, " ") + "  " + h.c + "    " + location.origin + h.u); });
      console.log(String(HISTORY.length + 1).padStart(4, " ") + "  history -c");
      showHistory();
    },
    decode: function () {
      var m = decode();
      console.log(m ? "stream: " + m : "no stream on this page.");
      return m;
    },
    audiohax: function () { showAudiohax(); console.log("the play button is bottom-left."); }
  };

  try {
    console.log("%c QWEARY ", "font: 700 22px 'Fira Code', monospace; color: #0b0a10; background: linear-gradient(90deg, #5ee9ff, #c3a6ff); padding: 4px 14px; border-radius: 3px;");
    console.log("%c> you opened devtools. of course you did. try qweary.help()", "color: #c3a6ff; font-family: 'Fira Code', monospace;");
  } catch (e) {}
})();
