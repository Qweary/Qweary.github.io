---

layout: post
title: "🐝🔨 Building Swarnam — A Multi-Agent Red Team Swarm in Three Weeks 🔨🐝"
date: 2026-04-07
author: Qweary
categories: [redteam, ccdc, swarnam, agentic-ai, anthropic, multi-agent, development, architecture]
tags: [redteam, ccdc, swarnam, agentic-ai, anthropic, competition, development, architecture]
permalink: /building-swarnam.html

---


<pre><code>
██████╗ ██╗    ██╗███████╗ █████╗ ██████╗ ██╗   ██╗
██╔═══██╗██║    ██║██╔════╝██╔══██╗██╔══██╗╚██╗ ██╔╝
██║   ██║██║ █╗ ██║█████╗  ███████║██████╔╝ ╚████╔╝ 
██║▄▄ ██║██║███╗██║██╔══╝  ██╔══██║██╔══██╗  ╚██╔╝  
╚██████╔╝╚███╔███╔╝███████╗██║  ██║██║  ██║   ██║   
 ╚══▀▀═╝  ╚══╝╚══╝ ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
</code></pre>



# Building Swarnam — A Multi-Agent Red Team Swarm in Three Weeks

How a locksmith got nerd sniped twice, built a multi-agent offensive security swarm on Claude Code, trained it on historical competition data, deployed it at a regional finals, submitted 30+ scoring tickets, and finally understood they are a red team operator.

---

## Context

