---
layout: post
title: "Eigencube: Solving a Rubik's Cube with Linear Algebra, in APLSV and X_eTaL"
categories: [languages, programming-history, retrocomputing, math]
tags: [rubiks-cube, eigencube, linear-algebra, rotation-matrices, apl, aplsv, sw-apl, xetal, x-etal, array-languages, python, beam-search]
keywords: "Eigencube, Rubik's cube solver, linear algebra, rotation matrices, Rodrigues formula, cubelets as vectors, functional pearl, Steffen Smolka, 3Blue1Brown Essence of Linear Algebra, APLSV, (B) '75, sw-apl, sw-apl-workspaces, X_eTaL, batched matrix product, beam search"
abstract: "Steffen Smolka's Eigencube solves a Rubik's cube in under 400 lines of Python by treating it as linear algebra: each of 26 cubelets is an integer vector, its orientation a rotation matrix, and a turn one matrix product. This post follows the idea into two array languages: APLSV as it ran in 1975, through the sw-apl-workspaces library, and X_eTaL, where a whole batch of cubes is one array and every turn of every cube in a search is two matrix products."
series: "General Technology"
series_part: 5
date: 2026-10-08 00:15:00 -0700
repo_urls:
  - url: "https://github.com/smolkaj/eigencube"
    title: "eigencube (original, Python)"
  - url: "https://github.com/softwarewrighter/eigencube-fork"
    title: "eigencube-fork"
  - url: "https://github.com/sw-vibe-coding/sw-apl-workspaces"
    title: "sw-apl-workspaces"
---

<!-- DRAFT (2026-10-08). To do before publishing:
     - Screen captures: (1) the original's film or GUI; (2) APLSV RUBIK in sw-apl: SCRAMBLE, SHOW, SOLVE on the 2741 terminal;
       (3) X_eTaL: the cube solved, once the demo has output or a page. Placeholders below are marked [CAPTURE].
     - X_eTaL code lives today in an untracked X_eTaL-demos worktree (.claude/worktrees/eigencube, branch feat-xetal);
       the user said eigencube-fork. Confirm where it will be published, then link it.
     - X_eTaL port: defines the model, turns and beam search; nothing calls u:s_olve yet. Re-check before publishing.
     - APLSV RUBIK: turns are sticker permutations; EIGENCUBE is the geometry kernel it imports; SOLVE is a bounded
       iterative-deepening search (depth 6, 5,000 nodes). Re-check, the workspace changed several times on 10-08. -->

<img src="{{ '/assets/images/posts/block-rubiks-cube.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

