---
layout: post
title: "Rabbit-hole #4: FORTH --- Dictionary Compaction and Specialized Images"
date: 2026-04-25 00:15:00 -0700
categories: [rabbit-hole, programming-languages, forth, deep-dive]
tags: [rabbit-hole, forth, cor24, dictionary, compaction, image-building, runtime-image, dev-image, composer, self-hosting, profile-driven-optimization]
keywords: "Forth, dictionary compaction, runtime image, dev image, Forth composer, shadowed words, bootstrap words, pointer rewriting, xt fixup, PROFILE-ON, SAVE-IMAGE, whole-app specialization, forth-from-forth, COR24, sw-cor24-forth, three optimization layers"
author: Software Wrighter
abstract: "After optimizing FIND (rabbit-hole 2 and 3), the next move is to eliminate FIND entirely for deployment. This post walks the jump from dev image to runtime image: pruning shadowed redefinitions, dropping the compiler/REPL/instrumentation for production builds, and the pointer-rewriting work that actually makes compaction safe. Frames the whole thing as a Forth composer — one small core plus pluggable feature modules plus target profiles."
series: "Down the Rabbit-Hole"
series_part: 4
repo_url: "https://github.com/sw-embed/sw-cor24-forth"
demo_url: "https://sw-embed.github.io/web-sw-cor24-forth/"
---

<img src="{{ '/assets/images/posts/block-rabbit-tree-sword-right.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 220px;">

<div style="overflow: hidden;" markdown="1">

