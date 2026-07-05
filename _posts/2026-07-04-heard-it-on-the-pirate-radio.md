---

layout: post
title: "📻🔨 Heard It on the Pirate Radio 🔨📻"
date: 2026-07-04
author: Qweary
categories: [toorcamp, cyberhakcon, hardware hacking, locks, community, conference, recap]
tags: [toorcamp, cyberhakcon, ai village, lockpicking, darknet diaries, pirate radio, community, hardware hacking, meshtastic, conference, recap]
permalink: /heard-it-on-the-pirate-radio.html

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

Heard It on the Pirate Radio
============================

*Two conferences, my first major main-stage talk, and a pile of research I never knew if anyone would care about.*

---

I got home from ToorCamp with a duffel full of lock cores, a trombone, a Meshtastic node shaped like a cat, and a little device with a wireframe fox on it that I traded my travel pick set for. I have been slowly unpacking all of it. The gear went fast. The rest of it is taking longer.

This is the post I owe the blog after a quiet couple of months. Two conferences happened in that gap, and they could not have been more different in size or subject. One was small and about AI. One was a hacker camp on an island where I gave my first major talk on a main stage, and then heard it played back to me over pirate radio. I want to write about both, because I got something out of both, and because the small one taught me something the big one turned around and proved at a scale I did not see coming.

## The small room in Dallas

CyberHakCon was in Dallas, and I helped run the AI Village. My talk there was about using AI models the way you use a programming language.

Here is the short version, because it is the part I care about. A large model is not one tool. Different models are different languages, and you pick the right language for the task. I reach for Claude when I need reasoning. I reach for Gemini to generate art. I reach for Grok when I want an up-to-date read on what people are actually saying right now. Then you quantize the work. Take the objective and cut it down to its smallest unit, the piece the model can do well without wandering off. The model is non-deterministic and it is very good at that small unit. Around it you wrap the deterministic, logical systems you already trust, the checks and debugs and tests and hooks and dependent workflows, and those steer the non-determinism wherever it needs steering. Small unit, deep impact. Let the model be great at the one thing, and let your own code keep it honest.

I will be straight about the scale. Six to ten people came through, and other tables in the village were running one to three. Nobody sat down and ran the demos on their own machine. A few looked at the ones I had up on the screens. It was small, and it was fine. A room that size meant I got a real one-on-one with every single person who walked in, and I would take that trade most days.

A couple of moments stuck. About ten minutes in, someone reached for a pen and paper and started taking notes, which beats any survey. A few people walked others over so those others could argue through the approach with me. And I ran into Jason Haddix in Texas. I had first met Jason in Seattle only a few months before, and both times we ended up talking shop and laughing at how much our own ideas kept turning up, slightly warped, inside each other's AI systems.

CyberHakCon and ToorCamp were opposites in size and in subject, and I am glad I did both. I want to keep bringing both sides of this, the agentic-AI work and the hardware hacking, to whatever room will have them.

## An island in the San Juans

ToorCamp is a hacker camp, and I was there as staff.

It is on an island in the San Juans, which is a sentence I never thought I would be saying. Some people arrived by boat. There were rumors someone would come in by seaplane, though I never saw it happen. The trees get lit blue and purple and pink at night, and this year the theme was alien flora, so the trail between camp sections was lined with attendee-built art of plants that do not exist.

<figure>
  <img src="/assets/images/pirate-radio/toorcamp-marquee-arrival.jpg" alt="The author standing with arms wide in front of giant illuminated rainbow TOORCAMP marquee letters at dusk, a geodesic dome behind." loading="lazy">
  <figcaption>Arriving. The letters do a lot of the talking.</figcaption>
</figure>

I will get to the camp itself, because the camp is the real story. First I have to talk about the talk.

## Following the keynote

My talk was on the main stage, right after Jack Rhysider's keynote. If you do not know Jack, he makes Darknet Diaries, and he is one of the best storytellers our field has. Following him is a hard act, and I knew it walking up.

<figure>
  <img src="/assets/images/pirate-radio/main-stage-podium.jpg" alt="The author at the ToorCamp main-stage podium in a red plaid shirt, holding up an L-shaped lock tool, laptop covered in stickers including a Darknet Diaries sticker." loading="lazy">
  <figcaption>On the main stage, holding up the reason I was there. The photos make me look far more official than I was trying to be.</figcaption>
</figure>

