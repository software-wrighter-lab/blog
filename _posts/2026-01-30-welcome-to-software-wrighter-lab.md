---
layout: post
title: "Welcome to Software Wrighter Lab"
date: 2026-01-30 09:00:00 -0800
categories: [meta, introduction]
tags: [about, rust, ai-agents, machine-learning, wasm]
keywords: "blog, YouTube, Discord, GitHub, coding agents, systems programming"
author: Software Wrighter
abstract: "Introduction to Software Wrighter Lab: a blog, YouTube channel, and GitHub repos exploring AI coding agents, systems programming in Rust, and practical ML implementations. Written by Mike Wright, a software engineer with 40+ years of experience from mainframes to modern AI."
pinned: true
toc: false
---

<img src="{{ '/assets/images/posts/welcome/avatar.webp' | relative_url }}" class="post-marker no-invert" alt="">

Welcome to Software Wrighter Lab---a blog, [YouTube channel](https://www.youtube.com/@SoftwareWrighter), [Discord server](https://discord.com/invite/Ctzk5uHggZ), and [GitHub repos](https://github.com/softwarewrighter) for exploring the intersection of AI coding agents, systems programming, and practical machine learning.

I'm Mike Wright, a software engineer with over four decades of experience, currently focused on AI-assisted development with Rust and WebAssembly.

<div class="resource-box" markdown="1">

| Quick Links | |
|-------------|---|
| **YouTube** | [@SoftwareWrighter](https://www.youtube.com/@SoftwareWrighter) |
| **GitHub** | [softwarewrighter](https://github.com/softwarewrighter) |
| **Discord** | [SW Lab](https://discord.com/invite/Ctzk5uHggZ) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

**Contents:**
- [About Me](#about-me)
- [Programming Languages](#programming-languages)
- [What This Blog Covers](#what-this-blog-covers)
- [Why "Software Wrighter"?](#why-software-wrighter)
- [What to Expect](#what-to-expect)
- [Current Projects](#current-projects)
- [Technology Stack](#technology-stack)
- [Get Involved](#get-involved)
- [What's Next](#whats-next)

## About Me

I've been writing code professionally for over 35 years---an Emacs user since 1989, still going strong.

My background spans mainframes to startups:

- **IBM Data Processing Division** - MVS Dynamic Reconfiguration and Standalone Dump (SADUMP)
- **IBM T.J. Watson Research** - Advisory Programmer on MVS Batch Pipes, Automatic Restart Manager, Java Record I/O, and IMS Data Sharing
- **Forte Software / Sun Microsystems** - Senior Programmer on Forte 4GL/Conductor/Fusion, Open Enterprise Service Bus, and Glassfish
- **Startups** - Individual contributor and management roles including LogiCoy (Open ESB), Likestream (Facebook Clojure App), Guidewire (Platform), Illumio (Network Security Web UI), and Signifyd (Gradle/Docker performance tuning)

Areas I've worked in: mainframe O/S development, EAI/B2B middleware, platform engineering, build/release engineering, and embedded programming.

## Programming Languages

Over the years, I've written production code in:

| Era | Languages |
|-----|-----------|
| **Mainframe** | APL, Assembler (S/370, S/390), IBM PL/S, PL/AS, PL/X, CMS/TSO Pipelines |
| **Systems** | C, C++ |
| **Enterprise** | Java, Forte 4GL, Guidewire Gosu, Groovy |
| **Web/Modern** | JavaScript, TypeScript, Go, Clojure, ClojureScript |
| **Current** | Elisp, JavaScript, Kotlin, Python, Rust, WebAssembly |

Each language taught me something different about how to think about problems. APL taught me array thinking. Assembler taught me what the machine is actually doing. CMS/TSO Pipelines taught me dataflow composition (an area I plan to revisit in Throwback Thursday posts). Lisp (via Clojure) taught me functional composition. Rust is teaching me ownership and fearless concurrency.

I'm a lifelong learner. When Rust emerged as a modern systems language, I dove in. When AI coding agents became capable enough to be genuine collaborators, I started exploring how they change the way we build software.

This blog and the accompanying YouTube channel document that exploration.

## What This Blog Covers

Software Wrighter Lab focuses on three main areas:

### 1. AI Coding Agents

How do tools like Claude Code, Cursor, and other AI assistants actually perform on real projects? I build the same applications with different agents to compare their strengths and weaknesses.

- **Vibe coding comparisons** (Claude vs GLM, different models)
- **Practical workflows** (parallel coding with git worktrees, hooks, custom scripts)
- **Tool development** (guardian-cli, proact, ralphy)

### 2. Machine Learning Research Implementation

When interesting ML papers come out, I implement them to understand how they work. The goal isn't to compete with research labs---it's to learn by building.

Recent implementations include:

- **Tiny Recursive Model (TRM)** - Under 1,000 parameters solving mazes
- **Hierarchical Reasoning Model (HRM)** - Planner-Doer architecture for abstract reasoning
- **MobileLLM** - Running LLMs offline on Android
- **Deepseek papers** (mHC, Engram) - Novel architectures for efficient inference
- **MIT's Recursive Language Model** - Implemented in Rust with WASM

### 3. Rust, WebAssembly, and Practical Tools

Rust is my language of choice for new projects. Combined with WebAssembly, it enables building tools that run anywhere---CLI, browser, or embedded.

Topics include:

- **Rust/Yew/WASM** web applications
- **Visualization** (Three.js, d3.js, pure CSS approaches)
- **Video production tools** (TTS, lip sync, explainer generation)
- **Developer utilities** (installation scripts, repo assistants, modularizers)

## Why "Software Wrighter"?

A "wright" is a craftsperson---someone who builds things. A wheelwright builds wheels. A playwright builds plays.

A **Software Wrighter** builds software, with attention to craft.

The name reflects my belief that good software comes from treating programming as a craft: learning continuously, choosing tools deliberately, and building things that work well and last.

## What to Expect

Posts on this blog will typically include:

- **Links to papers, repos, and videos** (above the fold)
- **Implementation details** (language, LOC, complexity assessment)
- **Working code** you can clone and run
- **Honest assessments** of what works and what doesn't

I'm not trying to sell you anything. This is a lab notebook---a record of experiments, some successful, some not.

## Current Projects

As of February 2026, I'm actively working on:

| Project | Description | Status |
|---------|-------------|--------|
| Small Models, Big Brains | 6-part series on efficient LLMs | Publishing |
| Deepseek papers | mHC and Engram implementations | In progress |
| Explainer pipeline | AI-generated video production | Ongoing |
| RLM implementations | Recursive Language Models in Rust | Complete |

## Technology Stack

Most of my current work uses:

| Layer | Technology |
|-------|------------|
| **Systems** | Rust |
| **Web** | Yew, WASM, TypeScript |
| **ML** | Python, PyTorch, HuggingFace |
| **AI Agents** | Claude Code, Cursor |
| **Video** | OBS, FFmpeg, TTS tools |

## Get Involved

If any of this resonates with you:

- **Subscribe** to the [YouTube channel](https://www.youtube.com/@SoftwareWrighter) for video content
- **Star repos** on [GitHub](https://github.com/softwarewrighter) that interest you
- **Join** the [Discord server](https://discord.com/invite/Ctzk5uHggZ) to discuss

I'm always interested in discussing these topics with other engineers exploring similar territory.

## What's Next

The first content series, **Small Models, Big Brains**, starts tomorrow. It's a 6-part deep dive into small language models that outperform much larger ones on specific tasks:

1. TRM: 976 parameters beating GPT-4 on mazes
2. MobileLLM: AI running offline on your phone
3. HRM: 27M parameters beating o3-mini on abstract reasoning
4. BDH: A language model with visible, interpretable activations
5. Billion-parameter models: The efficiency sweet spot
6. The 2-3B efficient frontier: Phi-2, Gemma, SmolLM

Each post maps to a YouTube video, a GitHub repo, and working code you can run yourself.

Thanks for reading. Let's build something interesting.

---

*Mike Wright*
*Software Wrighter LLC*
*San Francisco Bay Area*
