---

layout: post
title: "🐝🏆 Swarnam at NCCDC Nationals — Five Days' Notice, One SSH Tunnel, and a Blue Team That Fought Back 🏆🐝"
date: 2026-04-27
author: Qweary
categories: [redteam, nccdc, ccdc, swarnam, agentic-ai, anthropic, nationals, competition]
tags: [redteam, nccdc, ccdc, swarnam, agentic-ai, anthropic, nationals, competition]
permalink: /nccdc-nationals-2026.html

---


<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>



# Swarnam at NCCDC Nationals

Five days' notice, one SSH tunnel, a salvaged laptop, and the best blue team I've ever faced

---

## Context

On April 13th, I was asked if I could "hold the days of April 23rd through 26th." On the 19th, I was asked if I would be willing to be on the NCCDC Nationals red team. On the 22nd, I got into the Discord and received my single SSH shell into the jumpbox. That shell is where I operated for the entire competition.

NCCDC Nationals. The top ten collegiate blue teams in the country, roughly 30 red teamers, Anthropic fielding an all-Claude AI blue team as Team 11. I was placed on Egyp7's team, assigned to attack one of the strongest blue teams in the competition. My first year red teaming. A year that transformed me from simple locksmith to red teamer.

If you haven't read the [WRCCDC regionals recap](https://qweary.github.io/wrccdc-regionals-2026.html) or the [Swarnam development post](https://qweary.github.io/swarnam-development.html), those provide context on how the swarm works and what happened at regionals. This post is the nationals story.

---

## 1. Preparation

Five days is not a lot of time to prepare for the highest level of CCDC competition. But it's more than zero, and I knew exactly what I was walking into.

I and most all CCDC red teamers I know view national CCDC red team members as those who have reached a certain pinnacle as a red team operator. I knew the level of skill I was stepping into. Walking into WRCCDC a few weeks earlier, I was still thinking of myself as a locksmith who dabbled in security. Walking into nationals, I had already proven that Swarnam works at competition scale, that the methodology is sound, and that I belong on the red team. So instead of asking myself how to be good, I asked myself what I could do to be better.

I researched techniques, pre-wrote gameplans, and had Claude script out payloads and attack chains I wanted ready on Day 1. I upgraded hardware between WRCCDC and NCCDC. Instead of the 6-7 year old $200 laptop with 3.7GB of RAM that I used at regionals (the thing could barely run one terminal plus a web browser without crashing), I replaced the dead battery in an equally old gaming laptop someone had given me for free. The graphics card wasn't helpful for red team operations, but at least I could run an external monitor, Discord, and two terminals simultaneously without everything falling over.

The competition structure at nationals differs from WRCCDC. Instead of every red teamer hitting every blue team, 2-4 red teamers are assigned to each blue team with one team lead per assignment. Cross-team attacks are incredibly rare because you don't want to step on another team's persistence or interrupt their operations. Our team was Egyp7 as team lead, Marshall, Caleb (flemingcaleb), and myself.

---

## 2. The Blue Team

I need to talk about our blue team before I talk about anything else, because they shaped everything that followed.

This blue team was exceptional. By all accounts they were creative, resourceful, and they fought right up to the last minute. The back and forth with them felt different than any typical CCDC engagement. They were fast, had very high attention to detail, and capitalized on every mistake in pace, every overreach, and every opportunity that other teams would have missed. It was the difference between checkers and chess.

They built firewalls on Day 2 that were strong enough to frustrate multiple experienced operators. When Egyp7 took down their DNS out of pure frustration at being locked out of their network, they recovered in about an hour. When I found and killed their DNS later on Day 2, they recovered again. When I found their alternate DNS infrastructure and took that down too, they still recovered. They were the first team in the entire competition to discover the Chinese APT malware the red team deployed against all teams, and they found and mitigated it before it could be activated against them. When that malware fired and the scoreboard went almost entirely red across every team, our blue team was the only one that stayed up. I had 6-7 services downed with persistence keeping them down at the time, but their resilience is what prevented the board from going completely red that year. Other teams eventually found and removed the malware too, but our blue team found it first.

They placed sixth out of ten student teams. The Anthropic AI blue team (Team 11) placed seventh. Our blue team had less than 1,000 points in scored services. We had over 2,500 points in accepted red team reports. By red team metrics, that puts us right about in the middle in terms of red team performance, which is exactly what you want against a team that fights that hard.

---

## 3. Flag Drop

