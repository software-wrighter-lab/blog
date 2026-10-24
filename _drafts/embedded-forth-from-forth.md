---
layout: post
title: "Embedded #4: Forth from Forth, the COR24 Kernel With No Hand-Written Assembly"
date: 2026-10-24 00:15:00 -0700
categories: [embedded, programming-languages, deep-dive]
tags: [embedded, forth, self-hosting, cor24, cross-compiler, kernel, bootstrapping, threaded-code, forth-from-forth]
keywords: "Forth from Forth, Forth cross-compiler, self-hosting Forth kernel, COR24, sw-cor24-forth, forth-from-forth, kernel.s as a build artifact, Forth primitives, bootstrapping, threaded code"
abstract: "TODO (when the work lands): phase 4 of the COR24 Forth kernel, the last point on the self-hosting spectrum: a cross-compiler written in Forth that emits the kernel's assembly, so kernel.s becomes a build artifact. Where it stood in April, what finished it, what the numbers say, and what changed in the web demo."
series: "Embedded"
series_part: 4
repo_url: "https://github.com/sw-embed/sw-cor24-forth"
---

<!-- DRAFT PLAN (2026-10-23), Mike: a post for 10/24 on finishing forth-from-forth, phase 4 of sw-cor24-forth ("hopefully
     finished tonight/tomorrow"). The sequel to Embedded #3 (2026-04-20), whose last phase was "On the Horizon"; Rabbit-hole #2-#5
     (2026-04-23 to 04-26) followed the phase-4 design (FIND, hashing, compaction, codegen).
     Mike (2026-10-23): the work is in sw-cor24-forth and a fourth tab on web-sw-cor24-forth. Saw #8 labeled sw-vibe-coding/sw-fth-wasm
     (proto-forth-wasm, a separate Rust/WASM Forth) "Forth-from-Forth"; that was a different project, not this one.
     Source state at drafting: sw-cor24-forth local main is 14 commits AHEAD of origin (latest a1a7b07, 2026-10-23): link only
     pushed commits. forth-from-forth/docs/status.md (2026-10-23): saga phase-4-tab-4, steps 1 parser-integration-fix (done,
     the negative-literal NUMBER bug), 2 compile-runtime-from-source, 3 compile-full-core, 4 prims-and-image-boot, 5
     delete-bootstrap-and-rebaseline, 6 web-tab-4 (web-sw-cor24-forth), 7 blog-brief, 8 deck-update. kernel.s is still a copy of
     phase 3's. The saga's blog-brief step will hand over the facts; fill from it, the docs and the commits, not from this plan.
     Lead image: Mike's block-rabbit-watch.jpg (2026-10-23, ~/Downloads), monochrome; no-invert (Mike, 2026-10-23: inverted prints look poor in dark mode). -->

<img src="{{ '/assets/images/posts/block-rabbit-watch.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

[Embedded #3](/2026/04/20/embedded-forth-self-hosting-spectrum/) asked how much of a Forth kernel can be written in Forth, and laid out four phases for the COR24 kernel, from all assembly to a Forth-hosted cross-compiler that emits the kernel's own `.s` file. Two had shipped, the third was under way, and the fourth was "on the horizon". TODO: one or two sentences on what this post shows: phase 4 done (or how far), and what that means.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The code** | [sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth), `forth-from-forth/` |
| **Status** | TODO: forth-from-forth/docs/status.md, once pushed |
| **Live demo** | [web-sw-cor24-forth](https://sw-embed.github.io/web-sw-cor24-forth/) (TODO: tab 4 when it ships) |
| **Earlier** | [Embedded #3](/2026/04/20/embedded-forth-self-hosting-spectrum/); Rabbit-hole [#2](/2026/04/23/rabbit-hole-deep-dive-forth-find-cost-of-a-name/), [#3](/2026/04/24/rabbit-hole-forth-life-after-hashing/), [#4](/2026/04/25/rabbit-hole-forth-dictionary-compaction-specialized-images/), [#5](/2026/04/26/rabbit-hole-forth-retargetable-codegen-forward-references/) |
| **The series** | [Embedded: every post](/series/#embedded) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Where phase 4 stood in April

TODO: the first saga (2026-04-22 to 04-26): the design (a pure-Forth cross-compiler, no hash), the scaffold, the compiler MVP emitting all of runtime.fth as COR24 assembly, a runnable self-test, the symbol table and dynamic labels for the parser; then a pause with the parser not yet integrated (step 009 partial, step 012 partial). Why it stopped, only if the record says.

## The bug that held it up

TODO: the negative-literal NUMBER bug in phase 3, fixed 2026-10-23 (saga step 1, parser-integration-fix; parser-debug-notes.md, "Resolution"): what went wrong and how it was found.

## The cross-compiler

TODO: compiler/xcomp.fth: how a colon definition becomes COR24 assembly; PRIM: and COLON:; how the dictionary chain and labels are laid out. A short real excerpt of Forth source and the assembly it emits.

## Compiling the whole core from source

TODO: steps 2 and 3: runtime.fth from source, then the other four tiers.

## Primitives and booting the image

TODO: step 4: core/prims.fth, the irreducible primitives (about 22 in phase 3; the final count), and booting without the UART bootstrap.

## kernel.s as a build artifact

TODO: step 5: the bootstrap deleted and the tests re-baselined (reg-rs); the before and after numbers from kernel-sizes.md: lines of hand-written assembly, lines of Forth, image size. Embedded #3's table predicted about 1000 lines of Forth and 0% hand-written assembly; compare.

## In the browser

TODO: step 6: the fourth tab on [web-sw-cor24-forth](https://sw-embed.github.io/web-sw-cor24-forth/), beside the three earlier phases' tabs; what it shows, and a screenshot.

## What it took, and what is next

TODO: Embedded #3 estimated two to three weeks of work from phase 3 to phase 4, with the risk that instruction-encoding bugs are silent; how it actually went. What is next, from the repo's plan, without promises.
