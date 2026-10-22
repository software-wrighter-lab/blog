---
layout: post
title: "Array Languages #12: ML Pipelines as X_eTaL Macros"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, macros, machine-learning, pipelines, softmax, layer-norm, mlp, notation]
keywords: "X_eTaL pipeline macro, ML data flow left to right, pipe operator in an array language, stable softmax, layer norm, MLP, residual connection, shape contracts, raw strings, macros instead of syntax"
abstract: "Twelfth in the Array Languages series: a macro that writes an ML model's data flow left to right, data first and then each layer in turn, in a language that reads right to left. Stages can be named for later use and given shapes that are checked, a pipeline can be written one stage per line, and the whole thing expands to ordinary X_eTaL that xetal expand shows. It is a library, Flow, in X_eTaL-ML, checked against hand-written code and against random pipelines."
series: "Array Languages"
series_part: 12
date: 2026-10-18 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-ML"
    title: "X_eTaL-ML (the Flow library)"
---

<!-- DRAFT (rewritten 2026-10-18 afternoon from X_eTaL-ML's committed Flow: a5e4463 "Flow's pipelines written as code strings, drawn as
     X_eTaL", pinned to X_eTaL 4453400b; Flow rename 2c28acf; bias 496e462). Every listing is xetal render output (X_eTaL main
     f027bb74, clean build) of the committed source; every output is a run of the committed libs (clean export) with that build:
     demos/mlp (XOR 1 2 2 1, softmax 0.0900 0.2447 0.6652, s_hape H 4 3), tests/oracle (7 checks), tests/shape-fails (located error),
     tests/reject-* (.err goldens), xetal expand demos/mlp (unchanged). |> typed, drawn ▷ (S13); $name typed, drawn ▹name (S14);
     code strings c"..." (ST5, step 111). Error output is shown as the tools print it (typed source in the error's snippet).
     X_eTaL step 112 MERGED (#146, D176): code strings lexed with the file; parsed/linted/type-checked only where a macro says
     ## takes: code. Flow's p_ipe< and t_ext< keep no takes: line (notation): their strings are LEXED ONLY. Flow pins 4453400b (pre-112).
     NOT YET: X_eTaL-ML step 028 pipeline-demos (four ways: math, pipeline, expansion, plain X_eTaL; the CNN layer) pending;
     static shape proof of ▹h [..] annotations (run-time check only); CMS-style segments (\) and a named sub-pipe macro are design only
     (fan-out/fan-in by labels, subpipes as function stages and p_ower inside a stage work); no pipeline diagram/trace yet.
     Lead image FOR NOW (Mike): his screenshot of a CNN layer as five stages with shapes, not inverted. -->

<img src="{{ '/assets/images/posts/block-cnn-pipeline-stages.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[Post #11](/2026/10/17/array-languages-xetal-equations/) turned an equation, as a paper prints it, into array code with one macro call. A model is more than one equation, though: it is data flowing through layers, one after another, and that is how papers draw it and how people describe it, left to right. X_eTaL, like APL, reads right to left. This post is the macro that lets a model be written the way it is drawn.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The library** | [Flow](https://github.com/softwarewrighter/X_eTaL-ML/tree/main/libs/Flow) in X_eTaL-ML · [its reference](https://github.com/softwarewrighter/X_eTaL-ML/blob/main/libs/Flow/docs/README.md) |
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

The library is `Flow`, in X_eTaL-ML, beside the neural-network functions its stages call. Its demo is a small two-layer network over four points, written one stage per line:

```text
"nn:" u̲se< "NN"
"flow:" u̲se< "Flow"
Y ← @ ᶠˡᵒʷp̲ipe< c"
   X
▷ it ⁿⁿd̲ense W1
▷ ⁿⁿr̲elu
▷ it ⁿⁿd̲ense W2
▷ ⁿⁿs̲oftmax"
```

Read it the way it is written: start from the data `X`, apply the first dense layer, then a ReLU, then the second dense layer, then a softmax. The figure shows each stage and the shape it produces. By hand, in X_eTaL, the same network reads right to left, with the last step first:

```text
ⁿⁿs̲oftmax (ⁿⁿr̲elu X ⁿⁿd̲ense W1) ⁿⁿd̲ense W2
```

The network's weights are set by hand so that it separates the four points of XOR: the demo prints the class each point gets, `1 2 2 1`, the two points that differ in one input in one class and the other two in the other. It also computes the network by hand, and the two results are identical, to the last digit.

The `c"..."` is a code string, new in the language this week. Its value is an ordinary string, the same characters the macro has always received, but the `c` tells every tool that the inside is X_eTaL, so the renderer draws each stage as code, as above, rather than as quoted text. It can run across as many lines as it needs. Between the stages is `|>`, typed as two characters and drawn as `▷`; it is a token of its own, which means something only inside a macro's text and is an error in ordinary code.

<div style="clear: both;"></div>

## The rules

Stages are separated by `▷`. The first stage is the data. Every later stage is one of three things:

- **A function,** applied to the previous value: `ⁿⁿr̲elu`, a train, `'+ r̲/`, or a quoted lambda.
- **An expression that names the previous value `it`:** `it ⁿⁿd̲ense W1`, `it − m`, `m − it`. Where order matters, it is written, never guessed.
- **An expression of names bound earlier in the pipeline,** which is how a model branches and joins.

A label keeps a stage's value for later stages: `$m`, typed with a dollar sign and drawn `▹m`, at the end of a stage. A later stage that names `m` reads it, so a value can fan out to several stages and several values can fan in to one; `▹(Q, K, V)` takes a tuple apart. A shape after the label, as in `▹h [4 3]`, is a promise the macro checks.

## Names: a stable softmax

The stable softmax subtracts the maximum before exponentiating, so large scores cannot overflow:

```text
@ ᶠˡᵒʷp̲ipe< c"z ▷ 'm̲ax r̲/ it ▹m ▷ e̲xp z − m ▹e ▷ e ÷ '+ r̲/ e"
```

Start from the scores `z`; take their maximum and label it `m`; raise e to `z − m` and label it `e`; divide `e` by its sum. The third stage reads `z` and `m` and the fourth reads `e` twice: that is fan-out and fan-in, with nothing more than names. Four stages, in the order the math is explained, and with `z := 1 2 3` the result is the library's own softmax, `0.0900 0.2447 0.6652`.

## What it becomes

<div class="aside-box outdent-left" markdown="1">
**What is `it`?** An anaphor is a word that points back to something already said: in "take the scores and normalize it", *it* means the scores. Programming borrowed the word for macros that bind a name for the code written at their call; the best known is the anaphoric `aif` in Paul Graham's *On Lisp*, which binds `it` to the value its test produced. In a pipeline, `it` is the previous stage's value, and writing it says where that value goes, which matters wherever order does: `it − m` is not `m − it`. It is `it` because it reads as English and is short, and Kotlin and Groovy use the same word for the same job.

**Why it is safe.** Hygiene is the question of whether names a macro writes can collide with names in the code around its call. In X_eTaL hygiene is a choice, as in Common Lisp rather than Scheme. The pipeline macro's own names come fresh from the language, `g1:stage`, `g2:stage` and so on, so they cannot collide with anything. `it` is the deliberate exception, declared in the macro's contract with `## binds: it`: a stage may read it, but may not bind an `it` of its own, and a label named `it` is refused.
</div>

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

A residual connection is "double it, then add back the input". Written by hand in X_eTaL as `2 × x + x`, it reads right to left as `2 × (x + x)`, which is not a residual. As a pipeline it reads the way it is meant:

```text
@ ᶠˡᵒʷp̲ipe< c"x ▹s ▷ 2 × it ▷ it + s"
```

With `x := 1 2 3 4` it gives `3.0 6.0 9.0 12.0`.

## Shapes, checked

A shape written after a name is a contract. Here the second stage promises a vector of length `n`, which is 3, and breaks it:

```text
@ ᶠˡᵒʷp̲ipe< c"x ▷ 2 × it ▹y [n] ▷ y + 1"
```

```text
error[shape]: stage 2 (y): shape 4, expected 3
 --> tests/shape-fails.xtl:6:1
  |
6 | @ flow:p_ipe< c"x |> 2 * it $y [n] |> y + 1"
  | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

The error names the stage and its label, the shape it got and the one promised, and the line it came from, shown, as an error message shows source, as typed.

For now the check runs when the program runs, which is better than a wrong answer but later than it could be. A shape check that proves or refutes these promises before the program runs is planned in X_eTaL; the run-time check stays as the backstop.

## A reader that cannot drop text

The pipeline macro is a reader, like the equation macro, and it was written after the equation macro's reader was caught dropping text and giving silent wrong answers. So every rule of this one uses all of its text or refuses the call when the program is compiled, naming what it could not use:

```text
error[bad-pipeline]: a shape is [extents] at the stage's end, nothing after it: [4] extra
error[bad-pipeline]: the first stage is the data; nothing precedes it: it * 2
error[bad-pipeline]: a name is bound once in a pipeline: m
error[bad-pipeline]: a stage is a function (nn:r_elu, [f_ g_], '{ x -> ... }) or an expression naming the previous value it (or a name bound before it): 3
error[bad-pipeline]: $ labels a stage and touches the name or tuple it gives ($m, $(Q, K)): x $ m
```

The library's tests go further than single cases. The five pipelines from the design, linear regression, the stable softmax, layer norm, a small MLP and the residual, must each equal their hand-written versions, written on one line and one stage per line. A differential test runs every kind of stage, in every order, against plain X_eTaL. And `ᶠˡᵒʷt̲ext<` writes back what the macro read, so a test can check that it read exactly what was written.

<div style="clear: both;"></div>

## What comes next

A dense layer's bias no longer has to be reshaped by hand: the stage `b ⁿⁿb̲ias it` adds it along the right axis, and refuses a bias of the wrong length. Next in X_eTaL-ML are the real models as pipelines, each shown four ways, side by side: as the equation of post #11, as a pipeline, as the expansion, and as plain X_eTaL. And in X_eTaL, every code string is now read with the rest of the file: a pipeline's string is lexed when the program is, so a stray character in a stage is an error before the macro runs. Full checking inside, linting and type-checking each stage on its own, applies where a macro takes plain X_eTaL; a pipeline's string mixes X_eTaL with its own notation, `▷` and labels, so its stages are still checked as the macro expands them. Because a pipeline is ordinary X_eTaL once expanded, it can go where any X_eTaL program goes, including the GPUs of [post #7](/2026/10/13/array-languages-xetal-gpu/) and [post #10](/2026/10/16/array-languages-xetal-mojo-metal/), and the step-by-step Blender videos of [post #9](/2026/10/15/array-languages-xetal-blender/).

The first of those is now in X_eTaL-ML: one CNN layer written [four ways](https://github.com/softwarewrighter/X_eTaL-ML/blob/main/demos/pipelines/rosetta.xtl), all giving the same feature maps. As a paper prints it, through the equation macro:

```text
eq ← "Y[o,h,w] | O Ho Wo" ᵉe̲q< "max((sum r:=0..2, sum s:=0..2 | P[h+r,w+s] * F[o,r,s]) + B[o], 0)"
```

As a pipeline, the picture's windows, one matrix product with the filters, the bias along the filters' axis, the maps shaped and checked, then the activation:

```text
pipe ← @ ᶠˡᵒʷp̲ipe< c"
   1 5 5 r̲eshape P
▷ ᶜᵛw̲indows
▷ ((O c̲at 9) r̲eshape F) '+ '× i̲nner it
▷ (1, B) ⁿⁿa̲ddAxis it
▷ (O c̲at Ho c̲at Wo) r̲eshape it ▹Y [O Ho Wo]
▷ ⁿⁿr̲elu Y"
```

And as plain X_eTaL, the Conv library's layer:

```text
plain ← ⁿⁿr̲elu (O c̲at Ho c̲at Wo) r̲eshape ((O c̲at 9) r̲eshape F, B) ᶜᵛc̲onv 1 5 5 r̲eshape P
```

The fourth way is the pipeline's expansion, which `xetal expand` shows. The demo checks that the equation agrees with the pipeline and the pipeline with plain X_eTaL, on a picture chosen so the maps are not all zero, and both checks pass. It also runs in X_eTaL-ML's [live demo](https://softwarewrighter.github.io/X_eTaL-ML/pipelines/).

---

<p class="ed-note" style="font-size: 0.85em;"><em>[Ed. 2026/10/21: Added the CNN layer written four ways, the first of the side-by-side models this post said were next, now in X_eTaL-ML (<a href="https://github.com/softwarewrighter/X_eTaL-ML/commit/f51180e">f51180e</a>); this post's <a href="https://github.com/software-wrighter-lab/blog/commits/main/_posts/2026-10-18-array-languages-xetal-pipelines.md">history</a>.]</em></p>

