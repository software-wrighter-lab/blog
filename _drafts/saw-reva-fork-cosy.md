---
layout: post
title: "Saw #16: Reva Forth, Ported to Rust and WebAssembly, and CoSy on Top"
categories: [languages, forth]
tags: [sharpen-the-saw, forth, reva, cosy, apl, k, rust, wasm, webassembly, tauri, desktop, portability, licensing, emulation]
keywords: "Reva Forth, reva-fork, Forth in Rust, Forth in WebAssembly, x86 emulation, vx86, Tauri desktop app, CoSy, Bob Armstrong, APL K vocabulary on Forth, porting legacy x86 code, removing bundled binaries, license gate, no copyleft"
abstract: "Reva is a compact Forth that compiles straight to 32-bit x86 machine code. reva-fork carries it to 64-bit Linux and macOS (with Windows builds, untested so far), to the browser through WebAssembly, and to a desktop app, by running Reva's own Forth system unchanged on a small x86 virtual machine written in Rust. On top of it, I am porting Bob Armstrong's CoSy, an APL- and K-like vocabulary built on Reva, off its bundled Windows binaries, x86-only code and code not licensed for commercial use. Both now draw turtle-graphics fractals, and the two versions of each fractal show the difference between recursing in Forth and treating a curve as a list. Where both stand after one weekend, with live demos of each."
series: "Sharpen the Saw Sundays"
series_part: 16
date: 2026-10-25 00:15:00 -0700
video_url: "https://www.youtube.com/watch?v=DJCiwjD-qqU"
video_title: "CoSy fractals"
repo_urls:
  - url: "https://github.com/softwarewrighter/reva-fork"
    title: "reva-fork"
---

