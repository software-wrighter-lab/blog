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
     VISUALS: 1 path, 2 terminals, 3 provenance are drafts (2026-10-16, from today's Mac run and the committed Linux log; redo 2 after gpu-mojo with X_eTaL source); 4 and 5 still [VISUAL n] placeholders.
     ON HOLD (Mike, 2026-10-16): do not publish until X_eTaL-gpu saga gpu-mojo lands (queued after models-from-source, ahead of
     gpu-pipeline): 1 components/mojo emitter + runtime, f32 elementwise and reductions (saxpy, threshold, reduce-sum, pipeline);
     2 Ints, Bool, cast, several shapes, axis reductions (vector-add, host-data, axis-reduce, tiny-net, topk); 3 matmul tiled,
     transpose, lookup, slices, rotate, reshape, table (the rest); 4 --device mojo in the tool and the Gpu extension, check-equiv over
     both backends, the macro choosing Mojo; 5 results by GPU, M1 Max and RTX 5060 Ti, beside OpenCL. Then REWRITE around X_eTaL
     source -> Mojo -> GPUs, and say which backend each result used (Mojo on NVIDIA goes through the CUDA driver; the "ML on GPU
     without CUDA" claim rests on OpenCL alone). Date 10/16 is stale; #11-#13 links assume 10/17-10/19. -->

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

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 44%;">
<img src="{{ '/assets/images/posts/xetal-mojo-path.webp' | relative_url }}" class="no-invert" alt="The path from X_eTaL source to two GPUs: saxpy.xtl is lowered by xetal-gpu to XIR, which goes either to the OpenCL emitter and runtime of post #7 or to the Mojo emitter, mojo build, a library with a C ABI, and then Metal on the Apple M1 Max or the CUDA driver on the RTX 5060 Ti; every result is checked against the X_eTaL evaluator">
<figcaption style="font-size: 0.85em;">One program, two backends, and through Mojo two vendors' GPUs. Click to enlarge.</figcaption>
</figure>

Read the diagram from the top. An X_eTaL program, here the SAXPY demo from post #7's Accel library, is lowered by X_eTaL-gpu into its accelerator IR, using X_eTaL's own crates, so the libraries it uses are inlined and every array operation becomes an IR operation. From there the IR can go two ways. On the left is the path post #7 measured, an OpenCL emitter and runtime. On the right is the new one: a Mojo emitter, a library built by Mojo's compiler, and Mojo choosing the GPU, Metal on the Mac and NVIDIA's driver on the Arch box. Whichever way it goes, the answer is checked against the X_eTaL evaluator.

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

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 50%;">
<img src="{{ '/assets/images/posts/xetal-mojo-terminals.webp' | relative_url }}" class="no-invert" alt="Two terminal runs of xir-mojo run programs/reduce.xir side by side: on the Apple M1 Max the device line reads api=metal, on the RTX 5060 Ti api=cuda; both launch 4 blocks of 256 threads, both report element 999 computed by block 3 thread 231, and both end with 3 of 3 outputs agreeing with the Rust reference">
<figcaption style="font-size: 0.85em;">The same program on both GPUs, the tool's own output: the Mac's run from today, the Arch box's from its committed log. Click to enlarge.</figcaption>
</figure>

A result that matches could have come from the CPU. So each run prints the device the library opened, the grid it launched, and, from an extra kernel, which block and thread computed each element. The two terminals show the same program, `reduce`, the sum, largest and smallest of a thousand values, run by the same command on each machine. Read the orange line first: `api=metal` and the M1 Max on the left, `api=cuda` and the RTX 5060 Ti on the right. Everything below it matches, line for line, down to the last green line: three of three outputs agree with the reference.

The times differ, and they are not a race. The Mac's run reused a kernel it had already compiled; the Arch box's was its first. The assembly the device compiler received can be printed too: Metal AIR for `air64-apple-macosx26.0.0` on the Mac, PTX for `sm_120a` on the NVIDIA card.

<div style="clear: both;"></div>

### Which thread did which element

<figure class="zoomable" style="float: left; clear: both; margin: 0.2em 1.5em 0.6em 0; max-width: 44%;">
<img src="{{ '/assets/images/posts/xetal-mojo-provenance.webp' | relative_url }}" class="no-invert" alt="A grid of 1000 cells, one per element of the reduce program, colored by the GPU block that computed it: blocks 0, 1 and 2 have 256 elements each and block 3 has 232; element 0 is marked block 0, thread 0, and element 999 block 3, thread 231">
<figcaption style="font-size: 0.85em;">Which thread computed each element, from the run's own report. Click to enlarge.</figcaption>
</figure>

A GPU runs a kernel as a grid of blocks, each a group of threads that work side by side. The grid on the left is the `reduce` program's thousand elements, one square each, colored by the block whose thread computed it. Three blocks took 256 elements each, and the fourth took the last 232; its other 24 threads found no element and did nothing. The two outlined squares are the ones the tool names: element 0, computed by block 0, thread 0, and element 999, by block 3, thread 231.

That map comes from the GPU, not from the plan. An extra kernel has every thread write down its own block and thread number beside the element it handled, and the tool reads those numbers back. Both GPUs drew the same map, which is what one generated source for two vendors should give.

<div style="clear: both;"></div>

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

The five programs were written by hand in a small subset of the IR: f32 only, one vector length per program, elementwise steps and whole-array reductions, no matrix product, no axes, no gathers. X_eTaL-gpu's lowering and this emitter are not yet joined: one of its demos, saxpy, has already gone from X_eTaL source to Mojo to the M1 Max, matching the evaluator, but only by piping one tool into the other, and the other demos need operations this emitter does not have yet. Every call sets up the device and uploads its inputs again, with none of the sessions and resident weights X_eTaL-gpu already has.

## What about MLX?

Apple's own MLX is the other way onto Metal, and in some ways the closest thing to X_eTaL already on the Mac: whole-array operations, evaluation deferred so a computation can be compiled and fused, memory the CPU and GPU share, and a C interface. Every operation the lowered programs use has an MLX counterpart, so an MLX runner could call MLX for each operation instead of generating kernels. The trade-off is reach: MLX is for Apple silicon, and Mojo just ran the same code on an NVIDIA card. Both are worth measuring on the same Macs.

And FPGAs? Mojo compiles for CPUs and GPUs; it has no way to describe hardware, so the Tang boards stay with X_eTaL-fpga.

## Next

Connect the real lowering: X_eTaL source through X_eTaL-gpu's IR into this emitter, so the programs from post #7 run here as written. Then add sessions, measure the cost of a call with the kernels already built, set that beside OpenCL's 1.3 ms on the M1 Max, and try the other cards, oldest last.

</div>
