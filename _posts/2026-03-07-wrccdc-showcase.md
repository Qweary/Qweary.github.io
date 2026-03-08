---

layout: post
title: "👻🎬 Apparition Delivery System --- WRCCDC Red Team Showcase Recap 🎬👻"
date: 2026-03-07
author: Qweary
categories: [redteam, windows, ads, ntfs, apparition, ccdc]
tags: [redteam, ads, ntfs, windows, powershell, persistence, alternate data stream, ccdc, wrccdc, competition, evasion]
permalink: /wrccdc-showcase.html

---

<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>
=============

WRCCDC Red Team Showcase — From "Defender Says No" to "Defender Says Nothing"
=============================================================================

A competition retrospective on taking Apparition from flagged-by-everything to field-ready

---

## Context

I just got done presenting the Apparition Delivery System to friends and some members of the CCDC red team I'm part of, and I'm writing this while the adrenaline is still going. This post is part progress update, part retrospective, and part honest accounting of where the tool stands heading into competition.

If you've been following along, the [last time I posted about ADS](/ads-v2.html) was when I'd just rebuilt the architecture from a monolithic 800-line script into the two-component OneLiner system. At that point, the tool worked — but Windows Defender had opinions. The firewall-down notification was tipping off blue teams, and Defender was flagging the generated output as a Trojan. Not exactly competition-ready.

A lot has happened since then.

---

## 1. What I Showed the Team

The showcase walked the red team through the full operational workflow: generating payloads on Kali, deploying them on Windows targets via paste-and-execute, and watching them survive logoff/logon cycles. Specifically:

### Clean Defender/AV Bypasses

The framework now passes Windows Defender with real-time protection enabled, current signatures, and no exclusions. This took a significant amount of iterative research. The original GZip decompression stub was triggering `PShellCobStager.A` — turns out the behavioral pattern of "decompress bytes → IEX" is exactly what Cobalt Strike stagers look like to Defender. The fix involved redesigning the decompression approach to use DeflateStream instead, along with XOR fragment splitting for the AMSI bypass layer that operates at both deployment-time and execution-time independently.

I'm not going to pretend this was a clean path. The decision log has entries like "GZip + IEX pattern triggers detection — do not re-implement vanilla GZipStream → IEX" for a reason. Every evasion technique was binary-searched against Defender to isolate exactly which pattern triggered the signature, and the replacements were validated with RTP enabled.

### Firewall Takedowns

The `netsh advfirewall set allprofiles state off` payload deployed cleanly, persisted across reboots, and more importantly, it did so without the old Defender notification that used to alert blue teams that the firewall state had changed (my "sledgehammer" firewall off payload was even quieter). The combination of JScript wrappers for window hiding and the AMSI bypass meant the entire chain from scheduled task trigger through to firewall modification happened silently.

### C2 Callbacks

Live C2 (beacon to a kali VM running nc) callbacks from payloads stored inside NTFS Alternate Data Streams, executing from scheduled tasks via JScript wrappers. The full chain: `Task Scheduler → wscript.exe //B //E:JScript → powershell.exe -NoProfile → IEX(ADS content)`. Zero files on disk beyond the ADS host file (which looks like a normal system file when using deep placement or attach-to-existing).

### Many Memes

Because what's a red team tool without proof-of-compromise that makes people laugh? The payload library (I'll post it on github after the competitions) now includes cascading notepad floods, clipboard rickrolls, OIIA cat animations, caps lock disco, matrix rain, desktop graffiti, and more. Every single one validated against Defender. More on the grand finale below.

---

## 2. The Video — A Love Letter to Proof of Compromise

The showcase ended with a recorded demo that I'm pretty proud of. The scenario: log into a Windows target after ADS payloads have been deployed with registry persistence, and watch what happens.

Here's the sequence:

The screen immediately hits a washing machine effect; the display rotates a zoomed in screenshot and locks the user from seeing past it. After tricking the display to allow half the screen to show and after closing the washing machine, a cascade of notepads floods the desktop (messages could be added to these). Also, a custom text file appears on the Desktop, dynamically pulling the target's hostname and the exact timestamp of delivery - a jab at the blue team, letting them know that we can pull system data and write files where we wish. Then a PowerShell console opens with an OIIA cat animation, our homage to the spinning cat meme. And to cap it off, the washing machine effect kicks back in.

It's silly. It's fun. And every single one of those payloads was delivered through NTFS Alternate Data Streams, persisted via registry Run keys, survived logoff/logon and shutdown/restart cycles, and passed Defender without a single alert.

