---
layout: post
title: "Saw #8: Tuplet, Smalltalk-on-BASIC, Forth-from-Forth, sw-MLPL Split, and I2C on COR24"
date: 2026-04-26 09:30:00 -0700
categories: [languages, compilers, forth, smalltalk, emacs, machine-learning]
tags: [sharpen-the-saw, tuplet, smalltalk, cor24, basic, forth, forth-from-forth, espanso, gnu-apl, emacs, glyphs, wasm, dogfooding, ocaml, i2c, mlpl, mlx, cuda]
keywords: "Tuplet language, significant whitespace, glyph input, Espanso, GNU APL, Emacs glyph entry, integer Smalltalk, COR24 BASIC, dogfooding languages, forcing function, Forth-from-Forth, WebAssembly Forth, OCaml features, language playground, I2C COR24 emulator, sw-MLPL, MLX backend, CUDA backend, project compartmentalization, parallel development, demo site status tab, org-mode babel"
author: Software Wrighter
abstract: "Tuplet is a new experimental PoC language with significant whitespace and glyphs, set up as a playground for future language experiments---and the reason for installing Espanso and configuring Emacs as a shared glyph-input layer (also useful for GNU APL). An integer/toy Smalltalk written in COR24 BASIC works as a forcing function for BASIC; Tuplet plays the same role for OCaml and Forth. A new Forth-from-Forth runs in the browser via WASM. sw-MLPL splits into Linux/CUDA, Mac/MLX, and Web UI repos after its build dir crossed 35 GB. The COR24 emulator gains I2C support with examples, and the demo site's Status tab tracks the new languages with commits and issues."
series: "Sharpen the Saw Sundays"
series_part: 8
repo_url: "https://github.com/sw-vibe-coding/tuplet"
---

<img src="{{ '/assets/images/posts/block-gray-beard-sharpen-saw.webp' | relative_url }}" class="post-marker no-invert" alt="">

<div style="overflow: hidden;" markdown="1">

Eighth Sharpen the Saw update. [Last time](/2026/04/19/saw-prolog-many-agents-self-hosting-mlpl/) the theme was *controlled scale*---more agents, more languages, more layers, with infrastructure underneath to keep growth reliable. This week the theme is *forcing functions*: writing real programs in a language exposes missing language features, and outgrowing a single laptop exposes missing project structure. Either way, what breaks drives the next round of work.

Six threads, one idea: dogfood the stack and let the gaps---missing features, missing input methods, missing peripherals, an over-large build---drive what gets sharpened next.

</div>

<div class="aside-box" markdown="1">

