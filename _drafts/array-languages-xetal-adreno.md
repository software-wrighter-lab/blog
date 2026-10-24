---
layout: post
title: "Array Languages #18: X_eTaL and Mojo on a Qualcomm Adreno 702"
categories: [languages, gpu]
tags: [array-languages, xetal, x-etal, mojo, gpu, qualcomm, adreno, arduino, uno-q, opencl, spir-v, mesa, rusticl, freedreno, llvm, metal, cuda]
keywords: "Mojo on Qualcomm Adreno, X_eTaL OpenCL Adreno 702, Arduino UNO Q GPU, rusticl OpenCL, SPIR-V retarget NVPTX, Freedreno IR3, one Mojo kernel three GPUs, Mojo Metal CUDA Adreno"
abstract: "Eighteenth in the Array Languages series: a threshold and a ReLU, written once in X_eTaL and once in Mojo, run on the Adreno 702 GPU in an Arduino UNO Q, a GPU Mojo does not target. X_eTaL gets there through its own OpenCL backend; Mojo gets there first as the host program, then with its own kernel, retargeted from NVIDIA's IR to SPIR-V. Both reach the same Freedreno instructions. The same Mojo kernel also runs on Apple and NVIDIA GPUs, and X_eTaL's Mojo backend now runs eleven demos. What one day of work established, and what it did not."
series: "Array Languages"
series_part: 18
date: 2026-10-24 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/modular-fork/tree/research-qualcomm-adreno-702-gpu/adreno-poc"
    title: "modular-fork: adreno-poc"
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- DRAFT (2026-10-23), Mike: a new #18 inserted for 10/24 (Ergonomics moved to #19 on 10/25, Tooling to #20 on 10/26).
     Sources: modular-fork branch research-qualcomm-adreno-702-gpu at d76ece32ce, adreno-poc/docs/adreno-deep-dive.md,
     mojo-on-3-gpus.md, slides-2026-10-23 (figures rendered from the deck's HTML slides: board, path-xetal, metal, steps-all,
     three-gpus, adreno-both, boundary; threshold-rendered from docs/images); X_eTaL-gpu 53633e4 (eleven demos through Mojo,
     docs/rtx5060-mojo-results.md). Where the deep dive's section 9 says the RTX run of activation_gpu.mojo had not been done,
     the later mojo-on-3-gpus.md records it with a log; the later document is followed. Lead image: Mike's
     block-activation-curves.jpg (2026-10-23, ~/Downloads), dark color, no-invert. -->

<img src="{{ '/assets/images/posts/block-activation-curves.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