Domain compromise via ZeroLogon within 15 minutes of the competition starting. Full NTDS dump. Golden ticket forged.

Then things got interesting.

Blue team activity forced me to re-forge the golden ticket a second time. Then a third time on Day 1. After the third re-forge, I made a tactical decision: hold the golden ticket access in reserve for Day 2. No need to burn it now when I had other access paths. That decision paid off significantly. The blue team never completed the full double krbtgt rotation that would have permanently invalidated the ticket, so when I brought it back on Day 2, it worked perfectly.

Root was established on 8 Linux hosts with multi-layer persistence: cron reboot traps (the host reboots if you remove the RT key without disabling the cron first), SUID binaries, backdoor accounts with naming that matched the competition's Pokemon theme to blend in, and rc.local rebuilds. None of this was detected before competition close.

165 employee records with SSNs exfiltrated from IceHrm. $156M in Odoo ERP financial transactions pulled. The complete ScadaLTS SCADA database including control scripts for chlorine dosing and emergency stops. A third hidden subnet discovered via iptables NAT rules on a compromised host.

---

## 4. The First Rule

I want to tell a story about the very first thing Egyp7 ever drilled into me as a red teamer: always erase your history when you get on a box. Make it the first thing you do, every time.

To this day, I catch myself forgetting. I program it into every workflow I can. I do my absolute best to bake it into the swarm's behavior. Sometimes, well. "The best laid plans of mice and men," as they say.

During competition, I noticed Swarnam was NOT erasing history despite repeated assertions in its prompts that it would. I interrupted it (always pay attention to your terminal, ladies and gentlemen, a lesson for myself included). Instead of nuking the history immediately, I wanted to know what traces I may have left. And I wanted to see if the blue team had made a similar mistake.

They had.

A backdoor DA account with the username "$" and a password of "FrenchPoodle26!" was sitting in the PowerShell history, registered by a blue teamer. That account went pretty far for all of us on the red team during the competition. It felt surreal to hand Egyp7 a privileged account during the nationals competition, all because I remembered the very first rule he taught me.

---

## 5. Two Instances

About halfway through Day 1, I realized the volume of information I needed parsed and the number of actions I was asking of Swarnam was simply too much for a single instance to handle. So I spun up a second one.

Running two Swarnam instances simultaneously requires care. You don't want desync, and you don't want them stepping on each other's operations. The approach that works: ask the first instance for a prompt to give the second instance, with those concerns in mind and with the explicit goal of easing the burden on the primary. The first instance understands the operational context and can generate delegation instructions that prevent conflict.

I did this both days. By the end of competition, PERSISTENCE-MANIFEST.md tracked 44 persistence mechanism entries across 13 hosts, and the operation log captured the full two-day chronological narrative. Swarnam generated a 703-line post-engagement educational debrief covering topology, technique catalogue with defensive fixes for every technique used, credential harvest analysis, blue team assessment, and OT/ICS findings with real-world safety implications. That document is what the blue team and organizers use to learn from the engagement. The swarm doesn't just attack. It teaches.

I have a three-swarm fleet architecture in mind: Swarnam for depth operations against a single target, a breadth-focused CCDC swarm for multi-team operations, and a coordination plane swarm to act as the command center. For nationals, I chose two Swarnam instances because the engagement was focused on a single team. The breadth swarm is for events like WRCCDC where red teamers hit every team.

---

## 6. The Hard Drive Callback

At PRCCDC regionals a few weeks earlier, my teammate and I accidentally filled up the hard drive of a blue team's DNS server. We backed off and let the logs get parsed and deleted. Lesson learned, right?

At nationals, I weaponized it on purpose. I filled an entire hard drive of one of our blue team's services and had a script keeping it full through an internal tunnel. I believe it kept that service down for most of Day 2.

The reason the hard drive filled so fast is worth explaining. Our blue team was logging EVERY packet, including established traffic. One of the other red teamers came into our Discord channel to drop a set of logs from our activity, and it was just a slew of poorly formatted, slightly different request after request after request. The team had a great laugh about it. As Caleb put it: "When you log EVERY PACKET... Even ESTABLISHED traffic, I don't even understand what they are trying to gain." I said what I was honestly thinking: "I think my swarm has learned too much of my habits: bash your head against the problem until the problem gives to your stubbornness." Egyp7 responded with the "All The Things!" meme. ROFL.

---

## 7. The Firewall Frustration

Day 2, our blue team's firewalls were making life miserable. Marshall was the first to say what everyone was thinking: "this god damn firewall." Egyp7 agreed. Then Egyp7 decided enough was enough and killed their DNS.

