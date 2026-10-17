---
layout: post
title: "Array Languages #11: Math Equations as X_eTaL Macros"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, macros, machine-learning, einsum, convolution, latex, notation]
keywords: "X_eTaL equation macro, math notation in an array language, ML equations as code, CNN triple sum, cross-correlation, einsum, sum notation, LaTeX from code, macros instead of syntax"
abstract: "Eleventh in the Array Languages series: macros that take an equation as an ML paper prints it, a CNN's triple sum for one, and give back the array computation, its LaTeX, or both. They are a new library, Equations, in X_eTaL-libraries, with no change to the language: the point is to find out how far macros can carry ML notation before any new syntax is justified."
series: "Array Languages"
series_part: 11
date: 2026-10-17 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-libraries/tree/main/libs/Equations"
    title: "X_eTaL-libraries: Equations"
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT, A PLAN (2026-10-15): from X_eTaL Saga 41, spatial equations. Committed: docs/spatial.md (the call, lowering, errors,
     expected outputs), docs/eq-rationale.md (seven ways to write the call), docs/spatial-equations-review.md, docs/type-check-macros.md,
     docs/spatial-poc/ (proof of concept, old call syntax, checked against an oracle), spec/spatial/; decisions 3a72ef94 (D154).
     Pipelines (e:p_ipe<, D155, committed 3fad8892 on 10/15, with raw strings ST4) were split out to #12 (_drafts/array-languages-xetal-pipelines.md) per Mike.
     Rechecked 10/16 evening: no X_eTaL commits since 71e074d3 (10/15 14:49); raw strings (step 100) in progress, uncommitted;
     demos/spatial/ still absent; steps 102 oracle, 103 capture, 104 lowering, 105 latex, 107 shape lint pending; 101 integrals plan pending.
     2026-10-17 07:33/07:45: value macro renamed e:q_< -> e:e_q< (libraries b73ef1c; X_eTaL D160 e0f1d4c0); xetal expand lays out any
     macro's text as a program (X_eTaL step 107, D159). Old note: docs/plan.md rows 4-5 named pre-D154 macros; docs/spatial.md (D154) is followed here.
     2026-10-16 evening (Mike relayed the X_eTaL agent): the library moves to X_eTaL-libraries as libs/Equations (Equations.xtlm),
     imported "e:" u_se< "Equations"; new saga there: XETAL_COMMIT bump (needs []G_ENSYM, raw strings), oracle, capture, lowering,
     latex + README/docs/demo/catalog. X_eTaL keeps the integrals plan, a canary macro library, the shape lint, the docs.
     2026-10-17: the four ML equations (dense, attention scores/output, MSE) ran with the pinned xetal; outputs checked by hand;
     forms that are wrong today (^ in a summand: silent wrong answer) are NOT shown; gaps written up for the X_eTaL agents.
     2026-10-17: Equations DONE in X_eTaL-libraries (saga 12: be0f5b9 pin, 8197d52 oracle, 09143d8 capture, cb430d5 lowering,
     ba03d6a latex; 0643930 expansion layout, 7dffc91, 4b4193b just tex); in the live demo. Expansion, outputs and errors in this post
     are from runs with the repo's pinned xetal (823adbd3) on 2026-10-17 and match the tests/*.out goldens; error locations trimmed.
     X_eTaL D158 (730f741f): Boxed setting broke every macro expansion in the live demo (Mike's report); fixed.
     -->

<img src="{{ '/assets/images/posts/block-chalk-softmax.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) ended with a CNN's triple sum and a question: what notation could say it in one line? [Post #5](/2026/10/11/array-languages-xetal-ml/) said experiments were under way with macros for ML equations. This post is what they produced: a library, `Equations`. Its purpose is to let one equation be seen three ways and to move freely between them: as the math a paper prints, as an X_eTaL macro call that reads almost the same, and as the ordinary X_eTaL the macro expands to and runs. Because the typeset math and the running code come from the same call, they cannot drift apart.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The design** | [docs/spatial.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/spatial.md) --- the call, the lowering, the errors, the expected outputs |
| **The library** | [Equations](https://github.com/softwarewrighter/X_eTaL-libraries/tree/main/libs/Equations) in X_eTaL-libraries · [its reference](https://github.com/softwarewrighter/X_eTaL-libraries/blob/main/libs/Equations/docs/README.md) |
| **Try it** | [the live demo](https://softwarewrighter.github.io/X_eTaL-libraries/): pick Equations, run the CNN demo, see the math drawn |
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

Read up, and the code can be checked against the paper. Read down, and the paper becomes a program, with its answer at the bottom. All three come from the `Equations` library: the math is the LaTeX it returns, the expansion is what `xetal expand` prints, and the answer is what the expansion computes.

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
Y ← "Y[o,h,w] | O Ho Wo" ᵉe̲q< "sum c:=0..C - 1, sum r:=0..Kh - 1, sum s:=0..Kw - 1 | X[c,h+r,w+s] * W[o,c,r,s]"
```

The left string names the result, its free indices, and one extent for each, so the result has shape `O Ho Wo`; extents are written, never guessed. The right string is the sums, outermost first, each an operator word, an index and an inclusive range, then the summand after the bar. Inside the strings the notation is the paper's: math precedence, brackets for indexing, and indices counted from 0 as the paper counts them.

Three macros parse the same text the same way:

| Macro | Gives |
|---|---|
| `e:e_q<` | the value, the array |
| `e:t_ex<` | the LaTeX, a string |
| `e:b_oth<` | both, as a pair |

So the value and its typeset equation always describe the same thing. The library's demo is one CNN layer, two 4 by 4 pictures through one 2 by 2 by 2 filter, with one call giving both:

```text
"e:" u̲se< "Equations"
X ← 2 4 4 r̲eshape r̲ange 32
W ← 1 2 2 2 r̲eshape r̲ange 8
(C, Kh, Kw) ← (2, 2, 2)
(O, Ho, Wo) ← (1, 3, 3)
(Y, tex) ← "Y[o,h,w] | O Ho Wo" ᵉb̲oth< "sum c:=0..C - 1, sum r:=0..Kh - 1, sum s:=0..Kw - 1 | X[c,h+r,w+s] * W[o,c,r,s]"
"$$" c̲at tex c̲at "$$"
Y
Y m̲atch X ᵉc̲orrelate W
```

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 48%;">
<img src="{{ '/assets/images/posts/xetal-eq-texpage.webp' | relative_url }}" class="no-invert" alt="The Equations library's page for its CNN demo: the program, then its output, where the line printed between double dollar signs is drawn by KaTeX as the triple sum Y sub o,h,w equals the sum over c, r and s of X sub c, h plus r, w plus s times W sub o,c,r,s, followed by the result 560 596 632, 704 740 776, 848 884 920 and a 1">
<figcaption style="font-size: 0.85em;">The demo as the library shows it: the program, and its output with the LaTeX line drawn as math. Click to enlarge.</figcaption>
</figure>

It prints the LaTeX between `$$` markers, then the result, then a check:

```text
$$Y_{o,h,w} = \sum_{c=0}^{C - 1} \sum_{r=0}^{Kh - 1} \sum_{s=0}^{Kw - 1} X_{c,h+r,w+s} \, W_{o,c,r,s}$$
560 596 632
704 740 776
848 884 920
1
```

The `$$` line is for whatever shows the output. In the library's live demo, and on the page `just tex Equations cnn` writes, shown here, that line is drawn as math by KaTeX; everywhere else it is plain text. The final `1` is the check: the result matches `ᵉc̲orrelate`, the library's own cross-correlation, written a different way.

<div style="clear: both;"></div>

## What it becomes

The macro writes ordinary X_eTaL, and `xetal expand` shows it. This is the demo's call, expanded and rendered. The layout is the macro's own: it writes its expansion as a program, one definition per line and each gather on its own line, so it can be read.

```text
(Y, tex) ← (({ @ →
  g1:grid ← (1 + (C − 1) − 0) c̲at (1 + (Kh − 1) − 0) c̲at (1 + (Kw − 1) − 0) c̲at O c̲at Ho c̲at Wo
  g2:g̲rid ← { k → g1:grid r̲eshape (o̲ffsets k s̲elect g1:grid) 'l̲eft t̲able ('× r̲/ k d̲rop g1:grid) r̲eshape 0 }
  g5:a̲t ← { A i → (1 + i) s̲elect r̲avel A }
  g4:c̲heck ← { (A, name, k, from) e →
    n ← k s̲elect s̲hape A
    bad ← w̲here n̲ot r̲avel (0 ≤ e) ∧ e < n
    0 = t̲ally bad ? e
    "index" ⎕S̲IGNAL name c̲at " axis " c̲at (f̲ormat k) c̲at ": index " c̲at (f̲ormat (f̲irst bad) s̲elect r̲avel e) c̲at " is outside 0.." c̲at (f̲ormat n − 1) c̲at " (from " c̲at from c̲at ")"
  }
  g3:r̲ank ← { (A, name, q, ref) →
    (t̲ally s̲hape A) = q ? A
    "rank" ⎕S̲IGNAL ref c̲at " indexes " c̲at (f̲ormat q) c̲at " axes, but " c̲at name c̲at " has rank " c̲at f̲ormat t̲ally s̲hape A
  }
  '+ r̲/₁ '+ r̲/₂ '+ r̲/₃ ((
    ((g3:r̲ank (X, "X", 3, "X[c,h+r,w+s]")) g5:a̲t ((
      ((X, "X", 3, "w+s") g4:c̲heck ((g2:g̲rid 6) + (0 + g2:g̲rid 3))) + (3 s̲elect s̲hape X) × (
      ((X, "X", 2, "h+r") g4:c̲heck ((g2:g̲rid 5) + (0 + g2:g̲rid 2))) + (2 s̲elect s̲hape X) × 
      ((X, "X", 1, "c") g4:c̲heck (0 + g2:g̲rid 1)))))) × 
    ((g3:r̲ank (W, "W", 4, "W[o,c,r,s]")) g5:a̲t ((
      ((W, "W", 4, "s") g4:c̲heck (0 + g2:g̲rid 3)) + (4 s̲elect s̲hape W) × (
      ((W, "W", 3, "r") g4:c̲heck (0 + g2:g̲rid 2)) + (3 s̲elect s̲hape W) × (
      ((W, "W", 2, "c") g4:c̲heck (0 + g2:g̲rid 1)) + (2 s̲elect s̲hape W) × 
      ((W, "W", 1, "o") g4:c̲heck (g2:g̲rid 4)))))))))
} @, "Y_{o,h,w} = \\sum_{c=0}^{C - 1} \\sum_{r=0}^{Kh - 1} \\sum_{s=0}^{Kw - 1} X_{c,h+r,w+s} \\, W_{o,c,r,s}"))
```

Each part maps back to the math:

- **`grid`** is the shape of the whole computation: one axis per index, the summed ones first, `c`, `r` and `s`, then the free ones, `o`, `h` and `w`.
- **`g̲rid k`** gives the value of the `k`th index at every point of that grid, so `g̲rid 3` is `s` everywhere and `g̲rid 6` is `w`.
- **`a̲t`** reads elements out of an array by flat position, a gather.
- **The `X` term** builds each flat position from the paper's subscripts, `w+s`, `h+r` and `c`, combined by the array's own dimensions, so `X[c,h+r,w+s]` becomes one gather over the whole grid. The `W` term does the same for `W[o,c,r,s]`.
- **`c̲heck` and `r̲ank`** guard every gather: each subscript is checked against its axis, and each array against the number of subscripts written for it, with the text of the subscript kept for the message.
- **`'+ r̲/₁ '+ r̲/₂ '+ r̲/₃`** are the three sums: reductions along the axes of `c`, `r` and `s`, leaving an array of shape `O Ho Wo`, which is `Y`.
- **The `g1:` to `g5:` prefixes** are fresh names the macro asks the language for, so nothing it defines can clash with a name in the program around it.
- **The string at the end** is the LaTeX, the second half of the pair that `ᵉb̲oth<` returns.

