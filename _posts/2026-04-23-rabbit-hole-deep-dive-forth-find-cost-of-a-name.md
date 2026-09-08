---
layout: post
title: "Rabbit-hole #2: FORTH --- FIND and the Cost of a Name"
date: 2026-04-23 00:15:00 -0700
categories: [rabbit-hole, programming-languages, forth, deep-dive]
tags: [rabbit-hole, forth, cor24, dictionary, find, hashing, xmx, lookaside-cache, interpret-mode, compile-mode, self-hosting]
keywords: "Forth, FIND, dictionary lookup, XMX hash, 2-round XMX, lookaside cache, interpret mode, compile mode, COR24, sw-cor24-forth, forth-in-forth, forth-on-forthish, forth-from-forth, dictionary header, colon definition, staged optimization"
author: Software Wrighter
abstract: "A rabbit hole on FORTH, following the phase-4 direction set out in the self-hosting spectrum post. Dictionary lookup is the price Forth pays for readability: this post walks through what FIND does, how the all-asm kernel made it fast with a 2-round XMX hash and a 1-entry lookaside cache, and why phase 4 (forth-from-forth) is dropping the whole subsystem now that FIND lives in high-level Forth."
series: "Down the Rabbit-Hole"
series_part: 2
repo_url: "https://github.com/sw-embed/sw-cor24-forth"
demo_url: "https://sw-embed.github.io/web-sw-cor24-forth/"
---

<img src="{{ '/assets/images/posts/block-rabbit-hole-watch.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

First FORTH post in this rabbit hole --- more are planned. The [self-hosting spectrum post](/2026/04/20/embedded-forth-self-hosting-spectrum/) laid out four phases (all-asm kernel → forth-in-forth → forth-on-forthish → forth-from-forth) and caught the project mid-stride: phase 2 shipped, phase 3 with its first subsets just landing, phase 4 still on the horizon.

**Since then, phase 3 has completed** --- `forth-on-forthish` finished subsets through 21, pulling `WORD`, `FIND`, `NUMBER`, `INTERPRET`, and `QUIT` into Forth and leaving ~22 irreducible assembly primitives. That moves the project's active edge onto phase 4, `forth-from-forth` --- a Forth-hosted cross-compiler that emits the kernel's `.s` file as a build artifact. Working toward it surfaced a set of design questions that don't fit in a single post: how lookup really works, what to optimize once the asm `do_find` goes away, how to build specialized images, whether to structure the system as a composer, how to retarget the codegen. Each of those is a rabbit hole of its own, and this post is the first.

