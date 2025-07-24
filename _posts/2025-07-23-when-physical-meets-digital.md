---


layout: post
title: "When Physical Meets Digital: The Early Vulnerabilities That Led to Hardware Hacking"
date: 2025-07-23
author: Qweary
categories: [research, physical-security, t2t3]
tags: [access control, embedded, alarm lock, proxmark, security audits]

---


<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>


> TL;DR:
This post examines real-world physical vulnerabilities in a range of commercial electronic locks, revealed during authorized security assessments. By reverse-engineering mechanical tolerances, exploiting design oversights, and leveraging non-destructive covert entry techniques, we were able to bypass security mechanisms without leaving visible signs of tampering. The findings highlight the importance of aligning electronic and mechanical security postures, particularly in high-assurance environments where audit trails and forensic visibility are relied on but easily subverted. We also highlight poor physical design decisions — such as externalized logic boards and audit ports — that undermine otherwise solid digital controls.






> "The world is held together by duct tape, hubris, and a lack of physical tampering.”
— Unknown (but often true)








---


## Executive Summary


In this initial post, we dive into the physical side of embedded access control security — focusing on the Alarm Lock T2/T3 platform. These systems are common in government, educational, and healthcare institutions, and are often assumed secure due to their digital nature. However, a number of real-world, field-validated vulnerabilities show how physical flaws — from externally accessible logic boards to lack of key override logging — can undermine the very controls meant to secure a facility. These writeups walk through the journey from superficial observations to full-on hardware hacking.


This post presents the research that ultimately laid the foundation for deeper explorations, including firmware extraction, NAND memory analysis, and user authentication bypasses — which will be covered in future posts.




---


## Disclosure Philosophy


This blog is the product of authorized research performed in operational environments with full permission. Vulnerabilities were disclosed to vendors in good faith, with recommendations and reproducible steps. In most cases, disclosures were met with silence or non-committal responses. In rare instances, small fixes were implemented quickly. In others, years passed without acknowledgment — despite evidence of user harm.


This mirrors broader challenges in embedded system disclosure. There is a deep need for vendors to build responsive, respectful, and technical vulnerability handling processes — and to listen when their security-savvy customers speak up.




---


## Case Study: A Proxmark, a Phone, and a Binder of Master Keys


It started with a walk through a 24-hour reception area. Facing outward, a terminal displayed **live monitoring data** from the building’s access control system: full names, badge numbers, facility codes, and the exact encryption format in use — **Wiegand 26** — all conveniently visible to passersby.


I spoke to the security team.


> “Nobody in here would know how to do that kind of thing,” one said, referring to RFID cloning.


Challenge accepted.


A few days later, I returned with a **Proxmark 3**, paired via Bluetooth to my phone using a TCP bridge through Termux. After walking the team through how trivial it was to clone a badge using the exposed data, I posed a scenario: _What if someone lost their badge?_


Their procedure involved signing out a **master credential** from a paper binder. I signed it out, cloned it, and pretended to find my original card. One tap later, the cloned master badge opened a secure door, and the system logged the event as if it were a legitimate master key use.


The result? A policy shift. The site migrated from centralized real-time monitoring to standalone locks with local audit logs. Less visibility, perhaps — but also fewer credentials in circulation, less exposed data, and better containment.


The biggest irony? The credentials were exposed in the first place because the team had lost the original packaging that included facility codes. The live monitor was the easiest way to enroll new cards.


---


## Case Study: Low-Hanging Fruit, Unpicked


Before ever probing firmware, I found myself drawn to the **Alarm Lock T2/T3** for one simple reason: they were **ubiquitous**, and — early on — the company actually responded to vulnerability reports.


### 1. **Audio Side-Channel Keylogging**


Older T2/T3 locks leaked keypad input through **distinct speaker tones**, caused by how the residual voltage from each keypress flowed through the speaker. A trained ear (or recording) could infer codes with only 1–2 digit errors. It wasn’t military-grade side-channel analysis — it was phone phreaking 2.0.


