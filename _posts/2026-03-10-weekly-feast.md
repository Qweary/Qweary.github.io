---


layout: post
title: "🍽️ weekly-feast: When Your Spouse Breaks Your Threat Model 🍽️"
date: 2026-03-10
author: Qweary
categories: [side project, meal planning, claude, prompt engineering]
tags: [side project, meal planning, claude, prompt engineering]
permalink: /weekly-feast.html

---


<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>


---


# 🍽️ weekly-feast: When Your Spouse Breaks Your Threat Model 🍽️

March 10, 2026 — side project, meal planning, claude, prompt engineering

---

I was in the middle of testing Swarnam — my multi-agent red team swarm system — when my spouse walked into the room and said something that completely derailed my evening:

"I'm so tired of looking through all these grocery ads trying to figure out what to cook."

Now, I've spent the last year building tools that hide payloads in NTFS Alternate Data Streams, bypassing Windows Defender, and hacking locks. I know a solvable problem when I see one. My immediate thought was: Claude can do this. You give it a well-engineered prompt with your pantry state and dietary needs, it searches the current weekly ads, cross-references sale items against scratch-cooking recipes, and hands back a meal plan with a shopping list organized by store.

I explained the prompt idea to my spouse.

"What do I type?"

Fair question.

---

## 🎯 The Real Design Challenge

I quickly realized that generating one prompt is reasonable, but building one every week would kind of suck. To make a good prompt to achieve the objective, there are a lot of variables to include. Pantry state, dietary restrictions, preferred stores, household size, recipe source preferences, how many meals per day, whether you have a sourdough starter going. Every week, you'd need to re-audit your kitchen and reconstruct the whole thing from scratch. Even re-using a prompt would require time-consuming edits.

"What do I type?" was more of a question about how to make this workflow sustainable. The answer couldn't be "here's a template, just fill in the blanks." It had to be a system where the hardest step was clicking a button and pasting the result.

---

## 🧠 Designing with Claude, for Claude

Here's where it gets interesting from a technical standpoint. Instead of trying to build the whole thing in one pass, I used Claude itself as a design team similar to my multi-agent swarms; separate conversations with different expert roles, each one reviewing the previous expert's work.

A meal planning domain expert defined the pantry model, search strategy, and recipe matching logic. A UX consultant reviewed the interaction design and data model, acting as coordinator across all the roles. A prompt engineer optimized the Claude prompt template for search reliability, tool call budgeting, and structured JSON output. A frontend developer built and iterated the app through several rounds of testing.

Each expert raised issues the previous one hadn't considered. The UX consultant caught that the domain expert's pantry model was too granular for weekly use. The prompt engineer identified that the domain expert's search strategy would blow through Claude's web search budget before hitting the recipe sites. The frontend developer pointed out that the UX consultant's import flow assumed users would know what JSON looks like.

It's a small-scale version of something I've been thinking about a lot with multi-agent systems: you get better results when you let specialized perspectives challenge each other's assumptions than when you try to hold all the context in one pass. A lot like real life. I try to approach it from a business architect perspective.

---

## 🛠️ What It Actually Does

weekly-feast is a single HTML file. You double-click it, it opens in your browser, and that's the entire install process. No React, no Node, no server, no accounts, no internet connection required for the app itself. Data lives in localStorage.

The core loop works like this. You maintain your pantry state through a three-tier inventory system: shelf-stable staples tracked by status (well-stocked, getting-low, out), weekly perishables with a have/don't-have toggle, and bulk items with approximate quantity tracking. A weekly review flow walks you through updating everything in about two minutes. Then you hit "Generate Prompt," copy the output, paste it into Claude, and Claude does the research. It searches current grocery ads, finding matching recipes from scratch-cooking sites, sequencing meals by perishability, and returning structured JSON. You paste Claude's response back into the app, and the dashboard shows your meal plan and a checkable shopping list organized by store.

The prompt template is where most of the engineering lives. It includes a tool call budget (15–20 total web searches, because Claude's search capacity isn't infinite), a three-tier search hierarchy for grocery ads (aggregator sites first, then store landing pages, then interactive circulars as a last resort), site-targeted recipe searches against preferred scratch-cooking sites, and perishability-based meal sequencing so you're eating the fresh produce early in the week and the freezer-friendly stuff later.

The shopping list can be exported as plain text for your phone. Because that's the actual question: how do I use this at the grocery store? The answer is "tap Export, paste into your notes app, go shopping."

---

## 🔍 Honest Assessment

This is a v1. It works, and my spouse is happy. The prompt template likely still needs tuning against real weekly ad cycles across multiple weeks. Some weeks Claude might find great deals and the plan is excellent. Some weeks the ad search might return thin results and the anchor recipe fallbacks kick in more than I'd like. The JSON output may have spotty reliability or require minor manual cleanup. Only way to find out is to use it.

The single-file approach is both a feature and a constraint. It means anyone can use it with zero setup, but it also means the UI is doing a lot of work inside one HTML document. It's not going to win any design awards. It does the job.

I'm also aware that "app that generates a prompt for a different app" is a slightly weird product category. But the alternative was building a backend with API keys and auth and hosting, and the whole point was that my spouse should be able to use this without asking me for help. Double-click a file, click a button, paste twice. That's the bar. Plus... security is hard, and maintenance is harder.

---

## 🔗 Links

- Repository: [https://github.com/Qweary/weekly-feast](https://github.com/Qweary/weekly-feast)

---

— qweary
