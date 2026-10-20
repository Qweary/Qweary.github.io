// staleness.js: quietly flag season-bound copy once it may be out of date.
//
// HOW TO USE (in any page or post):
//
//   <div data-expires="2027-03-01" markdown="1">
//   {% include as-of.html date="2026-10-19" %}
//
//   Copy that is true only for a season (current focus, upcoming talks...).
//   </div>
//
// - data-expires="YYYY-MM-DD": the first day the block should be treated as
//   possibly stale. After that date (in the reader's local time) this script
//   adds class "is-stale" and inserts a muted "this may be out of date" note
//   at the top of the block. Nothing is hidden.
// - as-of.html prints a visible "As of <date>" stamp. It is plain HTML, so it
//   shows with or without JS. Optional: data-as-of="YYYY-MM-DD" on the block
//   instead, to have the note mention the date.
// - markdown="1" lets kramdown render Markdown inside the HTML block.
// - With JS off the block simply shows, as written.
// - Local builds also warn about expired blocks (_plugins/stale_check.rb).
//   GitHub Pages ignores _plugins and builds only on push, so that warning
//   appears only when building locally; this script is what readers see.
(function () {
  const blocks = document.querySelectorAll("[data-expires]");
  if (!blocks.length) return;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  blocks.forEach((el) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((el.getAttribute("data-expires") || "").trim());
    if (!m) return;
    const expires = new Date(+m[1], +m[2] - 1, +m[3]);
    if (today < expires || el.classList.contains("is-stale")) return;

    el.classList.add("is-stale");
    // A visible as-of stamp already gives the date, so the note does not repeat it.
    const hasStamp = !!el.querySelector(".as-of");
    const asOf = el.getAttribute("data-as-of");
    const note = document.createElement("p");
    note.className = "stale-note";
    note.textContent = (asOf && !hasStamp)
      ? `Written as of ${asOf}; this may be out of date.`
      : "This may be out of date.";
    el.insertBefore(note, el.firstChild);
  });
})();
