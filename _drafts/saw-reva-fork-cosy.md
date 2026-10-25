---
layout: post
title: "Saw #16: Reva Forth, Ported to Rust and WebAssembly, and CoSy on Top"
categories: [languages, forth]
tags: [sharpen-the-saw, forth, reva, cosy, apl, k, rust, wasm, webassembly, tauri, desktop, portability, licensing, emulation]
keywords: "Reva Forth, reva-fork, Forth in Rust, Forth in WebAssembly, x86 emulation, vx86, Tauri desktop app, CoSy, Bob Armstrong, APL K vocabulary on Forth, porting legacy x86 code, removing bundled binaries, license gate, no copyleft"
abstract: "Reva is a compact Forth that compiles straight to 32-bit x86 machine code. reva-fork carries it to 64-bit Linux, macOS and (soon) Windows, to the browser through WebAssembly, and to a desktop app, by running Reva's own Forth system unchanged on a small x86 virtual machine written in Rust. On top of it, I am porting Bob Armstrong's CoSy, an APL- and K-like vocabulary built on Reva: off its bundled Windows binaries, x86-only code and code not licensed for commercial use, and toward 2D and 3D graphics. Where both stand after the first two days."
series: "Sharpen the Saw Sundays"
series_part: 16
date: 2026-10-25 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/reva-fork"
    title: "reva-fork"
---

<!-- DRAFT (2026-10-25), Mike: a Saw post for today on porting Reva to a portable Rust CLI and WASM (softwarewrighter/reva-fork,
     public, branch dev at 388f7db), and porting CoSy from Reva to reva-fork (softwarewrighter/ba-cosy-zip-fork, PRIVATE: no link
     until Mike makes it public; he will supply one). Goals for the CoSy port per Mike: no bundled binaries, no redistributing code
     not licensed for commercial use, no Windows-only or x86-only features; 2D/3D graphics and a desktop app for both (the 2D/3D
     support is being added to reva-fork; on dev today it is a roadmap item, not code). Windows: desktop installers are on a branch
     (506e165, claude/project-thread-vyqkk8), not on dev. Facts from reva-fork README, LICENSING.md, docs/licenses.md,
     docs/desktop.md, rust/DESIGN.md, git log; ba-cosy-zip-fork reva-fork-subset/README.md and docs/research.txt.
     STATUS (Mike, 2026-10-25): cloud agents are still updating both forks; update this draft and publish later today once
     3D graphics, the database and the web stack land. Re-check every fact against both repos then.
     Lead image: Mike's logo-cosy-coffee.jpg (2026-10-25, ~/Downloads), color, no-invert. -->

<img src="{{ '/assets/images/posts/logo-cosy-coffee.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

