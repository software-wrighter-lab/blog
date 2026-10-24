---
layout: post
title: "Embedded #4: forth-from-forth, a Forth Kernel That Rebuilds Itself"
date: 2026-10-24 00:15:00 -0700
categories: [embedded, programming-languages, deep-dive]
tags: [embedded, forth, self-hosting, cor24, cross-compiler, kernel, bootstrapping, threaded-code, forth-from-forth]
keywords: "Forth from Forth, Forth cross-compiler, self-hosting Forth kernel, COR24, sw-cor24-forth, forth-from-forth, kernel.s as a build artifact, Forth primitives, bootstrapping, threaded code"
abstract: "Phase 4 of the COR24 Forth kernel, finished: a cross-compiler written in Forth turns the core's Forth source into the kernel's dictionary and writes the primitives in a small Forth assembler vocabulary, so the whole kernel.s is generated from Forth and boots straight into the Forth QUIT. Run on the kernel it just built, the compiler reproduces that kernel exactly: the hand-written kernel was needed only to start the chain. First output after 710 thousand instructions instead of 150 million. Why it sat for six months (a minus sign), what the April posts predicted, the new fourth tab in the web demo, and what still is not Forth: the assembler that turns the text into bytes."
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
     2026-10-23 evening: filled from the repo's blog brief (docs/blog/2026-phase-4-forth-from-forth-brief.md, 4afec14, revised 2c461b6
     with the Forth primitives 5b874f5 and the fixed point 0208844; all pushed). Numbers spot-checked against origin/main kernel-sizes.md, prims.fth
     (32 PRIM: lines), xcomp.fth (621 lines after the revision). Figures: boot chart drawn from kernel-sizes.md; tab 4 captured from the live demo
     (build a2caefd). Mike's point: a Forth compiler compiling itself; the revised brief has it (tf24a_fff_fixed_point), with the
     caveat that cor24-asm, not Forth, turns the text into bytes. status.md still has stale rows (6a template, web tab 4).
     Lead image: Mike's block-rabbit-watch.jpg (2026-10-23, ~/Downloads), monochrome; no-invert (Mike, 2026-10-23: inverted prints look poor in dark mode). -->

<img src="{{ '/assets/images/posts/block-rabbit-watch.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