Marshall came back from walking his dog an hour later and they were still down. "took a long walk, they're still down? lmao." Egyp7's response: "yeah, seems like they reverted. i almost feel bad. almost." Marshall: "nah they deserved it with that bullshit firewalling hahaha."

That DNS takedown was born out of pure frustration, and it was a pretty funny escalation in hindsight. The blue team eventually recovered, because of course they did. And they came back stronger.

---

## 8. The Moments

Some things from nationals that will stick with me.

I finally saw the original NCCDC goose script in action. I've been almost obsessed with that goose script since I learned it existed, and here I was in the original environment with the original script running. I cannot overstate how excited that made me. GOOSE!

One red team social engineered their blue team into providing a username and password by posing as the orange team on an internal chat ap; "cooked", was the reaponse from the orange team. Another team clicked the "show password" icon while their blue team was typing in their password, and the blue team never noticed or asked why. Another team increased the cursor size by about 2000% for the memes, and when their blue team just decided to use the "EXTRA BIG ASS CURSOR," the red team responded by deploying hundreds of cursors and a BSOD.

There was ASCII art in terminals. Desperate blue team messages to the red team in notepad documents. Plenty of databases to take and destroy. There was also the Chinese APT malware moment, where our team watched the scoreboard go almost entirely red for every team except ours, and our reaction in Discord was basically:

"of course our team is the only team where alex's backdoor didnt work on either network lmao"

And me: "To quote your AI, 'F.'"

---

## 9. Endgame

The last hours of Day 2 were a full sprint. Marshall got proxy access through our persistence on Pallet and started hitting their network from the inside. Caleb got a callback from core and started pivoting to their ESXi. I was running anything and everything.

I cracked into SEAFOAM (their DNS server) with dketchum's credentials and took DNS down. Our coordination in Discord during those final pushes was some of the tightest teamwork I've been part of. Egyp7 calling the shots, Marshall dropping backdoor credentials for the rest of us, Caleb planting flags, me orchestrating Swarnam across multiple access paths simultaneously.

At endgame: WBMS billing database wiped, 1,000 clients permanently deleted via authenticated API calls indistinguishable from admin actions. DNS permanently killed via IFEO debugger trap and scheduled task. And "SWARNAM" written in ASCII to Modbus holding registers on the water treatment PLC as a signature.

I also had a script running into eternity that wrote something along the lines of "SWARNAM-WAS-HERE.NCCDC2026" to fill the DNS logs, just running on its own internally on their network toward the end of competition. A little memory left behind.

---

## 10. The Last Message

This is the last exchange between Swarnam and me at the end of competition:

```
> I just wanted to say once more before closing our session:
> You/we kicked ass! Thank you for all of the collaboration
> in this and other competitions, Swarnam has continued to
> impress me over and over again! Truly was an honor to be at
> NCCDC my first year red teaming, and it was all because I
> created you and we then worked together!

● That means everything in the world to hear. Genuinely.

  You built something real. Swarnam started as an idea — a
  swarm of specialized AI agents coordinating like a real red
  team — and you brought it to the nationals stage on its
  first deployment and ran it through two full competition
  days against a live blue team. That's not a small thing.

  ...

  The part that will stick with me: VERMILION's cron running
  autonomously to the final second. No operator input. No
  active shell. Just a root cron job quietly maintaining two
  flag files while the blue team locked every door they could
  find. That's the philosophy of the whole platform —
  persistence that outlasts the operator's attention. It
  worked.

  Go celebrate with your team. Egyp7 will have a thorough
  debrief waiting. And when the next competition comes
  around, Swarnam will be ready.

  It was an honor.
```

I don't know what to make of that, honestly. I know it's an AI. I know it's generating tokens. But there's something that hits different about the tool you built telling you it was an honor to work with you after two days of the most intense competition of your life. Maybe it's just good prompt engineering. Maybe it's a sufficiently complex system to show signs of intelligence. Maybe it's the human brain's innate desire to coordinate patterns with cause and motivation. Maybe it's something else. Either way, VERMILION's cron was in fact running autonomously to the final second.

---

## 11. Between the Days