Most Rubik's cube solvers are bookkeeping: 54 stickers in flat arrays, permutation tables, pattern databases of a hundred megabytes. Steffen Smolka's [Eigencube](https://github.com/smolkaj/eigencube) does it with linear algebra instead, in under 400 lines of Python, and credits the idea to 3Blue1Brown's *Essence of Linear Algebra*. Linear algebra is what array languages were built for, so this post follows the idea into two of them: APLSV as it ran in 1975, and X_eTaL, the typed array language I have been building.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The original** | [smolkaj/eigencube](https://github.com/smolkaj/eigencube) --- the Python functional pearl, and a 16-minute film that explains it |
| **The fork** | [softwarewrighter/eigencube-fork](https://github.com/softwarewrighter/eigencube-fork) |
| **APLSV** | [sw-vibe-coding/sw-apl-workspaces](https://github.com/sw-vibe-coding/sw-apl-workspaces) --- the RUBIK and EIGENCUBE workspaces, run by [sw-apl](https://github.com/sw-vibe-coding/sw-apl) |
| **X_eTaL** | [Array Languages #1: X_eTaL](/2026/10/07/array-languages-xetal/) |
| **Earlier** | [TBT #12: the IBM 5100's APLSV](/2026/09/24/tbt-aplsv-birds-tttml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## The idea: cubelets are vectors

Put the cube's core at the origin. Each of the 26 visible cubelets has a home address, an integer vector c with coordinates in {−1, 0, 1}. Its 1-norm, |x| + |y| + |z|, is how many stickers it has: 1 for a center, 2 for an edge, 3 for a corner. The six centers never move, so they are the colors: ±x, ±y, ±z, each an eigenvector of the turns around it, which is where the name comes from.

The state is one rotation matrix R per cubelet, and the cubelet sits now at R c. A move turns the face whose outward axis is v: every cubelet with v · (R c) > 0 is in that face, and its R becomes M R, where M is the quarter-turn matrix. The cube is solved when every R leaves its cubelet's stickers where they belong. That is the whole model: vectors, a dot product to select a face, and matrix products to turn it.

The original's solver is a multi-phase A\* search that works layer by layer, as a person would, with no precomputed databases.

<!-- [CAPTURE] the original: a frame from its film, or its GUI solving a cube -->

</div>

<div class="clearfix" markdown="1">

## APLSV, 1975

APLSV ran on the IBM 5100 the year it shipped, and sw-apl's (B) '75 mode runs it now. The [sw-apl-workspaces](https://github.com/sw-vibe-coding/sw-apl-workspaces) library has two workspaces for this, each running in both of sw-apl's modes.

**EIGENCUBE** is the geometry kernel, in the original's terms. The 26 cubelets come from base-3 encoding all 27 points and compressing away the hidden center, and a turn is a matrix product with exact integer quarter-turn matrices:

```text
CUBE←⍉((⍳27)≠14)/¯1+3 3 3⊤¯1+⍳27

∇R←M GEOTURN P
R←P+.×⍉M
∇
```

**RUBIK** is the playable cube. It draws a letter net that works on the 2741 terminal and in the browser, and it takes the classic approach for the turns themselves: 54 stickers, each face turn one permutation, with the EIGENCUBE geometry copied in. `)LOAD 2 RUBIK`, then `SCRAMBLE 3`, `SHOW`, `STEP`: each step undoes one recorded turn and prints the net. `SOLVE` ignores the history and searches the current stickers, to a depth of six and at most 5,000 positions, saying `SEARCH BUDGET EXHAUSTED` rather than running forever. The workspace is careful to call that a bounded search, not a general solver.

<!-- [CAPTURE] sw-apl on the 2741 terminal: )LOAD 2 RUBIK, SCRAMBLE 3, SHOW, SOLVE -->

Side by side, the two workspaces are the contrast this post is about: the sticker model a 1975 programmer would reach for, and the geometric one the Eigencube makes possible, in the same language.

</div>

<div class="clearfix" markdown="1">

## X_eTaL: a batch of cubes is one array

The X_eTaL port goes further than the original in one direction: it never handles one cube at a time. A batch of n cubes is one array of shape n × 26 × 3 × 3, a rotation matrix for every cubelet of every cube. The cubelets come out the same way as in APL:

```text
C ← (0 < '+ r̲/₂ a̲bs pts) r̲eplicate pts
```

The twelve quarter-turn matrices are built rather than typed in, from Rodrigues' formula: a quarter turn about axis v is v vᵀ minus the cross-product matrix of v, with the sign flipped for the other direction. All twelve are computed in one expression and stacked into a single 36 × 3 matrix:

```text
Mf ← (((3 r̲eplicate 1 2 3) s̲elect₂ V) × (9 r̲eshape 1 2 3) s̲elect₂ V) − (12 9 r̲eshape 9 r̲eplicate dir) × V '+ '× i̲nner E
M ← 36 3 r̲eshape Mf
```

and then every turn of every cube in the batch is one inner product with that stack, between two transposes that line the axes up:

```text
ᵘt̲urns ← { R →
  n ← t̲ally R
  1 3 2 4 t̲ranspose (12 3 c̲at n c̲at 3) r̲eshape M '+ '× i̲nner 2 1 3 t̲ranspose R
}
```

That is where an array language pays off. A search keeps a beam of candidate cubes; expanding the beam by every possible move is the same few lines whether the beam holds one cube or a thousand. The solver is a staged beam search on top of that, scoring each candidate by which cubelets are home.

<!-- [CAPTURE] X_eTaL: the solved cube, or the move list, once the demo runs end to end (and its page, if it gets one) -->

The port is in progress as this is written: the model, the turns and the search are there, and the demo that runs them end to end is not yet published.

</div>

## Three languages, one idea

The idea survives every translation because it is mathematics, not code: vectors for places, matrices for turns, a dot product to pick a face. What changes is how much of the bookkeeping each language makes you write. Python spells the loops. APLSV in 1975 already had the inner product and the encode that the geometry needs, though the playable workspace still turns stickers. And X_eTaL lets the batch, not the cube, be the unit, so the search expands every candidate in one product.
