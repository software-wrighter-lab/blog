---
layout: post
title: "Rabbit-hole #5: FORTH --- Retargetable Codegen and the Forward-Reference Problem"
date: 2026-04-26 00:15:00 -0700
categories: [rabbit-hole, programming-languages, forth, deep-dive]
tags: [rabbit-hole, forth, cor24, codegen, retargetable-compiler, forward-references, mutual-recursion, linker, assembler, self-hosting, compiler-backend]
keywords: "Forth, retargetable code generation, forward references, mutual recursion, self-hosted compiler, COR24, WASM, RV32I, System/360, compiler backend, Forth composer, unresolved symbols, fixups, relocation"
author: Software Wrighter
abstract: "After dictionary compaction turns one Forth source tree into different vertical profiles, the next rabbit trail goes horizontal: how does the same self-hosted Forth compiler target COR24, WASM, RV32I, or S/360 without forking the language, and how do forward references and mutually recursive words survive that split?"
series: "Down the Rabbit-Hole"
series_part: 5
repo_url: "https://github.com/sw-embed/sw-cor24-forth"
demo_url: "https://sw-embed.github.io/web-sw-cor24-forth/"
---

<img src="{{ '/assets/images/posts/block-rabbit-tree-sword-left.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 220px;">

<div style="overflow: hidden;" markdown="1">