📹 Video: [Watch the demo](https://youtu.be/fQkIS3oAhM4)

---

## 3. What Changed Since v2.0

For anyone tracking the technical evolution, here's what's new since the last blog post:

### AV Evasion Redesign

The entire compression and execution pipeline was reworked. DeflateStream replaced GZipStream for the outer encoding layer, and the AMSI bypass moved to a dual-layer XOR fragment splitting approach. Layer A fires at deployment time (when the one-liner is pasted), Layer B fires at execution time (when the scheduled task triggers the ADS content). This matters because AMSI scanning occurs at both points independently — a bypass that only works at paste-time leaves you exposed when the task fires later.

### DPAPI Encryption

AES-256 with SHA-256 key derivation was replaced with DPAPI `ProtectedData` using `LocalMachine` scope and Machine GUID entropy. This was a pragmatic decision: the old approach triggered Defender's on-access scanner because the `SHA256 + AES + CreateDecryptor` pattern in JScript is exactly what crypto-malware looks like. DPAPI is used by Chrome, Edge, and Windows Credential Manager — it's expected system behavior, not a detection signal.

### Persistence Debugging

The RepetitionDuration saga. On Windows Server 2019+ and Win10 20H2+, setting `RepetitionInterval` on a scheduled task trigger without also setting `RepetitionDuration` causes the task to repeat exactly once. This is not documented anywhere I could find. It took multiple logoff/logon test cycles to isolate, and the fix is now hard-coded: every periodic trigger includes `-RepetitionDuration (New-TimeSpan -Days 9999)`.

Similarly, the JScript wrapper approach for window hiding was born from discovering that `-WindowStyle Hidden` does not reliably hide PowerShell windows when launched from Task Scheduler. The scheduler creates sessions with different window management rules than interactive logon. `wscript.exe //B //E:JScript` with `shell.Run(cmd, 0, false)` provides actual zero-visibility execution.

### Payload Library Expansion

The meme payloads went from a handful of ideas to a validated library with session context documentation. The key lesson: scheduled tasks run as SYSTEM in Session 0, where interactive UI elements (notepad windows, console animations) are invisible to the logged-in user. Registry Run key persistence fires in the user's own logon session, where windows actually appear. Every payload is now tagged with whether it needs interactive session delivery or works from SYSTEM.

### Multi-Instance Deployment

`-InstanceCount 3` now generates three independent persistence mechanisms per deployment, each with unique randomized paths, stream names, and task names. Redundancy that survives partial cleanup.

---

## 4. Honest Assessment

I was delightfully surprised. I know there will be edge cases to debug and improvements to be made, but I can say that I am genuinely happy at how this tool performs. Considering this is my first red team tool development that spawned out of a proof of concept I had in my mind for a couple years after reading a decade old research, I think I can be proud of the Apparition Delivery System.

In the spirit of not overselling:

Some meme payloads (Desktop Goose, Rick Astley audio) require pre-staged binaries or audio files on the attacker's web server, which adds operational complexity. The validated set (will release after competitions - notepads, caps lock disco, matrix rain, OIIA cat, clipboard rickroll, desktop graffiti, and more - work entirely self-contained.

The tool still requires PowerShell on target (which, to be fair, is present on every modern Windows system), and the base64-encoded one-liners can get long for complex payloads. Compression helps, but there's a floor to how small you can make a deployment command that includes its own AMSI bypass, persistence setup, and payload.

---

## 5. For the Blue Team

Because every offensive write-up should include the defensive perspective:

If you're defending against ADS-based persistence, your highest-value telemetry sources are Sysmon Event 15 (FileCreateStreamHash) which fires on ADS creation, Event ID 4698 which logs scheduled task creation, Event ID 4657 for registry Run key modifications, and PowerShell ScriptBlock Logging (Event ID 4104) which captures the decoded content of what actually executes. The command `Get-ChildItem C:\ProgramData -Recurse | Get-Item -Stream *` will reveal ADS streams, including ones with zero-width Unicode names (though the names will appear blank in the output).

Look for scheduled tasks with JScript actions pointing to files in `C:\ProgramData` or deep system directories. Look for registry Run keys that execute `wscript.exe` with `//E:JScript` arguments. And if you see `powershell.exe` being spawned by `wscript.exe` — that's not normal system behavior.

---

## 6. Thank You to the Team

The WRCCDC red team is genuinely one of the most welcoming and skilled groups I've had the chance to work with. The combination of deep technical knowledge and an enthusiasm for creative (and occasionally ridiculous) approaches to proving access makes for an incredible collaborative environment. Showcasing ADS and watching/hearing people's reactions to all the memes is just one of many enjoyable moments.

Looking forward to putting this to use at competition. Stay curious, keep those shells alive, and remember - the best proof of compromise is the one that makes the blue team laugh before they panic.

---

## Links

- Demo video: [WRCCDC ADS Showcase](https://youtu.be/fQkIS3oAhM4)
- Repository: [https://github.com/Qweary/Apparition-Delivery-System](https://github.com/Qweary/Apparition-Delivery-System)
- Previous posts: [ADS Introduction](/apparition-introduction.html) · [Invisible Streams](/invisible-streams.html) · [ADS v2.0](/ads-v2.html)

---

*AUTHORIZED TESTING WITH EXPLICIT PERMISSION ONLY. These techniques are documented for educational and authorized competition use. Don't be that person.*

--- qweary