> **Fix proposed:** Use inconsistent, low-quality speakers.  
> **Time to patch:** Two weeks.  
> **Takeaway:** Sometimes the most secure part is the cheapest.


---


### 2. **Tailpiece Bypass via Stiff Wire**


This was a classic locksmith bypass: slip a stiff wire behind the cylinder and nudge the tailpiece directly, bypassing the core. It only worked under specific conditions — unshielded components and installation tolerances being off — but it was effective.


- **BEST** redesigned their parts immediately.
- **Alarm Lock** hesitated until shown how a 1¢ fix might prevent million-dollar liability.
- **Kaba** acknowledged it, but claimed “specialized knowledge” was required.


---


### 3. **Battery Freeze = Hard Reset**


By using an upside-down compressed air can, I discovered that freezing battery wires could temporarily interrupt power, which — on some models — was enough to trigger a **factory reset from the exterior** of the door.


The root issue here is a poor physical architecture decision: the **entire control board and battery leads are located outside the secured area** — often directly behind the keypad. While this may simplify installation, it exposes critical systems to physical tampering.


> A better design would treat the keypad as a *peripheral*, connected to an internal control board housed **inside** the locked side of the door. This approach not only prevents power-interrupt attacks like this, but also hardens against other vulnerabilities (such as voltage injection attacks or remote trigger bypasses).


---


### 4. **Remote Unlock Wires, Always Hot**


Some versions of the T2/T3 had a pair of wires for remote unlock accessories. The idea is straightforward: bridge the wires, the door unlocks. The flaw? This feature is **enabled by default**.


Even worse: the wires align with one of the external communication ports. Drill through the port (which will still function after), bridge the wires behind the shell — door pops open.


I asked why it couldn’t be opt-in.


> _“Disabling it by default would create extra steps for customers who buy the remote unlock accessory.”_


What happens if those wires are exposed during installation? What if the door is warped and the wires can be fished out between the lock and the skin of the door? What if someone finds a way to bridge them without having a code for the lock? You don’t have to be a nation-state actor to own a travellers hook, drill, or a continuity tester.


This too could have been mitigated by relocating the circuit board to the **interior side of the door**. Attackers shouldn’t be able to reach security-critical wiring with a drill and a coat hanger. Nor should **audit port connectors** or firmware interfaces be accessible externally — but in many models, they are. Common sense (and decades of physical security principles) dictate that access logs and control surfaces should be inside the secured area. That they aren’t speaks to either product design shortcuts or a fundamental misunderstanding of the threat model.


> Additionally, physical voltage injection techniques were considered. Some variants allow injection of voltage via drilled access near specific contact points on the board — enabling unlock without triggering alarms or audit logs. These techniques, while more invasive, further emphasize the need to shield internal logic from external access.


---


### 5. **Mortise Spindle Failures: From Disclosure to Lock-In**


One vulnerability that was long minimized — and later vindicated — was related to a **mortise lock spindle retention failure**.


Early in our testing, we identified that certain T2/T3 mortise models had a **spindle screw retention issue**. Over time, under heavy use or vibration, the screw holding the interior and exterior spindles together could **back out**, resulting in a catastrophic failure: the inside lever no longer retracted the latch.


In other words, **people were getting locked inside rooms**.


Despite early disclosures, the vendor initially downplayed the issue. Only after our organization — a large-volume government customer — threatened to halt further purchases did the issue get traction. This was *years* after the vulnerability had been identified. We later learned that the company had chosen **not to apply threadlocker (Loctite)** on the screw in order to save fractions of a cent per unit.


Alternative fixes existed:
- Tapping the back spindle shallower, and/or using a longer screw
- Mechanically de-pairing the square stock components
- Using redundant retention mechanisms, as seen in other commercial mortise locks


> As stated in my Phrack-style article, the company president was visibly upset when he learned people were trapped due to this penny-wise decision.


What’s most concerning is that our disclosures — even when made in good faith, with detailed repro steps and risk language — don’t always appear to reach engineering leadership. It's unclear whether product teams failed to escalate, or whether internal communication silos prevented meaningful triage. Regardless, it illustrates a systemic issue in vulnerability response: **acknowledgment ≠ resolution**.


