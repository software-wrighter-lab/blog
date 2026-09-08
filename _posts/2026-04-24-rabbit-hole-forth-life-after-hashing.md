---
layout: post
title: "Rabbit-hole #3: FORTH --- Life After Hashing"
date: 2026-04-24 00:15:00 -0700
categories: [rabbit-hole, programming-languages, forth, deep-dive]
tags: [rabbit-hole, forth, cor24, dictionary, find, lookup-cache, numeric-fast-path, recent-hit-cache, hot-token-cache, instrumentation, optimization, self-hosting]
keywords: "Forth, FIND, lookup optimization, numeric fast path, recent-hit cache, circular buffer, hot-token cache, top-K cache, instrumentation, source lookup count, execution count, dictionary, COR24, sw-cor24-forth, forth-from-forth"
author: Software Wrighter
abstract: "Phase 4 of the COR24 Forth ships without the XMX hash. What replaces it? A layered set of cheap optimizations --- numeric fast path, recent-hit cache, hot-token cache --- that target the interactive hot path without rebuilding the hash subsystem. Plus the instrumentation you need to know which words to actually cache."
series: "Down the Rabbit-Hole"
series_part: 3
repo_url: "https://github.com/sw-embed/sw-cor24-forth"
demo_url: "https://sw-embed.github.io/web-sw-cor24-forth/"
---

<img src="{{ '/assets/images/posts/block-armed-rabbit-with-bow.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

