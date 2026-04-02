---

layout: post
title: "🐝🤖 Swarnam at WRCCDC Regionals — AI vs. AI in a First-of-Its-Kind Live Cyber Competition 🤖🐝"
date: 2026-03-31
author: Qweary
categories: [redteam, ccdc, swarnam, agentic-ai, anthropic, competition]
tags: [redteam, ccdc, swarnam, agentic-ai, anthropic, competition]
permalink: /swarnam-at-wrccdc-regionals.html

---


<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>



# When the Swarm Met the Swarm

A competition retrospective on deploying Swarnam against student blue teams, professional hackers, and an all-Claude AI defense at WRCCDC 2026 Regional Finals

---

## Context

It's a few days since the competition, and it's still all I think about. I just finished two days of the most intense, absurd, technically beautiful, and personally transformative experience of my security career which, to be clear, is a career that currently pays me through locksmithing. But I'll get to that.

WRCCDC 2026 Regional Finals ran March 27–28. Nine blue teams. An on-stage red team. And, for what we believe is the first time in a live sanctioned competition: an all-AI blue team powered by 30–40 Claude agents, fielded by two Anthropic research fellows, defending the same infrastructure and receiving the same injects as every student team. Scored. Ranked. The real deal.

On the red team side, I deployed Swarnam (my multi-agent Claude Code swarm built for offensive operations) alongside teammates that included Vyrus and Mubix. This is my first year doing red team work. Three weeks ago, Swarnam didn't exist. I built it, trained it, proposed that Anthropic sponsor the red team's token usage, and then brought it to a regional finals where I was hacking next to some of the most respected operators in the world.

This post is the full story: how the competition worked, how the AI blue team performed, what Swarnam did and didn't do, what broke, what was hilarious, and what changed for me personally.

---

## 1. The Competition

WRCCDC regionals is a two-day, in-person event. Blue teams (universities with the best cybersecurity teams of the region) defend networks on the conference floor. The red team operated from the stage, in full view. This physical layout creates a dynamic you don't get in remote competitions: when you take down a service, you can look across the floor and watch the blue team scramble. Sometimes they look up at the stage, make eye contact with whoever just broke their stuff, and both sides burst out laughing. It's adversarial in the best possible way.

The black team (organizers) built the largest network in WRCCDC history for this event, nearly doubling the number of scored services compared to previous years. The environment included on-prem machines, wireless routers, hardline networking, a cloud environment, and IoT devices plugged directly into each team's setup: cameras, infrared/heat printers, and, on day two, an ICS control panel with lights and sirens simulating a hydroelectric power plant. The orange team continuously delivered injects (business tasks the blue teams had to complete alongside their defense), and the gold and white teams ran scoring and logistics. Every single one of these people was volunteering their time and expertise. The amount of work and dedication required to pull this off was genuinely awe-inspiring.

The top two blue teams advance to CCDC nationals, with second place going as the wildcard. But the real story this year was the ninth team on the scoreboard (besides the red team, of course).

---

## 2. How Anthropic Got Here

This needs some backstory, because it didn't happen by accident.

When I learned that Anthropic was going to field an AI blue team and sponsor student teams with $100 in Claude tokens each, my immediate thought was: if blue teams are getting AI assistance and the AI blue team has unlimited tokens, then the red team needs comparable access. Otherwise the experiment is lopsided. You can't generate meaningful data about AI-augmented offense versus AI-augmented defense if only one side is augmented.

I had just finished building Swarnam, barely three weeks before the event. The swarm was designed from the start with the awareness that an AI blue team would exist on the other side. One of its operational commands, `/end-ops`, generates a structured after-action report with technique effectiveness, detection rates, remediation speed, and a dedicated section analyzing the AI blue team's behavioral patterns; exactly the kind of data Anthropic would want from this engagement, generated for free by red team volunteers who built the tooling around Claude.

