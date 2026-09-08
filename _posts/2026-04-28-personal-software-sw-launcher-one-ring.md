---
layout: post
title: "Personal Software #8: One Ring to Rule Them All --- sw-launcher's Memory Profiles, Heap Budgets, and a Working Scenario A"
date: 2026-04-28 12:00:00 -0700
categories: [cli-tools, rust, embedded]
tags: [sw-launcher, personal-software, rust, cli, cor24, sw-embed, emulator, memory-layout, memory-profiles, heap-budgets, p-code, vendoring, agentrail, ai-coding]
keywords: "sw-launcher, sw-launch, COR24, sw-embed, emulator, memory layout, memory profiles, heap_justification, heap budget, schema v1.2, partition grid, load plan, cache key, content-addressed cache, vendor lockfile, p-code VM, pvm, OCaml interpreter, dead-leak, algorithmic-bloat, gc-slack, segments, embedded segments, reserved heap, patches, sidecar files, scenario A B C D E, composite layer, resident process, validator, AI coding agents, personal software, Rust CLI"
author: Software Wrighter
abstract: "Thirteen sw-embed repos --- BASIC, Forth, OCaml, Pascal, PL/SW, Smalltalk, Tuplet, Macrolisp, Snobol4, APL, plus the resident-shell trio of monitor/script/yocto-ed --- each invented their own way to load code, runtime, source, and data into the COR24 emulator. The first sw-launcher schema (v1.1) tried to canonize their layout with a fixed 8 x 128 KiB partition grid; the second (v1.2) threw the grid out and replaced it with named memory profiles plus a `heap_justification` block, because the survey's real finding was not that the layouts varied --- it was that several of them were leaking. Phase 1 is shipped: `sw-launch run echo` actually exits 0 and prints \"A\" through the captured UART of a real `cor24-run` process. The post walks through both schema revisions, the memory-stance reversal that drove v1.2, and what works end-to-end today."
series: "Personal Software"
series_part: 8
repo_url: "https://github.com/sw-cli-tools/sw-launcher"
---

<img src="{{ '/assets/images/posts/block-one-ring.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 220px;">

<div style="overflow: hidden;" markdown="1">

