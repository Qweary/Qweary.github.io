---

layout: post
title: "Dead Bytes Tell No Lies: Injecting Truth into NAND Flash for Access Control Exploitation"
date: 2025-07-29
author: Qweary
categories: [research, hardware hacking, NAND, flash, t2t3]
tags: [access control, embedded, alarm lock, NAND, security audits]
permalink: /dead-bytes-tell-no-tales.html

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
> By connecting to the Adesto AT45DB041E flash chip in the Alarm Lock T3, I reverse-engineered its proprietary NAND flash write protocol. The system uses a lazy write model, controlled by the MSP430 microprocessor, triggered only on battery removal or low-power idle. User codes and privilege flags are stored in a predictable layout with minimal encoding and no cryptographic protections. Using a $30 universal programmer, I extracted, decoded, modified, and re-flashed user data to inject elevated privileges, bypass audit trails, and persist unauthorized access—until factory reset wipes the flash. This post details the technical steps, memory layout, forensic nuances, and a real-world case study.

> “Insecure memory is like a public notepad—if you don’t encrypt it, someone else will edit it.”
— Qweary

---

## Executive Summary

The Alarm Lock T3-Series embeds an MSP430 microcontroller paired with an Adesto AT45DB041E SPI NAND flash chip for persistent data storage. Contrary to expectations, user data is stored in raw, semi-structured NAND pages, without encryption or integrity checks. The MSP430 employs a lazy write approach, committing volatile RAM user codes to NAND only upon battery removal or low-voltage interrupt events.

This opens a powerful attack vector: physical access to the NAND chip allows cloning, modification, or injection of user codes and privilege flags via inexpensive off-the-shelf tools. Carefully crafted NAND injections can:

- Inject user codes with arbitrary privileges (Master, Supervisor, etc.)  
- Bypass or corrupt audit logs selectively  
- Survive lock reboots but **not** full factory resets  
- Create stealth audit windows where printed user lists differ from exported logs

These findings underscore the critical need for encrypted or authenticated storage in access control systems.

---

## Technical Deep Dive

### 1. Target Hardware Overview

- **MCU:** MSP430F2418 running proprietary lock firmware  
- **Flash Storage:** Adesto AT45DB041E, 4 Mbit SPI NAND flash chip  
- **Programming Interface:** Flash accessible via test clip and TL866II+ compatible programmer  

---

### 2. NAND Flash Memory Layout & Code Encoding

The NAND flash is organized in 264-byte pages, with each page holding data for 50 users:

| Offset       | Description                                      |
|--------------|------------------------------------------------|
| 0x0000       | `FD` — Page header marker                       |
| 0x0001–0x0032| 1st byte of each user code (50 entries)         |
| 0x0033–0x0064| 2nd byte of each user code (50 entries)         |
| 0x0065–0x0096| 3rd byte of each user code (50 entries)         |
| 0x0097–0x00C8| Active status flags (`01` active, `FF` inactive)|
| 0x00C9–0x00FA| Permission flags                                 |
| 0x00FB–0x0107| Padding                                         |

Each user code is stored as 3 ASCII nibbles, representing 6 decimal digits right-padded with zeros:

- Example: Code `123456` → bytes `'12' '34' '56'`  
- Shorter codes (e.g., `123`) are right-padded with zeros: `123000`  
- Zero digits are encoded as ASCII `B` (`0x42`), not `0x30`  
- The `FD` byte marks the start of the page, not part of any code

Permission flags use simple byte codes:

| Code | Role         |
|-------|--------------|
| F1    | Master       |
| E1    | Elevated User|
| C1    | Supervisor   |
| 01    | Normal User  |
| 11-41 | Grouped Users 1–4 |
| FF    | Inactive     |

---

### 3. Write Behavior and Lazy Commit Model

- User changes made via keypad or software modify volatile RAM inside MSP430  
- NAND flash commits only occur after **battery removal** or **low-voltage interrupt** (idle timeout)  
- Evidence: Audit logs show `"Low Battery Detected"` and `"Power Up Complete, Data Restored From Flash"` after power cycle  
- NAND read snapshots taken before power removal lack recent changes  
- NAND read snapshots taken after power removal fully reflect latest state  

This asynchronous commit method introduces a vulnerability window where physical NAND dumps may not contain all current data unless the lock was power-cycled.

---

### 4. Injection Attack Methodology

