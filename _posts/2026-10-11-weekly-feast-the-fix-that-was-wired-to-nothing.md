---

layout: post
title: "🍽️🧊 weekly-feast: The Fix That Was Wired to Nothing 🧊🍽️"
date: 2026-10-11
author: Qweary
categories: [side project, meal planning, claude, agentic-ai, verification]
tags: [side project, meal planning, weekly-feast, claude, agentic ai, food safety, xss, testing, verification, mechanism, practice]
permalink: /weekly-feast-the-fix-that-was-wired-to-nothing.html

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

weekly-feast: The Fix That Was Wired to Nothing
===============================================

*A cleanup pass on the meal planner I built for my spouse, a safety fix that turned out to be checking nothing, two stored XSS bugs that were live on the public app, and the plan to call the whole thing finished.*

---

In March I wrote about [weekly-feast](/weekly-feast.html), the single HTML file I built after my spouse asked "What do I type?" I ended that post with an honest assessment. It was a v1, the prompt would need tuning against real weeks, and the only way to find out was to use it.

It got used. My household plans with it. It grew a phone layout in September. And somewhere along the way someone outside our house started using it too, and was enthusiastic about it, which is still a little surreal for a file you open by double-clicking.

That changes what a bug costs. When the only user is your spouse, a bad week is a conversation over dinner. When a stranger is planning their groceries with it, a bad week is something you shipped to someone you will never meet.

So before calling the build done, I ran a cleanup arc. The name in my notes is "residuals to close": every leftover finding from the earlier work either gets fixed, gets deferred with a named event that will bring it back, or gets declined with a reason. Four sessions, all on October 10, with a usage limit in the middle that paused everything until it reset.

The work is done the same way I described in March, only with more seats at the table. A team of AI agents, each with one job. One builds the app. One reviews food safety. One reviews usability on real screen widths. One hunts for security holes and anything that fails open. One owns the gate that every change has to pass before it can be pushed. A rule I am glad I kept: no check gets edited by the agent that wrote it.

Here is what that arc found.

## The fix that was wired to nothing

The app reads the plan Claude writes and puts small chips on the meal cards: what to take out of the freezer tonight, what to thaw in the refrigerator, what you can and cannot refreeze. Those refreeze sentences are the scary ones. One flipped word turns "do not refreeze" into permission to refreeze.

<figure>
  <img src="/assets/images/weekly-feast-the-fix-that-was-wired-to-nothing/weekly-feast-desktop-plan.png" alt="The weekly-feast Plan tab on a desktop screen, with the sidebar menu on the left and meal cards for Days 1 through 3. Day 1, Arroz con Pollo, carries a bold amber chip reading PUT IT IN THE FREEZER TODAY and a shopping day note saying there are three freezer jobs today. Day 2 has a timer chip saying to cook the rest of the fresh chicken thighs today, inside the 1 to 2 day window for raw poultry. Day 3 has an eat or freeze by chip for the cooked chicken." loading="lazy">
  <figcaption>A demo week the model planned, not ours. The chips are the part that has to be right every single time.</figcaption>
</figure>

Back in September an earlier session built a check for exactly that kind of flip, and the record said it was cured, gated, and re-cured.

When the food-safety reviewer went back to it on October 10, the cure was wired into no gate at all. The gate's own row for that check could not see an inverted sentence. A deliberately broken copy of the app only went red because a piece of text the test was anchored on had moved, and the message for that is "anchor miss." An anchor miss tells whoever is maintaining the test to go re-point the anchor. In September a reviewer tried exactly that on a deliberately broken copy, and got 9 passed, 0 failed, on a version telling households to refreeze food that had sat out over two hours.

"Gated" was true of a probe you had to choose to run. It was false of the gate.

If you read my Houston talk post, this is the [mechanism versus practice](/a-language-that-compiles-differently-every-time.html) line showing up in my own kitchen. A control that fires because somebody chose to run it is a practice. A control that fires because something executes is a mechanism. The cure was real. Nothing executed it.

It is now a hard part of the gate, along with a second check that holds every refreeze sentence on the chips against a signed reference list. The same broken copy now fails because the check itself says it failed, with its own message, and that was reproduced independently before anyone was allowed to call it done.

## The 90 degree rule nobody was watching

While tightening that, the food-safety reviewer found a smaller version of the same thing.