<!-- DRAFT (2026-10-25), Mike: Saw #16 on porting Reva to a portable Rust core (softwarewrighter/reva-fork, public, dev at
     bfdad6d) and CoSy onto it (softwarewrighter/ba-cosy-zip-fork, PRIVATE: no link until Mike makes it public).
     Mike (2026-10-25): the fork stays private until he has vetted it; publish without the link, and add it later with an
     [Ed. ...] note (links box row and the cosy-fractals.f mention). Final pass
     2026-10-25 evening: Mike postponed 3D graphics and the database to a future post (mentioned as planned, no link). Facts
     re-checked against both dev branches: README (69 of 132 examples), docs/desktop.md (Windows builds, untested),
     docs/serve.md, docs/turtle.md, LICENSING.md, docs/licenses.md; CoSy fork reva-fork-subset/README.md and git log.
     Fractal figures: rendered from reva-fork dev 03fd93f with the reva CLI (svg-save) and CoSy on the same build; code images
     made with forth-highlight.py (merged in both forks: reva-fork #28, ba-cosy-zip-fork #14). Line counts exclude comments.
     Live demos: Mike's staging sites (wrighter.space/staging/...-2026.1025.0), commands as Mike ran them; re-check before
     publishing. Lead image: Mike's logo-cosy-coffee.jpg, outside of the circle made transparent; color, no-invert. -->

<img src="{{ '/assets/images/posts/logo-cosy-coffee.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

This week's saw is an old Forth and the language built on it. [Reva](https://github.com/ronaaron/reva) is a compact Forth by Ron Aaron that compiles straight to 32-bit x86 machine code; its last release was 2011.2. [CoSy](https://cosy.com/), by Bob Armstrong, is an APL- and K-like vocabulary written on top of Reva. Both run only where 32-bit x86 runs, and CoSy's distribution is built for Windows. I am carrying both forward: Reva to a portable Rust core that runs as a command-line tool on Linux and macOS (Windows builds, untested so far), in the browser and in a desktop app, and CoSy onto that core.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **reva-fork** | [softwarewrighter/reva-fork](https://github.com/softwarewrighter/reva-fork) (branch `dev`) |
| **Live demos** | [Reva in the browser](https://wrighter.space/staging/reva-fork/reva-web-2026.1025.0/), [CoSy in the browser](https://wrighter.space/staging/cosy-fork/cosy-web-2026.1025.0/) (staging) |
| **Highlighter** | [forth-highlight.py](https://github.com/softwarewrighter/reva-fork/blob/dev/rust/scripts/forth-highlight.py), which made the code figures |
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

The first commit of the portable core is from Saturday afternoon; this is where it stands on Sunday evening:

- **The `reva` command** runs on any 64-bit platform Rust supports. 69 of the 132 programs in Reva's `examples/` run unchanged, and a generated report tracks the rest. The REPL keeps a history and has Emacs-style line editing.
- **The browser:** a WebAssembly module with no imports runs the VM in a Web Worker, in time slices, so the page never freezes and Stop interrupts a running word. Files live in browser storage. The site is a static zip that any web server can host, and `reva-serve` packs the same site and a tiny web server into one local binary.
- **A desktop app:** the same REPL in a [Tauri](https://tauri.app/) window on Linux and macOS, with files in a folder on disk and *packages*, folders with their own start files. CoSy is one. It also builds on Windows, untested so far.
- **Saved images** (also in the browser), `restart`, file words, `time&date`, and a version banner.
- **x87 floating point**, the instructions Reva's float library compiles to, now runs in the VM.
- **Not yet:** native C libraries, and translating hot code back to native instructions.

The next item on the roadmap is *virtual libraries*: Rust code inside the VM that serves the old library names, instead of loading native libraries: SQLite first, then a UI service and, later, 3D through WebGL, for the browser and the desktop app alike. The database and 3D graphics are for a planned post; this one stops at 2D.

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

Each segment is one call to the turtle. The code figures in this post were made with `forth-highlight.py`, a small script now in both forks that turns Reva and CoSy source into color-highlighted HTML or PNG. The library has six such demos: the Koch snowflake, the Sierpinski triangle, the dragon curve, the Hilbert curve, a fractal tree, and a plant grown by a small L-system interpreter.

<div class="aside-box" style="float: none; clear: none; width: auto; max-width: none; margin: 1em 0;" markdown="1">

**Try it** in the [Reva web demo](https://wrighter.space/staging/reva-fork/reva-web-2026.1025.0/):

```text
needs turtle/fractals 5 koch-demo           | load and run
fractals                                    | list the demos
" /reva/lib/turtle/fractals" slurp type     | list the source
```

Other demos: `6 hilbert-demo`, `6 sierpinski-demo`, `12 dragon-demo`, `10 tree-demo`, `5 plant-demo`.

</div>

## Cleaning up as it goes
{: .pos-center}

The original distribution carried prebuilt Windows and Linux binaries. reva-fork keeps the deprecated 32-bit x86 implementation under `legacy/`, and holds the rest to a stricter rule: no copyleft code, and no native libraries at run time, so it can be used commercially with no condition beyond credit, on every platform. Copyleft files the portable core never used (a GPL SHA-1 source, and MySQL, GnuPG, libiconv and pthreads libraries) were removed, and a license check now fails on any GPL, LGPL or AGPL text and on any binary not listed with its license. Reva itself is in the public domain, and its author asks for credit, which the fork gives.

## CoSy on reva-fork
{: .pos-left}

CoSy is the reason for all of this. It was built on an older Reva, 7.0.8, and it ships as a zip with its own Reva, Windows DLLs and a GUI built on IUP. The port has its own goals: no bundled binaries, nothing redistributed that is not licensed for commercial use, nothing Windows-only or x86-only, and, as with reva-fork, 2D and 3D graphics and a desktop app.

The first milestone landed on Sunday morning. A subset of CoSy loads to the end on reva-fork, 856 words with no errors, and vectors, reduce, strings, nested lists and its `R` dictionary work at the REPL. Getting there took:

- **A small compatibility layer** for the three things that changed between Reva 7.0.8 and 2011.2: words that went missing (`>defer`, `make`, `undo`), `value` becoming a macro, and error names that now throw instead of being constants.
- **23 source patches**, each checked to match the expected number of times so the build fails if CoSy's source changes under it.
- **One VM fix in reva-fork:** an x86 instruction form (`mov` with a memory offset, opcodes `a0` to `a3`) that Reva's locals library emits and CoSy relies on.
- **Leaving things out for now:** the one piece of inline assembly that shelled out to an external assembler (now two bytes), the help system (it needs SQLite), and the GUI built on the IUP library, which also pulls in iconv through the FFI.

Since then, with x87 in the VM, CoSy runs with real floats, and it restores and saves its `.csy` workspaces again. It opens in reva-fork's desktop app as a package with its own icon, runs in the browser from a static site (the demo linked above), and builds as one local binary, `cosy-serve`. Its About box credits Bob Armstrong and links CoSy.com.

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

<div class="aside-box" style="float: none; clear: none; width: auto; max-width: none; margin: 1em 0;" markdown="1">

**Try it** in the [CoSy web demo](https://wrighter.space/staging/cosy-fork/cosy-web-2026.1025.0/):

```text
include cosy-fractals.f 5 ckoch             | load and run
cfractals                                   | list the demos
" cosy-fractals.f" slurp type               | list the source
```

Other demos: `6 chilbert`, `7 csierpinski`, `12 cdragon`. The Reva commands above work there too, since CoSy runs on Reva, so the two versions of each fractal can be drawn side by side. In the Reva demo the CoSy commands do not: `cosy-fractals.f` is not on that site, and listing it prints nothing.

</div>

## Next
{: .pos-center}

For CoSy, the main gap is its GUI: the IUP widgets it used are what is still missing, and a terminal, browser and desktop front end on reva-fork has to replace them. Then a public link for the CoSy fork. For reva-fork, the virtual libraries, starting with the database, and 3D graphics; those, and what CoSy does with them, are for a planned post.
