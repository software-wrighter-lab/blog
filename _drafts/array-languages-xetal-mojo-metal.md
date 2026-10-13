---
layout: post
title: "Array Languages #10: X_eTaL on Metal, Through Mojo"
categories: [languages, language-design, gpu, tools]
tags: [array-languages, xetal, x-etal, apl, gpu, mojo, metal, apple-silicon, modular, extensions, c-abi, opencl]
keywords: "X_eTaL Mojo backend, X_eTaL Metal, array language on Apple silicon GPU, Mojo GPU programming, Mojo Apple GPU, Metal backend, OpenCL deprecated on macOS, Mojo C ABI, abi C effect, @export, X_eTaL extension ABI, M1 Max, M3 Pro"
abstract: "Tenth in the Array Languages series, a plan before there is code: a second GPU backend for X_eTaL. The GPU work in post #7 reaches Apple silicon through OpenCL, which Apple deprecated years ago and which costs about 1.3 ms a call on an M1 Max. Mojo, from Modular, compiles GPU code for Apple's own Metal, and it can now export a plain C interface, which is what X_eTaL's extensions speak. So the same lowered X_eTaL could be emitted as Mojo and run on Metal, plugged in as an extension, with the X_eTaL-gpu and X_eTaL-ML programs unchanged."
series: "Array Languages"
series_part: 10
date: 2026-10-16 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/modular-fork"
    title: "modular-fork (Mojo and MAX)"
---

<!-- DRAFT, A PLAN (2026-10-13): no X_eTaL code for this exists yet, and where it will live is not settled
     (it may be part of an existing repo rather than a new one). Facts about Mojo are from the fork's own docs
     (softwarewrighter/modular-fork, Mojo 1.2 development build, 2026-10-13): release notes v0.25.6 (2025-09-22),
     v1.0.0b1 (2026-05-07), v1.1.0 (2026-09-17), the nightly changelog, and Mojo/proposals/c-abi-proposal.md.
     Chips to test: M1 Max, M3 Pro (Mojo targets apple-m1, apple-m3; no M5 yet); RTX 3060/3090 (sm_86), RTX 5060 Ti (sm_120),
     per Mojo/stdlib/std/_plugin/metal/metal_targets.mojo and _gpu/host/_builtin_targets.mojo. Lead image is a placeholder. Re-check everything against the code once work starts. -->