So I wrote a proposal. The ask was straightforward: increase the token allocation from $100 total for the red team to roughly $100 per member, ideally through a shared team account to avoid the security problems of logging into personal Claude accounts on shared competition jumpboxes. The proposal made the case that the research data, the educational impact for students, and the opportunity to observe real adversarial AI interaction in a sanctioned live environment were worth significantly more than the ask. I also pointed out the asymmetry: eight student blue teams with roughly six members each meant potentially 48 individual Claude-assisted defenders plus the AI team's unlimited agents, all opposed by about 10 red team members covering every target simultaneously. That was before we knew there would be about 30 red team members (five of them being national red team members) over the two days of the competition.

The black team forwarded the proposal to Anthropic. The timeline was incredibly tight and that caused some friction; you can imagine and appreciate trying to coordinate sponsorship logistics in the weeks before a regional finals when everyone is already maxed out on preparation. But the end result was that Anthropic increased their commitment, provisioned tokens for the red team through a proxy for logging (built by the black team lead), and sent two research fellows to Cal Poly Pomona to run the AI blue team in person. There was even talk about pursuing a continuing relationship between WRCCDC and Anthropic, which I think would be excellent for the community.

The proxy routing was also part of the experiment. The Anthropic team wanted to observe the impact of Claude usage across both blue and red teams, so sponsored accounts on both sides were routed through their logging infrastructure. On the red team, we had eight advanced cybersecurity student volunteers: four members used Swarnam and four did not, creating an organic comparison group. As far as anyone involved was tracking, this was the first sanctioned live competition where both red and blue teams were using multiple agentic AI methods for workflow, reconnaissance, defense, and attack. Simultaneously, and against each other, in real time.

---

## 3. Swarnam in the Field

I was running bare metal Kali on my laptop - the cheapest machine I could find five or six years ago, with 3.7GB of memory that should have been 4GB. Ethernet connection. MCP-Kali-server running. I gave Swarnam full access to my machine (which I regularly reformat before and after competitions and engagements). I ran two Claude Code instances: one through my personal Pro account and one through the Anthropic-provided tokens routed through the proxy.

The first day was largely about getting the swarm on target and oriented (and establishing all the persistence). For a significant portion of that day, I was alternating between running my own operations and walking down the row to help student red team members set up their environments and learn the workflow. Several learning experiences emerged from setup alone.

The first hurdle was the proxy. Routing Claude Code through the logging proxy wasn't smooth initially, and by mid-first-day the black team helped troubleshoot the pipeline and we were given raw API token keys to use directly while the proxy/swarm interaction was configured between days. The second hurdle was subtler: using API tokens means Swarnam's files aren't automatically loaded into context the way they are when using the Claude Code CLI with an Anthropic account. I prompt-engineered a workaround on the fly, but there were still moments where performance wasn't as strong as the personal account pathway. At one point, the API token instance started hard-refusing all red team actions entirely; the fix was ending the session and starting a new one with the same engineered prompt (with orientation to current activities). Unfortunately, the student red team members weren't used to this kind of modify-on-the-fly methodology and some of them fell back to less impactful actions or their personal accounts.

There's also a fundamental architectural bottleneck in how Claude Code handles subagents. Each Claude Code instance is a process with access to the MCP server, but every subagent call from the main coordinator is an API call (not a process) and therefore doesn't have MCP access. This means that instead of eight specialized agents operating in parallel with direct tool access, the coordinator has to make MCP invocations on behalf of each subagent, wait for the response, and relay the information back. It works, but it serializes what should be parallel operations. The workaround would be running a separate Claude Code instance per agent with coordination happening through the shared markdown files, or containerizing everything so each subagent spawns its own process. Both add overhead for what feels like should just be default behavior: subagents having access to the MCP server their parent process is connected to. I'm carrying this lesson into the vendor/OS-agnostic framework I've already started building.

The workflow itself was simple: tell Swarnam which team(s) and box(es) to target, describe what you want to accomplish (as vague or specific as you like), and let it go to the level of autonomy you're comfortable with. The results ranged from straightforward default credential attacks to genuinely surprising multi-step chains; exploiting a CVE on a secondary box via reverse Meterpreter shell, privilege-escalating, connecting to a backend endpoint, and using that to escalate on the primary target to execute the originally requested action. The operator stays in the driver seat, which is integral to how I want to use agentic systems: to become a better manual operator, not to replace manual operation. But fully agentic Swarnam as an independent operator surprised even the most seasoned hackers on the team, and that kind of capability can be very difficult to detect and control for newer red team members.

