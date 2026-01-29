---


layout: post
title: "≋≋ Invisible Streams - Zero-Width Unicode Streams for NTFS Stealth ≋≋"
date: 2026-01-28
author: Qweary
categories: [redteam, windows, ads, ntfs, apparition]
tags: [redteam, ads, ntfs, windows, stream, red team, alternate data stream, persistence]
permalink: /invisible-streams.html

---


<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>

## TL;DR

NTFS fully supports zero-width Unicode characters inside Alternate Data Stream (ADS) names. These streams:

- Render **visually blank** in common tools (`dir /r`, `streams.exe`, PowerShell)
- **Survive reboots and copies** (local and cross-volume)
- Enable **filename squatting and user confusion**
- Create **console vs GUI display inconsistencies**, especially with bidirectional control characters

This post documents **verified behaviors only**, with reproducible tests.

---

## Background

NTFS Alternate Data Streams are not new. What *is* less explored is how NTFS handles **zero-width Unicode characters** inside ADS names.

Because NTFS stores filenames and stream names as UTF-16, *any non-NUL Unicode codepoint is valid*. Zero-width characters are preserved byte-for-byte, yet render invisibly in most interfaces.

---

## Zero-Width Unicode Characters Tested

The following characters were verified as valid ADS names and visually invisible:

| Codepoint | Name | PowerShell Var | ADS Example | Visual Result |
|---------|------|---------------|------------|---------------|
| U+061C | Arabic Letter Mark | `$alm = [char]0x61C` | `file.txt:$alm` | Blank |
| U+180E | Mongolian Vowel Separator | `$mvs = [char]0x180E` | `file.txt:$mvs` | Blank |
| U+200B | Zero Width Space | `$zwsp = [char]0x200B` | `file.txt:$zwsp` | Blank |
| U+200C | Zero Width Non-Joiner | `$zwnj = [char]0x200C` | `file.txt:$zwnj` | Blank |
| U+200D | Zero Width Joiner | `$zwj = [char]0x200D` | `file.txt:$zwj` | Blank |
| U+200E | Left-to-Right Mark | `$lrm = [char]0x200E` | `file.txt:$lrm` | Blank |
| U+200F | Right-to-Left Mark | `$rlm = [char]0x200F` | `file.txt:$rlm` | Blank |
| U+202A | LTR Embedding | `$lre = [char]0x202A` | `file.txt:$lre` | Blank |
| U+202B | RTL Embedding | `$rle = [char]0x202B` | `file.txt:$rle` | Blank |
| U+202C | Pop Directional | `$pdf = [char]0x202C` | `file.txt:$pdf` | Blank |
| U+202D | LTR Override | `$lro = [char]0x202D` | `file.txt:$lro` | Blank |
| U+202E | RTL Override | `$rlo = [char]0x202E` | `file.txt:$rlo` | Blank |
| U+2060 | Word Joiner | `$wj = [char]0x2060` | `file.txt:$wj` | Blank |
| U+FEFF | Zero Width No-Break Space | `$feff = [char]0xFEFF` | `file.txt:$feff` | Blank |

---

## Verified Behaviors

### ✅ ADS Persistence

Zero-width ADS names:

- Survive **reboots**
- Survive **local copies**
- Survive **cross-volume copies**

This is expected NTFS behavior — ADS metadata is preserved as part of the file record.

---

### ✅ Visual Invisibility in Common Tools

The following tools **do not display** zero-width ADS names:

- `dir /r`
- `streams.exe`
- `Get-Item -Stream *`

The stream exists and has size, but the name appears blank.

---

### ✅ Filename Squatting & User Confusion

Zero-width characters were also tested **inside filenames**, not just ADS names.

Observed behavior:

- Console (`dir`) shows multiple files with **identical names**
- GUI (Explorer) may show **sorting or rendering anomalies**
- Users cannot reliably distinguish files
- Clicking the “wrong” file becomes easy

This appears particularly effective with **bidirectional formatting characters** (U+202A–U+202E).

---

### ✅ Console vs GUI Dissonance

Example using RTL Override:

```powershell
$char = [char]0x202E
New-Item "important$char.txt" -ItemType File
New-Item "important.txt" -ItemType File
```
- Console: both appear as important.txt
- Explorer: sorting and visual order differ
- Result: two files that *look* the same, but behave differently

---

### Creating and Accessing a Zero-Width ADS

``` powershell
# Add hidden content
$char = [char]0x200B; 'EXTRA SECRET' | Add-Content "C:\ProgramData\syc.dll:$char"

# List streams (name appears blank)
Get-Item "C:\ProgramData\syc.dll" -Stream *

# Access content (must know the character)
Get-Content "C:\ProgramData\syc.dll:$char"

# Remove (dont forget to cleanup)
rm C:\ProgramData\syc.dll
```

⚠️ Note: You cannot reliably copy-paste these stream names. You must recreate the character programmatically.

---

### Why This Matters

NTFS tooling, auditing, and user workflows often rely on visual trust:

- What the console shows
- What Explorer renders
- What looks “normal”

Zero-width Unicode breaks that trust quietly and persistently.

---

### Related Work & Code

- Github: https://github.com/Qweary/Apparition-Delivery-System/
- Related Research: https://qweary.github.io/apparition-introduction.html