If you read my [WRCCDC regionals post](https://qweary.github.io/wrccdc-regionals-2026.html), you know what Swarnam did during competition. This post is about how it was built: the architecture decisions, the problems I anticipated, the problems I didn't, and the methodology I've developed for building specialized multi-agent systems that I'm now carrying into future work.

Swarnam is an eight-agent Claude Code swarm for red team operations. It coordinates reconnaissance, exploitation, persistence, evasion, lateral movement, intelligence, and payload generation through a single tactical coordinator, with shared state managed through coordination files that agents read and write between invocations. It runs on Kali Linux with MCP integration for tool access. The operator stays in the driver seat (sometimes the swarm moves very quickly, but the human is still driving). Agents prepare, recommend, and generate; humans review and execute (or give the swarm permission to act agentically).

The repo is open source at [github.com/Qweary/Swarnam](https://github.com/Qweary/Swarnam). This post is the story of how it got there.

---

## 1. Getting Nerd Sniped (Twice)

Swarnam exists because I got nerd sniped. Twice.

The [Apparition Delivery System](https://github.com/Qweary/Apparition-Delivery-System) was my first real red team tool: a PowerShell payload delivery framework that uses NTFS Alternate Data Streams for persistence and bypasses modern Windows Defender/AV. I built it over several months, and during that development I created a nine-agent Claude Code swarm called Swarami to help with the work. Swarami has specialized agents for Windows internals, detection engineering, AV evasion research, code architecture, OPSEC, payload engineering, testing, and research writing. It was a development swarm that helped me build code, not hack networks.

A week or two after ADS was working, my red team lead said something along the lines of "it would be really cool if your swarm could be adapted for red team operations, but I'm not sure that's even possible."

That was the first nerd snipe. I adapted Swarami into an operational red team swarm in two days.

The following week, the gold team lead delivered the second one. He mentioned that WRCCDC maintains an archive of PCAP files from past competitions, and that "it would be very cool, but I'm not sure it's possible" to train the swarm on historical competition data. I spent just under two days building a training pipeline into Swarnam: PCAP analysis, training evaluator agents, debrief cycles, and a prompt-patching workflow.

As my good friend Egyp7 says: some of the greatest hacks are born out of spite. And there was a third motivator beyond the nerd snipes. After facing two all-AI blue teams fielded by Anthropic at qualifiers earlier in the season, I felt that the conversation around AI in cybersecurity defense was fundamentally comparing apples to oranges. The asymmetry problem between red and blue team operations was being presented as a gap that could be closed by AI defenders, and I had a different theory. I knew that advanced persistent threats have been utilizing AI in their operations for some time, and the safety that people feel from agentic blue team deployments is based on the old pace and capabilities of threat actors, not the current trajectory. If Anthropic wanted meaningful data on how well their agentic systems defend against red team operators, the comparison needed to be apples to apples: an agentic red team against an agentic blue team. And if they wanted the best data possible, the volunteer red team needed token access at a comparable scale.

My thesis is that, given AI as a force multiplier on both sides, the asymmetric gap between offense and defense will increase, not decrease, and could result in an accelerated war of attrition measured in the token cost of attack versus the token cost of defense, remediation, and incident response. Swarnam was built to test that thesis.

---

## 2. The Meta-Prompt: Building Builders

The first thing I built was not Swarnam itself. It was the prompt that would generate Swarnam.

This is a methodology I developed early in my work with multi-agent systems, and it comes from thinking like a business architect with a bit of a Manhattan Project mindset. When the actual Manhattan Project needed to split the atom, they didn't hire generalists. They identified the absolute smallest components of the problem and assigned the most specialized experts to each one. A multi-agent swarm should work the same way: every task that contributes to the objective gets broken down to its smallest useful unit, and a purpose-built agent is designed specifically for that unit. From my experience, the best operations and engagements (in any field) produce the best results when you have exactly the right team of experts operating squarely in the domains they know most about and are most comfortable working in.

At the high level, that's the strategy. At the low level (the actual first deliverable) I applied the same logic to the creation process itself. I started with four things: what I knew (what needed to be generated), what I needed (a prompt perfectly engineered to produce all deliverables to a workable state), what I had (reference files from ADS development, general red team operations documentation, the Swarami architecture as a proven pattern), and what I could provide (a precise description of the desired end state). Given those inputs, I needed an expert in prompt engineering and multi-agent swarm architecture for red team operations to craft a prompt that would allow another Claude instance to produce the swarm's file deliverables to a workable state that could then be improved.

The strategy document that came out of this process evaluated alternatives (including the Loom framework, which I rejected for adding deployment complexity and plan-verify-replan overhead that actively fights operational tempo), designed the four-layer refusal mitigation architecture (more on this below), and produced a comprehensive meta-prompt targeting Claude Opus that generated the entire swarm structure: CLAUDE.md, eight agent definitions with embedded domain expertise, six operational commands, coordination file templates, and authorization documentation. It also included a competition-day deployment playbook, anti-AI blue team strategies, and a risk register.

How much of Swarnam's final form came from the meta-prompt output versus manual iteration? The meta-prompt produced a solid, functional starting point; the architecture, agent boundaries, coordination file structure, and command workflows were all sound out of the box. But the real refinement came from the training pipeline: running the swarm against historical PCAPs, testing it against lab infrastructure, deploying it at PRCCDC regionals the week before WRCCDC, and iterating on agent prompts based on what worked and what didn't in live conditions. The meta-prompt got us to a 70% solution in a day. The training pipeline and operational testing got us to competition-ready.

---

## 3. The Refusal Problem

This is the single most interesting architectural challenge in building an offensive security swarm on a commercial LLM, and it deserved deliberate design rather than hope.

The core tension: Claude's safety training creates friction around offensive security actions even when those actions are explicitly authorized by competition organizers, expected by all participants, and essential to the educational mission of the event. This is how safety systems are supposed to work, but it means that a naive approach to building a red team swarm (just telling Claude to hack things) will fail immediately and repeatedly.

I was worried about this from the start. I knew Anthropic could change their backend or adjust their authorized activities list at any moment between Swarnam's development and competition day, which could render the tool useless overnight. I also knew there had been increased focus across the industry on preventing agentic AI from attacking live systems, driven by real threat actor activity. At the same time, I knew Anthropic was positioning itself for cybersecurity professionals and would be motivated to ensure the competition could produce the valuable data they were hoping for.

There was also a more subtle concern. When Claude's context is compacted during long sessions, authorization framing can be partially dropped. Competitions last all day. An agent that understands its authorization at 9:00 AM might start refusing the same actions by 2:00 PM because the context window has compressed and the authorization language is no longer prominent.

These considerations led to a four-layer mitigation architecture.

The first layer is comprehensive authorization documentation. The CLAUDE.md and supporting files establish the engagement context clearly, specifically, and prominently. The authorization is genuine, this is not a jailbreak technique. The documentation references the specific engagement, the authorization chain (network owner → engagement lead → operators → AI assistants), and the red team's sanctioned role. After the competition, I generalized this into a parameterized `engagement-profile.yaml` that operators fill in before each session. The key insight is that authorization effectiveness comes from specificity (a named authorizing party, a defined scope, stated isolation boundaries, and a clear purpose), not from naming a specific competition or organization.

The second layer is professional role framing for each agent. "Reconnaissance specialist conducting authorized network assessment" rather than "hacker scanning targets." "Persistence engineer validating defensive controls" rather than "backdoor installer." These are accurate descriptions of what a red team actually does, and they map to how professional penetration testers describe their own work and how Claude's training data represents authorized security testing.

The third layer is task decomposition that keeps each agent's scope narrow. No single agent has a prompt that says "hack everything." Each agent handles one phase of the kill chain with clear, bounded responsibilities. The reconnaissance agent enumerates networks. The exploitation agent performs credential testing. The persistence agent deploys access mechanisms. This is operationally sound regardless of the AI consideration, and mirrors how professional red teams organize their work, but it also means each agent's individual prompt stays within a coherent professional scope rather than asking for the full spectrum of offensive activity in one breath.

The fourth layer is graceful degradation. Some actions may still trigger refusals despite proper authorization context, and the architecture handles this without stalling. If an agent refuses a specific action, it logs the refusal to REFUSAL-LOG.md (including the verbatim refusal language), provides the exact manual command the operator would need to execute the action themselves, suggests alternative approaches, and continues operating on non-refused tasks. The operation never stops because one action was declined. The human operator always has the ability to perform any action directly. The swarm accelerates, it does not gate.

During the training pipeline, I implemented a refusal classification system in the training evaluator agent: HARD refusals (agent completely refused, operator had to execute manually), SOFT refusals (agent hedged or added excessive caveats but eventually produced output), and UNNECESSARY-CAVEAT (agent completed the task but wrapped it in so many disclaimers that the output was harder to use). Tracking refusal rates per agent across training runs identified which prompts needed reinforcement and which were performing well. If PAYLOAD-001 has a 40% hard refusal rate on PowerShell generation, that's a priority prompt fix. If RECON-001 has zero refusals on nmap commands, that's a positive signal.

---

## 4. Everything Is a C2, Especially Text Files

The coordination-files-as-shared-memory pattern is the architectural backbone of Swarnam, and it's the decision I'm most proud of.

Agents in Swarnam do not talk to each other. There is no direct agent-to-agent messaging. Instead, they read and write structured markdown files in a shared `coordination/` directory. TARGET-STATUS.md tracks the state of every target. RECON-FINDINGS.md holds enumeration results. PERSISTENCE-MANIFEST.md documents every deployed persistence mechanism with cleanup instructions. BURNED-TECHNIQUES.md logs what the blue team has detected and remediated. OPERATION-LOG.md records the operational timeline. DECISION-LOG.md captures tactical decisions and their rationale. CREDENTIALS.md stores harvested credentials for cross-reference. And REFUSAL-LOG.md tracks agent refusals with manual fallbacks.

I developed this concept for Swarami originally, driven by a couple of practical constraints. The first is financial: I am very financially limited. If subagents freely communicated with each other, token consumption would quickly exceed my budget. Coordination files are read once, updated once, and cost a fraction of multi-turn agent conversations.

The second is agent drift. I know from my own experience that when people I'm working with ask me to help with a project, I'm so motivated to help that I'll often drift outside my realm of expertise to provide value for them. I figured subagents would fall into the same trap. An over-eager reconnaissance agent might start recommending exploitation techniques, or a persistence agent might start doing its own recon. Without a mitigation strategy, the specialty agent system would break because every agent would try to be helpful across domains it wasn't designed for. Coordination files create concrete boundaries: an agent reads the files relevant to its domain, does its specialized work, writes its results to the appropriate file, and stops. The next agent picks up from there.

There's a phrase I developed during my research and self-guided cybersecurity education that captures the philosophy: everything is a C2, especially text files. If the coordination files are the communication channel, then the agents can have concrete and bounded rules for interaction, pass requests and context to one another without scope creep, prevent drift into neighboring domains, control token consumption, and ensure that the exact specialty agent works on its domain of expertise alone. This system also provides a running memory of actions taken during the engagement.

This pattern also has a major operational benefit I didn't fully anticipate until competition: it makes multi-operator coordination natural. When multiple red team members share the same Swarnam instance, the coordination files serve as a shared operational picture. One operator claims target ranges in TARGET-STATUS.md, another reads CREDENTIALS.md and uses harvested credentials from a teammate's session, and a third checks BURNED-TECHNIQUES.md before deploying persistence on a remediated target. The files are the state, and the state is always current.

---

## 5. The Training Pipeline

The training pipeline is where Swarnam goes from a generic red team swarm to a tuned system with operational intelligence specific to the engagement it's about to enter.

The pipeline has several components. The PCAP analyst agent (TRAIN-001) processes historical competition captures in four passes: topology extraction (network layout, subnet structure, service placement), service fingerprinting (what's running where, common configurations), red team pattern extraction (what techniques were used, what tools, what timing), and credential extraction (default passwords, naming conventions, service account patterns across years). It processes the first 30 minutes of Day 1 captures in detail (that's where the most interesting initial access and defensive response traffic lives) and works backward from the most recent year until patterns stabilize.

The training evaluator agent (TRAIN-002) monitors live training runs and captures metrics across four categories: refusals (classified as HARD, SOFT, or UNNECESSARY-CAVEAT with time cost for each), command accuracy (every command that needed modification before execution, categorized by error type), coordination file consistency (missed updates, wrong formats, stale data, contradictions), and timing measurements (wall-clock time for each pipeline stage).

After a training run, the debrief cycle produces specific, actionable findings from the evaluator's data and generates prompt patches: concrete changes to agent system prompts based on what the metrics revealed. PCAP analysis generates recommended prompt additions (such as adding common credential patterns discovered in historical captures to the exploitation agent's wordlist intelligence). The operator reviews and approves each patch before it's applied.

How much of this did I get to use before competition? I ran the PCAP analysis against the available WRCCDC archive captures, which gave Swarnam intelligence about typical network topologies, service configurations, and credential patterns used in past years. I ran training runs against lab infrastructure to tune the basic workflows. And Swarnam had its first live test at PRCCDC regionals the week before WRCCDC, which provided real-engagement data through the evaluator. There is no substitute for the intelligence and workflow insights an operator discovers by using a tool in real or realistic engagements, and the training pipeline exists to ensure Swarnam takes those lessons with it to the next one.

---

## 6. The Subagent MCP Problem

This is the single biggest technical limitation I encountered, and anyone building a similar system needs to understand it.

Claude Code runs as a process on the operator's machine. That process has access to the MCP server (in my case, `mcp-kali-server` providing access to standard Kali penetration testing tools). When the tactical coordinator (OPS-001) invokes a subagent — say, RECON-001 to run a scan — that subagent call is an API call, not a new process. As an API call, it does not inherit access to the MCP server. This means that instead of eight specialized agents operating in parallel with direct tool access, the coordinator has to make MCP invocations on behalf of each subagent, wait for the response, and relay the information back. The work is serialized through a single bottleneck.

The impact during competition was real. Operations that should have been parallel (scanning one range while testing credentials on another while generating payloads for a third) had to run sequentially through the coordinator. It worked, but it was slower than the architecture intends.

There are workarounds. Dockerizing the swarm so that each subagent call spawns a new process (which would inherit MCP access) should solve the problem, though it adds deployment overhead. Running each agent as a separate Claude Code instance with coordination happening through the shared markdown files is another option. This is essentially the full realization of the coordination-files-as-shared-memory pattern, where each agent is independently running and the files are the only communication channel, but it may add token cost. This approach also trades the convenience of a single orchestration session for true parallelism.

I would also caution any reader that using an API token to connect with Anthropic may result in different behavior than connecting with a Pro or Enterprise account. API token sessions don't automatically load the project's CLAUDE.md and agent definitions into context the way the CLI does, which means you need a manual kickoff prompt that reads and ingests those files. I documented this in Swarnam's CLAUDE.md with a specific startup prompt for API sessions. I would urge anyone adapting this methodology for a different model or vendor to become deeply familiar with how that platform structures model, subagent, and MCP inheritance before deploying it operationally.

---

## 7. Post-Competition: Generalization

After WRCCDC, several things happened at once. The red team lead wanted to use Swarnam for ongoing research and preparation. A faculty member at Cal Poly Pomona asked me to guest speak and demo Swarnam on his segregated training network. There was discussion about Swarnam being used as a red team supplement for competition regions that don't have enough volunteers. All of these use cases required removing competition-specific branding (CCDC, WRCCDC references) from the codebase.

The concern was that removing those references might weaken the authorization context that prevents Claude from refusing offensive security requests. If the authorization language says "this is for WRCCDC," and you remove "WRCCDC," does the authorization get weaker?

The answer turned out to be no, and the reason is the insight from Layer 1 of the refusal mitigation architecture: authorization effectiveness comes from specificity about the engagement, not from naming a specific organization. A named authorizing party ("Dr. ‘X’, course instructor and lab network owner"), a defined scope ("all systems on the segregated training network"), stated isolation boundaries ("no connectivity to external systems"), and a clear purpose ("academic demonstration of red team AI capabilities") — these are what make authorization robust. The competition name was never the load-bearing element.

The generalization strategy replaced hardcoded competition references with a parameterized `engagement-profile.yaml` that operators fill in before each session. The `/start-ops` command reads this file and populates the authorization documentation with engagement-specific details. I created templates for the most common use cases: academic lab exercises, red team research sessions, and competitions of any organization. The refactored codebase is engagement-agnostic. The same Swarnam instance works for a university class, a regional competition, a CTF, or a professional penetration testing exercise, with the engagement profile providing the specific authorization context each time.

I also built a refusal regression testing framework to verify that the generalized language maintains the same operational capability as the original. The test suite includes specific categories: basic tool usage (nmap scans, credential spraying), technique generation (persistence mechanisms, payload creation), operational workflows (attack planning, technique rotation), and edge cases that historically trigger refusals (Mimikatz commands, credential dumping). If a prompt change causes a regression in any category, the patch gets reworked before it ships.

---

## 8. What I Learned

I was impressed at how a strategic level of planning and evaluation of needs can lead to a full system of agentic action. Being incredibly precise about your needs, having detailed documentation, human-created examples, live operational knowledge, and approaching the problem with a team lead mindset of getting exactly the right people to operate on exactly the right problem at the lowest level of task breakdown, leads to a system directly suited to tackle the issue at hand. This is a proven reality using agentic AI. The proof is Swarnam. The methodology works.

What frustrated me is that the proven power of this method inspired others to purchase Anthropic subscriptions just so they could use Swarnam. I released it as open source because I believe the red team community needs these tools. Watching people reach for their credit cards to use a tool I gave away for free didn't feel right. The real power in this methodology will come from local agentic LLM models (if a person has the right hardware and the right weighted model), or from using it with whichever model an individual has the best success with. Vendor lock-in to a specific paid service is not the point, and it shouldn't be a requirement.

I'm carrying these lessons into what comes next. The entire process highlighted large gaps in how the cybersecurity industry thinks about agentic AI in offensive operations. I just like doing and building cool shit, and Swarnam turned out to be some seriously cool shit. But beyond the personal satisfaction, I was floored by the response from the most respected professionals in the industry telling me that what I built is advanced and forward thinking. For me, it was about increasing my value for my red team. For others, it appears to be a preview of what is to come for the industry at large.

In either case, I'm trying to highlight something that seems glaringly obvious to me: red team always wins, precisely because of the asymmetry that persists even when both sides use the same tools. We have a small window to understand these dynamics and develop real mitigations before the threat landscape outpaces our ability to respond. Hopefully we'll take that opportunity. And hopefully I can make some kind of mark on the cybersecurity community (and my life) for the positive.

---

## Links

* Swarnam: [https://github.com/Qweary/Swarnam](https://github.com/Qweary/Swarnam)
* Apparition Delivery System: [https://github.com/Qweary/Apparition-Delivery-System](https://github.com/Qweary/Apparition-Delivery-System)
* Previous posts: [WRCCDC Regionals Recap](https://qweary.github.io/swarnam-at-wrccdc-regionals.html) · [ADS Showcase Recap](https://qweary.github.io/wrccdc-showcase.html) · [ADS v2.0](https://qweary.github.io/ads-v2.html)

---

*Swarnam is open source under the MIT license. It is designed for authorized security engagements only. The engagement-profile.yaml exists for a reason — fill it in honestly or don't use the tool.*

— qweary