The talk was on the lock research, the Alarm Lock T2/T3 work: reading credentials out of NAND flash, injecting firmware, and getting the lock to lie about its own audit trail. I have written all of that up in detail already, so I did not try to jam the full attack chain into a stage slot (the technical writeups are linked at the bottom if you want them). On stage I cared about the story, not the chain. The point I wanted to land is that the gap between the physical and the digital gets ignored, and it gets ignored even in the products people trust the most, the ones marketed as the higher-security option. I was not there to dunk on one company. The pattern is bigger than any one lock.

I looked out and knew a lot of the crowd. Friends and family I see all the time. Conference friends, including people whose own DEF CON talks are part of why I started doing any of this, which I have told them to their faces. Deviant Ollam was out there cheering me on. So I did what I do, which is rant and ramble at my own pace, and the room came with me. When people learned it was my first major main-stage talk, the support caught me off guard. More than one person told me I came off like I had done this many times before. I have not, and I will hold onto that.

## Someone who looked strikingly similar to Jack

About halfway through, someone who looked strikingly similar to Jack drifted in and started listening from the outskirts.

Around then an audience member asked me the question I get a lot. How do you keep finding new things to hack, and why do you keep doing it. I made eye contact with this Jack, and I answered honest. The good chemicals, the ones that keep me going, hit when a manufacturer makes a change because of something I found, and real people end up safer for it. It was a deliberate nod to Jack's keynote about why we tell these stories at all. Out on the edge of the crowd, the figure who looked strikingly similar to Jack put a hand over their mouth to stifle a laugh. I will let you decide who that was.

## Over the air

Here is a thing about ToorCamp I did not expect to love as much as I did. There are pirate radio and TV stations running at camp.

For days after the talk, people I had never met would walk up and tell me they had caught it over one of the pirate stations, and that they loved it. That kept happening. Somebody, somewhere on the grounds, was pushing me out over the trees, and strangers were finding the research through the air. I do not have a better word for it than surreal.

## An hour on the chip

I am not a fanboy by design. I do not get star-struck, and I try not to build people up into something they are not. So I want to say this next part plainly, without making it bigger than it was, because it was already big enough.

Jack and I sat down for over an hour, one on one, and I walked him through it on the chip. I showed him how cleanly a physical attack pairs with a digital one. We talked about what interference with critical infrastructure could look like at the nation-state level. We talked about the security profile people are right to expect from a product based on how it is rated and how it is sold, and how far the real thing can fall from that mark.

I heard Jack's "wow" more than once, in person, over findings that are mine. I poured an unreasonable amount of time into that research, and the entire way through it I never knew whether anyone would care. To have someone who tells stories for a living, and who is a good human on top of it, stay locked in on it for an hour is a thing I wanted for a couple of years without ever chasing it. I did not walk into camp trying to make it happen. I was just happy to share it with someone who wanted to listen. It was only later, turning the week over in my head, that I understood I had gotten the thing I wanted.

One more detail, because it is funnier and truer than the clean version. The lock board I traded Jack for a bandana did not work. I had bench-tested it. I had written "GOOD" on the tape holding it together. It did not work anyway. Jack handed it back, no hard feelings, because the story was what he was after, and that dead board turned out to be a pretty good ticket into a private workshop.

## The workshops

I ran hands-on workshops, and they were the best kind of tired.

The lock-drilling workshop got out of hand in the best way. Demand was high enough that we stretched it from one hour to an hour and a half to two and a half, and that was before day one had even started. I helped adults and kids. I helped people who had a lock at home they needed to drill. I helped first-time drill users and lockpicking enthusiasts and people who were walking past and got curious. I met a master locksmith from ASSA who had crossed over into cybersecurity, the first and only other person I have ever met who came at these two professions from the same strange sideways angle I did.

My favorite moment was small. Someone waited over an hour, just to drill a lock, for the fun of it. Drilling locks has quietly become a chore for me. Watching it be pure novelty and joy for someone else reset something.

<figure>
  <img src="/assets/images/pirate-radio/narwhal-amateur-radio.jpg" alt="The author in a black brimmed hat soldering at the Narwhal Amateur Radio Society table, a teardrop banner behind, tents and a trans flag in the background." loading="lazy">
  <figcaption>Staff means you are always working on something. I did not mind.</figcaption>
</figure>

The other workshop was the flash one. People clipped a programmer onto a real lock's flash chip, read it, decoded the user-code page, wrote their own code in, and watched the lock open. Partway through, someone I respect told me you do not need to sit behind a screen to be a hacker. That one landed, because I have always believed you become a hacker the moment another hacker calls you one. A couple of attendees asked me to help on their own projects afterward, which I will keep to myself, and which I am ecstatic about.

