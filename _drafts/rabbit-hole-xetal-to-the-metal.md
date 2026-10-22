---
layout: post
title: "Rabbit-hole #8: From X_eTaL to the Metal, One Kernel Down Every GPU Toolchain"
categories: [rabbit-hole, programming-languages, deep-dive]
tags: [rabbit-hole, xetal, x-etal, mojo, gpu, cuda, ptx, sass, nvcc, rocm, hip, amdgcn, metal, air, opencl, llvm, compilers, array-languages]
keywords: "X_eTaL to PTX, Mojo GPU compilation, kgen.compile_offload, LLVM NVPTX, CUDA without nvcc, PTX walkthrough, ROCm HIP AMDGCN, Metal AIR, OpenCL C driver compile, CUDA vs ROCm vs Metal vs OpenCL, GPU toolchain comparison, array language GPU"
abstract: "One small ML array program, a threshold and two ReLUs written in X_eTaL, followed all the way down: X_eTaL source to its Core, to an accelerator IR, to Mojo, to the PTX NVIDIA's driver finishes into machine code, to Apple's AIR and AMD's GPU code from the same Mojo file, and on to the other roads, CUDA C++ through nvcc and OpenCL C compiled by the driver at run time. What each toolchain needs installed, what it hands to the next, and where Mojo uses CUDA and where it goes around it."
series: "Down the Rabbit-Hole"
series_part: 8
date: 2026-10-22 00:15:00 -0700
repo_urls:
  - url: "https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo"
    title: "modular-fork: rust-demo"
  - url: "https://github.com/softwarewrighter/X_eTaL-gpu"
    title: "X_eTaL-gpu"
---

