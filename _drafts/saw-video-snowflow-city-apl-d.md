---
layout: post
title: "Saw #19: agentrail Stops Filling Repositories, and X_eTaL Videos, Snow, and a Neon City"
categories: [tools]
tags: [sharpen-the-saw, agentrail, git, x-etal, xetal, video, console-3d, apl, sw-apl, ibm-pc, procedural, city, machine-learning, fine-tuning]
keywords: "Sharpen the Saw, X_eTaL-video, snowflow, console-3D, sw-apl, IBM PC APL, procedural city, X_eTaL-extensions, X_eTaL-ML, X_eTaL-fine-tuning"
abstract: "Seven saws this week. agentrail stops committing agent session logs into repositories, a long-standing problem. And new X_eTaL work: a pipeline for educational videos, a snowy world and a procedural neon city in the browser, an IBM 029 keypunch model, APL80 on the TRS-80 with IBM PC APL next, and more fine-tuning in X_eTaL-ML and X_eTaL-fine-tuning, and a first, null, experiment in X_eTaL-manifolds."
series: "Sharpen the Saw Sundays"
series_part: 19
date: 2026-11-15 00:15:00 -0800
repo_urls:
  - url: "https://github.com/sw-vibe-coding/agentrail-rs"
    title: "agentrail-rs"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
  - url: "https://github.com/softwarewrighter/snowflow_demo-fork"
    title: "snowflow_demo-fork"
  - url: "https://github.com/softwarewrighter/X_eTaL-extensions"
    title: "X_eTaL-extensions"
  - url: "https://github.com/softwarewrighter/console-3D"
    title: "console-3D"
  - url: "https://github.com/sw-vibe-coding/sw-apl"
    title: "sw-apl"
  - url: "https://github.com/softwarewrighter/X_eTaL-ML"
    title: "X_eTaL-ML"
  - url: "https://github.com/softwarewrighter/X_eTaL-fine-tuning"
    title: "X_eTaL-fine-tuning"
  - url: "https://github.com/softwarewrighter/X_eTaL-manifolds"
    title: "X_eTaL-manifolds"
---

<!-- DRAFT (2026-11-14), Mike: Saw for Sunday 11/15 covering X_eTaL-video, snowflow_demo-fork, console-3D, sw-apl moving from
     demo C to demo D, X_eTaL-extensions' procedural interactive city, and progress in X_eTaL-ML and X_eTaL-fine-tuning.
     Facts from repo commits 2026-11-08..14 (research 2026-11-14); agentrail change is UNCOMMITTED on branch claude/session-logs-out-of-repo; D'83 planned only (a441b95); snowflow is a fork of Noniv/snowflow_demo (MIT). 029: console-3D, to be pushed and fetched before publishing (Mike, 2026-11-14); check it is on GitHub before publish. Lead image: Mike's block-lumberjack.jpg (Dropbox, 2026-11-14), no-invert. -->

<img src="{{ '/assets/images/posts/block-lumberjack.webp' | relative_url }}" class="post-marker no-invert" alt="A block print of a lumberjack in a plaid shirt and knit cap cutting through a fallen log with a chainsaw, in a sunlit forest" style="width: 205px;">