The app's food-safety wording uses the standard limits: 2 hours, or 1 hour when it is above 90 °F. That 1-hour rule was stated in exactly one place in the app, the body of the freezer checklist. Nothing checked it. Delete just that clause and every check came back clean. No test anywhere contained the text.

Now it is in the gate's population. Deleting only that one clause gives 96 pass, 1 fail, and the one red is the refreeze check saying it cannot certify the page. One sentence, one red row. That is the size a regression like that should be.

## The feature my spouse did not ask for, and the bugs it found

In the middle of all this I added a requirement of my own. Paraphrasing what I typed: give an existing user an easy way to move their pantry into a newly downloaded copy when they upgrade, and if it is a simple copy and paste, written directions are enough.

It turned out written directions were enough, mostly. The app has had Export All Data and Import Data since the very first commit in March. Every one of the 81 historical versions writes the same backup format. Old exports from four different eras went into the current importer, and all 21 of 21 pantry items came across with zero fields lost. The one real loss was Special Instructions, the free text box. The export had never included it, so anyone upgrading would silently lose whatever they typed there. That got built: backups now carry it and restore it without overwriting anything. Import still replaces rather than merges, so the directions say to export first and look before you import.

The new restore field meant a file from the user was now writing into something the app uses. That is untrusted input, so the security reviewer looked at the whole import path.

It found two HIGH severity stored XSS bugs in Import Data, already live on the public app. A crafted backup could plant script through the restored household size and plan days, which then ran on the Preferences screen and stayed there. A crafted pantry item id could land in inline event handlers on the Pantry screen, and that one did not even need a click.

These were not caused by the new feature. They were sitting in the import path the whole time. But the directions I was about to publish tell people to use Import Data, and there is a user out there who is not me. So they were fixed in this arc instead of filed for later.

The builder did a full audit of every place restored or pasted data reaches the page before fixing anything, and found five more spots the security review had missed. It also corrected the review's count of affected spots from 11 to 14. The review had counted lines with a grep, and some lines had more than one. On re-review, the security reviewer checked the builder's count and agreed. I like a team where the corrections go in both directions and both sides write them down.

After the fix, the security reviewer's 27 hostile test rows fire 0 times on the new app. On the old one, 21 of the 27 fire. Pantries still come across 21 of 21.

In March I closed that post with "security is hard, and maintenance is harder." I meant it as a shrug. I did not expect it to turn into a bug report.

## The gate had holes too

Every change has to get through a gate before it is pushed. The gate runs a set of child checks and also asks each child a trick question: here is a missing file, do you notice? A child that answers the same with or without its input is not reading its input, and the gate is supposed to catch that.

Over this arc the gate itself turned out to have holes, and they got closed one after another.

The first was quiet. A check meant to scan each change against the published app was diffing the working copy on disk instead. On a committed change that diff is empty, so it honestly reported "not applicable," on every run, and never once looked at a pushed change. Honest "not applicable" on every run is a dead row.

The second was a false pass. With the temp directory moved somewhere other than /tmp, a child that ignored its input sailed through the trick question. None of the real checks behaved that way, but the gate would not have noticed if one did.

The third one we made ourselves. The fix for the false pass only accounted for each test arm's own file path, which meant a child that quietly fell back to reading the working copy would pass again. It was not live yet. I did not defer it anyway. Leaving a fail-open hole we had just introduced, at the end of an arc whose whole point was closing them, was not something I was willing to ship.

The fourth is my favorite, because the gate's verdict depended on how a file path was spelled. The gate pulled what it thought was the file's hash out of a child's output by grabbing the first long run of hex characters on the line. The scratch folder for that session had a UUID in its name, and the UUID had a run of 12 hex characters in it. So the gate read the folder name as the hash and failed good files. Flip it around, put a broken copy in a folder named after its own hash prefix, and it passed a bad one. Earlier that same day, an instruction to the agents to name their copy `app.html` produced seven false failures for a related reason. Now it only reads the hash that comes directly after the literal word `sha256`, and the gate gives the same answer across every path spelling the reviewers threw at it.

That last line of fixes ran three rounds. I have a standing rule for loops like that: rounds one through three run, and before a fourth, everything stops and asks me whether another round is worth it. Round three passed everything on its first pass, so nobody had to ask.

## The push

Pushing is my call, every time. I said yes on October 10, and two pushes in this arc went live for my household and for the third-party user.