<!-- DRAFT (2026-10-20), Mike: a deep dive on X_eTaL and Mojo, comparing CUDA, ROCm, Metal and OpenCL, ML array code on CPU, NVIDIA
     and Apple GPUs, listings for ROCm (no AMD card installed), from the top level down through XIR and Mojo to each platform's
     PTX or equivalent, with nvcc/hipcc C++ equivalents. "Work will have to be done in the forked repo rust demo."
     FILLED from committed files: threshold.xtl and its .out (X_eTaL-gpu main 8d5b943), accel-threshold.xir (modular-fork
     rust-demo, lowered by xetal-gpu 38bae5c), the RTX 5060 Ti PTX (rust-demo doc/evidence/rtx5060-20261016-ten-programs/
     int-assembly.log; mangled kernel name shortened to stage0 for width), X_eTaL-gpu's threshold.cl. Mojo's driver 580 and
     MODULAR_NVPTX_COMPILER_PATH: Mojo/docs/site/requirements.mdx in the fork; kgen.compile_offload, AsyncRT_DeviceContext_*
     calls: in the fork's Mojo sources.
     2026-10-21: rust-demo 4d6801bc (CUDA evidence, doc/cuda-blog-handoff.md): generated .mojo and .cu, nvcc PTX (default and
     --fmad=false), SASS, RTX 5060 Ti run (0 mismatches); environment nvcc 13.4.92, driver 615.78.08. Links checked (200).
     2026-10-21: Mike: note a follow-on post on the Arduino UNO Q (QRB2210 MPU + STM32U585 MCU); added as "Next: Qualcomm" (a
     planned post, no link). Specs from Arduino's docs and Qualcomm's product brief; no OpenCL-on-Adreno claim (to be checked on
     the board).
     2026-10-21 later: X_eTaL-gpu main unchanged (8d5b943); step 024-opencl-binary IN PROGRESS, uncommitted (xetal-gpu binary
     FILE: CL_PROGRAM_BINARIES on the M1 Max (X1) and NVIDIA (A7); evidence docs/evidence/m1max-opencl-20261021/, handoff
     docs/m1max-opencl-handoff.md). Fill the OpenCL TODOs when pushed.
     2026-10-21 evening: modular-fork d8aff0f1 (Metal AIR + M1 Max run), ae9d69f6 (gfx1100 AMDGCN, no AMD GPU), 8e40a980 (CPU,
     -D XIR_CPU=true, arm64), da278226 (doc/top-down.md): Apple, AMD (Mojo half) and CPU (arm64) sections filled; walkthrough linked;
     all links 200. AIR triple: side file says macosx15.0.0, the run's dump macosx26.0.0 (not quoted).
     X1 DONE: X_eTaL-gpu bb5ebe3 (docs/m1max-opencl-handoff.md); verified here: run.out == libs/Accel/tests/demo-threshold.out;
     threshold.bin decoded with plutil and plistlib: outer keys as stated, inner OPTIONS/FLAGS 0/SOURCE, SOURCE == threshold.cl.
     Setup ~60 ms per run.log (handoff says ~56 ms; runs vary). A7 (NVIDIA PTX) routed to the Arch agent (docs/arch-rerun.md item 6).
     A7 DONE: X_eTaL-gpu c4fa27b (docs/rtx5060-opencl-handoff.md, evidence rtx5060-opencl-20261021-device/): run.out == baseline
     (checked here); binary = PTX text, 2,252 bytes, NVVM 7.0.1, sm_120; the CLI's classifier says 'unrecognized', the script saves
     threshold.ptx. Arch tree had 37 uncommitted paths at capture (environment.log). No SASS in this capture.
     TODO sections wait on: tmp/asks-2026-10-21-gpu-deep-dive-remaining.md (A1-A8 Arch, M1-M4 Mac, X1, B1); earlier list: tmp/asks-2026-10-20-rust-demo-top-down.md (items 1-10; 6 and 10 may belong in X_eTaL-gpu).
     OpenCL section: runtime calls verified in X_eTaL-gpu components/runtime/src/lib.rs; schedules/ listing; RTX 5060 Ti OpenCL results
     from docs/linux-nvidia-results.md (2026-10-14, rev 6ccdbc1, driver 615.78.08, OpenCL 3.0 CUDA, 13/13 Accel demos). Do not describe any of it as
     built until its commit exists. Listings may be long: summarize here, link the full listings and doc/top-down.md.
     Same date as AL #16 (different series); date tentative. Lead image: Mike's block-down-gpu-hole.jpg (2026-10-21), dark, not inverted.      2026-10-21: SHORTENED for a ~10-minute read (Mike): every listing now lives in modular-fork rust-demo/doc (top-down.md, the
     handoffs, evidence/) and X_eTaL-gpu docs/ (OpenCL captures); the post summarizes and links. The long version is in this
     file's history (commit ad7a58a). x86-64 CPU (A6) dropped like HIP: one CPU example (arm64). TODO: confirm the toolchain
     table's "needed to run" row.
-->

<img src="{{ '/assets/images/posts/block-down-gpu-hole.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

