---
layout: post
title: "Why I Use #3: Assembler, C and PL/SW, for a Machine Rust Can't Target"
categories: [languages, embedded]
tags: [why-i-use, assembler, c, pl-sw, pl-s, cor24, fpga, soft-cpu, compilers, macros, operating-systems, embedded, rust]
keywords: "why I use assembler, C compiler for COR24, PL/SW, PL/S-inspired systems language, compile-time macros, COR24 FPGA soft CPU, MakerLisp, tc24r, cor24-asm, SWTOS microkernel, cross compiler written in Rust, targets Rust does not support"
abstract: "Third in the series on the tools I reach for. To write operating-system and programming-language code for small embedded processors, I use three low-level languages: assembler, C and PL/SW, my PL/S-inspired systems language. They exist because the processor I target, the COR24 FPGA soft CPU, is one Rust does not support. The assembler and the C compiler are written in Rust; PL/SW's compiler is written in C, built with that C compiler, and runs on COR24 itself. All of them generate COR24 assembler, and PL/SW's compile-time macros carry on what IBM's PL/S taught me. The SWTOS microkernel is written in them."
series: "Why I Use"
series_part: 3
date: 2026-10-30 00:15:00 -0700
---

<!-- DRAFT (2026-10-28), Mike: Why I Use #3, planned 10/30: "Assembler, C, PL/SW - these are low-level languages I use to
     develop operating system and programming language code on embedded processors. These are written in Rust, but they in turn
     generate assembler for a target machine, especially one not yet supported by Rust."
     Mike (2026-10-30): correct it: cor24-asm and tc24r are Rust; the PL/SW compiler is C (src/main.c), built with tc24r, run on
     COR24. Aside per Mike: longer-term goal, port PL/SW from tiny C to his future HLASM (sw-cor24-hlasm: "HLASM for COR24 in assembler").
     Facts from the READMEs: sw-cor24-x-assembler 362000b, sw-cor24-x-tinyc 96090c8, sw-cor24-plsw 05748d0, sw-tos; code samples
     verbatim from tests/programs/count_down.s, demos/led.c, examples/system.msw and examples/macro.plsw.
     Lead image: Mike's block-asm-c-plsw.png (Dropbox, third version 17:27; real COR24 count_down loop, C, and loop.plsw's MAIN),
     no-invert. Gutter: sw-cor24-plsw images/sw-pl-badge2.png (93b488d), no-invert. Links #1 (published) and #2 (planned 10/29; publish #2 first). -->

<img src="{{ '/assets/images/posts/block-asm-c-plsw.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 300px;">

