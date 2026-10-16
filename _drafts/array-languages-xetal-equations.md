---
layout: post
title: "Array Languages #11: Math Equations as X_eTaL Macros"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, macros, machine-learning, einsum, convolution, latex, notation]
keywords: "X_eTaL equation macro, math notation in an array language, ML equations as code, CNN triple sum, cross-correlation, einsum, sum notation, LaTeX from code, macros instead of syntax"
abstract: "Eleventh in the Array Languages series, a design before the code: macros that take an equation as an ML paper prints it, a CNN's triple sum for one, and give back the array computation, its LaTeX, or both. No change to the language: the point is to find out how far macros can carry ML notation before any new syntax is justified."
series: "Array Languages"
series_part: 11
date: 2026-10-17 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT, A PLAN (2026-10-15): from X_eTaL Saga 41, spatial equations. Committed: docs/spatial.md (the call, lowering, errors,
     expected outputs), docs/eq-rationale.md (seven ways to write the call), docs/spatial-equations-review.md, docs/type-check-macros.md,
     docs/spatial-poc/ (proof of concept, old call syntax, checked against an oracle), spec/spatial/; decisions 3a72ef94 (D154).
     Pipelines (e:p_ipe<, D155, committed 3fad8892 on 10/15, with raw strings ST4) were split out to #12 (_drafts/array-languages-xetal-pipelines.md) per Mike.
     Rechecked 10/16 evening: no X_eTaL commits since 71e074d3 (10/15 14:49); raw strings (step 100) in progress, uncommitted;
     demos/spatial/ still absent; steps 102 oracle, 103 capture, 104 lowering, 105 latex, 107 shape lint pending; 101 integrals plan pending.
     NOTE: docs/plan.md rows 4-5 still name the pre-D154 macros (e:s_um<, "e:q_< (the pair)"); docs/spatial.md (D154) is followed here.
     The library itself (demos/spatial/) is NOT written yet: no claims that it runs; the numbers below are the proof of concept's.
     Date provisional (after #10 on Friday 10/16). Lead image: Mike's chalkboard of the stable softmax, not inverted, not transparent. -->

<img src="{{ '/assets/images/posts/block-chalk-softmax.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) ended with a CNN's triple sum and a question: what notation could say it in one line? [Post #5](/2026/10/11/array-languages-xetal-ml/) said experiments were under way with macros for ML equations. This is the design they produced: write the equation as the paper prints it, and get the array code, the LaTeX, or both, from one macro call, with no change to the language.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The design** | [docs/spatial.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/spatial.md) --- the call, the lowering, the errors, the expected outputs |
| **Why this call** | [docs/eq-rationale.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/eq-rationale.md) --- seven ways to write it, compared |
| **The thread** | [ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) · [Array Languages #5: X_eTaL-ML](/2026/10/11/array-languages-xetal-ml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## Macros first, syntax only when justified

An ML-focused language could add notation for sums to its grammar. The approach here is the opposite. X_eTaL's macros are functions from source text to source text, and the bet is that they are a sufficient mechanism to express ML concisely and idiomatically, so the grammar changes only when a change is justified. This work is the test of that bet, and it is deliberately a library on the language as it is: nothing in the compiler changes for the equations.

## An equation, as the paper prints it

The running example is the 2D convolution a CNN computes, a cross-correlation, written as a triple sum over input channels and kernel rows and columns:

```text
Y[o,h,w] = sum_{c=0}^{C-1} sum_{r=0}^{Kh-1} sum_{s=0}^{Kw-1} X[c,h+r,w+s] W[o,c,r,s]
```

As a macro call it reads almost the same:

```text
Y ← "Y[o,h,w] | O Ho Wo" ᵉq̲< "sum c:=0..C - 1, sum r:=0..Kh - 1, sum s:=0..Kw - 1 | X[c,h+r,w+s] * W[o,c,r,s]"
```

The left string names the result, its free indices, and one extent for each, so the result has shape `O Ho Wo`; extents are written, never guessed. The right string is the sums, outermost first, each an operator word, an index and an inclusive range, then the summand after the bar. Inside the strings the notation is the paper's: math precedence, brackets for indexing, and indices counted from 0 as the paper counts them.

Three macros parse the same text the same way:

| Macro | Gives |
|---|---|
| `e:q_<` | the value, the array |
| `e:t_ex<` | the LaTeX, a string |
| `e:b_oth<` | both, as a pair |

So the value and its typeset equation always describe the same thing. For the CNN call the LaTeX is:

```text
Y_{o,h,w} = \sum_{c=0}^{C - 1} \sum_{r=0}^{Kh - 1} \sum_{s=0}^{Kw - 1} X_{c,h+r,w+s} \, W_{o,c,r,s}
```

## What it becomes

The macro writes ordinary X_eTaL, and `xetal expand` shows it. A grid of coordinates is built over the free and summed indices; each array reference becomes a gather, its index expressions evaluated on that grid; and each sum becomes one reduction along its axis, innermost first. There are no loops in the result, just array operations, which is the same shape the GPU work in [post #7](/2026/10/13/array-languages-xetal-gpu/) lowers to kernels.

Mistakes are caught where they can be. A malformed range, an index summed twice, or a summand index that is neither summed nor free is rejected when the macro expands. An index that runs outside its array is a run-time error that names the array, the axis, the index and the expression it came from, never a silent wrong read:

```text
error[index]: X axis 2: index 5 is outside 0..3 (from h+r)
```

## Checked before it is built

The library itself is not written yet. A proof of concept, in an earlier form of the call, already runs, and its outputs were checked against an independent version written by hand; they become the library's tests. One fixture: `X` of 2 by 4 by 4 holding 0 to 31 and `W` of 1 by 2 by 2 by 2 holding 0 to 7 give a 1 by 3 by 3 result:

```text
560 596 632
704 740 776
848 884 920
```

Two more are pinned the same way: all ones, where every element is 8, and one with two output channels, three input channels and a 2 by 3 kernel on 5 by 6 pictures, giving a 2 by 4 by 4 result.

The call's form was not the first idea. The design compares seven ways of writing it, judged on whether a reader can see which bound goes with which index, whether different operators can mix, what a plausible slip does, how close it stays to the paper, and whether it works with no compiler change. The worst outcome is a slip that gives a silent wrong answer, and the chosen form, a binding per sum, was picked largely to rule those out.

</div>

<div class="clearfix" markdown="1">

## What comes next

The library is built in a fixed order, each step with its tests first. First an oracle, an independent version of the convolution written with rotations, a transpose and one inner product, which must reproduce the three fixtures. Then reading the call: splitting its strings, pairing each sum's bounds with its index, and rejecting a malformed call when it expands. Then the lowering, the grids, gathers and reductions above, which must match the oracle. Then the LaTeX, from the same parse, checked by a typesetter. After that come the parts deliberately left out for now: padding, strides and dilation for convolutions, and a shape check that catches a wrong shape before a program runs rather than after. Anything a macro cannot cover is reviewed and decided, never assumed.

Sums are not the only operator an equation needs. A continuous convolution is an integral, and integrals are planned as well, with the numerical method stated in the program rather than assumed; they too are the subject of a planned post.

Equations are one half of the notation ML needs. The other is the data flow a model runs, layer after layer, which reads left to right where X_eTaL reads right to left; a pipeline macro for it is the subject of a planned post. Both lower to ordinary X_eTaL, so what they produce can run on the GPUs of [post #7](/2026/10/13/array-languages-xetal-gpu/), through OpenCL or, as of [post #10](/2026/10/16/array-languages-xetal-mojo-metal/), Mojo, and be drawn step by step in Blender, as the softmax and matrix-product videos in [post #9](/2026/10/15/array-languages-xetal-blender/) already are.

</div>
