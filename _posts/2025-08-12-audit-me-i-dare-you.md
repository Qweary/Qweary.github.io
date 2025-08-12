---
layout: post
title: "🎝️ Audit Me, I Dare You: CP2102 Spoofing and Self-Auditing Lock Failures 🎝️"
date: 2025-08-12
author: Qweary
categories: [research, hardware hacking, usb, facedancer, spoofing, t2t3]
tags: [access control, USB emulation, embedded, audit trail, CP2102, DL-Windows, reverse engineering, GreatFET, digital forensics, spoofing]
permalink: /audit-me-i-dare-you.html
---

<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>

> "A lock that logs itself is like a suspect writing their own alibi.  
> The story might check out — until you notice the ink's still wet."

---


## 📌 **TL;DR**  
Using a GreatFET One and the FaceDancer USB emulation framework, I partially recreated the behavior of Alarm Lock's proprietary CP2102-based programming cable. This allowed me to spoof interactions with DL-Windows, the software used to program and audit T2/T3 locks. While the emulated device doesn't yet pass the entire Loopback Test, it provokes real software behavior, revealing that DL-Windows blindly trusts USB descriptor-based identity. This raises serious concerns about self-auditing access control systems and the fragility of digital audit trails.

---

## 📖 **Executive Summary**  
Alarm Lock's Trilogy T2 and T3 series rely on a CP2102-based USB-to-UART cable for configuration and auditing through the DL-Windows software. These logs are treated as ground truth during investigations.  
But what if the cable lies?

In this post, I demonstrate how a USB device built using FaceDancer and a GreatFET One can spoof the expected descriptors, pass Windows driver checks, and fool DL-Windows into believing a legitimate cable is connected. This undermines the assumption that access logs and configuration states are trustworthy when extracted via a trusted cable.

By intercepting real traffic and manually recreating USB responses, I passed the first ~40 packets of the DL-Windows Loopback Test. While not fully functional yet, this attack path shows that:

- Audit trails can be spoofed or falsified  
- Investigators could be misled by manipulated cables  
- A rogue cable could backdoor a lock, erase evidence, or inject new credentials  

This final phase of my T2/T3 research closes the loop from hardware access to audit manipulation, demonstrating the risks of trusting devices to audit themselves.

---

## 🕹️ **Main Content: Spoofing the Auditor**

### 🚫 **A Single Point of Failure**  
The T2 and T3 systems rely on DL-Windows to:

- Program user codes  
- Change lock behavior  
- Download audit logs  

All of this happens over a USB cable with a CP2102 chip and two banana plugs — one for data, one for ground. The problem? DL-Windows trusts the cable based solely on USB descriptors and their packet-exchanging Loopback Test. There's no cryptographic handshake, no challenge-response, not even a unique serial requirement.

> If you can spoof the cable, you can spoof the audit.

---

### 🔧 **Building the Cable Emulator**  
I used the following setup:

- GreatFET One with modern FaceDancer fork  
- USBPcap + Wireshark to capture real traffic  
- Custom Python script defining `USBDevice` with:
  - Correct VID/PID (Silicon Labs)  
  - Device, config, and interface descriptors  
  - Endpoints: `0x01 OUT`, `0x81 IN`  
  - Vendor requests like `0xFF → 0x02` response  

DL-Windows expects:

- USB device to enumerate cleanly  
- Vendor request responses  
- Echo loopback of bulk data: OUT to `0x01`, then back on `0x81`  

My emulator passed USB enumeration and responded to the first ~40 loopback packets before DL-Windows aborted with "Invalid Port Number." That’s partial success — and enough to prove the attack path.

---

### 🚀 **Why It Matters**  
DL-Windows logs are used in serious investigations:

- Hospitals  
- Pharmacies  
- Government buildings  
- Financial institutions  

These logs can determine liability, timelines, or access control violations. And yet:

- There's no way to verify cable authenticity  
- Logs can be extracted from a spoofed device  
- A malicious cable could rewrite logs or inject ghost codes  

In legal or forensic contexts, this is an unacceptable risk.

---

## 🧰 **Case Study: GreatFET vs. DL-Windows**

**Setup:**

- DL-Windows installed on Windows 10  
- Captured USB session using real CP2102 cable  
- FaceDancer script replayed descriptor and vendor traffic  
- Implemented partial echo on endpoints  

**Result:**

- DL-Windows recognized the device  
- Loopback test partially passed (~40/303 packets)  
- Triggered software error on mismatch  

**Implication:**

- Audit software can be fooled  
- No authentication for USB interface  
- Partial PoC shows viable spoofing vector  

---

## 🤖 **Remediations & Lessons Learned**

**Technical Fixes:**

- Authenticate cable with digital certificate or HMAC  
- Use encrypted protocol for audit data  
- Move comm interface to interior, secured side  
- Include tamper detection for interface ports  

**Secure Design Philosophy:**

- Don’t trust a lock to verify itself  
- Don’t trust a cable to prove identity  
- Logs must be cryptographically signed by the lock itself — and validated independently 
- Use secondary event logging mechanisms to independently verify access events — especially in systems with legal or investigative implications 

---

## 🥷 **Red Team Takeaways**

- If it plugs into USB, it can be emulated  
- Logs are just data — and data can lie  
- Self-auditing systems are inherently untrustworthy  
- Don’t rely on UI indicators (e.g., “Loopback Passed”) as evidence of authenticity  
- Attack the assumptions, not just the code  

---

## 🎒 **Final Thoughts**  
This was the final stage of a journey:

- I exploited the physical vulnerabilities of the lock  
- I manipulated the NAND, recovering user credentials thrown in the trash  
- I rewrote the firmware, giving myself permanent backdoor access  
- And now, I’ve subverted the audit trail by abusing the inherent trust of the cable used in legal investigations  

Security exists across layers — and failure at any layer breaks the whole system.  
The most dangerous assumption? That something on the USB bus is telling the truth.

---

## 🗺 **Coming Next**  
This is a proof of concept, but with additional effort it could become a full audit falsification framework — a digital crowbar for the USB trust boundary.

While I don’t take lightly the potential implications of a fully operational release, my goal is to highlight how fragile these assumptions are, and why even small tools in the wrong hands can compromise institutional trust.

I leave it in the hands of the community, willing collaborators, and policymakers to show that assumptions like this are dangerous — and to take meaningful steps toward verification, not just belief.

> Full FaceDancer script, protocol captures, and development notes available at:  
> 🔗 https://github.com/Qweary/T2-T3-Lock-Exploitation-Research

---

## 🔗 **Resources**

- GreatFET One  
- FaceDancer Framework  
- DL-Windows Software (Alarm Lock)  
- USBPcap + Wireshark  
- Original CP2102-based cable captures  