Dictionary compaction was the vertical problem: one Forth source tree, many images, each with a different amount of development machinery stripped away. Retargetable code generation is the horizontal problem: one source tree, many machines, each with a different instruction set, calling convention, memory model, and set of awkward things the compiler cannot pretend are the same.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Play in Browser** | [COR24 Forth Demo](https://sw-embed.github.io/web-sw-cor24-forth/) |
| **Kernel Repo** | [sw-embed/sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth) |
| **Prior post** | [Rabbit-hole #4: FORTH --- Dictionary Compaction and Specialized Images](/2026/04/25/rabbit-hole-forth-dictionary-compaction-specialized-images/) |
| **Overview post** | [Embedded #3: Self-Hosting Spectrum](/2026/04/20/embedded-forth-self-hosting-spectrum/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Vertical Split Was Only Half the Problem

Part 4 framed the Forth composer as a way to build different *profiles* from the same source:

| Profile | Keeps | Drops |
|---------|-------|-------|
| **dev** | names, `FIND`, `CREATE`, REPL, instrumentation | almost nothing |
| **runtime** | compiled CFAs, primitives, inner loop | names, compiler, REPL, dead words |
| **debug-runtime** | compiled CFAs plus symbols and trace hooks | full interactive machinery |

That is vertical specialization. The target machine stays the same; the amount of Forth you carry into the final artifact changes.

Retargetable codegen asks a different question:

> What if the *profile* is the same, but the output machine changes?

COR24 wants one shape of branch. WASM wants another. RV32I has registers and load/store rules that do not resemble a tiny threaded-code VM. S/360 brings condition codes, base registers, and a whole cultural memory of what "assembly" means.

If the compiler is self-hosted, this cannot be solved by hiding everything behind a giant external backend forever. Eventually the Forth system itself needs to describe what it emits.

## The Tempting Bad Design

The easiest design to imagine is also the one that rots first:

```forth
: EMIT-CALL
  TARGET-COR24 IF ... THEN
  TARGET-WASM  IF ... THEN
  TARGET-RV32I IF ... THEN
  TARGET-S360  IF ... THEN ;
```

Do that for `CALL`, `BRANCH`, literals, stack effects, memory access, returns, labels, and relocations, and the compiler becomes a pile of target checks. Every new target edits shared code. Every feature test is now a backend integration test. The source language has no clean boundary from the machines it targets.

That is not a retargetable compiler. That is a compiler with a target-shaped rash.

## A Better Boundary: Operations, Not Instructions

The useful split is between *semantic operations* and *target encodings*.

The front half of the Forth compiler should talk in operations:

| Operation | Meaning |
|-----------|---------|
| `op-call word` | transfer to a known word and return |
| `op-lit value` | place a literal on the data stack |
| `op-branch label` | unconditional control flow |
| `op-0branch label` | branch if top of stack is false |
| `op-load addr` | fetch from memory |
| `op-store addr` | store to memory |
| `op-exit` | return from colon definition |

The backend owns how those operations become bytes, cells, threaded CFAs, WASM instructions, or assembly text.

That boundary is what lets COR24 stay simple while a future WASM target does something entirely different.

## The Forward-Reference Problem

Forth normally likes definitions to appear before use. A simple single-pass compiler can get very far with that rule:

```forth
: SQUARE DUP * ;
: AREA SQUARE * ;
```

`AREA` can call `SQUARE` because `SQUARE` already exists.

But real systems eventually want cycles:

```forth
: EVEN? DUP 0= IF DROP TRUE EXIT THEN 1- ODD? ;
: ODD?  DUP 0= IF DROP FALSE EXIT THEN 1- EVEN? ;
```

At the moment `EVEN?` is compiled, `ODD?` does not exist yet. A name lookup cannot produce a CFA because there is no CFA to find.

There are three classic ways out:

| Strategy | Tradeoff |
|----------|----------|
| Require ordering | simple compiler, awkward programs |
| Add declarations | more syntax, better compile-time knowledge |
| Emit unresolved references | needs fixups, enables natural structure |

For a self-hosting Forth that wants retargetable codegen, unresolved references are the interesting path. They turn the compiler into a small linker.

<style>
  .post-content .gutter-section { position: relative; }
  .gutter-img-left,
  .gutter-img-right {
    position: absolute;
    top: 0;
    width: 72%;
    max-width: none;
    height: 100%;
    max-height: 100%;
    object-fit: contain;
    object-position: center;
  }
  .gutter-img-left { right: calc(100% + 1.25rem); }
  .gutter-img-right { left: calc(100% + 1.25rem); }
  @media (max-width: 900px) {
    .gutter-img-left,
    .gutter-img-right {
      position: static;
      display: block;
      width: 100%;
      max-width: 420px;
      margin: 0.5em auto 1em;
    }
  }
</style>

## Fixups Are the Linker Hiding in the Compiler

<div class="gutter-section" markdown="1">

<img src="{{ '/assets/images/posts/block-forth-spiral.webp' | relative_url }}" class="gutter-img-left no-invert" alt="">

When the compiler sees a reference to a word it cannot resolve yet, it can emit a placeholder and record a fixup:

| Field | Example |
|-------|---------|
| unresolved name | `ODD?` |
| use site | byte/cell offset inside `EVEN?` |
| relocation kind | call target, branch target, literal address |
| target profile | dev, runtime, debug-runtime |
| backend | COR24, WASM, RV32I, S/360 |

Later, when `ODD?` is defined, the linker pass patches every recorded use site.

This is not only for mutually recursive colon definitions. The same mechanism handles branch labels, separately compiled modules, runtime-image compaction, and target backends whose branch instruction cannot be encoded until the distance is known.

</div>

## Why This Belongs With the Composer

Part 4's composer decided which words survive into an image.

Part 5's composer has to decide where surviving words land, what unresolved references point to, and how target-specific relocation works.

That suggests one pipeline:

1. Parse and compile source into target-neutral operations.
2. Record unresolved words and labels as fixups.
3. Resolve names after each module or full source load.
4. Choose a profile: dev, runtime, debug-runtime.
5. Compact the dictionary for that profile.
6. Hand surviving operations and fixups to the target backend.
7. Emit the final artifact and a manifest of what was resolved.

The same manifest that makes dictionary compaction auditable also makes retargeting auditable. If a runtime image drops a word that a backend still needs, the build should fail with a name and a fixup site, not a mystery crash.

## Target Notes

This section needs measurements and examples from actual backend sketches.

### COR24

COR24 is the baseline: small, explicit, close to the current Forth image model.

Notes to fill in:

- direct-threaded vs subroutine-threaded options
- branch range and call encoding
- how much relocation state is needed for compacted runtime images

### WASM

WASM is structured, typed, and not just "assembly with different mnemonics."

Notes to fill in:

- structured control flow vs arbitrary branch labels
- stack machine overlap with Forth's data stack
- imports/exports for host integration

### RV32I

RV32I is useful because it forces the compiler to be honest about registers and memory.

Notes to fill in:

- stack pointer conventions
- immediate range limits
- call/return sequence

### S/360

S/360 is useful because it makes relocation and base registers visible.

Notes to fill in:

- base register setup
- literal pools
- condition code mapping

## What Comes Next

The next rabbit-hole after this one should probably stop talking about compiler structure and show an actual thin backend: take one tiny Forth source file, emit two target artifacts, and compare the fixup manifests side by side.

The composer idea only matters if it survives contact with a second target.