Naomi Brockwell got pulled into that lock demo too. If you do not know her, she is a privacy educator and tech journalist who runs NBTV, and watching her get hands-on with the guts of an access-control lock was its own kind of great.

## The jam

I have played trombone most of my life, professionally and for the love of it, and I brought it to camp.

<figure>
  <img src="/assets/images/pirate-radio/jazz-jam-trombone.jpg" alt="The author playing trombone beside a saxophone player under the stage tent at the jazz jam." loading="lazy">
  <figcaption>The jam. I brought the horn; the sound found the rest.</figcaption>
</figure>

I told an organizer I had a jam planned and a trombone with me, and they reached out to a friend to bring their sax, the player you see in the photo. Here is what stuck with me. That sax player had wanted to bring an instrument, but was not sure anyone would want to listen, or want to play along. I heard that same thing from a lot of people about why they left their instruments at home.

I know that feeling. Not fear, exactly. More the quiet not-knowing about whether anyone wants the thing you carry around. I felt it about the music. I felt it about the research, the workshops, the whole pile of stuff I hauled to an island. And each time I shared it anyway, ToorCamp met me. A friend from a makerspace called the jam absolutely awesome. Other friends made time to come hear me play. You bring the thing, you share it, and the camp gives it right back to you, bigger.

## Everyone brought something

The camp runs on a simple current. Everyone looked out for everyone. Lost items came back or made their way to lost-and-found. If your project was missing a part, whoever had that part just handed it over. Passions got rewarded. Here is what that looked like, up close.

**The cat that talks to the trees.** I had meant to build a Meshtastic node for years and never had. Then I passed a workshop running at ToorCamp and thought, "fuck it, why not." So I finally built one, a normal little LoRa node in a cat-shaped case, which is why I named it kitty. Camp is where I make the time.

<figure>
  <img src="/assets/images/pirate-radio/kitty-meshtastic-node.jpg" alt="A small circuit board, an RP2040-Zero microcontroller with a helical antenna, sitting in an antistatic bag." loading="lazy">
  <figcaption>kitty. A LoRa/Meshtastic node I had been putting off for years, finally built in a cat-shaped case at camp.</figcaption>
</figure>

**A phone line to your tent.** Separate from any of that, ShadeyTel put out payphones and would run a real telephone line to any campsite that asked. Plug in a phone, get your assigned number, and call the payphones, other camps, or your own camp from any wired handset on the grounds.

<figure>
  <img src="/assets/images/pirate-radio/shadeytel-phone-booth.jpg" alt="A glowing telephone booth beside a dome tent at night." loading="lazy">
  <figcaption>A phone booth in the woods. Of course there is a phone booth in the woods.</figcaption>
</figure>

**The payphone that texts you a poem.** There was also a glowing, artistic payphone with its own number. Call it and it routes into the old conference-call systems phone phreakers used to use to talk to their friends for free back in the day. When you hang up, it texts a short poem to your cell about the lost knowledge of the old hacks this community is built on. Mine was a haiku, and I have not stopped thinking about it:

> Abandoned like us
> A symbol outlived its use
> Digital corpse speaks

<figure>
  <img src="/assets/images/pirate-radio/phreak-payphone.jpg" alt="The phreaker payphone art installation, a circuit-board collage with an LED matrix reading '969' and a handset." loading="lazy">
  <figcaption>Call the number. It routes into the free conference systems the phreakers lived on.</figcaption>
</figure>

**The night market.** It runs on dollars, or on barter with whatever you brought, or on shadey bucks, which is con fake-money you earn in-con. I traded a lot of lock cores. And I traded my travel lockpick set for a FlockU, the little board CyberSasquatch builds, marked with their wireframe-fox logo. I wanted it for a simple reason. I could see the real thought and time and research that went into it, and ToorCamp is a place for appreciating exactly that. Good research is good research, and I will trade my picks for it. Same reason I bought art in the market. Somebody put the hours in, so the least I can do is carry it home.

<figure>
  <img src="/assets/images/pirate-radio/flocku-cybersasquatch.jpg" alt="The FlockU device by CyberSasquatch, a small board with an OLED reading 'cams/WA.bin missing' and a wireframe fox logo." loading="lazy">
  <figcaption>The FlockU, v1.1.8, wireframe fox and all. I traded my travel picks for it and would do it again.</figcaption>
</figure>