There are no loops in the result, just array operations, which is the same shape the GPU work in [post #7](/2026/10/13/array-languages-xetal-gpu/) lowers to kernels.

Mistakes are caught where they can be. A malformed call is rejected when the macro expands, before the program runs; the library's tests cover ten of them, among them a sum written `c=0..C - 1` where `c:=0..C - 1` is meant, a sum with no operator word, a missing summand, and an index bound twice:

```text
"Y[o,h,w] | O Ho Wo" ᵉe̲q< "sum c:=0..C - 1, sum h:=0..1 | X[c,h,w]"
error[bad-equation]: an index is bound once: c, h, o, h, w
```

The rest is checked when the program runs, never left as a silent wrong read. Too few subscripts for an array:

```text
error[rank]: X[c,h+r] indexes 2 axes, but X has rank 3
```

And an index outside its axis, here a sum that runs one past the two channels:

```text
"Y[o,h,w] | O Ho Wo" ᵉe̲q< "sum c:=0..C | X[c,h,w]"
error[index]: X axis 1: index 2 is outside 0..1 (from c)
```

## Beyond the CNN

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 46%;">
<img src="{{ '/assets/images/posts/xetal-eq-four.webp' | relative_url }}" class="no-invert" alt="Four equations typeset from the LaTeX the macro returned, each with its result: a dense layer without its bias, z sub i equals the sum over j of W sub i,j x sub j, giving -2 -2; attention scores, S sub i,j equals the sum over d of Q sub i,d K sub j,d over s, giving 1 2 0 and 1 0 3; attention output, O sub i,e equals the sum over j of A sub i,j V sub j,e, giving 2.5 3.5 and 3 4; mean squared error, L equals the sum over i of (y sub i minus p sub i) times (y sub i minus p sub i) over nf, giving 0.3125">
<figcaption style="font-size: 0.85em;">Four more equations, typeset from the macro's own LaTeX, with what each computed. Click to enlarge.</figcaption>
</figure>

The convolution is the hardest case, three sums and arithmetic in the subscripts, but most of machine learning is simpler sums. Four that every model uses, each one call:

```text
(z, tz) ← "z[i] | N" ᵉb̲oth< "sum j:=0..M - 1 | W[i,j] * x[j]"
(S, tS) ← "S[i,j] | T U" ᵉb̲oth< "sum d:=0..D - 1 | Q[i,d] * K[j,d] / s"
(O, tO) ← "O[i,e] | T E" ᵉb̲oth< "sum j:=0..U - 1 | A[i,j] * V[j,e]"
(L, tL) ← "L[] | " ᵉb̲oth< "sum i:=0..n - 1 | (y[i] - p[i]) * (y[i] - p[i]) / nf"
```

- **A dense layer,** the weights `W` times the input `x`, the core of every fully connected layer.
- **Attention scores,** each query in `Q` against each key in `K`, scaled by `s`, which is √`D`, computed before the call.
- **Attention output,** the attention weights `A` applied to the values `V`.
- **Mean squared error,** the average squared difference between targets `y` and predictions `p`. Its result has no free indices, `L[]`, so it is a single number; `nf` is `n` as a float.

The figure shows what each call returned: the LaTeX, typeset, and the value, each checked by hand. They also show where the notation stops today. A paper would write the attention scale as a fraction, `1/√d` in front of the sum, the error with a square and `1/n` in front, and the dense layer with its bias added after the sum. The macro takes only `sum`, and only one summand, so the scale and the average go inside the sum, the square is written as a product, the bias waits for a second step, and the LaTeX shows them exactly as written. The answers are right; the next round of the library is to make the notation match the paper too.

<div style="clear: both;"></div>

## Checked against an oracle

The library was built test-first, against an oracle: `ᵉc̲orrelate`, the same cross-correlation written independently, with rotations, a transpose and one inner product. Three fixtures pin it. All ones gives 8 everywhere. `X` of 2 by 4 by 4 holding 0 to 31 and `W` of 1 by 2 by 2 by 2 holding 0 to 7 give the demo's 1 by 3 by 3 result. And two output channels, three input channels and a 2 by 3 kernel on 5 by 6 pictures give a 2 by 4 by 4 result. The macro must match the oracle on all three, and it does.

The call's form was not the first idea. The design compares seven ways of writing it, judged on whether a reader can see which bound goes with which index, whether different operators can mix, what a plausible slip does, how close it stays to the paper, and whether it works with no compiler change. The worst outcome is a slip that gives a silent wrong answer, and the chosen form, a binding per sum, was picked largely to rule those out.

</div>

<div class="clearfix" markdown="1">

## What comes next

The library went from plan to finished in one evening, in five steps, each with its tests first: moving its copy of X_eTaL up to the current language, for fresh names and raw strings; the oracle; reading the call, with the rejections; the lowering, with the checks; and the LaTeX, with the demo and the documentation. Then I asked for readable expansions: the macro now lays its expansion out as a program, as shown above, and `xetal expand` now does the same for every macro. And one name changed before this post: the value macro was `q_<`, which read as "eq" only beside the alias `e:`. Since the alias is the caller's choice, it is now `e_q<`, which reads as "eq" under any alias, like its siblings `t_ex<` and `b_oth<`. Macros also had a bug, which I hit in X_eTaL's live demo: with its Boxed display on, every macro call in every program failed, because a macro's expansion went through the same printer as the program's output and came back drawn as a box instead of as source. That is fixed, with tests that were red before the fix.

Still ahead for equations: the parts deliberately left out, padding, strides and dilation for convolutions, and a shape check that catches a wrong shape before a program runs rather than after, which is being built in X_eTaL now. Anything a macro cannot cover is reviewed and decided, never assumed.

Sums are not the only operator an equation needs. A continuous convolution is an integral, and integrals are planned as well, with the numerical method stated in the program rather than assumed; they too are the subject of a planned post.

Equations are one half of the notation ML needs. The other is the data flow a model runs, layer after layer, which reads left to right where X_eTaL reads right to left; a pipeline macro for it is the subject of a planned post. Both lower to ordinary X_eTaL, so what they produce can run on the GPUs of [post #7](/2026/10/13/array-languages-xetal-gpu/), through OpenCL or, as of [post #10](/2026/10/16/array-languages-xetal-mojo-metal/), Mojo, and be drawn step by step in Blender, as the softmax and matrix-product videos in [post #9](/2026/10/15/array-languages-xetal-blender/) already are.

</div>