This week's saw is an old Forth and the language built on it. [Reva](https://github.com/ronaaron/reva) is a compact Forth by Ron Aaron that compiles straight to 32-bit x86 machine code; its last release was 2011.2. [CoSy](https://cosy.com/), by Bob Armstrong, is an APL- and K-like vocabulary written on top of Reva. Both run only where 32-bit x86 runs, and CoSy's distribution is built for Windows. I am carrying both forward: Reva to a portable Rust core that runs as a command-line tool on Linux and macOS (Windows next) and in the browser, and CoSy onto that core.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **reva-fork** | [softwarewrighter/reva-fork](https://github.com/softwarewrighter/reva-fork) (branch `dev`) |
| **Its design** | [rust/DESIGN.md](https://github.com/softwarewrighter/reva-fork/blob/dev/rust/DESIGN.md) |
| **Reva, upstream** | [ronaaron/reva](https://github.com/ronaaron/reva) |
| **CoSy** | [cosy.com](https://cosy.com/), its [Forth code](https://cosy.com/4thCoSy/); the older [CoSyBob/CoSy](https://github.com/CoSyBob/CoSy) repository |
| **The CoSy port** | private for now; a link when it is public |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Why not just rewrite it

Reva compiles Forth to x86 machine code, and about 60 words in its Forth system, `src/reva.f`, and about 100 in its libraries are written as instruction bytes. Rewriting all of that for a new processor would make a new Forth, not a port. So [reva-fork](https://github.com/softwarewrighter/reva-fork) does something else: its portable core, written in Rust, executes the small subset of 32-bit x86 that Reva actually uses (called vx86) in a virtual machine over one flat 32-bit address space. That address space maps directly onto WebAssembly's linear memory, and onto a single buffer on a 64-bit host. The routines Reva's assembly core provided are re-implemented in Rust, at the addresses Reva expects, so the Forth side sees the same core it always did.

The result is that Reva's own `reva.f`, release 2011.2, boots in full and unchanged: its embedded assembler, contexts, `needs` and libraries, `does>`, `catch` and `throw`, the FFI layer and the REPL. The design notes weigh the alternatives (a token-threaded VM, hand-written 64-bit assembly cores) against this one.

## Where reva-fork stands

The first commit of the portable core is from Saturday afternoon; this is where it is a day later:

- **The `reva` command** runs on any 64-bit platform Rust supports. 64 of the 132 programs in Reva's `examples/` run unchanged, and a generated report tracks the rest.
- **The browser:** a WebAssembly module with no imports runs the VM in a Web Worker, in time slices, so the page never freezes and Stop interrupts a running word. Files live in browser storage.
- **A desktop app:** the same REPL in a [Tauri](https://tauri.app/) window on Linux and macOS, with files in a folder on disk and *packages*, folders with their own start files. CoSy is meant to be one. Windows installers are in progress on a branch.
- **Saved images** (also in the browser), `restart`, file words, `time&date`, and a version banner.
- **Not yet:** x87 floating point, native C libraries, and translating hot code back to native instructions.

The roadmap after floats is *virtual libraries*: Rust code inside the VM that serves the old library names, instead of loading native libraries. SQLite first, then a UI service with panes, keys and an SVG surface, and later WebGL for 3D, for the browser and the desktop app alike. That is where the 2D and 3D graphics will come from.

## Cleaning up as it goes

The original distribution carried prebuilt Windows and Linux binaries. reva-fork keeps the deprecated 32-bit x86 implementation under `legacy/`, and holds the rest to a stricter rule: no copyleft code, and no native libraries at run time, so it can be used commercially with no condition beyond credit, on every platform. Copyleft files the portable core never used (a GPL SHA-1 source, and MySQL, GnuPG, libiconv and pthreads libraries) were removed, and a license check now fails on any GPL, LGPL or AGPL text and on any binary not listed with its license. Reva itself is in the public domain, and its author asks for credit, which the fork gives.

## CoSy on reva-fork

CoSy is the reason for all of this. It was built on an older Reva, 7.0.8, and it ships as a zip with its own Reva, Windows DLLs and a Windows GUI. The port has its own goals: no bundled binaries, nothing redistributed that is not licensed for commercial use, nothing Windows-only or x86-only, and, as with reva-fork, 2D and 3D graphics and a desktop app.

The first milestone landed this morning. A subset of CoSy loads to the end on reva-fork, 856 words with no errors, and vectors, reduce, strings, nested lists and its `R` dictionary work at the REPL. Getting there took:

- **A small compatibility layer** for the three things that changed between Reva 7.0.8 and 2011.2: words that went missing (`>defer`, `make`, `undo`), `value` becoming a macro, and error names that now throw instead of being constants.
- **23 source patches**, each checked to match the expected number of times so the build fails if CoSy's source changes under it.
- **One VM fix in reva-fork:** an x86 instruction form (`mov` with a memory offset, opcodes `a0` to `a3`) that Reva's locals library emits and CoSy relies on.
- **Leaving things out for now:** floats (stubbed until the VM has x87), the one piece of inline assembly that shelled out to an external assembler (now two bytes), the help system (it needs SQLite), and the GUI built on the IUP library, which also pulls in iconv through the FFI.

It also turned up two latent bugs in CoSy itself, broken on the original Reva too: two words spelled in the wrong case, and an undefined word that silently aborted the rest of one file.

## Next

For reva-fork: x87 floats, then the virtual libraries and the UI service. For CoSy: its saved workspaces, a browser build, and, as the first practical goal on reva-fork's roadmap, a static WebAssembly demo of CoSy: a directory of HTML, JavaScript and a `.wasm` file that any web server can serve, with nothing to install.
