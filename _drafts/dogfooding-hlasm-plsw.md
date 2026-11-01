---
layout: post
title: "Dogfooding #2: A Chain of Tools, Each Testing the One Below"
categories: [embedded, programming-languages, compilers, dogfooding]
tags: [dogfooding, cor24, hlasm, pl-sw, tinyc, assembler, macro-assembler, bootstrapping, self-hosting, swtos, reg-rs, agentrail]
keywords: "dogfooding, COR24, HLASM-inspired macro assembler, PL/SW compiler, tiny C compiler tc24r, cor24-asm, bootstrapping, self-hosting, porting C to assembler, structured jump relaxation, SWTOS microkernel, toolchain chain"
abstract: "Each of my COR24 tools is tested by the one built on it. The simple assembler was dogfooded by my C compiler, which was dogfooded by the PL/SW compiler written in C. Now I am porting PL/SW from C to HLASM, my macro assembler written in COR24 assembly, and porting the tiny-C demos to HLASM first to prove the method. It already found a bug: HLASM's structured IF and DO had never produced code the assembler would accept, and text-only regression tests never noticed. The plan ends with HLASM and PL/SW each compiling themselves, and the SWTOS microkernel as the test of both."
series: "Dogfooding"
series_part: 2
date: 2026-11-01 00:15:00 -0700
repo_urls:
  - url: "https://github.com/sw-embed/sw-cor24-hlasm"
    title: "sw-cor24-hlasm"
  - url: "https://github.com/sw-embed/sw-cor24-plsw"
    title: "PL/SW"
  - url: "https://github.com/sw-embed/sw-cor24-x-tinyc"
    title: "tc24r"
  - url: "https://github.com/sw-embed/sw-cor24-x-assembler"
    title: "cor24-asm"
  - url: "https://github.com/sw-embed/sw-tos"
    title: "SWTOS"
---

<!-- DRAFT (2026-10-31), Mike: Dogfooding #2, planned 11/01. His framing: PL/SW previously dogfooded his C, which dogfooded the simpler
     assembler; PL/SW will dogfood HLASM; HLASM now dogfoods the simpler assembler, and he plans for HLASM and PL/SW each to dogfood
     themselves; SWTOS dogfoods the simple assembler and some PL/SW, and he hopes to make it the ultimate test of the refactored
     HLASM and PL/SW instead of cor24-asm.
     Facts: sw-cor24-hlasm branch feat/tinyc-macro-ports (9acb665, 2026-10-30): saga tinyc-macro-ports, step 1
     structured-jmp-relaxation done (de3315a; docs/structured-jump-relaxation.md), step 2 limits audit current, then e2e harness,
     tiny-C survey and macro catalog, macro library, demo ports, showcase; docs/bootstrap.md (hlasm0 -> hlasm1); README (written in
     COR24 assembly, output plain .s over UART). sw-cor24-plsw dev f6d2d64: docs/migrate-from-c-to-hlasm.md (plan, 2026-10-30, no
     migration work started; phases 0-5). sw-tos justfile (cor24-asm, plsw.lgo pipeline). Both repos' default branch is dev.
     Lead image: Mike's block-puppy-dogfood.jpg (Dropbox), NightCafe credit bar cropped off the bottom;
     monochrome block print, no-invert. Moved to 11/01 (Mike, 2026-10-31). Gutter beside "Where it
     is headed": Mike's screenshot (Dropbox Screenshots, 2026-11-01 9.45.53 AM), the word HLASM in IBM-logo-style stripes, trimmed. Gutter beside "The tiny-C demos
     go first": Mike's logo-c-3d.jpg (Dropbox), 140px, no-invert. -->

<img src="{{ '/assets/images/posts/block-puppy-dogfood.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

