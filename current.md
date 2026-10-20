---
layout: default
title: Focus
permalink: /current/
---

# 🔬 Focus 🔬

<div class="review-stamp" data-expires="2027-01-31" data-as-of="October 2026" markdown="1">
{% include as-of.html date="2026-10" text="Last reviewed October 2026." %}
</div>

What I'm actively working on. Each section links the posts behind it. For everything else, and where it stands, see [Projects](/projects/).

---

## 🎙️ AudioHax: Image to Music to Data

### **Focus:** a student project from fifteen years ago, rebuilt in Rust, and back on the bench.

AudioHax analyzes an image, maps what it sees to music theory, and renders it as MIDI and audio. It also carries a data modem that sends files as tones and recovers them on the other end. These days it's built with a team of agents, and it's a domain with no score. The ear decides.

### Posts so far:
{% for post in site.categories.audiohax -%}
- [{{ post.title }}]({{ post.url | relative_url }}) <small>({{ post.date | date: "%b %-d, %Y" }})</small>
{% endfor %}
- Repository: [AudioHax on GitHub](https://github.com/Qweary/AudioHax)

---

## 🧮 Local Models for the Work Hosted Models Stop

### **Focus:** running the security work that hosted models halt, on models I host myself.

My agent framework stopped running on some of the newest Claude models inside its own folder. The question that got stopped was "what is 2 + 2?" So the framework now has a second machine, built from donated parts, with an 8 GB graphics card and its own segregated network.

### **Where It Stands:**
- Version 1 is a proof of concept. Work goes to a local model over an SSH tunnel, the answer comes back to me, and I run anything it proposes by hand.
- The first acceptance battery sent 104 probes to seven local models in the 7 to 9 billion parameter class. Two passed.
- The route has no fallback. If the second machine doesn't answer, the request fails.

### **Next:** an automated pipeline, where the local model's output goes back into the work with no human copy step. That gets its own post.

### Posts so far:
- [🧮🚧 What Is 2 + 2? 🚧🧮](/what-is-two-plus-two.html) <small>(Oct 19, 2026)</small>
- Evidence, open questions, and the corrections file: [CVP-Research on GitHub](https://github.com/Qweary/CVP-Research)

---

## 🎯 Controls That Fire, and Controls That Are Aimed

### **Focus:** what you have to build around a language that compiles differently every time.

Generative AI behaves like a programming language that recompiles itself on every run. The real work is the checks around it, and whether those checks are looking at the thing they're named after. A control that fires because something executes is a mechanism. A control that fires because somebody chose to run it is a practice. Agreement is not verification.

This is the thread behind both of my Houston talks, a five-question card you can run against your own controls, and most of the fixes in weekly-feast. The swarm generation framework underneath all of it remains unpublished.

### Posts so far:
- [🎯📋 A Language That Compiles Differently Every Time 📋🎯](/a-language-that-compiles-differently-every-time.html) <small>(Sep 29, 2026)</small>
- [🐝⚔️ Swarms That Fight and Fix Each Other in a Cage ⚔️🐝](/swarms-that-fight-and-fix-each-other-in-a-cage.html) <small>(Sep 29, 2026)</small>
- [🍽️🧊 weekly-feast: The Fix That Was Wired to Nothing 🧊🍽️](/weekly-feast-the-fix-that-was-wired-to-nothing.html) <small>(Oct 11, 2026)</small>
- Slides, speaker notes, and demos: [ai-village-2026 on GitHub](https://github.com/Qweary/ai-village-2026)

---

## 🐝 Swarnam and CCDC Support

<div class="season-note" data-expires="2027-05-01" data-as-of="the 2026-27 CCDC season" markdown="1">
{% include as-of.html date="2026-10" text="As of the 2026-27 CCDC season." %}

### **Focus:** getting Swarnam, the multi-agent red team swarm I built for CCDC, ready for another season.

Last season Swarnam went from nothing to the WRCCDC regional finals in three weeks, then to NCCDC nationals on five days' notice, through one SSH shell. This season started the way the last one ended: brushing the cobwebs off it before the first invitational, and working through what the hosted models will and won't run now. That second part is what sent me down the local-model road above.
</div>

### Posts so far:
{% for post in site.categories.swarnam -%}
- [{{ post.title }}]({{ post.url | relative_url }}) <small>({{ post.date | date: "%b %-d, %Y" }})</small>
{% endfor %}
- Repository: [Swarnam on GitHub](https://github.com/Qweary/Swarnam)

---