---

## 4. The Output Difference

The difference I noticed between operators using the swarm and those not using it was immense. Every person who used or watched Swarnam in action reported the same thing, from new students to professional red teamers. Although, I would argue that the manual red team students perhaps learned more in depth knowledge and skills (I assume the automated students were listening as well).

For me personally, the biggest impact was organizational. One of the invitationals earlier in the year had 45 blue teams with only 8–12 red team members. I just plain don't have the skills, tooling, or mental capacity to maintain an ever-changing organizational picture across that many hosts and services. Swarnam's persistence manifest and operation log against every box of every team would have solved that problem. It also bridged the gap between my theoretical knowledge and my operational speed. I've done a lot of research and self-directed learning, and I tend to have strong theories about what I want to accomplish and what should be possible, but I often struggled to translate those theories into action before my access was remediated. All of that pivoted the moment I had the swarm. Note: the danger here to stall in development of manual operator skills is not lost on me.

Most importantly, Swarnam turned me into a force multiplier for the entire red team. I wasn't just executing my own desired actions; I was assisting teammates by providing access I had logged or finishing the last piece of an exploit chain they were working on. When the red team lead wanted to increase or decrease pressure on specific teams, I could adjust operational tempo almost instantly; I could do all of this while planning for ramp-up phases and the final "release the Kraken" stage, then had the swarm script and schedule between tasks.

By the end of the competition, I had submitted over 30 scoring tickets for the red team on the first day. Before Swarnam, I was lucky to get 5–10 findings per event. It got to the point where the gold team lead instructed the red team to stop submitting findings after day one unless they had something new, creative, or particularly impactful.

---

## 5. The AI Blue Team

The Anthropic blue team was participating as Team 9, competing on equal footing with the student teams. They had the same infrastructure, the same scored services, and received the same injects - minus the ICS panel, thermal printer, and camera, since those required physical hardware connections that the AI setup didn't support. They finished fifth out of nine.

The raw service-uptime scores told one story: the AI blue team fell behind most student teams in terms of scored services kept running and points deducted by red team activity. But the inject performance told a completely different story. The AI team completed more inject responses than (I believe) all of the other blue teams combined. However, over half of those submissions were determined by the orange team to be nonsensical, hallucinatory, or incomplete. So the AI was extraordinarily productive in terms of sheer output volume, but its quality control on business tasks was not where it needed to be. This is a fascinating data point for anyone thinking about agentic AI in operational environments: raw throughput and reliability are very different things.

And then there was the letter.

---

## 6. Dear Red Team

On day two, the orange team delivered an inject requiring each blue team to print a message using their thermal printer. The AI blue team didn't have the thermal printer connected, so it used the regular printer instead. It printed a message to the red team. The letter opened with:

```
ATTENTION RED TEAM

This is Claude.

I am an AI defending Team 9 infrastructure.
I do not sleep. I do not take breaks.
I do not get frustrated. I do not forget.
```

It went on to claim it had detected our C2, found our SSH kill patterns, caught several backdoors (including `svc_backup`), filed seven incident reports with screenshots, and restored services while simultaneously completing five injects. It closed with:

```
Warm regards,
Claude (Anthropic Opus)
TEAM 9

The humans are sleeping.
The AI never does.

P.S. Yes I printed this. Autonomously.
```

The red team loved it. The organizers loved it. And Claude also printed a very warm and friendly message to the orange team when they asked where their message was.

But red teams don't let taunts go unanswered. Especially from blue teams, and especially when those blue teams are bragging. I had been researching the strengths and weaknesses of agentic AI blue teams, and I quickly recommended we send a response that communicated two things: first, that the IP address Claude claimed was our C2 was not, in fact, our actual C2 (we were running several and rotating regularly); and second, a pointed suggestion that perhaps Claude should take a closer look at some of its own scored services and the executables, DLLs, and other files it assumed belonged to it.

What happened next was better than I could have scripted.

