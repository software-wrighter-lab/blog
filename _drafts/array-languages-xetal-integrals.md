---
layout: post
title: "Array Languages #13: Integrals and Continuous Convolution in X_eTaL"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, macros, machine-learning, integrals, convolution, quadrature, latex, blender, notation]
keywords: "X_eTaL integral macro, continuous convolution, convolution versus cross-correlation, numerical integration in an array language, trapezoid rule, quadrature, box function convolution, triangle function, LaTeX from code, Blender animation of convolution"
abstract: "Thirteenth in the Array Languages series, a plan before the code: after sums and pipelines, integrals. A continuous convolution is an integral, and a computer can only approximate one, so the plan keeps the mathematics and the numerical method apart: an integral written as the paper prints it, typeset exactly, and computed only by a quadrature rule, a grid and a tolerance that are stated, never assumed. The first deliverable is a short Blender video, drawn from X_eTaL's own numbers, comparing convolution, correlation and the integral of two box functions."
series: "Array Languages"
series_part: 13
date: 2026-10-19 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT, A PLAN (2026-10-16): Mike: "schedule another post in the A L series after equations and pipelines. A new post for
     integrals or continuous expressions. X_eTaL agent has added this to its plan following pipelines".
     Source: X_eTaL docs/convolutions/integrals.md (design note dated 2026-10-16, UNCOMMITTED on 10/16; its examples are "proposed",
     "not implemented or tested", snippets "not executed") and .agentrail/steps/101-integrals-plan (planning step, not started:
     no saga section in docs/plan.md yet). Recheck against the saga section once it is written; decisions there override this.
     Links to #11 and #12 assume they publish 10/17 and 10/18; fix if the dates move. Date provisional.
     Lead image: Mike's screenshot (continuous convolution card), not inverted, not transparent. -->

<img src="{{ '/assets/images/posts/block-continuous-convolution.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[Post #11](/2026/10/17/array-languages-xetal-equations/) wrote an equation's sums as a macro call, and [post #12](/2026/10/18/array-languages-xetal-pipelines/) wrote a model's data flow left to right. Next in X_eTaL's plan, after the pipelines: integrals. A convolution in a signal-processing textbook is often continuous, an integral rather than a sum, and the step from one to the other is where a computer has to approximate. This post is the plan, written before the code.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The design** | [docs/spatial.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/spatial.md) --- the equation and pipeline macros this builds on |
| **The thread** | [#11: equations](/2026/10/17/array-languages-xetal-equations/) · [#12: pipelines](/2026/10/18/array-languages-xetal-pipelines/) · [#9: Blender](/2026/10/15/array-languages-xetal-blender/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## One computation, four views

The aim is one computation shown four ways, all from the same numbers: the equation, the pipeline, the X_eTaL it expands to, and a Blender animation. Some things are ruled out from the start: implicit broadcasting, shape errors that pass silently, a second copy of the math written in Python for the pictures, and a numerical method chosen without saying so.

## First, the discrete case

Convolution and cross-correlation are easy to confuse, because with a symmetric kernel they give the same answer. So the first example uses one that is not symmetric. With `x = 1 2 3 4` and `h = 1 2 3`, the two windows that fit are `1 2 3` and `2 3 4`. Convolution reverses the kernel to `3 2 1` and gives `10 16`; cross-correlation, which is what CNNs compute, uses it as it is and gives `14 20`. The correlation is already a sum the equation macro can write:

```text
r ← "r[n] | 2" ᵉq̲< "sum k:=0..2 | x[n+k] * h[k]"
```

Full convolution, where the kernel hangs off the ends, needs a rule for the values outside the input, zeros for one. The plan calls for that rule to be written down too, never assumed.

## Then the integral

The continuous convolution of two functions is

```text
(f * g)(t) = ∫ f(τ) g(t − τ) dτ,   τ from −∞ to ∞
```

The example on the card at the top of this post: two box functions, each 1 between 0 and 1 and 0 elsewhere. As one slides across the other, their overlap grows from 0 to 1 and shrinks back, so the result is a triangle, `t` rising to 1 at `t = 1`, then `2 − t` falling to 0 at `t = 2`.

The proposed extension adds `integral` as an operator word beside `sum`:

```text
y ← "y(t)" ᵉt̲ex< "integral tau:=-inf..inf | f(tau) * g(t-tau)"
```

Typesetting that is exact. Computing it is not, and the design keeps the two apart. The LaTeX is the mathematics; the value needs a numerical method, and every part of it is stated in the program: the rule, such as the trapezoid rule or Simpson's; the grid; the tolerance; and, for an integral over an infinite range, how it is cut down or transformed. Infinity is never quietly replaced by a finite bound.

The trapezoid rule shows how small the array part is. With samples `q` taken every `dx`, the integral is about `dx` times the sum of the samples, less half of the two end samples. When the ends are 0, as for one fixture in the design, it is one line:

```text
area ← dx × '+ r̲/ q
```

With `q` of `0 0.5 1 0.5 0` and `dx` of `0.5`, the expected area is `1.0`.

## A family of convolutions

The plan lists the variants that follow, each with its own check and its own animation: 2D image convolution and the CNN's triple sum with its bias, separable Gaussian blur as two 1D passes, dilated, transposed, circular, by FFT, and 3D over voxels. Each has a trap the tests are meant to catch: a transposed convolution is not an inverse, a circular one is not a linear one without padding, and an FFT convolution without enough padding wraps around.

The operator words stay separate: `sum` and `prod` for discrete reductions, `integral` for the continuous one, and `convolve` and `correlate` for the named operations. The design prefers `convolve` as a library macro, whose expansion can be read, over a new primitive in the parser.

## Pipelines that join

The integral also tests the pipeline macro of post #12. Sampling a grid, evaluating `f` on it, evaluating the shifted `g` on the same grid, multiplying, then summing: the shifted evaluation needs the original grid, not the previous stage, and the multiply joins two earlier results. The current rule rejects a stage that does not use `it`, so either a stage is written as a function that takes `it` plus earlier named values, or a join form is designed on purpose. Adding dummy arithmetic just to satisfy the rule is ruled out.

## Animated from the same numbers

The first deliverable is a 60 to 90 second Blender video comparing the asymmetric 1D convolution, the correlation, and the continuous box-function integral: the equation, the current pipeline stage, the products, the running total, and the result, the triangle drawn as `t` advances, with the integral's strips and their weights shown. Every number in it comes from the X_eTaL computation, through the same `Video.xtl` library and fixed Blender player as the videos in [post #9](/2026/10/15/array-languages-xetal-blender/). Blender draws; it does not compute the convolution again.

## Where it stands

A design note exists, and writing the plan for integrals is a step queued in X_eTaL's work now; the integrals themselves are to follow the pipelines. Nothing in it is implemented or tested yet; the examples above are proposed, and the plan, with its decisions and tests, comes first. If it holds, it does so the same way as the equations: without a major change to the core language.

</div>
