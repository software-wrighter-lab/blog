---
layout: post
title: "Array Languages #5: X_eTaL-ML, Where the Machine Learning Is"
categories: [languages, language-design, machine-learning, tools]
tags: [array-languages, xetal, x-etal, apl, machine-learning, ternary, mixture-of-experts, cnn, attention, tttml, sw-mlpl, rosetta-m, m-poc]
keywords: "X_eTaL ML, machine learning in an array language, TTTML, ternary network, 1.58-bit, MoE routing, tiny CNN, attention, embeddings, sw-MLPL, Rosetta M, m-poc, stepping stone language"
abstract: "Fifth in the Array Languages series: the machine-learning work the whole project exists for. What runs today --- the tic-tac-toe learner, a 1.58-bit ternary network, a mixture-of-experts router --- the X_eTaL-ML repo that now holds them, what comes next, and how X_eTaL, sw-MLPL and Rosetta M fit together as the pieces of a later language that is not ready to write about yet."
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

<div style="overflow: hidden;" markdown="1">

[ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) ended with a triple sum and asked what notation could say it in one line; [Made Visible #4](/2026/09/25/made-visible-rosetta-m/) mocked up the answer with placeholder glyphs. The four posts before this one described a language and its repositories. This one is about why: the machine learning, and where it stands.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-ML](https://github.com/softwarewrighter/X_eTaL-ML) · [live catalog](https://softwarewrighter.github.io/X_eTaL-ML/) --- machine-learning demos and the ML libraries they are made of |
| **Live now** | [1.58-bit network](https://softwarewrighter.github.io/X_eTaL-ML/ternary-net/) · [MoE routing microscope](https://softwarewrighter.github.io/X_eTaL-ML/moe-router/) |
| **The pieces** | [sw-ml-study/sw-mlpl](https://github.com/sw-ml-study/sw-mlpl) · [Rosetta M](https://sw-ml-study.github.io/m-poc/) · [X_eTaL](https://github.com/softwarewrighter/X_eTaL) |
| **The thread** | [ML #9](/2026/09/10/ml-cnn-from-equations-mlpl/) · [Made Visible #4](/2026/09/25/made-visible-rosetta-m/) |
| **Prior post** | [Array Languages #4: X_eTaL-extensions](/2026/10/10/array-languages-xetal-extensions/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## What runs today

<figure>
<img src="{{ '/assets/images/posts/xetal-ml-catalog.webp' | relative_url }}" class="no-invert" alt="The X_eTaL-ML catalog: three cards, the 1.58-bit network and the MoE routing microscope live, and the Tiny CNN in progress">
<figcaption style="font-size: 0.85em;"><a href="https://softwarewrighter.github.io/X_eTaL-ML/">The ML catalog</a>: the three demos so far, two live and the Tiny CNN in progress, each with the array ideas it runs on.</figcaption>
</figure>

Honestly: at the start. The one learner in the repository is TTTML, the tic-tac-toe machine from [TBT #12](/2026/09/24/tbt-aplsv-birds-tttml/), ported from sw-apl's library 1, trained with `just tttml-train`, its core an inner product `ˡlines '+ '× i̲nner s`. The ML demos --- the ternary network and the MoE router, in X_eTaL-ML now; the tiny CNN, then attention, embeddings, a world model and diffusion to come --- are the next programs, and the asks they file (transpose first) are how the language learns what ML needs. X_eTaL is not the ML language. It is a precursor: a research language whose job is the notation, and whose results feed a later language that is not ready to write about yet.

The pieces are these. [sw-MLPL](https://github.com/sw-ml-study/sw-mlpl) has the machine-learning built-ins --- softmax, sigmoid, relu, Adam, autograd --- and takes ASCII, no glyphs required. X_eTaL has the conciseness and the typed, decorated surface, and also takes plain ASCII. [Rosetta M](/2026/09/25/made-visible-rosetta-m/) has the visual side, the four faces and the callouts, and its notation face *does* use glyphs --- placeholders, drawn by hand for the mock-up. The language after X_eTaL takes ASCII keystrokes and pretty-prints sequences of two or more characters into shorter glyphs, the way X_eTaL already pretty-prints `r_ev` into r̲ev; the new glyphs for the ML vocabulary are not designed yet, and when they are, each should correspond to one sw-MLPL built-in. So X_eTaL is the notation that could be extended to replace Rosetta M's placeholders: the conciseness of X_eTaL, the built-ins of sw-MLPL, to implement something visual like Rosetta M.

## The repo

The demos repo was close to having too many demos, and the ML ones answer a different question from the rest: not *what does array programming look like* but *why do array languages fit ML*. So they have their own repository now, [X_eTaL-ML](https://github.com/softwarewrighter/X_eTaL-ML), with a [live catalog](https://softwarewrighter.github.io/X_eTaL-ML/) of three so far: the 1.58-bit network and the MoE router live in the browser, and the tiny CNN in progress --- a digit read by a network trained on MNIST, convolution as the picture's nine shifted copies times eight filters, pooling by reshape, every stage visible. Every demo also runs at the command line, and those runs are being recorded as animated terminal captures for the README, so the models can be watched thinking without opening a page.

<figure>
<img src="{{ '/assets/images/posts/xetal-ml-demos.webp' | relative_url }}" class="no-invert" alt="The two live ML demo pages: the 1.58-bit network comparing FP32, FP16, INT8 and ternary weights, and the MoE routing microscope routing a sentence's tokens to experts">
<figcaption style="font-size: 0.85em;">The two live pages: the <a href="https://softwarewrighter.github.io/X_eTaL-ML/ternary-net/">1.58-bit network</a> and the <a href="https://softwarewrighter.github.io/X_eTaL-ML/moe-router/">MoE routing microscope</a>.</figcaption>
</figure> Attention, an embedding explorer with PCA, gradient descent and a MicroGPT follow there. The libraries the demos are made of live there too: NN is ready --- activations, softmax by row, dense layers, argmax, one-hot, loss and accuracy --- with Quant for FP16, INT8 and ternary quantization, Conv for windows, 2-D convolution and pooling, Attention for scaled dot-product attention with causal masks and heads, and Optim for gradients, SGD and momentum to follow. The README's case for the whole repo is short enough to quote: most of what an ML framework hides behind layers and modules is array algebra --- a dense layer is one inner product and an addition, softmax an exponential, a row sum and a division, attention two matrix products and a softmax --- and in X_eTaL each is one short, typed expression over whole arrays, so a demo can show the model itself. The demos repo keeps the visual and scientific programs, and the image pipeline stays there as the bridge.

## What comes next

Attention, waiting on transpose, which has now landed in the language; the embedding explorer, which needs the same; a tiny world model, waiting on training speed and records; diffusion from noise, waiting on a learned denoiser. Each of these files what it needs as an ask against the language rather than working around it, and that list is how the language learns what ML needs.

## Next in the series

The games: five live, the horse race this blog started with and four COR24 BASIC ports, and what a game asks of a language that a demo never does.