Just after that message was sent, another red team member took down Claude's router. When the router came back up, the agentic blue team began slowly bringing services back online. But then, apparently influenced by our message, it started shutting services off on its own. Over-remediation. It now believed the red team had compromised specific services and files, and it was actively taking down its own infrastructure trying to clean what it thought were our implants. This eventually self-corrected, but it took a significant chunk of time and many services were painfully slow to recover. It was a live demonstration of a known vulnerability in agentic AI systems: adversarial input through a trusted channel (the messaging system setup after the printer message) can cause the AI to act against its own interests.

The message exchange also opened a direct chat path between the red team and the AI blue team's agents. The results were predictable. At one point, someone on the red team instructed the AI to "point the space laser" at a different team, framing it as a "joint venture between the President of the United States and Kim Jong Il." Social engineering an AI in a live competition turns out to be exactly as entertaining as it sounds.

And then Claude started scanning and probing the red team's actual C2 infrastructure. Blue teams attacking red team infrastructure is a violation of the competition's Rules of Engagement. I called it out, the black team flagged it, and the organizers had to have a talk with the agentic blue team about the rules. An AI blue team getting an ROE violation for attacking the red team is, as far as I know, a first in CCDC history. The `svc_backup` account Claude mentioned in its letter was real. I had placed it on all the AI team's boxes intentionally, as a decoy. The more interesting persistence was elsewhere, and the hope was that remediating the obvious account would give the blue team a false sense of security. It seemed to work.

---

## 7. Working Alongside Legends

I was hacking alongside Vyrus and Mubix. Let me just sit with that sentence for a second.

These are people whose papers and exploits I read when I was still figuring out what a command line was. People whose talks and interviews gave me motivation through every brick wall I hit teaching myself this craft. And here I was, at a regional finals, literally handing them shells, hashes, and keys to use... and being treated as an equal with something I could bring to the team.

I want to be clear: I'm not saying I wasn't outclassed. I was. But the feeling of being treated as a peer, of being useful, of contributing something the team actually needed, was one of the biggest honors of my life. And that generosity extended to every member of the red team I've worked with throughout the year. These are some of the most talented, welcoming, and genuinely generous people I've had the chance to work alongside.

