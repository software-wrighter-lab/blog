---
layout: post
title: "Array Languages #13: Integrals and Continuous Convolution in X_eTaL"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, macros, machine-learning, integrals, convolution, quadrature, latex, blender, notation]
keywords: "X_eTaL integral macro, continuous convolution, convolution versus cross-correlation, numerical integration in an array language, trapezoid rule, quadrature, box function convolution, triangle function, LaTeX from code, Blender animation of convolution"
abstract: "Thirteenth in the Array Languages series: after sums and pipelines, integrals. A continuous convolution is an integral, and a computer can only approximate one, so the plan keeps the mathematics and the numerical method apart: an integral written as the paper prints it, typeset exactly, and computed by a stated rule on a stated grid, with improper integrals refused rather than quietly cut short. The first deliverable is a short Blender video, drawn from X_eTaL's own numbers, comparing convolution, correlation and the integral of two box functions."
series: "Array Languages"
series_part: 13
date: 2026-10-19 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT (rewritten 2026-10-19 afternoon): integrals now IN X_eTaL-libraries' Equations (3a61a22, PR #5, Saga 14 step 3, X_eTaL
     Saga 42 decision 1; every macro declares ## takes:, a3f7f75). Runs: clean export of X_eTaL-libraries origin 982495a with its pinned
     xetal f7848d00 (scripts/xt, XETAL_LIBS_ROOT): demos/integrals.xtl (GELU table, 0.000473, KL 0.443147 x2, LaTeX), my calls (1/3,
     6.0; the inf refusal), tests integral-nested (0.25 xy square, 3.0 sum inside) and integral-latex (the four typeset). Expansion by
     scripts/xt expand, checks trimmed. Box convolution and convergence numbers from X_eTaL-ML's Integrals (9825334), clean export with
     X_eTaL main f027bb74; Equations' goldens repeat 4 4 16 16 from it. Note for the agents: the result name Phi is not made \Phi
     (Greek is converted in bodies and bounds only).
     2026-10-19 evening: e:c_onvolve< / e:c_orrelate< (e491dab, decision 5) run here: full 1 4 10 16 17 12, same 4 10 16 17,
     valid 10 16, correlate valid 14 20; bad mode refused (bad-convolution). Catalog of 13 (291023d); Greek result names fixed.
     Probed: Int array x Float integral is a type-mismatch before running, underlined across the whole call; no integral lints.
     Asks recorded 2026-10-19: X_eTaL 2e750334 (B1 errors inside a notation string = type-check-macros approach 3; B2 string-kind for
     c"..." on a notation side), X_eTaL-libraries a0b37fb (n vs 2n error estimate, jump warning; planned notations, ## draws:).
     2026-10-19 evening: X_eTaL step 154 (d5d54ae8, MC32, D178) and Equations draws (5d3c808, ## takes: notation notation, ## draws: t_ex<):
     figure = xetal render --html of scratch show.xtl (libraries' xetal d5d54ae8, clean export 357849b), typeset with KaTeX; the use< line
     is left out (drawn ᵉ⁼u̲se<; Mike 10-19: fixed in X_eTaL, being pushed; once the libraries pin it, the line may be shown).
     Saga 42 decisions (X_eTaL 6c0bf1c9) for the convolution family; boundary modes, FFT. Animation planned, not built.
     Lead image: Mike's screenshot (continuous convolution card), not inverted, not transparent. -->

<img src="{{ '/assets/images/posts/block-continuous-convolution.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[Post #11](/2026/10/17/array-languages-xetal-equations/) wrote an equation's sums as a macro call, and [post #12](/2026/10/18/array-languages-xetal-pipelines/) wrote a model's data flow left to right. Next in X_eTaL's plan, after the pipelines: integrals. A convolution in a signal-processing textbook is often continuous, an integral rather than a sum, and the step from one to the other is where a computer has to approximate. This post is the plan, written before the code.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The library** | [Equations](https://github.com/softwarewrighter/X_eTaL-libraries/tree/main/libs/Equations), now with integrals · [Integrals](https://github.com/softwarewrighter/X_eTaL-ML/tree/main/libs/Integrals) in X_eTaL-ML, its check |
| **The design** | [docs/plan.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/plan.md), Saga 42, in X_eTaL |
| **The thread** | [#11: equations](/2026/10/17/array-languages-xetal-equations/) · [#12: pipelines](/2026/10/18/array-languages-xetal-pipelines/) · [#9: Blender](/2026/10/15/array-languages-xetal-blender/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>


## One computation, four views

The aim is one computation shown four ways, all from the same numbers: the equation, the pipeline, the X_eTaL it expands to, and a Blender animation. Some things are ruled out from the start: implicit broadcasting, shape errors that pass silently, a second copy of the math written in Python for the pictures, and a numerical method chosen without saying so.

## First, the discrete case

Convolution and cross-correlation are easy to confuse, because with a symmetric kernel they give the same answer, so the first example uses one that is not symmetric: `x` of `1 2 3 4` and a kernel `h` of `1 2 3`. The equation library has a macro for each, and each names its mode, how it treats the edges, because libraries and traditions disagree about which is natural and none is assumed:

```text
"y[n] | full" ᵉc̲onvolve< "x h"
"y[n] | same" ᵉc̲onvolve< "x h"
"y[n] | valid" ᵉc̲onvolve< "x h"
"r[n] | valid" ᵉc̲orrelate< "x h"
```

`full` gives every overlap, `1 4 10 16 17 12`; `same` keeps the signal's length, `4 10 16 17`; `valid` keeps only the windows that fit entirely, `10 16`. Convolution reverses the kernel; cross-correlation, which is what CNNs compute, uses it as it is, and over the same valid windows gives `14 20`. A missing or misspelled mode is refused when the program is compiled. Neither macro is new grammar: each expands to the sum it is, and its LaTeX is that sum, `y_n = \sum_{k=0}^{2} h_k \, x_{n-k}` for the convolution.

## The integral, in the equation's own words

A convolution in a textbook is often continuous, an integral rather than a sum, and the step from one to the other is where a computer has to approximate. So `integral` is now an operator word in the equation library, beside `sum`, `prod`, `max` and `min`, and it reads the same way: a variable, its bounds, then the body after the bar. The string is the integral's notation, like the sums of post #11:

```text
v ← "v[] | " ᵉe̲q< "integral x:=0..1 by simpson 2 | x^2"
w ← "w[] | " ᵉe̲q< "integral x:=0..2 by trapezoid 4 | 1 + 2 * x"
```

`by simpson 2` names the rule and the grid, how many steps; left out, the rule is the trapezoid on 64 steps, a documented default, so the plain form works. These two give `1/3` and `6.0` exactly, because Simpson's rule is exact on a square and the trapezoid rule on a straight line.

Because an integral is a term like any other, it nests. An integral sits inside a sum, a sum inside an integral, and two integrals make a double integral:

```text
q ← "L[] | " ᵉe̲q< "integral x:=0..1 by trapezoid 4, integral y:=0..1 by trapezoid 4 | x * y"
r ← "L[] | " ᵉe̲q< "integral x:=0..1 by simpson 2 | (sum j:=0..M-1 | A[j] * x)"
```

The first is `xy` over the unit square, `0.25`; the second, with `A` of `1 2 3`, is `3.0`.

Some integrals are refused on principle. A paper's convolution runs from minus infinity to infinity, and a computer cannot. Rather than quietly replace infinity with a finite bound, the macro refuses, and says how to go on:

```text
error[bad-equation]: an improper integral (a bound of inf): write a truncation, 0..20 say, and show the tail is small, or change variables so the bounds are finite: integral x:=0..inf
```

### The math it typesets

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/xetal-int-four.webp' | relative_url }}" class="no-invert" alt="Four integrals typeset from the LaTeX the equation library returned: Phi equals one half plus the integral from 0 to x of exp of minus u squared over 2, over the square root of 2 pi, du, used for GELU; the KL divergence, the integral from -10 to 10 of P sub x times log of P sub x over Q sub x, dx, 0.443147 as the closed form; a double integral, the integral from 0 to 1 of the integral from 0 to x of x y dy dx; and a continuous convolution, F sub t equals the integral from 0 to 2 of exp of minus tau times exp of t minus tau, d tau">
<figcaption style="font-size: 0.85em;">Four integrals, typeset from the LaTeX the macro returned. Click to enlarge.</figcaption>
</figure>

The same call gives its LaTeX, `ᵉt̲ex<`, and an integral comes out as a paper would print it: `\int` with its bounds, the body as math, `\, d\tau` at the end, nested integrals with the inner `d` first, and Greek names as Greek letters in the body and bounds. The figure shows four, each typeset from what the library returned, among them GELU's normal-distribution integral and the KL divergence below.

### Drawn as math

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/xetal-int-drawn.webp' | relative_url }}" class="no-invert" alt="A short X_eTaL program as xetal render --html draws it, typeset: ordinary lines in decorated code, and each equation call drawn as the macro's name and a box of typeset math: y gets e:convolve of y sub n equals the sum over m of x sub n minus m times h sub m, full; v gets e:eq of the integral from 0 to 1 of x squared dx; GELU's body adds e:eq of Phi equals the integral from 0 to x of exp of minus u squared over 2, over the square root of 2 pi, du; and Y gets e:eq of the CNN layer's triple sum">
<figcaption style="font-size: 0.85em;">A program as the equation library now draws it: the code as code, each equation as math. Click to enlarge.</figcaption>
</figure>

The strings in the calls above are the notation as typed. Where a program is drawn for reading, in the live demos, the documentation and `xetal render --html`, the equation library now draws each call itself: the macro's name stays as code, so a reader sees which macro ran, and its strings become one box of typeset math, from the same LaTeX `ᵉt̲ex<` gives. The value and the text are unchanged; only the drawing is. The figure is a short program, the convolution, an integral, GELU's `Φ` and the CNN layer, as `xetal render --html` writes it, typeset the way a page does. In a terminal, which has no math renderer, the typed text is shown, styled as notation.

### What it becomes

The macro writes ordinary X_eTaL: the bounds as floats, the step, the rule's weights, a grid for the variable, and one weighted sum along it. Simpson on two steps over `0..1`, from `xetal expand`, its checks left out:

```text
g9:a ← f̲loat (0)
g8:b ← f̲loat (1)
g7:h ← (g8:b − g9:a) ÷ 2.0
g6:w ← g7:h × (1.0 c̲at (1 r̲eshape 4.0 2.0) c̲at 1.0) ÷ 3.0
g10:grid ← (3)
g11:g̲rid ← { k →
  g10:grid r̲eshape (o̲ffsets k s̲elect g10:grid) 'l̲eft t̲able ('× r̲/ k d̲rop g10:grid) r̲eshape 0
}
'+ r̲/₁ g10:grid r̲eshape ((1 + g11:g̲rid 1) s̲elect g6:w) × (((g9:a + g7:h × f̲loat g11:g̲rid 1) ^ 2))
```

The weights are Simpson's, 1, 4 and 1, times the step over 3; the grid has three points; and the integral is one reduction, `'+ r̲/₁`, of the weights times the body on the grid, the same shape as a sum's.

### Checked by its orders

The tests check the rules the way numerical analysts do: by how fast the error falls. Doubling the grid should divide the trapezoid rule's error by about 4 and Simpson's by about 16, and on `eˣ` over `0..1` they do: `4 4 16 16`. Those numbers, and every value above, came first from a standalone library in X_eTaL-ML, `Integrals`, which now serves as the equation library's independent check.

## Two boxes make a triangle

The card at the top of this post is the classic example: two box functions, each 1 between 0 and 1 and 0 elsewhere. Slide one across the other and their overlap grows to 1 and shrinks back, so their convolution is a triangle. The box is one line of X_eTaL:

```text
ᵘb̲ox ← { x → f̲loat (x ≥ 0.0) ∧ x ≤ 1.0 }
```

A body that calls an X_eTaL function like this one is not in the equation notation, which has `exp`, `log`, `sqrt`, `abs`, `max`, `min`, `sin` and `cos`; X_eTaL-ML's `Integrals` library takes it, with the same call and an X_eTaL body. At `t` from 0 to 2 in eighths, on 128 steps, it gives the first line below; the exact triangle is the second:

```text
0.008 0.133 0.258 0.383 0.508 0.633 0.758 0.883 1.008 0.891 0.766 0.641 0.516 0.391 0.266 0.141 0.016
0.0   0.125 0.25  0.375 0.5   0.625 0.75  0.875 1.0   0.875 0.75  0.625 0.5   0.375 0.25  0.125 0.0
```

Close, and honestly close: the box jumps at its edges, and a rule sampling a jump is off by about half a step at each one, so this integral's error falls only as fast as the step does. Both libraries document that.

## GELU, from its definition

The same notation computes something every transformer uses. GELU, the activation in BERT and GPT, is `x` times the standard normal's cumulative distribution, `Φ(x)`, which is one half plus an integral of the normal density from 0 to `x`:

```text
ᵘg̲elu ← { x → x × 0.5 + "L[] | " ᵉe̲q< "integral u:=0..x by simpson 32 | exp(-(u^2) / 2) / sqrt(2 * pi)" }
```

Most frameworks compute GELU with a tanh approximation instead, and the integral says by how much it is off. At `x` from −3 to 3, GELU is `−0.004 −0.0455 −0.1587 −0.1543 0 0.3457 0.8413 1.9545 2.996`, and the largest difference from the approximation over −4 to 4 is `0.000473`. The demo also computes the KL divergence of two Gaussians as an integral over a truncation, `0.443147`, and by its closed form, also `0.443147`.

## What is not right yet

- **What the notation cannot write yet.** Its functions are a fixed set, grown on purpose, so an integrand that calls an X_eTaL function, like the box, needs the standalone library for now. The library's plan names the rest: a step function, which would let the box be written as math; `float(e)`, to scale a float integral by a whole-number array; `tanh`; and Greek names with subscripts.
- **Diagnostics.** A wrong call is refused before the program runs, and a type mistake, such as a whole-number array times a float integral, is a type error before it runs too. But the error underlines the whole call rather than the term inside the string, and nothing warns that a grid is too coarse or that an integrand jumps. Both are now planned work: errors placed inside a notation's string in X_eTaL, and an error estimate and a warning on a jump in the equation library.

## A family of convolutions

The plan lists the variants that follow, each with its own check, a fixture that is not symmetric, and its own animation: 2D image convolution and a CNN layer with its bias, separable Gaussian blur as two 1D passes, dilated, transposed, circular, by FFT, and 3D over voxels. Each has a trap the tests are meant to catch: a transposed convolution is not an inverse, a circular one is not a linear one without padding, and an FFT convolution without enough padding wraps around. The 1D modes are built, as above; `circular` is planned with the rest. The FFT waits for complex numbers in the language.

## Animated from the same numbers

The first video planned compares the asymmetric 1D convolution, the correlation, and the continuous box-function integral: the equation, the current stage, the products, the running total, and the triangle drawn as `t` advances. Every number in it comes from the X_eTaL computation, through the same `Video.xtl` library and fixed Blender player as the videos in [post #9](/2026/10/15/array-languages-xetal-blender/). Blender draws; it does not compute the convolution again.