Between a line of array code and a GPU doing it there are five or six programs, each turning one language into a lower one, and most of them are invisible. This post makes them visible for one small program. It follows a threshold and two ReLUs, written in X_eTaL, down to the instructions a GPU runs, by Mojo onto NVIDIA, Apple and AMD and onto the CPU, and down two other roads, CUDA C++ and OpenCL. The listings themselves are long, so they live in the repositories; this post is the guided tour, with a link at every stop.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The whole walk** | [Top down: one X_eTaL program to five instruction sets](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/top-down.md), every level and listing |
| **The Mojo road** | [modular-fork: rust-demo](https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo) |
| **The OpenCL road** | [X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu) |
| **Earlier** | [AL #7: X_eTaL on GPUs](/2026/10/13/array-languages-xetal-gpu/) · [AL #10: through Mojo](/2026/10/16/array-languages-xetal-mojo-metal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The program

The Accel library's threshold demo: an array, the array where it is above 0.5 and zero elsewhere, two ReLUs, and a select by an integer mask.

```text
"ac:" u̲se< "Accel"
x ← ((r̲ange 8) ÷ 4) − 1.0
x
0.5 ᵃᶜt̲hreshold x
ᵃᶜr̲elu x
n ← (r̲ange 8) − 4
ᵃᶜr̲elu n
(n m̲od 2) ᵃᶜk̲eep n
```

X_eTaL's own evaluator prints this, and every road below that runs has to print the same:

```text
-0.75 -0.5 -0.25 0.0 0.25 0.5 0.75 1.0
-0.0 -0.0 -0.0 0.0 0.0 0.0 0.75 1.0
0.0 0.0 0.0 0.0 0.25 0.5 0.75 1.0
0 0 0 0 1 2 3 4
-3 0 -1 0 1 0 3 0
```

## The levels

| Level | What it is | Made by | Listing |
|---|---|---|---|
| X_eTaL | the program above | a person | [threshold.xtl](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/libs/Accel/demos/threshold.xtl) |
| Core | the form X_eTaL's evaluator runs | X_eTaL's loader | [walkthrough, level 1](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/top-down.md) |
| XIR | 19 lines of `const`, `map` and `cast` | X_eTaL-gpu's translator | [accel-threshold.xir](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/programs/accel-threshold.xir) |
| Mojo | one fused kernel and a host function | rust-demo's emitter | [accel-threshold.mojo](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold.mojo) |
| PTX, NVIDIA | NVIDIA's portable assembly | Mojo, through LLVM | [the build log's PTX](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-20261016-ten-programs/int-assembly.log) |
| AIR, Apple | Apple's IR for Metal | Mojo | [stage0.air.ll](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/m1max-metal-20261021/accel-threshold-stage0.air.ll) |
| AMDGCN, AMD | RDNA3 assembly, listing only | Mojo | [stage0.gfx1100.amdgcn](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/amd-gfx1100-listings-20261021/accel-threshold-stage0.gfx1100.amdgcn) |
| arm64, CPU | the M1 Max's CPU | Mojo | [closures.s](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/m1max-cpu-20261021/accel-threshold-xir_run-closures.s) |
| CUDA C++ → PTX → SASS | the C++ road | rust-demo's second emitter, then `nvcc` | [.cu](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold.cu) · [.ptx](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold.ptx) · [.sass](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold.sass) |
| OpenCL C | the run-time road | X_eTaL-gpu's emitter, then the driver | [threshold.cl](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/evidence/m1max-opencl-20261021/threshold.cl) |

The top two levels are X_eTaL's own. X_eTaL-gpu's translator walks the Core form like a small evaluator: whatever it can compute now, such as `r̲ange 8`, becomes a constant, the library calls are inlined, and what has to run on the device becomes XIR, one operation per line:

```text
%div = map div %l %r
%sub = map sub %div %r_2
%gt = map gt %sub %r_3
%f = cast f64 %gt
%mul = map mul %sub %f
```

Every operation is element by element, so the whole program is one pass. rust-demo's emitter is a table from each XIR operation to one line of Mojo, `%div` becoming `var v_div = v_l / Float32(4.0)`, fused into one GPU function with one thread per element, plus a host function that makes the buffers, copies, launches and copies back. Nothing in the Mojo file says which GPU it is for.

## How Mojo uses CUDA, and goes around it

"CUDA" is three things usually sold together: a compiler, `nvcc`, from C++ to PTX; an assembler, `ptxas`, from PTX to the card's machine code; and the driver, which allocates memory, copies and launches. Mojo replaces the first: `mojo build` compiles each kernel a second time, for the GPU, through an intrinsic in its standard library, `kgen.compile_offload`, and LLVM's NVPTX back end, and stores the PTX in the library it builds. It brings its own copy of the second, a bundled PTX compiler that needs NVIDIA driver 580 or later (for older drivers, `MODULAR_NVPTX_COMPILER_PATH` points it at a system `ptxas`). The third it uses as it is: at run time the library loads the installed driver and hands it the kernel through Modular's runtime library. No CUDA Toolkit was installed on the machine that built it. On a Mac the same file goes to Metal, and for AMD to AMD's code, from the same compiler.

## One line, six spellings

