---
layout: default
title: Backburner
permalink: /backburner/
---

# 🔥 Backburner 🔥

_No research is ever complete._

This section is dedicated to projects that have reached a satisfying checkpoint—enough to share insights and methods, but always open to deeper understanding or creative reinterpretation.

Some topics may feel “done for now,” but that’s just the nature of evolving systems. If something here inspires you to pick it up, remix it, or push it further: please do! Whether it’s a deep dive or a side quest, I’d love to hear about what it sparks in your own research.

Stay curious.

---

## 🏷️ T2/T3 Lock System Deep Dive

A multi-part exploration of embedded locks, USB bridges, and firmware injection.  
This research series closed with a working proof-of-concept for persistent physical access, but it’s far from the last word.

{% for post in site.categories.t2t3 %}
### [{{ post.title }}]({{ post.url | relative_url }})
*{{ post.date | date: "%B %d, %Y" }}*  
{{ post.excerpt }}
{% endfor %}
