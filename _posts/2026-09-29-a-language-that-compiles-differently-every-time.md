---

layout: post
title: "🎯📋 A Language That Compiles Differently Every Time 📋🎯"
date: 2026-09-29
author: Qweary
categories: [cybrseccon, cybrhakcon, ai village, agentic-ai, ai engineering, verification, talk]
tags: [cybrseccon, cybrhakcon, ai village, agentic ai, non-determinism, controls, verification, testing, mechanism, practice, lets encrypt, talk]
permalink: /a-language-that-compiles-differently-every-time.html

---

A Language That Compiles Differently Every Time
===============================================

*One hour on what you have to build around a language that recompiles itself every run, and a card you can run against your own controls in five minutes.*

---

The second of my two Houston talks went at ten in the morning on Wednesday, September 16, 2026, in room 320C on the third floor. Of everything I carried into that week, this is the hour whose reception I was happiest with. It was about treating generative AI as a programming language that happens to compile differently every time you run it. Then it was about what you are obliged to build around a language like that before you trust a word it tells you.

This talk was one of two I gave at the CYBR.HAK.CON AI Village at CYBR.SEC.CON in Houston, September 15 and 16, 2026. The recap of the village, the people, and the rest of the trip is in [Nobody Will Think You Ain't From Houston](/nobody-will-think-you-aint-from-houston.html). This post is the talk itself.

The whole hour comes down to a pair of sentences, and I got to them by way of somebody else's incident report. Agreement is not verification. Two checks that share a premise cannot audit the premise. I opened cold on that report so that nobody in the room had to take my word for any of it. The remaining fifty minutes were me showing how many shapes the same defect takes inside systems I built myself.

## The bug somebody else published

Let's Encrypt filed bug 1619047 in Mozilla's tracker.

They have a check that runs at the moment a certificate is issued, re-verifying that the domain owner still authorises them to issue for that name. It runs on the issuance path, where nothing has to remember to call it. That is a real control doing real work. In their words, when a request contained several domain names that needed rechecking, it would pick one domain name and check it N times. Ask it about ten names and it checks one name ten times, and nine names not at all.

The feature flag that turned the defect on in production went on 23 August 2019, and they confirmed the bug on 29 February 2020. That comes to 190 days of live exposure. I picked that start date on purpose, because their own timeline annotates the flag going on as the moment the bug first became reachable, and before that the defect existed and could not touch anybody. The window where a control is wrong is the window where it is running. Their forum post, their wording and their denominator, puts the blast radius at about 2.6% of their active certificates, which is roughly three million.

Now the part of it I actually came for. Two tests sat over that code and both of them passed.

The integration test, word for word from the report: "this integration test failed to find the bug because the test requests a certificate with only one FQDN in it." With a single name, checking one name ten times and checking ten names are the same thing, so the test had no way to tell those two cases apart.

The unit test is the one I would keep if I could only keep one. Their own comment says it exercises the broken code path, creating and retrieving an order with multiple authorizations, which is precisely the case that breaks. Then, still their words: "it does not adequately verify the contents of the returned authorizations, only that there were the correct number." It counted what came back, and it did not look inside.

Two tests agreed. Neither of them had ever looked at which names actually got checked.

They found it, they published it, and they published the reason both of their own tests missed it. That is the only reason the rest of us get to learn anything from it at all.

## The same defect in my own systems

The obvious objection is that none of this is really an AI story, given that it is a certificate authority and a unit test.

Here is how I have come to see it. Deterministic and non-deterministic systems share bug classes, and the difference is how the bug presents itself. Let's Encrypt got caught despite having two different checks that agreed with each other, and I have had that exact defect in my own work, where it took the form of two different agents agreeing with one another while performing checks. The checks in both cases were not aimed correctly. Green coming back hands the operator a false sense of safety, which is the opposite of the sense they should be taking from it.

That is not a second opinion. That is the first one, twice.

## A record that never says where it ends

The demo I shipped with the talk is three files, no dependencies, and about a minute of your time. It sits in the repo as unbounded-split (the README walks you through a null control that cuts the archive section off, which is the half that proves the matches were never in the records to begin with).

A file holds records under repeated markdown headers. Code that wants to check one record at a time splits the file on the record header pattern, which sounds fine right up until you notice that a record's end is never written down anywhere. It exists only as wherever the next record starts. The last record has no next header to stop at, so its end becomes end of file, and it absorbs everything below it, in this case a closed archive section that is not a record at all.

A per-record check then reads record plus tail. It finds an owner field and a Status field sitting down in the archive and attributes both of them to a record that contains neither. The first record, ITEM-0001, comes out at 51 bytes. ITEM-0002 comes out at 124, where the clipped splitter reports 48, because it is carrying 76 bytes that belong to the archive.

Notice what does not happen. No exception. No warning. Exit status zero. The two code paths are indistinguishable from anything except the value they return, so a log, a CI status, and an exit code would every one of them have shown you a clean run.

My own system left a note about that error which cuts to the heart of it. The entire control discipline, positive test plus null control, tests whether the instrument works, and it cannot test whether the instrument is pointed at the right thing. There is no control type for that. It proposed three candidate bounds checks and I killed two of them by measuring them. Byte conservation passes by construction, because a bad split misassigns bytes and does not lose them. An outsized-block check is wrong in both directions at once, quiet on real instances of the defect and loud on something that was not one. The foreign section header survived, and it survived for one reason, which is that it is the only one of the three looking at something the splitter does not own. The two that died compute over the split's own output, so they inherit its premises, which makes them controls in exactly the sense this hour spends its time complaining about.

Here is the part that makes it an AI story and not a parser story. The tests that were relied upon were written by the agents, and those same agents fell for the bug themselves, operating on false assumptions because their tooling and their code kept handing them deterministically correct answers. Same system, same bugs, same misaims, and the same misinterpretation caused by determinism being misclassed as accurate information about something it was misaimed at.

The determinism was real. The aim was not.

Hopefully that lands as an account of why I keep calling the new bugs a reskin of the old bugs.

## The card

The middle of the hour is a card, and I asked the room to run it on the spot rather than read it.

One control, not a pipeline. Specifically the one you actually trust, not the one you should have picked. If your answer needs the word "and" in it, you have named two controls, so keep the one that does the stopping. Answers are nouns, actions, months, and numbers, and a sentence with "because" in it is arguing with the card.

There are five questions on it, and the slide going into it says four, which is worth saying plainly rather than filing as a typo. The first four are the prerequisite for whether the fifth is even worth looking at. Questions one through four decide whether the thing is architecture at all. Question five is about coverage, and coverage on something that already failed one through four is not a question anybody needs answered.

Here is the card, definitions and scorecard together, the way it went up on the last slide, and it is yours to run.

### The definitions

- A control that fires because something executes is a **mechanism**.
- A control that fires because somebody chose to perform it is a **practice**.
- Agreement is not verification.
- Two checks that share a premise cannot audit the premise.
- The window where a control is wrong is the window where it is running.
- Documentation is not a control.
- A refusal is only a control if something reads it.
- Mechanism is a verdict about architecture, not a verdict about correctness.
- The verdict is yours and it stays yours.

### The rules

- One control, not a pipeline. The one you actually trust, not the one you should have picked.
- Answers are nouns, actions, months, and numbers. A sentence with "because" in it is arguing with the card.
- Every question asks what you can retrieve, not what is true. Two people with the same control and different access will get different verdicts. That is the instrument working.

### The questions

**1. Name the thing that runs it.**
A job, a hook, a tool, a box. Not the policy, not the team.
*Answer format: one name.*

**2. Who has to remember?**
For it to happen on the next change, who has to remember.
*Answer format: a name, a role, or "nobody".*

**3. Name the last time it caught something.**
The month it last stopped something that was actually wrong, and what it stopped, in three words. "It is always green" is not a month.
*Answer format: a month and three words, or "never observed".*

**4. I delete it tonight. What tells you?**
Silently, and your config looks unchanged. The first thing that tells you it is gone, and how long that takes.
*Answer format: one signal and one number, or "nothing".*

**5. Answer this one only if the first four came back clean. Who or what skips it, and how often?**
Almost every real control has an official way around it, like a ticket or a break-glass account. If a lot of traffic went that way last quarter, it is not covering that work. If there is none, say when it was last tried.
*Answer format: a way around and a number, or "there is none" and a date.*

### The verdicts. First hit wins. No averaging. No partial credit.

**1. DESCRIPTION.** Q1 named a document: a policy, a standard, a runbook, a wiki page, a training deck. It tells people or agents what to do, and nothing happens if they do not. Documents are useful. They are not controls.

**2. PRACTICE.** Q2 named a person or a role, anything that is not the word "nobody". It fires when somebody chooses, and it is exactly as reliable as that person on their worst day, in their worst week, under their worst deadline.

**3. UNEXERCISED.** Q3 came back with no month in it. "Never observed." "It is always green." "It catches things all the time." It runs, and you cannot produce one occasion on which it told a bad case from a good one. Either nothing ever asked it a question it could get wrong, or something did and you cannot get at it. Those are the same thing from where you sit.

**4. UNWITNESSED.** Q4 came back "nothing," or somebody choosing to go and look, which is an audit or a review. It runs, it has caught things, and you would not know the day it stopped. Everything you believe about it is a fact about its past.

**5. MECHANISM.** Q1 to Q4 all clean. It fires without you, and you would know if it stopped. That is all this says. It is a verdict about architecture, not about correctness, because nothing here asked whether it checks what you think it checks.

Nothing about this gets collected anywhere. When I ran it in that room nothing went up on a screen, and I did not want to know what anybody had written down. The verdict is yours and it stays yours, and that is most of the reason it works on you at all.

One shape on that card catches nearly everybody. A scanner runs on a schedule, it produces a report, and somebody reads the report. The machine is not the control. The reading is. The day it stops, the report still arrives.

## The numbers I can stand behind

This talk carries real numbers and the other one I gave that week carries none, and that is deliberate in both directions.

Byte-identical text, scored blind, returned two different scores. That is an observation with no size and no direction attached to it, and the slide says so.

A fixed identical input, scored unblinded, had one call write the thing, score the thing, and pass its own verdict on the thing. That specimen is the same incident I used in the other talk, the one where a verifier reported improvement because reporting improvement is what it had been told to report. I put it in both hours on purpose. It is my system, and I built the seam it fell through. A room that watches me be clever about somebody else's incident report and then hears nothing about my own will stop believing me, and it should.

The same three-word brief, run twice, gave 321 and 660 seconds, and 4,764 and 10,660 words (n = 2 runs).

Then the cost side, because determinism is purchasable and everything on that slide has a price tag. Blind paired scoring removed the self-grading, and it cost +67 seconds on average, range 48 to 106, plus one extra model call. Making the failure path report a parse failure instead of a fallback number bought the refusal to manufacture a result, and two of six runs then returned no number at all. Whether blinding moved the spread, these runs cannot say.

Those are three instruments over three separate populations. There is no combined number, and I will not be producing one.

The other talk publishes nothing because I went looking for the transcripts behind its figures and could not produce them, and one of the withdrawn figures turned out to be the arithmetic difference between two of the others. These ones I can stand behind. Those ones I could not, so out they came.

## The thing I named twice and shipped zero times

Determinism is purchasable. In places. At a price. That is one slide, and the slide directly after it describes something I have not built.

It is a memory design with its decay condition written into it. It would write down whatever it flagged as important, subjects and a line of summary and the notes that mattered, filtered by what it is currently trying to do. Beside each one it would log a pointer: a section, a line range. The job is not to hold the content. The job is to jog a memory later, so that it re-reads the part that matters instead of the whole file. And it has to be thrown away every session, because line numbers move and sections get renamed, and if you keep it any longer you have built the thing this talk is about.

I named it twice on stage and I have shipped it zero times. Nothing in it is running. The design comes from how I remember things myself, and it is still not implemented. The honest reason is that I have been developing hard. I have over four hundred tickets I opened against my own work, and there are only so many tokens and hours in a day.

The principles from the determinism slide are a different story. Those I have definitely been putting in, in various places, as needed, based on the problems I see and where in the system those problems sit. The trick is knowing when and where to place the determinism, and especially why, without crippling the strength of the AI being non-deterministic, because that non-determinism is the unique thing and it can be used as a unique strength.

I do not think there will ever be right ways to implement these concepts, any more than there is one right way to implement a large number of concepts in traditional software engineering. It is the one who makes the systems that puts the care into its structure, and ultimately finds the spots they were blind to while implementing those checks and balances. Architecture and system design are not going anywhere, especially now that we have more than just humans acting as non-deterministic agents.

The design is still not running. The principles are.

## The forever problem

Everything above is a control that fires. None of it is a control that is aimed.

No control type tests where the instrument points. Nothing on that card asked whether your control checks what you think it checks, and MECHANISM is a verdict about architecture rather than about correctness for exactly that reason. A control that runs, reports green, and certifies a property its body never exercises passes every gate on that card, mine included.

So here is the version I would say to one person instead of to a room. How do you know you are seeing what needs to be seen? How do you know that you are aiming your tests at the right part of the code? How do you know that your green is not giving you a false sense of security, in that you made the tests, you have the results of the tests, but do you know for a fact that those tests truly cover the error you are watching for? Architectural and complex system problems are here to stay, whether it is a deterministic traditional programming language or a non-deterministic AI programming language.

And then the line I put under all of it, which is the sharpest thing in either deck. Every failure in this talk was caught. The ones that were not caught are absent by construction.

Run it on your second control this week. That is the one where it hurts.

---

## The rest of the series

- [Nobody Will Think You Ain't From Houston](/nobody-will-think-you-aint-from-houston.html): the village, the room, the people, and BSides Houston.
- [Swarms That Fight and Fix Each Other in a Cage](/swarms-that-fight-and-fix-each-other-in-a-cage.html): the red team against blue team cage, what improved between rounds, and what a cage match cannot tell you about a real network.
- [github.com/Qweary/ai-village-2026](https://github.com/Qweary/ai-village-2026): slides, speaker notes, and the demos from both talks.

The underlying swarm generation framework remains unpublished.
