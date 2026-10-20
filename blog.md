---
layout: default
title: Blog
permalink: /blog/
---


# 📓 Blog 📓


Research write-ups, tools, competition recaps, talks, and the occasional side project. Newest first.


<ul class="post-list">
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
      <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
    </li>
  {% endfor %}
</ul>
