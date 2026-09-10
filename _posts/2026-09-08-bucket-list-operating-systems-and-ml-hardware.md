---
layout: post
title: "Bucket List #4: Three Operating Systems and an ML Hardware Emulator"
categories: [personal, projects, operating-systems, hardware]
tags: [bucket-list, operating-systems, microkernel, swtos, mesaos, mlos, rust, plsw, cor24, fpga, emufpga, serial-parameter-machine, quantization, ring-3, qemu, minix, ml-hardware]
keywords: "bucket list, operating systems, microkernel, SWTOS, MesaOS, MLOS, sw-os-ml, emufpga, Serial Parameter Machine, SPM, COR24, MakerLisp, PL/SW, MINIX, IPC, message passing, preemptive multitasking, interrupt register, Ring 3, ELF loader, QEMU, arm64, Rust no_std, FPGA, Gowin, Sipeed Tang Nano, low-bit inference, mixture of experts, MoE, streaming weights"
author: Software Wrighter
abstract: "Status report on two bucket list items: developing operating systems, and building ML hardware. Three operating systems are in flight --- SWTOS, a preemptive microkernel running on a COR24 FPGA soft CPU and in the browser; a MesaOS fork used for Ring 3 experiments; and MLOS, a Rust kernel that virtualizes model state rather than memory pages. The hardware item is emufpga, a behavioral emulator for a Serial Parameter Machine that streams weights past the compute: 4 KiB resident instead of 269 MB on a 135M model, bit-exact, five clients served off one pass."
series: "Bucket List"
series_part: 4
date: 2026-09-08 00:15:00 -0700
repo_urls:
  - url: "https://github.com/sw-embed/sw-tos"
    title: "sw-tos (SWTOS microkernel)"
  - url: "https://github.com/sw-embed/web-sw-tos"
    title: "web-sw-tos (browser frontend)"
  - url: "https://github.com/sw-embed/sw-cor24-plsw"
    title: "sw-cor24-plsw (PL/SW)"
  - url: "https://github.com/softwarewrighter/MesaOS"
    title: "MesaOS (my fork)"
  - url: "https://github.com/crackanimad0r/MesaOS"
    title: "crackanimad0r/MesaOS (upstream)"
  - url: "https://github.com/sw-ml-study/sw-os-ml"
    title: "sw-os-ml (MLOS)"
  - url: "https://github.com/sw-ml-study/emufpga"
    title: "emufpga"
  - url: "https://github.com/softwarewrighter/bucketlist"
    title: "bucketlist"
---

<img src="{{ '/assets/images/posts/bucket-list-os-and-ml-hardware.webp' | relative_url }}" class="post-marker" alt="" style="width: 200px;">

<div style="overflow: hidden;" markdown="1">

Two items from the list ([part 1](/2026/03/21/bucket-list-things-ive-always-wanted-to-build/), [part 2](/2026/04/03/bucket-list-software-tools-landing-page/), [part 3](/2026/04/30/bucket-list-3d-source-new-languages-visible-compilers/)) are active right now: **develop operating systems**, and **build ML hardware**. This is a status report on both.

</div>

<div class="aside-box" markdown="1">

**TL;DR**