Third FORTH post in the rabbit hole. [Part 2](/2026/04/23/rabbit-hole-deep-dive-forth-find-cost-of-a-name/) dropped the XMX hash. [Part 3](/2026/04/24/rabbit-hole-forth-life-after-hashing/) replaced it with a numeric fast path, a recent-hit cache, and a hot-token cache — tuning FIND in the places where FIND still runs. This post asks a different question: *can we make FIND not run at all?*

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Play in Browser** | [COR24 Forth Demo](https://sw-embed.github.io/web-sw-cor24-forth/) |
| **Kernel Repo** | [sw-embed/sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth) |
| **Prior post** | [Rabbit-hole #3: FORTH --- Life After Hashing](/2026/04/24/rabbit-hole-forth-life-after-hashing/) |
| **Overview post** | [Embedded #3: Self-Hosting Spectrum](/2026/04/20/embedded-forth-self-hosting-spectrum/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Two Different Forths, Same Source

A working Forth environment does a lot of things at once:

- Reads source text, tokenizes, looks up names → interpret/compile
- Holds a live dictionary, walked by `FIND`, grown by `CREATE`
- Exposes a REPL for interactive use
- Runs user-level compiled code (the actual *work*)
- Sometimes: profiles, instruments, debugs

In a development Forth, all of this matters. You're compiling new words, reloading `.fth` files, poking at things via `.S` and `WORDS`. The dictionary *must* be searchable by name, CREATE *must* work, the REPL *must* respond.

In a deployed Forth --- the kind you'd flash onto an FPGA or ship in a firmware image --- most of that is overhead. The deployed program already exists as compiled bytecode. It doesn't need FIND. It doesn't need CREATE. It doesn't need the REPL. It doesn't even need the names of the words it calls, because the calls are already resolved.

**Dictionary compaction** is the name for the gap between those two Forths. Specialized-image building is how you cross it.

## Three Optimization Layers

Posts 2 and 3 sat entirely in layer 1. This post introduces layers 2 and 3.

| Layer | Target | Examples |
|-------|--------|----------|
| **1. Dev-time lookup** | Make FIND fast in the dev image | Numeric fast path · recent-hit cache · hot-token cache (Part 3) |
| **2. Dictionary compaction** | Shrink what gets shipped | Drop shadowed words · strip instrumentation · remove dead code |
| **3. Whole-app specialization** | Eliminate the interpreter for production | Drop FIND · drop CREATE · drop REPL · ship only compiled CFAs |

Each layer is **opt-in**. Each is a different build artifact produced from the same source tree. A composer sits at the top and chooses which layers to apply for a given target profile.

## A Forth Composer

The mental shift, once you've done this a few times:

> *You're not building "a Forth." You're building a Forth system generator that can assemble different Forth flavors for different use cases.*

Named profiles for common builds:

| Profile | Lookup subsystem | Instrumentation | Image | Good for |
|---------|------------------|-----------------|-------|----------|
| **`simple`** | Linear walk only | Off | Full dev dict | Teaching, debugging |
| **`instrumented`** | Linear + recent cache + counters | On | Full dev dict | Profiling real workloads |
| **`optimizing`** | Linear + both caches | On, driving reorder | Compacted dev dict | Interactive, fast boot |
| **`runtime`** | None (no FIND) | Off | Compiled CFAs only | Deployed app |
| **`debug-runtime`** | None | Minimal (`assert`, `trace`) | Compiled CFAs + symbols | Crash-reproducible deploy |

The core is the same in every profile: stacks, threading, primitives, inner loop. Everything above that is a composition of optional modules and policies. The composer's job is to know which modules are required, which conflict, and how to wire them together for the requested profile.

This is cleaner than "one Forth tries to be everything." It matches the spirit of the [self-hosting spectrum](/2026/04/20/embedded-forth-self-hosting-spectrum/) post's phased migration: different axes are orthogonal, so treat them that way.

## What Compaction Actually Removes

For profile **`runtime`** (the most aggressive), the compactor walks the live dictionary and drops:

**Shadowed redefinitions.** Forth lets you redefine a word. The old definition stays in the dictionary, unreachable by name (FIND walks newest-to-oldest, hits the new one first) but still taking space. In a runtime image, shadowed entries are pure dead weight. Drop them.

**Bootstrap-only words.** Words that exist *only* to load the source. Things like `,DOCOL`, `CONSTANT`, `VARIABLE`, `CREATE`, `:`, `;`, `IMMEDIATE`. If the runtime image doesn't compile new words at runtime, none of these are needed --- they were scaffolding used during loading.

**Interpreter loop.** `INTERPRET`, `QUIT`, `WORD`, `FIND`, `NUMBER`. A runtime image that runs one entry point (`MAIN` or whatever) doesn't read text, doesn't tokenize, doesn't look things up. The whole outer loop is gone.

**Instrumentation.** Any counters, profiling hooks, trace points. These were for building the optimized image; they don't go into the deliverable.

**Developer-only helpers.** `.S`, `DUMP`, `WORDS`, `SEE`, `DEPTH`, diagnostic decorations. Useful at the REPL; useless in deployment.

**Name strings.** The aggressive move: drop the name field on every dictionary entry. Runtime callers reach words by CFA, not by name, so the strings are only readable by a human via `SEE` and `WORDS` --- both dropped in the previous step. 40-char headers become 4-char (flags byte + link + CFA).

What's *left* after all that: the data stack, the return stack, a handful of primitives still needed by compiled code (`+`, `@`, `!`, `DUP`, etc.), the inner loop (`NEXT`), and the compiled CFAs of words the application actually calls. On COR24, that's the difference between a ~3KB dev image and a ~600-byte runtime image.

<style>
  /* Stagger sections occupy cols 1-3 / 2-4 / 3-5 of a 5-col grid (60% width).
     Gutter images fill the remaining 2 cols (40%) next to the stagger paragraph. */
  .post-content .stagger { position: relative; }
  .gutter-img-left,
  .gutter-img-right {
    position: absolute;
    top: 0;
    /* 66.67% of a 60%-wide section = 40% of the container = 2 of 5 cols */
    width: 66.67%;
    max-width: none;
    /* Cap height to section so image can't overflow into the next section;
       contain preserves aspect ratio (no crop). */
    height: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
  }
  .gutter-img-left  { right: calc(100% + 1.25rem); }
  .gutter-img-right { left:  calc(100% + 1.25rem); }
  @media (max-width: 900px) {
    .gutter-img-left,
    .gutter-img-right {
      position: static;
      display: block;
      width: 100%;
      max-width: 420px;
      margin: 0.5em auto 1em;
    }
  }
</style>

## The Real Implementation Burden: Pointers

<img src="{{ '/assets/images/posts/block-forth-in-stone-regress.webp' | relative_url }}" class="gutter-img-left no-invert" alt="">

Removing words is the easy part. Rewriting all references *to* those words is where dictionary compaction earns its reputation.

Every compiled colon definition is a sequence of CFA pointers:

```
SQUARE: DOCOL | <DUP's CFA> | <*'s CFA> | EXIT
```

If the compactor removes a shadowed `*` and the remaining `*` lives at a different address, every single compiled definition that points at the old `*` now points at a stale address. You have to find them all and rewrite them.

That requires:

1. **An authoritative record of which word each CFA originally named.** Names are dropped in the final image but must exist during compaction.
2. **A walk of every compiled body**, looking at each cell, asking "is this a CFA pointer?" and if so "which word does it refer to now?" and rewriting accordingly.
3. **Fixups for literal addresses** (from `LIT`), branch targets (from `BRANCH` / `0BRANCH`), and any word-to-word references stored in data cells.
4. **A reproducible layout algorithm** so two runs over the same source produce the same image. This matters for CI.

Under the hood, this is the same relocation problem a linker solves. The Forth composer is a linker for Forth objects. It just happens to be written in Forth.

Two techniques help:

- **Build a *new* image rather than editing the old one.** Start from a clean allocation, stream surviving words through one-by-one, fix up pointers as you go. This is much easier than trying to edit-in-place and much easier to test.
- **Do not reorder words until all compaction is done.** The pointer-rewrite pass is simpler when you know the old → new CFA mapping is stable. Reordering for cache locality, if you do it, is a separate pass over the already-compacted image.

## Profile-Driven Optimization

Compaction without data is guesswork. What goes, what stays, what gets reordered --- the composer needs a *profile* that captures real usage.

The right counters to capture during a profiling run:

| Counter | What it measures | Drives |
|---------|------------------|--------|
| `source-interpret-count` | Times word looked up at REPL | Recent cache tuning |
| `source-compile-count` | Times word looked up during source loading | Hot cache seeding |
| `runtime-execute-count` | Times compiled CFA executed | Dictionary reordering · inlining |
| `last-used-pass` | Which build step last referenced word | Shadowed / dead-code detection |

The PROFILE-ON / PROFILE-OFF mental model from the composer:

```
PROFILE-ON
( load source, run demo workload, exercise edge cases )
PROFILE-OFF
DUMP-COUNTS   \ writes the profile to an external file
BUILD-OPT-IMAGE use-profile=demo.prof target=runtime
```

Counts are written external to the dictionary so the composer can re-use them across builds and compare policies. The same profile data can drive multiple output images (a runtime target + an instrumented dev target) without recollecting measurements.

## The Overfitting Trap

Optimizing against a demo corpus is seductive, and it's wrong in the same ways micro-benchmark tuning is wrong.

If the profile comes from 25 example `.fth` files and those are the *only* workloads the deployed image will ever see: perfect, overfit freely. The deployed image is a fixed-function artifact; fitting it to its workload is the whole job.

If the deployed image will see workload `#26` that looks different: compaction that was fine against the 25 can silently drop words that `#26` needs, or reorder the dictionary in ways that make `#26` slow. The composer can't catch this unless `#26` is in the profile.

Mitigations:

- **Keep a canary `.fth`** full of standard Forth idioms that the compacted image must still run. Regression-check it on every build.
- **Have at least one "safe" profile** that retains more than you strictly need, for deployments whose workload is uncertain.
- **Be explicit about what got cut.** The compactor should emit a manifest of which words it dropped, which it kept, and why. Surprises in deployment trace back to surprises in that manifest.

The classic advice: *optimize the workload you have, guard against the workload you don't.* The composer makes both easier --- different profiles for different risk tolerances --- but it doesn't automate the judgment call.

## Where This Lands

Three layers of optimization, one composer selecting profiles. The runtime profile ships a Forth that doesn't look much like Forth: no REPL, no interpreter, no dictionary-by-name. Just compiled CFAs and a tiny inner loop. Some people call this "a runtime," not a Forth. Either framing is fine. The point is that the **same source** produces both the interactive dev Forth and the minimal runtime deliverable --- by composition, not by a separate rewrite.

The phase-4 `forth-from-forth/` work naturally wants this framing. A Forth-hosted cross-compiler already has to reason about "which words end up in the output image." Making that reasoning explicit --- *the composer decides* --- turns an implicit dependency tree into an explicit build pipeline.

## What's Next

Compaction collapses *vertically* --- strip unused words, drop unused features. The next rabbit-hole post asks about *horizontal* compaction: when the same Forth source has to target different ISAs (COR24, WASM, RV32I, S/360), how do you partition the compiler so only the backend changes? And what happens when the compiler has to reference words that don't yet exist --- the forward-reference / mutual-recursion problem that every self-hosted compiler eventually faces.

That's *Rabbit-hole #5: FORTH --- Retargetable Codegen and the Forward-Reference Problem*.

---

*One source, many artifacts. The Forth composer is just the recognition that different deployments want different Forths --- and the discipline to stop pretending otherwise.*
