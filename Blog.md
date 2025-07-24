---
layout: default
title: Blog
permalink: /blog/
---


# Blog


A chronological log of research findings, technical write-ups, and experiments.


<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      <span class="post-date">{{ post.date | date: "%B %d, %Y" }}</span>
    </li>
  {% endfor %}
</ul>