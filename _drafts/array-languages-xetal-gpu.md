---
layout: post
title: "Array Languages #7: X_eTaL-gpu, Array Programs on GPUs Old and New"
categories: [languages, language-design, gpu, hardware]
tags: [array-languages, xetal, x-etal, apl, gpu, opencl, kepler, maxwell, pascal, turing, ampere, ada-lovelace, blackwell, accelerator-ir, parallelism]
keywords: "X_eTaL GPU, array language on GPU, OpenCL C 1.2 kernels, kernel fusion, tree reduction, accelerator IR, retired CUDA cards, Kepler, Maxwell, Pascal, Turing, Ampere, Ada Lovelace, Blackwell, Apple M1 Max, Apple M3 Pro, Quadro K4200, Tesla M10, Tesla P4, GTX 1660 Super, RTX 3060, RTX 3060 Laptop GPU, RTX 3090, RTX 4070 Laptop GPU, RTX 5060 Ti, A2, whole-array parallelism, GPU native extension"
abstract: "Seventh in the Array Languages series: X_eTaL-gpu runs X_eTaL programs on GPUs through OpenCL, from a Kepler Quadro to a Blackwell RTX. The aim is to show that an array language, with its macros and extensions, can get real value from older and smaller GPUs on machine-learning tasks, and this post is about when that value appears. Offloading has fixed costs, setting up the device, compiling kernels and moving arrays, so small and elementwise jobs lose. Large, product-heavy work in big batches wins by an order of magnitude or more, measured so far on an M1 Max and an RTX 5060 Ti, including a machine-learning model 50 to 100 times faster. Next come the fixes that shrink the fixed costs, the older cards, and bigger models."
series: "Array Languages"
series_part: 7
date: 2026-10-13 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-gpu/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- DRAFT, IN PROGRESS: refreshed 2026-10-12 evening from X_eTaL-gpu at c67895c (ml-results.md, rtx5060-results.md, rtx5060-ml-results.md,
     rtx5060-binary-results.md, binary-arrays.md; transpose done; plan sagas 5 to 11), X_eTaL-ML fac586c (world model committed), X_eTaL 27b3fd0.
     Focus (Mike, 2026-10-12): effective use of X_eTaL to run ML tasks faster on a GPU, even an old small one, for tasks worth offloading.
     and X_eTaL-ML's docs/gpu-asks.md and plan.md "Combined with X_eTaL-gpu" (0ff84e8).
     More changes are expected before publishing (saga 4's tiny model, then saga 5 on NVIDIA cards): re-check the status
     and numbers then. To do: cross-link the companion hardware blog (https://blog.hardwarewrighter.com/) once its posts exist.
     The lead image is a Tesla P4 (Pascal), one of Mike's cards. The cards table follows X_eTaL-gpu's docs/plan.md hardware table (329b879, 2026-10-12). -->

<img src="{{ '/assets/images/posts/block-nvidia-p4.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

X_eTaL states a computation as whole-array operations, `c ← a + b`, `'+ r̲/ c`, and those operations already say what can run in parallel. X_eTaL-gpu takes that literally: the same typed program runs on the evaluator, one step at a time, or on a GPU as thousands of threads, and gives the same answer. The targets are old and new cards alike, all reached through OpenCL: a Kepler Quadro and Maxwell and Pascal Teslas that the newest CUDA toolkits retire, and Turing through Blackwell. The goal is the concept, not speed.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The repo** | [softwarewrighter/X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu) |
| **Live site** | [what it is and the measured results](https://softwarewrighter.github.io/X_eTaL-gpu/) · [the documentation](https://softwarewrighter.github.io/X_eTaL-gpu/doc/) |
| **Prior post** | [Array Languages #6: X_eTaL-games](/2026/10/12/array-languages-xetal-games/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## One program, three ways to run it

Every example is an X_eTaL program first, and the X_eTaL evaluator is the reference. The program also has a twin in a small accelerator IR, typed arrays with elementwise maps and reductions, and that twin runs two more ways: in a reference interpreter, and as OpenCL on a GPU. All three must give the same arrays, integers exactly and floats within 1e-5.

```text
                X_eTaL program (.xtl)
                        |
          +-------------+-------------+
          v             v             v
      evaluator    IR interpreter   OpenCL on a GPU
          |             |             |
          +-------------+-------------+
                        v
                  the same arrays
```

So, plainly: what runs on the GPU today is not X_eTaL code itself. It is a hand-written translation of each program, and the checks prove each translation gives the evaluator's output, exactly on the interpreter and within 32-bit float tolerance on the GPU. The twins are trusted only as far as those checks reach. Translating X_eTaL automatically, the lowering to the IR, belongs in the language and is filed there as an ask. When it lands, the twins go, and the goal is one command, `xetal run --device opencl:0`.

## From a line of X_eTaL to a kernel

Here is one of the examples, from the Accel library, the subset of X_eTaL a device can run:

```text
ˡp̲ipeline ← { x w → ˡs̲um ˡr̲elu x + x × w }
```

The scheduler fuses the whole elementwise chain, a multiply, an add and a ReLU, into one kernel, one work-item per element, and lays out the sum as a tree in local memory:

```c
// k0: 8 elements, one work-item each; computes %xw %s %pos
__kernel void k0(__global const long* b_x, __global const long* b_w, __global long* b_pos) {
    size_t i = get_global_id(0);
    if (i >= 8) return;
    long t_xw = (b_x[i] * b_w[i]);
    long t_s = (b_x[i] + t_xw);
    long t_pos = max(t_s, 0L);
    b_pos[i] = t_pos;
}
```

The tool shows each step: `xetal-gpu kernel` prints the OpenCL C, and `xetal-gpu explain` says which X_eTaL values became which kernels. How a device runs a program, its widths, work-group and tiles, is a schedule kept as one TOML file per device.

</div>

<div class="clearfix" markdown="1">

## What runs today

Two GPUs have run it so far: the M1 Max in this Mac, through Apple's OpenCL 1.2, and an RTX 5060 Ti in an Arch Linux machine, through NVIDIA's OpenCL. On both, every check agrees with the evaluator: the example programs, reductions from a thousand items to a million, axis reductions, tiled matrix products, a tiny two-layer network, and transpose, new this week, as a gather or in tiles. On the 5060 Ti the checks also pass in 64-bit floats, which Apple's OpenCL lacks. Through the bridge from [post #4](/2026/10/10/array-languages-xetal-extensions/), an X_eTaL program calls the GPU itself.

## When the GPU pays

A GPU is not automatically faster. Every offload pays fixed costs before a single kernel runs, and today those costs are large:

- **Setting up and compiling.** Each run creates a device context and compiles its kernels: about 80 ms on the M1 Max and 200 to 300 ms on the 5060 Ti. There is no kernel cache yet.
- **Moving the arrays.** The bridge carries arrays as text, about 0.4 s for a million numbers. The device buffers are uploaded again on every run.
- **The kernels themselves.** Usually the smallest part: a fraction of a millisecond for everything measured here.

So the GPU wins only when the work is big enough to hide those costs. The measurements show where that line falls:

<style>
.pays td.v-bad  { background: rgba(214, 69, 65, 0.22); }
.pays td.v-even { background: rgba(230, 170, 30, 0.24); }
.pays td.v-good { background: rgba(46, 160, 67, 0.22); }
</style>

<table class="pays">
<thead><tr><th>Work</th><th>Machine</th><th>X_eTaL evaluator</th><th>GPU</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>a thousand items</td><td>RTX 5060 Ti</td><td>0.17 s</td><td>1.29 s</td><td class="v-bad">too small: setup costs more than the work</td></tr>
<tr><td>a million items, elementwise, through the bridge</td><td>M1 Max</td><td>0.19 s</td><td>2.4 s</td><td class="v-bad">loses: moving the numbers costs more than the arithmetic</td></tr>
<tr><td>a million items, elementwise, through the bridge</td><td>RTX 5060 Ti</td><td>0.25 s</td><td>1.44 s</td><td class="v-bad">loses, the same way</td></tr>
<tr><td>the small ML benchmarks: a dense layer, a wide inner product, a softmax</td><td>M1 Max</td><td>59 to 179 ms</td><td>about 90 ms</td><td class="v-even">about even: setup is nearly all of the GPU’s time</td></tr>
<tr><td>a 512 by 512 product, through the bridge</td><td>M1 Max</td><td>14.5 s</td><td>0.46 s</td><td class="v-good">31 times faster</td></tr>
<tr><td>a 512 by 512 product, through the bridge</td><td>RTX 5060 Ti</td><td>25.0 s</td><td>0.98 s</td><td class="v-good">25 times faster</td></tr>
<tr><td>a 512 by 512 product, the whole checked program</td><td>RTX 5060 Ti</td><td>55 s</td><td>0.30 s</td><td class="v-good">about 180 times faster</td></tr>
<tr><td>the world model, all 1,936 states as one batch</td><td>M1 Max</td><td>9.9 s</td><td>0.11 s</td><td class="v-good">about 90 times faster</td></tr>
<tr><td>the world model, all 1,936 states as one batch</td><td>RTX 5060 Ti</td><td>15.1 s</td><td>0.16 s</td><td class="v-good">about 95 times faster</td></tr>
</tbody>
</table>

The world model's GPU times are whole runs, setup included; its kernels alone take 0.09 ms on the M1 Max and 0.24 ms on the 5060 Ti. The evaluator times differ because the machines do.

The rule the repo has settled on: the batch is the array, and the work is products. A product does far more arithmetic per number moved than an elementwise operation, so it wins even through a slow bridge. A batch turns many small jobs into one large one, so the fixed costs are paid once. A tiny model on one prompt never looks good, and doesn't need to.

That is also how X_eTaL is meant to be written anyway. The world model's program runs every state of its world as one array, with one product per layer, and that whole-array shape is exactly what the GPU rewards. Writing the same model one state at a time, in a loop, would hand the GPU a thousand tiny jobs and lose.

That is the point of this work. It is not a race with large, new GPUs. It is to show that an array language, extended with a native extension and the macros that write its facade, one line per GPU function, can get real value out of older and smaller GPUs on machine-learning tasks. The kernels are a sliver of each run here, so the old, small cards should win wherever these two do, just by less. The order is deliberate: first confidence in the use-cases and the measurements on these two GPUs, then the older, smaller cards, the K4200, M10 and P4 among them, to test that.

## The ML models on the GPUs

The machine-learning models from [post #5](/2026/10/11/array-languages-xetal-ml/) are the work this is for. X_eTaL-ML writes no GPU code. It hands over each model as a batch X_eTaL program, with its weights and expected outputs, and X_eTaL-gpu runs it on each device, at the command line, since the live pages run X_eTaL as WebAssembly, which cannot reach OpenCL.

- **The world model** predicts a ball's next frame from the last three: 432 pixels in, 64 ReLU units, 144 sigmoid pixels out. Over all 1,936 states it predicts 1,897 next frames exactly, and 348 of the 387 it never trained on, with the same counts on the evaluator and both GPUs.
- **The benchmarks,** a dense layer, a wide inner product and a softmax, agree on both GPUs within a relative 1e-5. They are small on purpose, and they show the other side: each takes 59 to 179 ms in the evaluator, and a GPU run takes about 90 ms on the M1 Max and about 160 ms on the 5060 Ti, almost all of it setup, so at best they break even.
- **A learned denoiser** comes next: twenty steps from noise to 256 pictures at once. Twenty calls instead of one, it will show what the fixed costs do inside a loop, and why they need to shrink.

## Shrinking the fixed costs

The next stage of the work is aimed squarely at those costs, so that more tasks become worth offloading:

- **Binary arrays, done this week.** Inputs can now be bound from binary files instead of text. For the world model on the 5060 Ti, binding its inputs fell from 460 ms to 13 ms, and the whole process from about 1.06 s to 0.39 s, with the same counts. Results still come back as text.
- **A kernel cache.** Compiled kernels kept by their source and device, in memory for a session and on disk, so the 80 to 300 ms of setup becomes a cache read.
- **Resident weights.** A session that keeps the weights on the device across runs, so only each new batch is bound: the shape a training loop or a stream of prompts needs.

Then each card is measured again, its second call's time on the M1 Max, the 5060 Ti and an RTX 3060, so the tables show the kernels' own cost rather than the setup's.

## Bigger models ahead

Once a run costs little more than its kernels, the plan moves to work large enough to need a GPU:

1. **A tiny GPT.** X_eTaL-ML's MicroGPT, one layer with four heads, its forward pass as one program on a batch of prompts, written into the GPU's form by a generator rather than by hand, measured in tokens per second on each card. The typed-decision classifier is the same block with a classification head.
2. **Training.** A training step, forward, backward and Adam, as one program per step with the weights resident. Training is where products dominate most, and each line of a backward pass is a product with a transpose, which is why transpose came first. The tiny GPT trained from scratch, then GPT-2 small fine-tuned on a small corpus, with the memory each card needs: the 6 GB cards and larger fit, the 4 GB Quadro does not.
3. **A conditional memory** after DeepSeek's Engram, hashed n-grams looked up in a table. On a GPU that is a gather, so the point there is X_eTaL's concision and the table's size, not speed.
4. **A mixture of experts,** first the array way, every expert computing and the router's mask keeping what was chosen, and a sparse version only if that measures too slow.

## The cards

OpenCL is the one runtime that reaches all of them, old and new. These are the cards the work is aimed at, from the repo's hardware table:

| Card | Architecture | Memory | Its role |
|---|---|---|---|
| Apple M1 Max | Apple GPU | 64 GB unified | development; measured; the higher memory bandwidth |
| Apple M3 Pro | Apple GPU | 18 GB unified | a newer generation, with less memory and less bandwidth |
| Quadro K4200 | Kepler | 4 GB | the oldest generation and the least memory: the case where weights stay on the host; several of them |
| Tesla M10 | Maxwell | four GPUs of 8 GB | an old card the newest CUDA toolkits retire; built to stream many remote desktops, not to run LLMs; each GPU its own device |
| Tesla P4 | Pascal | 8 GB | an old card the newest CUDA toolkits retire |
| GTX 1660 Super | Turing | 6 GB | with the RTX 3060 Laptop GPU, the least memory of the current cards |
| RTX 3060 | Ampere | 12 GB | current PCIe cards; several of them |
| RTX 3060 Laptop GPU | Ampere | 6 GB | a current generation, in a System76 laptop |
| RTX 3090 | Ampere | 24 GB | a current card, and the most memory of the NVIDIA cards |
| RTX 4070 Laptop GPU | Ada Lovelace | 8 GB | a current generation, in an Asus ROG laptop |
| RTX 5060 Ti | Blackwell | 16 GB | the newest generation; measured, the first NVIDIA card |
| A2 | Ampere | 16 GB | a small, low-power data-center card |

Each card runs a program by a schedule file. The 5060 Ti has its own two, in 32-bit and 64-bit floats, with work-groups of 256: the card allows 1,024, but its compiled reduction kernel allows only 256, and the runtime reported that limit rather than failing. The other NVIDIA cards share templates, untested until a card runs them. Nothing in the code changed for the move to Linux. The plan for the hardware follows the same order: settle the use-cases and measurements on the M1 Max and the 5060 Ti first, then the older, smaller cards, the K4200, M10 and P4 among them, and the rest of the table, then one program on every card present, Kepler to Blackwell, with a table of what ran where and how fast, and then 16-bit floats, 8-bit integers and ternary weights.

## What the work asks for

The asks between the repositories show where each layer of the stack still falls short:

- **Of X_eTaL-gpu, from X_eTaL-ML:** run its models from a pinned commit, now done for the world model and the benchmarks; transpose, now done; and the convolution's windows, for the CNNs.
- **Of X_eTaL-extensions:** a newer X_eTaL inside the bridge, since the ML libraries use private helpers and tuples its version lacks; and arrays across the bridge in binary, now half done for inputs.
- **Of the language:** the accelerator IR itself, the lowering from X_eTaL to it, and array shapes known when a program is compiled. Until then every model needs a translation into the GPU's form, by hand or by a generator, checked against the evaluator.

This post will be updated as the models land on the cards.

</div>