This post goes one level deeper on the single operation that gets executed more than any other during bootstrap, source loading, and the REPL: **dictionary lookup**.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Play in Browser** | [COR24 Forth Demo](https://sw-embed.github.io/web-sw-cor24-forth/) |
| **Kernel Repo** | [sw-embed/sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth) |
| **Web Demo Repo** | [sw-embed/web-sw-cor24-forth](https://github.com/sw-embed/web-sw-cor24-forth) |
| **WASM Side-Experiment** | [sw-vibe-coding/sw-fth-wasm](https://github.com/sw-vibe-coding/sw-fth-wasm) |
| **Prior Post** | [Embedded #3: Self-Hosting Spectrum](/2026/04/20/embedded-forth-self-hosting-spectrum/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What FIND Does

FIND is the operation that turns a name into something you can execute. Given a word like `DUP`, it walks the dictionary and returns the address of the entry --- the code field address, or **CFA** --- along with whether the word is IMMEDIATE (needs to run during compilation) or normal.

If that sounds simple, remember the frequency. Every token the REPL reads. Every word in every `.fth` file loaded at boot. Every reference inside a colon definition as it's being compiled. FIND runs thousands of times before you see the first prompt.

That's why it's an obvious target for optimization. It's also why it's a trap: optimizing it changes the shape of the dictionary, and the dictionary is touched by almost everything.

## Two Worlds: Interpret Mode and Compile Mode

Before getting into FIND's internals, the crucial split: **FIND gets called from two different contexts, and they use the result differently.**

In **interpret mode**, the outer loop (`QUIT` in classic Forth) is doing the hot thing you expect:

1. Read a token with `WORD`.
2. Call `FIND` on it.
3. If found, `EXECUTE` the CFA --- the word runs *now*.
4. If not found, try `NUMBER` --- if it parses, push the value.
5. If neither, fail.

In **compile mode** (triggered by `:` which flips `STATE` to non-zero), the outer loop does something subtly different:

1. Read a token with `WORD`.
2. Call `FIND` on it.
3. If found, check the IMMEDIATE flag.
    - IMMEDIATE words execute *now* (e.g. `;`, `IF`, `THEN`).
    - Normal words get **compiled** --- their CFA is written into the growing definition, not executed.
4. If not found, try `NUMBER` --- compile as a literal.

The key point: **compilation doesn't skip FIND.** In fact compilation calls FIND *more* --- once per token in the source definition. Optimizing lookup helps compile-time as much as it helps interactive REPL use. And on a bootstrapping Forth, almost everything is compile-time, because loading `.fth` files is one long colon-definition parade.

## Walkthrough: `5 DUP .` in Interpret Mode

Three tokens, three different shapes of work:

```
Token   FIND result          NUMBER   Action
-----   ------------------   ------   --------------------------
5       not found            → 5      push 5
DUP     found, not immediate  —       execute DUP (duplicates TOS)
.       found, not immediate  —       execute . (pops and prints)
```

Stack evolution, with `|` separating layers:

```
Start:                 (empty)
After 5:               5
After DUP:             5 5
After .:               5           (prints "5")
```

The outer loop runs FIND three times. Twice it hits. Once it misses and falls through to NUMBER. Every token is an independent lookup.

## Walkthrough: `: SQUARE DUP * ;` in Compile Mode

Same shape of work, different consumer:

```
Token    FIND result                    Action
------   ----------------------------   ------------------------
:        found, IMMEDIATE-like           run : (create header,
                                         flip STATE to compile)
SQUARE   (:  reads the next token as a
          name, not as a dictionary lookup — SQUARE is the new word)
DUP      found, not immediate            COMPILE DUP's CFA into body
*        found, not immediate            COMPILE *'s CFA into body
;        found, IMMEDIATE                run ; (compile EXIT, flip
                                         STATE back to interpret)
```

After this, `SQUARE`'s body in the dictionary looks like:

```
DOCOL | <DUP's CFA> | <*'s CFA> | EXIT
```

When `5 SQUARE .` runs later, the interpreter pushes `5`, finds `SQUARE`, executes it. Inside `SQUARE`, the inner loop (`NEXT`) walks the compiled CFAs one at a time. **No FIND happens at runtime.** The names `DUP` and `*` were resolved once, at compile time, and baked into the body as direct CFA references.

This is the core insight that drives all the lookup-optimization decisions: **FIND's cost is concentrated in the text-reading phase, not in running compiled code.** Once a definition is compiled, the cost is gone forever.

## The All-Asm FIND: Linear Walk

The reference phase-1 kernel does FIND the obvious way --- walk the LATEST chain backwards, compare names, return the first hit. A Forth dictionary entry header looks like:

```
link (3B)   → flags|namelen (1B)   → name (N bytes)   → CFA
```

Walking is simple:

```
cursor = LATEST
while cursor != 0:
    length = (cursor + 3) & 0x1F     ; strip flags
    if length == target_length and
       memcmp(cursor + 4, target_name, length) == 0:
        return cursor + 4 + length   ; CFA
    cursor = *cursor                  ; next link
return 0  ; not found
```

On a dictionary of ~50 words, average hit is ~25 comparisons. Each comparison is a length check plus a short string compare. Fast enough for one-off tokens. Painful when you're loading `highlevel.fth` and every line has six tokens that each need resolution.

Bootstrap timing on the web demo showed this clearly: the all-asm kernel would spend a full second or more just parsing its own Forth core on a slow laptop. Visible lag. Time to speed it up.

## The Phase 2 Optimization: 2-Round XMX Hash

The first real optimization added a hash table. Three pieces working together:

**1. A hash function.** 2-Round XMX, chosen because it fits COR24's 24-bit native arithmetic:

```
h = 0
for each byte c of the name:
    h = h XOR c
    h = h * 0xDEADB5        ; 24-bit multiply, naturally truncates
    h = h XOR (h SRL 12)    ; avalanche: fold high half into low half
bucket = h AND 0xFF
```

Each step is cheap on COR24:
- `XOR` and `SRL` are single cycles.
- The `* 0xDEADB5` is a 24-bit multiply whose overflow is discarded for free (it's the word size).
- `AND 0xFF` is a byte mask.

The shift-by-12 is doing the real work. XMX (*xor-multiply-xor*) hashes need an avalanche step so that 1–3 character names like `@`, `!`, `DUP` produce well-distributed bucket indices. Without the shift, short names cluster badly. With it, short names are indistinguishable from long ones, from the hash's point of view.

**2. A hash table.** 256 buckets, 3 bytes each, 768 bytes total. Each bucket holds a pointer to the most-recent dictionary entry whose name hashes into that bucket.

**3. A per-entry hash chain.** Every dictionary entry grew a *second* link, independent of the chronological `link` field. This one points to the next-older entry in the same hash bucket.

Lookup becomes:

```
h = xmx(name)
bucket = h AND 0xFF
cursor = hashtab[bucket]
while cursor != 0:
    if name matches entry:
        return cursor.cfa
    cursor = cursor.hash_link   ; NOT the LATEST link
return 0
```

On the real dictionary, this cut linear-scan collisions from 47 (average walk depth) down to 11--15 per bucket. Measurably faster. Boot dropped from ~2 seconds to under one. The hashing work document in the repo profiles the distribution in detail.

## The Phase 2 Optimization, Part 2: Lookaside Cache

Even with hashing, one pattern remained: `DUP DUP DROP`, `SWAP OVER +`, the same few names repeated in tight succession during source loading. For those, even one hash-plus-bucket-walk is waste.

The cache is a 1-entry lookaside holding the most recent successful lookup as a tuple:

```
(hash, cfa, flags)
```

The memento is keyed by the full XMX hash, not by the name --- hashing is already cheap, and comparing a 24-bit value is one instruction. On a hit, the lookup short-circuits before even dereferencing the hash table.

```
h = xmx(name)
if h == cache.hash:
    return (cache.cfa, cache.flags)
; otherwise normal hash lookup, then update cache on success
```

One entry is enough because Forth source has strong temporal locality --- when you see `DUP` once, you'll see it again in the next few tokens more often than not. The cache doesn't pretend to solve the general working-set problem; it just skips the table lookup on the very-hottest path.

## Why Phase 4 Is Dropping All of It

Phase 4 (`forth-from-forth`) builds the kernel via a Forth-hosted cross-compiler. One of its design goals: no hand-written `.s` file in the source tree. Everything comes from Forth.

That means FIND itself moves to Forth. The high-level FIND in `highlevel.fth` already exists --- it's a plain linear walk. No hash. No lookaside cache. No second link in dictionary entries.

Against that, the hashed FIND looks like dead weight:

| Cost | What you'd need to keep |
|------|------|
| 768 bytes of bucket table | Boot-time setup code to zero and populate it |
| ~40 instructions of `compute_hash` | Re-implement in Forth (or keep in asm, which contradicts the goal) |
| Per-entry hash link | Extra 3 bytes on every dictionary entry |
| CREATE-time splice | Every new word has to hash itself and thread into the right bucket |
| Boot population | Run compute_hash on every existing word at startup |

The only customer of all this mechanism was the asm `do_find`. Phase 4 deletes `do_find`. The customer is gone.

And boot *already* fits under a second without the hash, because the web demo's adaptive pump-loop optimization ([commit f757800 in web-sw-cor24-forth](https://github.com/sw-embed/web-sw-cor24-forth)) did the work from a different direction. The hash was solving a visible problem; once the pump-loop fixed the problem, the hash was solving nothing.

## The Staged-Optimization Lesson

The phase 4 plan doesn't say "drop hashing and never look back." It says this:

> Fallback order if "no hash" turns out wrong: linear walk → first-char hash (one-instruction, 2--3× speedup, 47 collisions) → 2-Round XMX (proven winner, 15 collisions, ~10 instructions/char). Don't jump straight to XMX on speculation.

Three graded fallbacks, in order of complexity added. Each one you only reach for if the previous one proved insufficient under measurement. The XMX hash is fine engineering --- it's well-matched to COR24, the avalanche step is well-chosen, the collision count is low. But it's also a **complete subsystem**: function + table + per-entry link + CREATE-time maintenance + boot-time initialization.

The instinct that led to adding it in phase 2 --- *FIND is in the hot path, therefore FIND should be hashed* --- was correct for that phase. The instinct that says *keep what works* is wrong for phase 4, because the customer is leaving. The right instinct is: **when the caller changes, re-evaluate the callee**.

Said another way: the XMX hash was the right answer to the question *"how do we make the asm do_find faster?"*. It is not automatically the right answer to *"how do we make high-level Forth FIND faster?"* --- because the question has a different shape now. FIND is in Forth. The dictionary is walked by Forth. Anything you add, you add to Forth. And linear walks through a reverse-chronological list are Forth's natural shape.

## What's Next

Phase 4 ships without the hash. But that doesn't mean nothing gets optimized --- it means the *kinds* of optimizations change. Numeric fast paths. Recent-hit caches. Hot-token caches. Instrumentation to know which words actually matter. That's the subject of the next post in this rabbit hole: *Rabbit-hole #3: FORTH --- Life After Hashing*.

---

*If you've been reading this on the [web demo](https://sw-embed.github.io/web-sw-cor24-forth/), switch to the **forth-on-forthish** tab and type `WORDS` --- every word printed there was looked up during boot.*
