---
layout: post
title: "Bucket List #2: A Landing Page for Software Tools"
date: 2026-04-03 00:15:00 -0800
categories: [personal, projects]
tags: [bucket-list, cor24, compilers, languages, emulators, tools, vibe-coding, agentrail-rs]
keywords: "bucket list, COR24, software tools, Lisp, garbage collector, p-code VM, PL/SW, SWS, monitor, debugger, shell, editor, compiler, interpreter, linker, vibe coding, agentrail-rs"
author: Software Wrighter
abstract: "Two weeks of vibe-coding with agentrail-rs produced a landing page for the COR24 Software Tools ecosystem---a portfolio of bucket list items that are actually getting done: a Lisp with garbage collection, a p-code VM, two programming languages, a monitor, an editor, and more."
series: "Bucket List"
series_part: 2
---

<img src="{{ '/assets/images/posts/block-buckets-in-space.webp' | relative_url }}" class="post-marker" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

In the [first Bucket List post](/2026/03/21/bucket-list-things-ive-always-wanted-to-build/), I listed the things I've always wanted to build. A lot of them were software tools: compilers, interpreters, languages, debuggers---the infrastructure that software is made of. In the past two weeks, a surprising number of those items moved from "someday" to "done" or "in progress."

The catalyst was [agentrail-rs](https://github.com/softwarewrighter/agentrail-rs), my AI agent workflow tool. I pointed it at the COR24 ecosystem and let it rip.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **COR24 Software Tools** | [Landing Page](https://sw-embed.github.io/web-sw-cor24-demos/#) |
| **Bucket List** | [GitHub](https://github.com/softwarewrighter/bucketlist) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Landing Page

The [COR24 Software Tools](https://sw-embed.github.io/web-sw-cor24-demos/#) page is a Yew/WebAssembly single-page application that ties together everything I've built for the COR24 24-bit RISC processor. All nineteen tools target the COR24 ISA---assemblers, compilers, interpreters, and system software, all generating or executing COR24 machine code. They're organized into five groups: foundation tools, cross-compilers, the p-code system, native languages, and system software. Each group has interactive browser demos, documentation, and links to source.

Two weeks ago, most of these existed as scattered repos. Now they have a home, and every one of them is a bucket list item I can point to and say: done, or close to it.

## Bucket List Items: Checked Off

Here's what's actually built and working, mapped back to the list from Part 1.

### Write a Lisp

**Tiny Macro Lisp** --- a Lisp interpreter written in C, targeting COR24. Lexical scoping, `defmacro`, closures, and a mark-and-sweep garbage collector. It runs in the browser as a live REPL. This was two bucket list items in one: write a Lisp *and* implement a garbage collector.

I've wanted to write a Lisp since I first read *Structure and Interpretation of Computer Programs* decades ago. The garbage collector was the part I was most nervous about. Turns out, once you have a clear mark phase and a clear sweep phase, it's not mysterious---it's just graph traversal with consequences.

### Implement a Garbage Collector

See above. Mark-and-sweep, integrated into the Lisp runtime. Every cons cell, every closure, every environment frame is a heap object that gets traced. When the free list runs low, the collector walks the root set and reclaims everything unreachable. Simple, correct, and satisfying to watch in the debugger.

### Implement a P-Code VM

**P-code VM, Assembler & Linker** --- the VM is written in COR24 assembly (running on the emulator), with a Rust-based assembler and linker for the toolchain. Plus a **Pascal compiler** (p24p) that targets the p-code instruction set, and a **P-code AOT compiler** (pc-aotc) that translates p-code bytecode to native COR24 assembly.

This is straight out of the 1970s UCSD Pascal playbook. A stack-based virtual machine with its own instruction set, a compiler that targets it, and an ahead-of-time compiler that eliminates the interpretation overhead. Three layers of abstraction, all visible and inspectable in the browser.

### Design a Systems Programming Language (PL/SW)

**PL/SW** --- inspired by PL/I, targeting COR24. A compiled systems language with structured control flow, typed variables, and direct hardware access. It has its own IDE in the browser.

PL/I was the language IBM designed to replace everything---FORTRAN, COBOL, assembly. It was too ambitious, too complex, and too slow. But the *idea* of a language that spans systems programming and application programming has always appealed to me. PL/SW is my take on what PL/I might have been if it had been designed for a small machine instead of a mainframe.

### Design a Scripting Language (SWS)

**SWS** --- a Tcl-like scripting language for shell and editor automation on COR24. Where PL/SW is for building the system, SWS is for gluing it together. Command substitution, string manipulation, interactive use.

Every system needs a scripting layer. Something you can type at a prompt, something that can automate the editor, something that doesn't require a compile step. SWS fills that role.

### Implement a Monitor

**Resident Monitor** --- boots at address 0, provides program invocation, I/O services, and a command interface. Written in COR24 assembly with some C components. This is the closest thing the COR24 has to an operating system: it loads programs, manages memory regions, and provides system calls.

### Implement an Editor

**yocto-ed** --- a minimal modal text editor with a gap buffer implementation. Written in C, compiled with the tc24r cross-compiler. This one is practical: I needed an editor to dogfood the C compiler, so I wrote one. Gap buffers are one of those data structures you hear about but rarely implement yourself.

### Write a Compiler (Several, Actually)

- **Tiny C Cross-Compiler (tc24r)** --- compiles a subset of C to COR24 assembly, written in Rust
- **Pascal Compiler (p24p)** --- compiles Pascal to p-code, written in C
- **Fortran Compiler** --- translates Fortran to COR24 assembly, written in C
- **P-code AOT Compiler (pc-aotc)** --- translates p-code bytecode to native COR24 assembly
- **Native Assembler (as24)** --- runs on the COR24 itself, part of the self-hosting toolchain

Five compilers/translators. Each one taught me something different about parsing, code generation, register allocation, and the gap between source language semantics and machine capabilities.

### Implement an Interpreter

Beyond the Lisp interpreter, there's also:
- **Forth IDE** --- a direct-threaded code Forth with dictionary browsing and stack inspection
- **APL Interpreter (apl-sw)** --- integer-only APL with rank-2 arrays
- **BASIC Interpreter** --- classic BASIC with line numbers, GOTO/GOSUB, string variables

Four interpreters across four very different language paradigms: functional (Lisp), concatenative (Forth), array-oriented (APL), and imperative (BASIC).

## Still on the List

A few items from Part 1 aren't checked off yet:

- **Debugger** --- a source-level debugger is planned but not yet implemented
- **Shell** --- the monitor handles basic command dispatch, but a proper shell with pipes and redirection is future work
- **Linker** --- the p-code linker exists, but a general-purpose native linker is still to come

## The Vibe-Coding Part

All of this was built with AI assistance via agentrail-rs. The pattern: I describe what I want at an architectural level---"implement a mark-and-sweep garbage collector for the Lisp runtime"---and the AI writes the implementation. I review, test, redirect, and iterate. The landing page itself is a Yew SPA compiled to WebAssembly with Trunk, using the Catppuccin Mocha theme.

Two weeks. Nineteen tools. One person, operating as architect and project manager rather than line-by-line coder.

This is what retirement plus AI looks like. The bucket list is getting shorter.

---

*Previous: [Bucket List #1: Things I've Always Wanted to Build](/2026/03/21/bucket-list-things-ive-always-wanted-to-build/) --- the full list.*
