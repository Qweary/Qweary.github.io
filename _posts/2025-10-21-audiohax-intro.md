---

layout: post
title: "🎙️ AudioHax: Reviving a 15-Year-Old Dream 🎙️"
date: 2025-10-21
author: Qweary
categories: [project intro, audiohax, acoustic art]
tags: [audiohax, acoustic art, rust, image, music, midi, fluidsynth, opencv]
permalink: /audiohax-intro.html
description: "A project fifteen years in the making. AudioHax turns images into music, and this time I am the one writing the code."

---

---

Fifteen years ago, I wasn’t the one writing the code.  
I was the music guy, the consultant, the theory nerd, the one arguing about chord progressions while others hammered C++ into submission at 3 AM.  

The real engine was three friends:  

- **Vince** – the archivist and realist. It turns out he also held on to the files after all these years. One of the greatest friends one could ask for.  
- **Creede** – the thinker and planner. Just last week, he told me he still thinks about the project regularly. One of the kindest people you could hope to know.  
- **Kyle** – the legend. A “super-coder” who wrote undetectable viruses just to understand them, then deleted them for fun. I always hoped he found a job worthy of that kind of raw skill.  

Back then, we called it **Acoustic Art**. The idea:  

> Take an image → Break it into data → Translate that into music.  

It wasn’t just “assign colors to notes.” It was deeper: texture, shape, balance, rhythm. A blend of computer vision and music theory, with enough knobs to make each piece unique.  

I kept the code. For a decade and a half, it sat on my drives like a ghost. A project that wouldn’t leave me alone. I didn’t have the skills to resurrect it back then, but I told myself: *One day.*  

Now, one day has arrived.  
I dusted off the old code, rebuilt the vision in Rust, and reimagined what **Acoustic Art** could be with modern tools. When I told my friends I was resurrecting it, it was heartwarming to find out they’d been thinking about it too.  

---

## 🚀 The Present Day  

The project has a new name now: **AudioHax**. And for the first time in 15 years, it’s alive.  

Right now, I can:  

- Take an image  
- Run it through an analysis pipeline  
- Map its features to musical data  
- Output it as MIDI  
- Render it into audio  

I’ve captured a proof-of-concept video of this exact process, which I’ll be linking below.  

This isn’t the end goal — far from it — but it’s a massive milestone.  

---

## 🛠️ Currently Implemented  

High-level modules in the current repo:  

- **mapping_loader** — loads JSON mapping tables (`assets/mappings.json`) that map visual features (hue ranges, brightness, edge density) to musical modes, chord choices, instrument patches, and velocity/rhythm heuristics.  
- **chord_engine** — takes mapping + feature vectors and produces chord progressions and per-instrument note sets. Supports program changes and arpeggiation.  
- **image_source** — abstract source model (preselected image path or a camera/source abstraction).  
- **image_analysis** — OpenCV-based feature extractor:  
  - Global features (avg hue, edge density, brightness)  
  - Scan-bar features (per-section brightness, hue deltas → mapped to multiple instruments)  
  - Local helpers (histograms, Laplacian variance for texture, edge orientation metrics)  
- **midi_output** — wraps `midir` to send program changes, note on/off, and arpeggios.  
- **CLI glue (main.rs)** — parses `--instruments` and `play` flags; defaults to `assets/example.jpg` when no path is provided.  

---

## 🧭 The Road Ahead  

Three big steps remain before AudioHax becomes what I’ve been imagining all these years:  

1. **Music Theory Mapping** – Refine mappings with full integration of key signatures, chord progressions, and stylistic options so the music feels intentional, not random.  
2. **Webcam Integration** – Real-time operation, pulling visual data from a live feed. Imagine standing in an installation space, moving objects around, and hearing the music shift instantly.  
3. **Data Transmission & Decoding** – The “Hax” side of AudioHax. Encode data in the music itself, transmit it over an audio channel, and decode it on the other end. Think about data quietly transmitted in everyday sound environments — elevators, public transit, coffee shops — without anyone realizing it.  

---

## 💡 Why It Matters to Me  

This project started as a creative experiment with friends. Now, it’s a blend of art, tech, and security research that perfectly hits all my passions.  

It’s also proof that some ideas aren’t meant to be abandoned. They just need time, skills, and the right spark to come back to life.  

Next up: building a **custom Rust-based audio modem** — a tool that can encode arbitrary data, transmit it over audio, and decode it on the other end. That’s going to open up a lot of possibilities, both in art and in security research.  

But first, here’s the proof-of-concept that started it all… again:

<iframe width="560" height="315" src="https://www.youtube.com/embed/q1FTtV_WLrA?si=wiMjOjbww-zP6i9Y" title="AudioHax music engine version 1" frameborder="0" allowfullscreen></iframe>