<img src="{{ '/assets/images/posts/placeholder-array-languages-xetal-mojo-metal.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[Post #7](/2026/10/13/array-languages-xetal-gpu/) took X_eTaL programs to GPUs through OpenCL, lowered from their own source. On a Mac that works, but through an API Apple stopped developing years ago. This post is a plan, written before the code: a second backend that reaches Apple's GPUs through Metal, their own API, by way of Mojo.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **Mojo and MAX** | [modular/modular](https://github.com/modular/modular), Modular's repository · [softwarewrighter/modular-fork](https://github.com/softwarewrighter/modular-fork), the fork this plan reads |
| **The GPU work** | [Array Languages #7: X_eTaL-gpu](/2026/10/13/array-languages-xetal-gpu/) |
| **The extension ABI** | [Array Languages #4: X_eTaL-extensions](/2026/10/10/array-languages-xetal-extensions/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## Why another way onto the same GPU

Today the X_eTaL-gpu work reaches every GPU it uses through OpenCL, the M1 Max and M3 Pro included. That was the right first choice: one runtime that reaches old and new cards from every vendor. On Apple silicon, though, it has costs:

- **OpenCL on macOS is frozen.** Apple deprecated it in favor of Metal, and it stays at version 1.2.
- **It is slow to call.** Post #7 measured about 1.3 ms of fixed cost on every call on the M1 Max, even with nothing to upload, against about 0.2 ms on the RTX 5060 Ti. That fixed cost is a large part of why the M1 Max lost to Apple's tuned CPU library on small batches.
- **Its profiling is hard to trust.** Apple's OpenCL reports kernel times of a few hundredths of a millisecond for everything, which no second clock has confirmed.
- **The newest hardware is reached through Metal.** Mojo, for one, reaches the matrix multiply units of Apple's M5 chips through Metal, and Apple's own GPU work goes there, not to OpenCL. The chips here, an M1 Max and an M3 Pro, have no such units, so for them the gain to look for is the cost of a call, not new hardware.

## Why Mojo

Mojo is Modular's systems language, Python-like in its surface, built for writing high-performance code for CPUs and accelerators. One Mojo program can target NVIDIA, AMD and Apple GPUs, and on Apple silicon it compiles to Metal. Its Apple support has grown quickly, according to its own release notes:

- **September 2025, v0.25.6:** initial support for programming Apple silicon GPUs, with many hardware features still to come.
- **Since then:** warp operations such as shuffles mapped onto Metal's own SIMD-group operations, and more of the standard library's GPU support on Apple.
- **May 2026, v1.0 beta:** Apple Metal "a much more capable Mojo target", with `print` working in kernels, dynamic threadgroup memory, the matrix multiply-accumulate units of Apple's M5 chips, and Metal 4 features by default.

Two limits matter for X_eTaL. Apple GPUs have no 64-bit floats, so `float64` is not supported there, the same as under OpenCL; X_eTaL's GPU work already runs in 32-bit floats on Apple and checks against the evaluator within 1e-5. And Modular's MAX graph engine was not enabled on Apple GPUs when Apple support began, so the plan uses Mojo kernels directly rather than MAX.

## How it would plug in

The GPU work is already in layers. The program and its lowering stay as they are, and only the layers below them change:

| Layer | Through OpenCL, today | Through Mojo, the plan |
|---|---|---|
| the program | X_eTaL source | the same |
| lowering | X_eTaL to the accelerator IR, through X_eTaL's own crates | the same |
| schedule | how a device runs the IR | the same idea, Metal's limits |
| emitter | OpenCL C kernels | Mojo kernels |
| runtime | the OpenCL host runtime | a Mojo library, compiled for Metal |
| X_eTaL's view | the gpu extension, through the extension ABI | another extension, the same ABI |

The piece that makes this possible arrived recently. X_eTaL's native extensions, from [post #4](/2026/10/10/array-languages-xetal-extensions/), are shared libraries that speak the C ABI: each exports one C descriptor of its functions. Until lately Mojo's `@export` produced its own struct-flattening convention rather than the platform's C ABI. Mojo now has an `abi` effect, and `@export` requires one, so a Mojo function can be written to be callable from C exactly as C expects. From Mojo's own proposal:

```mojo
def add(a: Int32, b: Int32) abi("C") -> Int32:
    return a + b
```

With that, a Mojo library can present the same kind of C boundary the Rust extensions do, and X_eTaL loads it like any other extension. To an X_eTaL program, and to X_eTaL-ML's models, nothing changes. The program is written once, lowered once, and runs on Metal or OpenCL depending on which runner is plugged in.

## The same backend on NVIDIA

Mojo is not only for Apple. It compiles GPU kernels for NVIDIA cards by architecture, and its target list covers the cards being tested first: sm_86, the Ampere architecture of the RTX 3060 and RTX 3090, and sm_120, the Blackwell architecture of the RTX 5060 Ti. It also lists Maxwell, Pascal and Turing, the generations of the older cards. So one Mojo backend could reach both the Macs and the NVIDIA cards, through Metal on one and NVIDIA's own driver on the other, and set beside the OpenCL path on the same cards. A target in a list is not a tested card, though; each will be confirmed by running it.

## What would be measured

The checks stay the same: the X_eTaL evaluator is the reference, and every result must match it, integers exactly and floats within 1e-5. The measurements are the ones post #7 already has for OpenCL, repeated through Metal on the same two Apple GPUs, the M1 Max and the M3 Pro, and then through Mojo on the NVIDIA cards:

- **The fixed cost per call.** Whether Metal cuts the 1.3 ms Apple's OpenCL charges, which is what keeps small batches from paying.
- **The upload.** Apple silicon's CPU and GPU share one memory, so how much a batch costs to hand over is an open question worth measuring, not assuming.
- **The kernels,** timed by a clock that can be trusted.
- **Against tuned CPU code.** The same world model and benchmarks against Apple's Accelerate, the comparison the OpenCL path lost on small batches.

And the same rule applies: the work worth offloading is products in big batches, with little uploaded and the data kept on the GPU.

## Where it stands

Nothing is built yet. The fork of Modular's repository is pinned to a current development build of Mojo, and where the X_eTaL side will live is not settled: it may become part of an existing repository rather than a new one. The first step is small: one X_eTaL example, lowered as it is today, emitted as Mojo, run on the M1 Max through Metal, and checked against the evaluator. If that works, the rest of post #7's examples and X_eTaL-ML's batch models follow, and the two backends can be compared on the same chips. This post will be updated, or followed by another, when there is code.

</div>
