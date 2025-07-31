---
layout: default
title: Current Focus
permalink: /current/
---

# 🔬 Current Focus: T2/T3 Lock System Deep Dive 🔬

This research project began with a deceptively simple question: What assumptions are being made about the security of the devices we physically trust every day?

The DL-Windows system, the CP210x bridge, and the embedded lock firmware all present a fascinating challenge: a blend of old-school protocol behavior, misunderstood trust boundaries, and under-scrutinized deployments.

We're emulating hardware, deconstructing USB conversations, and replicating interactions from scratch using custom tools. Why? Because real-world lock infrastructure shouldn't be a black box.

Full write-ups are being release now. Proof of concept video below.

Video shows a factory reset of the lock after injection to the firmware (only code 123456 should work after reset).

<video controls width="100%" style="margin-top: 1rem;">
  <source src="https://raw.githubusercontent.com/Qweary/T2-T3-Lock-Exploitation-Research/main/Media/20250530_225150_1.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
