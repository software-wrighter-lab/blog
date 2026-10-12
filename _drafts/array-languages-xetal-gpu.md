---
layout: post
title: "Array Languages #7: X_eTaL-gpu, Array Programs on GPUs Old and New"
categories: [languages, language-design, gpu, hardware]
tags: [array-languages, xetal, x-etal, apl, gpu, opencl, kepler, maxwell, pascal, turing, ampere, ada-lovelace, blackwell, accelerator-ir, parallelism]
keywords: "X_eTaL GPU, array language on GPU, OpenCL C 1.2 kernels, kernel fusion, tree reduction, accelerator IR, retired CUDA cards, Kepler, Maxwell, Pascal, Turing, Ampere, Ada Lovelace, Blackwell, Apple M1 Max, Apple M3 Pro, Quadro K4200, Tesla M10, Tesla P4, GTX 1660 Super, RTX 3060, RTX 3060 Laptop GPU, RTX 3090, RTX 4070 Laptop GPU, RTX 5060 Ti, A2, whole-array parallelism, GPU native extension"
abstract: "Seventh in the Array Languages series: X_eTaL-gpu runs X_eTaL programs on GPUs through OpenCL, on old and new cards alike, from a Kepler Quadro and Maxwell and Pascal Teslas that the newest CUDA toolkits retire to Turing through Blackwell. Whole-array operations already say what can run in parallel, so the same typed program can run on the evaluator or as GPU threads, with the same answer. Two GPUs are measured so far, an M1 Max and an RTX 5060 Ti: a chain of operations becomes one fused kernel, a sum becomes a tree, X_eTaL calls the GPU itself, and the machine-learning models from post #5 have started to run on the cards."
series: "Array Languages"
series_part: 7
date: 2026-10-13 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-gpu/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- DRAFT, IN PROGRESS: refreshed 2026-10-12 from X_eTaL-gpu at 5203cd7 (two GPUs measured: docs/ml-results.md for the M1 Max,
     docs/rtx5060-results.md and rtx5060-ml-results.md for the RTX 5060 Ti on Arch; world model on the M1 Max; step transpose begun)
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

Two GPUs have run it so far: the M1 Max in this Mac, through Apple's OpenCL 1.2, and an RTX 5060 Ti in an Arch Linux machine, through NVIDIA's OpenCL. On both, the work so far is:

