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
video_url: "https://www.youtube.com/watch?v=DJCiwjD-qqU"
video_title: "CoSy fractals"
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
     Also in progress (Mike, 2026-10-25): a Logo-inspired turtle-graphics fractals demo (use its output as gutter images), and an
     agent emulating/replacing the x86 floating-point (x87) dependencies. Neither committed as of 11:40 (checked all branches).
     CoSy fork dev (4361f3c) has cosy-desktop: CoSy opens in reva-fork's desktop app with its own icon; added to the text.
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
| **Video** | [CoSy fractals](https://www.youtube.com/watch?v=DJCiwjD-qqU)<br>[![Video](https://img.youtube.com/vi/DJCiwjD-qqU/mqdefault.jpg){: .video-thumb}](https://www.youtube.com/watch?v=DJCiwjD-qqU) |
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
- **x87 floating point**, the instructions Reva's float library compiles to, now runs in the VM (merged today).
- **Not yet:** native C libraries, and translating hot code back to native instructions.

The next item on the roadmap is *virtual libraries*: Rust code inside the VM that serves the old library names, instead of loading native libraries. SQLite first, then a UI service with panes, keys and an SVG surface, and later WebGL for 3D, for the browser and the desktop app alike. That is where the 2D and 3D graphics will come from.

## Turtle graphics in reva-fork
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/saw16-reva-fractals.webp' | relative_url }}" class="no-invert" alt="Six fractals drawn by reva-fork's turtle graphics and saved as SVG: a Koch snowflake in blue, a Sierpinski triangle in purple, a dragon curve in orange, a Hilbert curve in green, a brown and green fractal tree, and an L-system plant">
<figcaption style="font-size: 0.85em;">The six fractal demos in reva-fork, drawn by the `reva` command and saved as SVG. Click to enlarge.</figcaption>
</figure>

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/saw16-reva-koch.webp' | relative_url }}" class="no-invert" alt="reva-fork's Koch snowflake in color-highlighted Forth: koch recurses to depth zero and draws a step, otherwise draws four smaller Koch curves with turns of 60, 120 and 60 degrees; snowflake draws three; koch-demo sets the color, position and step length">
<figcaption style="font-size: 0.85em;">The Koch snowflake in reva-fork, eight lines. Click to enlarge.</figcaption>
</figure>

The first graphics in reva-fork are Logo's: a turtle that moves, turns and draws ([docs/turtle.md](https://github.com/softwarewrighter/reva-fork/blob/dev/docs/turtle.md)). It draws in a separate window in the desktop app, in a popup, pane or split view in the browser, and to an SVG file on the command line. The world is 800 by 800, angles are whole degrees, and every argument is an integer, so the turtle needs no floating point.

The fractal demos are written the Logo way, drawing while they recurse. A Koch curve at depth zero is one step; at any other depth it is four Koch curves a third the size, with turns between them:

```text
: koch ( depth -- )
    dup 0if drop step ;then
    1- dup koch 60 left dup koch 120 right dup koch 60 left koch ;
: snowflake ( depth -- ) 3 0do dup koch 120 right loop drop ;
```

Each segment is one call to the turtle. The library has six such demos: the Koch snowflake, the Sierpinski triangle, the dragon curve, the Hilbert curve, a fractal tree, and a plant grown by a small L-system interpreter.

## Cleaning up as it goes
{: .pos-center}

The original distribution carried prebuilt Windows and Linux binaries. reva-fork keeps the deprecated 32-bit x86 implementation under `legacy/`, and holds the rest to a stricter rule: no copyleft code, and no native libraries at run time, so it can be used commercially with no condition beyond credit, on every platform. Copyleft files the portable core never used (a GPL SHA-1 source, and MySQL, GnuPG, libiconv and pthreads libraries) were removed, and a license check now fails on any GPL, LGPL or AGPL text and on any binary not listed with its license. Reva itself is in the public domain, and its author asks for credit, which the fork gives.

## CoSy on reva-fork
{: .pos-left}

CoSy is the reason for all of this. It was built on an older Reva, 7.0.8, and it ships as a zip with its own Reva, Windows DLLs and a Windows GUI. The port has its own goals: no bundled binaries, nothing redistributed that is not licensed for commercial use, nothing Windows-only or x86-only, and, as with reva-fork, 2D and 3D graphics and a desktop app.

The first milestone landed this morning. A subset of CoSy loads to the end on reva-fork, 856 words with no errors, and vectors, reduce, strings, nested lists and its `R` dictionary work at the REPL. Getting there took:

- **A small compatibility layer** for the three things that changed between Reva 7.0.8 and 2011.2: words that went missing (`>defer`, `make`, `undo`), `value` becoming a macro, and error names that now throw instead of being constants.
- **23 source patches**, each checked to match the expected number of times so the build fails if CoSy's source changes under it.
- **One VM fix in reva-fork:** an x86 instruction form (`mov` with a memory offset, opcodes `a0` to `a3`) that Reva's locals library emits and CoSy relies on.
- **Leaving things out for now:** the one piece of inline assembly that shelled out to an external assembler (now two bytes), the help system (it needs SQLite), and the GUI built on the IUP library, which also pulls in iconv through the FFI.

Since then, with x87 in the VM, CoSy runs with real floats, and it restores and saves its `.csy` workspaces again. It also opens in reva-fork's desktop app as a package, with its own icon.

The port also turned up two latent bugs in CoSy itself, broken on the original Reva too: two words spelled in the wrong case, and an undefined word that silently aborted the rest of one file.

## The CoSy way: a curve is a list
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/saw16-cosy-pipeline.webp' | relative_url }}" class="no-invert" alt="The CoSy fractal tables and pipeline in color-highlighted code: three 128-entry tables, Lrules, Lturn and Ldraw, indexed by character code; rule, turn and draws fill them; Lgen is one L-system generation, an index and a raze; headings is a running sum of turns from a start heading, selected where a step draws; Ipath hands the whole path to the turtle in one call">
<figcaption style="font-size: 0.85em;">The CoSy version's tables and pipeline, shared by every curve. Click to enlarge.</figcaption>
</figure>

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/saw16-cosy-koch.webp' | relative_url }}" class="no-invert" alt="The CoSy Koch snowflake: reset the tables, give F the rule F+F--F+F, plus and minus turns of 60 degrees, F draws; set color, position and step; expand F--F--F n generations, take headings from 90, print the segment count and draw the path">
<figcaption style="font-size: 0.85em;">The Koch snowflake in CoSy: six lines on the shared pipeline. Click to enlarge.</figcaption>
</figure>

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/saw16-cosy-dragon.webp' | relative_url }}" class="no-invert" alt="The CoSy dragon curve: unfold makes T, 90, minus reverse T from a list of turns T; cdragon unfolds n times, takes the running sum of the turns from a start heading, and draws the path in one call">
<figcaption style="font-size: 0.85em;">The dragon curve in CoSy: paper folding as a list operation, no L-system. Click to enlarge.</figcaption>
</figure>

CoSy's version of the same demos (`cosy-fractals.f`, in the CoSy fork, private for now) runs on the same turtle, but treats a curve as data first. An L-system generation is one index and one raze: each character is looked up in a table of rewrites, and the results are joined. The turns are another index into a table, the headings are a running sum of the turns (`+\`, APL's scan), the drawing steps are selected with `&` (APL's *where*), and the whole path goes to the turtle in one call. Between those steps the curve is an ordinary CoSy list, so it can be counted, reversed or combined before anything is drawn; each demo prints its segment count first (3,072 for the Koch snowflake at depth 5).

The dragon curve needs no L-system at all. Folding a strip of paper is a list operation: the turns after one more fold are the old turns, a 90, and the old turns reversed and negated, `T , 90 , - reverse T`.

| Curve | reva-fork, recursive | CoSy, as lists |
|---|---:|---:|
| Koch snowflake | 8 lines | 6 |
| Sierpinski | 12 (triangle) | 6 (arrowhead curve) |
| Hilbert | 11 | 6 |
| Dragon | 7 | 8 |
| Shared tables and pipeline | none | 18 |

Lines of code, comments left out. Each CoSy curve is a few lines on top of the shared pipeline; the dragon is about the same either way. The two files differ in what they cover, too: reva-fork's also has the tree and the L-system plant, in 87 lines of code to CoSy's 50.

## Next
{: .pos-center}

For reva-fork: x87 floats, then the virtual libraries and the UI service. For CoSy: its saved workspaces, a browser build, and, as the first practical goal on reva-fork's roadmap, a static WebAssembly demo of CoSy: a directory of HTML, JavaScript and a `.wasm` file that any web server can serve, with nothing to install.
