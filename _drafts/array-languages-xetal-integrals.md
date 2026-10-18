---
layout: post
title: "Array Languages #13: Integrals and Continuous Convolution in X_eTaL"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, macros, machine-learning, integrals, convolution, quadrature, latex, blender, notation]
keywords: "X_eTaL integral macro, continuous convolution, convolution versus cross-correlation, numerical integration in an array language, trapezoid rule, quadrature, box function convolution, triangle function, LaTeX from code, Blender animation of convolution"
abstract: "Thirteenth in the Array Languages series, a plan with its decisions taken: after sums and pipelines, integrals. A continuous convolution is an integral, and a computer can only approximate one, so the plan keeps the mathematics and the numerical method apart: an integral written as the paper prints it, typeset exactly, and computed by a stated rule on a stated grid, with improper integrals refused rather than quietly cut short. The first deliverable is a short Blender video, drawn from X_eTaL's own numbers, comparing convolution, correlation and the integral of two box functions."
series: "Array Languages"
series_part: 13
date: 2026-10-19 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT, A PLAN WITH DECISIONS (rewritten 2026-10-17 evening from X_eTaL 6c0bf1c9, docs/plan.md "Saga 42 (proposed) -- integrals",
     its eight decisions taken with Mike 2026-10-17 "for now"; the design note docs/convolutions/integrals.md). Nothing built.
     Run here on 2026-10-17 with X_eTaL-libraries origin/main (0f82f93, clean export): the correlation e:b_oth< call gives
     r_{n} = \sum_{k=0}^{2} x_{n+k} \, h_{k} and 14 20; dx * '+ r_/ q gives 1.0.
     Decision 6 SETTLED late 10/17 (cloud agent's pipeline-topologies design): stages naming earlier stages without it are allowed.
     STILL TO RAISE: the plan lists code strings as available though step 111 is pending (c"..." is bad-string on main 6c0bf1c9).
     If the post keeps "Pipelines that join", recheck it against the topology design (segments and labels) once it is committed.
     2026-10-18: labels become $name (drawn ▹name), the library Flow (flow:p_ipe<); "Pipelines that join" uses ": f_samples" today: rewrite it
     as a fan-in with labels once that lands (a stage may name several labels, so it × f_samples may become a plain join).
     Links to #11 and #12 assume they publish 10/17 and 10/18. Date provisional.
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


## One computation, four views

The aim is one computation shown four ways, all from the same numbers: the equation, the pipeline, the X_eTaL it expands to, and a Blender animation. Some things are ruled out from the start: implicit broadcasting, shape errors that pass silently, a second copy of the math written in Python for the pictures, and a numerical method chosen without saying so.

## First, the discrete case

Convolution and cross-correlation are easy to confuse, because with a symmetric kernel they give the same answer. So the first example uses one that is not symmetric. With `x = 1 2 3 4` and `h = 1 2 3`, the two windows that fit are `1 2 3` and `2 3 4`. Convolution reverses the kernel to `3 2 1` and gives `10 16`; cross-correlation, which is what CNNs compute, uses it as it is and gives `14 20`. The correlation is already a sum the equation macro can write:

```text
r ← "r[n] | 2" ᵉe̲q< "sum k:=0..2 | x[n+k] * h[k]"
```

Full convolution, where the kernel hangs off the ends, needs a rule for the values outside the input, zeros for one. The plan calls for that rule to be written down too, never assumed.

## Then the integral

The continuous convolution of two functions is

```text
(f * g)(t) = ∫ f(τ) g(t − τ) dτ,   τ from −∞ to ∞
```

The example on the card at the top of this post: two box functions, each 1 between 0 and 1 and 0 elsewhere. As one slides across the other, their overlap grows from 0 to 1 and shrinks back, so the result is a triangle, `t` rising to 1 at `t = 1`, then `2 − t` falling to 0 at `t = 2`.

`integral` will be an operator word in the equation library, beside `sum`, `prod`, `max` and `min`, and it reads the same way. The decided form of the call is

```text
integral tau:=a..b | f(tau) * g(t - tau)
```

with the numerical method written into the binding when it matters, `integral tau:=a..b by trapezoid 64`, and a documented default, the trapezoid rule on 64 intervals, so the plain form works. The LaTeX is exact either way; the value is an approximation, and the program says which one.

Some integrals are refused outright. A paper's convolution runs from minus infinity to infinity, and a computer cannot. Rather than quietly replace infinity with a finite bound, an improper integral is refused, and the message names the two ways out: write the truncation you mean, such as `tau:=0..2` for two box functions that are zero outside it, or change the variable so the range is finite.

The trapezoid rule shows how small the array part is. With samples `q` taken every `dx`, the integral is about `dx` times the sum of the samples, less half of the two end samples. When the ends are 0, as they are for this fixture from the plan, it is one line:

```text
q ← f̲loat 0 0.5 1 0.5 0
dx ← 0.5
dx × '+ r̲/ q
```

It gives `1.0`, the area under that triangle.

## A family of convolutions

The plan lists the variants that follow, each with its own check, a fixture that is not symmetric, and its own animation: 2D image convolution and a CNN layer with its bias, separable Gaussian blur as two 1D passes, dilated, transposed, circular, by FFT, and 3D over voxels. Each has a trap the tests are meant to catch: a transposed convolution is not an inverse, a circular one is not a linear one without padding, and an FFT convolution without enough padding wraps around.

Some choices are settled:

- **Where it lives.** `integral` and its numerical rules go into the equation library, one grammar and one reader; the convolution helpers, windows, padding and the like, go into X_eTaL-ML, beside the neural-network functions they serve.
- **Boundary modes.** A convolution names how it treats the edges, `full`, `same`, `valid` or `circular`, and there is no default: a missing mode is refused, because libraries and traditions disagree about which one is natural.
- **`convolve` and `correlate`** are library macros that expand to `sum`, not new words in the grammar, so the equation notation stays one grammar.
- **The FFT waits** for complex numbers in the language, rather than being written over pairs of floats now and replaced later.
- **The transposed convolution** is built, for now, as the transpose of an explicit forward matrix, which is also its check, until the language can add into an array at given positions.

## Pipelines that join

The integral also tests the pipeline macro of post #12. Sample a grid, evaluate `f` on it, evaluate the shifted `g` on the same grid, multiply, then sum: the multiply joins two earlier results. Pipelines already join through names: name the samples, `: f_samples`, and write the joining stage with `it`, as `it × f_samples`, so the data flow stays visible.

## Animated from the same numbers

The first deliverable is a 60 to 90 second Blender video comparing the asymmetric 1D convolution, the correlation, and the continuous box-function integral: the equation, the current pipeline stage, the products, the running total, and the result, the triangle drawn as `t` advances, with the integral's strips and their weights shown. Every number in it comes from the X_eTaL computation, through the same `Video.xtl` library and fixed Blender player as the videos in [post #9](/2026/10/15/array-languages-xetal-blender/). Blender draws; it does not compute the convolution again. A trace of every step, its stage, shapes, boundary mode, grid, samples and contributions, is planned as one data form that the video, a report and a future debugger all read.

## Where it stands

The plan and its decisions are written and taken. Nothing for integrals is built yet: the equation library has no `integral` word, and the convolution helpers do not exist. What does exist runs today: the correlation above, written with the equation macro, gives `14 20`, and the trapezoid sum gives `1.0`. Like the equations, all of this is planned as libraries on the language as it is.

