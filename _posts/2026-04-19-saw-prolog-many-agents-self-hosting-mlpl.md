---
layout: post
title: "Saw #7: Prolog, Many-Agent Isolation, Self-Hosting Assembler, and MLPL"
date: 2026-04-19 09:30:00 -0700
categories: [rust, ai-agents, compilers, machine-learning]
tags: [sharpen-the-saw, rust, prolog, all-together-now, mosh, tmux, arch-linux, cor24, assembler, self-hosting, mlpl, multi-agent]
keywords: "Prolog in Rust, reference implementation, COR24, PL/SW, SNOBOL4, multi-agent orchestration, agent isolation, mosh, tmux, Arch Linux, per-user sandboxing, self-hosting assembler, bootstrapping compiler, sw-MLPL, language building, vibe coding"
author: Software Wrighter
abstract: "Rust-to-Prolog solves the classic Lion and Unicorn logic puzzles---a reference implementation that sets up a self-hosting COR24 port: PL/SW for the WAM-style runtime, SNOBOL4 for the lexer and parser. All-Together-Now scales to many concurrent agents with mosh, tmux, and per-user isolation on Arch Linux. The COR24 assembler begins self-hosting. sw-MLPL advances in parallel."
series: "Sharpen the Saw Sundays"
series_part: 7
repo_url: "https://github.com/sw-vibe-coding/rust-to-prolog"
---

<img src="{{ '/assets/images/posts/block-lion-unicorn-arch.webp' | relative_url }}" class="post-marker no-invert" alt="">

<div style="overflow: hidden;" markdown="1">

Seventh Sharpen the Saw update. [Last time](/2026/04/12/saw-agent-coordination-fuzzit-vendoring/) the theme was *independence*---agents coordinating without stepping on each other, tools testing other tools, compilers vendoring their dependencies. This week the theme is *controlled scale*: adding more agents, more languages, and more layers of the stack, but with infrastructure that keeps growth reliable instead of chaotic.

Four threads, one idea: the way to scale vibe-coding isn't to run harder---it's to build the platform underneath so that running harder stays safe.

</div>

<div class="aside-box" markdown="1">