[The first Dogfooding post](/2026/04/27/embedded-pascal-pcode-yagni-bump-to-reclaim/) was about one tool finding the limits of another: a Pascal VM's allocator, outgrown by an OCaml written in Pascal. This one is about a whole chain of them. On COR24, each of my tools is tested by the one built on top of it, and I am rebuilding the chain so that, in the end, the top two test themselves.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **HLASM** | [sw-cor24-hlasm](https://github.com/sw-embed/sw-cor24-hlasm), its [bootstrap plan](https://github.com/sw-embed/sw-cor24-hlasm/blob/dev/docs/bootstrap.md) |
| **PL/SW** | [sw-cor24-plsw](https://github.com/sw-embed/sw-cor24-plsw), its [C to HLASM plan](https://github.com/sw-embed/sw-cor24-plsw/blob/dev/docs/migrate-from-c-to-hlasm.md) |
| **tiny C** | [sw-cor24-x-tinyc](https://github.com/sw-embed/sw-cor24-x-tinyc) (`tc24r`) |
| **The assembler** | [sw-cor24-x-assembler](https://github.com/sw-embed/sw-cor24-x-assembler) (`cor24-asm`) |
| **SWTOS** | [sw-tos](https://github.com/sw-embed/sw-tos) |
| **Background** | [Why I Use #3: Assembler, C and PL/SW](/2026/10/30/why-i-use-asm-c-plsw/) |
| **The series** | [Dogfooding: every post](/series/#dogfooding) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The chain as it stands

[Why I Use #3](/2026/10/30/why-i-use-asm-c-plsw/) described the three languages I write COR24 code in. Built one on another, they test each other:

- **The simple assembler**, `cor24-asm`, turns COR24 assembly text into bytes. Everything above it depends on it.
- **My C compiler**, `tc24r`, emits assembly for `cor24-asm`, so every C program it compiles dogfoods the assembler.
- **The PL/SW compiler** is written in C. Compiling it with `tc24r` dogfooded the C compiler, a real program of thousands of lines rather than a demo.
- **SWTOS**, my microkernel, is written in assembler and some PL/SW, so it dogfoods the assembler and part of PL/SW.

That chain has a host-side compiler in the middle: `tc24r` runs on the host, not on COR24.

## Moving PL/SW onto HLASM

HLASM is my macro assembler for COR24, inspired by IBM's High Level Assembler: structured `IF`, `DO` and `SELECT`, macros with parameters, conditional assembly. It is written in COR24 assembly, runs on COR24, and writes plain assembly text for `cor24-asm`. So today HLASM dogfoods the simple assembler.

The [plan for PL/SW](https://github.com/sw-embed/sw-cor24-plsw/blob/dev/docs/migrate-from-c-to-hlasm.md), written this week, is to port its compiler from C to HLASM:

```text
hlasm.s (hand-written COR24 assembly)
   -> assembles PL/SW written in HLASM
      -> compiles PL/SW written in PL/SW
         -> compiles itself
```

That takes the host C compiler out of the chain: every stage after `hlasm.s` is built on COR24. The port is mechanical, each C function becoming one HLASM routine with the same calling convention, so it can be checked against `tc24r`'s output a function at a time. And PL/SW, a real compiler, becomes the program that dogfoods HLASM.

## The tiny-C demos go first
{: .pos-left}

<figure class="outdent-right" style="width: 140px;">
<img src="{{ '/assets/images/posts/logo-c-3d.webp' | relative_url }}" class="no-invert" alt="A white letter C on a blue hexagon">
</figure>

Before porting a compiler, the method has to work on something smaller. HLASM's current saga ports the tiny-C demos, the example programs that ship with `tc24r`, from C to HLASM, building a shared library of macros (routine entry and exit, calls, UART output, data) as it goes. Its steps: make structured control flow assemble, audit HLASM's limits, add an end-to-end harness that runs HLASM, assembles its output and runs the result, survey the demos for recurring idioms, build the macro library, port the demos, and show C, `tc24r`'s assembly and HLASM side by side.

## What dogfooding found on day one

The first step had to fix something that had been wrong all along. HLASM lowered its structured `IF`, `DO` and `SELECT` into jumps written `jmp <label>`. But COR24's `jmp` takes only a register, `jmp (r0)`, and `cor24-asm` rejects `jmp <label>`, as it always had. HLASM's regression tests compared the assembly text it wrote and never assembled it, so nothing noticed. Nine demos used the broken form.

It took a program that had to run, not just print, to find it. HLASM now sizes each jump in a first pass and emits a short `bra` when the target is in range, or saves a register around a long `la`/`jmp` when it is not ([the design](https://github.com/sw-embed/sw-cor24-hlasm/blob/dev/docs/structured-jump-relaxation.md)). That is the whole argument for dogfooding in one bug: a test that checks the text a tool writes is not the same as a test that runs what it wrote.

## Where it is headed
{: .pos-right}

<figure class="outdent-left">
<img src="{{ '/assets/images/posts/hlasm-logo.webp' | relative_url }}" class="no-invert" alt="The word HLASM in blue horizontal stripes, in the style of IBM's striped logo">
</figure>

Two loops close at the top of the chain:

- **HLASM in HLASM.** The [bootstrap plan](https://github.com/sw-embed/sw-cor24-hlasm/blob/dev/docs/bootstrap.md) starts small: the hand-written `hlasm.s` assembles a reduced HLASM written in the subset it already supports, and the full one grows from there. Then HLASM dogfoods itself.
- **PL/SW in PL/SW.** Once PL/SW is written in HLASM, the next stage is a PL/SW compiler written in PL/SW, compiling itself.

And SWTOS, which today dogfoods the simple assembler and some PL/SW, is the test I want for both: an operating system built with the refactored HLASM and PL/SW, in place of `cor24-asm`. A microkernel that boots and runs is a harder test than any demo.
