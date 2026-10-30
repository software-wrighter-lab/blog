---
layout: post
title: "AI Tools #8: A Domain-Expert Skill Restarts a Stuck Project"
categories: [ai-tools, audio]
tags: [ai-tools, claude-code, skills, agent-skills, research, procedural-audio, sound-effects, friction, stick-slip, rust, egui, reproducibility]
keywords: "Claude Code skill, domain-expert skill, agent research before coding, fluent shallow competence, procedural audio, squeaky hinge synthesis, stick-slip friction, Hinge Lab, sound effect analysis, MIT-licensed sound effects"
abstract: "In February an AI agent wrote ten procedural sound-effect generators for me, and the door creak sounded like wind. The project stalled. This month I tried domain-expert, a skill someone sent me for Gemini that I converted into a Claude Code skill, which makes the agent research a field from its primary sources and write a dated, sourced briefing before it writes any code. The briefing found what the old generator got wrong, a Rust model built on it was physically right, and measuring real squeaks found what the model still lacked. What the skill demands, what it produced, and where it stopped."
series: "AI Tools"
series_part: 8
date: 2026-10-29 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/text-to-sfx-gen"
    title: "text-to-sfx-gen"
---

<!-- DRAFT (2026-10-29), Mike: the point is the domain-expert skill, which restarted a project he considered stuck since
     February. Mike did not write the skill; it was sent to him as a suggested Gemini skill, and he converted it into a Claude Code skill
     (sender not named).
     Sources: text-to-sfx-gen at 3942d66 (README, docs/blog-outline.md, docs/phases.md, docs/domain-expertise.md = the
     briefing, .claude/skills/domain-expert/SKILL.md, git log: Phase 1 2026-02-10/11 with opencode + GLM-4.7; Phase 2
     committed 2026-10-29 with Claude Code + Claude Opus 5.5). Images from the repo's images/. The briefing follows the
     skill's template but lives at docs/domain-expertise.md, not docs/briefings/. Lead image: Mike's block-hinge-math.jpg (text-to-sfx-gen images/, 2026-10-29), monochrome block print, no-invert. -->

<img src="{{ '/assets/images/posts/block-hinge-math.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