The sw-embed monorepos cover ten-plus languages targeting the same COR24 emulator: hand-written assembler, Forth, BASIC, Pascal, PL/SW, Macrolisp, OCaml-on-p-code, Smalltalk, Tuplet, Snobol4, APL --- plus a resident-shell trio (monitor, script, yocto-ed) that does not look like a "language" at all but uses the same emulator and the same memory map. Every one of them solved the bottom-of-the-stack problem --- *get the right bytes into the right addresses, in the right order, with the runtime patched to know where the upper layers live* --- independently, with a hand-rolled `scripts/run-*.sh`. [sw-launcher](https://github.com/sw-cli-tools/sw-launcher) is the personal-software CLI that consolidates that ritual into one declarative file with caching, validation, and a vendor lockfile. Phase 0 (the survey) is done, the schema has been revised *twice* in response to what the survey found, and Phase 1 (Scenario A end-to-end) actually runs.

</div>

<div class="aside-box" markdown="1">

**Why this matters** --- AI coding agents working across multiple sw-embed repos do not have the patience or the pattern-matching to get the load plan right by inspection. They will happily write `cor24-run --load-binary out.bin@0 --load-binary app.p24@0x10000 --patch 0x12=0x10000 --entry 0` from scratch every time, sometimes inventing flags that don't exist. The fix is not better agent prompts; it is removing the freedom to invent. `sw-launch run <scenario>` is the only verb the agent gets, the TOML is the only place memory-layout decisions live, and the schema makes oversized heaps argue for themselves before the validator accepts them.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Repo** | [sw-cli-tools/sw-launcher](https://github.com/sw-cli-tools/sw-launcher) |
| **13-repo survey** | [docs/survey/index.md](https://github.com/sw-cli-tools/sw-launcher/blob/main/docs/survey/index.md) · [schema-gaps.md](https://github.com/sw-cli-tools/sw-launcher/blob/main/docs/survey/schema-gaps.md) |
| **Memory stance** | [docs/memory-stance.md](https://github.com/sw-cli-tools/sw-launcher/blob/main/docs/memory-stance.md) · [docs/heap-analysis.md](https://github.com/sw-cli-tools/sw-launcher/blob/main/docs/heap-analysis.md) |
| **COR24 emulator** | [sw-embed/cor24-rs](https://github.com/sw-embed/cor24-rs) |
| **Driven projects** | [sw-cor24-pcode](https://github.com/sw-embed/sw-cor24-pcode) · [sw-cor24-ocaml](https://github.com/sw-embed/sw-cor24-ocaml) · [sw-cor24-pascal](https://github.com/sw-embed/sw-cor24-pascal) · [sw-cor24-basic](https://github.com/sw-embed/sw-cor24-basic) |
| **Related AI Tools post** | [AI Tools #3: sw-checklist --- Reining In AI Coding Agents With a Code-Metrics Ratchet](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Problem: Every Language Has Its Own Loader

The COR24 is a 24-bit machine with 1 MiB of SRAM, a 3 KiB EBR hardware stack, and an MMIO aperture at `0xFF0000`. The host-side `cor24-run` emulator accepts a small surface --- `--load-binary path@hex_addr`, `--patch hex_addr=hex_value`, `--uart-input "..."`, `--entry`, `--speed`, `-n` --- and that's the universe.

What changes between repos is *what gets loaded where*, *which runtime word has to be patched to point at the layer above it*, and *how source and data ride the UART*. The Phase 0 survey looked at thirteen working repos and aggregated the patterns. A few from the comparison table:

| repo        | loads | patches | UART src | UART data | heap | stack | approx SRAM |
|-------------|------:|--------:|----------|-----------|------|-------|-------------|
| basic       | 1     | 0       | yes      | no        | emb  | hw EBR | ~64 KiB    |
| forth       | 0     | 0       | yes      | no        | emb  | hw EBR | ~256 KiB   |
| macrolisp   | 0--1  | 0       | yes      | snapshot  | emb  | hw EBR | ~512 KiB   |
| ocaml       | 2     | 2       | yes      | post-EOT  | emb+res | emb in pvm | ~512 KiB |
| pascal      | 1--2  | 1       | yes      | no        | emb  | emb   | ~64 KiB    |
| plsw        | 0     | 0       | yes      | no        | emb  | hw EBR | ~1 MiB    |
| snobol4     | 1--3  | 0       | yes      | mode-flag | emb  | emb   | ~128 KiB   |
| monitor     | many  | 0       | no       | no        | emb  | hw EBR | ~64 KiB    |
| tuplet      | 3     | 2       | yes      | image@0x080000 | res | emb in pvm | ~768 KiB |

Every project's `scripts/run-*.sh` re-encodes one of these shapes. None of them validate. None of them cache. None of them notice when the OCaml heap and the DSL heap overlap. And every AI agent that touches these scripts adds its own subtle variation, because the shell script is the spec.

## Two Axes, Five Shapes

The original PRD assumed one axis with three points (A: single image, B: runtime+image, C: nested interpreter). The survey says it is actually two axes:

- **Build axis**: hand-written assembly, compiled from a higher-level language, snapshot rehydrated by host tooling, or composite of N modules linked host-side.
- **Run axis**: one-shot batch (kick off and check UART), interactive REPL through UART, interactive shell with a resident process model, or edit-then-run via a resident editor.

The cross product yields five primitive shapes that cover everything sw-embed has written so far. The first three were already in the day-zero design; the last two emerged from the survey:

1. **Single image at zero, UART source.** Heap and stack embedded in the image. (apl, basic, forth, plsw, smalltalk-delegated.)
2. **Runtime + image + patch.** Native COR24 runtime at 0 plus a p-code image at a higher address with a `code_ptr`-style patch. (pascal single-unit and multi-unit, the OCaml/tuplet pattern without the heap patch.)
3. **Nested interpreter with heap-limit patch and UART-after-EOT data.** Adds a second patch (heap limit), and the UART payload is `<source> + EOT + <runtime data>`. (ocaml, tuplet.)
4. **Multi-module composite image.** The launcher loads N independently assembled modules at contiguous bases (snobol4 via `link24`) or at fixed slot addresses (macrolisp's multi-module demo, monitor's program registry). Linking happens host-side, not via patches.
5. **Resident shell + paste-and-go.** Monitor at 0, sws shell at `0x20000`, programs at fixed slots, all preloaded together; transfer of control happens *inside* the emulator via a service-vector / trampoline (`mon_invoke_program`) and never returns to the host runner. (monitor, script, yocto-ed.)

A scenario picks one shape; the schema makes that pick explicit instead of implied by which shell script you happen to run.

## Schema v1.1: Partition Grid (Considered, Then Rejected)

The first revision after the survey, schema v1.1, divided the 1 MiB SRAM into eight fixed **partitions** of 128 KiB and four **regions** per partition (`code`/`heap`/`spare`/`stack`, 32 KiB each). Most existing repos already align to obvious partition boundaries (`0x000000`, `0x010000`, `0x040000`, `0x080000`, `0x0F0000`), so re-stating those addresses in `(partition, region)` coordinates was mostly a labeling change.

It was the wrong move. The grid canonized a *layout* without taking a position on the *budgets*, which let oversized heaps express themselves as multi-cell claims and call it normal:

```toml
# v1.1: OCaml's 252 KiB heap, expressed as four contiguous cells.
# Schema accepts it, validator passes, nothing argues back.
[layers.ocaml_interp.segments.value_heap]
kind   = "heap"
grows  = "down"
claims = [
  { partition = 0, region = "spare" },
  { partition = 0, region = "stack" },
  { partition = 1, region = "code"  },
  { partition = 1, region = "heap"  },
]
```

That's the OCaml interpreter's current `heap_limit = 0x03F000` written as a partition-cell list. Pinning down the layout this way looked like progress. It was actually normalization of the bug.

## Schema v1.2: Memory Profiles + Heap Budgets

The second revision flipped the prior. From [`docs/memory-stance.md`](https://github.com/sw-cli-tools/sw-launcher/blob/main/docs/memory-stance.md):

> The COR24 board emulator targets 1 MiB SRAM. That is *more*, not less, than every machine these re-implemented languages were originally designed for: Forth in 4--16 KiB, BASIC in 4 KiB (Altair) to 32 KiB (MS BASIC for IBM PC), APL/360 in <128 KiB per partition, Smalltalk-72/76 in 128--512 KiB *including the bitmap display*, Macrolisp on a PDP-10 with 256 KiB *total*. The IBM PC shipped in 1981 with 16--256 KiB. By 1985 measure, 1 MiB and a tiny monitor is a luxurious environment.

If macrolisp on a PDP-10 fit in 256 KiB total --- runtime, interpreter, and program --- then the COR24 macrolisp's ~288 KiB *heap* is not a constraint problem. Something has gone soft. The 1 MiB ceiling does not need to be raised. The heaps need to be shrunk.

v1.2 makes that the schema's stance. Three concrete changes:

**1. The fixed grid is gone.** Replaced with **named memory profiles**. Each profile is an ordered list of partitions of arbitrary size, each with its own list of named regions of arbitrary kind and size, plus a *budget* block:

```toml
[memory_profiles.compiled-app]
description = "Single image at 0; small heap; small stack."

[[memory_profiles.compiled-app.partitions]]
name = "code"
base = "0x000000"
size = "0x010000"            # 64 KiB
regions = [
  { name = "code",   kind = "code",  size = "auto" },
  { name = "static", kind = "data",  size = "auto" },
]

[[memory_profiles.compiled-app.partitions]]
name = "heap"
base = "0x010000"
size = "0x008000"            # 32 KiB
regions = [{ name = "heap", kind = "heap", size = "0x008000" }]

[memory_profiles.compiled-app.budget]
code_max  = "0x008000"       # 32 KiB
heap_max  = "0x004000"       # 16 KiB
stack_max = "0x002000"       # 8 KiB
total_max = "0x010000"       # 64 KiB
justification_required = true
```

**2. Five default profiles ship with the launcher**, each sized per [`docs/heap-analysis.md`](https://github.com/sw-cli-tools/sw-launcher/blob/main/docs/heap-analysis.md):

| profile               | code+data | heap     | stack    | total    | example use |
|-----------------------|-----------|----------|----------|----------|-------------|
| `compiled-app`        | <= 32 KiB | <= 16 KiB| <= 8 KiB | <= 64 KiB| BASIC echo program |
| `interpreter-only`    | <= 64 KiB | <= 64 KiB| <= 16 KiB| <= 160 KiB | APL, Forth, Smalltalk |
| `repl-inline-compile` | <= 128 KiB| <= 256 KiB| <= 32 KiB| <= 448 KiB | OCaml + GC, Tuplet (post-fix) |
| `compiler-image`      | <= 256 KiB| <= 64 KiB| <= 32 KiB| <= 384 KiB | PL/SW (post-fix) |
| `resident-shell`      | <= 64 KiB per slot, up to 8 slots | per-program | shared 8 KiB | <= 512 KiB | monitor + sws + N programs |

A scenario picks a profile by name; the validator enforces that profile's budget. Layers cite partitions and regions by *name*, not by hex.

**3. Heaps over 32 KiB must argue for themselves** through a `heap_justification` block:

```toml
[layers.ocaml_interp.heap_justification]
category = "gc-slack"
note     = "Mark/sweep GC; sized for working set + 2x slack."
measured_floor_kib = 64
tracking_issue     = "sw-cor24-ocaml#28"
```

Five categories, in roughly descending order of merit:

| category             | accepted? | meaning                                              |
|----------------------|-----------|------------------------------------------------------|
| `algorithmic-floor`  | yes       | Working set genuinely requires this size.            |
| `bytecode-image`     | yes       | Heap is mostly read-only data, not allocations.      |
| `gc-slack`           | yes (with `measured_floor_kib`) | Sized for floor + slack between collections. |
| `dead-leak`          | warn; rejected by `--strict` | Allocations that never get freed. |
| `algorithmic-bloat`  | warn; rejected by `--strict` | Pointer width, boxing, dispatch tables, etc. |

The default category for an undocumented oversized heap is `dead-leak` --- because the heap-analysis pass found that all three of the demanding repos (ocaml, macrolisp, plsw) match exactly that pattern, and the first job of a budget is to refuse to normalize them.

## What the Heap Analysis Found

[`docs/heap-analysis.md`](https://github.com/sw-cli-tools/sw-launcher/blob/main/docs/heap-analysis.md) walks every repo with a claimed heap > 32 KiB and assigns it a category, a historical benchmark, and a shrinkage backlog:

| repo       | current claim   | category              | historical floor    | post-fix target |
|------------|-----------------|-----------------------|---------------------|-----------------|
| ocaml      | ~252 KiB heap   | dead-leak             | OCaml-on-PDP-10 < 256 KiB *total* (1973) | <= 64 KiB after GC |
| tuplet     | inherits ocaml  | dead-leak             | n/a (downstream)    | shrinks with ocaml |
| macrolisp  | ~288 KiB BSS    | dead-leak + bloat     | Maclisp 256 KiB *total* | <= 64 KiB heap |
| plsw       | ~1 MiB image    | algorithmic-bloat     | UCSD Pascal in 64 KiB; Turbo Pascal 1.0 in 33.5 KiB | <= 256 KiB image |
| snobol4    | ~76 KiB internal| floor + dead-leak     | SNOBOL4 in 64--256 KiB *total* | <= 64 KiB |
| forth      | dictionary      | algorithmic-floor     | Forth kernels in 4--16 KiB | <= 16 KiB typical |
| basic      | embedded DIM 64--128 KiB | algorithmic-floor | Altair 4K BASIC | <= 32 KiB |

OCaml's GC work in `sw-cor24-ocaml#28` is the one in flight. After it lands, tuplet's `heap_limit` should *shrink*, not stay where it is. Macrolisp's mark byte should be a mark *bit* (8x reduction). PL/SW's compiler-output redundancy is fixable in one pass through the transpiler. The schema must support the current sizes transitionally, but the analysis doc must not normalize them. The current sizes are evidence of work to do; not the spec for the launcher.

## Layers Are Composites, Not Blobs

Every other piece of the schema survives both revisions. A layer is still `(artifact?) + (segments)`, and segments still have lifecycles:

- **Embedded** segments live inside the artifact. `pvm.s` reserves `eval_stack`, `call_stack`, and a small `heap_seg` statically; they are part of `pvm.bin` and the loader does not allocate them again, but the validator has to *know* they exist (resolved through the artifact's listing) so the global overlap check sees them.
- **Reserved** segments are allocated by the loader at a configured cell with a configured size and zero-filled. The OCaml interpreter's value heap, the Pascal eval stack, the DSL heap on top --- none of these fit in the COR24's 3 KiB EBR; they live in high SRAM cells and the runtime gets *patched* to point at them.
- **Patched** is the verb that ties the two together. A reserved segment with `value = "self.address"` (or `self.end` for down-growing heaps) tells the loader to write its own resolved address into the runtime's `heap_base` / `heap_limit` symbol, so the runtime knows where to find the heap the loader just allocated for it.

Patches in v1.2 also accept two value forms that the survey demanded:

- `value = "sidecar:<path>"` reads a build-time-resolved address from a small text file. ocaml and tuplet today write `build/code_ptr_addr.txt` and `build/heap_limit_addr.txt` during their build; the schema makes that explicit and includes the sidecar in the cache key.
- `target = "<upstream-layer>.<symbol>"` lets a downstream layer reference a symbol in an upstream layer's listing --- including upstream layers from a *vendored* repo (Phase 2 step 002 just landed the resolver for this; tuplet wants pvm symbols from sw-cor24-ocaml's build, not its own).

## The Wizard's Spellbook --- sw-launch.toml

<div class="gutter-section" markdown="1">

<img src="{{ '/assets/images/posts/block-wizard.webp' | relative_url }}" class="gutter-img-right no-invert" alt="Wizard with staff" style="width: 18%;">

The whole config is one file at the project root. A trimmed Scenario A example, written against the `compiled-app` profile, that *actually runs end-to-end* on a real `cor24-run`:

```toml
[scenarios.echo]
target         = "cor24"
memory_profile = "compiled-app"
layers         = ["program", "stdin"]
entry          = "0x000000"

[scenarios.echo.run]
timeout_ms = 2000
max_cycles = 200_000
halt_on    = "uart-eot"

[scenarios.echo.expect]
uart_contains = ["A"]
exit_code     = 0

[layers.program]
kind     = "assembler"
source   = "local"
input    = "src/echo.s"
tool     = "assembler"
artifact = "echo.bin"

[layers.program.segments.code]
kind   = "code"
claims = [{ partition = "code", region = "code" }]

[layers.stdin]
kind = "data"
input = "tests/echo-input.txt"
load.method = "uart"
load.max_bytes = 1024
```

`sw-launch run echo` walks the layer DAG, builds each layer (or pulls it from the in-process memoization cache), assembles the load plan, invokes `cor24-run`, captures UART output, and checks the expectations. Today this prints `A` and exits 0. The CLI surface is small enough to memorize:

```
sw-launch run     <scenario>    Build (with cache) and execute, check expectations.
sw-launch build   <scenario>    Build all layers; do not execute.
sw-launch check   <scenario>    Validate config + lock; no tools run.
sw-launch graph   <scenario>    Print layer DAG (text or --json).
sw-launch cache   list          List cached artifacts.
sw-launch vendor  sync          Resolve and pin all dependencies.
sw-launch doctor                Verify host tools (cor24-run, pa24r, pl24r) found.
```

Every flag agents used to invent is now either a TOML field or a `--profile`. There is no `--load-binary` to mistype.

</div>

## Phase 1: What Runs Today

The Phase 1 saga (`sw-launcher-phase1`, ten steps) closed clean on April 28. End state:

- `sw-launch run echo --config tests/fixtures/scenario_a/sw-launch.toml` exits 0 and prints `A` (the captured UART output).
- `sw-launch check echo` validates the scenario without spawning the emulator.
- `sw-launch build echo` assembles every assembler-kind layer under `<config-dir>/.sw-launch/build/<scenario>/<layer>/` with a sha256-keyed in-process memoization cache.
- 60 tests across 11 binaries, including 2 end-to-end against the real `cor24-run` binary, all green.
- `validate.rs` implements 17 stable error codes, each with a negative test asserting the exact code and span.

The integration tests ran against `cor24-run 0.1.0`, `rustc 1.94.1`, edition 2024, on Darwin 24.6.0. Every one of those versions is recorded in the repo's `status.md` so future-me knows what "Phase 1 worked" actually meant.

Phase 2 (`sw-launcher-phase2`) is open and seeded with five steps; step 001 (PCode tool with SourceSpec resolution) and step 002 (cross-layer listing-symbol patches resolve at scenario validate time) just landed. Phase 2's target is end-to-end Scenario B: COR24 runtime at 0 plus a p-code blob at a higher address with a `code_ptr` patch --- the smallest meaningful test that the launcher can express the layered shape that today's `sw-cor24-pcode` and `sw-cor24-pascal` demos use.

## Validation: Catch Collisions Before the Emulator Does

The validator is the most important verb. `sw-launch check` reads the TOML and the lockfile, walks every segment of every layer in the scenario, computes absolute address ranges (resolving profile partitions to addresses, embedded segments through the producing layer's listing, sidecars from disk), and runs the rules. Each rule has a stable error code so agents can match on it without scraping prose.

A subset, selected for what they catch:

| Code  | Rule |
|-------|------|
| E0003 | No two memory ranges overlap (across embedded *and* reserved segments). |
| E0004 | UART layers declare `max_bytes` and the input fits. |
| E0005 | Layer kind and load method are compatible. |
| E0006 | Every patch resolves --- symbol exists, segment exists, topo order is right. |
| E0011 | Reserved `stack`/`heap`/`bss` lies inside `regions.sram`, never touches `regions.ebr_stack` or `regions.mmio`. |
| E0014 | `embedded = true` segments declare a `symbol` that resolves in the producing layer's listing. |
| E0023 | Resident-mode mismatch (a layer claims a slot the resident shell doesn't expose). |
| E0028 | Heap-budget overshoot (heap exceeds the profile's `heap_max`). |
| E0029 | Heap >= 80% of `heap_max` (warn). |
| E0030 | Missing `heap_justification` for heap > 32 KiB. |
| E0031 | Layer cites a partition or region the profile does not declare. |
| E0032 | Profile self-overlap (the profile's own partitions collide). |
| E0033 | Total claimed SRAM > 1 MiB. |
| E0034 | `heap_justification.category = "dead-leak"` or `"algorithmic-bloat"` under `--strict`. |

`--strict` mode promotes most warnings to errors and *always* rejects `dead-leak` and `algorithmic-bloat` justifications. CI runs strict; local `check` runs lax so the shrinkage work can land incrementally without breaking the build.

## Caching, Vendoring, and the Lockfile

The cost of *not* caching is that every test re-assembles `pvm.s`, every demo re-builds the host toolchain, every CI run wastes minutes. Phase 1 ships an in-process memoization cache (sha256 keyed on `(input bytes, tool version, args, output filename)`) inside the assembler tool wrapper; Phase 4 will lift that to a persistent on-disk cache at `~/.cache/sw-launch/`. The key formula already accounts for the hard cases:

```
layer_key = sha256(
    schema_version
  | normalize_toml(layer_config)
  | hash_each(input_files)
  | tool_version_hash
  | dependency_layer_hashes (in topo order)
  | resolved_address_or_uart_marker
  | sidecar_contents (if any)
)
```

A cache hit is *sound* --- if the key matches, the artifact would be byte-identical to a fresh build, so reusing it can never produce a different scenario result. Sidecar contents are in the key because v1.2's `value = "sidecar:..."` patch source needs the cache to invalidate when the sidecar changes.

The vendor side is symmetric. The survey was unflattering --- ten of thirteen repos pin nothing at all, and one (tuplet) inherits its pins transitively from sw-cor24-ocaml. Only sw-cor24-ocaml has a real `vendor/<tool>/<version>/active.env` model with commit SHAs. v1.2 makes the OCaml-style vendored model the default: `sw-launch vendor sync` (Phase 4) will resolve declared dependencies (`sibling:`, `vendor:`, eventually `git:`) and write `sw-launch.lock` with each artifact's commit hash and SHA. `sw-launch doctor` will record the *observed* version of each PATH-resolved tool too, so drift is visible even when nothing is explicitly pinned.

## What This Buys

The point is not that the TOML is shorter than the shell script --- it is often longer. The point is what *changes* about the system:

1. **One verb for agents.** `sw-launch run <scenario>` replaces the ten variants of `cor24-run --load-binary ...` that agents kept reinventing.
2. **Validation before the emulator.** The most expensive failure mode --- "ran for forty seconds, traps silently, zero output" --- is replaced by a fast `check` that names the colliding region and the offending TOML span.
3. **Heaps argue for themselves.** A 252 KiB heap is not waved through; it has to declare a category, a measured floor, and a tracking issue. `--strict` rejects `dead-leak` and `algorithmic-bloat` outright.
4. **A schema for memory layout.** Reserved heaps, embedded stacks, profile-named partitions, sidecar patches, cross-layer symbol references --- all first-class in TOML. A new language port describes its memory shape; it does not write a new shell loader.
5. **Vendor versions visible.** Sibling-repo dependencies are pinned by commit hash in the lockfile, not by "whatever was checked out at 3pm." PATH-resolved tools have their observed versions recorded too.
6. **Phase 1 actually runs.** The "what runs today" section is not a roadmap; it is what `cargo test` exercises, end-to-end, against a real emulator.

The wizard metaphor still fits the post marker: thirteen repos, each with its own ring of power, all in the end answering to one. sw-launcher is *the one ring* in the boring sense --- the one place to encode the load plan --- not in the corrupting sense, hopefully. But the more accurate metaphor for v1.2 is that the schema is a *budget officer*: every heap that wants more than 32 KiB has to file paperwork, and the default verdict on the paperwork is "this is a leak; prove otherwise."

## Where It Sits in the Personal-Software Toolkit

[sw-checklist](/2026/04/27/sw-checklist-ratchet-ai-coding-agents/), now part of the AI Tools series, sits at a different layer of the same problem: AI agents working alone produce too much variety in places where uniformity is cheaper. sw-checklist constrains the *shape of the code* (function/file/module/crate size limits); sw-launcher constrains the *shape of the load plan and the memory budget* (which addresses, which patches, how big a heap can grow before it has to file paperwork). Both are accidental complexity in Brooks's sense. Both are paying rent.

Phase 0 (survey) and Phase 1 (Scenario A end-to-end) are done. Schema v1.1 was a wrong turn that taught the right lesson: do not canonize the layout without taking a position on the budgets. Schema v1.2 takes that position, in writing, with five default profiles sized against historical implementations from the 1970s and 1980s. Phase 2 (Scenario B, runtime + p-code blob with cross-layer patches) is in flight; Phase 3 brings Scenario C (nested interpreter, heap-limit-only patches --- the tuplet shape); Phase 4 brings persistent caching and vendor sync; Phase 5 brings the resident-shell composite (D + E).

The wizard is just the post marker. The one ring is just the metaphor. The interesting part is the budget officer.