[Embedded #3](/2026/04/20/embedded-forth-self-hosting-spectrum/) asked how much of a Forth kernel can be written in Forth, and laid out four phases for the COR24 kernel, from all assembly to a cross-compiler written in Forth that emits the kernel's own assembly. Two phases had shipped, the third was under way, and the fourth was "on the horizon". The fourth has now landed, six months late. The kernel no longer reads its core Forth source at boot: a compiler written in Forth has already turned that source into the kernel's dictionary, and writes the primitives too, so every line of the kernel's assembly is generated from Forth. And the compiler, run on the kernel it just built, rebuilds that same kernel exactly. The hand-written kernel was needed only to start the chain.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The code** | [sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth), `forth-from-forth/` |
| **Status and numbers** | [status.md](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-from-forth/docs/status.md), [kernel-sizes.md](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-from-forth/docs/kernel-sizes.md) |
| **Live demo** | [Tiny Forth, tab 4](https://sw-embed.github.io/web-sw-cor24-forth/) |
| **Earlier** | [Embedded #3](/2026/04/20/embedded-forth-self-hosting-spectrum/); Rabbit-hole [#2](/2026/04/23/rabbit-hole-deep-dive-forth-find-cost-of-a-name/), [#3](/2026/04/24/rabbit-hole-forth-life-after-hashing/), [#4](/2026/04/25/rabbit-hole-forth-dictionary-compaction-specialized-images/), [#5](/2026/04/26/rabbit-hole-forth-retargetable-codegen-forward-references/) |
| **The series** | [Embedded: every post](/series/#embedded) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Where phase 4 stood in April

Phases 2 and 3 moved more and more of the kernel from assembly into Forth: by the end of phase 3, `WORD`, `FIND`, `NUMBER`, `INTERPRET` and `QUIT` were Forth, over about 22 assembly primitives. But both still booted the same way. A small interpreter written in assembly read the Forth core over the UART, five source files in phase 3, and compiled it word by word every time the machine started.

Phase 4 was to end that: write the compiler in Forth, run it ahead of time, and put the compiled dictionary into the kernel image. The first attempt ran from April 22 to 26. It produced a design, a scaffold, and a compiler that emitted the first of the five tiers, `runtime.fth`, as COR24 assembly from a hand-listed sequence of its definitions. Then it stopped: compiling a definition from its source died right after the begin marker, and two sessions could not find out why. Embedded #3 had estimated two to three weeks from phase 3 to phase 4. It took six months, nearly all of them waiting on one bug.

## Six months stuck on a minus sign

The bug was not in the compiler. Phase 3's Forth `NUMBER` read the minus sign from the string's length byte instead of its first character, so every negative literal failed. The compiler's own token reader, `XC-READ-TOKEN`, contains a `-1`; that `-1` became a `?` and a missing stack item, and everything after it fell apart. The same bug had quietly broken five demos in the web app's third tab (CONSTANT, DO LOOP, IF THEN, IF ELSE and Self Test). Once it was fixed ([6e0aa5c](https://github.com/sw-embed/sw-cor24-forth/commit/6e0aa5c)), the rest of phase 4 took about a day. The search is written up in [parser-debug-notes.md](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-from-forth/docs/parser-debug-notes.md).

## The cross-compiler
{: .pos-left}

[`compiler/xcomp.fth`](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-from-forth/compiler/xcomp.fth) is 621 lines of Forth: the compiler and a small COR24 assembler vocabulary. It reads the five core tiers as ordinary Forth source and writes their dictionary as COR24 assembly text. The 32 primitives underneath are registered, one line each, in [`core/prims.fth`](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-from-forth/core/prims.fth), which ties each Forth name to the label of its code:

```forth
PRIM: LIT     do_lit
PRIM: @       do_fetch
PRIM: !       do_store
PRIM: +       do_plus
PRIM: NAND    do_nand
```

A colon definition becomes a header and a list of addresses. For `: R@ RP@ 3 + @ ;` the compiler writes:

```text
fff_e5_R_64:            ; header: link, length, "R@"
.word fff_e4_SWAP
.byte 2
.byte 82
.byte 64
fff_c5_R_64:            ; push r0; la r0,do_docol_far; jmp (r0)
.byte 125
.byte 41
.word do_docol_far
.byte 38
.word do_rp_fetch
.word do_lit
.word 3
.word do_plus
.word do_fetch
.word do_exit
```

One detail shows the kind of problem a cross-compiler meets. In Forth, `IMMEDIATE` comes after the `;` that ends a definition, but the flag lives in the header byte, which comes first. The COR24 assembler has no equates to patch that byte later, so the compiler buffers each body, reads one token past `;` to see whether `IMMEDIATE` follows, and only then writes the entry. Branch offsets for `IF`, `BEGIN` and `WHILE` come from the same per-definition buffer.

## The primitives, in Forth
{: .pos-center}

The code behind those labels was, until the last step, hand-written assembly carried over from phase 3. Now it is Forth too. [`core/prims-asm.fth`](https://github.com/sw-embed/sw-cor24-forth/blob/main/forth-from-forth/core/prims-asm.fth) writes every primitive in the assembler vocabulary, operands first and the instruction last, in the Forth way. Here is `+`, ending with the inner interpreter's `NEXT`:

```forth
l: do_plus
  fp pop,   \ fp = n2
  r0 pop,   \ r0 = n1
  r0 fp add,   \ r0 = n1 + n2
  r0 push,
\ NEXT
  r0 0 r2 lw,
  r2 3 addi,
  r0 jmp,
```

Run, these words print COR24 assembler text, and the result is byte-identical to the hand-written primitives they replaced. The generated `kernel.s` now has no hand-written template behind it: 3,917 lines, all from Forth. The vocabulary prints text, though; it does not encode instructions. The COR24 assembler, `cor24-asm`, still turns that text into bytes.

## Booting already compiled
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/fff-boot-instructions.webp' | relative_url }}" class="no-invert" alt="A bar chart on a log scale of instructions until the first output for the input 7777 dot on the COR24 emulator: forth.s, all assembly, 80,000; forth-from-forth, core compiled into the image, 710,000; forth-in-forth, four tiers over the UART, 87,440,000; forth-on-forthish, five tiers over the UART, 149,560,000">
<figcaption style="font-size: 0.85em;">Instructions until the first output, per kernel, on a log scale. Click to enlarge.</figcaption>
</figure>

`scripts/build-image.sh` splices the compiled dictionary into the kernel. At reset, `_start` points `LATEST` at the newest compiled entry, and the start thread runs the Forth `QUIT`. Nothing is read over the UART until the user types.

Measured on the COR24 emulator, with the input `7777 .`, the first output now comes after 710 thousand instructions. Phase 3 needed about 150 million, phase 2 about 87 million, and the all-assembly kernel 80 thousand. In the web app, through the same UART pump the browser uses, tab 4 is ready after one tick of the pump and tab 3 after 74.

Getting the assembly bootstrap out of the image took one more Forth definition. The last assembly code that called the assembly `WORD` and `FIND` was `[']`, and a Forth one replaced it ([8ab0170](https://github.com/sw-embed/sw-cor24-forth/commit/8ab0170)):

```forth
: [']  ' ['] LIT , , ; IMMEDIATE
```

A reachability pass then removed everything nothing referred to: 85 blocks and 1,043 lines, among them the assembly `INTERPRET`, `QUIT`, `NUMBER`, `WORD`, `FIND`, `:` and `;`.

| Kernel | Assembly lines | Bytes |
|---|---:|---:|
| phase 3, primitives and bootstrap | 2,659 | 4,001 |
| phase 4, image with the bootstrap still in | 5,087 | 9,450 |
| phase 4, bootstrap removed | 4,060 | 8,168 |
| phase 4, primitives from Forth | 3,917 | 8,168 |

The phase-4 kernel is bigger than phase 3's because it carries the compiled core: 83 definitions, 2,427 lines of emitted assembly, about 5.4 KB on their own. Phase 3 carried the same core as source and compiled it at every boot. A full build, primitives and dictionary, takes about 80 seconds, since the compiler runs inside the emulator. All 92 golden-output tests pass.

## What the April posts predicted
{: .pos-center}

The [rabbit-hole posts](/2026/04/23/rabbit-hole-deep-dive-forth-find-cost-of-a-name/) from April worked through what phase 4 would need. Checked against what was built:

- **"Phase 4 deletes the hashing subsystem."** Mostly. The assembly `FIND` that used the hash is gone from the image. The hash table itself is still there, unused: the assembly `CREATE` maintains it and `_start` fills it. Now that the primitives are Forth, removing it is a Forth edit.
- **Caches to replace the hash** (a numeric fast path, recent hits, hot tokens): none were built. Boot no longer runs `FIND` over the core at all, which was the cost they targeted. Interactive `FIND` speed was not measured.
- **Dictionary compaction and specialized images:** not done. The image keeps every core word, development words such as `SEE` and `DUMP-ALL` included. The relocation problem that post described did not arise, because the image is assembled from text with labels rather than relocated.
- **Forward references as linker-style fixups:** not needed for the core. Every definition is registered before its body is read, so later definitions and self-reference resolve by name, and the core has no mutual recursion. The retargetable second backend that post proposed was not built.

## In the browser
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/fff-web-tab4.webp' | relative_url }}" class="no-invert" alt="The Tiny Forth COR24 debugger in the browser with four tabs, forth.s, forth-in-forth, forth-on-forthish and forth-from-forth, the last selected; SEE QUIT shows INTERPRET STATE @ 0= 0BRANCH 39 LIT 32 EMIT LIT 111 EMIT LIT 107 EMIT LIT 10 EMIT BRANCH -57, then ok twice and 49 ok after defining SQUARE and running 7 SQUARE dot; the status line says Ready, kernel forth-from-forth">
<figcaption style="font-size: 0.85em;">Tab 4: <code>SEE QUIT</code>, then <code>: SQUARE DUP * ;</code> and <code>7 SQUARE .</code>, in the live demo. Click to enlarge.</figcaption>
</figure>

The [web demo](https://sw-embed.github.io/web-sw-cor24-forth/) has a fourth tab, forth-from-forth, and opens on it. Its status line says Ready at once; switch to tab 3 to see the difference. `SEE QUIT` shows the Forth `QUIT` loop, and every word `WORDS` lists was compiled by the Forth cross-compiler. The Loop Switch LED demo runs too: click S2 while it runs.

The all-assembly kernel also runs elsewhere now, as a pane inside the SWTOS microkernel ([swtos.softwarewrighter.com/forth](https://swtos.softwarewrighter.com/forth/); type `bg forth` at its shell): the same core assembly, with a different I/O layer.

## Found along the way
{: .pos-center}

Finishing phase 4 turned up bugs in the older kernels and in the tests:

- **Fixed:** tab 1 of the web app would not accept input. When `forth.s` was split into a core and a UART layer, every read went through a label the web pump did not know ([2fc2518](https://github.com/sw-embed/web-sw-cor24-forth/commit/2fc2518)). A new test watchdog turned a silent nine-minute spin into a 60-second failure that names the kernel and the program counter.
- **Fixed:** the web build replayed a boot one byte per 200,000 instructions; the Pages build went from 2:07 to 0:10.
- **Fixed in the tests:** six golden tests kept only the first 100 to 250 lines of output, so the Fibonacci tests never compared the Fibonacci result; and the emulator's default 10-second limit cut runs short under load.
- **Not fixed:** `2SWAP` and `2OVER` in the layered kernels are wrong (`1 2 3 4 2SWAP` leaves `2 1 4 3`); `.` prints -8388608 as `-0`; and tab 3 starts each session with a stray value on its stack, left by errors its assembly bootstrap prints while loading the core.

## The kernel rebuilds itself
{: .pos-right}

Building forth-from-forth is a bootstrap. The cross-compiler normally runs on the phase-3 kernel, forth-on-forthish, which was built from hand-written assembly, and emits the new kernel. The question that matters is what happens when the new kernel does the job itself.

So the build was run again with the compiler on forth-from-forth's own kernel. It reproduced forth-from-forth's `kernel.s` exactly, every byte of the text ([0208844](https://github.com/sw-embed/sw-cor24-forth/commit/0208844)). That is the fixed point a self-hosting compiler is judged by: built by itself, it builds itself, unchanged. From here, the hand-written kernel is only the root of the chain, needed once to start it. A golden test, `tf24a_fff_fixed_point`, now runs that build on every change, and anyone can repeat it:

```sh
XC_HOST=forth-from-forth/kernel.s forth-from-forth/scripts/build-image.sh --check
```

## What is still not Forth

- **The assembler.** The kernel's assembly is generated by Forth, but `cor24-asm` turns it into bytes. A Forth instruction encoder, the piece Embedded #3 expected retargeting to hinge on, is the next step, after which the image would need no external assembler.
- **Leftovers:** the unused `FIND` hash table; `DO`, `?DO`, `LOOP`, `CONSTANT` and `VARIABLE` in the cross-compiler, left out because no core tier uses them; and the second, retargetable backend and the Forth-builder kit from the spring, which are still plans.