[Rust](/2026/10/28/why-i-use-rust/) is what I build tools in, and [APL, Lisp and Forth](/2026/10/29/why-i-use-apl-lisp-forth/) are what I demo ideas in. This post is about a third group: the low-level languages I use to write operating-system and programming-language code for small embedded processors. They are assembler, C and PL/SW, and the reason I need them is a processor Rust cannot target.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The processor** | [COR24, by MakerLisp](https://makerlisp.com); [Embedded #2: COR24-RS](/2026/03/22/cor24-rs-assembly-emulator/) |
| **Assembler** | [sw-cor24-x-assembler](https://github.com/sw-embed/sw-cor24-x-assembler) (`cor24-asm`, Rust) |
| **C** | [sw-cor24-x-tinyc](https://github.com/sw-embed/sw-cor24-x-tinyc) (`tc24r`, Rust) |
| **PL/SW** | [sw-cor24-plsw](https://github.com/sw-embed/sw-cor24-plsw) (compiler in C); [PL/S, its history](https://github.com/sw-embed/sw-cor24-plsw/blob/dev/docs/pl-s-history.md) |
| **Written in PL/SW** | [SWTOS](https://github.com/sw-embed/sw-tos), [live](https://swtos.softwarewrighter.com/); [Made Visible #1](/2026/09/11/made-visible-swtos/) |
| **Rust on COR24, the hard way** | [Rabbit-hole #1](/2026/03/13/rabbit-hole-rust-to-unsupported-isa/) |
| **Try them** | [COR24 demo hub](https://sw-embed.github.io/web-sw-cor24-demos/) |
| **The series** | [Why I Use: every post](/series/#why-i-use) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## A machine Rust does not support

COR24 is a 24-bit RISC soft CPU designed by [MakerLisp](https://makerlisp.com): a processor defined in an FPGA, here on the COR24-TB board with 1 MB of SRAM. Rust's compiler has no COR24 target. [Rabbit-hole #1](/2026/03/13/rabbit-hole-rust-to-unsupported-isa/) got Rust code onto COR24 anyway, by compiling for a 16-bit target Rust does support and translating the result, but that is an experiment, not a way to write an operating system.

So for COR24 I write in assembler, C and PL/SW. The assembler and the C compiler are written in Rust; PL/SW's compiler is written in C and built with that C compiler. Each of them ends in the same place: COR24 assembler text, which the assembler turns into the bytes the CPU runs.

## Assembler

At the bottom is assembler, where every instruction is written by hand. A countdown that prints 5, 4, 3, 2, 1 to the UART, from the assembler's own test programs:

```text
        la      r2,-65280   ; 0xFF0100 UART data
        lc      r0,5        ; counter = 5
_loop:  mov     r1,r0
        add     r1,48       ; + '0'
        sb      r1,0(r2)    ; send to UART
        add     r0,-1       ; r0 -= 1
        ceq     r0,z
        brf     _loop       ; if r0 != 0, loop
```

[`cor24-asm`](https://github.com/sw-embed/sw-cor24-x-assembler), written in Rust, assembles `.s` files into loadable images, raw bytes and listings. It began as the byte-for-byte reference for a self-hosted COR24 assembler, as24, that runs on COR24 itself.

## C
{: .pos-center}

C is the portable layer above it. [`tc24r`](https://github.com/sw-embed/sw-cor24-x-tinyc) is a C compiler for COR24 written in Rust, after the design of chibicc: a recursive-descent parser that emits assembly directly. It handles 24-bit `int`, `char`, pointers, arrays, structs, unions, function pointers and the usual control flow, and its 61 demos all pass. A C program reaches the hardware the way C always has, through a pointer to a memory-mapped register:

```c
// Turn on LED D2 (active-low: write 0 to bit 0)
void led_on() {
    *(char *)0xFF0000 = 0;
}
```

## PL/SW
{: .pos-right}

<figure class="zoomable outdent-left" style="width: 140px;">
<img src="{{ '/assets/images/posts/plsw-badge.webp' | relative_url }}" class="no-invert" alt="The PL/SW badge: the letters PL in orange and SW in light blue on a dark shield with green and gold stripes">
</figure>

PL/SW is the one I designed. [The first post in this series](/2026/10/28/why-i-use-rust/) started with IBM's PL/S ([its history](https://github.com/sw-embed/sw-cor24-plsw/blob/dev/docs/pl-s-history.md)) and its macros that ran during compilation to write the code to be compiled. PL/SW, the Programming Language for Software Wrighter, is a freestanding systems language for COR24, inspired by PL/S, that carries that idea on. A macro declares what it takes and generates code, here three instructions of COR24 assembler:

```text
/* ?LED_SET(VAL(n)) -- write a byte to LED MMIO register */
MACRODEF LED_SET;
    REQUIRED VAL(expr);
    GEN DO;
        'la      r2,16711680';
        'lc      r0,{VAL}';
        'sb      r0,0(r2)';
    END;
END;
```

and a program calls it like a statement of the language:

```text
MAIN: PROC;
    CALL UART_PUTS(ADDR(MSG));
    ?LED_SET VAL(0);
END;
```

PL/SW also has BASED record templates for laying records over memory, controlled inline assembly, and conditional compilation, and it writes human-readable assembler with each source line as a comment. Its compiler is itself written in C, compiled by `tc24r`, and runs on COR24, fed its source over the UART; its linker tools are Rust.

## What they are for
{: .pos-center}

The [SWTOS](https://github.com/sw-embed/sw-tos) microkernel is the test of all three. It is a clean-room microkernel inspired by MINIX's message passing, written in PL/SW and assembler, and it runs on the COR24-TB board and in an emulator in [your browser](https://swtos.softwarewrighter.com/). [Made Visible #1](/2026/09/11/made-visible-swtos/) drew its storage. And the COR24 Forth kernel began as hand-written assembler before most of it moved into Forth ([Embedded #3](/2026/04/20/embedded-forth-self-hosting-spectrum/)).

<div class="aside-box" markdown="1">

**Where PL/SW is headed.** Today PL/SW's compiler is C, built with my COR24 C compiler. My longer-term goal is to port it to my future HLASM for COR24, [sw-cor24-hlasm](https://github.com/sw-embed/sw-cor24-hlasm), a high-level assembler with macros, written in COR24 assembler.

</div>

Rust writes the first tools, and C, compiled by one of them, writes PL/SW's. Assembler, C and PL/SW are what those tools turn into a running machine.
