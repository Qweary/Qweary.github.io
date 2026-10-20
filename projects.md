---
layout: default
title: Projects
permalink: /projects/
---

# 🧰 Projects 🧰

Every project on this blog, and where it stands. Three statuses:

- **Active:** I'm working on it.
- **Winding down:** close to done, with a few improvements left.
- **Checkpointed:** reached a point worth sharing, and parked there for now.

What I'm working on most is on the [Focus](/current/) page.

---

## Active

### 🎙️ AudioHax <small>(Active)</small>

Images to music to MIDI and audio, plus a modem that sends files as tones. Rebuilt in Rust from a fifteen-year-old student project.

{% for post in site.categories.audiohax -%}
- [{{ post.title }}]({{ post.url | relative_url }}) <small>({{ post.date | date: "%b %-d, %Y" }})</small>
{% endfor %}
- Repository: [AudioHax on GitHub](https://github.com/Qweary/AudioHax)

### 🧮 Local model research <small>(Active)</small>

Running the security work hosted models halt on models I host myself, over an SSH tunnel to a second machine with an 8 GB card. Version 1 is a proof of concept. Version 2 is an automated pipeline.

- [🧮🚧 What Is 2 + 2? 🚧🧮](/what-is-two-plus-two.html) <small>(Oct 19, 2026)</small>
- Repository: [CVP-Research on GitHub](https://github.com/Qweary/CVP-Research)

### 🐝 Swarnam <small>(Active)</small>

A multi-agent red team swarm: eight agents, one tactical coordinator, and shared markdown files instead of agent-to-agent chatter. Built in three weeks for CCDC.

<div class="season-note" data-expires="2027-05-01" data-as-of="the 2026-27 CCDC season" markdown="1">
_As of the 2026-27 CCDC season:_ back on the pre-competition checklist, in support of this season's red team work.
</div>

{% for post in site.categories.swarnam -%}
- [{{ post.title }}]({{ post.url | relative_url }}) <small>({{ post.date | date: "%b %-d, %Y" }})</small>
{% endfor %}
- Repository: [Swarnam on GitHub](https://github.com/Qweary/Swarnam)

---

## Winding down

### 🍽️ weekly-feast <small>(Winding down)</small>

The meal planner I built for my spouse. A single HTML file: double-click it and that's the whole install. My household plans with it every week, and so does at least one person outside our house. It's at a closing point, with a couple of improvements left. After that it goes to return path only, where a bug a user finds reopens the lane and nothing else does.

- [🍽️🧊 weekly-feast: The Fix That Was Wired to Nothing 🧊🍽️](/weekly-feast-the-fix-that-was-wired-to-nothing.html) <small>(Oct 11, 2026)</small>
- [🍽️ weekly-feast: When Your Spouse Breaks Your Threat Model 🍽️](/weekly-feast.html) <small>(Mar 10, 2026)</small>
- Repository: [weekly-feast on GitHub](https://github.com/Qweary/weekly-feast)

---

## Checkpointed

_No research is ever complete._

These projects reached a satisfying checkpoint: enough to share the insights and the methods, and always open to a deeper look or a creative reinterpretation.

Some of these feel done for now. That's just how evolving systems work. If something here inspires you to pick it up, remix it, or push it further, please do. Deep dive or side quest, I'd love to hear what it sparks in your own research.

Stay curious.

### 🏷️ T2/T3 Lock System Deep Dive <small>(Checkpointed)</small>

A multi-part exploration of embedded locks, USB bridges, and firmware injection. The series closed with a working proof of concept for persistent physical access. It was far from the last word. In 2026 it went to the ToorCamp main stage, and into a workshop where people clipped a programmer onto a real lock's flash chip, wrote their own code in, and watched the lock open. More on that on the [Talks](/talks/) page.

📺 Proof of concept video:  
<iframe width="560" height="315" src="https://www.youtube.com/embed/tD7BfMAFk9E" title="Injected Firmware Demonstration: Ghost Code Survives Factory Reset" frameborder="0" allowfullscreen></iframe>

{% for post in site.categories.t2t3 -%}
- [{{ post.title }}]({{ post.url | relative_url }}) <small>({{ post.date | date: "%b %-d, %Y" }})</small>
{% endfor %}
- Raw research notes: [T2-T3-Lock-Exploitation-Research on GitHub](https://github.com/Qweary/T2-T3-Lock-Exploitation-Research)

### 👻 Apparition Delivery System <small>(Checkpointed)</small>

A Windows research framework, and my first red team tool. It made it to the WRCCDC red team showcase, and every post carries detection guidance for the blue team. The public library still needs testing and expanding.

📺 Showcase demo: [WRCCDC ADS Showcase](https://youtu.be/fQkIS3oAhM4)

{% for post in site.categories.apparition -%}
- [{{ post.title }}]({{ post.url | relative_url }}) <small>({{ post.date | date: "%b %-d, %Y" }})</small>
{% endfor %}
- Repository: [Apparition-Delivery-System on GitHub](https://github.com/Qweary/Apparition-Delivery-System)
