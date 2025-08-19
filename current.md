---
layout: default
title: Current Focus
permalink: /current/
---

# 🔬 Current Focus 🔬

This section highlights the research I’m actively working on.  
It will grow as new posts are released, giving a rolling log of progress, challenges, and breakthroughs.  

---

## 🔑 T2/T3 Lock System Deep Dive  

This project began with a deceptively simple question:  

> What assumptions are being made about the security of the devices we physically trust every day?  

The DL-Windows system, the CP210x USB bridge, and the embedded lock firmware all presented a fascinating challenge: a blend of old-school protocol behavior, misunderstood trust boundaries, and under-scrutinized deployments.  

The research has produced multiple blog posts, culminating in a working firmware injection PoC and system reset bypass.  

### Posts so far:
{% for post in site.categories.research %}
- [{{ post.title }}]({{ post.url | relative_url }}) <small>({{ post.date | date: "%b %d, %Y" }})</small>
{% endfor %}

📺 Proof of concept video:  
<iframe width="560" height="315" src="https://www.youtube.com/embed/tD7BfMAFk9E" title="YouTube video player" frameborder="0" allowfullscreen></iframe>

---

## 🎙️ AudioHax: Image → Music → Data  

Fifteen years ago, *Acoustic Art* was a student project with the audacious goal of translating images into music. Today, it has evolved into **AudioHax** — a fusion of art, theory, and security research.  

The new vision:  
- Use computer vision to analyze images (or live video).  
- Map features into structured music.  
- Encode and transmit data over audio channels.  

This is both an artistic installation project *and* an exploration of covert communication channels.  

### Posts so far:
- [🎙️ AudioHax: Reviving a 15-Year-Old Dream 🎙️](/audiohax-intro.html) <small>(Aug 26, 2025)</small>  
- [📡 AudioHax: Building a Robust MFSK Audio Modem in Rust 📡](/audiohax-mfsk.html) <small>(Sep 2, 2025)</small>  

---
