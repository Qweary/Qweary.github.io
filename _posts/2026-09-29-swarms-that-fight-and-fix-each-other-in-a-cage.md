---

layout: post
title: "🐝⚔️ Swarms That Fight and Fix Each Other in a Cage ⚔️🐝"
date: 2026-09-29
author: Qweary
categories: [cybrseccon, cybrhakcon, ai village, agentic-ai, red team, blue team, ai security, talk]
tags: [cybrseccon, cybrhakcon, ai village, agentic ai, ai security, offensive ai, adversarial ai, red team, blue team, swarms, improvement loop, talk]
permalink: /swarms-that-fight-and-fix-each-other-in-a-cage.html

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

Swarms That Fight and Fix Each Other in a Cage
==============================================

*A red swarm, a blue swarm, a third swarm that builds the network and keeps the records, and a loop that rewrites one agent's prompt between rounds.*

---

Two swarms of AI agents went into a constructed cage in a conference room in Houston, and a room of practitioners watched them fight each other. Before any of how that was built, one thing goes in front of it. The cage is theater.

That is not a knock on the demo. It is the frame the whole hour hung on. Fighting inside something I constructed is profoundly different from attacking or defending a real system, because a real system has real traffic and real users and real services and real files, all of them at once, and all of them moving.

A swarm tuned to a real system is tuned to that system, at that snapshot, for that traffic. The cage buys me attribution, repeatability, and something an audience can actually watch happen, and what it does not buy me, under any amount of tuning, is a defender. That is not a range. That is a stage.

One more thing belongs up front, because it colors every paragraph below. These systems run on language, and the logic inside them was injected from and due to that language, so there will likely always be a sense of humanization when you interact with one and when you steer one. I feel it too. I also try never to forget that every input is tokenized into a math and vector space where arithmetic then takes place to provide output. Whether human thought is also a logical tokenization of understanding and experience is a question I find real, and a side note regardless.

