---
layout: post
title: "Array Languages #12: ML Pipelines as X_eTaL Macros"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, macros, machine-learning, pipelines, softmax, layer-norm, notation]
keywords: "X_eTaL pipeline macro, ML data flow left to right, pipe operator in an array language, stable softmax, layer norm, MLP, residual connection, shape contracts, macros instead of syntax"
abstract: "Twelfth in the Array Languages series, a design before the code: a macro that writes an ML model's data flow left to right, data first and then each transform in turn, in a language that reads right to left. Stages can be named for later use and given shapes that are checked, and the whole thing lowers to ordinary X_eTaL, with no change to the language."
series: "Array Languages"
series_part: 12
date: 2026-10-18 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL"
    title: "X_eTaL"
---

<!-- DRAFT, A PLAN (2026-10-15): split from #11 per Mike ("One for Math equation xetal macros, first. the 12 post for ML
     pipelined expression macros, second."). Source: X_eTaL docs/spatial.md "Pipelines" (Saga 41 step 099, D155), UNCOMMITTED
     on 10/15, still being designed; docs/spatial-poc/pipes-oracle.xtl (untracked) holds the hand-written equivalents.
     Nothing runs yet. Recheck every detail against the repo before publishing. Date provisional.
     Lead image FOR NOW (Mike): his screenshot of a CNN layer as five stages with shapes, not inverted. -->

<img src="{{ '/assets/images/posts/block-cnn-pipeline-stages.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[Post #11](/2026/10/17/array-languages-xetal-equations/) turned an equation, as a paper prints it, into array code with one macro call. An ML model is more than one equation, though: it is data flowing through layers, one after another. This is the second macro in the same library, still being designed: a pipeline that writes that flow left to right, the way it is drawn and described, in a language that reads right to left.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The design** | [docs/spatial.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/spatial.md) --- equations and pipelines |
| **The thread** | [Array Languages #11: equations](/2026/10/17/array-languages-xetal-equations/) · [Array Languages #5: X_eTaL-ML](/2026/10/11/array-languages-xetal-ml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## Three directions

Each notation keeps its own reading direction, and the macro expansion is where they meet:

- **Equations read inside out,** as the paper prints them: sums outermost first, the summand inside.
- **Pipelines read left to right:** the data first, then each transform in turn.
- **X_eTaL reads right to left,** as APL does. Both macros lower to ordinary X_eTaL, which `xetal expand` shows.

## The call

Stages are separated by `|>`. The first is the data; each one after it transforms the value before it. A small network:

```text
Y ← @ ᵉp̲ipe< "X |> W1 nn:d_ense it |> nn:r_elu |> W2 nn:d_ense it |> nn:s_oftmax"
```

- **Stages are X_eTaL,** type-checked like any code and copied into the expansion as written. A stage is either a function, applied to the previous value, like `nn:r_elu`, or an expression that names the previous value `it`. Order is explicit where it matters: `it - m` or `m - it`.
- **Names** keep a stage's value: ` : name` at the end of a stage, and later stages use the name directly, so a branch and a join need nothing more. Each stage is evaluated once, and a name bound twice is rejected.
- **Shapes** are contracts. An optional shape after a name is proved or refuted by a shape check before the program runs where it can be, and checked after the stage at run time where it cannot: `error[shape]: stage 3 (conv): shape 2 8 6 6, expected 2 8 4 4`.
- **A stage may be an equation.** A call to the equation macro from post #11 is just a value, so a convolution written as its triple sum can sit in the middle of a pipeline.

## Stable softmax, step by step

The stable softmax subtracts the maximum before exponentiating, so large scores do not overflow:

```text
p ← @ ᵉp̲ipe< "z |> 'm_ax r_/ it : m |> e_xp z - m : e |> e / '+ r_/ e"
```

Read left to right: start from the scores `z`; take their maximum and call it `m`; raise e to `z - m` and call it `e`; divide `e` by its sum. Four stages, in the order the math is explained.

## Why direction matters

A residual connection is "double it, then add back the input". Written by hand in X_eTaL as `2 * x + x`, it reads right to left as `2 * (x + x)`, which is not a residual. As a pipeline it reads the way it is meant:

```text
x : s |> 2 * it |> it + s
```

## Checked before it is built

Each example in the design has a hand-written X_eTaL equivalent, and the pipeline must print exactly what that equivalent prints:

| Example | Pipeline | Expected |
|---|---|---|
| Linear regression | `X \|> it '+ '* i_nner W : P \|> P + (s_hape P) r_eshape b` | `14 25` / `20 31` |
| Stable softmax | `z \|> 'm_ax r_/ it : m \|> e_xp z - m : e \|> e / '+ r_/ e` | `0.0900 0.2447 0.6652` |
| Layer norm | `x \|> ('+ r_/ it) / f_loat t_ally it : mu \|> x - mu : c \|> ('+ r_/ c * c) / f_loat t_ally c : v \|> c / v ^ 0.5` | `-1.3416 -0.4472 0.4472 1.3416` |
| MLP | `X \|> it '+ '* i_nner W1 \|> 0 m_ax it \|> it '+ '* i_nner W2` | `2` / `2` |
| Residual | `x : s \|> 2 * it \|> it + s` | `3.0 6.0 9.0 12.0` |

## Where it stands

The pipeline design is being worked out now, beside the equation macro, in the same library and with the same rule: no change to the language unless one is justified. Planned with the report step: a trace of each stage's name, shape and a sample, and a drawing of the pipeline. Because a pipeline is ordinary X_eTaL once expanded, it can go where any X_eTaL program goes, including the GPUs of [post #7](/2026/10/13/array-languages-xetal-gpu/) and the step-by-step Blender videos of [post #9](/2026/10/15/array-languages-xetal-blender/).

</div>
