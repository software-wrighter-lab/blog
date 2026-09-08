---
layout: post
title: "Saw #6: Agent Coordination, Fuzzing Tests, Vendoring, and Emacs Graphics"
date: 2026-04-12 09:30:00 -0700
categories: [rust, ai-agents, testing, compilers, emacs]
tags: [sharpen-the-saw, rust, all-together-now, fuzzit, vendoring, plsw, snobol4, cor24, multi-agent, fuzzing, emacs, svg, paperbanana]
keywords: "agent coordination, multi-agent orchestration, Claude Code, opencode, GLM-5, mailboxes, wiki, fuzz testing, fuzzit, vendoring, PL/SW, SNOBOL4, Fortran compiler, COR24, parallel development, Emacs graphics, SVG, PaperBanana, elisp"
author: Software Wrighter
abstract: "All Together Now gained a multi-panel Web UI for coordinating Claude Code and opencode/GLM-5 agents. Fuzzit became an LLM-guided fuzzing tool that stress-tests CLIs and APIs. Vendoring in the COR24 compiler chain lets PL/SW and SNOBOL4 evolve independently. Emacs Graphics brings PaperBanana-styled SVG charts, menus, and presentations to Emacs buffers."
series: "Sharpen the Saw Sundays"
series_part: 6
repo_url: "https://github.com/sw-vibe-coding/all-together-now"
---

<img src="{{ '/assets/images/posts/block-robots-card-table.webp' | relative_url }}" class="post-marker no-invert" alt="">

<div style="overflow: hidden;" markdown="1">

Sixth Sharpen the Saw update. [Last time](/2026/04/05/saw-saga-archiving-mlpl-plsw-cor24-compilers/) the theme was dependency chains---saga archiving, new languages, and compiler fixes cascading through the stack. This week the theme is *independence*: making agents coordinate without stepping on each other, testing tools without trusting their error handling, and letting compilers evolve without breaking their downstream consumers.

Four projects, one idea: build the infrastructure so that parallel work stays parallel.

</div>

<div class="aside-box" markdown="1">