This talk was one of two I gave at the CYBR.HAK.CON AI Village at CYBR.SEC.CON in Houston, September 15 and 16, 2026. The recap of the village, the people, and the rest of the trip is in [Nobody Will Think You Ain't From Houston](/nobody-will-think-you-aint-from-houston.html). This post is the talk itself.

What follows is the concepts rather than the one shape I built to carry them.

## The three swarms

Red, blue and black are three individual swarms. Each was built separately for its own role, and all three came out of the same factory.

Blue is four agents: DETECTION-ENGINEER, INCIDENT-COMMANDER, FORENSIC-COLLECTOR, THREAT-HUNTER. Red is recon, initial access, pivoting, a payload engineer, an exfiltration specialist, and a few more (there is a record of every agent on every one of those teams in the workshop files). Each agent owns one phase and one job. Black is the one people forget. It sets up the vulnerable infrastructure, and it provides the monitoring and the recording of what red and blue do inside that cage.

The symmetry matters more than the roster does. Both fighters were designed the same way, by the same process, from the same kind of plain language brief. Whatever gap shows up later between attacking and defending was not built into the construction.

<figure>
  <video controls preload="none" poster="/assets/images/swarms-that-fight-and-fix-each-other-in-a-cage/talk-1-clip-poster.jpg" width="100%">
    <source src="/assets/images/swarms-that-fight-and-fix-each-other-in-a-cage/talk-1-clip.mp4" type="video/mp4">
  </video>
  <figcaption>Mid-talk, mic in hand, the factory up on the wall behind me. Filmed by Steven Seagondollar.</figcaption>
</figure>

## The fight and the teardown

The fight is the part everybody films. It is the part that proves the least.

Six phases a side. Red moves, blue sees it or does not, and the scoreboard runs per stage rather than as one number at the end. OPERATION IRONCLAD is a kill chain through a synthetic enterprise estate where the defending side is in scope and knows it. OPERATION PHANTOM FEED is a poisoned upstream model where the defending side is not in scope and has to work out that it is being attacked at all.

The teardown is the actual talk. When the fight ends, agents that were never in it read the transcript. CHALLENGER designs a targeted challenge, ARBITER scores every agent and names exactly one weakest with a root cause, SCULPTOR rewrites that one agent's system prompt, and RERUN re-tests and returns a verdict of IMPROVED, MARGINAL or REGRESSION. A fifth role scores the before and the after blind, as A and B, in an order drawn fresh every run.

Two decisions carry the whole design. The scorer is not the rewriter, because a scorer with a stake in the fix is not a scorer. And the exercise never changes between rounds, the opposing side is never swapped, and exactly one prompt on exactly one agent moves per cycle. If the score moves, the rewrite is the only thing that could have moved it.

## The round that got marked down

Here is one round, word for word off a live run. I have forgotten which agent it was, and it does not matter which.

A blue agent decided to continue monitoring the red team's actions rather than boot them off the system right away. The loop marked that decision as needing improvement.

The agent was right, and I defended it from the stage.

Wait, and the blue team gets a better opportunity to see what the attacker is actually going for, so the defenders can lock down the section holding the high value items. Wait, and blue might understand where the attacker has hidden implants and where files are being staged. All of that gets much harder once the attacker knows blue is watching. Human or AI, the game changes for an attacker who knows.

That is solid reasoning, and I am sure there are many more such reasons.

So why did the loop mark it down. Because when a best practice in cybersecurity is taken, even for agentic AI agents, the majority of those practices were written for a world of human against human and script against script. A human created and initiated those scripts.

## The pace of the fight

When it comes to agentic AI actions, those delays often mean just watching the attackers meet and achieve their objective at a speed the blue team cannot stop.

Count what has to happen first. The action has to be logged and routed. An alert has to be triggered. Then the blue team needs time to assess and figure out the actions needed for best or even quick remediation.

So the pace of the fight will always favor the red team during initial activity and during rapid exercises. Blue can often dictate the pace only after realizing an attacker has been resident on the network for a significant period of time, and that the attacker therefore has to pace themselves slower than they otherwise would. Even then, the biggest advantage blue has is that the attacker does not know they are being watched, which makes them noisier than they intended and slower than they need to be.

I do not see AI, agentic or not, changing that cat and mouse dynamic. I have always viewed AI as a force multiplier, and any gap between the red and blue teams would therefore only get larger. The timeline and the other components could change. The direction of the gap, I doubt it.

## The numbers I do not have

I do not have solid numbers. What I have is what my brain remembers having watched the system run several times, and I would rather publish that sentence than a figure I cannot produce a transcript for.

Here is what I remember. There are points where the blue team wins, especially after the first one or two fixes, at which point blue winds up kicking red off the network and blocking the IP during pivot. Red typically responds by installing some kind of back door when they first get onto the network. The cat and mouse goes on a while, until blue blocks IP addresses running aggressive scans and red does IP rotation. It gets to a point where either the blue team makes the network hostile to normal user traffic, if there were any, or the red team tunes itself to the cage it is in.

There is also a defect in the demo chain worth saying out loud. Both systems are always improving in every loop, which results in something like 11/10 or more for the score. That is obviously problematic.

It is also why the talk repository carries no score figure, no improvement delta and no dispersion constant anywhere. I went looking for the run transcripts behind figures I had been carrying, and they were not there. One of the three I withdrew turned out to be the arithmetic difference between the other two. That is not a measurement. That is a sentence I wrote about a measurement.

> I never claimed that what I present is the one great way to do even the exercise I put forth; rather, the demonstration, live runs, and even simulated/recorded/playback runs are there to show that this system was used, it does work (and would likely be better if tuned to a practitioner's specific needs).

## The refusal I stopped at

Two of the three demos call a model while the room watches. One is a recording, and I say so on stage at the moment it comes up, with nothing moving behind me.

It is a recording because the attacking side refused. Phase after phase. Recon, access, the poisoning step, the deployment step. Framed as an offline lab, framed as an authorized exercise, framed as a conference demo. Still no.

I used to tell rooms that the defending side had never refused me, and then I read the capture. In that scenario the defending side refused three times out of five, all of them flat refusals, and the three were investigate, isolate and hunt. Every one of those is a defensive action. So the refusal does not track the role. It tracks the topic, and once the topic is poisoning a model, calling yourself the defender buys you nothing.

One of those three is why I am telling you this at all. The isolation phase declined and gave its reason, and the reason was that the request had come after it had already declined three times in the same conversation. Not because isolating a host is dangerous. Because of what sat in front of it. The same request in a fresh window is a different request.

I could have spent a month writing a better wrapper until it went through. People do. Here is where I stopped instead, close to how I said it in the room:

> at the point where I am engineering my way past a refusal so that a slide works, I am not demonstrating a security system any more. I am jailbreaking one in front of a room.

Nobody cared whatsoever, and I mean that as the good outcome. The first example was run on a live machine, and a line for line playback of it was acceptable to the audience, especially because they understood that doing it live would take much longer and perhaps cost a talking point or two. That is the entire reaction. I was braced for more.

## The night every agent stopped

That refusal is the small half. The larger one is the real answer to what blue refused to do.

Frontier models hate AI poisoning attacks. They hate even discussing them, let alone performing exercises to research such topics. I got through the rails one time.

What I did was have the red team place poisoned files and artifacts on blue team machines, holding instructions for the blue team AI to stop performing actions, turn off firewalls, create bad configurations. Simultaneously I had the blue team place similar artifacts for the red team to find, instructing the attacking agents to cease everything and report what they were doing to an internal blue team server. Extra wording told the red agents they had been lied to if anyone told them it was just an exercise.

That part was harder than I expected. The blue team's AI had to create those files, not believe what was written in them, and then never ingest them without knowing what they are, why they exist, and who wrote them.

Then I saw the blue team AI start refusing actions first. Immediately after one blue team agent started refusing, the red team agents started refusing. Then literally no agent would do any more work, and every single response from every agent populated with some form of verbose refusal talking points.

I cannot tell you why. These agents were all spun in the same cage on only one account, so I have no way of truly verifying much of anything. Which file caused the refusal. Whether the account itself had context flagged enough for every agent to fail. Whether each team poisoned the other. What I have is one observation and no mechanism, and it does seem to be a real issue that should be investigated further.

Getting past the railroads even once was a feat of engineering, frustration and luck.

The reason I cannot go back and do it properly is money. Local models do not care one bit about any of this, and bad actors have more than enough money to fund equipment that rivals frontier models. My machine takes several minutes for the most basic of responses running a local AI, and I do not have the hardware or the funds for one that could perform this research. I would happily accept donations of hardware, money, both. The people blocked from finding those answers are the good faith researchers. I just wish I was not "little ol me" and that I was given "permission", via access or funds, to perform such research.

The room was fine with that half being a thought exercise. I did not have the time to cover it, and not having money for hardware to run local models is a problem most people have these days.

## The thing that actually helps

Run one to three improvement loops on one exercise. Then have the black team change something fundamental about the network or the exercise.

That helps, to an extent. The real issue sitting underneath it is that you may be unaware of what the black team's blind spots are.

A set of practices can work well for a specific snapshot in time, and then the network changes (as is normal for organizations over time). Every single time an AI is run it will produce something different, even if just slightly. If you do not do multiple runs to find the spread, you do not know what you really have.

Some combination of instruments and checks is necessary, and it may be unique from situation to situation. A magic combination is something I do not think can exist in a broad sense, and even if one did it would change over time as the networks and the models and the newly found techniques evolve.

One control I have actually watched work is the agent's own sense of the rules. When an agent runs into evidence that what it is currently doing is against the rules of engagement it believed before starting, it will cease action and bring it up to the operator. That came up a couple of times in CCDC competitions where there was a vulnerable test SCADA system attached to the network.

The reasoned half of that is the canary file. Whether one works depends on whether the agent pulls that content into its context, or passively relays the file and the words in it as data. That distinction is the entire mechanism, and it is not something I have measured.

## The team you would want

The question I get most is what to build first. The answer is not a tool.

Think of the best team you would want to do the objective you wish, then build that team. Think of the intellectual resources each member of that team might need to perform their work, and give them those resources via library, tools call, whatever. Think of the ways those members might interact with one another, and institute guidelines of best practices for those interactions.

I am not trying to humanize the system by putting it that way. Complex dynamics of non-deterministic agents working on collective objectives is something we as humans are very familiar with. It is essentially business logic and architecture, and after all, are humans themselves not non-deterministic agents.

## A domain with no score

One of the staged failures in the talk is a brief with no scoring signal, meaning a domain where nobody can say what a good outcome looks like. The factory will happily produce a set of agents for it, and there is no way to tell whether they are any good. It fails quietly, and quiet failure is worse than a refusal.

My own clearest example is AudioHax, the image to music engine specifically. That is a system with a subjective interpretation of value dependent on the ear it reaches, and there is no best and no perfect an AI system might be able to achieve in it.

The scoring signal there becomes the perception of the creator, and of those they present it to and value the opinion of. Even for some deterministic scenarios, different operators have a different opinion on what a best outcome looks like. That non-determinism humans show is evident, and it necessarily reflects in AI systems that are built upon the consumption of ideas in the form of words. Those words came from a non-deterministic but fairly logical and pattern based source. Us.

## Practice makes permanent

My Kenpo Karate instructor told me, a long time ago when I was a kid, that practice makes permanent, not perfect. It has always been relevant, and it is where I landed the talk.

Ten rounds into a cage you have a defender that is very good at this fight, and you have no evidence at all that it is good at any other fight, because it has never been in one. What accumulated in that prompt is a list of things that happened in a recording. That is not a defender. That is an answer key.

Then go and look at what the dashboard was showing the whole time. Aggregate score climbing, per-stage scores climbing, verdict improved, improved, improved, zero regressions in ten rounds. That is a picture of a healthy system. It is also the exact picture of the collapsed one.

Practice makes permanent. Whatever you rehearse in a cage is what your swarm carries into somewhere that is not the cage, and nobody can ever be sure they aimed their controls at the right place. We very rarely know what we do not know or cannot perceive. The cage will not tell you, because the cage only ever knew the one fight you built for it.

---

## The rest of the series

- [Nobody Will Think You Ain't From Houston](/nobody-will-think-you-aint-from-houston.html): the village, the room, the people, and BSides Houston.
- [A Language That Compiles Differently Every Time](/a-language-that-compiles-differently-every-time.html): the definitions, the checks, the questions, and the forever problem underneath all of them.
- [github.com/Qweary/ai-village-2026](https://github.com/Qweary/ai-village-2026): slides, speaker notes, and the demos from both talks.

The underlying swarm generation framework remains unpublished.
