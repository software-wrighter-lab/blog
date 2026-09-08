---
layout: post
title: "Embedded #3: How Much of Forth Can Be Forth? A Kernel Self-Hosting Spectrum"
date: 2026-04-20 18:30:00 -0700
categories: [embedded, programming-languages, deep-dive]
tags: [embedded, forth, self-hosting, cor24, assembler, kernel, bootstrapping, vibe-coding, language-building, threaded-code]
keywords: "Forth self-hosting, Forth kernel, threaded code, COR24, sw-cor24-forth, forth-in-forth, forth-on-forthish, forth-from-forth, NAND primitive, DOCOL, NEXT, EXIT, SP@, bootstrapping, primitive set, minimal kernel, meta-circular"
author: Software Wrighter
abstract: "How much of a Forth kernel can be written in Forth instead of assembly? Four points along that spectrum, from a 3000-line all-asm kernel to a Forth-hosted cross-compiler that emits its own .s file. This post walks through phase 1 (all-asm), phase 2 (forth-in-forth, shipped with XMX-hashed FIND and a 1-entry lookaside cache), phase 3 (forth-on-forthish, first two subsets shipping — ,DOCOL plus Forth : and ;), and phase 4 (forth-from-forth, future). Plus the performance work — hashing, cache, adaptive web pump-loop, build-time snapshot."
series: "Embedded"
series_part: 3
repo_url: "https://github.com/sw-embed/sw-cor24-forth"
---

<img src="{{ '/assets/images/posts/block-questions-marks-escher.webp' | relative_url }}" class="post-marker no-invert" alt="">

<div style="overflow: hidden;" markdown="1">

