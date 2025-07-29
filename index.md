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
  <p>This site is a home for independent security research, hardware hacking, and systems analysis — all conducted with vendor cooperation and in the public interest. Whether it’s cracking a lock, probing firmware, or analyzing signal paths, the focus is always on ethical disclosure, transparency, and impact.</p>
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
