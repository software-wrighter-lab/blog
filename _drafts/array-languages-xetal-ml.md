---
layout: post
title: "Array Languages #5: X_eTaL-ML, Where the Machine Learning Is"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, machine-learning, neural-networks, backpropagation, cnn, attention, mixture-of-experts, ternary, k-means, tuples, macros, tttml, sw-mlpl, rosetta-m]
keywords: "X_eTaL ML, machine learning in an array language, neural networks, backpropagation, Tiny CNN, MNIST, training in the browser, Adam, tuples, attention microscope, mixture of experts, 1.58-bit ternary network, k-means, PCA, Net macro library, NN library, Learn library, TTTML, sw-MLPL, Rosetta M"
abstract: "Fifth in the Array Languages series: the machine learning the whole project exists for. X_eTaL-ML now has nine live demos, and three of them train in X_eTaL itself, a small CNN among them, in the browser. Its libraries are a neural-network vocabulary, classic machine learning, and a macro library that writes a network and its training step from one line. Here is what runs, what the code looks like, what comes next, and how X_eTaL, sw-MLPL and Rosetta M fit together on the way to a later language."
series: "Array Languages"
series_part: 5
demo_url: "https://softwarewrighter.github.io/X_eTaL-ML/"
date: 2026-10-11 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-ML"
    title: "X_eTaL-ML"
  - url: "https://github.com/sw-ml-study/sw-mlpl"
    title: "sw-mlpl"
  - url: "https://github.com/sw-ml-study/m-poc"
    title: "m-poc (Rosetta M)"
---

<img src="{{ '/assets/images/posts/block-158.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<!-- DRAFT for review (2026-10-10), refreshed from X_eTaL-ML at the start of its post-launch saga (catalog-toc done).
     sw-mlpl (last change 2026-10-03) and m-poc (2026-09-26) are unchanged since the first draft. -->

<div style="overflow: hidden;" markdown="1">

[ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) ended with a triple sum and asked what notation could say it in one line. [Made Visible #4](/2026/09/25/made-visible-rosetta-m/) mocked up the answer with placeholder glyphs. The four posts before this one described a language and its repositories. This one is about why: the machine learning, and where it stands.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-ML](https://github.com/softwarewrighter/X_eTaL-ML) --- machine-learning demos and the ML libraries they are made of |
| **Live** | [the catalog](https://softwarewrighter.github.io/X_eTaL-ML/) --- all nine demos in your browser; [start with the Tiny CNN](https://softwarewrighter.github.io/X_eTaL-ML/cnn-digits/) |
| **Run and read** | [run them yourself](https://softwarewrighter.github.io/X_eTaL-ML/recorded/) · [the code, cross-referenced](https://softwarewrighter.github.io/X_eTaL-ML/doc/) |
| **The pieces** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) · [Rosetta M](https://sw-ml-study.github.io/m-poc/) · [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **The thread** | [ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) · [Made Visible #4](/2026/09/25/made-visible-rosetta-m/) |
| **Prior post** | [Array Languages #4: X_eTaL-extensions](/2026/10/10/array-languages-xetal-extensions/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1">

## Why an array language for ML

The repo's README makes the case in a paragraph. Most of what an ML framework hides behind layers and modules is array algebra. A dense layer is one inner product and an addition. Softmax is an exponential, a row sum and a division. Attention is two matrix products and a softmax. A mixture-of-experts router is a matrix product and a top-k. In X_eTaL each of those is one short, typed expression over whole arrays, so a demo can show the model itself: the weights, every intermediate array with its shape, and the moment a loop nest turns out to be a single array transformation. And because the types are inferred and checked, a shape mistake in a layer is an error before the forward pass, not a wrong number after it.

## What runs today

Nine demos, all live in the browser and all runnable at the command line from a clone. Each page shows all the code it runs, beside the arrays that code computed. Each tile links to its live page:

<style>
.ml-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 1em 0 1.4em; }
.ml-grid a { display: block; text-decoration: none; }
.ml-grid img { display: block; width: 100%; height: auto; border-radius: 4px; }
.ml-grid span { display: block; text-align: center; font-size: 0.85em; margin-top: 0.3em; }
@media (max-width: 600px) { .ml-grid { grid-template-columns: repeat(2, 1fr); } }
</style>

<div class="ml-grid">
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/cnn-digits/"><img src="{{ '/assets/images/posts/xetal-ml-cnn-digits.webp' | relative_url }}" class="no-invert" alt="Draw a digit and watch a small convolutional network read it, every stage computed by X_eTaL"><span>Tiny CNN</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/backprop/"><img src="{{ '/assets/images/posts/xetal-ml-backprop.webp' | relative_url }}" class="no-invert" alt="One training step with every array shown, each gradient checked by nudging its weight"><span>backprop microscope</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/cnn-backprop/"><img src="{{ '/assets/images/posts/xetal-ml-cnn-backprop.webp' | relative_url }}" class="no-invert" alt="X_eTaL training a tiny CNN on 600 handwritten digits in the browser"><span>CNN training</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/train-live/"><img src="{{ '/assets/images/posts/xetal-ml-train-live.webp' | relative_url }}" class="no-invert" alt="A small network learning a spiral, its decision regions bending as the loss falls"><span>training live</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/attention/"><img src="{{ '/assets/images/posts/xetal-ml-attention.webp' | relative_url }}" class="no-invert" alt="One head of attention over a sentence: scores, weights and a causal mask"><span>attention microscope</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/moe-router/"><img src="{{ '/assets/images/posts/xetal-ml-moe-router.webp' | relative_url }}" class="no-invert" alt="A sentence's tokens routed to their top two of 16 experts"><span>MoE routing</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/net-macro/"><img src="{{ '/assets/images/posts/xetal-ml-net-macro.webp' | relative_url }}" class="no-invert" alt="A network written as one line, and the function the macro wrote for it"><span>network macro</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/k-means/"><img src="{{ '/assets/images/posts/xetal-ml-k-means.webp' | relative_url }}" class="no-invert" alt="Clustering five blobs step by step, the centers moving to their points' means"><span>k-means</span></a>
<a class="no-external-icon" href="https://softwarewrighter.github.io/X_eTaL-ML/ternary-net/"><img src="{{ '/assets/images/posts/xetal-ml-ternary-net.webp' | relative_url }}" class="no-invert" alt="One classifier with FP32, FP16, INT8 and ternary weights compared"><span>1.58-bit network</span></a>
</div>

They fall into three kinds:

- **Watching a model think.** The [Tiny CNN](https://softwarewrighter.github.io/X_eTaL-ML/cnn-digits/) reads a digit you draw, every 3 by 3 window of the picture taken at once as nine rotated copies of it. The [attention microscope](https://softwarewrighter.github.io/X_eTaL-ML/attention/) shows one head over your sentence, and "tired" finds the animal. The [MoE router](https://softwarewrighter.github.io/X_eTaL-ML/moe-router/) sends each token to two of 16 experts, and the [1.58-bit network](https://softwarewrighter.github.io/X_eTaL-ML/ternary-net/) compares one classifier at four precisions, down to weights of -1, 0 and +1.
- **Training, in X_eTaL.** Three demos train. The [backprop microscope](https://softwarewrighter.github.io/X_eTaL-ML/backprop/) shows one step with every array, and checks every gradient by nudging its weight. [Training live](https://softwarewrighter.github.io/X_eTaL-ML/train-live/) fits a spiral with Adam while the decision regions bend to follow it. [CNN training](https://softwarewrighter.github.io/X_eTaL-ML/cnn-backprop/) trains a small CNN from random weights on 600 handwritten digits, in your browser, through softmax, a dense layer, max-pooling, ReLU and the convolution, every gradient checked by finite differences.
- **Classic machine learning.** [k-means](https://softwarewrighter.github.io/X_eTaL-ML/k-means/) clusters five blobs step by step, and shows a poor start settling wrong where a farthest-first start finds all five.

The lines that do the work stay short. Every 3 by 3 window of a picture, and a convolution layer's gradient over a whole batch:

```text
w ← -1 0 1 o̲-₂ -1 0 1 o̲-₂ x
GK ← DM '+ '× i̲nner o̲\ V
```

</div>

<div class="clearfix" markdown="1">

## Three libraries, and a network in one line

The demos are made of three libraries in the repo:

- **NN** is the vocabulary: activations, softmax by row at any rank, dense layers, argmax, one-hot, loss and accuracy.
- **Learn** is classic machine learning, each method a fit and a predict: k-means, k nearest neighbors, PCA and logistic regression.
- **Net** is a macro library, the second meaning of *Extensible* from [post #3](/2026/10/09/array-languages-xetal-libraries/) put to work. One line writes a network:

```text
"net:" u̲se< "Net"
"u:d_eep c" ⁿᵉᵗm̲odel< "2 16 relu 16 relu 3 softmax"
```

That call expands into the code that loads the weights, checked, and an ordinary forward function of NN calls, and `xetal expand` shows all of it. A second macro, `net:t_rain<`, writes the network's backpropagation and an Adam step. The [network macro](https://softwarewrighter.github.io/X_eTaL-ML/net-macro/) demo lets you type a spec of your own and train it in the page.

Tuples, new in X_eTaL this week, came in exactly where this repo had asked for them. A training state is several arrays of different shapes: two weight matrices, Adam's two running averages for each, and a step count. Before tuples it had to be packed into one long vector. Now it is one tuple, taken apart by name, and `p̲ower` iterates it as one value:

```text
ᵘa̲dam ← { (W1, W2, M1, M2, V1, V2, k) →
  t ← 1.0 + k
  (G1, G2) ← W1 ᵘg̲rad W2
  m1 ← (0.9 × M1) + 0.1 × G1
  m2 ← (0.9 × M2) + 0.1 × G2
  v1 ← (0.999 × V1) + 0.001 × G1 × G1
  v2 ← (0.999 × V2) + 0.001 × G2 × G2
  (W1 − lr × (m1, v1) ᵘm̲ove t, W2 − lr × (m2, v2) ᵘm̲ove t, m1, m2, v1, v2, t)
}
s2 ← 300 'ᵘa̲dam p̲ower s1
```

</div>

<div class="clearfix" markdown="1">

## TTTML: an older kind of learning

One learner sits outside all this. TTTML, the tic-tac-toe machine from [TBT #12](/2026/09/24/tbt-aplsv-birds-tttml/), began as an APL workspace written for sw-apl's 1975 mode, and its X_eTaL port lives in the X_eTaL repo as a demo, not here. It learns a different way: a table with one number per board position, filled in by playing itself, with a position and its rotations and reflections counted as one. There is no network, no gradient and no backpropagation in it. The X_eTaL-ML demos are neural networks trained by gradient descent, the approach behind today's models. TTTML is worth keeping as the old approach in miniature, and it shows how far a table and self-play go, but it is not where this repo's machine learning is heading.

## The pieces

X_eTaL is not the ML language. It is a precursor: a research language whose job is the notation, and whose results feed a later language that is not ready to write about yet.

The pieces are these. [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl) has the machine-learning built-ins --- softmax, sigmoid, relu, Adam, autograd --- and takes ASCII, no glyphs required. X_eTaL has the conciseness and the typed, decorated surface, and also takes plain ASCII. [Rosetta M](/2026/09/25/made-visible-rosetta-m/) has the visual side, the four faces and the callouts, and its notation face *does* use glyphs: placeholders, drawn by hand for the mock-up. The language after X_eTaL takes ASCII keystrokes and pretty-prints sequences of two or more characters into shorter glyphs, the way X_eTaL already pretty-prints `r_ev` into r̲ev. The new glyphs for the ML vocabulary are not designed yet, and when they are, each should correspond to one sw-MLPL built-in. So X_eTaL is the notation that could be extended to replace Rosetta M's placeholders: the conciseness of X_eTaL and the built-ins of sw-MLPL, implementing something visual like Rosetta M.

## What comes next

The repo's next stretch is libraries first, then the demos that need them. Quantization, convolution and attention move out of their demos into libraries of their own, followed by layer norm and sampling. Then a MicroGPT: its forward pass in X_eTaL on weights trained elsewhere, sampling names. Then an embedding explorer, PCA from 64 dimensions to a 3D cloud you can turn, an optimizer library, and the libraries on the live site. A world model and diffusion from noise stay deferred, waiting on training speed and a learned denoiser.

A few things wait on the language, filed as asks rather than worked around: a grade per row, arrays passed in and out of the browser engine, and `e̲ach` returning arrays. Speed is measured and guarded, and the CNN's whole program runs in about a third of a second.

## Next in the series

A planned post covers the games, and what a game asks of a language that a demo never does.

</div>
