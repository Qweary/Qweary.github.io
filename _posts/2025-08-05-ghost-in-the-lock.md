---

layout: post
title: "🔓 Ghost in the Lock: Injecting MSP430 Firmware for Undetectable Entry 🔓"
date: 2025-08-05
author: Qweary
categories: [research, hardware hacking, MSP430, firmware, t2t3, backburner]
tags: [access control, embedded, alarm lock, MSP430, microprocessor, firmware, reverse engineering, security audits, second code, ghost code]
permalink: /ghost-in-the-lock.html

---

<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>

> “A fuse unblown is a door left ajar — and every open door is an invitation.”  
> — *Field Notes from the 1%*

---

## 📌 TL;DR

Through extensive reverse engineering of the MSP430F2418 microcontroller inside Alarm Lock Trilogy systems, I identified and exploited a firmware-level vulnerability to inject a persistent elevated access code that survives resets and remains invisible to audits. This was accomplished via JTAG interface (fuse unblown), TI assembly patching, and a heavy dose of stubbornness. The implications reach well beyond commercial locks.

---

## 📖 Executive Summary

This post details a persistent firmware injection vulnerability found in the Alarm Lock Trilogy T2 and T3 access control systems. By analyzing the microcontroller firmware via JTAG, I successfully created and uploaded a TI assembly patch that executes during factory reset, injecting a privileged code into memory that survives reboot and bypasses audit mechanisms. The JTAG interface was left unprotected.

More broadly, this research raises questions about supply chain security, manufacturing flash processes, and the assumption that embedded access control systems are "too obscure" to be a target. When these locks are used in pharmacies, government buildings, military facilities, and financial institutions, that assumption fails. The 1% of actors that care are exactly who these systems need to be resilient against.

---

## 👻 Possession via JTAG

### 🧵 The Long Thread to Firmware

I didn’t start as a hardware hacker. I started as the guy recommending these locks.

When I first began auditing the Alarm Lock Trilogy series, I knew I needed to see the firmware — but I didn’t know where it lived. The FCC filings were sealed, no schematics available. Everything had to be learned manually. I poked test points, bricked boards, soldered, failed, tried again. Tutorials became my bedtime reading.

Eventually, I got my hands on a newer revision of the board — and with it, something unexpected: a different microcontroller. Previous versions had resisted nearly every approach, but this one carried the MSP430F2418, a more powerful and better-documented chip. More importantly, its JTAG fuse hadn’t been blown. That meant full read/write access to firmware.

And that meant a new way in.

---

### 🔌 Soldering Nightmares and JTAG Brute Stubbornness

Through dozens of boards, I learned the hard way that reliable JTAG connections aren’t something you do with wishful thinking. Acupuncture needles didn’t hold. Holding six pins at an angle led to hand tremors mid-write. Eventually I devised a soldered breakout technique using flux layering, breakout pins, through-hole technology (THT), and micro tip irons to create stable connections for repeated testing.

Some boards had strange quirks — bridged debug pads that didn’t affect access, failed reads followed by mysterious successes. At one point, re-bridging two debug pads led to a board finally allowing memory reads after several failures. It wasn’t elegant, but it worked. Sometimes.

---

### 📦 Why Supply Chain Threats Are Real

These locks are built overseas (e.g., Dominican Republic), then shipped in bulk to distributors and, ultimately, sensitive U.S. facilities. If a malicious actor intercepts those shipments at any point — or worse, compromises the factory that flashes the firmware — a persistent backdoor could be installed at scale. There's no secure boot, no firmware validation, and no TPM.

Without fuse protection, locks sent to a high-security facility could be compromised before they ever leave the warehouse.

That's a real risk, not a hypothetical.

---

## 😎 Not a Bug, Just My Code Now

### 🎯 Objective

Inject a second, elevated credential code (e.g., `696969`) into a typically unused user slot that survives reset, and potentially causes audits to result in an error.

---

### 🛠️ Tooling

- MSP-FET debugger (TI)
- TI UniFlash
- Ghidra with custom memory map
- TI Assembly Manual (very worn)

---

### 🧠 Discovery

The factory reset process initializes the master code (`123456`) at an easily discoverable location, given the required hardcoded values. I traced the responsible function to address `0x9ECA`, which writes static values to specific memory regions and sets user permissions.

---

### 🧪 Hooking Strategy

Using a `BR` (branch) opcode instead of `CALL` (lesson learned the hard way), I hijacked the control flow mid-function:

```assembly
@9ee8
30 40 20 fa          ; BR #0xFA20 -> jump to custom code

@fa20
D2 43 e7 11          ; MOV.B #1, &0x11E7       ; overwritten opcode for BR
F2 40 69 00 81 11    ; MOV.B #0x69, &0x1181    ; code byte 1
F2 40 69 00 b3 11    ; MOV.B #0x69, &0x11B3    ; code byte 2
F2 40 69 00 e5 11    ; MOV.B #0x69, &0x11E5    ; code byte 3
D2 43 17 12          ; MOV.B #1, &0x1217       ; enable user
F2 40 e1 00 49 12    ; MOV.B #0xE1, &0x1249    ; permission = E1
30 40 ec 9e          ; BR #0x9EEC              ; return to original flow
```

### ✅ Result

- Code `696969` now functions as an elevated credential  
- Survives reset, causes some audit logs to error  
- Stable injection tested across multiple boards  

---

### 🎥 Demonstration: Factory Reset, Ghost Code Remains

After injecting the persistent firmware patch on a previously deployed lock (with pre-existing user codes), a factory reset is performed.
At this point, **only** the default master code (123456) should function — yet the injected ghost code still grants access.

<iframe width="560" height="315" src="https://www.youtube.com/embed/tD7BfMAFk9E" title="Injected Firmware Demonstration: Ghost Code Survives Factory Reset" frameborder="0" allowfullscreen></iframe>

---

## 🧩 Remediations & Lessons Learned

### Technical Remediations

- Blow the JTAG fuse post-manufacture  
- Implement secure boot + signature validation for firmware  
- Encrypt **all data** at rest  
- Add TPM or HSM-backed secure enclave  

### Institution-Level Fixes

- Don’t let the lock self-audit; use redundant sensors or external logging  
- Demand supply chain security and audits of security products manufacturers/vendors
- Verify firmware at time-of-use  

---

## 🦝 Red Team Takeaways

- Fuse bits are the first line of defense. If they’re not set, you’re handing out dev kits.  
- Firmware-level access allows complete audit manipulation, backdoors, or logic rewrites.  
- Supply chain attacks on embedded firmware are not just theoretical.  
- Access control systems, when used for sensitive environments, should be held to critical infrastructure standards.  

---

## 🧳 Final Thoughts

When I shared some of these results with a senior locksmith, he said:  
> “They’re not worried about the 1% of people like you.”  

But the 1% are those who either make the 99% vulnerable, or show the possibility to fix the problem before an incident occurs. This research is a reminder that *obscure doesn’t mean secure*, and that determination often trumps sophistication.

---

## 🧭 Coming Next

A deeper dive into the DL-Windows software, and the spoofing of the CP2102 cable to tamper with software-audited logs...  
Stay tuned.

---

## 🔗 Resources

- [GitHub Repository: Full source code and patches](https://github.com/Qweary/T2-T3-Lock-Exploitation-Research)  
- TI MSP430 Assembly Docs  
- MSP-FET + UniFlash Toolchain  


