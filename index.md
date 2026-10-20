---
layout: default
title: Home
---


<div class="hero">
  <h1>🌌 Research with Purpose 🌌</h1>
  <p class="tagline">Locks, red teams, and the AI agents in between.</p>
</div>


<section class="section">
  <h2>Welcome</h2>
  <p>Welcome to a space for breaking things, responsibly. This site documents independent research across physical and digital systems: lock mechanisms, embedded firmware, red team tooling, and the multi-agent AI systems I build, break, and check. All investigations here are guided by ethics, transparency, and the belief that curiosity, when paired with consent, can make systems safer for everyone.</p>
  <p>Everything gets written up. That includes the parts that didn't work.</p>
  <p>Start with <a href="/current/">what I'm focused on</a>, or <a href="/projects/">every project and where it stands</a>.</p>
</section>


<section class="section">
  <h2>Recent Blog Posts</h2>
  <ul class="post-list">
    {% for post in site.posts limit:3 %}
      <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span></li>
    {% endfor %}
  </ul>
  <p><a href="/blog/">See all posts →</a></p>
</section>