How much of a Forth kernel can be written in Forth instead of assembly? The question has an obvious answer (*"as much as possible"*) and a less obvious answer (*"it depends on which phase of the bootstrap you're in"*). This post walks through four points along that spectrum for the [COR24 Forth](https://github.com/sw-embed/sw-cor24-forth) kernel: two phases shipped, a third in progress with its first subsets landing, and a fourth on the horizon.

It's a deep dive — every movement of a word from `.s` to `.fth` changes the bootstrap ordering, the primitive set, and what the next movement looks like. Forth is an unusually good language for showing its own self-extending nature, and reading the phases in sequence reads like one of Escher's drawings: each hand sketching the other.

</div>

<div class="aside-box" markdown="1">

**Why this matters** --- Self-hosting is the final test that a language is expressive enough for systems work. Moving Forth words from assembly into Forth itself shows exactly where the irreducible floor is: the primitives that *must* be machine code. Everything above that floor can, in principle, live in `.fth` source.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Play in Browser** | [COR24 Forth Demo](https://sw-embed.github.io/web-sw-cor24-forth/) — three tabs: *forth.s* (phase 1), *forth-in-forth* (phase 2, default), *forth-on-forthish* (phase 3 in progress) |
| **Forth Interpreter (CLI)** | [sw-embed/sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth) |
| **Web Demo** | [sw-embed/web-sw-cor24-forth](https://github.com/sw-embed/web-sw-cor24-forth) |
| **Approach Comparison** | [docs/future.md](https://github.com/sw-embed/sw-cor24-forth/blob/main/docs/future.md) |
| **Phase 2 Status** | [forth-in-forth/docs/status.md](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-in-forth/docs/status.md) |
| **Closed Issues** | [#1 hashed dictionary](https://github.com/sw-embed/sw-cor24-forth/issues/1) · [#2 DO/LOOP & friends](https://github.com/sw-embed/sw-cor24-forth/issues/2) |
| **Prior Post** | [Embedded #2: COR24 Assembly Emulator](/2026/03/22/cor24-rs-assembly-emulator/) |
| **Follow-on post** | [Rabbit-hole #2: FORTH --- FIND and the Cost of a Name](/2026/04/23/rabbit-hole-deep-dive-forth-find-cost-of-a-name/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Four Approaches

A single axis: what fraction of the kernel is hand-written assembly, and what fraction is Forth? Four labeled points along it:

| # | Name | Directory | Where the kernel comes from |
|---|------|-----------|---|
| 1 | All-asm kernel | `./` (repo root) | Hand-written `.s` |
| 2 | Tiered Forth on a slimmed kernel | `./forth-in-forth/` | Hand-written `.s` + hand-written `.fth` |
| 3 | Minimal-primitive kernel | `./forth-on-forthish/` | Smaller `.s` (a Forth-*ish* primitive substrate) + larger `.fth` |
| 4 | Self-hosted via cross-compiler | `./forth-from-forth/` | Hand-written *Forth* compiler emits the `.s` |

The preposition family — *in / on-ish / from* — signals what the kernel **is** to the Forth code on top of it:

- In approach 2, Forth runs **in** a slimmed asm host.
- In approach 3, the substrate is so reduced it's barely asm any more — Forth runs on something that's already Forth-**ish**.
- In approach 4, the kernel itself comes **from** Forth (Forth source emits the `.s`).

## Phase 1: All-Asm Kernel — Where We Started

`forth.s` as a single self-contained file. Every word is assembly, including `IF`/`THEN`, `.`, `WORDS`, `.S`, `\`, `(`, and so on. About 3000 lines of asm, 3879 bytes assembled. Still the canonical kernel for the web frontend and the existing [reg-rs](https://github.com/sw-vibe-coding/agentrail-rs) regression tests.

This was the right starting point. A single-file kernel is easy to debug, easy to load, and explicit about every mechanism. The cost: it doesn't show Forth's most characteristic feature — *self-extension* — because everything is already defined in asm. There's no moment where Forth makes itself bigger.

## Phase 2: forth-in-forth — Shipped Today

`forth-in-forth/kernel.s` plus four tiered `.fth` files: `core/minimal.fth`, `lowlevel.fth`, `midlevel.fth`, `highlevel.fth`. The kernel keeps only what *must* be asm — the threading layer, ALU primitives, hardware I/O, the dict-text triplet (`WORD`/`FIND`/`NUMBER`), the outer loop (`INTERPRET`/`QUIT`), and `:`/`;`. Everything else moved to `.fth`.

The migration happened in 11 subsets, each a single commit:

| Subset | Description | Commit |
|--------|-------------|--------|
| 1 | Baseline fib example, demo, reg-rs test | `86edf74` |
| 2 | Scaffold `forth-in-forth/` directory | `94e76b2` |
| 3 | Move `IF`/`THEN`/`ELSE`/`BEGIN`/`UNTIL` to Forth | `686c65f` |
| 4 | Move `\` and `(` to Forth (add `EOL!` primitive) | `71e1627` |
| 5 | Stack & arith helpers in `core/lowlevel.fth` | `7d0037c` |
| 6 | `=` and `0=` via `XOR` | `ce57489` |
| 7 | `CR` `SPACE` `HEX` `DECIMAL` to Forth | `06a8dca` |
| 8 | `.` to Forth (hide asm `.`) | `12de5b1` |
| 9 | `DEPTH` / `.S` to Forth (add `SP@` primitive) | `d65ae26` |
| 10 | `WORDS` `VER` `SEE` to Forth (add `'`, `>NAME`) | `c908615` |
| 11 | `repl.sh` and `see-demo.sh` | `8c9104a` |

The net movement was 18 words **out** of asm, 3 new asm primitives **in**, and 19 brand-new Forth words **added on top**:

| Category | Words |
|----------|-------|
| **Moved asm → Forth** (18) | IF, THEN, ELSE, BEGIN, UNTIL, `\`, `(`, `=`, `0=`, CR, SPACE, HEX, DECIMAL, `.`, DEPTH, .S, WORDS, VER |
| **New asm primitives** (3) | `[']` (needed for Forth IF/THEN to compile BRANCH/0BRANCH at compile time), `EOL!` (needed for Forth `\` to end the input line), `SP@` (needed for Forth `DEPTH`/`.S` to inspect the stack pointer) |
| **New Forth words** (19) | NIP, TUCK, ROT, -ROT, 2DUP, 2DROP, 2SWAP, 2OVER, 1+, 1-, NEGATE, ABS, /, MOD, 0< (lowlevel); `'`, PRINT-NAME, >NAME, SEE (highlevel) |

The headline numbers after phase 2:

| Category | Before | After | Δ |
|----------|-------:|------:|--:|
| asm dictionary entries | 65 | 50 | **−15** |
| asm lines (`kernel.s`) | 2852 | 2239 | **−613 (−22%)** |
| Assembled binary bytes | 3879 | 2786 | **−1093 (−28%)** |
| Forth colon defs (`core/*.fth`) | 0 | 37 | **+37** |
| **Total vocabulary visible at REPL** | **62** | **86** | **+24** |

Forth words, by tier:

| Tier | Count | Words |
|------|------:|-------|
| minimal.fth | 9 | BEGIN UNTIL IF THEN ELSE `0=` `=` `(` `\` |
| lowlevel.fth | 15 | NIP TUCK ROT -ROT 2DUP 2DROP 2SWAP 2OVER `0<` 1+ 1- NEGATE ABS `/` MOD |
| midlevel.fth | 5 | CR SPACE HEX DECIMAL `.` |
| highlevel.fth | 8 | DEPTH .S `'` PRINT-NAME WORDS VER >NAME SEE |

`SEE SQUARE` now prints `DUP * ;`. `SEE CUBE` prints `DUP SQUARE * ;`. The machinery for decompiling a colon definition lives in Forth, because `SEE` itself is Forth. That's the self-extending story the all-asm kernel couldn't tell.

### Why Phase 2 Stopped Where It Did

Three categories of word resist moving to Forth, and together they explain the ~50 asm primitives left:

1. **Threading-layer primitives are below Forth's level.** `NEXT`, `DOCOL`, `EXIT`, `LIT`, `BRANCH`, `0BRANCH`, `EXECUTE` define *how* threaded code runs. They can't themselves be threaded code — the CPU has to jump to them.
2. **Some primitives need hardware/ALU/memory access.** `+`, `@`, `!`, `KEY`, `EMIT`, `LED!`, `SW?` ultimately compile to native instructions. Forth can wrap them, but something has to execute the actual `add`, `lw`, `sw`, or memory-mapped UART access.
3. **Bootstrap-phase primitives need to exist *before* any `.fth` source loads.** `WORD`, `FIND`, `NUMBER`, `:`, `;`, `INTERPRET`, `QUIT` are all *used* by the outer interpreter that reads `.fth` source. They could be Forth in principle — but only if a *smaller* bootstrap interpreter runs first. Phase 2 sidesteps the recursion by keeping them in asm.

Phase 3 doesn't dodge category 3. It attacks it head-on.

## What the Web Port Taught Us

Building the phase 2 tab in [web-sw-cor24-forth](https://sw-embed.github.io/web-sw-cor24-forth/) — alongside the phase 1 `forth.s` tab, and now joined by a phase 3 `forth-on-forthish` tab — surfaced two categories of learning: **performance** and **vocabulary**.

The performance thread spans three hash functions, a 1-entry lookaside cache, an adaptive web pump-loop, and a build-time bootstrap snapshot (infrastructure shipped but gated off for measurement cleanliness). The vocabulary thread surfaced when the phase-2 tab's Forth sat side-by-side with standard Forth idioms in teaching material. Both threads shipped fixes, some explicit deferrals, and one feature-flagged fast-path that stays off until the kernel-side work finishes.

### Making It Fast, Part 1: Hashing `FIND` — Three Attempts

The obvious suspect for slow bootstrap was `FIND`: a linear O(N) walk of the `LATEST` link chain, called for every token in every `.fth` line. At **90 dictionary entries** (50 asm + 40 Forth colon defs), the constant factor should add up. That hypothesis drove three successive attempts, documented in detail in [`docs/hashing-analysis.md`](https://github.com/sw-embed/sw-cor24-forth/blob/main/docs/hashing-analysis.md).

A glance at the first-letter distribution explains why the first attempt was in trouble:

| First char | Words (count) |
|---|---|
| `S` | SWAP STATE SW? SP@ SEE-CFA SEE SPACE (7) |
| `E` | EMIT EXIT EXECUTE EOL! ELSE (5) |
| `D` | DROP DUP DEPTH DUMP-ALL DECIMAL (5) |
| `C` | C@ C! C, CREATE CR (5) |
| `B` | BRANCH BASE BYE BEGIN (4) |
| `2` | 2DUP 2DROP 2SWAP 2OVER (4) |

Only ~43 distinct first-letter classes across 90 words. Any scheme that hashes on first char alone saturates long before 256 buckets.

#### Attempt 1 — First-char buckets (shipped)

A 256-bucket first-character table (tracked in [sw-cor24-forth#1](https://github.com/sw-embed/sw-cor24-forth/issues/1), commit `a3a63f0`). Populated at `_start` by walking `LATEST` newest-first, maintained by `do_create` on every new header, with linear fallback on bucket miss. Correctness held — all reg-rs tests pass, `SEE`, `DUMP-ALL`, every example produced identical UART output.

The measurement was humbling:

> **CLI speedup on fib-demo compile: ~0% within timestamp resolution.** `cor24-run` reports instruction timestamps rounded to 10K. Last UART TX for fib complete: 61.17M inst with hash vs 61.17M inst without.

Profiling showed why. `FIND` is only ~0.3% of compile time. The other 99.7% splits between `KEY`'s UART busy-wait (spinning while `cor24-run` delivers the next input byte) and the threaded-code overhead of Forth-defined IMMEDIATE words (`IF`, `BEGIN`, `UNTIL`, `\`, `(`). Shrinking `FIND` from ~250 inst to ~50 inst per lookup saves ~200K inst, which disappears into the 61M total.

Still, WASM might behave differently. And with `EMIT`/`EXIT`, `OVER`/`OR`, and similar first-letter twins all sharing buckets, the fallback was doing more work than it should have been. Time for a better hash.

#### Attempt 2 — `len-seeded mult33` (shipped, with a detour)

An [offline collision analysis](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-in-forth/scripts/hash-collision-analysis.py) ran nine hash functions against all 90 known dictionary words, at bucket sizes 64/128/256/512. Full data lives in [`docs/hashing-analysis.md`](https://github.com/sw-embed/sw-cor24-forth/blob/main/docs/hashing-analysis.md); the summary:

| Hash function | 64 | 128 | 256 | 512 |
|---|---:|---:|---:|---:|
| `first_char` | 47 | 47 | 47 | 47 |
| `len + first + last` | 47 | 34 | 34 | 34 |
| `len*31 + first + last` | 42 | 28 | 17 | — |
| `djb2` | 44 | 29 | 17 | — |
| `mult33` (no seed) | 44 | 31 | 21 | — |
| `fnv1a` | 44 | 28 | 17 | — |
| **`len-seeded mult33`** | **34** | **25** | **11** | 9 |
| **`2-Round XMX`** | — | 23 | **15** | **8** |

Len-seeded mult33 (`h = length; for c in name: h = h*33 + c`) won at 256 buckets with 11 collisions — a 35% improvement over the closest classical competitor. The length seed perturbs the initial state so short words spread out early in the iteration.

The rollout itself was instructive. Commit `485f36f` landed mult33 without the full example-suite check and broke the web agent. Commit `ab9817f` reverted. Commit `9bd4b10` re-landed it properly — all 15 examples byte-identical to the first-char version on CLI, then tested on WASM. WASM verdict: **works, but wall-clock still not fast enough**. A better hash doesn't rescue a cold-boot that spends the majority of its time not in `FIND` at all.

That measurement effectively closed out hashing as a standalone fix. If bootstrap speed mattered on WASM — and it did, because the "forth-in-forth" tab felt visibly slower than the `forth.s` tab — something more fundamental than a hash swap was needed. The "Build-Time Bootstrap Dump" section below describes that answer.

Attempt 3 is still worth running, though, for reasons specific to this ISA.

#### Attempt 3 — 2-Round 24-bit XMX (shipped)

The updated [`docs/hashing.txt`](https://github.com/sw-embed/sw-cor24-forth/blob/main/docs/hashing.txt) design notes — a Gemini-assisted survey of 2025–2026 hashing research — surface three recent developments that change the tradeoffs:

- **Krapivin's optimal open addressing (2025).** Probe sequence keeps lookups near-constant-time even at 99% table occupancy. Probe 2 becomes `(index + (hash >> 12) + 1) & mask` instead of `+1` — a tiny asm change that avoids the clustering cliff classical linear probing hits when tables fill.
- **Learned / data-aware hashing.** For a static Forth core with a known vocabulary at build time, a [perfect-hash-function generator](https://en.wikipedia.org/wiki/Perfect_hash_function) can emit a hash with **zero collisions** on the core dictionary, lookup collapsing to a single multiply-shift.
- **SSHash cache-locality hashing (2024–2026).** Order-preserving hashing for short strings (Forth word names are shaped like bioinformatics k-mers). Keeps related words physically close in RAM so the CPU prefetcher stays effective.

For COR24's constraints — 24-bit words, ~8 GPRs, sometimes no hardware multiplier — the pick was **2-Round 24-bit XMX** (Xor, Multiply, Xor), which shipped in commit `fdae7dd`:

```
\ R0 = running hash (24 bits, native word size)
\ R1 = next character (or temp during avalanche)
\ R2 = MAGIC = 0xDEADB5, loaded once
\ Per character:
XOR              \ R0 ^= R1            (mix char into hash)
24_BIT_MUL       \ R0 *= R2            (native 24-bit truncation)
DUP 12 RSHIFT    \ R1 = R0 >> 12
XOR              \ R0 ^= R1            (spread high bits into low bits)
```

Two registers, no overflow waste (every bit of the 24-bit GPR carries signal), and the `h ^ (h >> 12)` avalanche step is the most bit-distributing operation tested. In the collision analysis XMX tied mult33's worst-bucket depth at 256 (3) and beat it at 512 (2 vs 3). Per-character cost: ~10 COR24 ops vs ~4 for mult33 (roughly 2.5× slower per char), but for typical 4-character word names that's ~24K extra instructions across a full bootstrap — noise against 61M.

All 15 example files and `scripts/see-demo.sh` produce byte-identical UART output vs the `first_char` baseline. Verified correctness, shipped, moved on.

### Making It Fast, Part 2: A 1-Entry Lookaside Cache

A better hash function still does `compute_hash → bucket probe → name compare` for every token. Most colon-def bodies repeat words back-to-back (`DUP DUP`, `DROP DROP`, a word used twice in the same definition). Why recompute?

Commit `4ea2f79` added a **1-entry lookaside cache** (classic memento pattern). After every successful `FIND`, the kernel stashes a single triple — `(full 24-bit XMX hash, CFA, flag)` — in fixed memory. The next `FIND` that produces the same full hash skips the bucket probe and the name compare entirely, pushes the cached `(cfa, flag)`, and returns.

| Property | Choice | Why |
|----------|--------|-----|
| Cache size | 1 entry | Simplest possible memento; covers the "same word twice" pattern which is the common case. |
| Cache key | Full 24-bit XMX hash (not just the 8-bit bucket index) | 24-bit keyspace is effectively collision-free across a 90-word dict. False positives (returning the wrong CFA on a spurious hit) are astronomically unlikely. |
| Cache update | In `find_push_flag` just before the `NEXT` jump | Reads flag + CFA off the data stack via `mov fp, sp; lw rX, off(fp)` without disturbing DS. Three `sw`s to store flag/cfa/hash. |
| Cache NOT-FOUND? | No | Would cause incorrect stale hits when the user later defines the previously-failed word. Only successful lookups are cached. |
| Invalidation | Implicit — cfa=0 slot treated as empty; overwritten on next successful FIND | Simple and correct; a user-defined `FORGET` that removes the cached word would need to clear the slot, but that isn't currently implemented. |

Binary size went from 3893 → 3981 bytes (+88 bytes of asm). All 15 example files and `scripts/see-demo.sh` remained byte-identical.

CLI measurement once again showed no improvement — `cor24-run` timestamps quantize to 10,000 cycles, and the per-FIND savings (~30–50 inst per cache hit, ~15–25K across ~1000 lookups) are below that resolution. But this is a **measurement-infrastructure limitation**, not evidence the cache does nothing: WASM wall-clock has millisecond resolution over a multi-second bootstrap, and that's where the cumulative savings of hash + lookaside become visible.

#### Implementation history

| Commit | Hash | Notes |
|---|---|---|
| `a3a63f0` | `first_char` | First hash landed. 47 collisions. Poor distribution but correct. |
| `485f36f` | `len-seeded mult33` | First try at a better hash. Pushed without full test suite; web agent reported broken. |
| `ab9817f` | *(revert)* | Reverted to `first_char` after bug report. |
| `9bd4b10` | `len-seeded mult33` | Re-landed after all 15 examples went byte-identical. WASM-tested: works, still not fast enough. |
| `fdae7dd` | **2-Round XMX** | Per `hashing.txt` recommendation for 24-bit GPR ISAs. Shipped. |
| `4ea2f79` | **XMX + 1-entry lookaside** | Memento-pattern cache on top of XMX; +88 bytes. Shipped. |

### Making It Fast, Part 3: The Web Tab Goes Snappy

With the kernel-side hash + lookaside work landing, the web side had its own journey. The web agent tried two approaches in parallel — one shipped disabled, the other turned out to be the real winner.

#### The adaptive pump-loop (shipped, the actual fix)

[`web-sw-cor24-forth/src/repl.rs`](https://github.com/sw-embed/web-sw-cor24-forth/blob/main/src/repl.rs) runs the emulator in batches between UART byte feeds. The old scheme was a fixed **20k instructions per byte** — but for cheap-byte cases (where a single input byte triggers maybe 500 instructions of compile work before the next `KEY` poll), that meant burning ~19,500 cycles spinning in `key_poll` waiting for the next byte that the scheduler hadn't delivered yet.

Commit `f757800` reworked the pump to inspect the CPU's PC each iteration and adapt:

| Knob | Old | New | Why |
|------|-----|-----|-----|
| Sub-batch size | Fixed 20k inst | `PUMP_TINY = 2k` when PC is at a `key_poll` with bytes to feed; `PUMP_BIG = 50k` elsewhere | Stop wasting cycles spinning in `key_poll` on cheap bytes; let real compile work run longer when it has actual work to do |
| Tick batch | `BOOTSTRAP_BATCH = 500k` | `BOOTSTRAP_BATCH = 600k` per tick | Small bump; more work per scheduler wake |
| Tick interval | `TICK_MS = 25` everywhere | `TICK_MS_BOOT = 5` during bootstrap; `TICK_MS_INTERACTIVE = 25` once ready | Cut scheduler overhead during the one phase where it matters |

*"Biggest single win."* Combined with the kernel-side XMX + lookaside work, this dropped the phase-2 tab's cold-bootstrap from ~10 seconds to **subjectively instant**.

#### The build-time snapshot (infrastructure shipped, gated off)

The snapshot idea — run the cold bootstrap natively at build time, embed a 64 KB memory + registers blob via `include_bytes!`, restore on load — is actually *implemented*: `build.rs` does the native bootstrap and writes `fif_snapshot.bin`, `src/snapshot.rs` parses and restores it, a `localStorage` cache keys on a content hash of `kernel.s` + `core/*.fth` so edits auto-invalidate.

But it's shipped with a runtime feature flag, `SNAPSHOT_CACHE_ENABLED = false`. The reason is honest: with the pump-loop fix alone making the tab feel instant, **turning on the snapshot would contaminate kernel-side perf measurements**. Any future change to the hash, lookaside, or threading-layer primitives needs to be benchmarked against the slow-path boot, not the pre-warmed one. The flag flips on once the kernel-side optimization work is fully wrapped.

This also means the originally-planned CLI **pre-load-and-dump-to-binary** is now formally **deferred**. The rationale, recorded in [`docs/plan.md`](https://github.com/sw-embed/sw-cor24-forth/blob/main/docs/plan.md): it's the biggest expected WASM win, but the same deliverable — a kernel that *starts* in the ready state, without replaying bootstrap — is exactly what phase 4 (`forth-from-forth/`) produces as its build artifact. Two paths to the same destination; doing both is wasteful. Revisit if the hash + lookaside + pump-loop stack proves insufficient once the snapshot flag is flipped on.

#### The speedups that shipped, stacked

| Speedup | Mechanism | Where it helps | Status |
|---------|-----------|----------------|--------|
| First-char hashed FIND | 256-bucket table + `_start` populate | Any host, marginal on CLI | **Shipped** (`a3a63f0`); CLI 0% gain |
| Len-seeded mult33 hash | Drop-in `compute_hash` subroutine | Any host, marginal on CLI | **Shipped** (`9bd4b10` after revert `ab9817f`); WASM still slow |
| 2-Round 24-bit XMX hash | ~10 ops/char XMX avalanche | WASM (cheaper bit ops) and denser dictionaries | **Shipped** (`fdae7dd`) |
| 1-entry FIND lookaside cache | Memento keyed by full 24-bit hash | Same-word-twice patterns in compile | **Shipped** (`4ea2f79`); +88 bytes |
| Adaptive web pump-loop | PC-aware `PUMP_TINY` / `PUMP_BIG` batches; shorter boot tick | Web bootstrap; "biggest single win" | **Shipped** (`f757800`) |
| Build-time snapshot + `localStorage` cache | `build.rs` + `snapshot.rs` in web crate | Web, skipping cold boot entirely | **Shipped, gated** (`SNAPSHOT_CACHE_ENABLED=false`) |
| CLI pre-load-and-dump-to-binary | Native bootstrap → `.bin` → `cor24-run --load-state` | CLI scripts, CI | **Deferred** — phase 4 produces the same artifact |

Net effect: the [live phase-2 tab](https://sw-embed.github.io/web-sw-cor24-forth/) boots as fast as the phase-1 tab now, even though it's still doing the full "language builds itself" cold bootstrap — the snapshot fast-path isn't even on.

#### A measurement footnote

CLI perf numbers look identical across all hash variants. `cor24-run` reports instruction timestamps quantized to 10,000 cycles; the per-FIND savings of XMX (~200 inst × 1000 lookups) and the lookaside (~30–50 inst × dozens of hits) both land below that resolution. The four-commit CLI iteration — `a3a63f0` → `9bd4b10` → `fdae7dd` → `4ea2f79` — all reports **61.17M instructions** for fib-demo compile. That's not the optimizations doing nothing; it's the measurement infrastructure not having the resolution to show it. WASM wall-clock at millisecond granularity over a multi-second boot is the authoritative metric, and there the stacked speedups are very visible.

### The Vocabulary Feels Thin — and Fills In

`FIB` and the existing examples already worked on `forth-in-forth` before any of this — nothing was missing for *correctness*. What the web tab made obvious, once the phase-2 REPL sat next to standard Forth idioms in teaching material, was how much more *ergonomic* the same demos would read with a fuller vocabulary.

The `FIB` print loop used to look like:

```forth
: FIB ... ;
: FIBS 0 BEGIN DUP FIB . 1 + DUP 21 = UNTIL DROP ;
FIBS
```

Every hand-rolled `BEGIN`/`UNTIL` counter is a small tax. In a fuller Forth the same thing reads as:

```forth
: FIB ... ;
21 0 ?DO I FIB . LOOP
```

Not shorter by much — but no setup, no sentinel variable, no `DROP` at the end. Several files in `forth-in-forth/examples/` collapsed to one-liners once the vocabulary filled in.

The additions shipped into both the phase-2 and phase-3 kernels (scoped there — the phase 1 `forth.s` kernel stays as-is for its existing users):

| Group | Shipped | Landed in | How |
|-------|---------|-----------|-----|
| **Extra BEGIN-style flow** | `AGAIN`, `WHILE`, `REPEAT` | `3b4f541` | Pure Forth in `core/minimal.fth`, built on `0BRANCH`/`BRANCH`. No new primitives. |
| **Defining words** | `CONSTANT`, `VARIABLE` | `3b4f541` | Pure Forth in `core/lowlevel.fth`, layered on `CREATE` + `,DOCOL` + `LIT`. `DOES>` parked for later. |
| **Counted loops** | `DO`, `LOOP`, `?DO`, `I`, `UNLOOP` | `92cef7f` | New RS primitives `(DO)`, `(LOOP)`, `(?DO)`, `I`, `UNLOOP` in kernel; IMMEDIATE Forth wrappers in `core/lowlevel.fth`. Matching Forth examples `15-again.fth` through `19-do-loop.fth`. |

RS layout inside a `DO` loop body:

```
top    [ index ]
       [ limit ]
deeper [ caller IP ]
```

Standard Forth convention — `UNLOOP` must precede an `EXIT` from inside a loop to restore the caller's IP. The `(LOOP)` and `(?DO)` primitives stash the IP in the frame-pointer register during the compare, because this ISA's `ceq` rejects `fp` as an operand and `sw` rejects `fp` as a source; that frees `r2` as a scratch register for the limit/index work.

A handful of additional conveniences (`+LOOP`, `J`, `LEAVE`, `DOES>`, `RECURSE`, `PICK`, `ROLL`, `?DUP`, `MIN`/`MAX`, `<=`/`>=`/`<>`) are left for follow-up work. What's shipped is enough for the demos the browser tab shows side-by-side with the phase-1 kernel.

Live demos in the web UI (`AGAIN`, `CONSTANT`, `DO LOOP`, `VARIABLE`) are already wired into both the phase-2 and phase-3 tabs, sharing one demo constant via the refactored component in `src/repl.rs`.

The general lesson: a language that only *feels* thin once it's compared against a fuller one benefits from that comparison. Good that it surfaced before phase 3 cemented the primitive set.

## Phase 3: forth-on-forthish — First Subsets Shipping

`./forth-on-forthish/` scaffolded with a copy of phase 2's kernel and core — the *current* phase-2 kernel with XMX hash + 1-entry lookaside carried forward (commit `4f5e8ab`), verified byte-identical to baseline on all 15 examples. Phase 3 work starts on the optimized substrate, not the pre-hash version. Then the first two subsets landed on top of it:

- **Subset 12** (`79f4350`): the `,DOCOL` primitive. Wraps the existing `do_colon_cfa` as a named dict entry, exposing the 6-byte far-CFA template emission so a Forth `:` can build headers without touching asm. First attempt at Forth `:` / `;` in a new `core/runtime.fth` also landed and was reverted — hit the classic SMUDGE-bit problem where `;` at the end of `: ; ... ; IMMEDIATE` resolves to the in-progress new `;` because `FIND` has no way to skip "being-compiled" entries. Documented three options to unblock (asm tweak to `:`/`;` that sets/clears `HIDDEN`, dedicated `HIDE-LATEST`/`UNHIDE-LATEST` primitives, or modify `CREATE` to always hide).
- **Subset 13** (`a98b4b8`): Forth `:` and `;` shipping. Went with the "asm sets/clears HIDDEN inline" option — `colon_thread` now runs `do_hide_latest` between `do_colon_cfa` and `do_rbrac` (sets bit 6 on the new entry so `FIND` skips it during the rest of the definition). `do_semi` clears `HIDDEN` on `LATEST` before compiling `EXIT` and zeroing `STATE`. A new `core/runtime.fth` tier, loaded *first* (before `minimal.fth`), defines:

```forth
: : CREATE ,DOCOL LATEST @ 3 + DUP C@ 64 OR SWAP C! ] ;
: ; ['] EXIT , LATEST @ 3 + DUP C@ 191 AND SWAP C! 0 STATE ! ; IMMEDIATE
```

No `\` comments in `runtime.fth` — `\` is defined in `minimal.fth` which loads after. An initial draft that included comments parsed them as code.

All 15 examples/*.fth produce the same functional behavior as the first-char hash baseline; the only new UART output is two extra `" ok"` lines for the two new `runtime.fth` definitions. The phase-3 kernel now has Forth `:` and Forth `;` — every new colon definition from here on uses the Forth implementations.

The remaining subsets push further into the primitive set:

Specific moves enabled by the new substrate:

| Word(s) | Strategy | New primitive needed | Status |
|---------|----------|----------------------|--------|
| `:` and `;` | `: : CREATE ,DOCOL ... ] ;` plus a tricky `;` that compiles `EXIT` and toggles `STATE`; both flip `HIDDEN` inline on `LATEST` | `,DOCOL` + `HIDDEN`-bit handling in `colon_thread` / `do_semi` | **Shipped** (subsets 12, 13) |
| `WORD` | Forth loop over `KEY` into a known word buffer | `WORD-BUFFER` (or a fixed address) | Planned |
| `FIND` | Walk `LATEST @` with `@`, `C@`, `=`, `AND` | None — uses existing primitives | Planned |
| `NUMBER` | Digit-parsing on top of `*`, `+`, `<`, `BASE @` | None | Planned |
| `INTERPRET` / `QUIT` | `BEGIN ... UNTIL` loops over `WORD` / `FIND` / `EXECUTE` / `NUMBER` | None | Planned |
| `*`, `/MOD`, `-` | `+`-loops or `NEGATE +` | None — can drop the asm versions | Planned |
| `AND` / `OR` / `XOR` | Derivations from a single bit-primitive | `NAND` (replaces 3 primitives with 1) | Planned |
| `DUP` / `SWAP` / `OVER` / `>R` / `R>` | `SP@`-based memory operations on the data stack | `SP!`, `RP@`, `RP!` (already have `SP@`) | Planned |

After the refactor the irreducible asm primitives are approximately:

```
NEXT  DOCOL  EXIT  LIT  BRANCH  0BRANCH  EXECUTE
+  NAND  @  !  C@  C!  KEY  EMIT  SP@  RP@  SP!  RP!
LED!  SW?  HALT
```

About **20 primitives**, **~600–800 asm lines** (vs. ~2240 today). Projected progression:

| Approach | asm lines | Forth lines | asm primitives | Self-hosting |
|---|---:|---:|---:|---|
| 1: all-asm | ~2983 | 0 | ~65 | 100% asm |
| 2: today | 2239 | 161 | 50 | 93% asm |
| 3: forth-on-forthish | ~700 | ~600 | ~22 | 54% asm |
| 4: forth-from-forth | 0 hand-written | ~1000 Forth | ~22 emitted | 0% hand-written asm |

### The Phased Plan

Phase 3 breaks into subsets the same way phase 2 did:

| Subset | Size | Scope | Status |
|--------|------|-------|--------|
| **12** | small | Add `,DOCOL` primitive | **Shipped** (`79f4350`) |
| **13** | medium | Forth `:` and `;` via `core/runtime.fth` + inline `HIDDEN`-bit management | **Shipped** (`a98b4b8`) |
| **14** | medium | Add `SP!`/`RP@`/`RP!`; move `DUP`/`SWAP`/`OVER`/`>R`/`R>` to Forth | Next |
| **15** | medium | Move `*`/`/MOD`/`-` to Forth as loops; `AND`/`OR`/`XOR` from a new `NAND` primitive | Planned |
| **16** | large | Move `WORD`/`FIND`/`NUMBER`/`INTERPRET`/`QUIT` to Forth — after this, kernel matches approach 3 (~700 asm lines) | Planned |

Subset 16 is the scary one. The outer interpreter written in Forth is *slow* — every text token goes through Forth-coded dictionary walking instead of asm. Estimates: ~10× slower text-input path, but compiled colon definitions run at nearly the same speed.

### Known Tradeoffs

Phase 3 isn't free. The comparison from phase 2 to phase 3:

| | Phase 2 (today) | Phase 3 (target) |
|---|---|---|
| Asm lines to maintain | 2239 | ~700 |
| Asm primitive count | 50 | ~22 |
| `WORD`/`FIND` speed | asm (fast) | Forth (~10× slower) |
| `:` and `;` speed | asm | Forth (slightly slower compile) |
| Bootstrap complexity | Low | Higher — careful `.fth` load ordering required |
| Retargeting effort | Rewrite ~2240 lines of asm | Rewrite ~700 lines of primitives + rebuild |

The payoff is dramatic: the kernel becomes easy to retarget to a different ISA, the *language* story becomes much cleaner (Forth doing Forth's job), and phase 4 becomes tractable because the primitive set is already small and orthogonal.

## Phase 4: forth-from-forth — On the Horizon

**[UPDATE:** follow-on discussion in [Rabbit-hole #2: FORTH --- FIND and the Cost of a Name](/2026/04/23/rabbit-hole-deep-dive-forth-find-cost-of-a-name/)**]**

`./forth-from-forth/`. Write a Forth-to-COR24-asm compiler *in Forth*. Run it on a host Forth (either a separate Forth, or phase 3's kernel) to emit `kernel.s`. After bootstrap, no hand-written `.s` exists; `kernel.s` is a build artifact.

The cross-compiler has three pieces:

- **Instruction encoder**: each COR24 opcode → bytes.
- **Primitive registry**: each Forth primitive defined as a small Forth word that emits the asm body. E.g. `: prim-+ asm-pop-r2 asm-pop-r0 asm-add-r0-r2 asm-push-r0 asm-next ;`.
- **Linker**: lays out the dict chain and writes the final `.s`.

This is the standard pattern behind [eForth](https://en.wikipedia.org/wiki/EForth), [JonesForth](http://git.annexia.org/?p=jonesforth.git), and several ITSY-style projects. Roughly 500–1000 lines of cross-compiler Forth plus a runtime specification.

At that point the kernel's `.s` becomes a build artifact, not source. Retargeting to a different ISA means swapping the instruction encoder module. The self-hosting story goes from *"Forth is written in asm, except for the words that aren't"* to *"Forth is written in Forth, including the compiler that produces the kernel."*

Estimated work from phase 3 to phase 4: ~2–3 weeks. Risk: medium — instruction-encoding bugs are silent.

## Why Ship the Phases As Separate Directories?

Each phase is a snapshot. `./` is the canonical reference (stays untouched). `./forth-in-forth/` is today. `./forth-on-forthish/` is where work happens next. `./forth-from-forth/` is future. Keeping them as sibling directories means:

- Regression tests for the original kernel keep passing against `./`.
- The web frontend can keep pointing at `./` while the next phase stabilizes.
- Each phase documents its own subset ordering and status (e.g., [`forth-in-forth/docs/status.md`](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-in-forth/docs/status.md)).
- The comparison tables from phase to phase stay honest — you can diff the asm line counts, binary sizes, and primitive tables directly.

It also matches the [language-building pattern](https://github.com/sw-embed/web-sw-cor24-demos/blob/main/docs/language-building-tech.md) used across other COR24 languages: build a reference, keep it, and iterate new variants beside it.

## Vibe Coding the Migration

Every subset in phase 2 was a short conversation: *"Here's the current kernel; move `=` and `0=` to Forth, deriving them from `XOR`. Add a `minimal.fth` line and a test."* An AI agent proposed the edits, I reviewed and ran the regression harness, and the subset shipped as one commit. Eleven subsets in a day. That pace is only possible because each move is small, each test is fast, and the kernel stays buildable at every step.

The reward for that discipline is visible in the commits: every subset is a single logical change, every status.md update is a diff, and `SEE FIB` on the REPL reads back the Forth definition the AI agent wrote an hour earlier. Forth's self-extending nature and vibe coding's tight loop fit each other well — the language is already expected to grow incrementally, and the agent's output is exactly one `.fth` addition at a time.

## What to Watch Next

- `forth-on-forthish/` subset 14 — stack-pointer primitives (`SP!`, `RP@`, `RP!`) and moving `DUP`/`SWAP`/`OVER`/`>R`/`R>` into Forth on top of `SP@`.
- The first *visible* win in phase 3: `kernel.s` drops below 2000 lines. Likely around subset 15.
- Subset 16 — the big one. `WORD`/`FIND`/`NUMBER` in Forth; asm line count drops by hundreds.
- Eventually, `./forth-from-forth/` gets scaffolded, and the question becomes which Forth hosts the first cross-compile run.

## Hashing References {#hashing-references}

In-repo docs for the attempt sequence: [`docs/hashing-analysis.md`](https://github.com/sw-embed/sw-cor24-forth/blob/main/docs/hashing-analysis.md) (measurement-driven comparison of 9 hash functions) and [`docs/hashing.txt`](https://github.com/sw-embed/sw-cor24-forth/blob/main/docs/hashing.txt) (Gemini-assisted survey of classical through 2025–2026 techniques).

Key external references:

| Topic | Link | Why it matters here |
|-------|------|---------------------|
| **Krapivin optimal open addressing (2025)** | [Quanta Magazine](https://www.quantamagazine.org/undergraduate-upends-a-40-year-old-data-science-conjecture-20250210/) · [arXiv:2501.02305](https://arxiv.org/abs/2501.02305) | New probe sequence keeps hash tables near-constant-time to 99% fill. Directly informs the secondary-probe formula in the attempt-3 design. |
| **Perfect hash functions** | [Wikipedia](https://en.wikipedia.org/wiki/Perfect_hash_function) · [CMPH library](https://cmph.sourceforge.net/) · [GNU gperf](https://www.gnu.org/software/gperf/) | Build-time generator for zero-collision lookup over the static kernel vocabulary (~90 words). |
| **Learned index structures (2018)** | [Kraska et al., "The Case for Learned Index Structures"](https://arxiv.org/abs/1712.01208) | Foundational paper on replacing static hash functions with data-aware models. Inspires the "one hash for the known set, another for user defs" split. |
| **SSHash (order-preserving short-string hashing)** | [jermp/sshash](https://github.com/jermp/sshash) | Cache-local hashing for short strings — Forth word names are the same shape as bioinformatics k-mers. |
| **xxHash / XXH3** | [xxhash.com](https://xxhash.com/) · [Cyan4973/xxHash](https://github.com/Cyan4973/xxHash) | Current speed gold standard for non-cryptographic hashing. Benchmark baseline even when we can't use it directly (too many registers for a 24-bit GPR-limited ISA). |
| **FNV-1a** | [Fowler/Noll/Vo hash — Wikipedia](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function) | Classic short-string hash; one of the attempt-2 candidates, tied for second at 17 collisions. |
| **djb2 hash** | [Dan Bernstein cdb docs](http://cr.yp.to/cdb/cdb.txt) · [hash discussion](http://www.cse.yorku.ca/~oz/hash.html) | Another attempt-2 candidate; `h = h*33 ^ c`. Inspired the `len-seeded mult33` winner. |
| **PJW / ELF hash** | [PJW hash — Wikipedia](https://en.wikipedia.org/wiki/PJW_hash_function) | Historical precedent for shift-based rolling hashes used in compilers and linkers. |
| **JonesForth** | [git.annexia.org/jonesforth](http://git.annexia.org/?p=jonesforth.git) | Reference Forth implementation covering dictionary layout tradeoffs. |

## Resources

| Project | GitHub | Live Demo |
|---------|--------|-----------|
| **Forth Interpreter (CLI)** | [sw-embed/sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth) | — |
| **Web Demo** (browser UI for the interpreter above) | [sw-embed/web-sw-cor24-forth](https://github.com/sw-embed/web-sw-cor24-forth) | [COR24 Forth](https://sw-embed.github.io/web-sw-cor24-forth/) |
| **Issue: hashed dictionary** | [#1](https://github.com/sw-embed/sw-cor24-forth/issues/1) | — |
| **Issue: DO/LOOP etc.** | [#2](https://github.com/sw-embed/sw-cor24-forth/issues/2) | — |
| **Approach Comparison Doc** | [docs/future.md](https://github.com/sw-embed/sw-cor24-forth/blob/main/docs/future.md) | — |
| **Phase 2 Status** | [forth-in-forth/docs/status.md](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-in-forth/docs/status.md) | — |
| **COR24 Assembler** | [sw-embed/sw-cor24-assembler](https://github.com/sw-embed/sw-cor24-assembler) | — |
| **COR24 Demo Hub** | [sw-embed/web-sw-cor24-demos](https://github.com/sw-embed/web-sw-cor24-demos) | [Demo Hub](https://sw-embed.github.io/web-sw-cor24-demos/#/) |

---

*Forth sketches itself the way Escher's hands do — each version a clean line drawing, each one pointing at the next.*
