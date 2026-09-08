---
layout: post
title: "Dogfooding #1: YAGNI Until You Do --- A Pascal P-Code Bump Allocator Grows a Free List"
date: 2026-04-27 09:00:00 -0700
categories: [embedded, programming-languages, compilers, dogfooding]
tags: [dogfooding, yagni, pascal, p-code, vm, allocator, bump-allocator, free-list, ocaml, tuplet, mvp, vibe-coding]
keywords: "dogfooding, YAGNI, Pascal p-code VM, bump allocator, no-op free, free list, reclaim, memory management, OCaml in Pascal, Tuplet language, lexer parser, heap exhaustion, sw-cor24-pascal, COR24, MVP, embedded VM, forcing function, eating your own dog food"
author: Software Wrighter
abstract: "First post in a new Dogfooding series. The Pascal p-code VM shipped with a bump allocator and a no-op free --- enough for small demos, intentionally not more. Then OCaml-in-Pascal (used to write the Tuplet lexer/parser) ran out of heap mid-parse, even after re-doubling the heap twice. YAGNI worked right up until I needed it. This post is about that crossing-over moment: what the bump allocator bought, what it cost, and what reclaim looks like when it finally has to ship."
series: "Dogfooding"
series_part: 1
repo_url: "https://github.com/sw-embed/sw-cor24-pascal"
---

<img src="{{ '/assets/images/posts/block-puppy-dogfood-bowl.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

YAGNI --- *You Ain't Gonna Need It* --- is one of those rules that's easy to quote and hard to time. Skip the feature, ship the demo, move on. It works beautifully *until* the day a real workload sits down on the MVP and the missing piece is suddenly the only piece that matters. Today is that day for the Pascal p-code VM's allocator: a bump allocator with a no-op `free` was exactly enough for every demo it ever ran, right up to the moment OCaml-in-Pascal tried to lex and parse a non-trivial Tuplet program and walked off the end of the heap.

</div>

<div class="aside-box" markdown="1">

