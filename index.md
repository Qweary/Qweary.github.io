---
layout: default
title: Home
---


<div class="hero">
  <h1>🌌 Research with Purpose 🌌</h1>
  <p class="tagline">Reverse engineering, security research, and transparency advocacy.</p>
</div>


<section class="section">
  <h2>Welcome</h2>
  <p><p>Welcome to a space for breaking things — responsibly. This site documents independent research across physical and digital systems: lock mechanisms, embedded protocols, misbehaving firmware, and whatever else invites a closer look. All investigations here are guided by ethics, transparency, and the belief that curiosity, when paired with consent, can make systems safer for everyone.</p>
</p>
</section>


<section class="section">
  <h2>Recent Blog Posts</h2>
  <ul>
    {% for post in site.posts limit:3 %}
      <li><a href="{{ post.url }}">{{ post.title }}</a> - <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span></li>
    {% endfor %}
  </ul>
  <p><a href="/blog">See all posts →</a></p>
</section>
