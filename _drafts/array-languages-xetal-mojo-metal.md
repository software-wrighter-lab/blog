---
layout: post
title: "Array Languages #10: Array Code on Metal and CUDA, Through Mojo"
categories: [languages, language-design, gpu, tools]
tags: [array-languages, xetal, x-etal, apl, gpu, mojo, metal, cuda, apple-silicon, nvidia, modular, c-abi, opencl, mlx]
keywords: "X_eTaL Mojo backend, Mojo GPU programming, Mojo Apple GPU, Mojo Metal, Mojo NVIDIA without CUDA toolkit, PTX ptxas libcuda, Rust generates Mojo, mojo build emit shared-lib, Mojo C ABI, abi C, OpenCL deprecated on macOS, M1 Max, RTX 5060 Ti, MLX"
abstract: "Tenth in the Array Languages series: a first proof of a second GPU backend for X_eTaL. Post #7's GPU work reaches every card through OpenCL, which Apple deprecated in 2018. Here a small Rust tool reads programs in X_eTaL-gpu's accelerator IR, writes the Mojo a person would write for them, builds it into a library with a C interface, and runs it. Mojo picks the GPU: Metal on an Apple M1 Max, NVIDIA's driver on an RTX 5060 Ti, from the same generated code. Five programs agree with a reference on both. X_eTaL's own front end is not connected yet, and the older cards stay with OpenCL unless Mojo can be configured for them."
series: "Array Languages"
series_part: 10
date: 2026-10-16 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo"
    title: "modular-fork: rust-demo (Rust writes Mojo, Mojo runs the GPU)"
---

<!-- DRAFT (rewritten 2026-10-16 from a plan into a first proof). Sources: softwarewrighter/modular-fork, branch experimental:
     261316e573 (rust-demo, Apple M1 Max via Metal, 2026-10-13) and 12d3d05ba9 (RTX 5060 Ti via CUDA, Arch box large12, 2026-10-16);
     rust-demo/README.md, doc/results.md, doc/rtx5060-handoff.md, doc/older-gpus.md, doc/evidence/rtx5060-20261016/;
     Modular's GPU compatibility table, docs/max/packages.mdx; Mojo's target table, Mojo/stdlib/std/_gpu/host/_builtin_targets.mojo.
     The generated saxpy kernel below is from the Mac's rust-demo/work/saxpy/saxpy.mojo. Mojo 1.2.0.dev2026101305 on both machines.
     The README of modular-fork is being reworked by its own agent; recheck links into it before publishing.
     VISUALS: placeholders marked [VISUAL n] below; none exist yet. -->

