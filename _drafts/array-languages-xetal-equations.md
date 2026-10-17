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
     2026-10-16 evening (Mike relayed the X_eTaL agent): the library moves to X_eTaL-libraries as libs/Equations (Equations.xtlm),
     imported "e:" u_se< "Equations"; new saga there: XETAL_COMMIT bump (needs []G_ENSYM, raw strings), oracle, capture, lowering,
     latex + README/docs/demo/catalog. X_eTaL keeps the integrals plan, a canary macro library, the shape lint, the docs.
     PLAN (Mike, 2026-10-16): Equations lands BEFORE this post publishes 10/17; the lint work runs in parallel. On landing, regenerate
     from the real library: xetal-eq-three.webp and the "What it becomes" expansion from the decided call (not the POC's e:s_um<),
     the LaTeX from e:t_ex<, the fixtures from the oracle goldens, the bounds error from an actual run; drop "not written yet".
     The library itself is NOT written yet: no claims that it runs; the numbers below are the proof of concept's.
     Date provisional (after #10 on Friday 10/16). Lead image: Mike's chalkboard of the stable softmax, not inverted, not transparent. -->

<img src="{{ '/assets/images/posts/block-chalk-softmax.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) ended with a CNN's triple sum and a question: what notation could say it in one line? [Post #5](/2026/10/11/array-languages-xetal-ml/) said experiments were under way with macros for ML equations. This is the design they produced. Its purpose is to let one equation be seen three ways and to move freely between them: as the math a paper prints, as an X_eTaL macro call that reads almost the same, and as the ordinary X_eTaL the macro expands to and runs. Because the typeset math and the running code come from the same call, they cannot drift apart.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The design** | [docs/spatial.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/spatial.md) --- the call, the lowering, the errors, the expected outputs |
| **The library** | [X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries) --- where `Equations` is being built, beside the other shared libraries |
| **Why this call** | [docs/eq-rationale.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/eq-rationale.md) --- seven ways to write it, compared |
| **The thread** | [ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) · [Array Languages #5: X_eTaL-ML](/2026/10/11/array-languages-xetal-ml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## One equation, three views

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 48%;">
<img src="{{ '/assets/images/posts/xetal-eq-three.webp' | relative_url }}" class="no-invert" alt="Three views of one equation. At the top, the CNN's triple sum typeset as a paper prints it: Y sub o,h,w equals the sum over c from 0 to C minus 1, r from 0 to Kh minus 1 and s from 0 to Kw minus 1 of X sub c, h plus r, w plus s times W sub o,c,r,s. An arrow up: e:t_ex returns this as LaTeX, from the same call. In the middle, the macro call written in X_eTaL. An arrow down: xetal expand shows what the macro writes. Then an excerpt of the expanded X_eTaL: a grid of coordinates and three sum-reductions over gathers from X and W. Then the result it runs to, 560 596 632, 704 740 776, 848 884 920">
<figcaption style="font-size: 0.85em;">One equation, three views: the math, the macro call, and the X_eTaL it expands to. Click to enlarge.</figcaption>
</figure>

Machine-learning papers are written in math, and programs are not. Translating one into the other by hand is where mistakes hide: an index off by one, a sum over the wrong axis, a bound that is right in the paper and wrong in the code. The equation macros keep the two together. The figure shows the three views of one equation, the convolution a CNN computes:

- **The math,** at the top, typeset as a paper would print it. It is not drawn by hand: the macro returns it as LaTeX, from the same call that computes the value.
- **The macro call,** in the middle, which is what a programmer writes. It reads almost like the math: the same indices, the same bounds, the same summand.
- **The expanded X_eTaL,** below it, which is what actually runs, plain array operations that `xetal expand` will show to anyone who wants to check the macro's work.

Read up, and the code can be checked against the paper. Read down, and the paper becomes a program, with its answer at the bottom. The expansion and the answer here come from the proof of concept, which takes an earlier form of the call. The library that takes the form shown, Equations, is the next piece of work.

<div style="clear: both;"></div>

## Macros first, syntax only when justified

An ML-focused language could add notation for sums to its grammar. The approach here is the opposite. X_eTaL's macros are functions from source text to source text, and the bet is that they are a sufficient mechanism to express ML concisely and idiomatically, so the grammar changes only when a change is justified. This work is the test of that bet, and it is deliberately a library on the language as it is: nothing in the compiler changes for the equations. The library, `Equations`, lives beside the other shared libraries in [X_eTaL-libraries](https://github.com/softwarewrighter/X_eTaL-libraries), and a program uses it like any of them, with `"e:" u̲se< "Equations"`.

## An equation, as the paper prints it

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 44%;">
<img src="{{ '/assets/images/posts/xetal-eq-eq.webp' | relative_url }}" class="no-invert" alt="The CNN's triple sum typeset: Y sub o,h,w equals the sum over c from 0 to C minus 1, the sum over r from 0 to Kh minus 1 and the sum over s from 0 to Kw minus 1 of X sub c, h plus r, w plus s times W sub o,c,r,s">
<figcaption style="font-size: 0.85em;">The convolution, typeset from the LaTeX the macro returns. Click to enlarge.</figcaption>
</figure>

The running example is the 2D convolution a CNN computes, strictly a cross-correlation, written as a triple sum. Each output `Y[o,h,w]`, for output channel `o` at row `h` and column `w`, adds up products over every input channel `c` and every kernel row `r` and column `s`: the input `X` at the window's position times the weight `W` for that output channel. The typeset version on the left is how a paper prints it.

<div style="clear: both;"></div>

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

The macro writes ordinary X_eTaL, and `xetal expand` shows it. The proof of concept already does this, from an earlier form of the call, which gave the sums' bounds in one list and their starting values in a third region, matched by position:

```text
Y ← "o h w | O Ho Wo" ᵉs̲um< "C - 1, Kh - 1, Kw - 1 | X[c,h+r,w+s] * W[o,c,r,s] | c:=0, r:=0, s:=0"
```

Its expansion, rendered, with line breaks added at the statement separators:

```text
Y ← ({ @ →
  grid ← (1 + (C − 1) − (0)) c̲at (1 + (Kh − 1) − (0)) c̲at (1 + (Kw − 1) − (0)) c̲at (O) c̲at (Ho) c̲at (Wo)◆
  g̲rid ← { k → grid r̲eshape (o̲ffsets k s̲elect grid) 'l̲eft t̲able ('× r̲/ k d̲rop grid) r̲eshape 0 }◆
  a̲t ← { A i → (1 + i) s̲elect r̲avel A }◆
  '+ r̲/₁ '+ r̲/₂ '+ r̲/₃
    (X a̲t ((g̲rid 6)+((0) + g̲rid 3)) + (3 s̲elect s̲hape X) × ((g̲rid 5)+((0) + g̲rid 2)) + (2 s̲elect s̲hape X) × (((0) + g̲rid 1)))
    × (W a̲t (((0) + g̲rid 3)) + (4 s̲elect s̲hape W) × (((0) + g̲rid 2)) + (3 s̲elect s̲hape W) × (((0) + g̲rid 1)) + (2 s̲elect s̲hape W) × ((g̲rid 4)))
} @)
```

Each line maps back to the math:

- **`grid`** is the shape of the whole computation: one axis per index, the summed ones first, `c`, `r` and `s`, then the free ones, `o`, `h` and `w`.
- **`g̲rid k`** gives the value of the `k`th index at every point of that grid, so `g̲rid 3` is `s` everywhere and `g̲rid 6` is `w`.
- **`a̲t`** reads elements out of an array by flat position, a gather.
- **The `X` term** builds each flat position from the paper's subscripts, `w+s`, `h+r` and `c`, combined by the array's own dimensions, so `X[c,h+r,w+s]` becomes one gather over the whole grid. The `W` term does the same for `W[o,c,r,s]`.
- **`'+ r̲/₁ '+ r̲/₂ '+ r̲/₃`** are the three sums: reductions along the axes of `c`, `r` and `s`, leaving an array of shape `O Ho Wo`, which is `Y`.

There are no loops in the result, just array operations, which is the same shape the GPU work in [post #7](/2026/10/13/array-languages-xetal-gpu/) lowers to kernels. The decided form adds what the proof of concept lacks: each sum binds its own index and range, so a bound cannot be paired with the wrong index, and every gather gets a bounds check.

Mistakes are caught where they can be. A malformed range, an index summed twice, or a summand index that is neither summed nor free is rejected when the macro expands. An index that runs outside its array is a run-time error that names the array, the axis, the index and the expression it came from, never a silent wrong read:

```text
error[index]: X axis 2: index 5 is outside 0..3 (from h+r)
```

## Checked before it is built

The `Equations` library is not written yet; it is the next piece of work. A proof of concept, in an earlier form of the call, already runs, and its outputs were checked against an independent version written by hand; they become the library's tests. One fixture: `X` of 2 by 4 by 4 holding 0 to 31 and `W` of 1 by 2 by 2 by 2 holding 0 to 7 give a 1 by 3 by 3 result:

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

The library is built in X_eTaL-libraries, in a fixed order, each step with its tests first. First the library's pinned copy of X_eTaL moves up to the current language, since the macros need two of its recent additions: fresh names for the code a macro emits, so it cannot clash with a user's, and raw strings. Then an oracle, an independent version of the convolution written with rotations, a transpose and one inner product, which must reproduce the three fixtures. Then reading the call: splitting its strings, pairing each sum's bounds with its index, and rejecting a malformed call when it expands, including one that would otherwise give a silent wrong answer. A macro there can use the other libraries for its own text processing, so the `Strings` library's splitting and trimming replace much of the proof of concept's hand-written code. Then the lowering, the grids, gathers with a bounds check per axis, and reductions above, which must match the oracle. Then the LaTeX, from the same parse, checked by a typesetter, with the library's documentation and a demo. After that come the parts deliberately left out for now: padding, strides and dilation for convolutions, and a shape check that catches a wrong shape before a program runs rather than after. Anything a macro cannot cover is reviewed and decided, never assumed.

Sums are not the only operator an equation needs. A continuous convolution is an integral, and integrals are planned as well, with the numerical method stated in the program rather than assumed; they too are the subject of a planned post.

Equations are one half of the notation ML needs. The other is the data flow a model runs, layer after layer, which reads left to right where X_eTaL reads right to left; a pipeline macro for it is the subject of a planned post. Both lower to ordinary X_eTaL, so what they produce can run on the GPUs of [post #7](/2026/10/13/array-languages-xetal-gpu/), through OpenCL or, as of [post #10](/2026/10/16/array-languages-xetal-mojo-metal/), Mojo, and be drawn step by step in Blender, as the softmax and matrix-product videos in [post #9](/2026/10/15/array-languages-xetal-blender/) already are.

</div>