**Why Dogfooding?** --- The phrase comes from *"eating your own dog food"*: shipping software that you yourself rely on for real work. In this lab, dogfooding is also the *forcing function* that decides when an MVP has earned its build-out. The pattern is: implement the smallest thing that demonstrates the capability, ship a demo, move on --- then wait for a downstream project to put real load on the placeholder. This series captures the moments where that load finally arrives, what was missing, and what filling the gap looked like.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **COR24 Pascal toolchain** | [sw-embed/sw-cor24-pascal](https://github.com/sw-embed/sw-cor24-pascal) |
| **Pascal Demo** | [sw-embed.github.io/web-sw-cor24-pascal](https://sw-embed.github.io/web-sw-cor24-pascal/) |
| **Tuplet** | [sw-vibe-coding/tuplet](https://github.com/sw-vibe-coding/tuplet) |
| **Related Post** | [Embedded #3: How Much of Forth Can Be Forth?](/2026/04/20/embedded-forth-self-hosting-spectrum/) |
| **Related Post** | [Saw #8: Tuplet, Smalltalk-on-BASIC, Forth-from-Forth](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What the Bump Allocator Bought

The Pascal p-code VM is the runtime under `pa24r` (the Pascal compiler) and `pl24r` (the linker). Pascal source compiles to p-code; p-code executes on a small stack-and-heap VM that targets the COR24 ISA. Heap allocation, from day one, was the simplest thing that could work:

- A single contiguous heap region.
- A bump pointer.
- Allocate by advancing the pointer.
- `free` is a no-op.
- Out-of-heap is a hard fault.

That's it. No metadata per allocation, no headers, no free list, no compaction --- just a pointer and a high-water mark. The allocator fits in a handful of p-code instructions, has zero per-allocation overhead, and is trivially correct because there is nothing to be incorrect *about*. Allocation is O(1) and the worst case equals the best case.

This was the right call. Every Pascal demo on COR24 to date --- the BASIC interpreter, small string-handling exercises, the sample programs in the web demo --- has a working-set that fits comfortably under whatever heap size the VM is configured with. Nothing on the runway needed reclaim. Building a free list would have been YAGNI-bait: more code, more bugs, more places for a wrong-looking trace to come from, all to solve a problem nobody had.

## The Forcing Function: OCaml-in-Pascal Meets Tuplet

The crossing-over moment came from the Tuplet front-end. [Tuplet](https://github.com/sw-vibe-coding/tuplet) is the new glyph-and-whitespace language [introduced in last weekend's Saw post](/2026/04/26/saw-tuplet-smalltalk-forth-from-forth/); its lexer and parser are written in OCaml, and OCaml itself runs --- in the dogfooded version --- on top of the Pascal p-code VM.

That stack looks like this:

| Layer | What's running | Implemented in |
|------:|----------------|----------------|
| 4 | Tuplet program | Tuplet source |
| 3 | Tuplet lexer/parser | OCaml |
| 2 | OCaml runtime | Pascal |
| 1 | Pascal program | p-code |
| 0 | p-code VM | COR24 / native host |

Lex-and-parse is exactly the workload a bump allocator does *not* like. Lexers churn out token objects; parsers build AST nodes by the thousand and discard most of the intermediate scaffolding (one-shot list cells, temporary closures, exception-carrying error paths). The amount of *live* data at any instant is small. The amount of *allocated* data over the lifetime of a parse is enormous. Bump allocation treats those two numbers as the same number.

## Doubling the Heap, Once Is a Fix, Twice Is a Signal

For the first few inputs, the bump allocator was fine: small Tuplet sources parsed cleanly. Then the prelude grew, the test corpus grew, and parses started ending the same way --- *out of heap*. The first response was the cheap one: double the heap. That bought one more input. Double again. One more input. The growth rate of the corpus was outrunning the growth rate of the heap, and every doubling pushed the failure later in the parse rather than removing it.

That's the YAGNI exit signal. The next doubling wasn't going to fix anything; it was just going to delay the same fault by another constant factor while consuming memory the host didn't have to spare. The shape of the workload was demanding reclaim, and the allocator had to grow up.

## Why YAGNI Worked, and Why It Stopped Working

It's worth being precise about what changed, because the instinct after a story like this is *"I should have built the free list from the start."* That's the wrong lesson. The bump allocator was load-bearing for almost a year of demo work, during which:

- The runtime stayed small enough to read in one sitting.
- Memory bugs were impossible by construction (you can't double-free a no-op).
- Every new Pascal feature landed against an allocator that had nothing to break.
- The build-out budget went into things that *did* matter for shipping demos --- string handling, control flow, the p-code instruction set, the assembler, the linker.

The cost of building reclaim earlier wouldn't just have been the code; it would have been all the *other* code that didn't get written because the free list was eating the calendar. YAGNI bought a year of velocity. It paid for itself the first time, and again the second time, and would have paid for itself again if Tuplet had stayed small.

What expired wasn't the allocator's correctness. It was the assumption that the workload-set was bounded by *demo* shapes. A self-hosted compiler front-end is not a demo; it's a real program with its own internal allocation discipline, and that discipline assumes there's something on the other end of the heap willing to take memory back. The first time the VM hosts that kind of workload is the first time YAGNI doesn't apply.

## What "Grow Up" Looks Like

<div class="gutter-section" markdown="1">

<img src="{{ '/assets/images/posts/block-jenga-tower.webp' | relative_url }}" class="gutter-img-left no-invert" alt="Jenga tower with a missing block">

The reclaim work in flight is deliberately *minimum-viable* in the same spirit as the bump allocator was --- pull out the smallest piece the workload demands, leave the tower standing, and don't add anything that doesn't pay for itself the moment it lands. The shape:

- Add a per-allocation header carrying size and a one-bit free flag.
- Add an explicit `free(p)` p-code instruction that flips the flag and coalesces with adjacent free neighbors.
- Maintain a single free list (or a small handful of size classes --- still TBD).
- Allocation prefers free-list reuse, falls back to bumping the high-water mark, faults only when both fail.
- No compaction, no GC, no tracing --- the OCaml runtime knows when it's done with a value and is willing to call `free` explicitly.

That's still a lot smaller than a real allocator. There's no defragmentation, no concurrent allocation, no statistics, no debug poisoning, no quarantine. Each of those is a future YAGNI test --- if the workload demands it, build it; otherwise leave it out. The new floor is *"reclaim works"*, not *"the allocator is finished."*

The interesting question, once this lands, is whether the OCaml runtime's allocation pattern is friendly enough to a free-list allocator that fragmentation never bites, or whether some later workload will bite hard enough to force compaction. I genuinely don't know. That's fine. The next forcing function will tell me.

</div>

## Takeaways

- A bump allocator with a no-op `free` is the right call when the workload-set is bounded by demos. It's fast, small, and impossible to corrupt.
- "Real users" expire the assumption. A self-hosted compiler front-end is the smallest realistic workload that *requires* reclaim, because the working-set is small but the lifetime allocation is unbounded.
- Doubling the heap is a perfectly good response to a memory bug --- *once*. Two doublings is a signal. Three is a confession.
- The next allocator should be exactly as small as the workload demands, and no smaller. Free list, header bit, coalesce on free; defer everything else until something asks for it.

YAGNI didn't fail here. It cashed out. The allocator was a placeholder all along; today is the day it was supposed to be replaced. The trick was knowing it was a placeholder, and trusting the dogfooding loop to ring the bell when the placeholder ran out.

Future Dogfooding posts will follow the same pattern --- a placeholder that earned its keep, the workload that finally outgrew it, and what filling the gap actually looked like. Next up: a postmortem on the reclaim implementation itself, once the OCaml-on-Pascal Tuplet parse can run end-to-end without a heap fault.
