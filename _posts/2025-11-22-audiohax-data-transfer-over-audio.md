---
layout: post
title: "📡 AudioHax: Building a Robust MFSK Audio Modem in Rust 📡"
date: 2025-11-22
author: Qweary
categories: [project progress, audiohax, acoustic art]
tags: [audiohax, acoustic art, rust, image, music, midi, security research, data transmission, encryption, mfsk, modem]
permalink: /audiohax-mfsk.html
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

## 🚀 From Prototype to Round-Trip TXT  

This post documents my attempt to turn **AudioHax** into a working acoustic data modem.  
The goal: send arbitrary files (text, images, etc.) as audio tones (MFSK) and reliably recover them with simple signal processing — even in noisy channels.  

I built a Rust prototype that supports:  

- Compression (gzip)  
- Optional AES-GCM encryption  
- Packetization and repetition (basic FEC)  
- Tunable parameters (tones, symbol length, packet size, repeats, channels)  

Along the way, I wrestled with **framing, bitpacking, Goertzel detection, redundancy**, and all the tradeoffs that make or break real-world reliability.  

---

## 🎯 What I Set Out to Build  

I wanted a compact demo modem that could:  

1. Convert a file → bytes → symbols → tones → `.wav`.  
2. Decode tones back → symbols → bytes → frames.  
3. Support optional compression + AES-GCM encryption.  
4. Use simple FEC (repetition) for noisy environments.  
5. Offer easy diagnostics to tune and debug.  

The **frame format** I designed included:  

- `AHX1` magic  
- Flags (compressed/encrypted)  
- Filename + payload length  
- CRC32 for integrity  
- Payload (optionally compressed/encrypted)  

Packets were repeated `N` times with headers (`PKT1`) so decoding had multiple chances.  

---

## 🧩 Problems I Hit  

1. **Packet misalignment** — strict parsing failed when packets were shifted in the stream.  
2. **Bit errors → big failures** — a single noisy symbol could corrupt a filename or fail CRC.  
3. **Huge WAVs** — large images + long symbols caused multi-GB files (Hound crate overflows).  
4. **Brittle depacketization** — if every repeat had different errors, nothing survived.  

---

## 🔧 Fixes & Improvements  

1. **Smarter depacketizer**  
   - Scan buffer byte-by-byte for headers.  
   - Group packets by sequence.  
   - Prefer CRC-valid copies, otherwise majority-vote across repeats.  
   - Fill missing packets with zero-bytes for stability.  

   → This single change made recovery *way* more tolerant.  

2. **Preamble + sync heuristics**  
   - Added repeated pilot tones.  
   - Tuned symbol length and tone spacing for better SNR.  

3. **Parameter tuning**  
   - `--symbol-ms` longer = more reliable, but slower.  
   - Smaller packets = fewer bytes lost per error.  
   - More repeats = higher success rate.  
   - Tone spacing vs. # of tones = robustness vs. throughput.  

   ✅ My first “perfect” run used:  

--mtones 12
--symbol-ms 50
--pkt-size 100
--repeats 7

4. **Diagnostics**  
- Added byte dumps, tone arrays, CRC warnings.  
- Iteration speed went way up.  

---

## ✅ The Success Run  

Commands:  

```bash
cargo run --bin modem_encode -- out.wav HaxTest.txt \
--compress --channels 1 --mtones 12 --symbol-ms 50 --pkt-size 100 --repeats 7

cargo run --bin modem_decode -- out.wav recovered \
--channels 1 --mtones 12 --symbol-ms 50 --repeats 7


Result: file recovered perfectly.

🔐 What This Is Not
This isn’t a new crypto scheme. I used standard AES-GCM (via the aes-gcm crate).
 The novelty here is in combining framing + modulation + pragmatic FEC inside a Rust-based acoustic modem.

📚 Lessons Learned
Repetition works for prototypes, but Reed–Solomon or LDPC will be needed for efficiency.


Tune symbol length to the channel SNR.


Smaller packets reduce damage from burst errors.


WAVs must be streamed/chunked for large transfers.


Preambles are essential for sync.


Sequence numbers & totals save your sanity during reassembly.



🛠️ Next Steps
Add Reed–Solomon per-packet FEC.


Experiment with convolutional/LDPC coding.


Improve sync with cross-correlation.


Adaptive parameter selection.


Streaming WAV output + resumable receiver.


Unit tests with synthetic noise injection.



🧪 Reproducibility
Quick test:
cargo build --bins

cargo run --bin modem_encode -- out.wav HaxTest.txt \
  --compress --channels 1 --mtones 12 --symbol-ms 50 --pkt-size 100 --repeats 7

cargo run --bin modem_decode -- out.wav recovered \
  --channels 1 --mtones 12 --symbol-ms 50 --repeats 7

Check the recovered file → matches original.

💡 Closing Thoughts
This project reminded me that the hardest problems weren’t exotic math, but engineering: alignment, error locality, recovery strategies.
By layering diagnostics, majority-vote depacketization, and parameter tuning, I pushed AudioHax past the “toy” stage into something that can reliably send and recover files over sound.
And this is just the start. Next up: scaling to images, adding robust FEC, and testing across real acoustic channels.
https://github.com/Qweary/AudioHax
<iframe width="560" height="315" src="https://youtu.be/xvSG6uns5bA” title="AudioHax MFSK PoC”  frameborder="0" allowfullscreen></iframe>

