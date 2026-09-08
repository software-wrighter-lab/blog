---
layout: post
title: "Bucket List #3: 3D Source Code, Five New Languages, and Visible Compilers"
date: 2026-04-30 12:00:00 -0700
categories: [personal, projects, languages, compilers]
tags: [bucket-list, programming-languages, compilers, 3d-source, visualization, education, lexer, parser, ast, register-allocation, garbage-collector, jit, plsw, sws, sw-mlpl, tuplet, discoveryone, wasm, cor24]
keywords: "bucket list, 3D source code, programming languages, language implementation, visible compilers, compiler visualization, lexer animation, parser animation, AST viewer, register allocation, garbage collector, JIT compiler, PL/SW, SWS, sw-MLPL, MLPL, Tuplet, DiscoveryOne, COR24, WASM, retirement projects, vibe coding, Yew, educational tools, PL/X, Mass Compile, PL/EDIT, mainframe, 3270, IBM, batch job submission, template-driven editing"
author: Software Wrighter
abstract: "Three threads winding through the next chunk of the bucket list. First, source code in three dimensions: punch cards were 1D, screens are 2D, DiscoveryOne projects glyphs at (x, y, z) onto seven semantic facets. Second, five programming languages of my own currently in flight --- PL/SW, SWS, sw-MLPL, Tuplet, and DiscoveryOne --- each picking a different point on the build-axis / run-axis space. Third, the missing tool category that would tie all the language work together: educational visualizers that let you *watch* a compiler run --- step through a lexer, animate a parser, observe register allocation, see a heap fill and a garbage collector reclaim it, watch a JIT tier up. Most CS students never see any of this. They read about it. I want to build the surface that lets them watch."
series: "Bucket List"
series_part: 3
---

<img src="{{ '/assets/images/posts/block-mag-glyphs.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 220px;">

<div style="overflow: hidden;" markdown="1">

The first two posts in this series listed the things I always wanted to build ([part 1](/2026/03/21/bucket-list-things-ive-always-wanted-to-build/)) and the surprisingly long list that got crossed off in two weeks of vibe-coding ([part 2](/2026/04/03/bucket-list-software-tools-landing-page/)). Three categories of work currently pulling at me are *not* yet on either list. They belong on the list. This post adds them.

</div>

<div class="aside-box" markdown="1">

