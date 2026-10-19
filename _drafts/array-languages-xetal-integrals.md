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

<!-- DRAFT (rewritten 2026-10-19 from X_eTaL-ML's committed Integrals: 9825334 "Integrals, a definite integral as a macro call",
     35c4840 goldens, origin f734718). Every output was run on a clean export of X_eTaL-ML's libs with a clean build of X_eTaL main
     (f027bb74): demos/convolution, demos/gelu, tests/exact (8 checks), tests/convergence (4 4 16 16), tests/latex, tests/reject-infinite.
     Rendered lines by xetal render; the integral calls are shown AS TYPED on purpose: a plain string renders its X_eTaL body as typed,
     and a c"..." string mis-draws the notation (:= as ←, | as ∨). Fix belongs to X_eTaL step 154 (MC32 notation drawing) or the lift
     of integral into X_eTaL-libraries' Equations (Saga 42 decision 1). Naming integ:i_ntegral< to be raised.
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
| **The library** | [Integrals](https://github.com/softwarewrighter/X_eTaL-ML/tree/main/libs/Integrals) in X_eTaL-ML · [its reference](https://github.com/softwarewrighter/X_eTaL-ML/blob/main/libs/Integrals/docs/README.md) |
| **The design** | [docs/plan.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/plan.md), Saga 42, in X_eTaL |
| **The thread** | [#11: equations](/2026/10/17/array-languages-xetal-equations/) · [#12: pipelines](/2026/10/18/array-languages-xetal-pipelines/) · [#9: Blender](/2026/10/15/array-languages-xetal-blender/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>


## One computation, four views

The aim is one computation shown four ways, all from the same numbers: the equation, the pipeline, the X_eTaL it expands to, and a Blender animation. Some things are ruled out from the start: implicit broadcasting, shape errors that pass silently, a second copy of the math written in Python for the pictures, and a numerical method chosen without saying so.

## First, the discrete case

Convolution and cross-correlation are easy to confuse, because with a symmetric kernel they give the same answer, so the first example uses one that is not symmetric. With `x` of `1 2 3 4` and `h` of `1 2 3`, the two windows that fit are `1 2 3` and `2 3 4`. Convolution reverses the kernel to `3 2 1` and gives `10 16`; cross-correlation, which is what CNNs compute, uses it as it is and gives `14 20`. The correlation is a sum the equation macro of post #11 already writes, and it gives `14 20`:

```text
r ← "r[n] | 2" ᵉe̲q< "sum k:=0..2 | x[n+k] * h[k]"
```

## The integral, as a macro

A convolution in a textbook is often continuous, an integral rather than a sum, and the step from one to the other is where a computer has to approximate. `Integrals`, a new library in X_eTaL-ML, writes a definite integral the way a paper does and computes it by a rule you can name. The call's text is the integral's own notation, so it is shown here as written:

```text
@ integ:i_ntegral< "integral x:=0..1 by simpson 2 | x ^ 2"
@ integ:i_ntegral< "integral x:=0..2 by trapezoid 4 | 1.0 + 2.0 * x"
@ integ:i_ntegral< "integral tau:=0..2 by trapezoid 128 | (u:b_ox tau) * u:b_ox t - tau"
```

`integral` reads like `sum`: a variable, its bounds, then the body after the bar. `by simpson 2` names the rule and the grid, how many steps; left out, the rule is the trapezoid on 64 steps, a documented default, so the plain form works. The body is X_eTaL, evaluated once over the whole grid: the macro binds the variable to the grid's points as one array, so the body may call any function. The first two lines give `1/3` and `6.0` exactly, because Simpson's rule is exact on a square and the trapezoid on a straight line.

Like every reader in the series now, this one uses all of its text or refuses the call when the program is compiled, naming what it could not use, and some integrals it refuses on principle. A paper's convolution runs from minus infinity to infinity, and a computer cannot. Rather than quietly replace infinity with a finite bound, the macro refuses, and says how to go on:

```text
error[bad-integral]: an improper integral (a bound of inf): write a truncation, 0..20 say, and show the tail is small, or change variables so the bounds are finite: 0..inf
```

### What it becomes

The macro writes ordinary X_eTaL: the bounds, the step, the variable bound to the grid, the rule's weights, and the step times the weighted sum of the body. Simpson on two steps over `0..1`, from `xetal expand`:

```text
v ← ({ @ →
  g1:a ← f̲loat 0
  g2:b ← f̲loat 1
  g3:h ← (g2:b − g1:a) ÷ 2.0
  x ← g1:a + g3:h × f̲loat o̲ffsets 3
  g4:w ← (1.0 c̲at (1 r̲eshape 4.0 2.0) c̲at 1.0) ÷ 3.0
  g3:h × '+ r̲/ g4:w × x ^ 2
} @)
```

The weights are Simpson's, 1, 4 and 1 over 3, and the variable `x` is the grid, three points. The macro's own names are fresh, `g1:a` and the rest, so they cannot collide with the program's; `x` is the caller's.

### Checked by its orders

The tests check the rules the way numerical analysts do: by how fast the error falls. Doubling the grid should divide the trapezoid rule's error by about 4 and Simpson's by about 16, and on `eˣ` over `0..1` they do:

```text
4 4 16 16
```

## Two boxes make a triangle

The card at the top of this post is the classic example: two box functions, each 1 between 0 and 1 and 0 elsewhere. Slide one across the other and their overlap grows to 1 and shrinks back, so their convolution is a triangle. The box is one line of X_eTaL:

```text
ᵘb̲ox ← { x → f̲loat (x ≥ 0.0) ∧ x ≤ 1.0 }
```

The convolution is the third integral above, as a function of `t`. At `t` from 0 to 2 in eighths, on 128 steps, it gives the first line below; the exact triangle is the second:

```text
0.008 0.133 0.258 0.383 0.508 0.633 0.758 0.883 1.008 0.891 0.766 0.641 0.516 0.391 0.266 0.141 0.016
0.0   0.125 0.25  0.375 0.5   0.625 0.75  0.875 1.0   0.875 0.75  0.625 0.5   0.375 0.25  0.125 0.0
```

Close, and honestly close: the box jumps at its edges, and a rule sampling a jump is off by about half a step at each one, so this integral's error falls only as fast as the step does. The library documents that, and its tests check it.

## GELU, from its definition

The same macro computes something every transformer uses. GELU, the activation in BERT and GPT, is `x` times the standard normal's cumulative distribution, `Φ(x)`, which is an integral of the normal density from 0 to `x`, plus one half. The density is one line:

```text
ᵘp̲hi ← { u → (e̲xp n̲eg (u × u) ÷ 2.0) ÷ (2.0 × p̲i @) ^ 0.5 }
```

and GELU is that integral, by Simpson on 32 steps, times `x`. Most frameworks compute GELU with a tanh approximation instead:

```text
ᵘa̲pprox ← { x → 0.5 × x × 1.0 + ⁿⁿt̲anh ((2.0 ÷ p̲i @) ^ 0.5) × x + 0.044715 × x ^ 3 }
```

The integral says by how much the approximation is off. At `x` from −3 to 3, GELU is `−0.004 −0.0455 −0.1587 −0.1543 0 0.3457 0.8413 1.9545 2.996`, and the largest difference from the approximation over −4 to 4 is `0.000473`. The demo also computes the KL divergence of two Gaussians as an integral over a truncation, `0.443147`, and its closed form, also `0.443147`.

## What is not right yet

- **The LaTeX.** The library's `integ:t_ex<` gives the integral's LaTeX, but the body is X_eTaL, so the typeset formula reads `\int_{0}^{2} (u:b_ox tau) * u:b_ox t - tau \, d\tau`, code inside the math. The plan is to move `integral` into the equation library's grammar, where the body is math notation and typesets as math.
- **The drawing.** For the same reason, the call above is shown as typed: the renderer cannot yet draw a string that mixes the integral's notation with X_eTaL. Drawing a notation string properly is a planned step in X_eTaL.
- **The name.** `integ:i_ntegral<` says "integral" twice, the same problem the pipeline macro's first name had; a better name is to be decided.

## A family of convolutions

The plan lists the variants that follow, each with its own check, a fixture that is not symmetric, and its own animation: 2D image convolution and a CNN layer with its bias, separable Gaussian blur as two 1D passes, dilated, transposed, circular, by FFT, and 3D over voxels. Each has a trap the tests are meant to catch: a transposed convolution is not an inverse, a circular one is not a linear one without padding, and an FFT convolution without enough padding wraps around. A convolution names how it treats the edges, `full`, `same`, `valid` or `circular`, with no default, because libraries and traditions disagree about which one is natural. The FFT waits for complex numbers in the language.

## Animated from the same numbers

The first video planned compares the asymmetric 1D convolution, the correlation, and the continuous box-function integral: the equation, the current stage, the products, the running total, and the triangle drawn as `t` advances. Every number in it comes from the X_eTaL computation, through the same `Video.xtl` library and fixed Blender player as the videos in [post #9](/2026/10/15/array-languages-xetal-blender/). Blender draws; it does not compute the convolution again.