**Why Sharpen the Saw?** --- The name comes from Covey's [Habit 7](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. This series tracks weekly investment in the tools themselves---agent orchestration, testing infrastructure, compiler toolchains---so the feature work on top goes faster.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Rust-to-Prolog Demos** | [sw-vibe-coding.github.io/rust-to-prolog](https://sw-vibe-coding.github.io/rust-to-prolog/) |
| **Repos & Live Demos** | [Table below](#repos-and-live-demos) |
| **Language-Building Pattern** | [language-building-tech.md](https://github.com/sw-embed/web-sw-cor24-demos/blob/main/docs/language-building-tech.md) |
| **Prior Post** | [Saw #6: Agent Coordination, Fuzzing Tests, Vendoring, and Emacs Graphics](/2026/04/12/saw-agent-coordination-fuzzit-vendoring/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Rust-to-Prolog: From Lion and Unicorn to a Full Demo Set

*"The Lion lies on Mondays, Tuesdays, and Wednesdays... the Unicorn lies on Thursdays, Fridays, and Saturdays..."* Smullyan's [Alice-in-the-Forest-of-Forgetfulness](https://en.wikipedia.org/wiki/Raymond_Smullyan) puzzles are a canonical showcase for [Prolog](https://en.wikipedia.org/wiki/Prolog): facts about when each creature tells the truth, rules for what a statement implies given the day, and a query---"what day is it?"---that the engine answers by backward-chaining through the constraints. No procedural search code; just facts, rules, and unification. That's the puzzle behind this week's image---and `liar.pl` in the demo set.

[Rust-to-Prolog](https://github.com/sw-vibe-coding/rust-to-prolog) ([live demo](https://sw-vibe-coding.github.io/rust-to-prolog/)) is a reference Prolog implementation in Rust. The in-browser demo ships a curated set of classic Prolog examples that each exercise a different feature of the interpreter:

| Demo | What It Exercises |
|------|-------------------|
| **ancestor** | Recursion and pattern matching |
| **append** | List concatenation (the canonical Prolog program) |
| **color** | Backtracking across constraint choices |
| **fib** | Fibonacci with an accumulator |
| **liar** | Smullyan's Lion Lies on Tuesdays puzzle |
| **max** | `!` (cut) and commitment |
| **member** | List membership |
| **neq** (×2) | Disequality---same atoms fail, distinct atoms succeed |
| **path** (×2) | Graph reachability: yes/no and print-each-path |
| **sum** | Tail-recursive arithmetic |

Between them they cover unification, resolution, cut, backtracking, lists, arithmetic, and graph search---the core of what a Prolog implementation has to get right. The `liar.pl` puzzle is the showcase piece, but every demo is a focused test of one language feature.

The Rust interpreter is a reference---the starting point, not the destination. The COR24 port is **one self-hosting port split across two languages**, not two competing implementations:

- **Runtime (Rust WAM → PL/SW LAM)**: The [Warren Abstract Machine](https://en.wikipedia.org/wiki/Warren_Abstract_Machine) at the heart of the interpreter---term representation, unification, choice points, and the backtracking trail---moves to PL/SW as a LAM. PL/SW is the right language for this layer: it compiles with `tc24r` and runs on COR24, so the runtime itself stops needing a host machine.
- **Front end (Rust lex/parse → SNOBOL4)**: Prolog syntax is a pattern-matching and string-processing problem, which is [SNOBOL4](https://en.wikipedia.org/wiki/SNOBOL)'s home turf. Tokenization and parsing move into `.sno` files and take natural advantage of SNOBOL4's pattern idioms.

Together the `.plsw` runtime and the `.sno` front end are a drop-in replacement for the current Rust (`.rs`) sources. The Rust implementation stays around as the oracle the ported version gets diffed against, but nothing in the on-device toolchain depends on it---the COR24 Prolog is self-hosting.

Why this split? The hard parts of a Prolog implementation---unification, backtracking, and parsing---are semantic decisions, not implementation-language decisions. Solve them once in Rust where the tooling is strong, then pick the right tool per layer for the port: SNOBOL4 for strings, PL/SW for the abstract machine, Rust for the high-confidence reference that keeps the other two honest.

## All-Together-Now: Many-Agent Isolation

[All Together Now](https://github.com/sw-vibe-coding/all-together-now) (ATN) continues to evolve toward running more agents, concurrently, with better session durability. Four changes landed this week:

- **Many agents at once**: Beyond the coordinator + workers demo from last week, ATN now supports a larger pool of concurrent agent sessions. Panels and mailboxes scale horizontally instead of hardcoding small counts.
- **[mosh](https://mosh.org) for the SSH layer**: Mosh replaces plain SSH for the control connection to the host running agents. Roaming networks, laptop sleep/wake, and dropped Wi-Fi no longer kill sessions---mosh's state sync and local echo keep the pipe alive across transient failures.
- **[tmux](https://github.com/tmux/tmux) for remote session management**: Agent sessions live inside tmux so they survive disconnects, can be re-attached from any client, and can be inspected side-by-side on a remote host. The PTY streaming in ATN's Web UI still works---tmux adds durability underneath.
- **Mac → Arch, one user per agent**: Development is moving from macOS to [Arch Linux](https://archlinux.org) on the agent host. Each agent gets its own Linux user account, so filesystem, process tree, resource limits (`ulimit`), and environment are isolated at the OS level---not just inside a coordinator process. An agent that misbehaves can only affect its own `$HOME`, its own cgroup, its own sandbox.

The theme is real boundaries. Process-level isolation inside a single user is too porous for agents that can run arbitrary code. Per-user Linux accounts give OS-enforced separation for free, and standard Unix tools (`sudo -u`, `su`, `systemd-run --uid=`) manage the dispatch.

## Self-Hosting the COR24 Assembler

<div class="resource-box" style="float: left; margin: 0 1.2em 0.8em 0; max-width: 360px;" markdown="1">

**Why these patterns?** --- COR24 languages get built different ways. Some start as reference implementations in a high-level language (Prolog in Rust). Some are cross-compiled from the host toolchain (tc24r for C). Some are self-hosted from the start and build on top of already-self-hosted layers (the native assembler, then Forth on top of it). Vendoring, reference-first, and self-hosting each solve a different problem.

The motivation, tradeoffs, and when to pick which technique are collected in one doc:

**[→ language-building-tech.md](https://github.com/sw-embed/web-sw-cor24-demos/blob/main/docs/language-building-tech.md)**

Read it for *why* this post keeps mixing approaches across Prolog, the assembler, and the rest of the COR24 stack.

</div>

[sw-cor24-assembler](https://github.com/sw-embed/sw-cor24-assembler) is the **native** COR24 assembler---a two-pass assembler written in C that, once bootstrapped, runs directly on COR24 FPGA hardware. The naming convention is strict:

| Repo | Role | Written in | Runs on |
|------|------|-----------|---------|
| [`sw-cor24-x-assembler`](https://github.com/sw-embed/sw-cor24-x-assembler) | Cross-assembler | Rust | Host (x86/ARM) |
| [`sw-cor24-assembler`](https://github.com/sw-embed/sw-cor24-assembler) | Native assembler | C | COR24 FPGA |

The `x-` prefix marks cross-tools. The plain name is the native tool that runs on the target. The bootstrap pipeline is short:

```
tc24r (Rust)                  compiles    cas24.c  →  cas24.s
sw-cor24-x-assembler (Rust)   assembles   cas24.s  →  cas24.bin
cas24.bin runs on COR24 FPGA  →  native assembler available on-device
```

Self-hosting the assembler isn't about performance---it's about removing the host PC from the inner loop. Once `cas24` runs on-device, COR24 can assemble code for itself. That unlocks every other assembly-based toolchain on the same hardware: a [Forth](https://en.wikipedia.org/wiki/Forth_%28programming_language%29) system, a [p-code VM](https://en.wikipedia.org/wiki/P-code_machine), small interpreters---all buildable on COR24 without reaching back to a host.

This is the same motivation as last week's [vendoring](/2026/04/12/saw-agent-coordination-fuzzit-vendoring/): each layer of the stack should be able to rebuild itself without reaching outside the COR24 ecosystem. Vendoring isolates compilers from each other in time; the native assembler isolates the on-device toolchain from the host machine in space.

## sw-MLPL: Tiny LM Complete, MLX Backend Started

[sw-MLPL](https://github.com/sw-ml-study/sw-mlpl) had its biggest week yet---three sagas moved forward.

**Saga 12 closed** with the tokenizers release (`v0.9.0`): a byte-level BPE trainer (`train_bpe`), `apply_tokenizer` + `decode` for round-trip validation, the `experiment "name" { body }` scoped form, and an `:experiments` registry with `compare(a, b)` for side-by-side experiment inspection. Dataset-prep built-ins (`shuffle`, `batch`, `split`) and a `--data-dir` sandboxed loader rounded out the training-pipeline surface.

**Saga 13 completed end-to-end** as `v0.10.0`---a tiny language model from embeddings to generation, all in MLPL:

| Step | Feature |
|------|---------|
| 001 | `embed(vocab, d_model, seed)` token embeddings |
| 002 | `sinusoidal_encoding(seq_len, d_model)` positional encoding |
| 003 | `causal_attention(d_model, heads, seed)` masked self-attention |
| 004 | `cross_entropy(logits, targets)` fused loss |
| 005 | `sample(logits, t, seed)` + `top_k(logits, k)` generation |
| 006 | End-to-end training demo |
| 007 | Generation loop + attention-map visualization |
| 008 | "Language Model Basics" and "Training and Generating" tutorials |

The saga also shipped a Criterion benchmark harness comparing the interpreter against compiled MLPL, a `:version` REPL command, a Workspace Introspection demo, seven new docs guides with a README index, and a `wasm32-unknown-unknown` panic fix for the `experiment` block.

**Saga 14 opened: an MLX backend.** MLPL is gaining an [Apple MLX](https://ml-explore.github.io/mlx/) runtime target so array ops can dispatch to Apple Silicon's unified-memory GPU path. Progress in the last four days:

- `mlpl-mlx` crate with MLX matmul (step 001)
- Elementwise ops and shape primitives on MLX (step 002)
- Reductions, softmax, and cross-entropy on MLX (step 003)
- `device("mlx") { ... }` scoped form for switching the active backend (step 004)
- Model DSL dispatch + `to_device` for moving models between backends (step 005)

The MLX work is the clearest example of this week's *controlled scale* theme: MLPL already had a CPU runtime, a compile-to-Rust path, and a wasm build---adding an MLX backend means experiments can now scale to GPU without changing user code, just by wrapping a block in `device("mlx") { ... }`. Same scripts, more hardware.

## Repos and Live Demos

| Project | GitHub | Live Demo |
|---------|--------|-----------|
| **Rust-to-Prolog** | [sw-vibe-coding/rust-to-prolog](https://github.com/sw-vibe-coding/rust-to-prolog) | [Prolog Demos](https://sw-vibe-coding.github.io/rust-to-prolog/) |
| **All Together Now** | [sw-vibe-coding/all-together-now](https://github.com/sw-vibe-coding/all-together-now) | *in development* |
| **COR24 Native Assembler** | [sw-embed/sw-cor24-assembler](https://github.com/sw-embed/sw-cor24-assembler) | N/A |
| **COR24 Cross-Assembler** | [sw-embed/sw-cor24-x-assembler](https://github.com/sw-embed/sw-cor24-x-assembler) | N/A |
| **sw-MLPL** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) | [MLPL Demo](https://sw-ml-study.github.io/sw-mlpl/) |
| **PL/SW** | [sw-embed/sw-cor24-plsw](https://github.com/sw-embed/sw-cor24-plsw) | [PL/SW Demo](https://sw-embed.github.io/web-sw-cor24-plsw/) |
| **SNOBOL4** | [sw-embed/sw-cor24-snobol4](https://github.com/sw-embed/sw-cor24-snobol4) | [SNOBOL4 Demo](https://sw-embed.github.io/web-sw-cor24-snobol4/) |
| **COR24 Demo Hub** | [sw-embed/web-sw-cor24-demos](https://github.com/sw-embed/web-sw-cor24-demos) | [Demo Hub](https://sw-embed.github.io/web-sw-cor24-demos/#/) |

## What's Next

**Rust-to-Prolog**: Begin the self-hosting COR24 port---PL/SW for the LAM runtime (the WAM analog) and SNOBOL4 for the lexer and parser. The Rust implementation stays around as the oracle; the ported version must pass the same demo set while running entirely on the COR24 toolchain.

**All Together Now**: Full migration to the Arch host with per-user agent accounts. Campaign to run many worker agents concurrently on a shared long-running task, using mosh/tmux durability for multi-day runs.

**COR24 Assembler**: Finish the two-pass native `cas24` implementation in C, boot it on COR24 FPGA, and validate by using it to rebuild other on-device tools (Forth, p-code VM experiments) without the host cross-assembler in the loop.

**sw-MLPL**: Fill out the MLX backend (optimizers, autograd, remaining layer ops), then re-run the Tiny LM demo end-to-end on MLX and publish a backend-parity report against the CPU path.

---

*Scaling up without breaking down takes infrastructure. Follow for more Sharpen the Saw updates.*