<img src="{{ '/assets/images/posts/block-modular-max-mojo.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[Post #7](/2026/10/13/array-languages-xetal-gpu/) took X_eTaL array programs to GPUs through OpenCL. On a Mac that works, but through an API Apple stopped developing years ago. This post is a first proof of another way: a small Rust tool writes Mojo for the same kind of array code, and Mojo runs it through Metal on an Apple M1 Max and through NVIDIA's own driver on an RTX 5060 Ti, from the same generated source.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The demo** | [rust-demo](https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo) in softwarewrighter/modular-fork, branch `experimental` |
| **Results** | [per device](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/results.md) · [RTX 5060 Ti logs](https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo/doc/evidence/rtx5060-20261016) |
| **Mojo and MAX** | [modular/modular](https://github.com/modular/modular), Modular's repository |
| **The OpenCL work** | [Array Languages #7: X_eTaL-gpu](/2026/10/13/array-languages-xetal-gpu/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

<div class="clearfix" markdown="1" style="clear: both;">

## Why another way onto the same GPU

The X_eTaL-gpu work reaches every GPU it uses through OpenCL, the M1 Max included. That was the right first choice: one runtime for old and new cards from every vendor. On Apple silicon, though, it has costs:

- **OpenCL on macOS is a leftover.** Apple deprecated it in 2018, with macOS 10.14, in favor of Metal. It still ships, frozen at version 1.2.
- **It is slow to call.** Post #7 measured about 1.3 ms of fixed cost on every call on the M1 Max, against about 0.2 ms on the RTX 5060 Ti, a large part of why the M1 Max lost to Apple's tuned CPU library on small batches.
- **Its profiling is hard to trust.** Apple's OpenCL reports kernel times of a few hundredths of a millisecond for everything, which no second clock has confirmed.

## Why Mojo

Mojo is Modular's systems language, Python-like on the surface, built for high-performance code on CPUs and accelerators. One Mojo program can target NVIDIA, AMD and Apple GPUs. Two things made it a fit:

- **It reaches Apple's GPUs through Metal.** Support began in September 2025, with v0.25.6, and by the v1.0 beta in May 2026 Apple Metal was "a much more capable Mojo target".
- **It speaks C.** X_eTaL's native extensions, from [post #4](/2026/10/10/array-languages-xetal-extensions/), are shared libraries with a C interface. Mojo's `@export` now takes an `abi("C")` effect, so a Mojo library can present exactly that boundary.

## What was built

<!-- [VISUAL 1] Left gutter, zoomable: the path as a diagram. One box column: "XIR text" → "Rust emitter" → "generated Mojo" →
     "shared library (C ABI)" → "Mojo DeviceContext", then forking to two boxes: "Metal → Apple M1 Max" and "PTX → ptxas → libcuda →
     RTX 5060 Ti", with a dotted "Rust reference" arrow back to a "compare" box. Why: the post's one claim is one generated source,
     two vendors; the fork in the picture is that claim. Text beside it: the paragraph below. -->

The tool, `rust-demo`, is a simpler cousin of X_eTaL-gpu's `gp:a_ccel<` macro and OpenCL emitter. It reads a program in the text form of X_eTaL-gpu's accelerator IR, checks it, and writes Mojo: elementwise steps fused into one kernel, split where a reduction needs the whole array, reductions as two-pass trees in shared memory. `mojo build --emit shared-lib` turns that into a library with C entry points; Rust loads it and calls it; Mojo's `DeviceContext` opens whatever GPU the machine has. Every output is checked against a reference evaluator written in Rust.

A program is a few lines. SAXPY, `y = a x + b`:

```text
%x = input f32 [8]
%a = const f32 [] 2.0
%b = const f32 [] 1.0
%ax = map mul %a %x
%y = map add %ax %b
output %y
```

And the kernel Rust writes for it, ordinary Mojo a person could keep:

```mojo
def stage0(
    b_x: Pointer[Float32, ImmutAnyOrigin],
    b_y: Pointer[Float32, MutAnyOrigin],
    n: Int32,
):
    """Stage 0: %ax, %y fused, one thread per element."""
    var i = Int(block_idx.x * block_dim.x + thread_idx.x)
    if i < Int(n):
        var v_x = b_x[unsafe_offset=i]
        var v_ax = Float32(2.0) * v_x
        var v_y = v_ax + Float32(1.0)
        b_y[unsafe_offset=i] = v_y
```

The other four programs cover comparisons and selection, sums and extremes of a thousand values, a softmax written the way X_eTaL-ML's NN library writes it, and a mean and variance.

## Proving the GPU ran it

<!-- [VISUAL 2] Right gutter, zoomable: the two terminals side by side, `just run softmax` (or reduce) on the Mac and on the Arch box:
     the "device: api=metal name=Apple M1 Max" and "device: api=cuda name=NVIDIA GeForce RTX 5060 Ti" lines, the launch and proof lines,
     and "RESULT: ... agree". Real screenshots from each machine (Mike captures; the Linux log is in doc/evidence/). Why: the evidence
     a skeptical reader wants, on screen, in the tool's own words. -->

A result that matches could have come from the CPU. So each run prints the device the library opened, the grid it launched, and, from an extra kernel, which block and thread computed each element. On the thousand-element programs, both GPUs ran four blocks of 256 threads, the last one 232 wide, and element 999 came from block 3, thread 231. The assembly the device compiler received is printed too: Metal AIR for `air64-apple-macosx26.0.0` on the Mac, PTX for `sm_120a` on the NVIDIA card.

<!-- [VISUAL 3] Left gutter, zoomable: a provenance strip. 1000 cells in a row (or a 40 by 25 grid), colored by the block that computed
     each element (four colors, the last block visibly shorter), with element 0 and 999 labeled "block 0, thread 0" and "block 3,
     thread 231". Generated from the log's numbers (an X_eTaL + Video.xtl still would keep it in the family). Why: the provenance
     argument is about which thread did which element; a strip shows it at a glance where a sentence asks the reader to imagine it. -->

## Results

| Program | What it exercises | Apple M1 Max, Metal | RTX 5060 Ti, CUDA |
|---|---|---|---|
| saxpy | fused elementwise | exact | exact |
| threshold | comparisons, bools, select | exact | exact |
| reduce | sum, max, min of 1000 values | exact | exact |
| softmax | two stages split by reductions | within 5e-7 | within 4.77e-7 |
| stats | mean and variance | within 6.6e-6 | within 6.56e-6 |

The reductions differ in the last places because the GPU adds as a tree and the reference adds from the right, and all are within the tolerance. Nothing changed for NVIDIA: the same Rust, the same programs, the same generated Mojo, built as a `.so` on Linux where the Mac builds a `.dylib`. Building each program took about 2.6 s on the Mac and 4.5 s on the Arch box; one run took 40 to 55 ms and about 0.4 s. Those run times include compiling each kernel on first use and setting up the device, on a single run, so they are not a measure of either GPU, and not comparable with OpenCL's per-call cost yet.

## How Mojo reaches each GPU

<!-- [VISUAL 4, optional] Right gutter: a two-lane strip, "Apple: Mojo → Metal AIR → Metal" and "NVIDIA: Mojo → PTX → ptxas → machine
     code → libcuda (driver)", with "no CUDA toolkit, no nvcc, no OpenCL" crossed-out chips. Could be merged into VISUAL 1 instead.
     Why: readers expect "NVIDIA means CUDA C"; the lane shows what Mojo actually uses. -->

- **Apple silicon:** Mojo compiles kernels to Metal's intermediate form, AIR, and runs them through Metal. No OpenCL.
- **NVIDIA:** Mojo compiles kernels with its own LLVM backend to PTX, NVIDIA's portable GPU assembly; its bundled `ptxas` assembles that to machine code, and the CUDA driver library, `libcuda`, which comes with the driver, loads and launches it. No CUDA toolkit or `nvcc` is needed, only driver 580 or newer, or another `ptxas` named by `MODULAR_NVPTX_COMPILER_PATH`.
- **AMD:** through ROCm. Not tried here.

## The cards: Mojo or OpenCL

<!-- [VISUAL 5] Full-width or right gutter, zoomable: an architecture timeline, Kepler → Maxwell → Pascal → Turing → Ampere → Ada →
     Blackwell, with each of Mike's cards placed on it, and three bands: "Mojo, listed" (Turing and newer), "Mojo compiler target,
     unlisted" (Maxwell, Pascal), "OpenCL" (Kepler); the 5060 Ti marked verified. Why: the table below is right but dense; the
     timeline shows the split between the two backends at a glance, and why both stay. Follow the dataviz rules: status colors with
     labels, not color alone. -->

Modular lists the RTX 30, 40 and 50 series and the Turing generation as compatible for Mojo development. Mojo's compiler also has targets for the older Maxwell and Pascal generations, which the docs do not list as supported, and none for Kepler. My plan is to support the older GPUs through X_eTaL-gpu's OpenCL path if I cannot configure Mojo for them.

| Card | Generation | Mojo | Plan |
|---|---|---|---|
| RTX 5060 Ti 16 GB | Blackwell, sm_120 | listed, ran it | Mojo |
| RTX 4070 Laptop 8 GB | Ada, sm_89 | listed | Mojo |
| RTX 3090 24 GB, RTX 3060 12 GB, RTX 3060 Laptop | Ampere, sm_86 | listed | Mojo |
| A2 16 GB | Ampere, sm_86 | generation listed | Mojo, to confirm |
| GTX 1660 Super | Turing, sm_75 | generation listed | Mojo, to confirm |
| Tesla P100, P4 | Pascal | compiler target only | try Mojo, else OpenCL |
| Tesla M40, M10 | Maxwell | compiler target only | try Mojo, else OpenCL |
| Tesla K80, Quadro K4200 | Kepler | none | OpenCL |

The M3 Pro is the other Mac to try; Mojo lists M1 through M5.

## What it is not yet

The five programs were written by hand in a small subset of the IR: f32 only, one vector length per program, elementwise steps and whole-array reductions, no matrix product, no axes, no gathers. X_eTaL's own front end is not connected, so no X_eTaL source has gone through this path yet, and X_eTaL-gpu's OpenCL runtime is not replaced. Every call sets up the device and uploads its inputs again, with none of the sessions and resident weights X_eTaL-gpu already has.

## What about MLX?

Apple's own MLX is the other way onto Metal, and in some ways the closest thing to X_eTaL already on the Mac: whole-array operations, evaluation deferred so a computation can be compiled and fused, memory the CPU and GPU share, and a C interface. Every operation the lowered programs use has an MLX counterpart, so an MLX runner could call MLX for each operation instead of generating kernels. The trade-off is reach: MLX is for Apple silicon, and Mojo just ran the same code on an NVIDIA card. Both are worth measuring on the same Macs.

And FPGAs? Mojo compiles for CPUs and GPUs; it has no way to describe hardware, so the Tang boards stay with X_eTaL-fpga.

## Next

Connect the real lowering: X_eTaL source through X_eTaL-gpu's IR into this emitter, so the programs from post #7 run here as written. Then add sessions, measure the cost of a call with the kernels already built, set that beside OpenCL's 1.3 ms on the M1 Max, and try the other cards, oldest last.

</div>