[Rabbit-hole #8](/2026/10/21/rabbit-hole-xetal-to-the-metal/) followed one small X_eTaL program down every GPU toolchain it could reach, and ended on a hedge: a future post may investigate Qualcomm GPUs on a developer board. This is that post. The board is an Arduino UNO Q, and its GPU is a Qualcomm Adreno 702, which Mojo does not target. The program is the same one: a threshold and a ReLU, two activation functions from machine learning. By the end of one day, both X_eTaL and Mojo had run it on that GPU, and every answer was checked against a reference.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The code** | [modular-fork: adreno-poc](https://github.com/softwarewrighter/modular-fork/tree/research-qualcomm-adreno-702-gpu/adreno-poc) (branch research-qualcomm-adreno-702-gpu) |
| **The deep dive** | [adreno-deep-dive.md](https://github.com/softwarewrighter/modular-fork/blob/research-qualcomm-adreno-702-gpu/adreno-poc/docs/adreno-deep-dive.md) |
| **Three GPUs** | [mojo-on-3-gpus.md](https://github.com/softwarewrighter/modular-fork/blob/research-qualcomm-adreno-702-gpu/adreno-poc/docs/mojo-on-3-gpus.md) |
| **The talk** | [slides, PDF](https://github.com/softwarewrighter/modular-fork/blob/research-qualcomm-adreno-702-gpu/adreno-poc/docs/slides-2026-10-23/xetal-and-mojo-on-the-adreno-702.pdf) |
| **X_eTaL on GPUs** | [X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu), its [Mojo backend](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/components/mojo/README.md) |
| **The series** | [Array Languages: every post](/series/#array-languages) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The board

<figure class="zoomable" style="float: right; clear: right; width: 45%; margin: 0.2em 0 0.6em 1.5em;">
<img src="{{ '/assets/images/posts/adreno-702-board.webp' | relative_url }}" class="no-invert" alt="A slide, The board: a 2 GB Arduino with a GPU nobody targets. The Arduino UNO Q has a Qualcomm Dragonwing QRB2210, four Cortex-A53 cores, a Qualcomm Adreno 702 GPU, 1.7 GiB of usable RAM and Debian 13.1 with Mesa 25.2.6. Why it is interesting: Mojo's GPU support lists NVIDIA, AMD and Apple; Mesa exposes the GPU twice, Turnip for Vulkan 1.0 and rusticl for OpenCL 3.0; CPU and GPU share one small memory; Mojo's own requirements ask for 8 GB of RAM">
<figcaption style="font-size: 0.85em;">The board, from the talk's slides. Click to enlarge.</figcaption>
</figure>

The UNO Q pairs a Qualcomm QRB2210 application processor (four Cortex-A53 cores, the Adreno 702) with an STM32 microcontroller, and runs Debian. About 1.7 GiB of its memory is usable, shared by the CPU and the GPU. Mojo's GPU support lists NVIDIA, AMD and Apple; Mesa, the open-source driver stack on the board, exposes the Adreno twice, as Turnip for Vulkan 1.0 and as rusticl for OpenCL 3.0. OpenCL came first, because X_eTaL already had an OpenCL backend.

The work was a plan of steps under agentrail: one coding agent on a Mac wrote the plan, and one on an Arch Linux machine, with the board on ssh, did the work, from the first commit at 08:58 to the last at 16:49. Every step left an evidence directory of captured text and a handoff document that ends by saying what it does not establish. Nothing was installed on the board.

## Path one: X_eTaL, source to silicon

<figure class="zoomable" style="float: right; clear: right; width: 45%; margin: 0.2em 0 0.6em 1.5em;">
<img src="{{ '/assets/images/posts/adreno-702-threshold-rendered.webp' | relative_url }}" class="no-invert" alt="The threshold program as the X_eTaL editor draws it: the Accel library imported as ac, x gets range 8 divided by 4 minus 1.0, then x, 0.5 threshold x, relu x, n gets range 8 minus 4, relu n, and n mod 2 keep n; the library alias raised, function names with one underlined letter">
<figcaption style="font-size: 0.85em;">threshold.xtl as the editor draws it. Click to enlarge.</figcaption>
</figure>

The X_eTaL program imports the Accel library and prints five results. As typed:

```text
"ac:" u_se< "Accel"
x := ((r_ange 8) / 4) - 1.0
x
0.5 ac:t_hreshold x
ac:r_elu x
n := (r_ange 8) - 4
ac:r_elu n
(n m_od 2) ac:k_eep n
```

The first three lines it prints are the input, the threshold at 0.5, and the ReLU:

```text
-0.75 -0.5 -0.25 0.0 0.25 0.5 0.75 1.0
-0.0 -0.0 -0.0 0.0 0.0 0.0 0.75 1.0
0.0 0.0 0.0 0.0 0.25 0.5 0.75 1.0
```

The reference is not something the GPU code invented: it is the output of X_eTaL's own evaluator, saved as a regression baseline. Five programs went to the board (threshold, vector add, SAXPY, reductions and a pipeline), and all 71 of their outputs matched.

## Typed XIR, then one fused kernel
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/adreno-702-path-xetal.webp' | relative_url }}" class="no-invert" alt="A slide, Path one: X_eTaL, source to silicon, nothing by hand. A top row of the X_eTaL ecosystem: X_eTaL source (threshold.xtl), Core (xetal_program::load), typed XIR (xetal-gpu lower), OpenCL C 1.2 (xetal-gpu kernel); a bottom row on the board's Mesa: SPIR-V (rusticl, clang), Mesa NIR (lowering passes), Freedreno IR3 (the driver's compiler), the Adreno shader (dispatch, readback, check)">
<figcaption style="font-size: 0.85em;">Eight stages from source to shader; every box's output was captured as text. Click to enlarge.</figcaption>
</figure>

[X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu) lowers the program, through X_eTaL's Core, to XIR, a small typed accelerator IR: library calls inlined, the range folded to a constant, each array operation one typed node. The threshold becomes a comparison that yields a Bool, a cast that makes it a mask, and a multiply:

```text
%gt = map gt %sub %r_3
%f = cast f64 %gt
%mul = map mul %sub %f
%max = map max %sub %r_4
```

Consecutive maps of one shape fuse into a single OpenCL C kernel, so the temporaries become registers rather than arrays. The Adreno has no 64-bit Floats, so the schedule computes X_eTaL's Floats as 32-bit ones there, and keeps Ints at 64 bits.

One number had to change for this GPU. The default work-group of 256 passed every map but failed the reductions: the driver allows at most 192 work-items for the `reduce_max_long` kernel. The Adreno schedule uses 128. The driver's device-wide limit of 512 did not predict this; only running each kernel did.

## Read against the source, on the metal
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/adreno-702-metal.webp' | relative_url }}" class="no-invert" alt="A slide, To the metal: the Adreno instructions, read against the source. Freedreno IR3 instructions and their roles: mul.f by c16.y, multiply by 0.25 for the source's divide by four; add.f, add -1.0 to form x; cmps.f.lt, test 0.5 less than x; cov.u16f32, convert the comparison into a Float mask; mul.f, x times the mask, the threshold; max.f with 0.0, the ReLU; two stg.u32, store one threshold element and one ReLU element">
<figcaption style="font-size: 0.85em;">The Float path of the Adreno shader, instruction by instruction. Click to enlarge.</figcaption>
</figure>

On the board, rusticl compiles the OpenCL C to SPIR-V, Mesa lowers that through its NIR passes, and Freedreno's IR3 compiler makes the Adreno's own instructions. Asking the driver for "the program binary" does not give machine code: the bytes start with `rusticl\0` and hold a SPIR-V 1.4 module, an intermediate form the driver can reload. The machine code appears only in Mesa's diagnostic output, with `IR3_SHADER_DEBUG=disasm`.

There the source can be read back from the instructions. The divide by four became a multiply by 0.25; the comparison with 0.5, the conversion to a mask, the multiply and the `max.f` with zero are each one instruction; two stores write one threshold and one ReLU element. Around this short Float sequence sit a lot of address arithmetic and the 64-bit Int path, which on this GPU expands into many 32-bit instructions. The dump comes from a diagnostic compile, not a readback of GPU memory, so it shows what the compiler emitted rather than proving which variant each dispatch ran; both the normal and the diagnostic runs passed their checks.

## Path two: Mojo in the host's seat
{: .pos-center}

Mojo met three walls. Its compiler has no Qualcomm, OpenCL or Vulkan target, and its runtime looks for CUDA, HIP and Metal only. The board has no Mojo compiler, and could not easily hold one: Mojo's requirements ask for 8 GB of memory. And a normal Mojo program, cross-compiled on Arch for the board, exited with an illegal instruction. Its runtime library contains LSE atomic instructions, which the board's CPU feature list does not include; that is the likely explanation, though the exact faulting instruction was not identified.

The way around was to let Mojo be the host. Mojo cross-compiled one function to an ARM64 object for the Cortex-A53, exported with a plain C symbol; a C launcher of about 30 lines supplies `main` and the storage, so no Mojo runtime is linked. The function builds the same eight inputs, computes its own threshold and ReLU on the CPU, and calls a Rust bridge, which hands the work to the same XIR, OpenCL emitter and runtime that X_eTaL used. All 24 values came back matching both Mojo's reference and X_eTaL's saved output, and a deliberately corrupted last value was caught at element 23.

That is Mojo code on the board's CPU driving real GPU work. It is not a Mojo kernel: the code on the GPU was still X_eTaL's OpenCL C.

## Path three: an ordinary Mojo kernel, retargeted
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/adreno-702-steps-all.webp' | relative_url }}" class="no-invert" alt="A slide, Every step: two sources, four roads, three GPUs. X_eTaL: .xtl source, Core, typed XIR, OpenCL C 1.2, rusticl SPIR-V, NIR and IR3, to the Adreno 702. Mojo on Apple: .mojo kernel, LLVM IR, AIR for air64-apple-macosx, Metal, to the M1 Max. Mojo on NVIDIA: .mojo kernel, LLVM IR, PTX for sm_120a, the CUDA driver, to the RTX 5060 Ti. Mojo on Qualcomm: .mojo kernel, NVPTX LLVM IR, the retarget and llc to SPIR-V 1.0, rusticl NIR and IR3, to the Adreno 702. The amber retarget box is the one piece added">
<figcaption style="font-size: 0.85em;">Every road; the amber box, the retarget, is the one new piece. Click to enlarge.</figcaption>
</figure>

The next question was whether a kernel written the ordinary Mojo way could reach the Adreno. [activation_gpu.mojo](https://github.com/softwarewrighter/modular-fork/blob/research-qualcomm-adreno-702-gpu/adreno-poc/mojo/activation_gpu.mojo) is that program: a kernel that reads its block and thread indices, and a host `main` that opens a `DeviceContext`, copies, launches and checks. The kernel is fifteen lines:

```mojo
def activations(
    x: Pointer[Float32, ImmutAnyOrigin],
    threshold: Pointer[Float32, MutAnyOrigin],
    relu: Pointer[Float32, MutAnyOrigin],
    t: Float32,
    n: Int32,
):
    """One thread per element: threshold(x, t) = x * (x > t),
    relu(x) = max(x, 0)."""
    var i = Int(block_idx.x * block_dim.x + thread_idx.x)
    if i < Int(n):
        var v = x[unsafe_offset=i]
        var mask = Float32(1.0) if v > t else Float32(0.0)
        threshold[unsafe_offset=i] = v * mask
        relu[unsafe_offset=i] = max(v, Float32(0.0))
```

Asking this compiler build for a SPIR-V target fails with "target 'spirv64-unknown-unknown' is not supported by this build", and the gate is in the compiler binary, not in Mojo's open standard library. But the LLVM IR Mojo emits for NVIDIA is 25 ordinary lines, and only a few of them are NVIDIA's: the target triple, the kernel calling convention, the address space of the buffers, the three index registers and some attributes. A small script swaps those seven things for their OpenCL equivalents and leaves Mojo's arithmetic as it was. LLVM's SPIR-V back end then makes a module, which the bridge loads on the board with `clCreateProgramWithIL`.

One surprise: LLVM's generic SPIR-V target emitted version 1.4, which the OpenCL validator rejected; asking for SPIR-V 1.0 by name gave a module that validated and ran. The script handles only this small scalar subset and refuses anything else, barriers, shared memory, atomics and library calls among them, rather than guessing.

## One kernel, three GPUs
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/adreno-702-three-gpus.webp' | relative_url }}" class="no-invert" alt="A slide, Three GPUs: one Mojo kernel, three vendors, 24 of 24 each. Apple M1 Max: Metal, through DeviceContext, as Modular ships it, 24 of 24 agree. NVIDIA RTX 5060 Ti: CUDA, through DeviceContext, the same file unchanged, 24 of 24 agree. Qualcomm Adreno 702: the same kernel as SPIR-V through rusticl, from a Mojo host on the A53, 24 of 24 agree with both oracles. The three result rows are shown, identical on all three, signed zeros included">
<figcaption style="font-size: 0.85em;">The same kernel, the same 24 values, on three vendors' GPUs. Click to enlarge.</figcaption>
</figure>

The one file ran unchanged on an Apple M1 Max, where `DeviceContext()` picks Metal and the compiler emits AIR, and on an NVIDIA RTX 5060 Ti, where it picks CUDA and the compiler emits PTX. Its kernel, retargeted, ran on the Adreno. All three gave the same 24 values, the signed zeros included, matching the CPU reference and the first three lines X_eTaL prints.

The Adreno run was pushed harder than eight elements. Lengths of 1, 65 and 129, the last two spilling into a second and a third group of 64 threads, all checked; a corrupted output was rejected, and so was a SPIR-V module with a broken header. On the Adreno, the host is still the exported Mojo function and the C bridge, not `DeviceContext`: Mojo's runtime cannot see this GPU.

## The same metal from both languages
{: .pos-left}

<figure class="zoomable outdent-right">
<img src="{{ '/assets/images/posts/adreno-702-adreno-both.webp' | relative_url }}" class="no-invert" alt="A slide, Both languages, same metal: the Adreno instructions from X_eTaL and from Mojo. Compare, mask, threshold, ReLU and two stores, from X_eTaL through OpenCL C and from Mojo through SPIR-V: the same operations, cmps.f.lt, cov.u16f32, mul.f, max.f and stg.u32, with different registers. X_eTaL folds the threshold 0.5 into the compare as an immediate; Mojo passes t as a kernel argument, read from the constant register c9.z">
<figcaption style="font-size: 0.85em;">The Adreno instructions from X_eTaL's kernel and from Mojo's, side by side. Click to enlarge.</figcaption>
</figure>

Put the two shaders side by side and the activation is the same five operations: compare, convert to a mask, multiply, maximum, store. The registers differ, and one difference is visible in the source: X_eTaL's program has the threshold 0.5 as a constant, so it is folded into the compare instruction, while Mojo's kernel takes `t` as an argument, so the Adreno reads it from a constant register.

The Mojo variant is also smaller, 224 dwords in this capture, because the X_eTaL program also computes its input from a range and carries a 64-bit Int path. That is an observation about code size in two different programs, not a measured difference in speed.

## X_eTaL through Mojo, elsewhere
{: .pos-center}

On the Adreno, X_eTaL went through its OpenCL backend, not through Mojo. Elsewhere, Mojo is X_eTaL's second backend of the same IR, as [Array Languages #10](/2026/10/16/array-languages-xetal-mojo-metal/) described: `xetal-gpu run FILE.xtl --device mojo` writes Mojo from the XIR, builds it, and runs it on Apple silicon through Metal or on NVIDIA through the CUDA driver. (The same Mojo also compiles for AMD's GPUs, as [Rabbit-hole #8](/2026/10/21/rabbit-hole-xetal-to-the-metal/) showed.)

That backend grew the same day. On 2026-10-23 ([53633e4](https://github.com/softwarewrighter/X_eTaL-gpu/commit/53633e4)) it gained folds along an axis, tables, slices, ravel, inner products and transposes, and eleven of the thirteen Accel demos now match their evaluator baselines through Mojo on the RTX 5060 Ti, among them matrix multiplication, a tiny network and top-k. Ints now cross the host interface as 64-bit Ints, so none passes through a Float on the way. Lookup and windows are still refused; the first five demos run on the M1 Max through Metal, and checking the six new ones there is still to do ([results](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/rtx5060-mojo-results.md)).

## What the day established, and what it did not
{: .pos-right}

<figure class="zoomable outdent-left">
<img src="{{ '/assets/images/posts/adreno-702-boundary.webp' | relative_url }}" class="no-invert" alt="A slide, The boundary: what the day established, and what it did not. Established: X_eTaL source, lowered by its own tool, runs on the physical Adreno 702, 71 of 71 outputs matching the evaluator; a kernel written in ordinary Mojo runs on Apple, NVIDIA and the Adreno, 24 of 24 on each, from one source; on the Adreno both languages reach the same Freedreno instructions; every form is captured as text and nothing was installed on the board. Not established: native Adreno support in Mojo; kernels beyond this scalar subset; any speedup; a Vulkan dispatch on the Adreno, or Mojo's own runtime on the A53">
<figcaption style="font-size: 0.85em;">Every handoff document ends by saying what it does not establish. Click to enlarge.</figcaption>
</figure>

Established: X_eTaL source, lowered by its own tool, runs on the physical Adreno 702 and matches its evaluator, 71 outputs of 71. A kernel written in ordinary Mojo runs on Apple, NVIDIA and Qualcomm GPUs from one source, 24 of 24 on each. On the Adreno, both languages reach the same Freedreno instructions.

Not established: native Adreno support in Mojo, since `DeviceContext` cannot see the GPU and a C bridge launches the SPIR-V. Kernels beyond this scalar subset. A Vulkan dispatch on the Adreno, or Mojo's own runtime on the board's CPU. And any speedup: eight elements prove that the code runs and agrees, not that it is fast.

Native support would need a SPIR-V target in Mojo's compiler and a runtime behind `DeviceContext`, and both are in Modular's binaries, not in the open repository. The fork's documents scope what an upstream contribution might take, and say plainly that none has been proposed.

## What comes next
{: .pos-center}

The plan's next steps keep the order the day kept, correctness on every road first, then size, then speed. For Mojo, widen the retargeter one construct at a time (barriers, shared memory, math functions), each checked against the evaluator, with reductions and softmax as the test set. For Vulkan, a host for Turnip and X_eTaL's programs as Vulkan compute. For measurement, the same activations from a thousand elements to a million, on the Cortex-A53 and on the Adreno, to find where, if anywhere, the GPU starts to pay on a board this small.