The first line of the program, `x ← ((r̲ange 8) ÷ 4) − 1.0`, as each road wrote it. Every one turned the divide into a multiply by 0.25; they differ in whether the multiply and the subtract become one instruction:

| Road | The instructions | |
|---|---|---|
| Mojo → PTX (NVIDIA) | `mul.rn.f32` by 0.25, `add.f32` of -1.0 | two |
| nvcc → PTX (NVIDIA) | `fma.rn.f32 … 0.25, -1.0` | fused |
| OpenCL driver → PTX (NVIDIA) | `fma.rn.f32 … 0.25, -1.0` | fused |
| Mojo → AIR (Apple) | `fdiv` by 4.0, `fsub contract` 1.0 | two, fusing left to Apple's driver |
| Mojo → AMDGCN (AMD) | `v_mul_f32` by 0.25, `v_add_f32` of -1.0 | two |
| Mojo → arm64 (CPU) | `fmadd` with 0.25 and -1.0 | fused |

A fused multiply-add rounds once instead of twice. Here it cannot matter, since 0.25 is exact, and every road that ran gave the same eight numbers; on other numbers it is a choice each compiler makes for you. (`nvcc --fmad=false` writes the two instructions separately; [both PTX files](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/cuda-blog-handoff.md) are kept.)

## The line where they differ most

The last line, `(n m̲od 2) ᵃᶜk̲eep n`, is where the targets part ways. `m̲od` is floored, so `-3 mod 2` is 1, and Mojo's road carries X_eTaL's integers in 32-bit floats, so each target converts to a 64-bit integer, takes the remainder, fixes the sign, and converts back:

| Target | Instructions for the remainder | Why |
|---|---|---|
| PTX (Mojo and nvcc) | about 10 | conversions, shifts and masks, a select for the sign |
| AIR (Apple) | about 10 | the same in LLVM IR, with `@air.convert` calls |
| AMDGCN (RDNA3) | about 30 | no instruction converts a float to a 64-bit integer or back, so each conversion is spelled out |
| arm64 | 9 | 64-bit conversions and conditional instructions in hardware |

The OpenCL road, which keeps X_eTaL's integers as 64-bit integers from end to end, needs no conversions at all: its PTX does `n − 4`, the ReLU and the remainder with integer instructions (`add.s64`, `max.s64`, shifts and masks). The same line of X_eTaL, from a few instructions to thirty, depending on the road and the chip. The counts come from the [walkthrough](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/top-down.md), which reads each listing line by line.

## Each road in brief

**NVIDIA, through Mojo.** The PTX for `sm_120a`, written by LLVM's NVPTX back end, finished into machine code by the bundled compiler, and run on the RTX 5060 Ti: X_eTaL's five lines exactly ([the PTX](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-20261016-ten-programs/int-assembly.log)).

**NVIDIA, through CUDA C++ and nvcc.** A second emitter in rust-demo writes the same XIR as CUDA C++, with the same one-line-per-operation table and a fix for C++'s `%`, which truncates where X_eTaL floors. `nvcc` 13.4 compiles it to PTX and, with `ptxas`, to the card's machine code (SASS); built as a native program it gives X_eTaL's five lines with zero mismatches. Building it needs the CUDA Toolkit; running it needs only the card and its driver ([handoff](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/cuda-blog-handoff.md)).

**Apple, through Mojo.** The same `.mojo` file, built on the M1 Max, becomes AIR, Apple's intermediate representation for Metal, which is LLVM's own IR with Apple's intrinsics. It runs on the M1 Max and matches exactly. The last step, from AIR to the GPU's own instructions, happens inside Apple's driver when the function is first loaded, and has no public listing ([handoff](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/metal-blog-handoff.md)).

**AMD, through Mojo.** No AMD card is installed, so this is a listing only: nothing ran. Mojo compiled the same file for `gfx1100` (RDNA3) on the Mac, with no AMD device, and wrote its AMDGCN assembly: the same short float arithmetic, 32-wide waves like NVIDIA's warps, and the expensive remainder above ([handoff](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/amd-blog-handoff.md)). The C++ road onto AMD, HIP with `hipcc`, would be the counterpart of the CUDA C++ road; it is not shown.

