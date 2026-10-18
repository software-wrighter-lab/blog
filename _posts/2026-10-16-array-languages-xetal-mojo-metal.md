---
layout: post
title: "Array Languages #10: X_eTaL on Metal and CUDA, Through Mojo"
categories: [languages, language-design, gpu, tools]
tags: [array-languages, xetal, x-etal, apl, gpu, mojo, metal, cuda, apple-silicon, nvidia, modular, c-abi, opencl, mlx]
keywords: "X_eTaL Mojo backend, array language on GPU through Mojo, Mojo GPU programming, Mojo Apple GPU, Mojo Metal, Mojo NVIDIA, PTX ptxas CUDA driver, mojo build emit shared-lib, Mojo C ABI, OpenCL deprecated on macOS, M1 Max, RTX 5060 Ti, MLX"
abstract: "Tenth in the Array Languages series: X_eTaL programs on GPUs through a second backend, Mojo. Post #7's GPU work lowers X_eTaL source to an accelerator IR and runs it through OpenCL, which Apple deprecated in 2018. Now the same IR also goes to a Mojo emitter: X_eTaL source in, Mojo out, built into a library with a C interface, and run through Metal on an Apple M1 Max and through NVIDIA's driver on an RTX 5060 Ti, with nothing written or lowered by hand. Five demos give the X_eTaL evaluator's answers on both. Matrix products, gathers and the ML models come next; the older cards stay with OpenCL unless Mojo can be configured for them."
series: "Array Languages"
series_part: 10
date: 2026-10-16 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu (the Mojo backend: components/mojo)"
  - url: "https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo"
    title: "modular-fork: rust-demo (the first proof)"
---

<!-- DRAFT (rewritten 2026-10-16 afternoon, after gpu-mojo step 022 and the Arch rerun). Sources:
     X_eTaL-gpu f5d8fdd (the Mojo backend, components/mojo; 5 demos on the M1 Max via Metal), 937e8dc/4052c92 (Arch rerun:
     docs/rtx5060-mojo-results.md, 5 demos on the RTX 5060 Ti via the CUDA driver, driver 615.78.08), a5628b3 and eb5c620 (README;
     host disks: Mac SSD, Arch hard disk, so whole-process times compare hosts), components/mojo/tests/expected/refused.txt.
     modular-fork experimental: 261316e573 (rust-demo, M1 Max), 12d3d05ba9 (5060 Ti), f95c7ba386 (lowered Accel demos),
     5566c667e7 (ten programs on the 5060 Ti); rust-demo/doc/results.md and doc/evidence/.
     Saga gpu-mojo steps still PENDING: 024 mojo-ints-shapes, 025 mojo-structure, 026 mojo-device, 027 mojo-results.
     The saxpy source and Mojo kernel below: xetal render libs/Accel/demos/saxpy.xtl and just mojo-kernel, on the Mac, 2026-10-16.
     VISUALS: path (current), thread map (rust-demo run), terminals (rust-demo run, in The first proof), source terminals (just run-mojo on both: Mac 2026-10-16 here,
     Arch from modular-fork 9cb4ca0521 rust-demo/doc/evidence/rtx5060-20261016-source-terminal/), cards timeline done 2026-10-16. -->

<img src="{{ '/assets/images/posts/block-modular-max-mojo.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

<div style="overflow: hidden;" markdown="1">