**Why Sharpen the Saw?** --- The name comes from Covey's [Habit 7](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. This series tracks weekly investment in the tools themselves---agent orchestration, testing infrastructure, compiler toolchains---so the feature work on top goes faster.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repos & Live Demos** | [Table below](#repos-and-live-demos) |
| **Prior Post** | [Saw #5: Sagas, Languages, and Compiler Chains](/2026/04/05/saw-saga-archiving-mlpl-plsw-cor24-compilers/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## All Together Now: Multi-Agent Coordination Demo

All Together Now (ATN) is a program manager that orchestrates multiple AI agent sessions running in isolated PTY environments. The new milestone is a demo that shows **Claude Code as coordinator** delegating tasks to multiple **opencode/GLM-5 worker agents**, with the agents collaborating through mailboxes and a shared wiki.

The Web UI (Yew/WASM) now presents this as a **multi-panel layout**:

- **Agent terminal panels**: Each agent's TUI runs in its own panel, with live PTY streaming so you see exactly what the agent sees
- **Tabbed views**: Switch between agent-graphs (who's talking to whom), wiki pages (shared durable state), agentrail Sagas per agent (workflow history), and mailbox events (messages flowing to and from the coordinator)

The coordination model separates two planes: a **terminal I/O plane** (raw PTY bytes, keystroke forwarding) and an **orchestration plane** (structured JSON events for feature requests, completion notices, and status updates). The coordinator doesn't type into worker terminals---it sends structured messages through mailboxes. Workers read their mailbox, do their work, and post results back. The wiki provides durable shared state: goals, decisions, and context that any agent can read without asking.

This matters because the alternative---agents talking through unstructured terminal paste---is fragile and loses context. Mailboxes give you a clean event log. The wiki gives you shared memory that survives agent restarts. Agentrail sagas give you per-agent workflow audit trails.

## Fuzzit: Testing Tools with Extreme Inputs

Fuzzit is an LLM-guided fuzz testing tool built to discover crashes, hangs, panics, and unexpected behavior in CLIs, compilers, interpreters, REPLs, and APIs. The core idea: **a tool that tests other tools** by throwing extreme and random inputs at them to validate error handling.

Fuzzit runs four-layer fuzzing campaigns with budget allocation across:

| Layer | Budget | What It Does |
|-------|--------|--------------|
| **Baseline** | 30% | Deterministic edge cases---empty inputs, whitespace storms, deep nesting, invalid UTF-8, huge payloads |
| **LLM Seeds** | 10% | Targeted seed generation via local Ollama models that understand the tool's grammar and API surface |
| **Mutations** | 40% | Bit flips, insertions, deletions, and crossover applied to seeds that previously triggered interesting behavior |
| **Feedback** | 20% | Retain and re-mutate inputs that produced new exit codes, slow responses, or unusual stderr output |

Each finding gets deterministically classified: panic, hang (wall-time timeout), segfault, unexpected exit code, or stderr anomaly. Interesting findings are automatically promoted to Rust regression tests, so once Fuzzit finds a bug, the fix stays tested forever.

No cloud dependencies---Fuzzit uses local Ollama for LLM-guided seeds, making it practical for testing proprietary tools and compilers that can't be sent to external services. The nine-crate workspace (fz-core, fz-manifest, fz-corpus, fz-exec, fz-classify, fz-mutate, fz-llm, fz-artifacts, fz-cli) keeps concerns separated and testable.

The immediate use case: Fuzzit is already testing the COR24 compiler toolchain (tc24r, PL/SW, Pascal) to find codegen bugs that downstream languages would otherwise discover the hard way.

## Vendoring: Parallel Development Without the Pain

The COR24 compiler chain has a dependency problem. PL/SW is written in C and compiled by `tc24r` (the C cross-compiler). SNOBOL4 is written in PL/SW. A new Fortran compiler will be written in SNOBOL4. Each layer depends on the one below it, and changes at any level can break everything above.

**Vendoring** solves this by pinning stable snapshots:

- **PL/SW vendors tc24r**: The PL/SW repo includes a known-good version of the C compiler. I can add features or fix bugs in tc24r's main branch without breaking PL/SW mid-development. When a tc24r improvement is ready and tested, PL/SW explicitly updates its vendored copy.
- **SNOBOL4 vendors PL/SW**: Same pattern one level up. SNOBOL4 works against a stable PL/SW compiler. PL/SW macro system changes don't destabilize the SNOBOL4 interpreter until deliberately promoted.
- **Fortran vendors SNOBOL4**: The new Fortran compiler (upcoming) will vendor SNOBOL4, giving it a stable implementation language while SNOBOL4 continues evolving.

This is the same idea behind Go's `vendor/` directory or Rust's `Cargo.lock`---except applied to entire compiler toolchains in an embedded ecosystem. Each project controls when it absorbs upstream changes, so three developers (or three agent sessions) can work on three layers simultaneously without coordination overhead.

The alternative was what we had before: fix a C compiler bug, rebuild PL/SW, discover the fix exposed a PL/SW assumption, fix that, rebuild SNOBOL4, discover *that* exposed a SNOBOL4 assumption. Vendoring breaks the cascade. Fix, test, promote when ready.

## Emacs Graphics: PaperBanana-Style Visuals in Emacs

[Graphical Experiments](https://github.com/sw-emacs/graphical-experiments) is a new project exploring what happens when you bring PaperBanana-styled graphics into Emacs---SVG menu cards, inline charts, animated headers, and slide presentations, all rendered in native Emacs buffers.

The project is a kit of six Elisp packages:

| Package | What It Does |
|---------|--------------|
| **pb-menu** | PaperBanana-style SVG menu cards with rounded corners, icons, and solarized color palette |
| **pb-chart** | Bar charts, sparklines, and scatter plots rendered as inline SVG |
| **pb-media** | Image viewing and an animated header-line "heat" indicator |
| **pb-present** | A minimal slide/presentation mode with keyboard navigation (`n`/`p`/`q`) |
| **pb-web** | Browser embedding helpers---xwidgets if available, EAF fallback, else external browser |
| **pb-demo-init** | Convenience loader and command index |

The immediate goal is a visual toolkit for Emacs that feels like PaperBanana's aesthetic---warm card layouts, clean data visualizations, and interactive menus---without leaving the editor. The longer-term direction includes clickable menu actions, layout helpers for arrows and swimlanes, Org integration for slides rendered from headings, and Rust-backed SVG layout for more complex graph visualizations.

Everything is built on Emacs 29+'s native SVG support (`svg.el`), keeping the code small and hackable. No external rendering dependencies---if your Emacs build supports SVG images, the demos work.

## Repos and Live Demos

| Project | GitHub | Live Demo |
|---------|--------|-----------|
| **All Together Now** | [sw-vibe-coding/all-together-now](https://github.com/sw-vibe-coding/all-together-now) | *in development* |
| **Fuzzit** | [sw-cli-tools/fuzzit](https://github.com/sw-cli-tools/fuzzit) | N/A |
| **Emacs Graphics** | [sw-emacs/graphical-experiments](https://github.com/sw-emacs/graphical-experiments) | N/A |
| **PL/SW** | [sw-embed/sw-cor24-plsw](https://github.com/sw-embed/sw-cor24-plsw) | [PL/SW Demo](https://sw-embed.github.io/web-sw-cor24-plsw/) |
| **SNOBOL4** | [sw-embed/sw-cor24-snobol4](https://github.com/sw-embed/sw-cor24-snobol4) | [SNOBOL4 Demo](https://sw-embed.github.io/web-sw-cor24-snobol4/) |
| **Fortran** | [sw-embed/sw-cor24-fortran](https://github.com/sw-embed/sw-cor24-fortran) | *future* |
| **tc24r** (C compiler) | [sw-embed/sw-cor24-x-tinyc](https://github.com/sw-embed/sw-cor24-x-tinyc) | [TinyC Demo](https://sw-embed.github.io/web-sw-cor24-tinyc/) |
| **agentrail-rs** | [sw-vibe-coding/agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) | N/A |
| **COR24 Demo Hub** | [sw-embed/web-sw-cor24-demos](https://github.com/sw-embed/web-sw-cor24-demos) | [Demo Hub](https://sw-embed.github.io/web-sw-cor24-demos/#/) |

## What's Next

**All Together Now**: Live multi-agent demo with Claude Code coordinating opencode/GLM-5 workers on a real task---likely a collaborative code review or multi-repo refactor. The Web UI will stream all panels simultaneously.

**Fuzzit**: Expanding target coverage beyond compilers---next up are the COR24 embedded tools (monitor, shell, editor) and the agentrail-rs CLI. Campaign comparison reports to track regression across tool versions.

**Emacs Graphics**: Clickable menu actions on the SVG cards, Org-mode integration so presentation slides render from headings, and exploring Rust-backed SVG layout helpers for more complex graph and swimlane diagrams.

**Vendoring**: Establishing the Fortran-vendors-SNOBOL4 relationship as the Fortran compiler scaffolding begins. Documenting the vendoring protocol so agent sessions can update pinned versions without manual intervention.

---

*Parallel work needs parallel infrastructure. Follow for more Sharpen the Saw updates.*
