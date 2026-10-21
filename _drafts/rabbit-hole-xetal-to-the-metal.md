---
layout: post
title: "Rabbit-hole #8: From X_eTaL to the Metal, One Kernel Down Every GPU Toolchain"
categories: [rabbit-hole, programming-languages, deep-dive]
tags: [rabbit-hole, xetal, x-etal, mojo, gpu, cuda, ptx, sass, nvcc, rocm, hip, amdgcn, metal, air, opencl, llvm, compilers, array-languages]
keywords: "X_eTaL to PTX, Mojo GPU compilation, kgen.compile_offload, LLVM NVPTX, CUDA without nvcc, PTX walkthrough, ROCm HIP AMDGCN, Metal AIR, OpenCL C driver compile, CUDA vs ROCm vs Metal vs OpenCL, GPU toolchain comparison, array language GPU"
abstract: "One small ML array program, a threshold and two ReLUs written in X_eTaL, followed all the way down: X_eTaL source to its Core, to an accelerator IR, to Mojo, to the PTX NVIDIA's driver finishes into machine code, and on to the other roads, OpenCL C compiled by the driver at run time, CUDA C through nvcc, HIP through hipcc for AMD, and Metal's AIR on Apple Silicon. What each toolchain needs installed, what it hands to the next, and where Mojo uses CUDA and where it goes around it."
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
     TODO sections wait on rust-demo work: tmp/asks-2026-10-20-rust-demo-top-down.md (items 1-10; 6 and 10 may belong in X_eTaL-gpu).
     OpenCL section: runtime calls verified in X_eTaL-gpu components/runtime/src/lib.rs; schedules/ listing; RTX 5060 Ti OpenCL results
     from docs/linux-nvidia-results.md (2026-10-14, rev 6ccdbc1, driver 615.78.08, OpenCL 3.0 CUDA, 13/13 Accel demos). Do not describe any of it as
     built until its commit exists. Listings may be long: summarize here, link the full listings and doc/top-down.md.
     Same date as AL #16 (different series); date tentative. Lead image: Mike's block-down-gpu-hole.jpg (2026-10-21), dark, not inverted. -->

<img src="{{ '/assets/images/posts/block-down-gpu-hole.webp' | relative_url }}" class="post-marker no-invert" alt="" style="width: 205px;">

Between a line of array code and a GPU doing it there are five or six programs, each turning one language into a lower one, and most of them are invisible. This post makes them visible for one small program. It follows a threshold and two ReLUs, written in X_eTaL, down through every level to the instructions a GPU runs, by Mojo, and then down the other roads: OpenCL, CUDA C, HIP for AMD, and Metal.

<!--more-->

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **The Mojo road** | [modular-fork: rust-demo](https://github.com/softwarewrighter/modular-fork/tree/experimental/rust-demo) |
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

TODO (ask 1): the generated `.mojo` for this program, committed in rust-demo. The emitter is a table from each XIR operation to one line of Mojo; it fuses the element-by-element operations into one kernel, `stage0`, and writes a host function, `xir_run`, exported with a C interface, that creates the buffers, copies, launches and copies back.

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

TODO: annotate the body, instruction by instruction, against the XIR: the thread index and bounds check; `0f3E800000` is 0.25 (the `÷ 4` became a multiply); `0fBF800000` is -1.0; the compare and select are `ᵃᶜt̲hreshold`; the two `max.f32` are the ReLUs; the block from `cvt.rzi.s64.f32` is the floored `m̲od 2`, with the sign fix that makes -3 mod 2 equal 1; five stores for five outputs.

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

`clBuildProgram` is where the compiling happens, inside the vendor's driver, at run time. On Linux that is NVIDIA's OpenCL, which ships with the display driver, not the CUDA Toolkit: it compiles OpenCL C to PTX and the PTX to the card's machine code, with no `nvcc` anywhere. On the Mac it is Apple's OpenCL 1.2, deprecated since 2018 and still present, whose intermediate steps Apple does not document. On October 14 all thirteen Accel demos, this one among them, passed through OpenCL on the RTX 5060 Ti (the device reports itself as "OpenCL 3.0 CUDA", driver 615.78.08), each lowered from its source and checked against the evaluator's output on the XIR interpreter and on the GPU at two tile sizes ([results](https://github.com/softwarewrighter/X_eTaL-gpu/blob/main/docs/linux-nvidia-results.md)).

That is the difference between the two roads. Mojo compiles to PTX or AIR when the library is built, so its PTX can be printed on any machine and shipped inside the library; the driver only finishes and launches it. OpenCL compiles when the program runs, so its PTX exists only inside NVIDIA's driver, unless the program asks for it back.

TODO (ask 6): the PTX NVIDIA's OpenCL compiler made from this, read back with `clGetProgramInfo(CL_PROGRAM_BINARIES)`, beside Mojo's.

TODO (ask 10): the same demo through OpenCL on the M1 Max, committed with its output (no committed threshold run on the Mac yet), and what Apple's `CL_PROGRAM_BINARIES` returns, if anything readable.

## CUDA C and nvcc

TODO (ask 5): the generated `.cu` for the same XIR, `nvcc -ptx`'s output, a run on the RTX 5060 Ti against the expected output, and the differences from Mojo's PTX.

## ROCm: HIP and AMDGCN

TODO (asks 4, 5): listings only, no AMD card installed: the generated `.hip`, `hipcc`'s AMDGCN for a named `gfx` target, and Mojo's AMDGCN for the same target if it can compile offline.

## Apple Silicon: Metal and AIR

TODO (ask 2): the same program through Mojo on the M1 Max: Mojo writes Apple's AIR instead of PTX, from the same `.mojo` file; the listing and the run.

## On the CPU

TODO (ask 3): the same kernel on the CPU, its host assembly, and the run.

## The toolchains side by side

TODO (ask 9): for CUDA, ROCm, Metal, OpenCL and Mojo: source language, compiler, intermediate (PTX, AMDGCN code object, AIR, OpenCL C at run time), assembler, runtime, and what has to be installed, each verified against its vendor's documentation.