[Post #7](/2026/10/13/array-languages-xetal-gpu/) took X_eTaL array programs to GPUs through OpenCL, lowered from their own source. On a Mac that works, but through an API Apple stopped developing years ago. Now the same programs have a second way onto the GPU: X_eTaL source in, Mojo out, run through Metal on an Apple M1 Max and through NVIDIA's own driver on an RTX 5060 Ti, with nothing written or lowered by hand.

</div>

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The Mojo backend** | [X_eTaL-gpu: components/mojo](https://github.com/softwarewrighter/X_eTaL-gpu/tree/main/components/mojo) |
| **Results** | [RTX 5060 Ti through Mojo](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/rtx5060-mojo-results.md) · [first proof, per device](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/results.md) |
| **The first proof** | [rust-demo](https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo), in softwarewrighter/modular-fork |
| **The OpenCL work** | [Array Languages #7: X_eTaL-gpu](/2026/10/13/array-languages-xetal-gpu/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>


## Why another way onto the same GPU

The X_eTaL-gpu work reaches every GPU it uses through OpenCL, the M1 Max included. That was the right first choice: one runtime for old and new cards from every vendor. On Apple silicon, though, it has costs:

- **OpenCL on macOS is a leftover.** Apple deprecated it in 2018, with macOS 10.14, in favor of Metal. It still ships, frozen at version 1.2.
- **It is slow to call.** Post #7 measured about 1.3 ms of fixed cost on every call on the M1 Max, against about 0.2 ms on the RTX 5060 Ti, a large part of why the M1 Max lost to Apple's tuned CPU library on small batches.
- **Its profiling is hard to trust.** Apple's OpenCL reports kernel times of a few hundredths of a millisecond for everything, which no second clock has confirmed.

## Why Mojo

Mojo is Modular's systems language, Python-like on the surface, built for high-performance code on CPUs and accelerators. One Mojo program can target NVIDIA, AMD and Apple GPUs. Two things made it a fit:

- **It reaches Apple's GPUs through Metal.** Support began in September 2025, with v0.25.6, and by the v1.0 beta in May 2026 Apple Metal was "a much more capable Mojo target".
- **It speaks C.** X_eTaL's native extensions, from [post #4](/2026/10/10/array-languages-xetal-extensions/), are shared libraries with a C interface. Mojo's `@export` now takes an `abi("C")` effect, so a Mojo library can present exactly that boundary.

## From X_eTaL source to Mojo

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/xetal-mojo-path.webp' | relative_url }}" class="no-invert" alt="The path from X_eTaL source to two GPUs: saxpy.xtl is lowered by xetal-gpu to XIR, which goes either to the OpenCL emitter and runtime of post #7 or to the Mojo emitter, mojo build, a library with a C ABI, and then Metal on the Apple M1 Max or the CUDA driver on the RTX 5060 Ti; every result is checked against the X_eTaL evaluator">
<figcaption style="font-size: 0.85em;">One program, two backends, and through Mojo two vendors' GPUs. Click to enlarge.</figcaption>
</figure>

Read the diagram from the top. An X_eTaL program, here the SAXPY demo from post #7's Accel library, is lowered by X_eTaL-gpu into its accelerator IR, using X_eTaL's own crates, so the libraries it uses are inlined and every array operation becomes an IR operation. From there the IR can go two ways. On the left is the path post #7 measured, an OpenCL emitter and runtime. On the right is the new one: a Mojo emitter, a library built by Mojo's compiler, and Mojo choosing the GPU, Metal on the Mac and NVIDIA's driver on the Arch box. Whichever way it goes, the answer is checked against the X_eTaL evaluator.

The program is the one post #7 ran, unchanged:

```text
"ac:" u̲se< "Accel"
x ← (r̲ange 8) ÷ 4
y ← 1.0 ᵃᶜs̲cale 1.0 0.5 0.25 0.125 0.0 -0.125 -0.25 -0.5
(2.0 ᵃᶜs̲cale x) ᵃᶜv̲add y
```


The only change is the device: `xetal-gpu run saxpy.xtl --device mojo` in place of `--device opencl:0`. The Mojo backend fuses the divide, the two scales and the add into one kernel, and writes it as ordinary Mojo a person could read:

```mojo
def stage0(
    b_l: Pointer[Float32, ImmutAnyOrigin],
    b_r_2: Pointer[Float32, ImmutAnyOrigin],
    b_add: Pointer[Float32, MutAnyOrigin],
    n: Int32,
):
    """Stage 0: %div, %mul, %mul_2, %add fused, one thread per element."""
    var i = Int(block_idx.x * block_dim.x + thread_idx.x)
    if i < Int(n):
        var v_l = b_l[unsafe_offset=i]
        var v_r_2 = b_r_2[unsafe_offset=i]
        var v_div = v_l / Float32(4.0)
        var v_mul = Float32(1.0) * v_r_2
        var v_mul_2 = Float32(2.0) * v_div
        var v_add = v_mul_2 + v_mul
        b_add[unsafe_offset=i] = v_add
```

Then `mojo build --emit shared-lib` makes it a library with C entry points, cached by the source's hash, and the tool loads it and calls it. Mojo's `DeviceContext` opens whatever GPU the machine has. The GPU prints `1.5 1.5 1.75 2.125 2.5 2.875 3.25 3.5`, which is what the X_eTaL evaluator prints.


## Five demos, two GPUs

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 48%;">
<img src="{{ '/assets/images/posts/xetal-mojo-source-terminals.webp' | relative_url }}" class="no-invert" alt="Three terminals. Top left, the Apple M1 Max: just run-mojo libs/Accel/demos/reduce-sum.xtl reports api=metal, name=Apple M1 Max, and prints 108, 24, 408, 4.5, 3.1875. Top right, the RTX 5060 Ti on Arch Linux: the same command reports api=cuda, name=NVIDIA GeForce RTX 5060 Ti, and prints the same five numbers. Below, the X_eTaL evaluator on the CPU prints 108 24 408 4.5 3.1875">
<figcaption style="font-size: 0.85em;">One X_eTaL file, through Mojo on two GPUs, and the evaluator's answer. Click to enlarge.</figcaption>
</figure>

One run shows the whole path. The two terminals at the top run the same command, `just run-mojo libs/Accel/demos/reduce-sum.xtl`, on the Mac and on the Arch box. The command lowers the X_eTaL file, has the Mojo backend write and build its kernels, and runs them. The blue line names the GPU that ran it, `api=metal` and the M1 Max on the left, `api=cuda` and the RTX 5060 Ti on the right, and the green lines are the program's five results: a sum, a largest value, a dot product, then a float sum and a sum of squares. The strip below is the X_eTaL evaluator running the same file on the CPU. All three print the same five numbers.

Both runs reused a library already built, which is why the build reads 0. The Arch box's run is an unedited capture from that machine.

<div style="clear: both;"></div>

| Demo | What it exercises | Apple M1 Max, Metal | RTX 5060 Ti, CUDA driver |
|---|---|---|---|
| saxpy | fused elementwise | agrees | agrees |
| threshold | comparisons, Ints, `cast`, floored `mod` | agrees | agrees |
| reduce-sum | sums, maxima, a dot product | agrees | agrees |
| pipeline | two stages split by reductions | agrees | agrees |
| vector-add | Ints and Floats | agrees | agrees |

"Agrees" means the output matches the evaluator's committed baseline for that source, within 1e-5 for floats. The other eight Accel demos are refused by name, each with the operation the Mojo backend does not have yet: a reduction along an axis, an inner product, a transpose, a lookup, a take or drop, a rotation. The OpenCL backend runs all thirteen.

The times say more about the machines than the GPUs. On the 5060 Ti, building a demo's library took 4.25 to 4.78 s the first time, and the first call, which sets up the device, 389 to 593 ms. After that, with the library cached, a second call in the same process took 0.05 to 0.09 ms. On the M1 Max a build takes about 2.6 s, cached after, and a run 3.5 to 4.5 ms, including creating the device context. The two hosts differ in more than their GPUs, the Mac's repository on an SSD and the Arch box's on a hard disk, so whole-process times compare machines, not cards. Neither is yet a fair comparison with OpenCL's per-call cost; that measurement is planned.

## The first proof

Before the backend moved into X_eTaL-gpu, it was a small standalone tool, `rust-demo`, in a fork of Modular's repository: a Rust program that reads the IR's text form, writes Mojo, builds it and runs it. It began with five programs written by hand in the IR, and ended with the five Accel demos above, lowered from X_eTaL source, checked against both its own Rust reference and the X_eTaL evaluator, on both GPUs. That tool is also where the evidence that the GPU, and not the CPU, did the work comes from.

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/xetal-mojo-terminals.webp' | relative_url }}" class="no-invert" alt="Two terminal runs of xir-mojo run programs/reduce.xir side by side: on the Apple M1 Max the device line reads api=metal, on the RTX 5060 Ti api=cuda; both launch 4 blocks of 256 threads, both report element 999 computed by block 3 thread 231, and both end with 3 of 3 outputs agreeing with the Rust reference">
<figcaption style="font-size: 0.85em;">The first proof's same program on both GPUs, in the tool's own output. Click to enlarge.</figcaption>
</figure>

A result that matches could have come from the CPU. So each `rust-demo` run prints the device the library opened, the grid it launched, and, from an extra kernel, which block and thread computed each element. The two terminals show the same program, `reduce`, the sum, largest and smallest of a thousand values, run by the same command on each machine. Read the orange line first: `api=metal` and the M1 Max on the left, `api=cuda` and the RTX 5060 Ti on the right. Everything below it matches, line for line, down to the last green line: three of three outputs agree with the reference.

The times differ, and they are not a race. The Mac's run reused a kernel it had already compiled; the Arch box's was its first. The assembly the device compiler received can be printed too: Metal AIR for `air64-apple-macosx26.0.0` on the Mac, PTX for `sm_120a` on the NVIDIA card.


### Which thread did which element

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/xetal-mojo-provenance.webp' | relative_url }}" class="no-invert" alt="A grid of 1000 cells, one per element of the reduce program, colored by the GPU block that computed it: blocks 0, 1 and 2 have 256 elements each and block 3 has 232; element 0 is marked block 0, thread 0, and element 999 block 3, thread 231">
<figcaption style="font-size: 0.85em;">Which thread computed each element, from the run's own report. Click to enlarge.</figcaption>
</figure>

A GPU runs a kernel as a grid of blocks, each a group of threads that work side by side. The grid on the left is the `reduce` program's thousand elements, one square each, colored by the block whose thread computed it. Three blocks took 256 elements each, and the fourth took the last 232; its other 24 threads found no element and did nothing. The two outlined squares are the ones the tool names: element 0, computed by block 0, thread 0, and element 999, by block 3, thread 231.

That map comes from the GPU, not from the plan. An extra kernel has every thread write down its own block and thread number beside the element it handled, and the tool reads those numbers back. Both GPUs drew the same map, which is what one generated source for two vendors should give.


## How Mojo reaches each GPU

- **Apple silicon:** Mojo compiles kernels to Metal's intermediate form, AIR, and runs them through Metal. No OpenCL.
- **NVIDIA:** Mojo compiles kernels with its own LLVM backend to PTX, NVIDIA's portable GPU assembly; its bundled `ptxas` assembles that to machine code, and the CUDA driver library, `libcuda`, which comes with the driver, loads and launches it. No CUDA toolkit or `nvcc` is needed, only driver 580 or newer, or another `ptxas` named by `MODULAR_NVPTX_COMPILER_PATH`. The 5060 Ti's driver, 615.78, needed no override.
- **AMD:** through ROCm. Not tried here.

So on NVIDIA, Mojo does go through CUDA's driver, even though no CUDA is written. The GPU work's claim of running without CUDA rests on the OpenCL backend, and every result here names the backend it used.

## The cards: Mojo or OpenCL

<figure class="zoomable" style="float: right; clear: both; margin: 0.2em 0 0.6em 1.5em; max-width: 48%;">
<img src="{{ '/assets/images/posts/xetal-mojo-cards.webp' | relative_url }}" class="no-invert" alt="My GPUs by NVIDIA generation, oldest to newest: Kepler, the Quadro K4200 and Tesla K80, OpenCL only, no Mojo target; Maxwell, the Tesla M10 and M40, and Pascal, the Tesla P100 and P4, Mojo compiler targets not listed by Modular, so try Mojo, else OpenCL; Turing, the GTX 1660 Super, generation listed; Ampere, the RTX 3090, RTX 3060, RTX 3060 Laptop and A2, Ada, the RTX 4070 Laptop, and Blackwell, the RTX 5060 Ti, listed, Mojo; the RTX 5060 Ti marked as having run X_eTaL demos through Mojo. Below, Apple silicon through Metal: Mojo listed for M1 to M5, the M1 Max marked as run, the M3 Pro still to try">
<figcaption style="font-size: 0.85em;">My cards by generation: where Mojo reaches, and where OpenCL stays. Click to enlarge.</figcaption>
</figure>

Modular lists the RTX 30, 40 and 50 series and the Turing generation as compatible for Mojo development. Mojo's compiler also has targets for the older Maxwell and Pascal generations, which the docs do not list as supported, and none for Kepler. My plan is to support the older GPUs through X_eTaL-gpu's OpenCL path if I cannot configure Mojo for them. The picture puts each of my cards on NVIDIA's line of generations, oldest on the left: gray where Mojo has no target at all, amber where its compiler has one that Modular does not list, green where it is listed. The two outlined cards, the RTX 5060 Ti and, below, the M1 Max, are the ones that have run X_eTaL through Mojo.

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

<div style="clear: both;"></div>

## What is still to do

The Mojo backend covers elementwise work and whole-array reductions. Still ahead, in order:

- **Axes and structure:** reductions along an axis, several shapes in one program, then tiled matrix products, transposes, lookups, slices, rotations and reshapes, which brings in the rest of the Accel demos and, after them, X_eTaL-ML's models, which run from their own source through OpenCL today.
- **The macro and the extension:** `--device mojo` behind `ᵍᵖa̲ccel<` and the GPU extension, so an X_eTaL program calls the GPU through Mojo itself, with both backends checked against the same answers.
- **Results by GPU,** beside the OpenCL numbers, including the cost of a call with everything already built.
- **Wider Ints:** Ints cross the C boundary as 64-bit floats for now, so values beyond 2^53 are not yet tested.

## What about MLX?

Apple's own MLX is the other way onto Metal, and in some ways the closest thing to X_eTaL already on the Mac: whole-array operations, evaluation deferred so a computation can be compiled and fused, memory the CPU and GPU share, and a C interface. Every operation the lowered programs use has an MLX counterpart, so an MLX runner could call MLX for each operation instead of generating kernels. The trade-off is reach: MLX is for Apple silicon, and Mojo just ran the same programs on an NVIDIA card. Both are worth measuring on the same Macs.

And FPGAs? Mojo compiles for CPUs and GPUs; it has no way to describe hardware, so the Tang boards stay with X_eTaL-fpga.


---

<p class="ed-note" style="font-size: 0.85em;"><em>[Ed. 2026/10/17: X_eTaL code is now shown rendered throughout, as <code>xetal render</code> draws it, including code written inside strings, rather than partly as typed; names that are about how you type them stay typed. <a href="https://github.com/software-wrighter-lab/blog/commits/main/_posts/2026-10-16-array-languages-xetal-mojo-metal.md">This post's history</a>.]</em></p>
