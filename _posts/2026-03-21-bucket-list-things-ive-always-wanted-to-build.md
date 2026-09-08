---
layout: post
title: "Bucket List #1: Things I've Always Wanted to Build"
date: 2026-03-21 00:15:00 -0800
categories: [personal, projects]
tags: [bucket-list, retirement, learning, embedded, compilers, emulators, ai, creative-coding, home-automation]
keywords: "bucket list, retirement projects, lifelong learning, FPGA, microcontrollers, compiler, emulator, fine-tuning, Blender, procedural audio, ternary computer, Rust, embedded, AI coding agents, vibe coding"
author: Software Wrighter
abstract: "A lifelong list of technical things I always wanted to learn and build---too busy during my career, too hard before AI. Now retired, I'm working through them for fun, no deadlines. This is the introduction to the list."
series: "Bucket List"
series_part: 1
---

<img src="{{ '/assets/images/posts/block-two-buckets.webp' | relative_url }}" class="post-marker" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

Everyone has a list. Mine has been accumulating for decades---things I wanted to learn, build, or understand, but never had the time. A career in software engineering is consuming. You solve hard problems every day, but they're someone else's hard problems. Your own curiosities wait.

Two things changed. I retired. And AI coding agents got good enough to make ambitious solo projects feasible.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Bucket List** | [GitHub](https://github.com/softwarewrighter/bucketlist) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Two Enablers

**Retirement** gave me the time. No more deadlines, no more sprints, no more meetings about meetings. Just curiosity and a compiler.

**AI** gave me reach. The AI writes the code. I give direction, goals, test criteria, architectural restrictions. I prioritize. I use AI to help me research what's possible, what's been done historically, how to approach things. I'm working at a higher level than coding---reprising the roles I held during my career: team lead, architect, product manager, engineering manager. I trust but verify the work of AI designers, planners, coders, testers, and technical writers.

Projects that would have required a team, or a semester, or a level of domain expertise I didn't have---now one person can attempt them. Not by typing faster, but by operating at the right level of abstraction.

Together, retirement and AI unlocked the list.

## The List (Abridged)

I've organized these loosely by category, but the real list is messier than this. Some items are decades old. Some I added last month. Some I've already done and blogged about. Some I'm actively working on. Many are still waiting.

### Embedded and Hardware

Program microcontrollers in Rust (`no_std`). Not just blink-an-LED---real sensor networks, real communication protocols. I've been doing this with [BMP280 pressure sensors](/2026/03/17/embedded-bmp280-pressure-sensor-driver/) and I2C multiplexers, building arrays of dozens of sensors for a patent proof-of-concept.

Learn to program FPGAs. I've always been fascinated by hardware description languages---the idea that you're not writing instructions, you're describing circuits. This connects directly to another item on the list...

**Build a ternary computer.** Base-3 computing. Three-valued logic instead of binary. This is a real project---I'm in planning mode, starting with emulation, with the goal of implementing it on an FPGA. Why? Because balanced ternary is mathematically elegant, and because "why not" is a valid engineering motivation when you're retired.

Program Arduinos, Raspberry Pis, ESP32-C3s, ESP32-C6s, and various other 8-bit, 16-bit, and 32-bit microcontrollers. I want to understand the full spectrum, not just the popular ones.

### Compilers and Languages

**Write my own C compiler.** Sort of. Take an existing small C compiler and modify it for a custom ISA, adding features along the way. I never got to take a compiler class in college, and I've regretted it ever since. Every time I've used a compiler---which is every day of my career---I've been using a tool I didn't fully understand. Time to fix that.

**Implement ToonTalk.** A visual programming language I [wrote about](/2026/02/19/tbt-toontalk-visual-programming/) in the Throwback Thursday series. The original was built for teaching children to program through animated characters and spatial metaphors. I want to see if the concept can be modernized.

### Emulate Everything

I've always been drawn to instruction set architectures. The idea that you can simulate an entire computer in software---every register, every memory access, every instruction decode cycle---is endlessly satisfying.

The collection so far includes the [IBM 1130](/2026/02/26/ibm-1130-system-emulator/) (a 1960s minicomputer I have personal history with), the MakerLisp [COR24](/2026/03/13/rabbit-hole-rust-to-unsupported-isa/) (a modern 24-bit RISC for FPGAs), and plans for the RCA 1802, TI-1000, IBM 360/370/390, and RISC-V I32. Each one teaches something different about computer architecture.

### Machine Learning and AI

**Fine-tune an open-weights LLM.** Not use one---train one. Understand the full pipeline: dataset preparation, tokenizer choices, LoRA adapters, evaluation. I've written about [small models](/2026/01/31/small-models-part1-tiny-recursive-model/) and [neural net internals](/2026/02/14/neural-net-rs-educational-ml-platform/), but I want the hands-on experience of taking a base model and shaping its behavior.

### Creative and Media

**Program Blender 3D** to create physics-based animations. Not art---engineering visualizations. Simulating how things move, collide, flow.

**Generate sound effects procedurally.** No samples, no recordings---synthesize sounds from parameters. Explosions, rain, footsteps, all from math.

**Generate music.** I've already built [midi-cli-rs](/2026/02/20/midi-cli-rs-music-for-ai-agents/) and [music-pipe-rs](/2026/02/28/music-pipe-rs-unix-composition/), Unix-pipeline tools for algorithmic composition. There's more to explore here.

### Practical Home Projects

These are the ones my family actually cares about:

- **Cat tracker** --- know where the cats are without searching the house
- **Senior monitoring** --- help a family member with memory issues stay safe, without being intrusive
- **Spam call blocker** --- something smarter than a blocklist
- **Turkey deterrent** --- they invade the property regularly and are remarkably persistent
- **Wildfire detection** --- early warning for a fire-prone area
- **Automated exterior sprinkler system** --- part wildfire defense, part garden automation

Each of these is a real project, not a hypothetical. Some are in progress. Some are in the planning stage. All of them combine embedded hardware, software, and problem-solving in ways that make them genuinely fun.

## Why Blog About It?

Three reasons.

**Accountability to myself.** Writing about what I'm doing forces me to think clearly about it. If I can't explain it, I don't understand it well enough.

**Sharing the approach.** The combination of retirement + AI + decades of software experience creates an unusual vantage point. I'm not a student learning for the first time, and I'm not an expert in most of these domains. I'm an experienced engineer exploring unfamiliar territory with modern tools.

**The list itself.** Maybe other people have similar lists. Maybe seeing someone actually working through theirs is encouraging.

## What's Next

Future Bucket List posts will cover a few items at a time, mixing categories. I'll share what I've learned, what surprised me, what's harder or easier than expected, and where AI helped or didn't. No particular order. No schedule. Just whatever I'm working on.

---

*Everyone's list is different. This is mine. What's on yours?*