**Why this matters** --- A bucket list is only useful if it grows as fast as it shrinks. Crossing things off without adding things back is how a list gets shorter than the curiosities of the person carrying it. The three categories below are what's been quietly moving from "interesting" to "I'm actually doing this" since the last post --- and they share a thread: each one is something a working engineer rarely gets to do (build a new programming language, sculpt a new authoring surface, or instrument a compiler so you can *watch* it think) because the day job never gives that kind of room. Retirement and AI agents jointly do.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **DiscoveryOne** (3D source) | [softwarewrighter/DiscoveryOne](https://github.com/softwarewrighter/DiscoveryOne) |
| **Tuplet** (2D, DiscoveryOne's predecessor) | [softwarewrighter/tuplet](https://github.com/softwarewrighter/tuplet) |
| **sw-MLPL** (array language) | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) · [live REPL](https://sw-ml-study.github.io/sw-mlpl/) |
| **PL/SW** (PL/I-inspired systems lang) | [sw-embed/sw-cor24-plsw](https://github.com/sw-embed/sw-cor24-plsw) · [live demo](https://sw-embed.github.io/web-sw-cor24-plsw/) |
| **SWS** (Tcl-like resident shell) | [sw-embed/sw-cor24-script](https://github.com/sw-embed/sw-cor24-script) |
| **Bucket List** | [softwarewrighter/bucketlist](https://github.com/softwarewrighter/bucketlist) |
| **Prior posts** | [Part 1](/2026/03/21/bucket-list-things-ive-always-wanted-to-build/) · [Part 2](/2026/04/03/bucket-list-software-tools-landing-page/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## Source Code's Third Dimension

Programmers get attached to the medium they happened to learn on. People who started on punch cards remember source as a *one-dimensional* thing: a stack of cards, fed sequentially, each card eighty columns of fixed-width sequencing, each program a literal physical pile. People who started on glass terminals (which is most of us) think of source as *two-dimensional*: a window of lines and columns, scrollable in two axes, with the assumption that the meaningful structure lives inside that rectangle.

Every editor we use today is still a 2D-rectangle authoring surface. We have learned to interleave many concerns inside that rectangle --- the *algorithm*, the *types of inputs and outputs*, the *preconditions* and *postconditions* the algorithm assumes, the *generated form* the compiler ends up emitting, the *implementation layers* (logging, error handling, instrumentation) that production code accumulates. Modern languages provide affordances for hiding most of this --- type signatures collapse, comments fold, error handling moves to attributes or decorators --- but it all still lives in the same rectangle, fighting for the same screen real estate, and the front-of-the-eye reading order is whatever the editor's vertical scrollbar decides.

Punch cards are 1D. Screens are 2D. **What if source were 3D?**

[**DiscoveryOne**](https://github.com/softwarewrighter/DiscoveryOne) is the project I am sketching to make that question concrete. Every glyph in a DiscoveryOne program has an `(x, y, z)` coordinate and an aspect label drawn from a fixed set: `@front`, `@left`, `@right`, `@top`, `@bottom`, `@rear`, `@internal`. A definition is *not* a block of text; it is a small cube of meaning, and the user views one facet at a time:

| Facet | Role |
|-------|------|
| Front | Algorithm gist --- the readable story |
| Left | Inputs (arity, names, types) |
| Right | Outputs (arity, names, types) |
| Top | Preconditions |
| Bottom | Postconditions |
| Rear | Generated form (WAT or stack IR) |
| Internal | Implementation in spatially-separable layers |

The Yew/WASM web app loads the file, projects it onto the requested facet, and runs the WASM module in-page when you click **Run**. A `*Power` definition reading `n e -> p; p <- 1; loop e times: p <- p * n` lives on `@front`; `n : Int, e : Int` lives on `@left`; the output type `p : Int` lives on `@right`; `e >= 0` lives on `@top`; `p == n^e` lives on `@bottom`. Aspects (preconditions, postconditions, tracing, profiling, error recovery) live on spatially separate `@internal` layers so the front facet stays uncluttered for reading.

DiscoveryOne is the successor to **Tuplet**, my current 2D-layout-sensitive language with first-class named tuples and user-mintable verbs (the `*` operator literally mints new syntax). Tuplet keeps source 2D but layout-sensitive --- *where* a glyph sits on a 2D grid changes its meaning. DiscoveryOne is the next jump: from "layout matters" to "facet matters." The same glyph in two different `@`-aspects participates in two different parts of the program's meaning.

Whether 3D source is *useful* is a real question. It might turn out that the seven facets are too many, or that the projection UI is too clumsy, or that humans really do read code best as a flat top-to-bottom story. I don't know. The way to find out is to build it, drive a non-trivial program through it, and see whether reading the front facet of an unfamiliar definition is faster than reading the equivalent flat code with all its types and contracts and tracing inline.

DiscoveryOne is currently pre-M0 --- the specification is committed; no code yet. The single demoable target (M7 in the saga plan) is one vertical slice: the user authors a `*Power` definition and a `*syntax do _ while _ end expand` syntax declaration, and runs both inside the web app. If that slice feels right, the rest follows.

## Five Languages of My Own, in Flight

The other thing on the list right now is *making programming languages*, plural. Five of mine are currently between "design committed" and "live demo," each picking a different point on the build/run space. Listed in roughly the order I started them:

### PL/SW --- PL/I-Inspired Systems Language

[**sw-cor24-plsw**](https://github.com/sw-embed/sw-cor24-plsw) is a small systems-programming language inspired by PL/I (and a little IBM HLASM). It is the language I use to write higher-level COR24 programs --- the SNOBOL4 interpreter, parts of the toolchain, the Fortran compiler in flight. It compiles natively to COR24 assembly and has its own [vibe-maintenance heatmap](/2026/04/29/personal-software-vibe-maintenance/) of issues closed in the past few weeks (forty-plus, including the inevitable parade of "AST pool too small," "MAX_PROCS too small," "emit buffer too small" capacity bumps).

PL/SW's interesting bet is *macros*: PL/I-style `%DEFINE` and `MACRODEF GEN` blocks that emit assembly. That makes the language usable as a meta-assembler --- a higher-level surface that still gives you bit-level control over the COR24 instruction stream. It is the language I would have wanted in 1985 if I had had any say in the matter.

### SWS --- Tcl-Like Resident Shell

[**sw-cor24-script**](https://github.com/sw-embed/sw-cor24-script) is a tiny Tcl-style scripting language that runs *inside* the resident monitor on COR24, sharing the program registry. The shell is a single binary that loads at `0x020000` (above the monitor at zero), and its commands operate on whatever programs the monitor has loaded into the slot table. It is the missing surface for a "1980s style" embedded workflow --- the user types `run hello` at a prompt, the monitor's service vector dispatches into the program at that slot, and control flow returns through a longjmp-style trampoline.

SWS exists because every other language in the lab is *non-resident* --- a load happens, a program runs, the run ends, the host runs the next thing. SWS is the language designed for the case where the *user* is part of the loop: type, run, observe, type again. The repl on a 1 MiB COR24, with a 3 KiB EBR stack, in the year 2026.

### sw-MLPL --- A Rust-First Array Language

[**sw-mlpl**](https://github.com/sw-ml-study/sw-mlpl) is the array-and-tensor programming language I am building for the ML side of the bucket list. The lineage is APL → APL2 → J → BQN, but the *implementation* is Rust-first: a REPL in the terminal and the browser, a `mlpl!` proc macro that lets MLPL expressions live inside Rust source, an `mlpl build` path that compiles MLPL programs to native binaries, and a roadmap of backends (Apple MLX for Apple Silicon, CUDA for distributed training, Ollama / llama.cpp / OpenAI-compatible servers for LLM glue).

MLPL is the only one of the five that is mostly *built* --- the live REPL works in the browser today, the language reference is written, the compiler implementation has a tour document for educational reading. What's still ahead is the long tail of array-language features (rank polymorphism, fork composition, J-style tacit programming) and the big backends. It is the language I will use to do the [fine-tune-a-base-model](/2026/03/21/bucket-list-things-ive-always-wanted-to-build/) item from part 1.

### Tuplet --- 2D Layout-Sensitive Language with Mintable Verbs

[**tuplet**](https://github.com/softwarewrighter/tuplet) is the language I am driving as my main daily-language experiment. It is 2D-layout-sensitive (where a glyph sits on a grid matters), has first-class named tuples and multi-output verbs, and lets the user *mint* new verbs and new syntax via the `*` operator. The kernel is small; everything else --- including control flow --- is library code expressed in the kernel. The host is an OCaml-subset interpreter; the runtime target is Forth running on the COR24 emulator.

Tuplet is currently in the "wakes the dragons" phase of language development --- the language compiles, demos run, but the OCaml interpreter underneath has been [thrashing its heap](/2026/04/28/personal-software-sw-launcher-one-ring/) until the GC work in flight (`sw-cor24-ocaml#28`) lands. Once that lands, Tuplet's `heap_limit` should *shrink*, not stay where it is, and the language will start to feel less fragile.

### DiscoveryOne --- 3D Successor

Already covered above. DiscoveryOne is to Tuplet what Tuplet is to a flat language: one more dimension of authoring surface, one more affordance for separating concerns spatially rather than syntactically. It is the place where I get to ask the broader question --- *can authoring be 3D?* --- without bolting it onto a language whose users are already doing real work.

## The 1980s Ancestors: Mass Compile and PL/EDIT

Two of the threads above have ancestors I worked on as a junior engineer at IBM in the 1980s --- **Mass Compile**, a screen for scheduling batch compile jobs in advance (including jobs for code you had not finished writing), and **PL/EDIT**, a template-driven editor that expanded triggers into boilerplate via hotkey. Both ran on AQ, an MVS/ESA time-sharing service. The [Throwback Thursday post](/2026/04/30/tbt-mass-compile-pl-edit-aq-system/) tells the story in detail. The reason they come up here is the conceptual lineage: Mass Compile's "do the expensive thing against whatever inputs are stable when it runs" is the same shape as [sw-launcher](/2026/04/28/personal-software-sw-launcher-one-ring/)'s content-addressed cache, and PL/EDIT's "fill in the slot that matters and let the template handle the rest" is the same shape as DiscoveryOne's facet authoring. Both ideas keep coming back, in different shapes, every time the dev loop gets a new bottleneck.

I maintained both tools; I did not write them. That was the right level for me at the time, and the [vibe-maintenance post](/2026/04/29/personal-software-vibe-maintenance/) reprises the lesson forty years later: a tool you maintain long enough teaches you the design choices its author made and the seams where the next idea wants to break in. The bucket list, on this reading, is partly a list of the bottlenecks I have seen over the years and the surfaces I want to build to push back on them.

## Visible Compilers --- The Missing Tool Category

The unifying gap, behind all of the above, is *visibility*.

Almost every CS curriculum spends a semester on compilers. Almost every working engineer uses one every day. Almost no engineer has ever *watched* a compiler run --- watched the lexer turn a stream of characters into tokens, watched the parser grow an AST, watched a type checker fail and recover, watched a register allocator color a graph, watched a heap fill up and a GC reclaim it. The mechanism is invisible. We read about it. We trust the diagrams in textbooks. We never see the diagram move.

The next chunk of the bucket list is the tooling that fixes that. For each of the five languages above (and ideally for the COR24 toolchain in general), I want a visible counterpart:

### Step-Through Lexer

A panel that shows the source on the left and the token stream on the right. Click "step" --- the cursor advances by one token, the new token glows in the right panel, the consumed characters fade in the left panel. Speed it up to "auto" and the whole stream animates past at one-token-per-50ms. *See* the lexer.

### Animated Parser

The same idea for the parser: source on the left, the AST growing on the right as a tree. Each shift / reduce step is a step. The current rule highlights. The error recovery, when it happens, is visible --- a subtree dies, a new one grows in its place, the resync token is annotated.

### AST Viewer with Types Folded In

A static view (not animated) of the AST after the parser finishes, with type annotations folded into each node. Hover over a node to see its full type; click to dive into a subtree. The same view, but for the *typed* AST after the type checker runs, with inferred types added. Then the same view for each lowering pass --- AST → CFG → SSA → linearized IR --- with arrows showing what produced what.

### Lowering and Codegen Side-by-Side

Three columns: source, IR, target assembly. Pick a line in any column; the corresponding range highlights in the other two. The lowering passes get their own animation: tail-call elimination shows the call disappearing and the branch appearing; closure conversion shows the free variables being collected and packed; trampolining shows the indirect jump being inserted.

### Register Allocation, Visualized

The conflict graph. The live ranges. The interference. The spills. Watch the graph-coloring algorithm run, color by color. Watch the spill heuristics pick which range to evict. *See* what your compiler optimizer is actually doing when it picks `r4` instead of `r2` for that loop variable.

### Simple Optimizations Before/After

Constant folding. Common subexpression elimination. Dead-code elimination. Loop-invariant code motion. Each one as a side-by-side before/after with the moved/removed code highlighted. The whole point of these is that they're *small* and *understandable* if you can see them; they're black-box magic if you can't.

### Heap and Stack Instrumentation

A live memory map. The stack growing and shrinking with each call/return. The heap filling with allocations, each allocation a colored block. Free / dispose / reclaim animates: the block fades, the free list pointer redirects, the block is gone. The hardest classes of bug --- use-after-free, double-free, leaks --- become *visible* the moment the memory map is.

### Garbage Collectors at Work

Mark-and-sweep, copying, generational. Each one a different animation. Mark-and-sweep: a wave of color sweeps the heap from the root set; everything not colored gets reclaimed. Copying: two semi-spaces, the live objects walk from one to the other, the old space is wiped. Generational: nursery / tenured, promotions visible, write-barrier hits flagged. The OCaml interpreter's incoming GC ([sw-cor24-ocaml#28](https://github.com/sw-embed/sw-cor24-ocaml/issues/28)) would be the first candidate --- I want to *watch* it run.

### JITs Tiering Up

A function getting called once: interpreted. Called a thousand times: tier-up triggers, a jitter compiles a baseline native version, the call site rewrites itself, subsequent calls run at native speed. Hit a deopt: tier-down to the interpreter, the native code gets discarded, the next thousand calls retrigger the jit. This is the part of modern runtime engineering that is hardest to *see*; the visualization that makes it watchable would be the tool I would have wanted as a junior engineer.

The pattern across all of these: the textbook diagrams are static. The visualizer shows them moving. Once you have seen a register allocator color a graph, you cannot read about register allocation the same way again --- the diagrams in the textbook map onto something you actually watched happen.

## Why Now

All three categories above became viable in the same window for the same two reasons --- retirement gave the time, AI agents gave the reach. Every one of these projects, on its own, would have been a multi-year team effort five years ago. Today they sit on the list, and the list is moving:

- A new paradigm of programming-language *surface* (DiscoveryOne) is one vertical slice (M7) from being demoable.
- Five language implementations sit between "compiles" and "in production daily use," each filling a different niche in the small ecosystem.
- The visible-compiler tool category is the unifying frame --- the surface I want to have for *every* compiler I write, including the five above.

The next post in the series will probably be about whichever of these turns out to land first. My money is on the lexer / parser visualizer for sw-MLPL, since the language is already runnable and the visualizer is mostly "yew web app" away. We'll see.

The list keeps growing. The bucket keeps filling. That's the point.
