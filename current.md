---
layout: default
title: Current Focus
permalink: /current/
---

# 🔬 Current Focus

---

## 🏷️ T2/T3 Lock System Deep Dive

This research project began with a deceptively simple question: What assumptions are being made about the security of the devices we physically trust every day?

The DL-Windows system, the CP210x bridge, and the embedded lock firmware all present a fascinating challenge: a blend of old-school protocol behavior, misunderstood trust boundaries, and under-scrutinized deployments.

We're emulating hardware, deconstructing USB conversations, and replicating interactions from scratch using custom tools. Why? Because real-world lock infrastructure shouldn't be a black box.

Full write-ups are being released now. Proof of concept video below.

<iframe width="560" height="315" src="https://www.youtube.com/embed/tD7BfMAFk9E" title="YouTube video player" frameborder="0" allowfullscreen></iframe>

{% for post in site.categories.t2t3 %}
### [{{ post.title }}]({{ post.url | relative_url }})
*{{ post.date | date: "%B %d, %Y" }}*  
{{ post.excerpt }}
{% endfor %}

---

## 🏷️ AudioHax (Preview)

The next chapter dives into audio-based data encoding and covert channel research.  
We’re building a modem-like system that hides structured payloads inside audio signals—bridging DSP, stego, and exploitation techniques.  

First posts coming soon…