In February I had an AI agent write sound effects as code: no audio model at run time, just math, so every sound it makes is mine to license. Simple sounds worked. The door creak sounded like wind, and the hinge didn't sound like a hinge. I put the project down. This month someone sent me a skill to try, called domain-expert. It was written for Gemini; I converted it into a Claude Code skill, and it got the project moving again. I did not write the skill itself; this post is about what it does and what it did here.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The project** | [text-to-sfx-gen](https://github.com/softwarewrighter/text-to-sfx-gen) |
| **Live demo** | [softwarewrighter.github.io/text-to-sfx-gen](https://softwarewrighter.github.io/text-to-sfx-gen/) |
| **The skill** | [.claude/skills/domain-expert/SKILL.md](https://github.com/softwarewrighter/text-to-sfx-gen/blob/main/.claude/skills/domain-expert/SKILL.md) |
| **The briefing** | [docs/domain-expertise.md](https://github.com/softwarewrighter/text-to-sfx-gen/blob/main/docs/domain-expertise.md) |
| **Status and what remains** | [docs/phases.md](https://github.com/softwarewrighter/text-to-sfx-gen/blob/main/docs/phases.md) |
| **The series** | [AI Tools: every post](/series/#ai-tools) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Stuck since February

<figure class="zoomable" style="float: right; clear: right; width: 45%; margin: 0.2em 0 0.6em 1.5em;">
<img src="{{ '/assets/images/posts/sfx-screenshot.webp' | relative_url }}" class="no-invert" alt="The February demo page, Procedural Sound Effects, MIT-licensed, no AI models: its first card is Wind Whistling, originally intended as a door creak, with a note that the generated file sounds like wind whistling; below it an explosion and a flying saucer">
<figcaption style="font-size: 0.85em;">February's demo page: the door creak, renamed Wind Whistling. Click to enlarge.</figcaption>
</figure>

The idea is simple. An AI agent researches how a sound is made and writes code that synthesizes it from oscillators, noise, filters and physical models. Nothing runs a model when the sound is generated, so there is no GPU, no weights and no license question: the output is MIT, unlike the "open" text-to-audio models released for non-commercial use only.

The first attempt, in February with opencode and GLM-4.7, produced ten Python generators, an interactive trainer and a demo page. Impacts, clicks, a flying saucer and the sirens worked. The two door sounds did not, and when I came back to the repo it was in worse shape than I remembered: the WAV files had never been committed, one generator crashed when run, and none of the random ones was seeded.

## The skill

The skill's job is to stop exactly that. Its description names the failure it prevents, "fluent shallow competence": output that reads as expert and is technically wrong. It fires before the work, on tripwires such as a field with its own terms of art, or catching yourself "reaching for an analogy from an adjacent domain to cover a knowledge gap". Then it makes the agent:

- **Collect four things** the skill calls V-C-P-F: the field's **vocabulary**, its **canon** of primary sources, the **pitfalls** practitioners warn newcomers about, and the **frontier**, what changed recently.
- **Search in three passes:** conceptual searches to learn the field's words, exact-term searches for its canonical documents, then the primary literature itself, the papers and code, read firsthand. A claim that rests on one blog stays provisional.
- **Pass a gate** before it is done, citing evidence for each test, including a transfer test: another agent could do the task from the briefing alone.
- **Write it down** as a dated, sourced briefing in the repo, with its confidence and its limits stated, so the research is not redone next time.

## What the briefing found

[The briefing](https://github.com/softwarewrighter/text-to-sfx-gen/blob/main/docs/domain-expertise.md), 490 lines, read its sources in full: Akay's tutorial on friction acoustics in JASA (2002), the elasto-plastic friction model of Avanzini, Serafin and Rocchesso (DAFx-02), and the creaking-door patch in Farnell's *Designing Sound*. The physics in brief: a hinge squeaks through stick-slip. The pin sticks in the bore, force builds, it slips, and the cycle repeats. When the slips lock to a resonance of the metal, their repetition rate is the pitch you hear; when they don't, you hear separate creak clicks.

Its pitfalls section then named what the February generator did wrong, by name. It treated a squeak as "noise bursts plus a sine", when the pitch comes from the slips themselves, not from a tone added on top. And it slipped 3 to 12 times a second, which is the rate of a creak or ratchet, not a squeak. The research also wrote down where it stopped: its parameter values were "reasoned starting points", not measured from recordings, and its claims were checked with a toy simulation, not against real hinges.

## The document it left behind

After applying the skill, I had Claude write the research up, and the briefing is worth reading on its own. It follows the skill's template, vocabulary, canon, pitfalls, frontier and open gaps, and then goes past it into what the work needed:

- **The model, precisely:** the elasto-plastic friction equations from the DAFx-02 paper, how they couple to the resonant modes of the metal, and Farnell's cheaper phenomenological recipe as an alternative for creaks.
- **A sanity simulation, run during the research:** a toy friction model driving one 600 Hz mode, swept over load and sliding speed. It squeals only inside a narrow window of speed, which is the physics saying why a hinge squeaks some of the time, not all of it.
- **A plan an agent can act on:** how a user's or an LLM's settings map onto the physical ones, a pipeline of exciter, interaction and resonator stages an LLM could author, experiments with pass criteria, and a file-by-file plan for this repo.
- **The frontier:** recent work on LLM-driven procedural audio, among it CTAG (ICML 2024), SonicRAG (2025) and the Faust project's guide for LLMs, each summarized with what it found and where it fell short.
- **Its own limits, named:** the papers it could not read (one behind IEEE, one returning a 403), the measurements no paper provided, and an "expert-enough" gate that cites, section by section, the evidence for each of the skill's four tests.

That last part is what I value most in it. A briefing that says what it does not know told me, before any code, where the next problem would be.

## Hinge Lab: physically right, perceptually wrong
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/sfx-hinge-lab-ui.webp' | relative_url }}" class="no-invert" alt="Hinge Lab's window: sliders for the squeak's parameters, among them duration, swing time, peak speed, load, lubrication, rust, Stribeck speed, contact stiffness and hinge frequency; a waveform of the rendered squeak; its pitch over time, around 700 to 900 Hz; and the pin's sliding speed rising and falling through the squeak window">
<figcaption style="font-size: 0.85em;">Hinge Lab: the friction model with sliders, re-rendering in about a tenth of a second. Click to enlarge.</figcaption>
</figure>

Built on the briefing, [Hinge Lab](https://github.com/softwarewrighter/text-to-sfx-gen/blob/main/hinge-lab/README.md) simulates that friction in Rust, with sliders that re-render the sound in about 0.1 s and a command line that writes a WAV and a JSON sidecar. The same parameters and seed give a bit-identical WAV, so "it sounds wrong" becomes a diff rather than a memory.

It was physically right about *when* a hinge squeaks, and still sounded wrong: one smooth, slowly gliding tone with few overtones. The briefing had predicted its own ceiling. The model needed something the literature could not give it.

## Measuring real squeaks
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/sfx-analysis-stepped.webp' | relative_url }}" class="no-invert" alt="Analysis of a stepped squeak: the reference squeak's spectrogram with its tracked pitch, holding steady and then jumping at two points; below it the resynthesis rebuilt from the measurements, with the same steps and bright harmonics; and its loudness and roughness over the second it lasts">
<figcaption style="font-size: 0.85em;">A real squeak (top), measured, and rebuilt from the measurements (middle): steady pitches with sudden jumps. Click to enlarge.</figcaption>
</figure>

So the next step was measurement. An analysis tool found 23 squeaks in a reference video and tracked each one's pitch and roughness. Real squeaks turned out to be sequences of parts: steady pitches with sudden jumps, glides, and clean stretches that break into clicks, all driven by sharp slip pulses that make them bright. Five kinds emerged, from stepped and gliding squeaks to creaks and low groans. Rebuilding each squeak that way, from the measurements, reproduces those features, and those rebuilds are the second-attempt sounds on the [demo page](https://softwarewrighter.github.io/text-to-sfx-gen/).

The reference audio itself is not published anywhere, since its provenance is unclear. It stays in a folder git ignores; the site shows only spectrograms and measurements, with links to the video's timestamps, and the build refuses to run if a reference clip turns up in its output.

## What the skill did, and did not do
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/sfx-demo-page.webp' | relative_url }}" class="no-invert" alt="Today's demo page, Text-to-SFX: procedural sound effects. Section 1, the first attempt from February, lists ten sounds with players, among them a door creak that sounds like wind and a hinge creak that is not convincing. Section 2, the second attempt, the squeaky hinge from October, groups the rebuilt squeaks by kind, stepped and gliding, each with a link to its analysis">
<figcaption style="font-size: 0.85em;">Today's demo page: the first attempt, then the second. Click to enlarge.</figcaption>
</figure>

The skill did not make the hinge sound right. What it did for a stuck project was different: it replaced my vague "it doesn't sound like a hinge" with a sourced account of how a hinge makes sound, named the old code's mistakes against that account, and said plainly where its own knowledge ran out. That is what made the next two steps obvious, a model built on the physics and then measurements to find what the model lacked. And because the briefing is a file in the repo, dated, the next agent to work on this starts from it instead of from nothing.

What is next, from the project's own list: rebuild Hinge Lab around the sequence-of-parts structure, so an analyzed squeak can be loaded and edited; fit its parameters to a measured squeak; let an LLM write new ones from a text description; and try the same friction exciter on chalk, sneakers, a wineglass and brakes.
