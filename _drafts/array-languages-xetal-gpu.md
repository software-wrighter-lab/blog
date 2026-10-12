---
layout: post
title: "Array Languages #7: X_eTaL-gpu, One Array Program on Old GPUs"
categories: [languages, language-design, gpu, hardware]
tags: [array-languages, xetal, x-etal, apl, gpu, opencl, kepler, maxwell, pascal, turing, ampere, ada-lovelace, blackwell, accelerator-ir, parallelism]
keywords: "X_eTaL GPU, array language on GPU, OpenCL C 1.2 kernels, kernel fusion, tree reduction, accelerator IR, retired CUDA cards, Kepler, Maxwell, Pascal, Turing, Ampere, Ada Lovelace, Blackwell, Apple M1 Max, Apple M3 Pro, Quadro K4200, Tesla M10, Tesla P4, GTX 1660 Super, RTX 3090, RTX 4070, RTX 5060, A2, whole-array parallelism, GPU native extension"
abstract: "Seventh in the Array Languages series: X_eTaL-gpu runs X_eTaL programs on GPUs through OpenCL, aiming at old and new cards alike, from a Kepler Quadro and Maxwell and Pascal Teslas that the newest CUDA toolkits retire to Turing through Blackwell. Whole-array operations already say what can run in parallel, so the same typed program runs on the evaluator or as GPU threads, with the same answer. So far it runs on a laptop GPU: a chain of operations becomes one fused kernel, a sum becomes a tree, a 512 by 512 matrix product runs in a fraction of a second, and X_eTaL calls the GPU itself. Next come a tiny model's whole inference and the old cards."
series: "Array Languages"
series_part: 7
date: 2026-10-13 00:15:00 -0700
demo_url: "https://softwarewrighter.github.io/X_eTaL-gpu/"
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- DRAFT, IN PROGRESS: refreshed 2026-10-12 from X_eTaL-gpu at 32278b1 (the hardware table; saga 4 gpu-models active, steps 0-0c done).
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

For now each twin is written by hand, and a check proves it equal to the evaluator's output. Lowering X_eTaL to the IR belongs in the language, and is filed there as an ask; when it lands, the twins go, and the goal is one command, `xetal run --device opencl:0`.

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

All of it so far runs on the GPU in this Mac, through Apple's OpenCL 1.2:

- **The foundation.** Five example programs, each reproduced on the GPU, and reductions checked at a million items against the evaluator.
- **Array algebra.** Reductions along an axis: row sums, column sums and row maxima. Inner products, untiled and in tiles. And a tiny two-layer network, dense, ReLU, dense and softmax, whose output on the GPU matches the evaluator's.
- **The GPU as an extension.** Through the bridge from [post #4](/2026/10/10/array-languages-xetal-extensions/), an X_eTaL program calls the GPU itself.

| A 512 by 512 matrix product | Time |
|---|---|
| X_eTaL evaluator | 29 s |
| on the GPU | 0.13 s |
| called from X_eTaL, through the bridge | 31 times faster than the evaluator |

## The cards

OpenCL is the one runtime that reaches all of them, old and new. These are the cards the work is aimed at, from the repo's hardware table:

| Card | Architecture | Memory | Its role |
|---|---|---|---|
| Apple M1 Max | Apple GPU | 64 GB unified | development, and every check so far; the higher memory bandwidth |
| Apple M3 Pro | Apple GPU | 18 GB unified | a newer generation, with less memory and less bandwidth |
| Quadro K4200 | Kepler | 4 GB | the oldest card here and the least memory: the case where weights stay on the host |
| Tesla M10 | Maxwell | four GPUs of 8 GB | an old card the newest CUDA toolkits retire; built to stream many remote desktops, not to run LLMs; each GPU its own device |
| Tesla P4 | Pascal | 8 GB | an old card the newest CUDA toolkits retire |
| GTX 1660 Super | Turing | 6 GB | the oldest of the newer generations, and little memory |
| RTX 3090 | Ampere | 24 GB | a current card, and the most memory |
| RTX 4070 | Ada Lovelace | 12 GB | a current card |
| RTX 5060 | Blackwell | 8 GB | the newest generation |
| A2 | Ampere | 16 GB | a small, low-power data-center card |

How a card runs a program is a schedule file. The NVIDIA cards have three: one for the older generations, one for the newer, and the newer one again with 64-bit floats, all still templates until a card runs them. The work moves next to an Arch Linux machine with some of these cards in it. Nothing in the code changes for that: the OpenCL library is loaded when the program runs, and the checks use every device they find. The plan from there is the Arch machine's cards first, then the older K4200, M10 and P4, then one program on every card present, Kepler to Blackwell, with a table of what ran where and how fast. After that come smaller numbers: 16-bit floats, 8-bit integers, and finally ternary weights packed two bits apiece.

## What comes next

Before the cards, a model. The next stage is a tiny typed-decision model: a small transformer-like classifier, trained from scratch, that sorts a request into one of five decisions, such as drawing, querying an array or explaining. Its inference is written as X_eTaL array code, embedding lookup, attention as array operations, normalization, a feed-forward layer and a classifier, and the whole of it is scheduled as OpenCL kernels, with the same decision on the CPU and the GPU and a picture of which X_eTaL operations became which kernels.

This post will be updated as that lands.

</div>