Seven saws this week. The lead one fixes a long-standing problem in agentrail, my tool for keeping an agent's plan in the repository. The rest are new and growing X_eTaL work: educational videos, a snowy world and a neon city in the browser, an IBM 029 keypunch model, APL's next era, and machine learning.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **agentrail** | [agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) |
| **Video** | [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video), [the videos](https://softwarewrighter.github.io/X_eTaL-video/) |
| **Snow** | [snowflow_demo-fork](https://github.com/softwarewrighter/snowflow_demo-fork), [live](https://softwarewrighter.github.io/snowflow_demo-fork/) |
| **City** | [X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions), [live](https://softwarewrighter.github.io/X_eTaL-extensions/three/live/) |
| **Models** | [console-3D](https://github.com/softwarewrighter/console-3D) |
| **APL** | [sw-apl](https://github.com/sw-vibe-coding/sw-apl), [live](https://sw-apl.softwarewrighter.com/) |
| **ML** | [X_eTaL-ML](https://github.com/softwarewrighter/X_eTaL-ML), [X_eTaL-fine-tuning](https://github.com/softwarewrighter/X_eTaL-fine-tuning), [X_eTaL-manifolds](https://github.com/softwarewrighter/X_eTaL-manifolds) |
| **The series** | [Sharpen the Saw: every post](/series/#sharpen-the-saw-sundays) |
| **"Sharpen the Saw"** | [The 7 Habits of Highly Effective People](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People) (Stephen Covey) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## agentrail: session logs out of the repository

[agentrail](https://github.com/sw-vibe-coding/agentrail-rs) keeps an agent's plan, steps and history in the repository it works on, under `.agentrail/`. It also used to keep a snapshot of the agent's whole conversation there, a Claude Code JSONL log saved with every completed step, and that was a long-standing problem. A log quotes every file the agent read and only grows, so committing it with each step stored the whole log again every time, filled the repository with large files nobody needed, and published content that was never meant to be shared.

The fix moves session logs out of the repository, to `~/.agentrail/sessions/` in the user's home directory, one folder per repository. `agentrail complete` still snapshots the log, just not into git. For repositories that already have logs committed, `agentrail sessions migrate` moves them out and stops tracking them. And a new size guard, `agentrail check-size`, which also runs on `next`, `status` and `complete`, warns at 10 MiB and fails at 95 MiB for any file under `.agentrail/` that would be committed, before GitHub's 100 MB limit refuses a push.

At least twice now, an agent has reported that GitHub rejected a push because of a file's size. So next I need to install the new agentrail on my development machines, and work out how to fix every repository that uses it: they all carry logs that can now be removed, at the cost of rewriting history and a force-push. This may be a good time to do something else instead: leave the existing repositories as they are, with their older history, and fork them to a new owner, under a better organization name, keeping the repositories trim from here on.

## X_eTaL video

<figure class="zoomable" style="float: right; width: 260px; margin: 0.3em 0 0.4em 1.2em;">
<img src="{{ '/assets/images/posts/saw19-xetal-video-nbody.webp' | relative_url }}" class="no-invert" alt="A frame of the N-body video: the live gravity page beside its X_eTaL program, with a timeline of the video's scenes along the bottom">
<figcaption style="font-size: 0.85em;">The N-body short. Click to enlarge.</figcaption>
</figure>

[X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video), new this week, makes educational videos about X_eTaL. A lesson is a JSON file; X_eTaL libraries compute its timing and animation as arrays, with Timeline, Ease and Spring (Remotion's spring in closed form, checked against Remotion's own numbers), and Remotion renders every frame, in landscape and in portrait. The X_eTaL code in a video is always shown drawn and syntax-colored, and long lines pan rather than shrink.

Five videos so far, all on [the landing page](https://softwarewrighter.github.io/X_eTaL-video/): a making-of, the Game of Life twice (once drawn from the arrays X_eTaL printed, once captured from the live page), a 60-second Mandelbrot and a 60-second N-body, three bodies on a figure-eight. Narration is still to come.

When I made narrated videos before, I used [VoxCPM](https://github.com/OpenBMB/VoxCPM), an open-weight text-to-speech model, on my Ryzen workstation, curiosity. Then I fried its motherboard adding a PCIe card, so that machine is in pieces, waiting for me to reassemble it with an upgraded Ryzen CPU. Meanwhile I need to install VoxCPM on another workstation, with the RTX 5060 16 GB card I took out of curiosity. Once my text-to-speech pipeline is going again, I plan to make a new series of videos on what I have been working on for the last several months.

## A snowy world

<figure class="zoomable" style="float: left; width: 260px; margin: 0.3em 1.2em 0.4em 0;">
<img src="{{ '/assets/images/posts/saw19-snowy-world.webp' | relative_url }}" class="no-invert" alt="The X_eTaL snowy world in WebGPU: a pale blue snowfield of faceted hills with a cluster of tall ice crystals in the middle, at 120 frames a second">
<figcaption style="font-size: 0.85em;">The snowy world, with ice crystals. Click to enlarge.</figcaption>
</figure>

[snowflow_demo-fork](https://github.com/softwarewrighter/snowflow_demo-fork) starts from [Noniv's snowflow demo](https://github.com/Noniv/snowflow_demo), a real-time procedural snowfield in WebGPU, Babylon.js and hand-written WGSL. My fork, "X_eTaL snowy world", rebuilds it so that pure X_eTaL array functions generate the terrain, chunk by chunk in a window that follows you, while Rust and WebAssembly handle the GPU, physics, procedural sound and footprints, with no hand-written application JavaScript. World state is immutable, updated by pure reducers.

It is [live](https://softwarewrighter.github.io/snowflow_demo-fork/): an endless streamed snowfield to walk through, jump in and leave a trail across, with its X_eTaL source shown on the page. It needs a browser with WebGPU.

## An IBM 029 keypunch

<figure class="zoomable" style="float: right; width: 180px; margin: 0.3em 0 0.4em 1.2em;">
<img src="{{ '/assets/images/posts/saw19-ibm029-keypunch.webp' | relative_url }}" class="no-invert" alt="A 3D render of an IBM 029 card punch: the card hopper, punch station and stacker above a keyboard with blue keys, on a desk with a steel frame">
<figcaption style="font-size: 0.85em;">IBM 029 keypunch model.</figcaption>
</figure>

[console-3D](https://github.com/softwarewrighter/console-3D), my set of 3D models of old machines, has a new one: the IBM 029 card punch, the keypunch I typed programs on in college, with its card hopper, punch station, stacker and keyboard. It joins the consoles and terminals for the computer history museum on my research campus.

## APL, from C'80 to D'83

<figure class="zoomable outdent-left" style="width: 300px; margin-top: -2.9em;">
<img src="{{ '/assets/images/posts/saw19-apl-c80.webp' | relative_url }}" class="no-invert" alt="The C'80 demo: green APL80 text on the TRS-80 monitor, listing libraries with )LIBS, loading the PLOT workspace and listing its functions and variables">
<figcaption style="font-size: 0.85em;">C'80: APL80 on the TRS-80 screen. Click to enlarge.</figcaption>
</figure>

My APL site now opens on a landing page of machines and [a timeline of APL](https://sw-apl.softwarewrighter.com/). Its third live demo, <u>C</u>'80, is APL80 on the TRS-80: APL80's commands, its characters on the TRS-80's screen, `)RAM` with peek, poke and Call, a small `)DOS`, pasted lines run one by one, the screen shown inside my TRS-80 monitor render, and workspaces ported to it, among them RACE, BIRDS, CALC, POLY, PLOT and DRILL.

Next is <u>D</u>'83, IBM PC APL. It is planned, not built yet: text on the green monochrome monitor, with the custom character chip I ran on my own PC, and AP205 graphics on a CGA screen, such as a colored wireframe cube.

## A neon city

<figure class="zoomable outdent-right" style="width: 320px; margin-top: -2.9em;">
<video autoplay muted loop playsinline preload="auto" class="no-invert" poster="{{ '/assets/images/posts/saw19-neon-city-poster.webp' | relative_url }}" aria-label="A flight along the avenue of a rainy neon city at night: towers with glowing bands, wet reflective streets and traffic" style="width: 100%;">
<source src="{{ '/assets/videos/saw19-neon-city.webm' | relative_url }}" type="video/webm">
<source src="{{ '/assets/videos/saw19-neon-city.mp4' | relative_url }}" type="video/mp4">
</video>
<figcaption style="font-size: 0.85em;">The neon city, in the browser.</figcaption>
</figure>

In [X_eTaL-extensions](https://github.com/softwarewrighter/X_eTaL-extensions), `NeonCity.xtl` builds a rainy night city as arrays: 240 lots along an avenue, each tower's height, footprint and skin drawn from a hash of its lot number and a seed, so the same seed gives the same city on every machine, plus rooftop machines, neon bands, screens, lamps, steam, two bridges, cars in four lanes and fliers. Blender can ray-trace it, about two minutes a 1080p frame on my M1 Max.

New this week, it is also interactive. A Three.js extension draws the same scene in real time [in the browser](https://softwarewrighter.github.io/X_eTaL-extensions/three/live/), with wet-street reflections, neon and bloom: X_eTaL, compiled to WebAssembly, builds the city from a seed on the page, and another seed gives another city. Ride the camera's flight, fly, or walk the streets.

## Machine learning, fine-tuning and manifolds

In [X_eTaL-ML](https://github.com/softwarewrighter/X_eTaL-ML), [moe-finetune](https://softwarewrighter.github.io/X_eTaL-ML/moe-finetune/) fine-tunes a small mixture-of-experts model to a changed task six ways, in the browser; only adding a new expert keeps the old task. VeRA joined the LoRA library and the [LoRA explorer](https://softwarewrighter.github.io/X_eTaL-ML/lora-explorer/), and an [ML timeline](https://softwarewrighter.github.io/X_eTaL-ML/ml-timeline/) has begun, built on the Lisp timeline's shell.

In [X_eTaL-fine-tuning](https://softwarewrighter.github.io/X_eTaL-fine-tuning/), lesson 5 puts [LoRA beside LoRA-FA](https://softwarewrighter.github.io/X_eTaL-fine-tuning/lora-vs-fa/), and lesson 6 is [the landscape](https://softwarewrighter.github.io/X_eTaL-fine-tuning/landscape/), a map of six families of ways to change a model. A browser walk now checks every lesson for accessibility, keyboard, touch and replay.

In [X_eTaL-manifolds](https://github.com/softwarewrighter/X_eTaL-manifolds), its pages moved onto the shared teaching shell, and the [representation explorer](https://softwarewrighter.github.io/X_eTaL-manifolds/representation-explorer/) went live: the same points kept flat, measured by straight lines, and on the unit sphere, measured by angles, with everything else held equal, to test the first of its research questions. On these two small data sets the first test came out null: putting the points on the sphere did not change how well the model learned. The repository keeps that result, as its rules require.

## Closing

Mike: TODO, a closing in your words.