**Why Sharpen the Saw?** --- The name comes from Covey's [Habit 7](https://en.wikipedia.org/wiki/The_7_Habits_of_Highly_Effective_People): stop cutting long enough to sharpen the blade. This series tracks weekly investment in the tools themselves---agent orchestration, testing infrastructure, compiler toolchains, language platforms---so the feature work on top goes faster.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Tuplet** | [github.com/sw-vibe-coding/tuplet](https://github.com/sw-vibe-coding/tuplet) |
| **Smalltalk on COR24 BASIC** | [github.com/sw-embed/sw-cor24-smalltalk](https://github.com/sw-embed/sw-cor24-smalltalk) |
| **Smalltalk video (YouTube Short)** | [youtube.com/shorts/fL5NLSKkLoU](https://www.youtube.com/shorts/fL5NLSKkLoU) |
| **Forth-from-Forth (proto-forth-wasm)** | [github.com/sw-vibe-coding/sw-fth-wasm](https://github.com/sw-vibe-coding/sw-fth-wasm) — [live demo](https://sw-vibe-coding.github.io/sw-fth-wasm/) |
| **COR24 Demo Hub (Status tab)** | [sw-embed.github.io/web-sw-cor24-demos](https://sw-embed.github.io/web-sw-cor24-demos/#/) |
| **Repos & Live Demos** | [Table below](#repos-and-live-demos) |
| **Prior Post** | [Saw #7: Prolog, Many-Agent Isolation, Self-Hosting Assembler, and MLPL](/2026/04/19/saw-prolog-many-agents-self-hosting-mlpl/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Tuplet: A Glyph-and-Whitespace Language Playground

<img src="{{ '/assets/images/posts/tuplet-badge.webp' | relative_url }}" class="post-marker no-invert" alt="Tuplet badge" style="width: 180px;">

[Tuplet](https://github.com/sw-vibe-coding/tuplet) is a new experimental infix language with **first-class named tuple bundles**, **multi-output verbs**, **call-site argument splicing**, and a **glyph-heavy surface syntax**. The kernel is small (~10 forms); everything else---`if/then/else`, `while`, every operator, every helper---is defined in a prelude using a single mechanism called **mint** (`▪`, BLACK SMALL SQUARE, U+25AA). User code can read, replace, or extend the same definitions the prelude uses. Tuplet compiles to Forth and runs on the COR24 runtime.

A taste of the surface syntax---a `Power` verb that uses Tuplet glyphs for type signature, assignment, and a piecewise definition:

```
                                      ⎧ 1 →
   ▪ Power (n : ℤ  e : ℤ) → (p : ℤ) ← ⎨ loop e times    iff e is positive
                                      ⎩ n (×) →
```

The glyphs in that fragment are: ▪ (BLACK SMALL SQUARE, U+25AA, mint), ℤ (DOUBLE-STRUCK Z, U+2124, integer type), → (RIGHTWARDS ARROW, U+2192, map / signature), ← (LEFTWARDS ARROW, U+2190, assign), ⎧⎨⎩ (LEFT CURLY BRACKET UPPER HOOK + MIDDLE PIECE + LOWER HOOK, U+23A7/U+23A8/U+23A9, multi-line piecewise group), and × (MULTIPLICATION SIGN, U+00D7, multiplication). Every glyph has an ASCII fallback the lexer accepts, and the lexer folds Unicode forms to ASCII canonicals at lex time so AST output and error messages stay portable. See [`docs/glyphs.md`](https://github.com/sw-vibe-coding/tuplet/blob/main/docs/glyphs.md) for the full alphabet.

Two things make Tuplet immediately practical:

- **Implementation language**: Tuplet's host implementation is an OCaml subset that runs on [sw-cor24-ocaml](https://github.com/sw-embed/sw-cor24-ocaml). Using OCaml as a load-bearing part of the toolchain forced a round of new features in the OCaml interpreter---details in the Smalltalk-and-Tuplet section below.
- **Compilation target**: Tuplet lowers to Forth, so it inherits whatever the COR24 Forth and Forth-from-Forth efforts deliver. New Forth features cascade into Tuplet for free.

## Glyph Input Infrastructure: Espanso and Emacs

A glyph language is unusable if you can't type it. The glyph-entry layer is its own piece of the toolchain, and it now has two parts:

- **[Espanso](https://espanso.org/)** is a cross-platform text expander. Installing and configuring Espanso gives every editor and terminal a shared way to type Tuplet glyphs by short trigger sequences. The same configuration also covers [GNU APL](https://www.gnu.org/software/apl/) glyph entry---APL has the canonical "language with non-ASCII glyphs" problem, and Espanso solves both at once. See [`docs/cli-inputs.md`](https://github.com/sw-vibe-coding/tuplet/blob/main/docs/cli-inputs.md) for the Tuplet trigger conventions.
- **Emacs** has its own glyph-entry configuration so the same triggers work natively in Emacs buffers without going through Espanso. TeX-style input methods, Agda-style mappings, and a custom Quail input method are all options---see [`docs/emacs-inputs.md`](https://github.com/sw-vibe-coding/tuplet/blob/main/docs/emacs-inputs.md). This keeps the editing experience consistent whether you're in a terminal REPL, a browser-based demo, or an Emacs buffer.

Glyph entry counts as Sharpen the Saw work because it is *infrastructure for future experiments*: every new language that wants non-ASCII syntax---Tuplet, GNU APL, the next experiment---rides on the same input layer.

## Smalltalk on COR24 BASIC: Dogfooding as a Forcing Function

<div class="post-aside-right" style="width: 200px;">
<img src="{{ '/assets/images/posts/smalltalk-badge.webp' | relative_url }}" alt="COR24 Smalltalk badge" style="width: 100%;">
</div>

A small **integer/toy Smalltalk** is now running, implemented in **COR24 BASIC v1**---a 26-variable, no-array, integer-only BASIC interpreter. The Smalltalk is in the spirit of the ~1000-line BASIC-hosted Smalltalk evaluator that Alan Kay's group built in 1972. It has a tagged-pointer object encoding (low-bit-1 SmallIntegers, low-bit-0 heap pointers), 14 bytecodes, 6 primitives in v0, and a real `CLASSOF -> LOOKUP -> ACTIVATE -> primitive-or-frame-push` dispatch loop. The whole heap, method table, and frames live in 1024 24-bit words of `PEEK`/`POKE` scratch RAM. Three nested fetch/decode/execute loops (p-code VM, BASIC interpreter, Tinytalk VM) run at all times.

[Video walkthrough (YouTube Short): https://www.youtube.com/shorts/fL5NLSKkLoU](https://www.youtube.com/shorts/fL5NLSKkLoU)

The point is not speed. The point is to make the OO mental model *visible*---every dispatch step is a numbered BASIC line you can single-step through---and to **dogfood** COR24 BASIC by writing a real, recognizable system in it. The forcing function worked: writing Smalltalk in BASIC immediately revealed gaps. Six BASIC feature requests landed and closed this week:

<div class="post-aside-right" style="width: 180px;">
<img src="{{ '/assets/images/posts/basic-badge.webp' | relative_url }}" alt="COR24 BASIC badge" style="width: 100%;">
</div>

| BASIC issue | Feature |
|-------------|---------|
| [FR-1](https://github.com/sw-embed/sw-cor24-basic/issues/3) | DIM integer arrays |
| [FR-2](https://github.com/sw-embed/sw-cor24-basic/issues/2) | DATA / READ / RESTORE statements |
| [FR-3](https://github.com/sw-embed/sw-cor24-basic/issues/4) | ON expr GOTO/GOSUB statements |
| [FR-4](https://github.com/sw-embed/sw-cor24-basic/issues/5) | MOD operator |
| [FR-5](https://github.com/sw-embed/sw-cor24-basic/issues/6) | Bitwise operators (BAND/BOR/BXOR/SHL/SHR) |
| [FR-6](https://github.com/sw-embed/sw-cor24-basic/issues/7) | CONT after STOP |

Tagged-pointer dispatch needs the bitwise ops; method tables and bytecode arrays want `DIM`; `DATA`/`READ` is the natural way to ship the boot image; `ON expr GOTO` is the dispatch-jump that powers the bytecode interpreter. Each was a real shortcoming Smalltalk hit, not a speculative wishlist item. The [BASIC live demo](https://sw-embed.github.io/web-sw-cor24-basic/) ships them all.

The same forcing-function pattern played out for Tuplet on the OCaml side. Eleven OCaml interpreter issues closed in the last 24 hours, almost all driven by Tuplet's host code:

<div class="post-aside-right" style="width: 180px;">
<img src="{{ '/assets/images/posts/ocaml-badge.webp' | relative_url }}" alt="COR24 OCaml badge" style="width: 100%;">
</div>

| OCaml issue | Feature |
|-------------|---------|
| [#1](https://github.com/sw-embed/sw-cor24-ocaml/issues/1)  | TRAP 2 in `demo_adventure` (round-trip bug) |
| [#2](https://github.com/sw-embed/sw-cor24-ocaml/issues/2)  | User-defined variant types (algebraic data types) |
| [#3](https://github.com/sw-embed/sw-cor24-ocaml/issues/3)  | Top-level `let` bindings (without `in EXPR`) |
| [#4](https://github.com/sw-embed/sw-cor24-ocaml/issues/4)  | String escapes (`\n`, `\t`, ...) and arbitrary tuples (3+) |
| [#5](https://github.com/sw-embed/sw-cor24-ocaml/issues/5)  | Multi-line `match` expressions |
| [#6](https://github.com/sw-embed/sw-cor24-ocaml/issues/6)  | Mutable references (`ref`, `!`, `:=`) |
| [#7](https://github.com/sw-embed/sw-cor24-ocaml/issues/7)  | Record types and field access |
| [#8](https://github.com/sw-embed/sw-cor24-ocaml/issues/8)  | List combinators (`List.map`, `List.fold_left`, `List.filter`) |
| [#9](https://github.com/sw-embed/sw-cor24-ocaml/issues/9)  | Block comments `(* ... *)` |
| [#10](https://github.com/sw-embed/sw-cor24-ocaml/issues/10) | Char literals `'a'` + `Char.code` / `Char.chr` |
| [#11](https://github.com/sw-embed/sw-cor24-ocaml/issues/11) | Exceptions (`raise` / `try` / `with`) or a `Result` type |

A lexer, AST, and IR lowering pipeline needs records, variants, top-level lets, multi-line match, mutable refs, and exceptions just to be writable. The [OCaml live demo](https://sw-embed.github.io/web-sw-cor24-ocaml/) now ships every one of those. The Forth side picked up the matching upgrades---`:NONAME` for anonymous colon definitions and a `SEE-CFA` truncation fix---in [sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth) over the same window.

## Forth-from-Forth: A Browser-Native Forth via WASM

[Forth-from-Forth](https://github.com/sw-vibe-coding/sw-fth-wasm) (`proto-forth-wasm`) is a browser-native Forth running on Rust/WASM. The Rust `Machine` owns the data stack, return stack, memory, dictionary, tokenizer, compiler, and VM loop; colon definitions compile to an opcode IR; user-word execution runs on an iterative VM loop with no host-stack recursion for nested calls. The vocabulary already covers arithmetic, stack shuffling, comparisons, structured control flow (`IF/ELSE/THEN`, `BEGIN/UNTIL`, `BEGIN/WHILE/REPEAT`, `DO/LOOP` with `I`), memory (`VARIABLE`, `CONSTANT`, `@`, `!`, `+!`, `ALLOT`), the return stack, I/O, and introspection (`SEE`, `WORDS`).

The [live demo](https://sw-vibe-coding.github.io/sw-fth-wasm/) puts the REPL, source pane, stack, dictionary, output, history, and trace all on one page. WASM matters here for the same reason a self-hosting toolchain matters elsewhere: zero-install distribution. A reader can land on the page and have a working Forth in seconds.

Two Forth-in-Forth issues closed this week pulled the project closer to self-hosting at the language level: [#1](https://github.com/sw-embed/sw-cor24-forth/issues/1) added a hashed dictionary to speed up `FIND`, and [#2](https://github.com/sw-embed/sw-cor24-forth/issues/2) added `DO/LOOP`, `?DO`, `WHILE/REPEAT`, `AGAIN`, `CONSTANT`, and `VARIABLE` to the Forth-in-Forth implementation. Open issue [#3](https://github.com/sw-embed/sw-cor24-forth/issues/3) tracks the remaining standard words: `+LOOP/J/LEAVE`, `DOES>`, `RECURSE`, `PICK/ROLL/?DUP/MIN/MAX/<=/>=/<>`.

A **Forth-builder** is in planning---a small kit (inner interpreter, dictionary, I/O backend, target word set) that composes Forth systems by configuration instead of by fork. Once the builder exists, spinning up a new Forth flavor for an experiment becomes a build-time decision.

## sw-MLPL: 35 GB Forces a Split into Parallelizable Pieces

<div class="post-aside-left" style="width: 200px;">
<img src="{{ '/assets/images/posts/mlpl-badge.webp' | relative_url }}" alt="sw-MLPL badge" style="width: 100%;">
</div>

[sw-MLPL](https://github.com/sw-ml-study/sw-mlpl) ([live demo](https://sw-ml-study.github.io/sw-mlpl/)) hit a different kind of forcing function this week: its build directory blew past **35 GB on a MacBook**, and that is *without* the CUDA backend wired in yet. A single repo trying to hold a CPU runtime, the [MLX](https://ml-explore.github.io/mlx/) backend, a future CUDA backend, an interpreter, a compiler, a REPL, and a Web UI is not a structure that fits on one laptop.

The fix is to split:

- **Linux/CUDA only** --- one fork that targets [NVIDIA CUDA](https://developer.nvidia.com/cuda-toolkit) and lives on a host with the disk space and toolchain to support it.
- **Mac/MLX only** --- a sibling fork that stays on Apple Silicon and the MLX unified-memory path, where the build stays small enough to iterate on a laptop.
- **Web UI separated** --- the in-browser demo carved out into its own repo, decoupled from the runtime build cycle.
- **Compiler and REPL separated** --- the two have different dependency profiles and different test harnesses; separating them lets each grow without dragging the other's build along.

The win is not just disk space. Once the project is split, different hosts can develop different pieces in parallel: a Linux/CUDA box pushes the GPU backend while a MacBook iterates on MLX or the compiler, and neither waits on the other's artifacts. The Web UI repo's CI doesn't care which backend any given commit targets. This is the same pattern the COR24 stack uses by default---small, single-purpose, parallelizable repos---applied retroactively to a project that grew past the point of fitting in one place.

## I2C on the COR24 Emulator

<div class="post-aside-right" style="width: 200px;">
<img src="{{ '/assets/images/posts/block-bmp280.webp' | relative_url }}" alt="BMP280 I2C sensor breakout" style="width: 100%;">
</div>

The [COR24 emulator](https://github.com/sw-embed/sw-cor24-emulator) is gaining **I2C** support, with example programs to drive it. I2C unlocks the obvious next layer of peripheral experiments---temperature/pressure sensors (the [BMP280 repo](https://github.com/sw-embed/bmp280) is already in the tree), small EEPROMs, OLED displays, and any of the usual hobbyist breakout boards. I2C is the right first bus for the emulator: low pin count, well-documented protocol, plenty of devices to talk to, and the bring-up code is small enough that the Smalltalk and Tuplet languages above could plausibly drive a real sensor in a future demo.

The pattern is the same as everywhere else in this post: build the platform piece (the bus, the examples) so that future feature work has somewhere to land.

## Demo Site: Status Tab Tracks the New Languages

The COR24 demo hub now has a **Status tab** that tracks the languages, their recent commits, and their open issues in one place. Adding Tuplet and Smalltalk to the lineup made the per-language pages harder to skim, so the Status tab consolidates:

- The current language list (now including **Tuplet** and **Smalltalk**, alongside PL/SW, SNOBOL4, MLPL, BASIC, Forth, OCaml, Pascal, APL, MacroLisp, P-code, TinyC, and the assemblers).
- Recent commits per language---a single cross-repo activity feed.
- Open issues per language, so the in-flight work is visible without bouncing between GitHub repos.

[Demo Hub (and Status tab): sw-embed.github.io/web-sw-cor24-demos/#/](https://sw-embed.github.io/web-sw-cor24-demos/#/)

The Status tab is the same kind of investment as the glyph-input layer and the I2C bus: *infrastructure for moving faster*, not a feature in any one language. New languages plug into it; the cost of adding the next one is now bounded.

## Repos and Live Demos

| Project | GitHub | Live Demo |
|---------|--------|-----------|
| **Tuplet** | [sw-vibe-coding/tuplet](https://github.com/sw-vibe-coding/tuplet) | *in development* |
| **Smalltalk on COR24 BASIC** | [sw-embed/sw-cor24-smalltalk](https://github.com/sw-embed/sw-cor24-smalltalk) | [sw-embed.github.io/web-sw-cor24-smalltalk](https://sw-embed.github.io/web-sw-cor24-smalltalk/) |
| **Forth-from-Forth (WASM)** | [sw-vibe-coding/sw-fth-wasm](https://github.com/sw-vibe-coding/sw-fth-wasm) | [sw-vibe-coding.github.io/sw-fth-wasm](https://sw-vibe-coding.github.io/sw-fth-wasm/) |
| **COR24 BASIC** | [sw-embed/sw-cor24-basic](https://github.com/sw-embed/sw-cor24-basic) | [sw-embed.github.io/web-sw-cor24-basic](https://sw-embed.github.io/web-sw-cor24-basic/) |
| **COR24 Forth** | [sw-embed/sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth) | [sw-embed.github.io/web-sw-cor24-forth](https://sw-embed.github.io/web-sw-cor24-forth/) |
| **COR24 OCaml** | [sw-embed/sw-cor24-ocaml](https://github.com/sw-embed/sw-cor24-ocaml) | [sw-embed.github.io/web-sw-cor24-ocaml](https://sw-embed.github.io/web-sw-cor24-ocaml/) |
| **COR24 Emulator (I2C)** | [sw-embed/sw-cor24-emulator](https://github.com/sw-embed/sw-cor24-emulator) | [sw-embed.github.io/cor24-rs](https://sw-embed.github.io/cor24-rs/) |
| **sw-MLPL** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) | [sw-ml-study.github.io/sw-mlpl](https://sw-ml-study.github.io/sw-mlpl/) |
| **COR24 Demo Hub** | [sw-embed/web-sw-cor24-demos](https://github.com/sw-embed/web-sw-cor24-demos) | [Demo Hub](https://sw-embed.github.io/web-sw-cor24-demos/#/) |

## What's Next

**Tuplet**: Get the Tuplet live demo working alongside the other COR24 language demos, and add a way to enter glyphs directly in the Tuplet web UI (so visitors don't need Espanso or Emacs configured locally to try the demo).

**Smalltalk on COR24 BASIC**: Get the Smalltalk live demo working---a browser-hosted version of the BASIC interpreter running the Tinytalk image, so the YouTube walkthrough has a hands-on counterpart.

**Glyph Input + Emacs**: Publish concrete Emacs configuration examples (init snippets, Quail rules, TeX-style mappings) drawn from `docs/emacs-inputs.md`, and add **org-mode support**---which means babel blocks for Tuplet *and* every other COR24 language (BASIC, Forth, OCaml, PL/SW, SNOBOL4, etc.). Babel-blocks across the language set turns org-mode into a real notebook for the COR24 stack.

**Forth-from-Forth**: Close the remaining standard Forth words ([sw-cor24-forth #3](https://github.com/sw-embed/sw-cor24-forth/issues/3)) and start the Forth-builder kit so new Forth flavors compose by configuration.

**sw-MLPL Split**: Land the four-way split (Linux/CUDA, Mac/MLX, Web UI, separated Compiler vs. REPL) and confirm each piece builds cleanly on a host that doesn't have the others' dependencies. Republish the live demo from the new Web UI repo.

**COR24 Emulator I2C**: Land the first round of I2C example programs end to end (sensor reads, EEPROM round-trip), then expose I2C from the higher-level languages so a Tuplet or Smalltalk program can drive a peripheral.

---

*Forcing functions sharpen languages faster than feature lists do. Follow for more Sharpen the Saw updates.*
