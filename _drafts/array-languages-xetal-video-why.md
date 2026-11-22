---
layout: post
title: "Array Languages #21: Why Another Programming Language? A Video Series on Thinking in Arrays"
categories: [programming-languages, array-languages, video]
tags: [array-languages, xetal, x-etal, apl, j, k, bqn, video, teaching, remotion]
keywords: "array programming tutorial, learn array programming, why another programming language, X_eTaL video, array languages video series, APL J K BQN, whole-array operations, reduce, scalar loop versus array, personal programming languages"
abstract: "Twenty-first in the Array Languages series: the first episode of a new video series that teaches array programming with X_eTaL. Why another programming language? It compares a Rust loop with whole-array operations, traces the array family from Iverson's 1962 notation through APL\\360, APL2, J, K and BQN, and introduces X_eTaL, typed in plain ASCII and drawn as notation. The series plan, and how the videos are made."
series: "Array Languages"
series_part: 21
date: 2026-11-22 00:15:00 -0800
video_url: "https://www.youtube.com/watch?v=NfdzVWjje2Y"
video_title: "Why Another Programming Language? Array Languages #1"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
  - url: "https://github.com/softwarewrighter/X_eTaL-video"
    title: "X_eTaL-video"
---

<!-- DRAFT
     Facts gathered 2026-11-20 from X_eTaL-video main b70e597 (2026-11-20): lessons/al-01-why/{README.md, title.txt,
     description.txt, timing.json}, docs/array-languages-video-series-plan.md. Render: out/al-01-why-landscape-remotion.mp4,
     1920x1080, 518.4 s (8:38). Thumbnails are frames from that render. Dated 2026-11-20 by Mike; moved to 2026-11-21, then 2026-11-22 (video upload running late). Video NfdzVWjje2Y given by Mike 2026-11-22; title from title.txt (oEmbed not public yet).
    
-->

<img src="{{ '/assets/images/posts/block-video-tutorial-xetal.webp' | relative_url }}" class="post-marker no-invert" alt="A desktop monitor in a dim room showing a video coding lesson: a module outline, X_eTaL code in an editor, a language picker with X_eTaL selected, and an instructor in a corner window">

