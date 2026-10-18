---
layout: post
title: "Array Languages #12: ML Pipelines as X_eTaL Macros"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, macros, machine-learning, pipelines, softmax, layer-norm, mlp, notation]
keywords: "X_eTaL pipeline macro, ML data flow left to right, pipe operator in an array language, stable softmax, layer norm, MLP, residual connection, shape contracts, raw strings, macros instead of syntax"
abstract: "Twelfth in the Array Languages series: a macro that writes an ML model's data flow left to right, data first and then each layer in turn, in a language that reads right to left. Stages can be named for later use and given shapes that are checked, a pipeline can be written one stage per line, and the whole thing expands to ordinary X_eTaL that xetal expand shows. It is a library, Pipeline, in X_eTaL-ML, checked against hand-written code and against random pipelines."
series: "Array Languages"
series_part: 12
date: 2026-10-18 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-ML"
    title: "X_eTaL-ML (the Pipeline library)"
---

<!-- DRAFT (rewritten 2026-10-17 afternoon from X_eTaL-ML's step 022, pipeline-macro, UNCOMMITTED while its gate runs: libs/Pipeline
     src/Pipeline.xtlm, docs/README.md, demos/mlp.xtl, tests/ oracle, differential, roundtrip, shape-fails, 14 reject-*).
     Every output below was run here on 2026-10-17 ~14:00 with the ML repo's pinned xetal (b8a6ac3b): just demo-lib Pipeline mlp,
     just run-lib Pipeline oracle / shape-fails / roundtrip, just expand-lib Pipeline mlp, and the reject-*.err goldens.
     RECHECK against the commit when it lands (and again after 023 pipeline-bias and 024 pipeline-demos, the Rosetta Stone).
     2026-10-17 ~15:00: COMMITTED as 8c758a1 (14:31); re-run on the commit: outputs, expansion, errors unchanged. The demo's weights
     were fixed (now XOR: argmax 1 2 2 1, checked by hand); the comment now says "it nn:d_ense W1". Steps next: gate-affected (begun),
     then pipeline-bias, pipeline-demos.
     2026-10-17 evening (Mike): the pipeline DESIGN IS NOT FINAL; a cloud agent is still working on it. Publishing goal: 10/18
     AFTERNOON, when the design, implementation and demos should be ready. Rewrite from what is committed then (expect changes to the
     rules, e.g. whether a stage may name earlier stages without it: X_eTaL Saga 42 decision 6 says refused; Pipeline 8c758a1 accepts).
     2026-10-17 late (Mike relayed the cloud agent): pipeline-topologies.md (NOT PUSHED anywhere yet) recommends CMS-style segments
     separated by \, wiring only at a segment's start (a label or a tuple: fan-out, fan-in, several outputs), a stage sees only the
     stage before it inside a segment, pipe:s_ub< for sub-pipes; every edge declared, so diagram, trace and shape lint see all edges.
     Decision 6 SETTLED: stages naming earlier stages without it are allowed (X_eTaL's own spatial.md examples use them).
     Code strings are now c"..." (multi-line, escapes) and c#"..."# (verbatim), no cr"..." (X_eTaL 53130942, 0c525d74); not built yet.
     2026-10-18 (Mike relayed the cloud agent): CODE STRINGS COMING (X_eTaL step 111) and a DECISION on the pipe symbol, option A:
     |> is typed and drawn as ▷ by the renderer; |> is its own punctuation token (Pipe), not a symbol (symbols are dyadic functions);
     in ordinary code |> is an error with a clear message for now (a real |> operator, option E, left for later). So the network
     listing will be written @ pipe:p_ipe< c"..." and rendered as:
         Y ← @ ᵖⁱᵖᵉp̲ipe< c"
            X
         ▷ it ⁿⁿd̲ense W1
         ▷ ⁿⁿr̲elu
         ▷ it ⁿⁿd̲ense W2
         ▷ ⁿⁿs̲oftmax"
     When it lands: rewrite every pipeline example from the committed demos, rendered by xetal render itself (no per-stage stand-in),
     ▷ in rendered code, |> only where the post talks about what is typed; recheck the figure's stage boxes; check its decision ID.
     RENDERING: stages are shown rendered one by one (xetal render on each stage) because the renderer draws a string as typed;
     X_eTaL code strings c"..." (ST5, docs/code-strings.md, steps 111-112) will make the renderer do it; re-render from source then.
     Lead image FOR NOW (Mike): his screenshot of a CNN layer as five stages with shapes, not inverted. -->

<img src="{{ '/assets/images/posts/block-cnn-pipeline-stages.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[Post #11](/2026/10/17/array-languages-xetal-equations/) turned an equation, as a paper prints it, into array code with one macro call. A model is more than one equation, though: it is data flowing through layers, one after another, and that is how papers draw it and how people describe it, left to right. X_eTaL, like APL, reads right to left. This post is the macro that lets a model be written the way it is drawn.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The library** | [Pipeline](https://github.com/softwarewrighter/X_eTaL-ML/tree/main/libs/Pipeline) in X_eTaL-ML · [its reference](https://github.com/softwarewrighter/X_eTaL-ML/blob/main/libs/Pipeline/docs/README.md) |
| **The design** | [docs/spatial.md](https://github.com/softwarewrighter/X_eTaL/blob/main/docs/spatial.md), "Pipelines", in X_eTaL |
| **The thread** | [#11: equations](/2026/10/17/array-languages-xetal-equations/) · [#5: X_eTaL-ML](/2026/10/11/array-languages-xetal-ml/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>


## Three directions

Each notation keeps its own reading direction, and the macro expansion is where they meet:

- **Equations read inside out,** as the paper prints them: sums outermost first, the summand inside.
- **Pipelines read left to right:** the data first, then each transform in turn.
- **X_eTaL reads right to left,** as APL does. Both macros expand to ordinary X_eTaL, which `xetal expand` shows.

## A network, left to right

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 30%;">
<img src="{{ '/assets/images/posts/xetal-pipe-mlp.webp' | relative_url }}" class="no-invert" alt="A two-layer network as a column of stages, top to bottom, each with the shape it produces: X, 4 by 2; it nn:d_ense W1, 4 by 3; nn:r_elu, 4 by 3; it nn:d_ense W2, 4 by 2; nn:s_oftmax, 4 by 2.">
<figcaption style="font-size: 0.85em;">The demo network, stage by stage, with the shape each produces. Click to enlarge.</figcaption>
</figure>

The library is `Pipeline`, in X_eTaL-ML, beside the neural-network functions its stages call. Its demo is a small two-layer network over four points, written one stage per line:

```text
"nn:" u̲se< "NN"
"pipe:" u̲se< "Pipeline"
Y ← @ ᵖⁱᵖᵉp̲ipe< r"
   X
|> it ⁿⁿd̲ense W1
|> ⁿⁿr̲elu
|> it ⁿⁿd̲ense W2
|> ⁿⁿs̲oftmax"
```

Read it the way it is written: start from the data `X`, apply the first dense layer, then a ReLU, then the second dense layer, then a softmax. The figure shows each stage and the shape it produces. By hand, in X_eTaL, the same network reads right to left, with the last step first:

```text
ⁿⁿs̲oftmax (ⁿⁿr̲elu X ⁿⁿd̲ense W1) ⁿⁿd̲ense W2
```

The network's weights are set by hand so that it separates the four points of XOR: the demo prints the class each point gets, `1 2 2 1`, the two points that differ in one input in one class and the other two in the other. It also computes the network by hand, and the two results are identical, to the last digit.

The `r"..."` is a raw string, new in the language this week: its text is kept exactly as written, across as many lines as it needs, so a pipeline can be laid out one stage per line. It is the one change to the language this work asked for, and it is only a new way to write a string, not a new kind of value.

<div style="clear: both;"></div>

## The rules

Stages are separated by `|>`, which means nothing else in X_eTaL. The first stage is the data. Every later stage is one of three things:

- **A function,** applied to the previous value: `ⁿⁿr̲elu`, a train, `'+ r̲/`, or a quoted lambda.
- **An expression that names the previous value `it`:** `it ⁿⁿd̲ense W1`, `it − m`, `m − it`. Where order matters, it is written, never guessed.
- **An expression of names bound earlier in the pipeline,** which is how a model branches and joins.

A name after a colon, as in `x : m`, keeps a stage's value for later stages, and `x : (Q, K, V)` takes a tuple apart. A shape after the name, as in `x : h [4 3]`, is a promise the macro checks.

## Names: a stable softmax

The stable softmax subtracts the maximum before exponentiating, so large scores cannot overflow:

```text
@ ᵖⁱᵖᵉp̲ipe< "z |> 'm̲ax r̲/ it : m |> e̲xp z − m : e |> e ÷ '+ r̲/ e"
```

Start from the scores `z`; take their maximum and call it `m`; raise e to `z - m` and call it `e`; divide `e` by its sum. Four stages, in the order the math is explained, and with `z := 1 2 3` the result is the library's own softmax, `0.0900 0.2447 0.6652`.

## What it becomes

The macro writes ordinary X_eTaL, laid out as a program, one line per stage. This is the network above, from `xetal expand`:

```text
Y ← ({ @ →
  g1:stage ← X
  g2:stage ← { @ →
    it ← g1:stage
    it ⁿⁿd̲ense W1
  } @
  g3:stage ← ⁿⁿr̲elu g2:stage
  g4:stage ← { @ →
    it ← g3:stage
    it ⁿⁿd̲ense W2
  } @
  g5:stage ← ⁿⁿs̲oftmax g4:stage
  g5:stage
} @)
```

Each stage's value gets a name of its own, fresh from the language so it cannot clash with the program's. A function stage is applied to the stage before it; a stage that says `it` gets a small block where `it` is that value. Nothing is evaluated twice, and the last stage is the result.

## Why direction matters

A residual connection is "double it, then add back the input". Written by hand in X_eTaL as `2 * x + x`, it reads right to left as `2 * (x + x)`, which is not a residual. As a pipeline it reads the way it is meant:

```text
@ ᵖⁱᵖᵉp̲ipe< "x : s |> 2 × it |> it + s"
```

With `x := 1 2 3 4` it gives `3.0 6.0 9.0 12.0`.

## Shapes, checked

A shape written after a name is a contract. Here the second stage promises a vector of length `n`, which is 3, and breaks it:

```text
@ ᵖⁱᵖᵉp̲ipe< "x |> 2 × it : y [n] |> y + 1"
error[shape]: stage 2 (y): shape 4, expected 3
```

For now the check runs when the program runs, which is better than a wrong answer but later than it could be. A shape check that proves or refutes these promises before the program runs is planned in X_eTaL; the run-time check stays as the backstop.

## A reader that cannot drop text

The pipeline macro is a reader, like the equation macro, and it was written after the equation macro's reader was caught dropping text and giving silent wrong answers. So every rule of this one uses all of its text or refuses the call when the program is compiled, naming what it could not use:

```text
error[bad-pipeline]: a shape is [extents] at the stage's end, nothing after it: [4] extra
error[bad-pipeline]: the first stage is the data; nothing precedes it: it * 2
error[bad-pipeline]: a name is bound once in a pipeline: m
error[bad-pipeline]: a stage is a function (nn:r_elu, [f_ g_], '{ x -> ... }) or an expression naming the previous value it (or a name bound before it): 3
```

The library's tests go further than single cases. The five pipelines from the design, linear regression, the stable softmax, layer norm, a small MLP and the residual, must each equal their hand-written versions, written on one line and one stage per line. A differential test runs every kind of stage, in every order, against plain X_eTaL. And `ᵖⁱᵖᵉt̲ext<` writes back what the macro read, so a test can check that it read exactly what was written.

<div style="clear: both;"></div>

## What comes next

Two steps follow in X_eTaL-ML. A bias helper, so a dense layer's bias is added along the right axis by name instead of reshaped by hand, as linear regression does today: `P + (s̲hape P) r̲eshape b`. Then the real models as pipelines, and one CNN layer shown four ways, side by side: as the equation of post #11, as a pipeline, as the expansion, and as plain X_eTaL. Because a pipeline is ordinary X_eTaL once expanded, it can go where any X_eTaL program goes, including the GPUs of [post #7](/2026/10/13/array-languages-xetal-gpu/) and [post #10](/2026/10/16/array-languages-xetal-mojo-metal/), and the step-by-step Blender videos of [post #9](/2026/10/15/array-languages-xetal-blender/).