---


### 6. No Physical Key Audit = Covert Bypass Risk


One vulnerability reported several years ago remains unresolved to this day: the complete absence of physical key override sensing.


If a mechanical key is used to open the lock, no event is logged. This has several implications:


Traditional lockpicking is invisible to audit systems.


There is no accountability for mechanical master key use.


It magnifies the impact of tailpiece deflection attacks, as physical key-based entries provide no logging whatsoever.




> The vendor acknowledged the issue and agreed it should be addressed — yet cited integration complexity as a reason for indefinite delay. To this day, no such sensor has been added to the T2/T3 lineup.




---


## The Meh: Response Fatigue and Vendor Complacency


After a few such disclosures, Alarm Lock stopped responding. Not rudely — just silence.


My next step was obvious: **figure out how the lock stores data**. How is user data protected? Are credentials stored in plaintext? How do resets work internally?


I didn’t have the answers then. But I knew I had to go find them — even if it meant opening the device, dumping the NAND, acquiring the firmware on the microprocessor, and reverse-engineering it byte by byte.


We knew further action would require deeper insight. We needed to extract firmware, reconstruct memory maps, and find out **exactly** how these locks handled authentication, storage, and resets. The hardware teardown was no longer optional — it was necessary.


---


## Tech Support Horror Show


As an aside — and a warning — here’s a snapshot of how some vendors treat support and security.


When I couldn’t retrieve audit logs from a **Kaba 5031**, I called support. The device performing the audit was an **air-gapped machine**. The technician’s proposed fix?


> “Just connect it to your phone’s hotspot so we can remote in.”


This is the mindset of a company selling “high-security” locks.


—


Summary of Attack Vectors


| Vector | Technique | Severity |
|--------|-----------|----------|
| Acoustic side-channel | Inferred keypad entries from tones | Medium |
| Tailpiece latch bypass | Mechanical deflection w/ wire | Medium |
| Reset via freeze | Compressed air disables lock power | Medium |
| Remote unlock wires | Physically bridge accessible leads | High |
| Audit/control ports external | Logic and logs accessible on unsecured side | High |
| Spindle separation (mortise) | Backed-out screw disables egress | Critical |
| Support-induced backdoors | Phone tethering to air-gapped machines | High |




---


## Remediations and Lessons


- Treat **keypads as peripherals**, not control units
- Move critical circuit boards **inside** the secure area
- Secure firmware and user data with **encryption and tamper response**
- Use threadlocker or redundant retention on **all critical mechanical fasteners**
- Ensure audit/log access ports are **inaccessible externally**
- Train product and support teams on real-world attacker workflows




---


## Red Team Takeaways


- **Observe installation environments** for leaked configuration details (e.g., live Wiegand monitors).
- **Use physical entry techniques** to defeat digital logging — then demonstrate forensic invisibility.
- **Understand default behaviors**: remote unlock ports, code resets, and battery routing.
- **Field-test assumptions**: “electronic” doesn’t mean immune to physical coercion.
- **Favor non-destructive techniques** to preserve deniability in covert assessments.




---


## Final Thoughts


This post isn’t about dunking on Alarm Lock, Kaba, or any particular vendor. If anything, it’s about the dangerous incentives built into this industry. When products are “good enough,” scrutiny drops. When legacy hardware persists unpatched for years, users assume it’s secure — until someone looks closer.


And when security teams at major organizations submit reproducible, well-documented issues, only to be ignored, it raises an important question: **what other fixes have been silently discarded at the product management layer?**


The rest of this research — including **firmware dumping**, **user code manipulation**, and **NAND mapping** — came later. But it started here: at the messy, physical intersection of security domains no one wanted to bridge.




---


Coming Next


We’ll continue our exploration of the Alarm Lock ecosystem by:


Dumping and parsing the NAND flash


Reconstructing memory maps


Identifying where and how user codes, audit logs, and factory reset flags are stored




The deeper we dug, the more systemic the problems became — not just mechanical, but embedded deep in firmware logic and memory handling.


Stay tuned.