I've started a video series that teaches array programming, using my language X_eTaL. Episode 1, *Why Another Programming Language?*, runs about eight and a half minutes. This may be the dawn of personal programming languages, and this is not the first one I've started creating. I want people to be able to learn my new APL-inspired language, so I am using Remotion and X_eTaL itself to generate video tutorials.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Video** | [Why Another Programming Language? Array Languages #1](https://www.youtube.com/watch?v=NfdzVWjje2Y)<br>[![Video](https://img.youtube.com/vi/NfdzVWjje2Y/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=NfdzVWjje2Y) |
| **Try X_eTaL** | [In your browser](https://softwarewrighter.github.io/X_eTaL/) |
| **Code** | [X_eTaL](https://github.com/softwarewrighter/X_eTaL), [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## One step at a time

<figure class="zoomable" style="float: right; width: 260px; margin: 0.3em 0 0.6em 1.2em;">
<img src="{{ '/assets/images/posts/al21-one-step.webp' | relative_url }}" alt="A frame from the episode, One step at a time: the array 1 2 3 4 doubled one element at a time, 2 4 6 done and 8 still to come">
<figcaption>One step at a time.</figcaption>
</figure>

Most programming languages teach us to think one step at a time: create a variable, loop, take an element, operate, store, repeat. The episode starts there, with a Rust loop that doubles four values and prints `[2, 4, 6, 8]`, and points out how much of it is mechanism (the storage, the iteration) rather than the one operation that matters.

## The whole computation

<figure class="zoomable" style="float: left; width: 260px; margin: 0.3em 1.2em 0.6em 0;">
<img src="{{ '/assets/images/posts/al21-whole-array.webp' | relative_url }}" alt="A frame from the episode, Whole-array operations: the numbers 1 through 10 all doubled at once into 2 through 20">
<figcaption>Whole-array operations.</figcaption>
</figure>

Array programming describes the whole computation instead. In X_eTaL, `2 * values` doubles every value at once, and it reads the same for four values or a hundred: `2 * r_ange 100` is `2 4 ... 200`. Reduce, given plus, sums a list (`'+ r_/ 1 2 3 4` is `10`), and given times, multiplies it (`24`).

## The array family

<figure class="zoomable" style="float: right; width: 260px; margin: 0.3em 0 0.6em 1.2em;">
<img src="{{ '/assets/images/posts/al21-spellings.webp' | relative_url }}" alt="A frame from the episode, One idea, many spellings: two times 1 2 3 4 in APL, J, K, BQN, X_eTaL as typed, and X_eTaL as rendered">
<figcaption>One idea, many spellings.</figcaption>
</figure>

The episode traces where array languages came from: Iverson's notation in 1962; APL\360 from IBM in 1968, the first you could type at; APL2 in 1984, which added nesting; J in 1990, which kept the semantics and moved to ASCII; K, stripped down; and BQN, which redesigned the glyphs in 2020. Then the same idea in each of their spellings, and the special keyboard APL needed, with the 2741 from [TBT #15](/2026/11/19/tbt-apl-2741-green-bar/).

## Why X_eTaL

<figure class="zoomable" style="float: left; width: 260px; margin: 0.3em 1.2em 0.6em 0;">
<img src="{{ '/assets/images/posts/al21-small-core.webp' | relative_url }}" alt="A frame from the episode, A small core, grown on evidence: the core, then libraries, macro libraries and extensions, nested outward">
<figcaption>A small core, grown on evidence.</figcaption>
</figure>

Then X_eTaL itself: the name, the eXperimental Extensible Typed Array Language, LaTeX reversed; typed in plain ASCII on a US keyboard and drawn as notation; static types, inferred; ideas [borrowed on purpose](/2026/10/23/array-languages-xetal-philosophy/) from APL, BQN and J, Haskell and Rust; a small core that changes only when a real program needs it, with growth pushed out into libraries, macro libraries and extensions; and the browser editor. It ends with a look ahead at [pipelines](/2026/10/18/array-languages-xetal-pipelines/) and [equations](/2026/10/17/array-languages-xetal-equations/), [circuits](/2026/10/14/array-languages-xetal-fpga/), [GPUs](/2026/10/13/array-languages-xetal-gpu/), [3D models](/2026/10/15/array-languages-xetal-blender/) and [ray tracing](/2026/11/07/array-languages-xetal-ray-tracer/), and fine-tuning, and an exercise to try before the next episode.

## The series ahead

The first module is twelve episodes, each five to fifteen minutes. The first seven are mostly language-neutral: learn to think in arrays before learning X_eTaL's syntax.

| # | Episode |
|---|---------|
| 01 | Why another programming language? |
| 02 | From scalar loops to array operations |
| 03 | Shape, rank, axes and dimensions |
| 04 | Mapping, filtering and reducing |
| 05 | Broadcasting and array semantics |
| 06 | Array idioms: thinking without loops |
| 07 | APL, J, K, BQN and X_eTaL |
| 08 | Reading and writing X_eTaL |
| 09 | Bindings, values and immutability |
| 10 | Functions as values |
| 11 | Pipelines and function composition |
| 12 | Your first complete X_eTaL program |

Later modules (types and functional programming; idioms, macros and language design; libraries and extensions; demos and games; GPUs; machine learning and fine-tuning) get planned once the first episodes' pacing, look, voice and accuracy are settled.

## How it's made

The episode is built in [X_eTaL-video](https://github.com/softwarewrighter/X_eTaL-video), rendered with Remotion and narrated in my cloned voice using VoxCPM running on an RTX 3090 (24 GB), with my own music between sections. Every X_eTaL line it shows is run at a pinned version of X_eTaL, and the episode's README lists every fact the narration states with its source.

## Closing

I learned APL on a 2741 decades ago, and thinking in arrays has shaped how I program ever since, even in languages that don't have them. The best way to learn to think in arrays is to try it. Watch the episode, do the exercise at the end in the [browser editor](https://softwarewrighter.github.io/X_eTaL/), and tell me on [Discord](https://discord.com/invite/Ctzk5uHggZ) what was clear and what wasn't. The early episodes will shape the pacing, look and voice of the rest of the series, so feedback now matters most.
