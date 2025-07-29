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
  <p>This is a central hub for showcasing security research, hardware reversing, and all investigations conducted with vendor cooperation and public interest in mind. Transparency and ethical disclosure are paramount. This site is maintained by a security professional working across physical and cyber domains.</p>
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
