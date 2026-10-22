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
     TODO sections wait on: tmp/asks-2026-10-21-gpu-deep-dive-remaining.md (A1-A8 Arch, M1-M4 Mac, X1, B1); earlier list: tmp/asks-2026-10-20-rust-demo-top-down.md (items 1-10; 6 and 10 may belong in X_eTaL-gpu).
     OpenCL section: runtime calls verified in X_eTaL-gpu components/runtime/src/lib.rs; schedules/ listing; RTX 5060 Ti OpenCL results
     from docs/linux-nvidia-results.md (2026-10-14, rev 6ccdbc1, driver 615.78.08, OpenCL 3.0 CUDA, 13/13 Accel demos). Do not describe any of it as
     built until its commit exists. Listings may be long: summarize here, link the full listings and doc/top-down.md.
     Same date as AL #16 (different series); date tentative. Lead image: Mike's block-down-gpu-hole.jpg (2026-10-21), dark, not inverted. -->

<img src="{{ '/assets/images/posts/block-down-gpu-hole.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

Between a line of array code and a GPU doing it there are five or six programs, each turning one language into a lower one, and most of them are invisible. This post makes them visible for one small program. It follows a threshold and two ReLUs, written in X_eTaL, down through every level to the instructions a GPU runs, by Mojo, onto NVIDIA, Apple and AMD, and then down the other roads: CUDA C++ and OpenCL.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The Mojo road** | [modular-fork: rust-demo](https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo) |
| **The whole walk** | [Top down: one X_eTaL program to five instruction sets](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/top-down.md), with every listing |
| **The OpenCL road** | [X_eTaL-gpu](https://github.com/softwarewrighter/X_eTaL-gpu) |
| **Earlier** | [AL #7: X_eTaL on GPUs](/2026/10/13/array-languages-xetal-gpu/) · [AL #10: through Mojo](/2026/10/16/array-languages-xetal-mojo-metal/) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## The program

The Accel library's threshold demo: an array, the array where it is above a threshold and zero elsewhere, two ReLUs, and a select by an integer mask.

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

X_eTaL's own evaluator prints this, and every road below has to print the same:

```text
-0.75 -0.5 -0.25 0.0 0.25 0.5 0.75 1.0
-0.0 -0.0 -0.0 0.0 0.0 0.0 0.75 1.0
0.0 0.0 0.0 0.0 0.25 0.5 0.75 1.0
0 0 0 0 1 2 3 4
-3 0 -1 0 1 0 3 0
```

## Down one level: Core and XIR

X_eTaL's loader parses the file, resolves the library, and lowers it to Core, the form its evaluator runs. X_eTaL-gpu's translator then walks Core as a small evaluator of its own: what it can compute now, such as `r̲ange 8`, it folds to a constant; what has to run on the device it emits as an operation in XIR, its accelerator IR. Library functions are inlined at their calls, so `ᵃᶜt̲hreshold` becomes a comparison, a cast and a multiply:

```text
%l = const f64 [8] 1.0 2.0 3.0 4.0 5.0 6.0 7.0 8.0
%r = const f64 [] 4.0
%div = map div %l %r
%r_2 = const f64 [] 1.0
%sub = map sub %div %r_2
%r_3 = const f64 [] 0.5
%gt = map gt %sub %r_3
%f = cast f64 %gt
%mul = map mul %sub %f
%r_4 = const f64 [] 0.0
%max = map max %sub %r_4
%l_2 = const i64 [8] 1 2 3 4 5 6 7 8
%r_5 = const i64 [] 4
%sub_2 = map sub %l_2 %r_5
%r_6 = const i64 [] 0
%max_2 = map max %sub_2 %r_6
%r_7 = const i64 [] 2
%mod = map mod %sub_2 %r_7
%mul_2 = map mul %sub_2 %mod
output %sub
output %mul
output %max
output %max_2
output %mul_2
```

Five outputs for the five lines the program prints, and no loops: every `map` is element by element, so the whole program is one pass over eight elements.

## XIR to Mojo

rust-demo's emitter turns each XIR operation into one line of Mojo, and fuses the element-by-element operations into one GPU function, `stage0`, one thread per element. The names carry over from the XIR, `%div` becoming `v_div` ([the whole file](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold.mojo)):

```mojo
def stage0(
    b_l: Pointer[Float32, ImmutAnyOrigin],
    b_l_2: Pointer[Float32, ImmutAnyOrigin],
    b_sub: Pointer[Float32, MutAnyOrigin],
    b_mul: Pointer[Float32, MutAnyOrigin],
    b_max: Pointer[Float32, MutAnyOrigin],
    b_max_2: Pointer[Float32, MutAnyOrigin],
    b_mul_2: Pointer[Float32, MutAnyOrigin],
    n: Int32,
):
    var i = Int(block_idx.x * block_dim.x + thread_idx.x)
    if i < Int(n):
        var v_l = b_l[unsafe_offset=i]
        var v_l_2 = b_l_2[unsafe_offset=i]
        var v_div = v_l / Float32(4.0)
        var v_sub = v_div - Float32(1.0)
        var v_gt = Bool(v_sub > Float32(0.5))
        var v_f = Float32(1.0) if v_gt else Float32(0.0)
        var v_mul = v_sub * v_f
        var v_max = max(v_sub, Float32(0.0))
        var v_sub_2 = v_l_2 - Float32(4.0)
        var v_max_2 = max(v_sub_2, Float32(0.0))
        var v_mod = Float32(Int(v_sub_2) % Int(Float32(2.0)))
        var v_mul_2 = v_sub_2 * v_mod
        b_sub[unsafe_offset=i] = v_sub
        b_mul[unsafe_offset=i] = v_mul
        b_max[unsafe_offset=i] = v_max
        b_max_2[unsafe_offset=i] = v_max_2
        b_mul_2[unsafe_offset=i] = v_mul_2
```

Beside it the emitter writes a host function, `xir_run`, exported with a C interface so that Rust can call it from the built library. It opens the device, creates a buffer for each array, copies the inputs up, launches `stage0`, and copies the five results down. Its central calls, from the same file:

```mojo
var ctx = DeviceContext()
var b_l = ctx.enqueue_create_buffer[DType.float32](8)
ctx.enqueue_copy(dst_buf=b_l, src_buf=h_l)
ctx.enqueue_function[stage0](b_l, b_l_2, b_sub, b_mul, b_max, b_max_2, b_mul_2, Int32(N), grid_dim=BLOCKS, block_dim=TPB)
```

Nothing in the file says which GPU it is for. The same text built on the Mac goes to Metal, and on the Arch machine to CUDA.

## Mojo to PTX

`mojo build --emit shared-lib` compiles the file twice: once for the host, and once, for each kernel the host launches, for the GPU. The second compile is an intrinsic in Mojo's standard library, `kgen.compile_offload`, run through LLVM's NVPTX back end, and the PTX it produces is stored in the library. This is that PTX for the RTX 5060 Ti, as the build printed it (the kernel's mangled name shortened to `stage0`):

```text
//
// Generated by LLVM NVPTX Back-End
//
.version 8.7
.target sm_120a
.address_size 64
	// .globl	stage0
.visible .entry stage0(
	.param .u64 .ptr .align 1 stage0_param_0,
	.param .u64 .ptr .align 1 stage0_param_1,
	.param .u64 .ptr .align 1 stage0_param_2,
	.param .u64 .ptr .align 1 stage0_param_3,
	.param .u64 .ptr .align 1 stage0_param_4,
	.param .u64 .ptr .align 1 stage0_param_5,
	.param .u64 .ptr .align 1 stage0_param_6,
	.param .b32 stage0_param_7
)
{
	.reg .pred 	%p<4>;
	.reg .b32 	%r<15>;
	.reg .b64 	%rd<36>;
	ld.param::entry.s32 	%rd16, [stage0_param_7];
	mov.u32 	%r1, %ctaid.x;
	mov.u32 	%r2, %ntid.x;
	mul.wide.u32 	%rd17, %r1, %r2;
	mov.u32 	%r3, %tid.x;
	cvt.u64.u32 	%rd18, %r3;
	add.s64 	%rd8, %rd17, %rd18;
	setp.ge.s64 	%p1, %rd8, %rd16;
	@%p1 bra 	$L__BB0_2;
	ld.param::entry.b64 	%rd9, [stage0_param_0];
	cvta.to.global.u64 	%rd1, %rd9;
	ld.param::entry.b64 	%rd10, [stage0_param_1];
	cvta.to.global.u64 	%rd2, %rd10;
	ld.param::entry.b64 	%rd11, [stage0_param_2];
	cvta.to.global.u64 	%rd3, %rd11;
	ld.param::entry.b64 	%rd12, [stage0_param_3];
	cvta.to.global.u64 	%rd4, %rd12;
	ld.param::entry.b64 	%rd13, [stage0_param_4];
	cvta.to.global.u64 	%rd5, %rd13;
	ld.param::entry.b64 	%rd14, [stage0_param_5];
	cvta.to.global.u64 	%rd6, %rd14;
	ld.param::entry.b64 	%rd15, [stage0_param_6];
	cvta.to.global.u64 	%rd7, %rd15;
	shl.b64 	%rd19, %rd8, 2;
	add.s64 	%rd20, %rd1, %rd19;
	add.s64 	%rd21, %rd2, %rd19;
	add.s64 	%rd22, %rd3, %rd19;
	add.s64 	%rd23, %rd4, %rd19;
	add.s64 	%rd24, %rd5, %rd19;
	add.s64 	%rd25, %rd6, %rd19;
	add.s64 	%rd26, %rd7, %rd19;
	ld.global.b32 	%r4, [%rd20];
	ld.global.b32 	%r5, [%rd21];
	mul.rn.f32 	%r6, %r4, 0f3E800000;
	add.f32 	%r7, %r6, 0fBF800000;
	setp.gt.f32 	%p2, %r7, 0f3F000000;
	selp.f32 	%r8, 0f3F800000, 0f00000000, %p2;
	mul.f32 	%r9, %r7, %r8;
	max.f32 	%r10, %r7, 0f00000000;
	add.f32 	%r11, %r5, 0fC0800000;
	max.f32 	%r12, %r11, 0f00000000;
	cvt.rzi.s64.f32 	%rd27, %r11;
	shr.u64 	%rd28, %rd27, 63;
	add.s64 	%rd29, %rd27, %rd28;
	and.b64 	%rd30, %rd29, -2;
	sub.s64 	%rd31, %rd27, %rd30;
	setp.ne.b64 	%p3, %rd31, 0;
	selp.b64 	%rd32, 2, 0, %p3;
	shr.u64 	%rd33, %rd27, 62;
	and.b64 	%rd34, %rd33, %rd32;
	add.s64 	%rd35, %rd34, %rd31;
	cvt.rn.f32.s64 	%r13, %rd35;
	mul.f32 	%r14, %r11, %r13;
	st.global.b32 	[%rd22], %r7;
	st.global.b32 	[%rd23], %r9;
	st.global.b32 	[%rd24], %r10;
	st.global.b32 	[%rd25], %r12;
	st.global.b32 	[%rd26], %r14;
$L__BB0_2:
	ret;
}
```

Read against the XIR, the body is short. The hexadecimal constants are 32-bit floats:

| PTX | What it does | From |
|---|---|---|
| `%ctaid.x`, `%ntid.x`, `%tid.x`, `setp.ge`, `bra` | which element this thread handles, and stop if it is past the end | one thread per element |
| `ld.global.b32` (two) | read element *i* of the two `r̲ange 8` inputs | `%l`, `%l_2` |
| `mul.rn.f32 … 0f3E800000` | multiply by 0.25: the `÷ 4`, turned into a multiply by its exact reciprocal | `%div` |
| `add.f32 … 0fBF800000` | add -1.0 | `%sub`, which is `x` |
| `setp.gt.f32 … 0f3F000000`, `selp.f32 0f3F800000, 0f00000000` | compare with 0.5, then 1.0 or 0.0 | `%gt`, `%f` |
| `mul.f32 %r9` | `x` times that | `%mul`, `ᵃᶜt̲hreshold` |
| `max.f32 … 0f00000000` (two) | the larger of the value and 0 | `%max`, `%max_2`, the two `ᵃᶜr̲elu` |
| `add.f32 … 0fC0800000` | add -4.0 | `%sub_2`, which is `n` |
| `cvt.rzi.s64.f32` through `cvt.rn.f32.s64` | `n` as a 64-bit integer, the remainder by 2 without a divide, a sign fix that makes it floored (so -3 mod 2 is 1), and back | `%mod` |
| `mul.f32 %r14` | `n` times that | `%mul_2`, `ᵃᶜk̲eep` |
| `st.global.b32` (five) | write the five results | the five `output` lines |

Seven lines of X_eTaL became one pass in which each thread reads two numbers and writes five. The scalars of the program became constants in the instructions, and this route carries X_eTaL's integers as 32-bit floats, converting to a true integer only for the remainder.

## How Mojo uses CUDA, and goes around it

"CUDA" is three things usually sold together: a compiler, `nvcc`, from C++ to PTX; an assembler, `ptxas`, from PTX to the card's machine code, SASS; and the driver, `libcuda`, which allocates memory, copies and launches. Mojo replaces the first: its own LLVM-based compiler writes the PTX above, and no CUDA Toolkit is installed on the machine that built it. It brings its own copy of the second, a bundled PTX compiler that needs NVIDIA driver 580 or later, with an escape hatch for older drivers: `MODULAR_NVPTX_COMPILER_PATH` points it at a system `ptxas`. The third it cannot replace and does not try: at run time the library loads the installed driver, `libcuda.so.1`, and hands it the kernel through Modular's runtime library, AsyncRT, with two calls, `AsyncRT_DeviceContext_loadFunction` and then `AsyncRT_DeviceContext_enqueueFunctionDirect`. On AMD the runtime loads HIP's library, `libamdhip64`, instead, and on a Mac it uses Metal.

## The other road: OpenCL C

X_eTaL-gpu's first backend skips Mojo and writes OpenCL C, from the same XIR, with the same one-line-per-operation table:

```c
// X_eTaL-gpu: generated OpenCL C 1.2. Floored division and remainder, as X_eTaL's d_iv and m_od.
inline long xetal_idiv_long(long a, long b) { long q = a / b; return (a % b != 0 && ((a < 0) != (b < 0))) ? q - 1 : q; }
inline long xetal_imod_long(long a, long b) { return a - xetal_idiv_long(a, b) * b; }

// k0: 8 elements, one work-item each; computes %div %sub %gt %f %mul %max %sub_2 %max_2 %mod %mul_2
__kernel void k0(__global const float* b_l, __global const long* b_l_2, __global float* b_sub, __global float* b_mul,
                 __global float* b_max, __global long* b_max_2, __global long* b_mul_2) {
    size_t i = get_global_id(0);
    if (i >= 8) return;
    float t_div = (b_l[i] / 4.0f);
    float t_sub = (t_div - 1.0f);
    int t_gt = (t_sub > 0.5f);
    float t_f = (float)t_gt;
    float t_mul = (t_sub * t_f);
    float t_max = fmax(t_sub, 0.0f);
    long t_sub_2 = (b_l_2[i] - 4L);
    long t_max_2 = max(t_sub_2, 0L);
    long t_mod = xetal_imod_long(t_sub_2, 2L);
    long t_mul_2 = (t_sub_2 * t_mod);
    b_sub[i] = t_sub;
    b_mul[i] = t_mul;
    b_max[i] = t_max;
    b_max_2[i] = t_max_2;
    b_mul_2[i] = t_mul_2;
}
```

It is OpenCL C, a dialect of C99, not C++. The emitter takes a per-device schedule from X_eTaL-gpu's `schedules/` directory (`apple-m1-max`, `nvidia-rtx5060-ti`, `nvidia-modern`, `nvidia-legacy`, and f64 variants), which sets the work-group size, the tile size, and whether floats are 32 or 64 bits.

Nothing compiles this file ahead of time. The program ships the text, and X_eTaL-gpu's runtime, through the `opencl3` crate, hands it to whatever driver owns the GPU:

| Step | `opencl3` call | OpenCL API |
|---|---|---|
| find the GPU | `get_platforms`, `Context::from_device` | `clGetPlatformIDs`, `clCreateContext` |
| a queue | `CommandQueue::create_default` | `clCreateCommandQueue` |
| compile | `Program::create_and_build_from_source` | `clCreateProgramWithSource`, `clBuildProgram` |
| a kernel | `Kernel::create` | `clCreateKernel` |
| data in | `enqueue_write_buffer` | `clEnqueueWriteBuffer` |
| run | set the arguments, enqueue | `clSetKernelArg`, `clEnqueueNDRangeKernel` |
| data out | `enqueue_read_buffer` | `clEnqueueReadBuffer` |

`clBuildProgram` is where the compiling happens, inside the vendor's driver, at run time. On Linux that is NVIDIA's OpenCL, which ships with the display driver, not the CUDA Toolkit: it compiles OpenCL C to PTX and the PTX to the card's machine code, with no `nvcc` anywhere. On the Mac it is Apple's OpenCL 1.2, deprecated since 2018 and still present, which keeps its compiled code to itself, as below. On October 14 all thirteen Accel demos, this one among them, passed through OpenCL on the RTX 5060 Ti (the device reports itself as "OpenCL 3.0 CUDA", driver 615.78.08), each lowered from its source and checked against the evaluator's output on the XIR interpreter and on the GPU at two tile sizes ([results](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/linux-nvidia-results.md)).

That is the difference between the two roads. Mojo compiles to PTX or AIR when the library is built, so its PTX can be printed on any machine and shipped inside the library; the driver only finishes and launches it. OpenCL compiles when the program runs, so its PTX exists only inside NVIDIA's driver, unless the program asks for it back.

TODO (ask 6): the PTX NVIDIA's OpenCL compiler made from this, read back with `clGetProgramInfo(CL_PROGRAM_BINARIES)`, beside Mojo's.

On the M1 Max the same OpenCL C gives X_eTaL's five lines exactly, identical to the evaluator's output, with most of its time, about 60 ms, spent in setup, which is the driver compiling the source ([run log](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/evidence/m1max-opencl-20261021/run.log)). Asked for what it compiled, `clGetProgramInfo(CL_PROGRAM_BINARIES)`, Apple's OpenCL says the binary is an executable and returns 2,108 bytes. They are not GPU code and not AIR. They are a binary property list, the format of macOS settings files, holding a version, the platform's name (`OpenCL 1.2 (Apr 18 2026 19:20:04)`), and a second property list with three entries: the compiler options, a flags word of 0, and the source, the same 27 lines of OpenCL C the program handed in ([decoded](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/evidence/m1max-opencl-20261021/binary-decoded.txt), [handoff](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/m1max-opencl-handoff.md)). A program loaded back from this "binary" is compiled again from its source. The compiled kernel never leaves the driver, the same gap as Mojo's AIR on the Mac, and the one public trace of how the driver works is in its error log: a refused source is reported as `buildComputeProgram: cl2Metal failed`, which names a translator from OpenCL C to Metal inside it.

## CUDA C and nvcc

The same XIR also goes to CUDA C++, through a second emitter in rust-demo with the same table, one line per operation. The work for one element is a device function, and the kernel calls it for its thread's index ([the whole file](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold.cu), host code included):

```cpp
HD inline void element(int i, const float* b_0, const float* b_11, float* out_0, float* out_1, float* out_2, float* out_3, float* out_4) {
    float v_0 = b_0[i]; // %l
    float v_1 = 4.0f; // %r
    float v_2 = v_0 / v_1; // %div
    float v_3 = 1.0f; // %r_2
    float v_4 = v_2 - v_3; // %sub
    float v_5 = 0.5f; // %r_3
    bool v_6 = v_4 > v_5; // %gt
    float v_7 = float(v_6); // %f
    float v_8 = v_4 * v_7; // %mul
    float v_9 = 0.0f; // %r_4
    float v_10 = fmaxf(v_4, v_9); // %max
    float v_11 = b_11[i]; // %l_2
    float v_12 = 4.0f; // %r_5
    float v_13 = v_11 - v_12; // %sub_2
    float v_14 = 0.0f; // %r_6
    float v_15 = fmaxf(v_13, v_14); // %max_2
    float v_16 = 2.0f; // %r_7
    float v_17 = float((static_cast<long long>(v_13) % static_cast<long long>(v_16)) + (((static_cast<long long>(v_13) % static_cast<long long>(v_16)) != 0 && ((v_13 < 0) != (v_16 < 0))) ? static_cast<long long>(v_16) : 0)); // %mod
    float v_18 = v_13 * v_17; // %mul_2
    out_0[i] = float(v_4);
    out_1[i] = float(v_8);
    out_2[i] = float(v_10);
    out_3[i] = float(v_15);
    out_4[i] = float(v_18);
}

extern "C" __global__ void stage0(const float* b_0, const float* b_11, float* out_0, float* out_1, float* out_2, float* out_3, float* out_4) {
    int i = blockIdx.x * blockDim.x + threadIdx.x;
    if (i < 8) element(i, b_0, b_11, out_0, out_1, out_2, out_3, out_4);
}
```

The long `%mod` line is the one place C++ needs help: its `%` truncates toward zero, so the emitter adds the divisor back when the signs differ, which makes `-3 mod 2` equal 1, as X_eTaL has it. The host side is plain CUDA runtime calls: `cudaMalloc`, `cudaMemcpy`, the launch `stage0<<<1, 256>>>(...)`, `cudaDeviceSynchronize`, and `cudaMemcpy` back.

`nvcc -O3 -arch=compute_120a -ptx` turns it into PTX (CUDA 13.4, "Generated by NVIDIA NVVM Compiler"). It is the same work as Mojo's PTX with one visible difference: nvcc fused the divide and the subtract into one fused multiply-add,

```text
fma.rn.f32 	%r6, %r5, 0f3E800000, 0fBF800000;
```

that is, `l × 0.25 − 1.0` in one instruction and one rounding, where Mojo's PTX has a `mul.rn.f32` and an `add.f32`. With `--fmad=false` nvcc writes them separately too, `mul.rn.f32` then `add.rn.f32` ([default](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold.ptx), [without FMA](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold-no-fma.ptx)). Counting the operations in the source and counting the instructions are different answers, and the compiler decides which.

One level further down, `nvcc -arch=sm_120a -cubin` and `nvdisasm` show the card's own machine code, SASS. The same multiply-add is there as `FFMA`, the ReLUs as `FMNMX` against the zero register, and the five results as `STG` stores (an excerpt; [the whole listing](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/accel-threshold.sass)):

```text
LDG.E R6, desc[UR4][R6.64] ;
LDG.E R3, desc[UR4][R4.64] ;
FFMA R3, R3, R14, -1 ;
FMNMX R21, RZ, R3, !PT ;
STG.E desc[UR4][R14.64], R3 ;
FMUL R17, R3, R16 ;
STG.E desc[UR4][R10.64], R17 ;
```

Built as a native `sm_120a` program and run on the RTX 5060 Ti, it prints X_eTaL's five lines ([run log](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/rtx5060-cuda-20261021/cuda.log)):

```text
output %sub: -0.75 -0.5 -0.25 0 0.25 0.5 0.75 1
output %mul: -0 -0 -0 0 0 0 0.75 1
output %max: 0 0 0 0 0.25 0.5 0.75 1
output %max_2: 0 0 0 0 1 2 3 4
output %mul_2: -3 -0 -1 0 1 0 3 0
backend: CUDA
RESULT: 0 mismatched elements
```

Building it needs the CUDA Toolkit; running it needs the card and its driver, since nvcc links the CUDA runtime statically by default. That is the trade against Mojo's road: the toolkit on the build machine in place of Mojo, and `nvcc`'s PTX in place of LLVM's.

## AMD: AMDGCN, through Mojo

No AMD GPU is installed here, so this section is listings only: nothing below ran. It does not need one to be written. Mojo's `--target-accelerator=gfx1100` (RDNA3, the Radeon RX 7900 family) compiled the same `.mojo` file on the Mac and wrote AMDGCN assembly ([the whole listing](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/amd-gfx1100-listings-20261021/accel-threshold-stage0.gfx1100.amdgcn); an excerpt, in the compiler's order):

```text
	global_load_b32 v4, v[2:3], off
	global_load_b32 v8, v[2:3], off
	v_add_f32_e32 v10, -4.0, v4
	v_trunc_f32_e32 v2, v10
	v_mul_f32_e32 v8, 0x3e800000, v8
	v_add_f32_e32 v12, -1.0, v8
	v_cmp_lt_f32_e32 vcc_lo, 0.5, v12
	v_cndmask_b32_e64 v14, 0, 1.0, vcc_lo
	v_max_f32_e32 v15, 0, v10
	v_max_f32_e32 v14, 0, v12
	global_store_b32 v[4:5], v12, off
```

The element-by-element arithmetic is as short as on NVIDIA: a multiply by 0.25 (`0x3e800000`), an add of -1.0, a compare and a select, two maxima, five stores. The difference is the remainder. RDNA3 has no instruction that converts a float to a 64-bit integer or back, so the one `cvt.rzi.s64.f32` of the PTX becomes a truncate, a multiply by 2^-32, a floor, a fused multiply-add and two conversions, and the way back several more: one line of X_eTaL, about thirty instructions. The listing's descriptor also records 32-wide waves, the same width as NVIDIA's warps.

This is the one AMD example in the post. The C++ road onto AMD, HIP compiled with `hipcc`, would be the counterpart of the CUDA C++ section above; it is not shown here.

## Apple Silicon: Metal and AIR

The same `.mojo` file, built on the M1 Max, does not become PTX. Mojo's compiler lowers `stage0` to AIR, Apple's intermediate representation for Metal: LLVM's own IR, with Apple's intrinsics, which `mojo build --target-accelerator=metal:4 --emit asm` writes beside the host assembly. The body still reads as the program ([the whole listing](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/m1max-metal-20261021/accel-threshold-stage0.air.ll); an excerpt):

```llvm
  %60 = fdiv float %57, 4.000000e+00
  %61 = fsub contract float %60, 1.000000e+00
  %62 = fcmp ogt float %61, 5.000000e-01
  %63 = select i1 %62, float 1.000000e+00, float 0.000000e+00
  %64 = fmul contract float %61, %63
  %65 = call float @air.fmax.f32(float %61, float 0.000000e+00)
  %66 = fsub contract float %59, 4.000000e+00
  %67 = call float @air.fmax.f32(float %66, float 0.000000e+00)
  %68 = call i64 @air.convert.s.i64.f.f32(float %66)
  %69 = sdiv i64 %68, 2
```

The divide is still a divide here, and the subtract carries a `contract` flag, which lets Apple's back end fuse the two later; the AIR itself keeps them apart. The thread's position arrives as arguments to the function rather than from special registers, the maxima are calls to `@air.fmax.f32`, and the integer conversions for the remainder are `@air.convert` calls. Run on the M1 Max, the five rows match X_eTaL's exactly ([run log](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/m1max-metal-20261021/metal.log)). What happens to the AIR next is Apple's: the Metal driver compiles it to the GPU's own instructions when the function is first loaded, and there is no public listing of that step.

## On the CPU

The same file has a CPU build as well. Built with `-D XIR_CPU=true`, its host code opens a CPU device instead of the GPU, makes the same buffers and copies, and hands each stage to the CPU as a parallel range over the elements instead of a grid of threads. The body is the same function either way. On the M1 Max's CPU it gave X_eTaL's five rows exactly ([run log](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/m1max-cpu-20261021/cpu.log)), and its body in arm64 is a fourth spelling of the program ([the whole listing](https://github.com/softwarewrighter/modular-fork/blob/experimental/rust-demo/doc/evidence/m1max-cpu-20261021/accel-threshold-xir_run-closures.s); an excerpt):

```text
	fmov	s2, #0.25000000
	fmov	s3, #-1.00000000
	fmadd	s0, s0, s2, s3
	fmov	s2, #0.50000000
	fcmp	s0, s2
	fmov	s3, #1.00000000
	fcsel	s3, s3, s2, gt
	fmul	s3, s0, s3
	fmaxnm	s4, s0, s2
	fmov	s5, #-4.00000000
	fadd	s1, s1, s5
	fmaxnm	s2, s1, s2
	fcvtzs	x9, s1
```

Like nvcc's default PTX, LLVM's Arm back end fused the divide and the subtract into one `fmadd`. And the remainder is cheap here: Arm has 64-bit conversions (`fcvtzs`, `scvtf`) and conditional instructions in hardware, so the whole floored `m̲od` is about nine instructions.

TODO (Arch, A6): the same build on the x86-64 CPU.

## One line, five spellings

The first line of the program, `x ← ((r̲ange 8) ÷ 4) − 1.0`, as each road wrote it:

| Road | Instructions | |
|---|---|---|
| Mojo → PTX (NVIDIA) | `mul.rn.f32` by 0.25, `add.f32` of -1.0 | two |
| nvcc → PTX (NVIDIA) | `fma.rn.f32 … 0.25, -1.0` | fused |
| Mojo → AIR (Apple) | `fdiv` by 4.0, `fsub contract` 1.0 | two, fusing left to Apple's driver |
| Mojo → AMDGCN (AMD) | `v_mul_f32` by 0.25, `v_add_f32` of -1.0 | two |
| Mojo → arm64 (CPU) | `fmadd` with 0.25 and -1.0 | fused |

Every road that ran, all but AMD's, gave the same eight numbers, because 0.25 is exact and the fused and unfused results agree; on other numbers a fused multiply-add rounds once instead of twice, and that is a choice each compiler makes for you.

## The toolchains side by side

| | CUDA | ROCm (HIP) | Metal | OpenCL | Mojo |
|---|---|---|---|---|---|
| kernel language | CUDA C++ | HIP C++ | Metal Shading Language | OpenCL C | Mojo |
| compiled by | `nvcc`, ahead of time | `hipcc` or `amdclang++`, ahead of time, for a named target (`--offload-arch=gfx942`) | `xcrun metal`, ahead of time | the driver, at run time (`clBuildProgram`) | `mojo build`, ahead of time (LLVM) |
| what it produces | PTX and/or machine code (cubin), in a fat binary | an AMDGPU code object, in a fat binary or a `.hsaco` | AIR (LLVM bitcode), packed by `metallib` into a `.metallib` | nothing shipped but the source | PTX, AMD GPU code or AIR, embedded in the library |
| last step to machine code | `ptxas` at build time, or the driver compiles the PTX at load | done ahead of time for the named target | Apple's driver, when the function is first loaded (no public listing) | inside the driver | NVIDIA: a bundled PTX compiler, or the driver |
| needed to build | CUDA Toolkit | ROCm | Xcode's Metal toolchain | nothing | Mojo |
| needed to run | NVIDIA driver (the CUDA runtime is linked statically by default) | ROCm runtime | macOS | a driver with OpenCL | the GPU's driver (NVIDIA: 580 or later) |

Sources: NVIDIA's [nvcc documentation](https://docs.nvidia.com/cuda/cuda-compiler-driver-nvcc/index.html) (the compilation trajectory; PTX "dynamically compiled by the CUDA runtime system if no binary load image is found for the current GPU"); AMD's [HIP compilers page](https://rocm.docs.amd.com/projects/HIP/en/latest/understand/compilers.html); Apple's [Metal tools](https://developer.apple.com/library/ios/documentation/Miscellaneous/Conceptual/MetalProgrammingGuide/Dev-Technique/Dev-Technique.html); Mojo's requirements in the fork (driver 580, `MODULAR_NVPTX_COMPILER_PATH`).

TODO: confirm the "needed to run" row against each vendor's current documentation.

## Next: Qualcomm

Apple Silicon and NVIDIA are two families. A planned post adds a third, Qualcomm, on a small board, the Arduino UNO Q (2 GB, ABX00162). It is a hybrid of two chips: a Qualcomm Dragonwing QRB2210, with four Arm Cortex-A53 cores running Debian Linux, an Adreno 702 GPU and a Hexagon DSP; and an ST STM32U585 microcontroller, an Arm Cortex-M33 running Zephyr, for the board's real-time pins. That is two instruction sets, 64-bit Armv8-A and 32-bit Armv8-M, and one more GPU. The plan is to try the same program on the Cortex-A53 through X_eTaL and Mojo, then look for a road onto the Adreno GPU, which Mojo does not target, through OpenCL if the board's Linux has a driver for it ([Arduino's UNO Q documentation](https://docs.arduino.cc/hardware/uno-q), [Qualcomm's QRB2210 product brief](https://docs.qualcomm.com/doc/87-61720-1/87-61720-1_REV_D_Qualcomm_Dragonwing_QRB2210_Processor_Product_Brief.pdf)).