Second FORTH post in the rabbit hole. [Part 1](/2026/04/23/rabbit-hole-deep-dive-forth-find-cost-of-a-name/) explained why phase 4 (`forth-from-forth`) is deleting the XMX hash and the 256-bucket table along with the asm `do_find` that used them. This post answers the obvious follow-up: **if not a hash, then what?** Because "no optimization" isn't quite right either. FIND still runs thousands of times during bootstrap and source loading. The asm-era tools are gone, but the interactive hot path deserves something.

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Play in Browser** | [COR24 Forth Demo](https://sw-embed.github.io/web-sw-cor24-forth/) |
| **Kernel Repo** | [sw-embed/sw-cor24-forth](https://github.com/sw-embed/sw-cor24-forth) |
| **Prior post** | [Rabbit-hole #2: FORTH --- FIND and the Cost of a Name](/2026/04/23/rabbit-hole-deep-dive-forth-find-cost-of-a-name/) |
| **Overview post** | [Embedded #3: Self-Hosting Spectrum](/2026/04/20/embedded-forth-self-hosting-spectrum/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The Post-Hash Toolbox

Three optimizations, all cheaper than a hash, all written in pure Forth. None of them require a side table, none require touching dictionary headers, none require boot-time setup. Each one trades a little code for a better hit rate on the patterns that actually show up in source files.

| Optimization | Cost | Hit pattern |
|--------------|------|-------------|
| **Numeric fast path** | ~5 lines of Forth | Any token starting with a digit or `-<digit>` |
| **Recent-hit cache** (N entries) | ~10 lines + N × 2 cells of memory | Tokens repeated within a short window |
| **Hot-token cache** (top-K) | ~20 lines + K × 2 cells + some accounting | The handful of names that appear 100s of times |

They're orthogonal. You can ship any one, any two, or all three. The order below is the order I'd install them in: each next one is a little more work for a little more payoff.

## Optimization 1: Numeric Fast Path

Every `.fth` source file has numbers in it. In the all-asm INTERPRET, each number makes FIND walk the dictionary, fail to find a match, and *then* fall through to NUMBER. That's wasted work --- you can tell by the first character that no dictionary word will match.

The fix is a one-line pre-check at the top of INTERPRET:

```forth
: INTERPRET
    WORD DUP C@                   \ token (addr len) first-char
    [CHAR] 0 [CHAR] 9 WITHIN
    IF  NUMBER  EXIT  THEN        \ starts with a digit — skip FIND
    ... (normal FIND path) ...
;
```

*(Handle `-<digit>` with one more check. Handle `$` or `0x` hex prefix if your Forth takes those.)*

On a `.fth` source file like `examples/fib.fth`:

```forth
: FIB ( n -- n' )
    DUP 2 < IF EXIT THEN
    DUP 1- RECURSE
    SWAP 2- RECURSE
    + ;
```

The tokens `2`, `1-`, `2-` all start with digits (well, `1-` and `2-` *look like* numbers until the dash is consumed and the remaining part doesn't parse --- some Forths special-case `1-` as a word anyway; take the simple path and let FIND confirm after the numeric parse fails). The main point: literal numbers like `2` get a direct routing to NUMBER and skip FIND entirely.

**Measurement shape.** On the COR24 core loading `examples/*.fth`, numeric tokens are ~20% of the input stream. Fast-pathing them avoids the equivalent fraction of dictionary walks. One branch, huge payoff.

**Caveat.** If your Forth lets words start with digits (`2dup`, `2drop`, `4th`), the fast path has to fall back to FIND on "might-be-a-word" failures. In practice that means: try NUMBER first, and if NUMBER rejects the whole token, *then* FIND it. The rejection is fast --- NUMBER aborts on the first non-digit.

## Optimization 2: Recent-Hit Cache

The circular-buffer design. Keep the last N successful `(hash, cfa, flags)` tuples --- call it 8 or 16 entries. Every FIND first probes the circular buffer by hash; on hit, return immediately. On miss, walk the dictionary, then insert the result into the next slot of the buffer (overwriting the oldest).

Rough structure in Forth:

```forth
16 CONSTANT RECENT-SIZE
CREATE recent-hash  RECENT-SIZE CELLS ALLOT
CREATE recent-cfa   RECENT-SIZE CELLS ALLOT
CREATE recent-flags RECENT-SIZE CELLS ALLOT
VARIABLE recent-next   \ index where the next insert lands

: recent-lookup ( h -- cfa flags | 0 0 )
    RECENT-SIZE 0 DO
        DUP recent-hash I CELLS + @ =
        IF  DROP
            recent-cfa   I CELLS + @
            recent-flags I CELLS + @
            UNLOOP EXIT
        THEN
    LOOP  DROP 0 0 ;

: recent-insert ( h cfa flags -- )
    recent-next @  >R
    R@ recent-flags + !
    R@ recent-cfa   + !
    R@ recent-hash  + !
    recent-next @ 1+  RECENT-SIZE MOD  recent-next ! ;
```

A FIND now becomes:

```forth
: FIND  ( addr len -- cfa flags )
    hash-name recent-lookup  ?DUP IF EXIT THEN  DROP
    dict-walk  ( returns cfa flags or 0 0 )
    DUP IF  \ found — remember it
        2DUP hash-name -ROT recent-insert
    THEN ;
```

Where `hash-name` is a *cheap* hash (just XOR the first 3 characters, for example) --- the full XMX is overkill here because we only need to distinguish N=16 candidates, not partition 256 buckets.

**Why it works.** Temporal locality. In a typical `.fth` block:

```forth
: SQUARE DUP * ;
: CUBE DUP SQUARE * ;
: FOURTH SQUARE SQUARE ;
```

`DUP`, `*`, `SQUARE`, and `;` each get looked up multiple times within a few-token window. The recent-hit buffer catches all of it. Buffer size N=8 is enough for most Forth source; N=16 is generous.

**Cost.** `N × 3 cells ≈ 72 bytes` for a 16-entry cache on COR24 (3-byte cells). Linear scan of 16 entries is ~48 COR24 instructions worst case, fewer on hit. Compare to a hash-table miss walking a chain of 15 — the circular buffer wins whenever the hit rate is above ~25%.

## Optimization 3: Hot-Token Cache

The recent-hit cache catches *local* repetition. What it misses: tokens that appear in many different contexts — `DUP`, `!`, `@`, `IF`, `;`. These words show up hundreds of times across a full core-loading pass, but rarely in back-to-back tokens. The recent buffer evicts them between hits.

The hot-token cache handles that shape. Top-K by frequency. K is small --- 4 or 8 entries is plenty --- because Forth's name distribution is severely top-heavy: the top 10 words typically account for 40--60% of all lookups in a core.

Structure is essentially the recent cache plus frequency counters:

```forth
8 CONSTANT HOT-SIZE
CREATE hot-hash  HOT-SIZE CELLS ALLOT
CREATE hot-cfa   HOT-SIZE CELLS ALLOT
CREATE hot-flags HOT-SIZE CELLS ALLOT
CREATE hot-count HOT-SIZE CELLS ALLOT
```

On every dictionary walk that finds a word:
- Increment the count for that word's bucket.
- If any bucket's count exceeds the minimum in the top-K, promote the new entry and evict the former minimum.

Lookup probes the hot cache *first*, then the recent cache, then does the dictionary walk.

**Why it works.** Forth's word-frequency distribution is Zipf-like. The top 8 names cover roughly half of all lookups in a typical `.fth` corpus; the top 32 cover nearly all of them. A tiny K-wide cache pins the most-frequent names in place regardless of temporal locality.

**Pitfall.** If you promote aggressively on every increment, the top-K churns on early workloads before settling. Add a small hysteresis (only promote when the count exceeds the minimum by some margin), or seed the cache after a profiling pass has accumulated stable counts.

## The Instrumentation Question

You can't build the hot-token cache honestly without counting. And the counter has to count the **right** thing.

There are three plausible counts, and they're **not the same**:

| Counter | What it measures | Useful for |
|---------|------------------|------------|
| **Source-interpret count** | How often a name is looked up while reading `.fth` source in interpret mode | Tuning the recent cache for REPL use |
| **Source-compile count** | How often a name is looked up while reading `.fth` source in compile mode | Tuning the recent/hot cache for `.fth` loading |
| **Runtime execution count** | How often a compiled word runs | Dictionary reordering, inlining decisions |

Naive instrumentation counts *executions* because that's what's easy to hook into `NEXT`. But execution count is wrong for lookup optimization. `DUP` may execute millions of times inside compiled loops but only be looked up a few dozen times during source-reading. What you want to cache is the lookup pattern, not the runtime pattern.

That distinction matters even more for phase-4-style systems that will eventually drop the interpreter entirely in production builds. Lookup frequency is a *boot-time* cost. Execution frequency is a *runtime* cost. Different optimizations target different costs.

## Why Linear Walk + Cache Often Beats Hash

Adding up the options against the phase 2 hash:

- Numeric fast path: zero collision risk, saves the 20% of tokens that are numbers.
- Recent-hit cache: catches local repetition, which is the dominant lookup pattern in structured Forth code.
- Hot-token cache: catches global high-frequency names --- the "Zipf tail" that's always hot.

Three orthogonal wins, none of which need:
- A 768-byte bucket table.
- A second link field in every dictionary entry.
- Boot-time hash population.
- CREATE-time bucket splicing.
- Re-implementing any of that in high-level Forth.

The hash was a *general* answer to *amortize all FIND cost via bucket distribution*. The layered caches are *specific* answers to the *specific* patterns that happen in real Forth code. Specific answers are usually cheaper when the patterns are well-understood --- and Forth's patterns are very well-understood, because the language has been alive for 50 years and its word-frequency distributions don't really change.

The classic rule of thumb applies: **optimize the actual workload, not the worst case**. A hash protects you against adversarial inputs and dictionaries thousands of words deep. A layered cache protects you against the real workload of a few hundred words and strong locality. For a bootstrapping Forth, the real workload is the only workload.

## The "Good Enough" Threshold

Here's the pragmatic shape of the decision:

| Workload | What to ship |
|----------|--------------|
| Just loading a small core (~50 words, one pass) | Linear walk, nothing else |
| Full core + extended `.fth` library (~200 words) | Add numeric fast path |
| Interactive REPL + `.fth` loading | Add recent-hit cache (16 entries) |
| Profiling shows unbalanced hot words | Add hot-token cache (8 entries) |
| Dictionary exceeds 500 words, lookup dominates | Revisit: first-char bucket or XMX |

The insight from phase 2's hash work was that *the threshold for "hash is worth it"* turned out to be a larger dictionary than COR24 Forth actually has. Phase 4 takes that insight seriously: don't carry the hash subsystem if the actual workload doesn't need it. Install the cheap wins. Measure. Only reach for heavier mechanism if measurement shows the cheap wins ran out.

## What's Next

The layered caches make lookup *fast*. The next rabbit-hole post asks a different question: *can we make lookup go away entirely?* Dictionary compaction, shadowed-word removal, splitting development images from production images --- the point where "optimize FIND" becomes "eliminate FIND for this deployment". That's *Rabbit-hole #4: FORTH --- Dictionary Compaction and Specialized Images*.

---

*Forth's patterns are stable because Forth is old. Optimization strategies that assume stable patterns pay off handsomely. Optimization strategies that assume adversarial inputs carry weight you don't need.*