| Project | What it is | Where it stands |
|---------|-----------|-----------------|
| [**SWTOS**](https://github.com/sw-embed/sw-tos) | Preemptive microkernel for the COR24 FPGA soft CPU, written in PL/SW | Boots on real hardware and [in a browser](https://swtos.softwarewrighter.com/). All validated paths are UART-only. I2C, SPI, RTC, temp sensor, SD card and NAND flash are untested |
| [**MesaOS**](https://github.com/softwarewrighter/MesaOS) (fork) | 64-bit hybrid kernel with a Ring 3 userspace, by another author | Reproducible QEMU/VNC setup done; running Ring 3 experiments in Rust `no_std` |
| [**MLOS**](https://github.com/sw-ml-study/sw-os-ml) | New Rust kernel that virtualizes ML objects instead of memory pages | Boots to a shell (gate G1). Gates G2--G8 not started; the ML content begins at M2 |
| [**emufpga**](https://github.com/sw-ml-study/emufpga) | Behavioral emulator for a Serial Parameter Machine --- weights streamed past the compute | Measured: 4 KiB resident vs 269 MB, bit-exact, five clients per weight pass. No HDL yet |

</div>

<div class="resource-box" markdown="1">

| Resource | Link |
|----------|------|
| **SWTOS** | [sw-embed/sw-tos](https://github.com/sw-embed/sw-tos) · [live demo](https://swtos.softwarewrighter.com/) |
| **SWTOS web frontend** | [sw-embed/web-sw-tos](https://github.com/sw-embed/web-sw-tos) · [nightly](https://sw-embed.github.io/web-sw-tos/) |
| **PL/SW** | [sw-embed/sw-cor24-plsw](https://github.com/sw-embed/sw-cor24-plsw) |
| **MesaOS** | [my fork](https://github.com/softwarewrighter/MesaOS) · [upstream](https://github.com/crackanimad0r/MesaOS) |
| **MLOS** | [sw-ml-study/sw-os-ml](https://github.com/sw-ml-study/sw-os-ml) |
| **emufpga** | [sw-ml-study/emufpga](https://github.com/sw-ml-study/emufpga) |
| **sw-MLPL playground** | [sw-ml-study.github.io/sw-mlpl](https://sw-ml-study.github.io/sw-mlpl/) |
| **Bucket List** | [softwarewrighter/bucketlist](https://github.com/softwarewrighter/bucketlist) |
| **Comments** | [Discord](https://discord.com/invite/Ctzk5uHggZ) |

</div>

## SWTOS

[**SWTOS**](https://github.com/sw-embed/sw-tos) is a clean-room microkernel inspired by MINIX IPC principles, designed for small CPUs and FPGA soft cores. It runs on the [COR24-TB](https://www.makerlisp.com/cor24-test-board) --- a MakerLisp COR24 soft CPU, 24-bit, 1 MB SRAM, 101.7 MHz --- and in a companion emulator. It is written in [**PL/SW**](https://github.com/sw-embed/sw-cor24-plsw), the PL/I-inspired systems language from [part 3](/2026/04/30/bucket-list-3d-source-new-languages-visible-compilers/).

The MINIX lineage is first-hand: I explored MINIX in the early 1990s, after trying various flavors of UNIX on PCs, and moved to Slackware Linux in 1994.

My interest in it picked up again recently, after a video pointed out where MINIX 3 actually ended up. Intel's Management Engine --- the support processor in the chipset, separate from the CPU --- has run a MINIX 3 derivative since roughly the Skylake generation. It is what provides out-of-band remote administration: an administrator can reach the machine when the main operating system is down, or the machine is nominally powered off. Andrew Tanenbaum, who wrote MINIX as a teaching system, found out it was shipping on that scale by reading about it, and published an open letter to Intel in 2017 saying so.

That makes MINIX arguably the most widely deployed microkernel in existence, running where almost nobody looks: a small processor, tight resources, no user sitting in front of it. Which is the same shape of target SWTOS aims at.

The board's constraints drive the design:

| Constraint | Consequence |
|------------|-------------|
| No MMU | One address space; isolation by separate stacks and no shared writable globals |
| No filesystem | Programs are cataloged into the image at build time |
| No interval timer | Preemption rides on UART heartbeat frames from the host, cooperative fallback |
| Interrupt PC unreadable | The resume address must be measured rather than saved (below) |
| 1 MB total | Kernel, services and applications link into one flat binary |

<figure class="inline-left" style="max-width: 200px;">
<img src="{{ '/assets/images/posts/sw-tos-logo.webp' | relative_url }}" alt="Software Wrighter Tiny O/S logo">
</figure>

**Running now:** the whole system --- emulated COR24, microkernel, services, shell, tiled terminal frontend --- is compiled to WebAssembly at [swtos.softwarewrighter.com](https://swtos.softwarewrighter.com/). `Ctrl-O` then `?` lists commands.

**On hardware:** SWTOS has booted on a physical COR24-TB at 921600 baud, running the scheduler, catalog shell, process listing, the time applications, two workers under the multitask menu, and the `help`, `df`, `du`, `dir`, `uname` and `stat` queries.

**Not on hardware:** every one of those paths is UART-only, chosen because they need no external peripherals. The board has I2C on header J2 and SPI on header J3, and neither bus has been exercised. The SPI-backed catalog --- which would let SWTOS load images at runtime instead of baking every program into the flat binary --- has not been programmed or tested on the board. Nor has an RTC, a temperature sensor, an SD card reader, or NAND flash. The repo's `docs/hw-testing-status.md` records this as "an initial engineering result, not yet a completed hardware acceptance record."

Peripheral bring-up is the bulk of the remaining work, and it is where the emulator stops being able to answer the question: an emulated I2C device is a device that always behaves.

### Measuring a program counter the hardware will not disclose

The acceptance test for preemption is `cpu-hog`: three instructions, an infinite `add`, with no yield, syscall, memory access, IPC, sleep or blocking operation of any kind. If the forced-preemption counter advances and successive interrupted `r0` samples differ while two copies run, the scheduler is genuinely taking the CPU away.

Making that work runs into a hardware constraint. On COR24 an interrupt preserves the continuation PC in a register named `IR`. Software can return to it with `jmp (IR)`, but no normal instruction copies `IR` into a general register or into memory. The machine will send a task back to where it was, without disclosing where that is --- and a preemptive scheduler must record exactly that.

SWTOS recovers the address by measuring it. On the forced path, after the ISR has pushed the interrupted `r0`, `r1`, `r2`, `fp` and condition state onto the task stack, the kernel:

1. Copies the task's entire live region into a private shadow.
2. Writes a C7 absolute jump into a two-word landing slot past that region, targeting the landing handler.
3. Overwrites every live byte with opcode `01`, the one-byte `add r0,r1`.
4. Sets `r0` to the landing address and `r1` to `-1`.
5. Executes `jmp (IR)`.

The task resumes at its unknown PC `P` and lands in a runway of identical one-byte decrements, executing exactly `E - P` of them before reaching the landing slot at `E`. Since `r0` started at `E` and lost one per byte, it arrives holding `P`. The handler reads the resume address out of a register, restores every live byte from the shadow, and hands the task to the scheduler.

No alignment estimate and no reserved application register are required, which is what makes `cpu-hog` a fair test. The cost is that the kernel temporarily overwrites the program it is preserving, so correctness depends on a preservation rule --- snapshot and restore every byte the runway touches --- that constrains how images may be laid out.

A newer COR24-TB revision is expected soon with interrupt register support, an internal clock, and possibly more interrupt sources. A readable interrupt register removes the runway; the scheduler would save the PC directly. An internal clock removes the UART heartbeat, so preemption no longer depends on the host supplying a pulse.

**Next:** peripheral bring-up across I2C and SPI, the SPI-backed catalog on hardware, and retiring both workarounds on the new board.

## MesaOS (fork)

[**MesaOS**](https://github.com/crackanimad0r/MesaOS) is a 64-bit hobby OS by another author, with a hybrid kernel, a Ring 3 userspace, an ELF loader, a preemptive round-robin scheduler, and a Linux compatibility shim recognizing around 350 syscalls with 60-plus implemented. Its documentation is in Spanish.

SWTOS runs on a machine with no memory protection at all. MesaOS has the thing SWTOS does without: real privilege separation, real ELF loading, a real user/kernel boundary. [My fork](https://github.com/softwarewrighter/MesaOS) is where I run experiments against that boundary.

Work so far: a safe QEMU launcher and a reproducible build setup, plus a local VNC console that keeps MesaOS running across a disconnect. Then Ring 3 experiments in Rust `no_std` --- most recently an ASCII analog clock loaded as an isolated ELF in Ring 3, with no direct framebuffer access and no kernel privileges. It gets RTC time, console clear and color, and a latched Ctrl+C through small, narrowly scoped syscalls. Getting the animation to sweep correctly required the kernel shell to wait while an `exec`'d child holds the foreground, so the two stop racing for the keyboard and screen.

**Next:** further Ring 3 experiments against the privilege boundary.

## MLOS


<div class="gutter-section" markdown="1">

<img src="{{ '/assets/images/posts/sw-mlos-logo.webp' | relative_url }}" class="gutter-img-right no-invert" alt="SW MLOS logo">

[**MLOS**](https://github.com/sw-ml-study/sw-os-ml) starts from what an operating system virtualizes. A conventional kernel virtualizes physical memory behind an abstraction the hardware understands --- the page --- and paging, faults, working sets and replacement policy all follow from that.

On a machine running models, the scarce resource is resident model state: weights, KV blocks, MoE expert streams, activations, embeddings, adapters. Each application manages its own by hand, with no shared notion of residency, eviction or fairness. MLOS asks what a kernel looks like when the *ML object* is the unit of virtualization --- with residency, tiering, leases and faults as kernel concepts. It is a new Rust kernel, not a Linux derivative, and boots in a VM under QEMU on arm64.

The repo keeps `docs/status.md` as ground truth: "If it is not in this file, it does not work." Today:

| Gate | State |
|------|-------|
| G1 --- it boots, reaches a shell | done |
| G2 --- it holds an object table | not started |
| G3 --- it faults | not started |
| G4 --- known-next-use beats LRU | not started |
| G5 --- one read serves N sessions | not started |
| G6 --- degrades instead of dying | not started |
| G7 --- touches a real GPU | not started |
| G8 --- ML-MMU emulated | not started |

It boots and gives you a shell called `mlsh`. Milestone M0 is complete, M1 is 17 of 18 steps with one parked, and M2 --- the object table --- is where the ML content starts and has not begun. Everything described above is architecture, not code.

**Next:** M2, the object table.

</div>


## emufpga

Inference treats large immutable weight matrices as though they need general-purpose random-access memory, even though the dominant operation traverses them in a fully predictable order.

[**emufpga**](https://github.com/sw-ml-study/emufpga) explores the inversion, called a Serial Parameter Machine: put the weights in cheap sequential storage, move compute to the weight stream, and keep only activations, accumulators, scales and recurrent state in fast memory. Arrange the weights physically in the order the tensor engine consumes them, then start a scan; when the stream reaches the end of the layer, the matrix operation is finished.

The goal is not speed. It is doing more with less at equal correctness --- less VRAM, less system RAM, older and cheaper hardware, fewer kWh. Measured on a 135M model: streaming holds **4 KiB** of weights resident instead of 269 MB, gives bit-exact answers against a CPU reference, and serves five clients asking five different questions off one pass of the weights. Projected onto a 300 GB mixture-of-experts model, that is roughly 1.4 GB of RAM for five clients rather than 300 GB of VRAM.

What emufpga is: a conceptual, cycle-approximate model of an SPM streaming tensor engine, calibrated to the Gowin parts on Sipeed Tang Nano boards. It answers whether a configuration is correct, bit-exact against a CPU reference over identical golden vectors, and where the pipeline stalls --- whether the datapath starves on the parameter stream or the stream backs up on the datapath.

What it is not: a gate-level or bitstream-accurate Gowin simulator. It emits no HDL and does not predict whether a design fits a given part --- no LUT budgets, no utilization percentages, no place-and-route predictions. A resource-and-fit report was planned and withdrawn for that reason. RTL is written by hand later and validated against the golden vectors this repo produces.

It runs in a browser: paste `for-mlpl-playground-editor/serial-parameter-machine.mlpl` into the [sw-MLPL playground](https://sw-ml-study.github.io/sw-mlpl/), where each claim is either computed live or measured on a real model.

**Next:** hand-written RTL validated against the golden vectors on a Tang Nano.
