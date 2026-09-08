---
layout: post
title: "Saw #5: Sagas, Languages, and Compiler Chains"
date: 2026-04-05 10:30:00 -0700
categories: [rust, compilers, languages, ai-agents]
tags: [sharpen-the-saw, rust, agentrail, mlpl, apl, plsw, pascal, basic, c-compiler, cor24, fpga, vibe-coding]
keywords: "saga archiving, agentrail-rs, MLPL, machine learning language, APL, PL/SW, PL/I, macros, COR24, FPGA soft CPU, C compiler, Pascal compiler, BASIC interpreter, compiler toolchain"
author: Software Wrighter
abstract: "Agentrail-rs gained saga archiving for multi-saga projects. Meanwhile, a new ML language (MLPL) took shape, PL/SW got macros, and two compiler-chain fixes unblocked APL and BASIC on COR24."
series: "Sharpen the Saw Sundays"
series_part: 5
repo_url: "https://github.com/sw-vibe-coding/agentrail-rs"
---

<img src="{{ '/assets/images/posts/bunny-saw-vert.webp' | relative_url }}" class="post-marker no-invert" alt="">

<div style="overflow: hidden;" markdown="1">

Fifth Sharpen the Saw update. [Last time](/2026/03/29/saw-pjmai-reg-emacs-all-together-now/) the focus was integration---Emacs packages, a multi-agent orchestrator. This week spread across multiple repos touching four themes: workflow infrastructure for agents, new programming languages, compiler-chain fixes that unblock downstream tools, and embedded infrastructure (monitor, shell, editor) that makes COR24 usable as a development platform.

The common thread is *dependency chains*---saga archiving lets agentrail manage MLPL's multi-phase development, MLPL draws on APL ideas validated on embedded hardware, that embedded APL needs the C compiler fixed, and BASIC needs the Pascal compiler extended. Every fix at the bottom of the stack unlocks something above it.

</div>

<div class="aside-box" markdown="1">