**Dronigiri.** There is a running "taco drone" gag at camp. This year's version was dronigiri. You order nigiri from a person, walk to a spot, and a drone flies it out to you, free, because it is cool. It was, for the record, delicious.

<figure>
  <img src="/assets/images/pirate-radio/dronigiri-drone.jpg" alt="A daytime staff and workshop setup on a green house deck, a drone flying overhead in a blue sky." loading="lazy">
  <figcaption>Dronigiri, inbound.</figcaption>
</figure>

**The swim.** I swam in the Sound, and I am told, by more than one person, that I got mistaken for a seal. I am choosing to take that as a compliment.

<figure>
  <img src="/assets/images/pirate-radio/the-sound-swim.jpg" alt="The author's feet up on a log, a sailboat and forested islands and blue water beyond." loading="lazy">
  <figcaption>The swim spot. Seal-adjacent.</figcaption>
</figure>

<figure>
  <img src="/assets/images/pirate-radio/dome-interior-night.jpg" alt="A geodesic dome interior at night, RGB-lit, with tables and chairs and night-market wares in the back." loading="lazy">
</figure>

<figure>
  <img src="/assets/images/pirate-radio/alien-flora-figure.jpg" alt="A night art installation, a red-outlined winged figure with hanging LED jellyfish in the trees." loading="lazy">
</figure>

<figure>
  <img src="/assets/images/pirate-radio/uv-forest-path.jpg" alt="A UV-lit purple forest path with art at night." loading="lazy">
  <figcaption>Alien flora, the whole trail.</figcaption>
</figure>

## The people who kept handing me doors

Some of this camp was people, more than places.

Egyp7 kept handing me doors to walk through. He cheered at every step, pushed me to submit research I would not have submitted on my own (Carlos pushed me the same way), pulled me onto a CCDC red team, and sat next to me hacking and picking apart networks. His favorite line is that understanding networks is the hardest part of hacking, and the more I do this the more I think he is right.

Vyrus shouted across camp on the first day just to say hi, which was its own small piece of surreal. His skills are unmatched, and I had the honor of hacking next to him at the WRCCDC regional earlier this year.

## What a hacker camp can be

Near the close of it, down in the lower camp area, looking out over the water of Doe Bay, Carlos told me the story of where ToorCamp came from. His vision for it, going all the way back to the days it was held in an old missile silo. If you build it, they will come. That is his line, and it is his to say, and standing there watching the bay it was hard to argue with the proof all around us.

<figure>
  <img src="/assets/images/pirate-radio/doe-bay-sailboat.jpg" alt="A sailboat anchored in the Sound, a forested island behind, a clear blue day." loading="lazy">
  <figcaption>Doe Bay. Where the story got told.</figcaption>
</figure>

ToorCamp is real because people built it and keep building it, and a lot of them still show up and run it with their own hands. So the thank-yous here are the point of the post, not a footer on it.

Thank you to Carlos, H1kari, Tim, Geo, and Zarkle, and to the entire staff for making a place like this and keeping it what it is. Thank you to the kitchen staff, who got plenty of credit and earned every bit of it. Thank you to Jack, for the hour and for the keynote I got to chase. Thank you to Egyp7 and Vyrus, for the doors and the shouts across camp. Thank you to Deviant, to Naomi, to Jason, and to the friends and family and conference friends who came out and cheered for a first-timer. Thank you to the sax player who brought a horn on a maybe, and to everyone who almost left their instrument at home and did not.

I will say the honest part too, because this blog has always been honest. I came into security from a strange angle, and a locksmith's skills and connections do not turn research into momentum on their own. I am open to what this could become: consulting, advising, red team, hardware hacking, and more stages to bring it to. The respect and the offers of help I got at camp, from people I have looked up to for years, meant more than I can put here without getting sappy. I am going to keep chasing this down myself either way.

ToorCamp felt like a home because of every single person who made it one, in the woods, on an island. I brought a trombone and a broken lock board and a pile of research I never knew anyone would want. Camp wanted all of it.

I keep thinking about the strangers who found my work drifting out of the trees on a pirate signal, catching it once and never knowing who made it. I want to spend however long I get to do this building things worth putting on the air.

---

## The technical writeups

If you want the deep version of the lock research from the talk:

- [Dead Bytes Tell No Lies](/dead-bytes-tell-no-lies.html): reading credentials out of NAND flash.
- [Physical Access, Digital Lies](/phys-access-digi-lies.html): the full-stack writeup, start to finish.
- [When Physical Meets Digital](/when-physical-meets-digital.html): the early physical vulnerabilities that started all of it.
