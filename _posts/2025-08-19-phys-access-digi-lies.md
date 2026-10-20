---
layout: post
title: "📚 Physical Access, Digital Lies: Full-Stack Lock Exploitation — Phrack Submission 📚"
date: 2025-08-19
author: Qweary
categories: [research, phrack, access control, t2t3, backburner]
tags: [hardware hacking, embedded, reverse engineering, physical security, t2t3, CP2102, MSP430, phrack, NAND, USB, audit]
permalink: /phys-access-digi-lies.html
---

> “The firmware can lie. The audit trail can lie. The cable can lie.
> Even the credentials can be faked. What’s left is the attacker’s imagination.”

---

## 📌 TL;DR

This post contains the full-text of my Phrack-style research submission:  
**"Physical Access, Digital Lies: Exploiting Trust Across the Access Control Stack."**

It’s a consolidated, high-impact retelling of the T2/T3 lock research — covering everything from NAND flash manipulation to firmware patching and USB cable spoofing — with an eye toward both technical rigor and narrative clarity.

It wasn't selected for publication — and I fully understand why. But I believe the piece has value, especially for readers interested in how embedded trust can be broken across layers, and how a real-world lock system can fail in every phase of its lifecycle.

---

## 🧭 Background

Phrack has long been one of the most respected spaces in the infosec underground.  
When I realized how deep this T2/T3 research had taken me — from circuit probing to firmware patching to spoofing USB trust boundaries — it felt like a story that could live there.

I spent weeks adapting my raw notes and blog content into something that fit their tone, formatting, and ethos. It was a challenging process. Writing clearly for an advanced audience while keeping a Phrack-worthy tone is no small task.

The submission wasn’t selected for the current issue, and that’s fair — the bar is high, my content is long, and I’m still growing.
But I’m proud of what it represents, and I want it to be accessible to others who might be walking a similar road.

---

## 🧠 Why This Writeup Matters

This piece is more than just a summary — it’s the complete lifecycle of an attack chain:

- **Physical Exploitation** (pin probing, voltage trickery, freeze attacks)  
- **Memory Reversing** (NAND flash decoding, dumped credential recovery)  
- **Firmware Injection** (TI assembly, persistent backdoor codes)  
- **Audit Spoofing** (USB emulation of CP2102 cable, forged log access)

Each stage shows a different facet of trust breakdown — not just in hardware, but in the assumptions systems make about where authority lies.  
It also reflects my personal growth — learning raw assembly, USB descriptors, and custom hardware interfacing to make this happen.

For those just getting into hardware security: this is proof that persistence, not pedigree, is what gets you over the wall.

---

## 📜 The Submission

<details>
<summary><strong>Click to expand Phrack submission (full .txt format)</strong></summary>

<pre><code>
{% include backups/PhysAccessDigiLies_PhrackSub.txt %}
</code></pre>

</details>

**📎 [View Raw Submission on GitHub →](https://github.com/Qweary/T2-T3-Lock-Exploitation-Research/blob/main/PhysAccessDigiLies_PhrackSubPiano.txt)**

---

## 🧳 Final Thoughts

This post brings closure (for now) to a long, wild arc of research — one that began with a physical lock and ended with a fake cable impersonating its programmer.

It’s a reminder that trust in embedded systems is often misplaced, especially when that trust crosses physical and digital boundaries.  
If anything here sparks curiosity, raises concern, or makes you want to explore this space further — then the time spent writing was worth it.

And if you’re a developer, vendor, or policymaker reading this:  
**Please take cyber and physical vulnerabilities as opportunities for improvement.**

---

## 🔗 Resources

- 🔓 [The Trilogy Research Series](https://qweary.github.io/backburner)
- 💾 [GitHub Repository (Code + PoC)](https://github.com/Qweary/T2-T3-Lock-Exploitation-Research)
- 📬 [Contact](https://qweary.github.io/contact)
- 🎝️ [About Me](https://qweary.github.io/about)



