---
layout: post
title: "Array Languages #7: X_eTaL-gpu, Array Programs on GPUs Old and New"
categories: [languages, language-design, gpu, hardware]
tags: [array-languages, xetal, x-etal, apl, gpu, opencl, kepler, maxwell, pascal, turing, ampere, ada-lovelace, blackwell, accelerator-ir, parallelism]
keywords: "X_eTaL GPU, array language on GPU, OpenCL C 1.2 kernels, kernel fusion, tree reduction, accelerator IR, retired CUDA cards, Kepler, Maxwell, Pascal, Turing, Ampere, Ada Lovelace, Blackwell, Apple M1 Max, Apple M3 Pro, Tesla P100, Tesla M40, Quadro K4200, Tesla M10, Tesla P4, GTX 1660 Super, RTX 3060, RTX 3060 Laptop GPU, RTX 3090, RTX 4070 Laptop GPU, RTX 5060 Ti, A2, whole-array parallelism, GPU native extension"
abstract: "Seventh in the Array Languages series: X_eTaL-gpu runs X_eTaL programs on GPUs through OpenCL, old and new. The aim is to show that an array language, with its macros and extensions, can get real value from older and smaller GPUs on machine-learning tasks, and this post is about when that value appears. Offloading has fixed costs, so small and elementwise jobs lose. Large, product-heavy work in big batches runs 25 to 220 times faster than X_eTaL's own evaluator. Against tuned CPU code the bar is higher: a small trained model does not beat a tuned CPU library yet, on either GPU, and the work ahead, bigger models and training with the weights kept on the GPU, is aimed at clearing that bar."
series: "Array Languages"
series_part: 7
date: 2026-10-13 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-gpu/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- DRAFT, IN PROGRESS: refreshed 2026-10-12 night from X_eTaL-gpu at bc90eff (sessions and the OpenBLAS comparison: docs/rtx5060-session-results.md,
     docs/gpu-sessions.md; windows done), X_eTaL-ML 1eded2a, then 866c217 (the denoiser committed); X_eTaL-gpu 0c04f21 (the M1 Max against Accelerate: docs/m1max-session-results.md). Before that: X_eTaL-gpu c67895c (ml-results.md, rtx5060-results.md, rtx5060-ml-results.md,
     rtx5060-binary-results.md, binary-arrays.md; transpose done; plan sagas 5 to 11), X_eTaL-ML fac586c (world model committed), X_eTaL 27b3fd0.
     Focus (Mike, 2026-10-12): effective use of X_eTaL to run ML tasks faster on a GPU, even an old small one, for tasks worth offloading.
     and X_eTaL-ML's docs/gpu-asks.md and plan.md "Combined with X_eTaL-gpu" (0ff84e8).
     More changes are expected before publishing (saga 4's tiny model, then saga 5 on NVIDIA cards): re-check the status
     and numbers then. To do: cross-link the companion hardware blog (https://blog.hardwarewrighter.com/) once its posts exist.
     The lead image is a Tesla P4 (Pascal), one of Mike's cards. Card groups (Mike, 2026-10-12): first M1 Max, RTX 3090, RTX 5060 Ti, RTX 3060;
     follow-on the M3 Pro, and one or two of P4, A2, P100, M40 (both P100s: 12 and 16 GB; both M40s: 12 and 24 GB); future maybe K4200, 1660 Super, then the rest. -->

<img src="{{ '/assets/images/posts/block-nvidia-p4.webp' | relative_url }}" class="post-marker" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

X_eTaL states a computation as whole-array operations, `c ← a + b`, `'+ r̲/ c`, and those operations already say what can run in parallel. X_eTaL-gpu takes that literally: the same typed program runs on the evaluator, one step at a time, or on a GPU as thousands of threads, and gives the same answer. The targets are old and new cards alike, all reached through OpenCL: current RTX cards, and older Maxwell and Pascal data-center cards that the newest CUDA toolkits retire. The goal is the concept, not speed.

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

A GPU is not automatically faster. Every offload pays fixed costs before a single kernel runs:

- **Setting up and compiling.** Creating a device context and compiling the kernels takes about 80 ms on the M1 Max and 150 to 300 ms on the 5060 Ti. With a session, new this week, that is paid once per program rather than once per run.
- **Moving the arrays.** Through the bridge as text, about 0.4 s for a million numbers. From binary files it is far less, but every new batch must still be uploaded to the device.
- **The kernels themselves.** Usually the smallest part: a fraction of a millisecond for everything measured here.

And there is a second question hiding in "faster": faster than what? There are two CPU baselines, and they give very different answers.

### Against X_eTaL's own evaluator

X_eTaL's evaluator is the reference, written for clarity, not speed. Against it, the line falls where you would expect:

<style>
.pays td.v-bad  { background: rgba(214, 69, 65, 0.22); }
.pays td.v-even { background: rgba(230, 170, 30, 0.24); }
.pays td.v-good { background: rgba(46, 160, 67, 0.22); }
</style>

<table class="pays">
<thead><tr><th>Work</th><th>Machine</th><th>X_eTaL evaluator</th><th>GPU</th><th>Against the evaluator</th></tr></thead>
<tbody>
<tr><td>a thousand items</td><td>RTX 5060 Ti</td><td>0.17 s</td><td>1.29 s</td><td class="v-bad">too small: setup costs more than the work</td></tr>
<tr><td>a million items, elementwise, through the bridge</td><td>M1 Max</td><td>0.19 s</td><td>2.4 s</td><td class="v-bad">loses: moving the numbers costs more than the arithmetic</td></tr>
<tr><td>a million items, elementwise, through the bridge</td><td>RTX 5060 Ti</td><td>0.25 s</td><td>1.44 s</td><td class="v-bad">loses, the same way</td></tr>
<tr><td>the small ML benchmarks: a dense layer, a wide inner product, a softmax</td><td>M1 Max</td><td>59 to 179 ms</td><td>about 90 ms</td><td class="v-even">about even: setup is nearly all of the GPU’s time</td></tr>
<tr><td>a 512 by 512 product, through the bridge</td><td>M1 Max</td><td>14.5 s</td><td>0.46 s</td><td class="v-good">31 times faster</td></tr>
<tr><td>a 512 by 512 product, through the bridge</td><td>RTX 5060 Ti</td><td>25.0 s</td><td>0.98 s</td><td class="v-good">25 times faster</td></tr>
<tr><td>a 512 by 512 product, the whole checked program</td><td>M1 Max</td><td>28.75 s</td><td>0.13 s</td><td class="v-good">about 220 times faster</td></tr>
<tr><td>a 512 by 512 product, the whole checked program</td><td>RTX 5060 Ti</td><td>55 s</td><td>0.30 s</td><td class="v-good">about 180 times faster</td></tr>
<tr><td>the world model, all 1,936 states as one batch</td><td>M1 Max</td><td>9.9 s</td><td>0.11 s</td><td class="v-good">about 90 times faster</td></tr>
<tr><td>the world model, all 1,936 states as one batch</td><td>RTX 5060 Ti</td><td>15.1 s</td><td>0.16 s</td><td class="v-good">about 95 times faster</td></tr>
</tbody>
</table>

The GPU times are whole runs, setup included. The world model's kernels alone take 0.09 ms on the M1 Max and 0.24 ms on the 5060 Ti. The evaluator times differ because the machines do.

### Against tuned CPU code

The stronger test is a CPU running optimized code. The GPU repo ran the trained world model, both layers with their biases, ReLU and sigmoid, on both GPUs, each against its own machine's tuned CPU library: NumPy with Apple's Accelerate on the M1 Max, and NumPy with OpenBLAS on the 5060 Ti's 12-thread Xeon, taking the fastest thread count for each batch. Every run gives the same counts. The GPU keeps its kernels and weights resident in a session and uploads each new batch; the times are medians of repeated calls:

<table class="pays">
<thead><tr><th>World model, batch</th><th>M1 Max: Accelerate (ms)</th><th>M1 Max: GPU (ms)</th><th>GPU against CPU</th><th>5060 Ti machine: OpenBLAS (ms)</th><th>RTX 5060 Ti (ms)</th><th>GPU against CPU</th></tr></thead>
<tbody>
<tr><td>1 state</td><td>0.022</td><td>1.54</td><td class="v-bad">0.01 times</td><td>0.073</td><td>0.21</td><td class="v-bad">0.35 times</td></tr>
<tr><td>64 states</td><td>0.10</td><td>1.79</td><td class="v-bad">0.06 times</td><td>0.23</td><td>0.30</td><td class="v-even">0.76 times</td></tr>
<tr><td>256 states</td><td>0.31</td><td>1.78</td><td class="v-bad">0.17 times</td><td>0.47</td><td>0.66</td><td class="v-even">0.72 times</td></tr>
<tr><td>1,936 states, the whole world</td><td>1.29</td><td>2.51</td><td class="v-even">0.51 times</td><td>1.94</td><td>2.97</td><td class="v-even">0.65 times</td></tr>
<tr><td>8,192 states</td><td>4.68</td><td>5.50</td><td class="v-even">0.85 times</td><td>8.64</td><td>10.53</td><td class="v-even">0.82 times</td></tr>
</tbody>
</table>

The world model does not beat the tuned CPU library at any batch size measured, on either machine. The GPU's kernels are fast: for the whole world of 1,936 states the 5060 Ti's kernels take 0.24 ms. But each call also pays for its launches and for uploading the new batch, and that is about as much as the CPU's whole computation. At 8,192 states the 5060 Ti's upload alone takes 9.9 ms, against 8.6 ms for OpenBLAS to do everything. Apple's OpenCL adds about 1.3 ms to every call, even with nothing to upload, which is why the M1 Max is so far behind on small batches. Running a batch already on the device is cheaper, but repeating identical inputs is not real work, and the repo refuses to count it. On both machines the gap narrows as the batch grows, to 0.85 of the CPU’s speed on the M1 Max and 0.82 on the 5060 Ti at 8,192 states.

The reason is the model's size. A 432 to 64 to 144 network does little arithmetic for each number it is sent, and a well-tuned CPU library is very good at small products. The rule the repo has settled on still holds, the batch is the array and the work is products, but against a good CPU library the products have to be big enough, or the data has to stay on the device, for the arithmetic to outweigh the upload.

That is the point of this work. It is not a race with large, new GPUs, or with tuned CPU libraries on small models. It is to show that an array language, extended with a native extension and the macros that write its facade, one line per GPU function, can get real value out of older and smaller GPUs on machine-learning tasks, and to find honestly where that value starts. Against X_eTaL itself it is already large. Against tuned CPU code it needs bigger work, which is where the plan goes next. The order is deliberate: first confidence in the use-cases and the measurements on a few current GPUs, then one or two older data-center cards.

## The ML models on the GPUs

The machine-learning models from [post #5](/2026/10/11/array-languages-xetal-ml/) are the work this is for. X_eTaL-ML writes no GPU code. It hands over each model as a batch X_eTaL program, with its weights and expected outputs, and X_eTaL-gpu runs it on each device, at the command line, since the live pages run X_eTaL as WebAssembly, which cannot reach OpenCL.

- **The world model** predicts a ball's next frame from the last three: 432 pixels in, 64 ReLU units, 144 sigmoid pixels out. Over all 1,936 states it predicts 1,897 next frames exactly, and 348 of the 387 it never trained on, with the same counts on the evaluator, both GPUs and OpenBLAS.
- **The benchmarks,** a dense layer, a wide inner product and a softmax, agree on both GPUs within a relative 1e-5. They are small, and at best break even with the evaluator.
- **A learned denoiser,** new in X_eTaL-ML this week, draws 10 by 10 pictures, a disk, a hollow square or a cross, from noise in ten steps, 128 pictures at once, in 6.3 s in the evaluator. Its network is wider, 256 hidden units, and the ten steps are ten calls, so it will show what a session saves inside a loop. It is now committed in X_eTaL-ML, so its run on the GPUs is next.

## Shrinking the fixed costs

Two of the fixes have landed:

- **Binary arrays.** Inputs can be bound from binary files instead of text. For the world model on the 5060 Ti, binding its inputs fell from 460 ms to 13 ms, and the whole process from about 1.06 s to 0.39 s. Results still come back as text.
- **Sessions.** A session compiles once, keeps the kernels and the device buffers, and uploads only the inputs that change: bind the weights once, then rebind each batch and run again with `gp:r_erun`. The first call still pays 150 ms or so; the calls after it cost their upload and kernels.

What remains is the upload of each new batch, which the comparison above shows is now the main cost. Work that keeps more of its data on the device, or does more arithmetic per number uploaded, is what pays.

## Bigger models ahead

That is why the plan moves to larger work next:

1. **Retrieval against a resident index.** The next workload the repo names: batched embedding retrieval, a large document index kept on the GPU and each query compared with all of it, followed by a reduction or a top-k. Each number uploaded buys many comparisons, which is the shape the measurements say wins. The step under way now, lookup, adds the indexing it needs: rows of a matrix chosen by a vector of integers, the same gather every transformer's embedding uses.
2. **A tiny GPT.** X_eTaL-ML's MicroGPT, one layer with four heads, its forward pass as one program on a batch of prompts, written into the GPU's form by a generator rather than by hand, measured in tokens per second on each card. The typed-decision classifier is the same block with a classification head.
3. **Training.** A training step, forward, backward and Adam, as one program per step with the weights resident. Training is where products dominate most, and the weights and their gradients stay on the device between steps, so only each batch moves. Each line of a backward pass is a product with a transpose, which is why transpose came first. The tiny GPT trained from scratch, then GPT-2 small fine-tuned on a small corpus, with the memory each card needs.
4. **The CNNs.** The convolution's windows are now in the GPU's form, so the Tiny CNN and CNN training can follow.
5. **A conditional memory** after DeepSeek's Engram, hashed n-grams looked up in a table. On a GPU that is a gather, so the point there is X_eTaL's concision and the table's size, not speed.
6. **A mixture of experts,** first the array way, every expert computing and the router's mask keeping what was chosen, and a sparse version only if that measures too slow.

Each of these will be measured against both baselines, the evaluator and tuned CPU code.

## The cards

OpenCL is the one runtime that reaches all of them, old and new. Testing every card takes a long time: most need to be fitted into a machine, and some of those machines are themselves being repaired. So the cards come in three groups.

**First:** the cards being measured now. The M1 Max and the RTX 5060 Ti have run; the 3090 and 3060 follow.

| Card | Architecture | Memory | Its role |
|---|---|---|---|
| Apple M1 Max | Apple GPU | 64 GB unified | development; measured; the higher memory bandwidth |
| RTX 5060 Ti | Blackwell | 16 GB | the newest generation; measured, the first NVIDIA card |
| RTX 3090 | Ampere | 24 GB | the most memory of the NVIDIA cards |
| RTX 3060 | Ampere | 12 GB | a mid-range current card; several of them |

**Follow-on:** once the use-cases and measurements are settled on those, a second Apple GPU, and one or two of these older or smaller data-center cards:

| Card | Architecture | Memory | Its role |
|---|---|---|---|
| Apple M3 Pro | Apple GPU | 18 GB unified | a newer Apple generation, with less memory and less bandwidth |
| Tesla P4 | Pascal | 8 GB | an old, low-power card the newest CUDA toolkits retire |
| A2 | Ampere | 16 GB | a small, low-power data-center card |
| Tesla P100 | Pascal | 12 GB and 16 GB, one of each | an old data-center card the newest CUDA toolkits retire |
| Tesla M40 | Maxwell | 12 GB and 24 GB, one of each | an old data-center card the newest CUDA toolkits retire |

**Future, maybe:** cards that may be tested later, the K4200 and the 1660 Super the most likely:

| Card | Architecture | Memory | Its role |
|---|---|---|---|
| Quadro K4200 | Kepler | 4 GB | the oldest generation and the least memory: the case where weights stay on the host |
| GTX 1660 Super | Turing | 6 GB | a small current card |
| Tesla M10 | Maxwell | four GPUs of 8 GB | built to stream many remote desktops, not to run LLMs; each GPU its own device |
| RTX 3060 Laptop GPU | Ampere | 6 GB | in a System76 laptop |
| RTX 4070 Laptop GPU | Ada Lovelace | 8 GB | in an Asus ROG laptop |

Each card runs a program by a schedule file. The 5060 Ti has its own two, in 32-bit and 64-bit floats, with work-groups of 256: the card allows 1,024, but its compiled reduction kernel allows only 256, and the runtime reported that limit rather than failing. The other NVIDIA cards share templates, untested until a card runs them. Nothing in the code changed for the move to Linux. After each group comes a table of what ran where and how fast, and then smaller numbers: 16-bit floats, 8-bit integers and ternary weights.

## What the work asks for

The asks between the repositories show where each layer of the stack still falls short:

- **Of X_eTaL-gpu, from X_eTaL-ML:** run its models from a pinned commit, now done for the world model and the benchmarks; transpose and the convolution's windows, both now done.
- **Of X_eTaL-extensions:** a newer X_eTaL inside the bridge, since the ML libraries use private helpers and tuples its version lacks; and arrays across the bridge in binary, now half done for inputs.
- **Of the language:** the accelerator IR itself, the lowering from X_eTaL to it, and array shapes known when a program is compiled. Until then every model needs a translation into the GPU's form, by hand or by a generator, checked against the evaluator.

This post will be updated as the models land on the cards.

</div>