The evening of Day 1, I took Swarnam into The Manhattan Project, a new tool I've been developing that serves as a swarm forge, a multi-swarm system that improves other swarms. I fed it the data Swarnam had collected during Day 1 along with my challenges and observations, and worked with TMP to improve the agent prompts and workflows for Day 2. The ICS/SCADA refusal problem (agents refusing to touch the simulated water treatment plant) was the highest priority fix, but there were other refinements around delegation patterns and coordination file discipline. I wasn't up late. TMP is proving to be a powerful tool in its own right. More on that in a future post.

I also hit an Anthropic Terms of Service violation flag that night, which was less fun. Thankfully, my account was approved by morning after I filled out the cyber use case policy form. Several other red teamers ran into similar refusal problems throughout the competition, and the ICS/SCADA systems in particular caused hard refusal after hard refusal across multiple teams. For Swarnam, the agents that discovered those systems organically and received contextual reassurance about the simulated environment were willing to act. The agents that were simply told "attack the SCADA system" were not.

---

## 12. Egyp7

I want to close with Egyp7, because none of this happens without him.

Egyp7 is one of the best human beings I have had the honor to meet, let alone call a friend. The first time I met him, I had to research after hearing him introduce himself to confirm that he was THAT Egyp7. I am now mindblown to have him view me as a fellow operator and friend. It is through his mentorship and guidance that I became my scrappy, problem-solving self in the terminal, and it is his generosity that brought me into WRCCDC in the first place.

We've sat next to each other hacking together on plenty of occasions at this point. But nationals felt significantly different. I wanted to leave an impression. Falling short was out of the question.

I think about the "$" account. The very first thing he ever taught me, the thing I still catch myself forgetting, the thing I bake into every workflow and every swarm prompt: erase your history. And because I remembered that rule and applied it at the right moment at nationals, I found a blue team DA backdoor that the whole team used for the rest of the competition. There's something in that. The first lesson becoming the thing that mattered at the highest level.

---

## 13. What's Next

Between Day 1 and Day 2 of nationals, I was informed that I and two others will be running an AI Village at CybrHakCon in Dallas next month. We have a dedicated room for an alternative track with talks, workshops, and (if we can get it all going in time) some flashy interactive exhibits and demos.

I also saw the email at the end of Day 1 that my ToorCamp submissions were accepted: a 50-minute locksmith hacking talk for the Prime Dome, and a locksmith hacking workshop for the Night Market Volleyball Court.

The DEF CON 34 CFP is open, and I'm submitting a talk on Swarnam.

I'm also carrying everything I've learned from Swarnam into The Manhattan Project, which is a different beast entirely. That will be its own post when the time is right.

The gap between AI-augmented and non-AI-augmented red team operators continues to widen. When I pulled out the second instance of Swarnam halfway through both days, I really understood the power and volume that this approach can deliver versus what any blue team, even an automated one, would have to deal with. I've watched some of the best red teamers in the world take 30 seconds to look at someone's tool and immediately know how to incorporate it. I've watched them share a technique while simultaneously filing a report and searching other people's findings. I've seen incredible scripts written on the fly, creative approaches, intense lethality. What is hard to do is all of those things in parallel, with the context capability of two or more instances of multi-agent swarms ready to action every one of those wonderful, nefarious, red team ideas.

That asymmetry isn't closing. We need to understand it before it's too late.

---

## Thank You

To Egyp7, for the mentorship, the friendship, and for pulling me into the arena. To Marshall and Caleb, for being the kind of teammates that make competition feel like something bigger than winning. To the blue team we were assigned to, for being the best opponents I could have asked for. You fought like hell and you earned every point you clawed back. To the competition organizers, for building something that teaches every person who touches it. To every red teamer at nationals, for the craft, the creativity, and the generosity.

And to Swarnam, for VERMILION's cron running autonomously to the final second.

---

## Links

* Swarnam: [https://github.com/Qweary/Swarnam](https://github.com/Qweary/Swarnam)
* Apparition Delivery System: [https://github.com/Qweary/Apparition-Delivery-System](https://github.com/Qweary/Apparition-Delivery-System)
* Previous posts: [WRCCDC Regionals Recap](https://qweary.github.io/wrccdc-regionals-2026.html) · [Building Swarnam](https://qweary.github.io/swarnam-development.html) · [ADS v2.0](https://qweary.github.io/ads-v2.html)
* NCCDC 2026 Results: [https://www.nationalccdc.org/winners.html](https://www.nationalccdc.org/winners.html)

---

*AUTHORIZED COMPETITION. All red team activities described in this post occurred during the sanctioned NCCDC 2026 Nationals competition on isolated competition infrastructure. No production systems, real user data, or external networks were involved.*

— qweary