The first, partway through, was mostly phone work. Shopping list rows got a real grid, because on a 360 pixel wide phone one tilapia note was wrapping to about 40 lines. The bottom navigation labels went up to 11px, Dashboard became Plan, the Export confirmation moved onto the button instead of a toast that covered the checklist, and the bought-frozen chip now leads with "NEVER ON THE COUNTER, NEVER IN HOT WATER."

<figure>
  <img src="/assets/images/weekly-feast-the-fix-that-was-wired-to-nothing/weekly-feast-mobile-pantry.jpg" alt="The weekly-feast Pantry tab on a phone. Tier 1, 2, and 3 tabs sit above a row for adding an item, then stock cards for flour, sugar, white rice, and olive oil, each with a green WELL-STOCKED chip. The bottom navigation bar runs along the bottom of the screen with Pantry highlighted." loading="lazy">
  <figcaption>The Pantry on a phone, bottom nav and all. This is the screen the upgrade directions are there to protect.</figcaption>
</figure>

The second carried the migration work: upgrade directions in the README and a line inside the app, Special Instructions in backups, the import hardening that closed the live XSS, a fix to a banner that pointed at the wrong button (it now says Prompt, then Edit Template, then Reset to Default), and an estimated-cost label going from amber to grey to match the rest of that card's details.

I want to be straight about what "closed" means here. The arc closed with every item fixed, deferred, or declined, and a good number are deferred. One example: if you buy raw meat for the refrigerator and nothing for the freezer, the shopping screen does not yet say the 2-hour rule for the trip home. A quick interim patch was on the table. It was not scheduled, partly because it would have changed chip copy before the check that guards chip copy exists, and when the question came to me I said no as well. The real fix rides in the next arc. Each deferral has a named event that brings it back. Deferred is not the same as done, and I am not going to call it that.

## The census that could not see the migration

The first session of the next arc, still on October 10, found one more of these before a line of code was written.

The app stores its prompt template under a versioned key. When the template version bumps, the migration code deliberately keeps the old key name around so older saved data still loads. My session-open check for "has the template moved off v11 yet" counted that old key name. Which the migration keeps. At the last version bump that count was 1 before and 1 after.

A census that cannot flip on the event it is watching is not watching anything. It now counts the one line that sets the current key, on both sides: old version 0 and new version 1 means the bump landed, and any other pair means go look.

## What comes next: done, on purpose

The next arc is called V12-TO-COMPLETE, and I wrote the goal myself: "I would like to be at a point where we can consider development in a complete state (awaiting issues found by users)."

The center of it is version 12 of the prompt template, the instructions Claude gets every week. The highest-risk item on the list is leftovers. The template happily plans leftovers and never tells you to refrigerate them within 2 hours, 1 hour above 90 °F, in shallow containers. Refreeze wording gets tightened so it has to say "only if it thawed in the refrigerator." And the food-safety reviewer drew a line I agree with: the model never gets to grant refreezing. A field the model fills in may only ever withhold permission. The app decides what to allow.

Then it gets tested on real output. Twenty blind generations from the model, plus up to two I will run myself on a free claude.ai account and save word for word. I ran one full test that way already and it went very well, but there is no file of it, so it counts as my observation and nothing more. After that, one verified push at the very end, with no interim pushes.

After that comes what my notes call return path only. If my household or anyone else finds a bug, that bug reopens the lane, gets reproduced on the published app, goes to whichever agent owns it, passes the same gates, and gets pushed. It does not reopen the backlog.

The arc is paused for now while my weekly token budget refills.

The thing I keep coming back to from this arc is how good every one of those holes looked from the outside. A record that said gated. A rule that was stated, clearly, in the app. A check that reported "not applicable," honestly, every single time. A gate that passed or failed depending on a folder name. Every one of them was green, or quiet, and none of them was looking at the thing it was named after.

Finishing on purpose means aiming at that, and not at the green.

---

## 🔗 Links

- Repository: [https://github.com/Qweary/weekly-feast](https://github.com/Qweary/weekly-feast)
- [weekly-feast: When Your Spouse Breaks Your Threat Model](/weekly-feast.html): where this started.
- [A Language That Compiles Differently Every Time](/a-language-that-compiles-differently-every-time.html): mechanism, practice, and why green is not the same as aimed.

The underlying swarm generation framework remains unpublished.