- **The foundation.** The example programs, each reproduced on the GPU, and reductions checked from a thousand items to a million against the evaluator.
- **Array algebra.** Reductions along an axis: row sums, column sums and row maxima. Inner products, untiled and in tiles. And a tiny two-layer network, dense, ReLU, dense and softmax, whose output on the GPU matches the evaluator's.
- **The GPU as an extension.** Through the bridge from [post #4](/2026/10/10/array-languages-xetal-extensions/), an X_eTaL program calls the GPU itself.

On the RTX 5060 Ti every check agrees: all eight example twins and six sizes, fourteen cases, in 32-bit floats within a relative 1e-5, and again in 64-bit floats, which that card has and Apple's OpenCL lacks, within 1e-12. One program, with the GPU called through the bridge, which carries arrays as text, gives this on each machine:

| Machine | Work | X_eTaL evaluator | GPU, through the bridge |
|---|---|---|---|
| M1 Max | a 512 by 512 matrix product | 14.5 s | 0.46 s, 31 times faster |
| M1 Max | a million items, elementwise, then summed | 0.19 s | 2.4 s, 13 times slower |
| RTX 5060 Ti | a 512 by 512 matrix product | 25.0 s | 0.98 s, 25 times faster |
| RTX 5060 Ti | a million items, elementwise, then summed | 0.25 s | 1.44 s, 5.7 times slower |

The evaluator times differ because the two machines do. The pattern is the same on both: products gain even through the bridge, and elementwise work does not, because moving a million numbers across as text costs more than the arithmetic. Small jobs lose too. On the 5060 Ti a thousand items took longer on the GPU than in the evaluator, because setting up the GPU costs more than the work, while the whole checked program for a 512 by 512 product ran in 0.3 s against the evaluator's 55 s. That bridge cost comes up again below.

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

How a card runs a program is a schedule file. The RTX 5060 Ti has its own two, in 32-bit and 64-bit floats, with work-groups of 256: the card allows 1,024, but its compiled reduction kernel allows only 256, and the runtime reported that limit rather than failing. The other NVIDIA cards share templates that are untested until a card runs them. Nothing in the code changed for the move to Linux: the OpenCL library is loaded when the program runs, and the checks use every device they find. The plan from here is the M3 Pro and the other cards, the older K4200, M10 and P4 among them, then one program on every card present, Kepler to Blackwell, with a table of what ran where and how fast. After that come smaller numbers: 16-bit floats, 8-bit integers, and finally ternary weights packed two bits apiece.

## The ML models on the GPUs

The plan has changed since the GPU work began. The machine-learning models from [post #5](/2026/10/11/array-languages-xetal-ml/) are now to be tested, measured and shown on these cards. X_eTaL-ML writes no GPU code for it. It hands over each model as a batch X_eTaL program, with its weights and its expected outputs, and X_eTaL-gpu runs it on each device. That happens at the command line only, since the live pages run X_eTaL as WebAssembly, which cannot reach OpenCL.

Three workloads come first, because they need only operations the GPU side already has:

1. **A world model** that predicts a ball's next frame from the last three: 432 pixels in, 64 ReLU units, 144 sigmoid pixels out, with all 1,936 states of its world run as one batch. The program prints a single integer, how many next frames it predicts exactly, and that integer must be the same on the evaluator and on every card.
2. **The benchmarks:** a dense layer, a wide inner product and a softmax, with a GPU column beside the evaluator's, first for the M1 Max and M3 Pro, then for each NVIDIA card.
3. **A learned denoiser:** twenty steps from noise to 256 pictures at once. That is twenty calls, not one, so it shows what a call's fixed cost does inside a loop.

Two of the three have already run.

**The benchmarks** ran on both GPUs, and all agree with the evaluator within a relative 1e-5 in 32-bit floats:

| Benchmark | What it computes | Evaluator, M1 Max | Kernels, M1 Max | Kernels, RTX 5060 Ti |
|---|---|---|---|---|
| dense | a dense layer's product, 1024 by 16 times 16 by 16, four times | 121 ms | 0.007 ms | 0.077 ms |
| inner-wide | the CNN's dense layer, 1 by 1352 times 1352 by 10, forty times | 59 ms | 0.44 ms | 1.17 ms |
| softmax | softmax by row on 1000 by 64, ten times | 179 ms | 0.06 ms | 0.55 ms |

The kernels take a fraction of a millisecond, but a whole run takes around 90 ms or more, because the kernels are compiled again on every run, with no cache yet. Don't read the two kernel columns as a race. Apple's profiling counters report a few hundredths of a millisecond for everything here, which no second clock has confirmed yet, and these jobs are too small to say much about either card.

**The world model** ran on the M1 Max. Over all 1,936 states of its world it predicts 1,897 next frames exactly, and 348 of the 387 it never saw in training, and those counts are the same on the evaluator and on the GPU. The evaluator takes 9.9 s. The GPU's kernels take under a tenth of a millisecond, and its whole run 0.11 s. Getting the inputs across the bridge as text takes 0.25 s, more than the run itself. The model's program is not yet committed in X_eTaL-ML, so its run on the 5060 Ti waits for that.

The rule for every result is the same decision always, and numbers within 1e-5 in 32-bit floats, since Apple's OpenCL has none wider. On cards with 64-bit floats the bound is 1e-9, measured against the trainers' own Rust models. The results come back as one table: model, card, decision, the largest difference, and the device's time and the bridge's, listed separately.

Later models need two more operations in the GPU's intermediate form. Transpose, now being added, is needed for attention and for every backward pass. The convolution's windows are needed for the CNNs. With those come the 1.58-bit network, the expert router, the Tiny CNN on the 10,000 MNIST test digits, a MicroGPT, and finally CNN training.

## What the work asks for

The ML work's asks span three repositories, and they show where each layer of the stack still falls short:

- **Of X_eTaL-gpu:** pin X_eTaL-ML the way it pins the language, and add transpose and the convolution's windows.
- **Of X_eTaL-extensions:** a newer X_eTaL inside the bridge, since the ML libraries use private helpers and tuples that the bridge's version lacks. And arrays across the bridge in binary instead of text, since a million numbers take about 0.4 s out and back as text.
- **Of the language:** the accelerator IR itself, the lowering from X_eTaL to it, and array shapes known when a program is compiled. Until then, every model needs a hand-written twin, checked against the evaluator.

## Before the cards, a model

The GPU repo's own next stage is a tiny typed-decision model: a small transformer-like classifier, trained from scratch, that sorts a request into one of five decisions, such as drawing, querying an array or explaining. Its inference is written as X_eTaL array code, embedding lookup, attention as array operations, normalization, a feed-forward layer and a classifier, and the whole of it is scheduled as OpenCL kernels, with the same decision on the CPU and the GPU and a picture of which X_eTaL operations became which kernels.

This post will be updated as the models land on the cards.

</div>