**Why Sharpen the Saw?** --- The name comes from Covey's [Habit 7](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. This series tracks weekly investment in the tools themselves---compilers, languages, agent infrastructure---so the feature work that sits on top of them goes faster. Five weeks in, the dependency chains are getting shorter.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repos & Live Demos** | [Table below](#repos-and-live-demos) |
| **Prior Post** | [Saw #4: All Together Now --- Emacs Meets the Multi-Agent Orchestra](/2026/03/29/saw-pjmai-reg-emacs-all-together-now/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Saga Archiving in agentrail-rs

Agentrail-rs tracks AI agent workflows as append-only saga records. Until now, one project meant one saga directory. That breaks down when a project has multiple concurrent workstreams---say, a language project where one saga covers the parser, another the runtime, and a third the test harness.

Saga archiving adds the ability to close out a completed saga and start a new one without losing history. Archived sagas move to a timestamped subdirectory, keeping the active saga directory clean while preserving the full trajectory for later analysis or ICRL replay. MLPL is the first project using saga archiving---each phase of the language (lexer, parser, interpreter, compiler) gets its own saga, archived when complete.

Not every project needs multiple sagas. The C compiler (`tc24r`) uses a single ever-growing saga that accumulates GitHub issues as they arrive from downstream projects like APL and PL/SW. When an APL feature hits a codegen gap, the issue lands in tc24r's saga and stays there until fixed. One saga, one backlog---simple and appropriate for a project driven by external bug reports rather than internal phases.

## MLPL: An APL2/J/BQN-Inspired ML Language

MLPL is a new Rust-based language inspired by APL2, J, BQN, and K, purpose-built for machine learning workflows. Unlike the [integer APL on COR24](#fixing-the-c-compiler-to-unblock-apl)---which is a minimal subset running on embedded hardware---MLPL runs on Linux and Mac with full floating-point support, first-class tensors, visual debugging, and a contract-first compartmentalized architecture.

The language is being built in Rust with a phased approach: parser and AST first, then a tree-walking interpreter, then compilation. The two APL projects inform each other: operator semantics and reduction patterns tested in COR24's constrained integer environment validate core ideas, while MLPL extends them into floating-point territory and higher-rank tensor operations that embedded hardware can't touch. MLPL is also the proving ground for agentrail's new saga archiving---each language phase gets its own saga with clean boundaries.

## PL/SW: Macros for a PL/I-Inspired Systems Language

PL/SW is a systems programming language inspired by PL/I, targeting COR24 today with an eye toward future FPGA soft CPUs. It compiles to human-readable COR24 assembler, which means you can inspect every instruction the compiler emits.

This week's milestone: **compile-time macro metaprogramming**. PL/SW macros expand at compile time and generate COR24 assembly directly, enabling:

- **Hardware abstraction**: `%MMIO_WRITE(addr, val)` expands to the correct load/store sequence
- **Inline patterns**: Loop unrolling and register allocation hints without runtime cost
- **BASED record templates**: Structured memory access patterns that the macro system can verify at compile time

The macro system is the bridge between PL/SW-as-a-language and PL/SW-as-a-systems-tool. Without it, every hardware interaction required inline assembly. With it, the language can express hardware patterns in its own syntax. The [COR24 demo hub](https://sw-embed.github.io/web-sw-cor24-demos/#/) hosts the emulator where PL/SW programs run.

<img src="{{ '/assets/images/posts/sw-enabling-tech-mermaid-diagram2.webp' | relative_url }}" alt="Enabling technology dependency diagram" class="post-image">

## Fixing the C Compiler to Unblock APL

The COR24 APL interpreter is written in C and compiled by `tc24r` (a chibicc-inspired C compiler targeting COR24's 24-bit RISC ISA). APL's array operations hit several compiler gaps:

- **Missing features**: Certain C constructs that APL's runtime relied on weren't yet implemented in tc24r
- **Code generation bugs**: Edge cases in pointer arithmetic and array indexing produced incorrect COR24 assembly

Each fix in tc24r immediately unblocked APL features that were waiting on correct codegen. The [APL REPL](https://sw-embed.github.io/web-sw-cor24-apl/) now handles more complex array expressions thanks to these fixes.

## Extending Pascal to Unblock BASIC

A similar dependency chain on the Pascal side. The COR24 BASIC interpreter runs on a Pascal p-code VM: Pascal source compiles to p-code assembler (`pa24r`), links via `pl24r`, and executes on the COR24 virtual machine. BASIC features that need new p-code instructions require Pascal compiler work first.

The Pascal compiler extensions this round added capabilities that BASIC's string handling and control flow were blocked on. Like the C/APL chain, every Pascal fix cascades into BASIC functionality.

## Embedded Tools: Monitor, Shell, and Editor

The COR24 ecosystem also gained progress on three infrastructure tools that make the platform usable as more than a compiler target.

**Monitor** (`sw-cor24-monitor`) is the low-level system monitor---the first thing that runs on COR24 hardware. It provides memory inspection, register dumps, and direct machine-code entry. Think of it as the boot ROM's interactive console.

**Script** (`sw-cor24-script`) is a shell and scripting environment for COR24. It gives the platform a command-line interface for running programs, piping output, and automating tasks---the glue layer between the monitor and the language tools above it.

**Yocto-Ed** (`sw-cor24-yocto-ed`) is an Emacs-inspired line editor for COR24. On embedded hardware without a full terminal, a line editor is the practical way to edit source files and configuration. Yocto-Ed borrows Emacs keybindings and concepts (kill ring, incremental search) scaled down to fit in COR24's memory constraints.

All three are works in progress with live demos planned.

## Repos and Live Demos

| Project | GitHub | Live Demo |
|---------|--------|-----------|
| **agentrail-rs** | [sw-vibe-coding/agentrail-rs](https://github.com/sw-vibe-coding/agentrail-rs) | N/A |
| **APL** (integer, embedded) | [sw-embed/sw-cor24-apl](https://github.com/sw-embed/sw-cor24-apl) | [APL REPL](https://sw-embed.github.io/web-sw-cor24-apl/) |
| **BASIC** | [sw-embed/sw-cor24-basic](https://github.com/sw-embed/sw-cor24-basic) | *future* |
| **COR24 Demo Hub** | [sw-embed/web-sw-cor24-demos](https://github.com/sw-embed/web-sw-cor24-demos) | [Demo Hub](https://sw-embed.github.io/web-sw-cor24-demos/#/) |
| **MLPL** (APL2/J/BQN, Rust, float) | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) | *future* |
| **Monitor** | [sw-embed/sw-cor24-monitor](https://github.com/sw-embed/sw-cor24-monitor) | *future* |
| **Pascal** | [sw-embed/sw-cor24-pascal](https://github.com/sw-embed/sw-cor24-pascal) | [Pascal Demo](https://sw-embed.github.io/web-sw-cor24-pascal/) |
| **PL/SW** | [sw-embed/sw-cor24-plsw](https://github.com/sw-embed/sw-cor24-plsw) | [PL/SW Demo](https://sw-embed.github.io/web-sw-cor24-plsw/) |
| **Script** (shell) | [sw-embed/sw-cor24-script](https://github.com/sw-embed/sw-cor24-script) | *future* |
| **tc24r** (C compiler) | [sw-embed/sw-cor24-x-tinyc](https://github.com/sw-embed/sw-cor24-x-tinyc) | N/A |
| **Yocto-Ed** (line editor) | [sw-embed/sw-cor24-yocto-ed](https://github.com/sw-embed/sw-cor24-yocto-ed) | *future* |

## What's Next

**Agentrail-rs**: Multi-saga coordination---archived sagas feeding context into new ones, so an agent starting a fresh workstream can learn from completed ones.

**MLPL**: Parser completion and first interpreter pass. The APL operator semantics validated on COR24 hardware will inform which primitives make it into MLPL's core.

**PL/SW**: Macro library for COR24 peripheral access patterns, targeting the [MakerLisp](https://makerlisp.com) hardware and eventually FPGA soft CPUs.

**COR24 compilers**: Continuing to close gaps in tc24r and the Pascal toolchain as APL and BASIC push further into their respective feature sets.

---

*Sharpen the tools, shorten the chains. Follow for more Sharpen the Saw updates.*