1. **Dump NAND contents:** Using TL866II+ programmer and SOP8 clip  
2. **Decode user data:** Python scripts to parse the raw page structure and extract user codes, active flags, and permissions would be smart, but I used pen and paper  
3. **Modify data:** Inject new user codes or modify privilege flags directly in the binary dump  
4. **Flash modified data:** Write modified dump back to NAND chip  
5. **Power cycle lock:** Lock reads new flash data and applies changes  
6. **Observe effect:** New users are active and privileges applied immediately  

---

### 5. Forensic Artifacts and Audit Evasion

- Malformed user codes (e.g., non-decimal strings) cause audit software to behave unexpectedly  
- In some cases, "Print Users" shows injected codes, but "Export Users" omits them  
- Injected elevated privileges can silently appear in logs as normal users  
- Software crashes during export may result from corrupt privilege fields  
- Event logs reveal `"Power Up Complete, Data Restored From Flash"`, a red flag for flash tampering  

---

### 6. Limitations & Persistence

- Injected data **does not survive factory reset**, which wipes NAND and resets master code to `123456`  
- NAND contents can be overwritten by normal keypad operations  
- Large unused blocks on NAND may serve as covert storage for payloads or metadata in advanced attacks

---

## Case Study: Recovering User Codes from Discarded Locks & Insider Threat Implications

During the investigation, a practical attack scenario emerged with real-world relevance. Many deployed Alarm Lock T3 units eventually reach end-of-life or are replaced and discarded. In multiple cases, locks recovered from trash or recycling bins retained their NAND flash chips intact.

### Attack Scenario

- **Step 1:** Physical retrieval of discarded lock and extraction of the NAND flash chip  
- **Step 2:** Using a universal programmer, NAND contents are dumped and decoded to recover stored user codes, active flags, and privilege levels  
- **Step 3:** Extracted codes reveal active user credentials, including Master and elevated privilege users  
- **Step 4:** Reuse of recovered codes in other locks (code reuse is common across sites) enables unauthorized access without raising immediate suspicion  
- **Step 5:** Modifying and injecting codes back into other lock NAND chips allows silent privilege escalation or audit log evasion  

### Insider Threat Angle

An insider with brief physical access can clone or manipulate NAND contents without leaving obvious software traces. This means:

- Audit logs may appear normal, especially if injections mimic expected user roles  
- Unauthorized users can be silently added or elevated  
- Factory reset or keypad code changes will not erase insider-injected modifications unless a full NAND wipe occurs  
- This is particularly critical in high-security environments where physical security of discarded hardware is not guaranteed  

This case study highlights how weak NAND flash protections and poor physical security combine to undermine access control integrity.

---

## Remediations and Lessons Learned

- **Encrypt and authenticate NAND flash contents** to prevent unauthorized manipulation  
- **Avoid lazy writes for critical security data; use atomic, logged updates**  
- **Monitor audit logs for power cycle events and suspicious privilege changes**  
- **Harden physical access** to NAND chip to deter hardware attacks  
- **Implement integrity checks or MACs for user data structures**  
- **Establish strict hardware disposal protocols to prevent data leakage**

---

## Red Team Takeaways

- Universal programmers and inexpensive clips enable direct flash injection on many embedded locks  
- Lazy write and unprotected flash is a recurring design flaw ripe for exploitation  
- Audit logs can be manipulated or selectively bypassed through malformed entries  
- Insider threat vectors are amplified by physical NAND access and weak disposal controls  
- Similar methodology likely applies to other MSP430 + NAND-based access control systems  
- Always validate physical security and consider flash memory as an attack vector in red team assessments

---

## Final Thoughts

The Alarm Lock T3's flash memory holds the keys—not just figuratively, but literally. Bypassing software-level protections by direct NAND manipulation revealed the stark absence of cryptographic safeguards and revealed an entire attack surface below the firmware.

This post maps the raw memory and outlines the process, but the next step goes deeper: firmware-level injection on the MSP430 itself, enabling persistence beyond the NAND's ephemeral writes.

Stay tuned.

---

🔗 Resources  
- [RadiomanV’s XGecu Software (GitHub)](https://github.com/radiomanV/XGecu_Software)  
- [Boseji's Guide for TL866II+ on Linux](https://boseji.com/posts/running-tl866ii-plus-in-manjaro/)  
- [Notes, Dumps, Uploads, and Logs](https://github.com/Qweary/T2-T3-Lock-Exploitation-Research) 

---

Thanks for reading — may your bytes always tell the truth.  
— Qweary (July 2025)  