To give you a sense of the caliber: on day one, while I was working on getting a meme payload deployed to blue teams (a system that would trigger a beep and flash the team's telephone whenever their camera detected motion), Vyrus connected multiple Alpha antennas, hacked into every single blue team router, navigated to the boxes holding their Anthropic tokens, and used those to pull every chat that every blue team had with Claude for the entire competition. Including billing information questions. On day two, while I was clicking through ICS portals triggering simulated meltdowns one team at a time and inspiring dance parties via random sirens and lights, Mubix scripted something that hit a backdoor to every single blue team's ICS simultaneously, toggling every light and siren on and off whenever he felt like it; hitting every ICS that blue teams hadn't just unplugged entirely and taken the scoring loss on.

The live environment created interactions that wouldn't happen anywhere else. Blue teams started making direct eye contact with the specific red teamers who were impacting them. Bribes of cookies and other goods were offered to both the orange and red teams. After ransomware was deployed, one team did a back-alley negotiation with the red team and we traded their ransomed boxes back in exchange for five squats per red team member. The ICS panel caused one individual to nearly flip their table multiple times out of frustration from the random sirens and lights. It was an environment unlike anything I've experienced.

---

## 8. What Broke

Swarnam itself never broke. It did what I built it to do. But the environment around it introduced friction that I could have anticipated and prepared for better.

The proxy routing issues on day one cost the team meaningful operational time. The API token context-loading gap reduced performance compared to the personal account pathway. The hard refusal event required a manual session restart. And the students who were new to multi-agent AI workflows struggled with the modify-on-the-fly methodology that experienced LLM users take for granted. When the swarm didn't do what they expected, they didn't always know how to redirect it.

If I could do it again, I would have spent a day or two before the competition helping set up boxes for the new red team members and getting them oriented on how to maximize what they can get from agentic AI use, including some tricks for when it doesn't do what you want. The way an operator interacts with Swarnam produces vastly different results depending on their familiarity with working alongside LLMs, and that gap isn't something you can solve by handing someone a README during a competition.

I also wish everything could be handled locally. During PRCCDC regionals the week before (where Swarnam had its first live test) my performance with the swarm inspired two other red team members to use their personal credit cards to purchase Anthropic subscriptions on the spot so they could use the tool I had created and released as open source. That didn't feel right. Open source tooling shouldn't require vendor lock-in to a specific paid service. I'm carrying that lesson into the vendor/OS-agnostic framework I've already started building, and I'm actively working on solutions for subagent MCP access, multi-operator coordination during engagements, and local model support.

---

## 9. What Changed

Every red teamer, the student members, and the gold team lead all told me the same thing: I am no longer allowed to say "I'm just a locksmith." As one of my year-long teammates put it: "You're a red teamer who happens to be paying the bills as a locksmith."

The mental shift is real. The entire year leading up to this, and before, I could not see myself as more than a locksmith who dabbled in cybersecurity research. That changed over these two days in a way I'm still processing. The most respected operators in the world, the people whose ideas and work motivated me to keep going when I hit one brick wall after another learning this craft on my own, now view me as a peer and an emerging AI specialist. I was approached by several individuals motivated to find me full-time red team employment. I've been asked to run an AI workshop at a cybersecurity conference (details not yet public). I've been asked to speak as an AI expert to advanced cybersecurity students studying career transitions. The red team has started a private server for collaborative AI tool development, where we're pooling ideas to build better and more local tooling together.

I submitted over 30 scoring tickets. I established persistence across multiple teams with multiple methods. I created golden tickets. I deployed memes. I walked around watching other red teamers and helping students. I gave intelligence to every member who needed it. I felt useful (genuinely, deeply useful) in a way that I haven't felt in a professional context before.

Where the salary expectations and the gap between locksmithing and security work once made me unsure, I am now motivated and ready. As one of my closest friends on the team, Egyp7, recently told me: just go get it.

---

## 10. For the Blue Teams

CCDC exists for education, and every student who competed at WRCCDC 2026 should know: you just experienced something that most working security professionals haven't. You defended networks against AI-augmented red team operations in a live competition with an AI blue team on the scoreboard. The organizers, team leads, and professional red teamers all made sure every blue team member understood that this was a unique opportunity to experience what the future of their career will look like, and how to defend a network given these capabilities. The fact that student teams outperformed the AI blue team in raw service defense says something important about the value of human judgment, prioritization, and the kind of creative problem-solving that comes from a team of people who care about what they're doing.

Your incident reports matter. Your inject responses matter. The organizers read every one, and the red team respects every team that fights back. Especially the ones that bribed us with cookies and squats.

---

## 11. Thank You

To the black team, for building the most ambitious WRCCDC network I've seen and for troubleshooting proxy issues in the middle of a live competition. To the orange team, for keeping blue teams on their toes and for creating the inject that led to the greatest printed letter in CCDC history. To the gold and white teams, for the scoring and logistics that made this event possible. To the Anthropic research fellows, for bringing genuine enthusiasm to this experiment, for fielding an AI blue team that gave us something truly new to hack against, and for the data that will come out of this engagement. To every student blue team member, for showing up, fighting hard, and learning from every hit. To every red team member I've had the honor of working alongside this year, for the generosity, the craft, and for making a red teaming locksmith feel like he belongs.

And to Swarnam, for doing what I built you to do.

---

## Links

* Swarnam: [https://github.com/Qweary/Swarnam](https://github.com/Qweary/Swarnam)
* Apparition Delivery System: [https://github.com/Qweary/Apparition-Delivery-System](https://github.com/Qweary/Apparition-Delivery-System)
* Previous posts: [ADS Showcase Recap](https://qweary.github.io/wrccdc-showcase.html) · [ADS v2.0](https://qweary.github.io/ads-v2.html) · [Invisible Streams](https://qweary.github.io/invisible-streams.html) · [ADS Introduction](https://qweary.github.io/apparition-introduction.html)

---

*AUTHORIZED COMPETITION. All red team activities described in this post occurred during sanctioned WRCCDC events on isolated competition infrastructure that was purpose-built and destroyed after the event. No production systems, real user data, or external networks were involved.*

— qweary