**The CPU, through Mojo.** The same file built with `-D XIR_CPU=true` hands each stage to the CPU as a parallel range over the elements instead of a grid of GPU threads. It ran on the M1 Max's CPU and matched exactly; its arm64 body fuses the first line into one `fmadd` ([handoff](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/cpu-blog-handoff.md)).

**OpenCL, compiled at run time.** X_eTaL-gpu's first backend skips Mojo and writes OpenCL C, a dialect of C99, from the same XIR, and ships the text: the driver compiles it when the program runs (`clBuildProgram`), with no toolkit involved. Asked afterward for what it compiled (`CL_PROGRAM_BINARIES`), the two drivers answer differently. NVIDIA's returns 2,252 bytes of PTX, written by the compiler inside the driver, with the fused `fma` and the integer remainder above ([handoff](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/rtx5060-opencl-handoff.md)). Apple's returns 2,108 bytes that hold no compiled code at all: a property list, the format of macOS settings files, holding the compiler options and the source, the same 27 lines of OpenCL C it was given. Its compiled kernel never leaves the driver, and the one public trace of how the driver works is its error log, which names a translator from OpenCL C to Metal, `cl2Metal` ([handoff](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/m1max-opencl-handoff.md)). Both runs gave X_eTaL's five lines exactly.

<hr>

<div class="clearfix" markdown="1">

## The toolchains side by side

| | CUDA | ROCm (HIP) | Metal | OpenCL | Mojo |
|---|---|---|---|---|---|
| kernel language | CUDA C++ | HIP C++ | Metal Shading Language | OpenCL C | Mojo |
| compiled by | `nvcc`, ahead of time | `hipcc` or `amdclang++`, ahead of time, for a named target | `xcrun metal`, ahead of time | the driver, at run time | `mojo build`, ahead of time (LLVM) |
| what it produces | PTX and/or machine code, in a fat binary | an AMD GPU code object | AIR, packed into a `.metallib` | nothing shipped but the source | PTX, AMD GPU code or AIR, in the library |
| last step to machine code | `ptxas` at build time, or the driver at load | done ahead of time | Apple's driver, at first load (no public listing) | inside the driver | NVIDIA: a bundled PTX compiler, or the driver |
| needed to build | CUDA Toolkit | ROCm | Xcode's Metal toolchain | nothing | Mojo |
| needed to run | NVIDIA driver (the CUDA runtime is linked statically by default) | ROCm runtime | macOS | a driver with OpenCL | the GPU's driver (NVIDIA: 580 or later) |

Sources: NVIDIA's [nvcc documentation](https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/index.html), AMD's [HIP compilers page](https://rocm.docs.amd.com/projects/HIP/en/latest/understand/compilers.html), Apple's [Metal tools](https://developer.apple.com/library/ios/documentation/Miscellaneous/Conceptual/MetalProgrammingGuide/Dev-Technique/Dev-Technique.html), and Mojo's requirements in the fork.

</div>

## Next: Qualcomm

A planned post adds a third family of hardware, Qualcomm, on the Arduino UNO Q (2 GB, ABX00162). It is a hybrid of two chips: a Qualcomm Dragonwing QRB2210, with four Arm Cortex-A53 cores running Debian Linux, an Adreno 702 GPU and a Hexagon DSP; and an ST STM32U585 microcontroller, an Arm Cortex-M33, for the board's real-time pins. The plan is the same program on the Cortex-A53 through X_eTaL and Mojo, then a road onto the Adreno GPU, which Mojo does not target, through OpenCL if the board's Linux has a driver for it ([Arduino's documentation](https://docs.arduino.cc/hardware/uno-q), [Qualcomm's product brief](https://docs.qualcomm.com/doc/87-61720-1/87-61720-1_REV_D_Qualcomm_Dragonwing_QRB2210_Processor_Product_Brief.pdf)).
